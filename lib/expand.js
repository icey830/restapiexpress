
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

module.exports = Expand;