import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import getAccounts from '@salesforce/apex/AccountController.getAccounts';


const COLUMNS = [
    
    { label: 'Name', fieldName: 'Name' },
    { label: 'Revenue', fieldName: 'AnnualRevenue', type: 'currency' },
    { label: 'Type', fieldName: 'Type' },
    { label: 'City', fieldName: 'BillingCity' }
];
export default class accountTable extends LightningElement { @track accounts = [];
    columns = COLUMNS;
    @track isLoading = false;
    @track hasMoreRecords = true;
    pageSize = 10;
    offset = 0;

    connectedCallback() {
        
        this.loadMoreAccounts();
        
    }

    loadMoreAccounts() {
        if (this.isLoading || !this.hasMoreRecords) return;

        this.isLoading = true;
        getAccounts({ limitSize: this.pageSize, offsetSize: this.offset })
            .then(result => {
                if (result.length === 0) {
                    this.hasMoreRecords = false;
                } else {
                    this.accounts = [...this.accounts, ...result];
                    this.offset += this.pageSize;
                    

                }
                
                
            })
            .catch(error => {
                console.error('Error retrieving accounts:', error);
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    handleScroll(event) {
        const bottom = event.target.scrollHeight === event.target.scrollTop + event.target.clientHeight;
        if (bottom && this.hasMoreRecords && !this.isLoading) {
            this.loadMoreAccounts();
        }
    }
    
    
}