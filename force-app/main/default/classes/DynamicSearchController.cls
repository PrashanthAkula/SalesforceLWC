public with sharing class DynamicSearchController {
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> searchAcrossLimitedObjects(String searchTerm) {
        Map<String, Object> result = new Map<String, Object>();
        List<Map<String, Object>> allRecords = new List<Map<String, Object>>();

        // Define a limited set of objects to search
        List<String> objectNames = new List<String>{'Account', 'Contact', 'Opportunity'}; // Adjust as necessary

        for (String objectName : objectNames) {
            Schema.SObjectType sObjectType = Schema.getGlobalDescribe().get(objectName);
            Schema.DescribeSObjectResult describeResult = sObjectType.getDescribe();
            
            if (describeResult.fields.getMap().containsKey('Name')) {
                String soqlQuery = 'SELECT Id, Name FROM ' + objectName + ' WHERE Name LIKE \'%' + searchTerm + '%\'';
                
                try {
                    List<SObject> records = Database.query(soqlQuery);
                    
                    for (SObject record : records) {
                        Map<String, Object> recordMap = new Map<String, Object>();
                        recordMap.put('objectType', objectName);
                        recordMap.put('recordId', record.get('Id'));
                        recordMap.put('name', record.get('Name'));
                        allRecords.add(recordMap);
                    }
                } catch (Exception e) {
                    System.debug('Error querying ' + objectName + ': ' + e.getMessage());
                }
            }
        }

        result.put('records', allRecords);

        return result;
    }
}