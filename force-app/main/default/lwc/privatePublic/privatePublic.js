import { LightningElement, api, wire } from 'lwc';

export default class PrivatePublic extends LightningElement {
    message = 'Private Property';
     @api recordId;
}