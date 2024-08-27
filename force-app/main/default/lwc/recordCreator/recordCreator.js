import { LightningElement, track, api, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

// Custom mapping of API names to display labels
const OBJECT_LABELS = {
    'Account': 'Account',
    'Contact': 'Contact',
    'Opportunity': 'Opportunity',
    'Book__c': 'Book',
    'Book_History__c': 'Book History',
    'Student__c': 'Student'
};

export default class RecordCreator extends LightningElement {
    @track selectedObject = '';
    @track showModal = false;
    @track objectOptions = [];
    @track fields = [];
    @track objectLabel;

    // List of API names
    objectApiNames = Object.keys(OBJECT_LABELS);

    @wire(getObjectInfo, { objectApiName: '$selectedObject' })
    objectInfo({ data, error }) {
        if (data) {
            this.objectLabel = data.label;

            const customFields = {
                Account: ['Name', 'Phone', 'AccountNumber'],
                Contact: ['FirstName', 'LastName', 'Phone'],
                Opportunity: ['Name', 'StageName', 'CloseDate'],
                Book__c: ['BookName__c', 'Book_Price__c', 'Student__c'],
                Book_History__c: ['Issued_Date__c', 'Return_Date__c', 'Book__c'],
                Student__c: ['Name', 'Student_Email__c']
            };

            const allFields = data.fields || {};
            const requiredFields = customFields[this.selectedObject] || 
                                  Object.keys(allFields).filter(fieldApiName => allFields[fieldApiName] && allFields[fieldApiName].required);

            const uniqueFieldApiNames = [...new Set(requiredFields)];

            this.fields = uniqueFieldApiNames.map(fieldApiName => {
                const field = allFields[fieldApiName];
                return {
                    fieldApiName,
                    label: field ? field.label : 'Unknown',
                    type: field ? field.type : 'text'
                };
            });
        } else if (error) {
            console.error('Error fetching object info:', error);
        }
    }

    connectedCallback() {
        this.objectOptions = this.objectApiNames.map(apiName => ({
            label: OBJECT_LABELS[apiName] || apiName,  // Use custom label if available, otherwise fallback to API name
            value: apiName
        }));
    }

    handleObjectChange(event) {
        this.selectedObject = event.detail.value;
        this.showModal = true;
    }

    handleModalClose() {
        this.showModal = false;
        this.selectedObject = '';
    }

    handleRecordCreated() {
        this.handleModalClose();
    }
}
