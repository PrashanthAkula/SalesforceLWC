import { LightningElement , api} from 'lwc';

export default class ChildComponent extends LightningElement {
    //privateProperty
    @api firstName = 'Prashanth';
}   