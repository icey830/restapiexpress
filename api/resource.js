var Expand = require('./expand');

function Resource(req) {

	this.type = undefined;
	this.version = undefined;
	this.pathResources = [];
	this.ids = [];
	this.path = undefined;
	this.restlet = undefined;
	this.method = req.method;
	this.expands = [];
	this.scope = [];
	this.fields = [];
	this.page = undefined;
	this.limit = undefined;
	this.isCollection = undefined;
	this.resolvePath(req);
	this.resolveQueryString(req);
	
}

Resource.prototype.resolvePath = function(req) {
	
	var tmpPath = [];
	var that = this;
	req.params[0].match(/(\/(\w+))/g).map(function (e) {
        tmpPath.push(e.substring(1));

    })
    this.version = tmpPath[0];
    tmpPath.splice(0, 1);
    tmpPath.map(function (e, index) {
        (index % 2 == 0) ? that.pathResources.push(e) : that.ids.push(e);
        (index % 2 == 0) ? that.isCollection = true : that.isCollection = false;
    });

    (tmpPath.length % 2 == 0) ? this.type = 'instance' : this.type = 'collection';
    this.path = this.pathResources.join('/') + '/';
    this.restlet = this.pathResources.join('/') + '/_' + this.method.toLowerCase() + '_' + this.type + '_' + this.version + '.js';
}

Resource.prototype.resolveQueryString = function(req) {
	
	this.resolveExpands(req);
		
	this.scope = req.query.scope;
	this.fields = req.query.fields;
	this.page = req.query.page;
	this.limit = req.query.limit;
	
}
Resource.prototype.resolveExpands = function(req) {
	if(req.query.expands) {
		this.expands = [];
		var expands = req.query.expands;
		var expandsArray = expands.split('!),');
		for (var i = 0; i < expandsArray.length; i++) {
   			 var expand = new Expand(expandsArray[i] + '!),');
   			 this.expands.push(expand);
		}
	}
	
}

Resource.prototype.setMethod = function(method) {
	this.method = method;
}

module.exports = Resource;