public with sharing class AccountController {

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [SELECT Id, Name, AnnualRevenue, Type, BillingCity FROM Account WITH SECURITY_ENFORCED];
    }

    @AuraEnabled
    public static void updateAccounts(List<Account> accountsToUpdate) {
        update accountsToUpdate;
    }

    @AuraEnabled(cacheable=true)
    public static List<PicklistOption> getPicklistValues() {
        List<PicklistOption> options = new List<PicklistOption>();
        Schema.DescribeFieldResult fieldResult = Account.Type.getDescribe();
        List<Schema.PicklistEntry> picklistEntries = fieldResult.getPicklistValues();
        
        for (Schema.PicklistEntry entry : picklistEntries) {
            options.add(new PicklistOption(entry.getValue(), entry.getLabel()));
        }
        
        return options;
    }
}