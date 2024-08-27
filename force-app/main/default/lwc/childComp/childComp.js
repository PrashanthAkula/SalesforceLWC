import { LightningElement, api, track } from 'lwc';

export default class ChildComp extends LightningElement {
@track Message;
    @api
    changeMessage(strString) {
         this.Message = strString.toUpperCase();
    }
}