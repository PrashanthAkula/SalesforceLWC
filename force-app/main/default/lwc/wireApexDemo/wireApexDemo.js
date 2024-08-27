import { LightningElement, api, wire } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';
import { getRecord } from 'lightning/uiRecordApi';

export default class WireApexDemo extends LightningElement {
    @api recordId;

    @wire(getRecord, {recordId: '$recordId', fields: 'Account.Name'})
    record; //property will have data and error

    @wire(getContactList, {accId: '$recordId'})
    contacts; //property will have data and error
    //WContact({error, data}){
       // this.Contacts = data;
       // this.error= undefined;
    //}

    get name(){
        return this.record.data.fields.Name.value;
    }

}