import { LightningElement,api } from 'lwc';

export default class UseGetterSetter extends LightningElement {
    upperCaseditem='value';
    @api
    get itemName(){

        return this.upperCaseditem;
    }

    set itemName(value){
        this.upperCaseditem=value.toUpperCase();
    }
}