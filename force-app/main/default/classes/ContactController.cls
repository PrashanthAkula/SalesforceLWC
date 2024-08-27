public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    
        public static List<Contact> getContactList() {
       // return [SELECT AccountId, Id, FirstName, LastName FROM Contact WHERE AccountId =: accId 
        //WITH SECURITY_ENFORCED];
         return [SELECT Id, Name, Email, Account.Name, CreatedDate FROM Contact];
        // List<Map<String, String>> result = new List<Map<String, String>>();

        // for (Contact contact : contacts) {
        //     result.add(new Map<String, String>{
        //         'Id' => contact.Id,
        //         'Name' => contact.Name,
        //         'Email' => contact.Email,
        //         'AccountName' => contact.Account.Name,
        //         'CreatedDate' => contact.CreatedDate.format()
        //     });
        // }
        // return result;
    }
}