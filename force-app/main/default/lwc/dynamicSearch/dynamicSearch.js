import { LightningElement, track, api } from 'lwc';
import searchAcrossLimitedObjects from '@salesforce/apex/DynamicSearchController.searchAcrossLimitedObjects';
import { NavigationMixin } from 'lightning/navigation';

export default class DynamicSearch extends NavigationMixin(LightningElement) {
    @api searchTerm = '';
    @track searchResults = [];
    @track error;
    @track isSearchDone = false; // Track whether the search has been executed

    // Define columns for data table
    columns = [
        { label: 'Object Type', fieldName: 'objectType' },
        { label: 'Record ID', fieldName: 'recordId' },
        {
            label: 'Name',
            fieldName: 'recordLink', // This field will be used to store the link URL
            type: 'url',
            typeAttributes: {
                label: { fieldName: 'name' }, // Display name
                target: '_self' // Open link in the same tab
            }
        }
    ];

    handleSearch() {
        if (this.searchTerm) {
            searchAcrossLimitedObjects({ searchTerm: this.searchTerm })
                .then(result => {
                    this.searchResults = result.records.map(record => {
                        return {
                            ...record,
                            recordLink: `/lightning/r/${record.recordId}/view` // Construct the URL for record detail
                        };
                    });
                    this.error = undefined;
                    this.isSearchDone = true; // Set search completion flag to true
                })
                .catch(error => {
                    this.error = error.body.message || 'An error occurred while searching.';
                    this.searchResults = [];
                    this.isSearchDone = true; // Set search completion flag to true even if error
                });
        } else {
            this.error = 'Search term must be specified.';
            this.searchResults = [];
            this.isSearchDone = true; // Set search completion flag to true
        }
    }

    handleInputChange(event) {
        this.searchTerm = event.target.value;
    }
}