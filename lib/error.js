/** @author
 * Samuel Schmid <samuelschmid75@gmail.com>
 *
 * @module Error
 * @desc
 * provides helper functions
 */

/**
 *
 * @type {Error}
 */
module.exports = Error;

/**
 * @class Error
 * @constructor
 */
function Error(code, message ) {
    this.message = message || "";
    this.code = code || 0;
}

/**
 * get Message of error
 * @returns {string}
 */
Error.prototype.getMessage = function() {
    return this.message;
}

/**
 * set message of error
 *
 * @param message
 */
Error.prototype.setMessage = function(message) {
    this.message = message || "";
}

/**
 * get code of error
 *
 * @returns {number}
 */
Error.prototype.getCode = function() {
    return this.code;
}

/**
 * set code or error
 * @param code {number}
 */
Error.prototype.setCode = function(code) {
    this.code = code || 0;
}