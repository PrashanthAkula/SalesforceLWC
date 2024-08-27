import { LightningElement, wire, api } from 'lwc';
import getContactList from '@salesforce/apex/CotactController.getContactList';
import{refreshApex} from '@salesforce/apex';
import{updateRecord} from 'lightning/RecordApi';

export default class ContactDetails extends LightningElement {
    @api recordId;

    @wire(getContactList,{accIds:'$recordId'})
    contacts;


}