import { LightningElement, track } from 'lwc';
import getAccounts from '@salesforce/apex/AccController.getAccounts';
import createAccount from '@salesforce/apex/AccController.createAccount';
import getPartnerLevels from '@salesforce/apex/AccController.getPartnerLevels';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const COLUMNS = [
    { label: 'Account Name', fieldName: 'Name' },
    // { label: 'Account Number', fieldName: 'AccountNumber' },
    // { label: 'Phone', fieldName: 'Phone' },
    { label: 'Partner Level', fieldName: 'Partner_Level__c' },
    { label: 'Total Salary', fieldName: 'Total_Salary__c', type: 'currency' },
];

export default class AccCustomobj extends LightningElement {
    @track accounts = [];
    @track columns = COLUMNS;
    @track isNoData = false;
    @track isModalOpen = false;
    @track showTable = false;

    @track partnerLevelOptions = [];
    @track accountName = '';
    // @track accountNumber = '';
    // @track phone = '';
    @track partnerLevel = '';
    @track totalSalary = '';

    buttonLabel = 'Show Accounts'; // Default button label

    connectedCallback() {
        this.loadPartnerLevels();
    }

    loadPartnerLevels() {
        getPartnerLevels()
            .then(result => {
                this.partnerLevelOptions = result.map(option => ({
                    label: option.label,
                    value: option.value
                }));
            })
            .catch(error => {
                console.error('Error fetching partner levels:', error);
                this.showToast('Error', 'Unable to fetch partner levels.', 'error');
            });
    }

    handleShowAccounts() {
        if (this.showTable) {
            // If the table is already shown, hide it
            this.showTable = false;
            this.buttonLabel = 'Show Accounts'; // Update button label
        } else {
            // Show the table
            getAccounts()
                .then(result => {
                    this.accounts = result;
                    this.isNoData = this.accounts.length === 0;
                    this.showTable = true;
                    this.buttonLabel = 'Hide Accounts'; // Update button label
                })
                .catch(error => {
                    console.error('Error fetching accounts:', error);
                    this.showToast('Error', 'Unable to fetch accounts.', 'error');
                });
        }
    }

    toggleModalVisibility() {
        this.isModalOpen = !this.isModalOpen;
        this.showTable = false; 
        this.buttonLabel = 'Show Accounts'; // Reset button label when modal is open
    }

    handleInputChange(event) {
        const field = event.target.dataset.id;
        if (field === 'name') {
            this.accountName = event.target.value;
        // } else if (field === 'accountNumber') {
        //     this.accountNumber = event.target.value;
        // } else if (field === 'phone') {
        //     this.phone = event.target.value;
        } else if (field === 'partnerLevel') {
            this.partnerLevel = event.target.value;
        } else if (field === 'totalSalary') {
            this.totalSalary = event.target.value;
        }
    }

    handleSave() {
        createAccount({ 
            name: this.accountName, 
            accountNumber: this.accountNumber, 
            phone: this.phone, 
            partnerLevel: this.partnerLevel,
            totalSalary: parseFloat(this.totalSalary)
        })
        .then(() => {
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