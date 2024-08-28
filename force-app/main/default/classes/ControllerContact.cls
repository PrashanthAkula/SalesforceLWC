public with sharing class ControllerContact {

    // Define a custom wrapper class to return label and value
    public class AccountOption {
        @AuraEnabled public String label { get; set; }
        @AuraEnabled public String value { get; set; }
        
        public AccountOption(String label, String value) {
            this.label = label;
            this.value = value;
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<AccountOption> getAccountOptions(String searchKey) {
        List<AccountOption> options = new List<AccountOption>();

        List<Account> accounts = [
            SELECT Id, Name 
            FROM Account 
            WHERE Name LIKE :searchKey 
            ORDER BY Name
        ];
        
        for (Account acc : accounts) {
            options.add(new AccountOption(acc.Name, acc.Id));
        }

        return options;
    }

    @AuraEnabled(cacheable=true)
    public static String getAccountName(Id accountId) {
        Account acc = [SELECT Name FROM Account WHERE Id = :accountId LIMIT 1];
        return acc.Name;
    }

    @AuraEnabled
    public static void saveContact(String firstName, String lastName, String mobile, String phone, Id accountId) {
        Contact newContact = new Contact(
            FirstName = firstName,
            LastName = lastName,
            MobilePhone = mobile,
            Phone = phone,
            AccountId = accountId
        );
        insert newContact;
    }
}
