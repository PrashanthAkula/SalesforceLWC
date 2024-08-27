import { LightningElement } from 'lwc';

export default class DataBinding extends LightningElement {
   greeting = 'prashanth';

   handleClick(event){
        this.greeting = this.template.querySelector("lightning-input").value;
   }
    
    
}