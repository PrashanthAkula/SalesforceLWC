public class PicklistOption {
    @AuraEnabled public String value { get; set; }
    @AuraEnabled public String label { get; set; }
    
    public PicklistOption(String value, String label) {
        this.value = value;
        this.label = label;
    }
}
