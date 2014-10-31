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
    this.add = function(name) {
        this.transationCounter++;
        console.log("TC-ADD:" + name + " ink. TC: " + this.transationCounter);
    }

    this.success = function(obj, name) {
        this.transationCounter--;

        if(obj != undefined) {
            this.response.push(obj);
        }

        if(this.transationCounter === 0) {
            console.log("TC-SUCCESS-EXIT:" + name +" dec. TC:" + this.transationCounter);
            this.success = function() {};
            this.onSuccess(this.response);
        } else {
            console.log("TC-SUCCESS:" + name + " dec. TC:" + this.transationCounter);
        }
    }

    this.fail = function(error, obj, name) {
        this.error = error;
        this.onSuccess = function() {};
        console.log("TC-FAIL:" + name + "TC FAIL:" + this.transationCounter);
        this.onFail(error, obj);
    }
}





