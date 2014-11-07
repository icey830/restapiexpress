/**
 * Created by Samuel Schmid on 10.10.14.
 *
 * This class provides a transaction for tasks
 *
 * @type {MongooseDocumentFinder}
 */

module.exports = Transaction;

function Transaction() {
    this.transationCounter = 0;
    this.error = null;

    /**
     * Called when transaction fullfiled successful
     *
     * Must be defined when initialized
     *
     * @param response (function(objects[])
     */
    this.onSuccess = function(response) {};

    /**
     * Called when transaction failed
     *
     * Must be defined when initialized
     * @param error
     * @param obj which failed
     */
    this.onFail = function(error, obj){};

    this.response = [];

    /**
     * Add task to be completed
     * increments the task counter
     * 
     * @param name
     */
    this.add = function(name) {
        this.transationCounter++;
        console.log("TC-ADD:" + name + " ink. TC: " + this.transationCounter);
    }

    /**
     * call to after complete one task
     * counter will be incremented
     * onSuccess will be called as soon as counter is 0
     *
     * @param obj
     * @param name
     */
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

    /**
     *
     * @param error
     * @param obj
     * @param name
     */
    this.fail = function(error, obj, name) {
        this.error = error;
        this.onSuccess = function() {};
        console.log("TC-FAIL:" + name + "TC FAIL:" + this.transationCounter);
        this.onFail(error, obj);
    }
}





