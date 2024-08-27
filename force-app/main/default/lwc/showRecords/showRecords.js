import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

 //if we use field reference import schema object

// import BOOK_NAME from '@salesforce/schema/Book__c.BookName__c'
// import BOOK_NUMBER from '@salesforce/schema/Book__c.Name'
// import BOOK_PRICE from '@salesforce/schema/Book__c.Book_Price__c'



export default class ShowRecords extends LightningElement {
    @api recordId;
     // using object fields
    @wire(getRecord, {recordId: "$recordId", fields : ['Book__c.BookName__c','Book__c.Name','Book__c.Book_Price__c']})

    //with field reference

    // @wire(getRecord, {recordId: "$recordId", fields : [BOOK_NAME,BOOK_NUMBER,BOOK_PRICE]})
   
    books;

    get bookName() {
        //return getFieldValue(this.books.data, BOOK_NAME);

        return getFieldValue(this.books.data, 'Book__c.BookName__c');
        
    }
    get bookNumber() {
        // return getFieldValue(this.books.data, BOOK_NUMBER);
        
        //return getFieldValue(this.books.data, 'Book__c.Name');
        return this.books.data.fields.Name.value;
    }
    get bookPrice() {
        //return getFieldValue(this.books.data, BOOK_PRICE);

        //return getFieldValue(this.books.data, 'Book__c.Book_Price__c');
        
        //check data or error

        return this.books.data ? getFieldValue(this.books.data, 'Book__c.Book_Price__c'): '';
         

       
    }

    
}