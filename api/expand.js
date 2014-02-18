var Util = require('util');

function Expand(querystring, level) {

	var separatorStart = '(';
	var separatorEnd = '!)'
	for (var i = 0; i < level; i++) {
		separatorStart += '(';
	}
	
	var tmpQS = querystring;
	this.resource = tmpQS.split(separatorStart)[0];
	
	this.expands = [];
	this.scope = [];
	this.fields = [];
	this.page = undefined;
	this.limit = undefined;
	this.isCollection = true;
	var tmpPath = [];
	var array = querystring.match(/\((\w+.+)!\)/);
	
	if(Util.isArray(array))
	{
		this.resolveFields( array[0]);
	}
	

	
}

Expand.prototype.resolveFields = function(fields) {
	if(fields) {
		this.fields = [];
		
		var fieldsArray = fields.split(',');
		for (var i = 0; i < fieldsArray.length; i++) {
   			// var expand = new Expand(expandsArray[i]);
   			 this.fields.push(fieldsArray[i]);
		}
	}
	
}
module.exports = Expand;