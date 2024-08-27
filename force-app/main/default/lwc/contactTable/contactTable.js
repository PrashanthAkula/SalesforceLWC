import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getContacts from '@salesforce/apex/ContactController.getContactList';

// Define columns for the datatable
const COLUMNS = [
    { label: 'Name', fieldName: 'contactUrl', type: 'url', 
      typeAttributes: { label: { fieldName: 'Name' }, target: '_self' }},
    { label: 'Email', fieldName: 'Email', type: 'email' },
    { label: 'Account Name', fieldName: 'AccountName', type: 'text' },
    { label: 'Created Date', fieldName: 'CreatedDate', type: 'date', 
      typeAttributes: { year: 'numeric', month: 'short', day: '2-digit' }}
];

export default class contactTable extends NavigationMixin(LightningElement) {
    columns = COLUMNS;
    contacts = [];
    error;

    @wire(getContacts)
    wiredContacts({ error, data }) {
        if (data) {
            this.contacts = data.map(contact => ({
                ...contact,
                AccountName: contact.Account ? contact.Account.Name : '',
                contactUrl: `/lightning/r/Contact/${contact.Id}/view`
            }));
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.contacts = [];
        }
    }

    handleRowAction(event) {
        const row = event.detail.row;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: row.Id,
                objectApiName: 'Contact',
                actionName: 'view'
            }
        });
    }
}
