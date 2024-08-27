import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import updateAccounts from '@salesforce/apex/AccountController.updateAccounts';
import getPicklistValues from '@salesforce/apex/AccountController.getPicklistValues';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
 
export default class ListAccounts extends NavigationMixin(LightningElement) {
    @track accounts = [];
    @track picklistOptions = [];
    @track editedFields = {};
    @track editModeId = null;
    error;
 
    @wire(getAccounts)
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data.map(account => ({
                ...account,
                accountUrl: `/lightning/r/Account/${account.Id}/view`,
                isEditMode: this.editModeId === account.Id
            }));
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.accounts = [];
        }
    }
 
    @wire(getPicklistValues)
    wiredPicklistValues({ error, data }) {
        if (data) {
            this.picklistOptions = data.map(option => ({
                label: option.label,
                value: option.value
            }));
        } else if (error) {
            this.error = error;
        }
    }
 
    handleInputChange(event) {
        const { name, value, dataset } = event.target;
        const { id } = dataset;
 
        if (!this.editedFields[id]) {
            this.editedFields[id] = {};
        }
        this.editedFields[id][name] = value;
    }
 
    handleEdit(event) {
        const accountId = event.target.dataset.id;
        this.editModeId = accountId;
        //this.refreshData(); // Refresh to reflect edit mode
        this.accounts = this.accounts.map(account => ({
            ...account,
            isEditMode: account.Id === this.editModeId
        }));
    }
 
    handleSave() {
        const accountsToUpdate = Object.keys(this.editedFields).map(id => {
            const fields = this.editedFields[id];
            return { Id: id, ...fields };
        });
 
        updateAccounts({ accountsToUpdate })
            .then(() => {
                this.showToast('Success', 'Records updated successfully', 'success');
 
                // Immediately reflect the changes
                this.accounts = this.accounts.map(account => {
                    if (this.editedFields[account.Id]) {
                        return {
                            ...account,
                            ...this.editedFields[account.Id]
                        };
                    }
                    return account;
                });
 
                // Clear edited fields and exit edit mode
                this.editedFields = {};
                this.editModeId = null; // Exit edit mode
 
                // Update accounts with current edit mode state
                this.accounts = this.accounts.map(account => ({
                    ...account,
                    isEditMode: false
                }));
            })
            .catch(error => {
                this.showToast('Error updating records', error.body.message, 'error');
            });
    }
 
    handleRowAction(event) {
        const rowId = event.target.dataset.id;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: rowId,
                objectApiName: 'Account',
                actionName: 'view'
            }
        });
    }
 
    refreshData() {
        return getAccounts()
            .then(result => {
                this.accounts = result.map(account => ({
                    ...account,
                    accountUrl: `/lightning/r/Account/${account.Id}/view`,
                    isEditMode: this.editModeId === account.Id
                }));
            })
            .catch(error => {
                this.error = error;
            });
    }
 
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event);
    }
}
