public with sharing class RecordCreatorController {
    @AuraEnabled(cacheable=true)
    public static List<ObjectOption> getObjectOptions() {
        return new List<ObjectOption>{
            new ObjectOption('Account', 'Account'),
            new ObjectOption('Contact', 'Contact'),
            new ObjectOption('Opportunity', 'Opportunity'),
            new ObjectOption('Book__c', 'Book__c'),
            new ObjectOption('Student__c', 'Student__c'),
            new ObjectOption('Book_History__c', 'Book_History__c')
        };
    }

    public class ObjectOption {
        @AuraEnabled public String label { get; set; }
        @AuraEnabled public String apiName { get; set; }

        public ObjectOption(String label, String apiName) {
            this.label = label;
            this.apiName = apiName;
        }
    }
}
