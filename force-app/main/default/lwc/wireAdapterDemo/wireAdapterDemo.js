import { LightningElement,api,wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
//import reference fields

//import NAME_FIELD from '@salesforce/schema/Account.Name';
//import PHONE_FIELD from '@salesforce/schema/Account.Phone';

const FIELDS=[
    'Account.Name',
    'Account.Phone'
]
export default class WireAdapterDemo extends LightningElement {
    @api recordId;
    @wire(getRecord, {recordId: '$recordId', fields:FIELDS})
    record; // data and error

    get name(){
        //return this.record.data ? getFieldValue(this.record.data, 'Account.Name'): '';
        return this.record.data.fields.Name.value;

    }
    // ? turnery operator check data or error
    get phone(){
        //return this.record.data ? getFieldValue(this.record.data, 'Account.Phone'): '';
        return this.record.data.fields.Phone.value;

    }

}