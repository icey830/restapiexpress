/**
 * Created by Samuel Schmid on 10.03.14.
 *
 * handles expands
 *
 * for example http://localhost:3000/v1/news/123.json?expands=categories(*),images(*)
 *
 * @type {Expand}
 */
module.exports = Expand;


/**
 *
 * @param querystring
 * @constructor
 */
function Expand(querystring) {

	this.resource = querystring.split('(')[0];

    //No deeper expands, scope, page and limit at the moment
	//this.expands = [];
	//this.scope = [];
    //this.page = undefined;
    //this.limit = undefined;
	this.fields = [];
	this.isCollection = true;
	this.resolveFields(querystring.match(/\((.*)\)/g));


}

Expand.prototype.resolveFields = function(fields) {
	if(fields) {
		this.fields = [];
        var that = this;
        fields.map(function (e) {
            e.split(',').map(function(ee){
                that.fields.push(ee.replace(/(\(|\))/g,''));
            });
        });
	}
}

