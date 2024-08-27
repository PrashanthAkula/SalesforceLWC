import { LightningElement, track } from 'lwc';
import getAccounts from '@salesforce/apex/AccController.getAccounts';
import createAccount from '@salesforce/apex/AccController.createAccount';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const COLUMNS = [
    { label: 'Account Name', fieldName: 'Name' },
    { label: 'Account Number', fieldName: 'AccountNumber' },
    { label: 'Phone', fieldName: 'Phone' },
];

export default class AccountCard extends LightningElement {
    @track accounts = [];
    @track columns = COLUMNS;
    @track isNoData = false;
    @track isModalOpen = false;
    @track showTable = false;

    accountName = '';
    accountNumber = '';
    phone = '';

    handleShowAccounts() {
        getAccounts()
            .then(result => {
                this.accounts = result;
                this.isNoData = this.accounts.length === 0;
                this.showTable = true;  // Show the table
                this.isModalOpen = false; // Ensure modal is hidden
            })
            .catch(error => {
                console.error('Error fetching accounts:', error);
                this.showToast('Error', 'Unable to fetch accounts.', 'error');
            });
    }

    toggleModalVisibility() {
        this.isModalOpen = !this.isModalOpen;
        this.showTable = false; // Hide the table when modal is open
    }

    handleInputChange(event) {
        const field = event.target.dataset.id;
        if (field === 'name') {
            this.accountName = event.target.value;
        } else if (field === 'accountNumber') {
            this.accountNumber = event.target.value;
        } else if (field === 'phone') {
            this.phone = event.target.value;
        }
    }

    handleSave() {
        createAccount({ 
            name: this.accountName, 
            accountNumber: this.accountNumber, 
            phone: this.phone 
        })
        .then(() => {
            // Close the modal after saving
            this.isModalOpen = false;

            this.showToast('Success', 'Account created successfully. Click "Show Accounts" to view.', 'success');
        })
        .catch(error => {
            console.error('Error creating account:', error);
            this.showToast('Error', 'Account creation failed.', 'error');
        });
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}
