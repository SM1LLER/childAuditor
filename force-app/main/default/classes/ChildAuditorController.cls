public with sharing class ChildAuditorController {
    @AuraEnabled(cacheable=true)
    public static Map<String, Integer> getChildsToCountMap(Id recordId){
        Id idToProccess = recordId;
        List<Schema.ChildRelationship> childRelationships= idToProccess.getSObjectType()
                                                    					.getDescribe()
            															.getChildRelationships();
        Map<String, Integer> childsToCountMap = new Map<String, Integer>();
        for(Schema.ChildRelationship childRel : childRelationships){
            String fieldName = childRel.getRelationshipName();
            Schema.DescribeSObjectResult childRelDescribe = childRel.getChildSObject().getDescribe();
            if(fieldName != null && childRelDescribe.isAccessible() && childRelDescribe.isQueryable()){
                String nameOfChild = childRelDescribe.getName();
            	String nameOfRefField = childRel.getField().getDescribe().getName();
            	List<SObject> childRecords = Database.query('SELECT Id FROM ' + nameOfChild + ' WHERE ' + nameOfRefField + ' =:idToProccess');
                childsToCountMap.put(fieldName, childRecords.size());
            }
        }
        return childsToCountMap;
    }
}