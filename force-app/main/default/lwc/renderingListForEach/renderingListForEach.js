import Title from '@salesforce/schema/Contact.Title';
import { LightningElement } from 'lwc';

export default class RenderingListForEach extends LightningElement {
    contacts=[
        {
            id: 1,
            Name: 'JaiSriram',
            Title: 'God',
        },
        {
            id: 2,
            Name: 'Sudhakar',
            Title: 'Manager',
        },
        {
            id: 3,
            Name: 'Sudhakar',
            Title: 'Manager',
        

        },

    ];
}