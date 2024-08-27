@RestResource(urlMapping='/AccountAPI/*')
global with sharing class AccountResource {

    // Get Method
    @HTTPGet
    global static List<Account> getAccountIdAndNames() {
        // Initializing the request parameter with the incoming request
        RestRequest accountRequest = RestContext.request;
        // Getting the request URI
        String accountRequestURI = accountRequest.requestURI;
        // Getting the limit from the request URI
        Integer accountLimit = Integer.valueOf(accountRequestURI.substring(accountRequestURI.lastIndexOf('/') + 1));
        // Querying contacts
        List<Account> accountList = [SELECT Id, Name FROM Account WITH SECURITY_ENFORCED LIMIT :accountLimit];
        // Returning the contacts in the response
        return accountList;
    }

    @HTTPPost
    global static Account createNewAcount(String Name){
        Account acc = new Account();
        acc.Name = name;
        
        if(Schema.sObjectType.Account.fields.Name.isCreateable()){
            insert acc;
        }
        
        return acc;


    }


}