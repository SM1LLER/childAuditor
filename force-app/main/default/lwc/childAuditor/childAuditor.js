import { LightningElement, api, track} from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getChildsToCountMap from '@salesforce/apex/ChildAuditorController.getChildsToCountMap';
export default class ChildAuditor extends LightningElement {
    @api recordId;
    
    @track childWithCountStrings = [];
    
    connectedCallback(){
        this.updateChildsWithCount();
    }

    refreshClick(event){
        this.updateChildsWithCount();
    }

    updateChildsWithCount(){
        this.childWithCountStrings = [];
        getChildsToCountMap({
            recordId: this.recordId
        })
            .then(childToCountMap => {
                refreshApex(childToCountMap);
                var conts = childToCountMap;
                var num = 0;
                for(var key in conts){
                    var value = conts[key];
                    if (value > 0){
                        num++;
                        if (value == 1){
                            var ending = 'record';
                        } else {
                            var ending = 'records';
                        }
                        var childWithCount = num + '. ' + key + ' - ' + value + ' ' + ending;
                        this.childWithCountStrings.push(childWithCount);
                    }
                }
            }).catch(error => {
                window.console.log(error);
            });
    }
}