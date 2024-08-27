    import { LightningElement } from 'lwc';

    export default class LifecycleHooks extends LightningElement {
        myList=[];
        constructor(){
            super();
            console.log("constructor");
        }
        
            connectedCallback() {
                this.myList.push("Salesforce");
                console.log("connectedcallback");

            }
            disconnectedCallback() {
                this.myList = [];
                console.log("disconn+this.myList.isConnectedectedCallback");
            }

            renderedCallback(){
                console.log('renderedcallback');
            }
            errorCallback(error){
                console.log('errorcallback'+error);
            }
     
    
}