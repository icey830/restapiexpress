/** @author
 * Samuel Schmid <samuelschmid75@gmail.com>
 *
 * @module Scope
 * @desc
 * handles Scope of resources
 *
 * @example http://localhost:3000/v1/news/123.json?scope=[“price”,“lt”,9],[“minStock”,“gte”,5]
 *
 */

/**
 *
 * @type {Scope}
 */
module.exports = Scope;

/**
 * @class Represents a Scope
 * @constructor
 */
function Scope() {
    //No deeper expands, scope, page and limit at the moment
    /** @member {String} */
    this.field = undefined;
    /** @member {String} */
    this.operator = undefined;
    /** @member {String} */
    this.value = undefined;
}

/**
 * init a scope
 *
 * @param querystring
 */
Scope.prototype.initWithQueryString = function(querystring) {
    this.resolveScope(querystring.match(/\[(.+?)\]/g));
}

/**
 * init a scope
 *
 * @param field
 * @param operator
 * @param value
 */
Scope.prototype.initWithFieldOperatorAndValue = function(field, operator, value) {
    this.field = field;
    this.operator = operator;
    this.value = value;
}

/**
 * init scope
 *
 * @param fields
 */
Scope.prototype.resolveScope = function(fields) {
    if(fields) {

        var array = fields.toString().replace(/(\[|\])/g,'').split(',');
        if(array.length == 3) {
            this.field = array[0];
            this.operator = array[1];
            this.value = array[2];
        } else {
            console.log(array.length);
            console.log("wrong array size");
        }

    }
}

