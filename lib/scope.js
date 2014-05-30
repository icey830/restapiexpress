/**
 * Created by Samuel Schmid on 10.03.14.
 *
 * handles scope
 *
 * for example http://localhost:3000/v1/news/123.json?scope=[“price”,“lt”,9],[“minStock”,“gte”,5]
 *
 * @type {Scope}
 */
module.exports = Scope;

/**
 *
 * @constructor
 */
function Scope() {

    //No deeper expands, scope, page and limit at the moment
    this.field = undefined;
    this.operator = undefined;
    this.value = undefined;


}

Scope.prototype.initWithQueryString = function(querystring) {
    this.resolveScope(querystring.match(/\[(.+?)\]/g));
}

Scope.prototype.initWithFieldOperatorAndValue = function(field, operator, value) {
    this.field = field;
    this.operator = operator;
    this.value = value;
}

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

