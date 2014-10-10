/**
 * Created by samschmid on 10.10.14.
 */


module.exports = Transaction;

function Transaction() {
    this.transationCounter = 0;
    this.error = null;
    this.onSuccess = undefined;
    this.onFail = undefined;
    this.response = [];
    this.add = function() {
        this.transationCounter++;
        console.log("Ink TC:" + this.transationCounter);
    }

    this.success = function(obj) {
        this.transationCounter--;

        if(obj != undefined) {
            this.response.push(obj);
        }

        if(this.transationCounter === 0) {
            console.log("Dec TC:" + this.transationCounter);
            this.success = function() {};
            this.onSuccess(this.response);
        } else {
            console.log("Dec TC:" + this.transationCounter);
        }
    }

    this.fail = function(error, obj) {
        this.error = error;
        this.onSuccess = function() {};
        console.log("TC FAIL:" + this.transationCounter);
        this.onFail(error, obj);
    }
}





