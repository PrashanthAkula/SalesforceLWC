import { LightningElement, api, track, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

export default class RecordForm extends LightningElement {
    @api objectApiName;
    @track fields = [];
    @track objectLabel;

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    objectInfo({ data, error }) {
        if (data) {
            console.log('Object Info Data:', data); // Debugging line

            this.objectLabel = data.label;

            // Define custom fields for specific objects
            const customFields = {
                Account: ['Name', 'Phone', 'AccountNumber'],
                Contact: ['FirstName', 'LastName', 'Phone'],
                Opportunity: ['Name', 'StageName', 'CloseDate'],
                Book__c: ['BookName__c', 'Book_Price__c', 'Student__c'],
                Book_History__c: ['Issued_Date__c', 'Return_Date__c', 'Book__c'],
                Student__c: ['Name', 'Student_Email__c']
                // Add other custom fields for different objects if needed
            };

            // Safeguard for missing fields data
            const allFields = data.fields || {};
            const requiredFields = customFields[this.objectApiName] || Object.keys(allFields).filter(fieldApiName => allFields[fieldApiName] && allFields[fieldApiName].required);

            // Filter fields to include only those specified
            this.fields = requiredFields.map(fieldApiName => {
                const field = allFields[fieldApiName];
                return {
                    fieldApiName,
                    label: field ? field.label : 'Unknown', // Fallback label
                    type: field ? field.type : 'text' // Fallback type
                };
            });
        } else if (error) {
            console.error('Error fetching object info:', error);
        }
    }

    handleSuccess() {
        this.dispatchEvent(new CustomEvent('recordcreated'));
    }

    handleSubmit(event) {
        event.preventDefault();
        this.template.querySelector('lightning-record-edit-form').submit();
    }
}