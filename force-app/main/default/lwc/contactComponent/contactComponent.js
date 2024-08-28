import { LightningElement, api, track, wire } from 'lwc';
import { getRecord, refreshApex } from 'lightning/uiRecordApi';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import CONTACT_FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import CONTACT_LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import CONTACT_MOBILEPHONE_FIELD from '@salesforce/schema/Contact.MobilePhone';
import CONTACT_PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import CONTACT_ACCOUNT_FIELD from '@salesforce/schema/Contact.AccountId';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import ACCOUNT_ID_FIELD from '@salesforce/schema/Account.Id';
import { getListUi } from 'lightning/uiListApi'; // Ensure correct import

// Define constants
const ACCOUNT_FIELDS = [ACCOUNT_NAME_FIELD, ACCOUNT_ID_FIELD];

export default class ContactComponent extends LightningElement {
    @api recordId; // Account Id for the Record Page
    @track isModalOpen = false;
    @track firstName = '';
    @track lastName = '';
    @track mobile = '';
    @track phone = '';
    @track accountId = ''; // Holds the Account ID for Account Record Page
    @track accountOptions = [];
    @track accountName = ''; // For displaying account name on record page
    @track isRecordPage = false;
    buttonLabel = 'New Contact';
    modalTitle = 'New Contact';
    wiredAccountListResult; // Used to store the result of the account list wire service

    @wire(getRecord, { recordId: '$recordId', fields: ACCOUNT_FIELDS })
    accountRecord(result) {
        this.wiredAccountListResult = result; // Store the result for later use
        if (result.data) {
            this.accountId = result.data.fields.Id.value;
            this.accountName = result.data.fields.Name.value;
            this.isRecordPage = true;
        } else if (result.error) {
            console.error('Error fetching account record:', result.error);
        }
    }

    @wire(getListUi, {
        objectApiName: 'Account',
        listViewApiName: 'AllAccounts',
        pageSize: 100
    })
    accountList(result) {
        this.wiredAccountListResult = result; // Store the result for later use
        if (result.data) {
            this.accountOptions = result.data.records.records.map(account => ({
                label: account.fields.Name.value,
                value: account.id
            }));
        } else if (result.error) {
            console.error('Error fetching account options:', result.error);
        }
    }

    connectedCallback() {
        if (this.recordId) {
            this.buttonLabel = 'Add Contact';
            this.modalTitle = 'Add Contact';
            this.isRecordPage = true;
        } else {
            this.buttonLabel = 'New Contact';
            this.modalTitle = 'New Contact';
            this.isRecordPage = false;
            this.fetchAccountOptions();
        }
    }

    fetchAccountOptions() {
        if (this.wiredAccountListResult.data) {
            this.accountOptions = this.wiredAccountListResult.data.records.records.map(account => ({
                label: account.fields.Name.value,
                value: account.id
            }));
        } else if (this.wiredAccountListResult.error) {
            console.error('Error fetching account options:', this.wiredAccountListResult.error);
        }
    }

    handleButtonClick() {
        this.isModalOpen = true;
    }

    handleCloseModal() {
        this.isModalOpen = false;
    }

    handleInputChange(event) {
        const field = event.target.dataset.id;
        const value = event.target.value;
        if (field === 'firstName') {
            this.firstName = value;
        } else if (field === 'lastName') {
            this.lastName = value;
        } else if (field === 'mobilePhone') {
            this.mobile = value;
        } else if (field === 'phone') {
            this.phone = value;
        } else if (field === 'accountId') {
            this.accountId = value;
        }
    }

    async handleSave() {
        if (this.isRecordPage && this.accountId !== this.recordId) {
            this.showToast('Error', 'Account cannot be changed on the Record Page.', 'error');
            return;
        }

        if (!this.lastName) {
            this.showToast('Error', 'Last Name is required.', 'error');
            return;
        }

        const fields = {
            [CONTACT_FIRSTNAME_FIELD.fieldApiName]: this.firstName,
            [CONTACT_LASTNAME_FIELD.fieldApiName]: this.lastName,
            [CONTACT_MOBILEPHONE_FIELD.fieldApiName]: this.mobile,
            [CONTACT_PHONE_FIELD.fieldApiName]: this.phone,
            [CONTACT_ACCOUNT_FIELD.fieldApiName]: this.accountId
        };

        const recordInput = { apiName: CONTACT_OBJECT.objectApiName, fields };

        try {
            await createRecord(recordInput);
            this.showToast('Success', 'Contact saved successfully.', 'success');
            this.handleCloseModal();

            // Refresh the page data
            if (this.isRecordPage) {
                await refreshApex(this.wiredAccountListResult);
            } else {
                // Refresh the account list if not on record page
                await refreshApex(this.wiredAccountListResult);
            }
        } catch (error) {
        }
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant,
            })
        );
    }
}
