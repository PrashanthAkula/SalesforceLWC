// public with sharing class AccController {
//     @AuraEnabled(cacheable=true)
//     public static List<Account> getAccounts() {
//         return [SELECT Id, Name, AccountNumber, Phone FROM Account ORDER BY CreatedDate DESC LIMIT 100];
//     }

//     @AuraEnabled
//     public static Account createAccount(String name, String accountNumber, String phone) {
//         try {
//             Account newAccount = new Account(Name = name, AccountNumber = accountNumber, Phone = phone);
//             insert newAccount;
//             return newAccount;
//         } catch (Exception e) {
//             throw new AuraHandledException('Error creating account: ' + e.getMessage());
//         }
//     }
// }

public with sharing class AccController {
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [SELECT Id, Name, AccountNumber, Phone, Partner_Level__c, Total_Salary__c FROM Account ORDER BY CreatedDate DESC LIMIT 100];
    }
    
    @AuraEnabled
    public static void createAccount(String name, String accountNumber, String phone, String partnerLevel, Decimal totalSalary) {
        Account acc = new Account(
            Name = name,
            AccountNumber = accountNumber,
            Phone = phone,
            Partner_Level__c = partnerLevel,
            Total_Salary__c = totalSalary
        );
        insert acc;
    }
    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getPartnerLevels() {
        List<Map<String, String>> options = new List<Map<String, String>>();
        Schema.DescribeFieldResult fieldResult = Account.Partner_Level__c.getDescribe();
        List<Schema.PicklistEntry> picklistEntries = fieldResult.getPicklistValues();

        for (Schema.PicklistEntry entry : picklistEntries) {
            Map<String, String> option = new Map<String, String>();
            option.put('value', entry.getValue());
            option.put('label', entry.getLabel());
            options.add(option);
        }

        return options;
    }

}
