var Expand = require('./expand');
var Scope = require('./scope');

function Resource(req, role) {
    this.role = role;
	this.type = undefined;
	this.version = undefined;
	this.pathResources = [];
	this.ids = [];
	this.path = undefined;
	this.restlet = undefined;
    this.documentation = undefined;
	this.method = req.method;
	this.expands = [];
	this.scope = [];
	this.fields = [];
	this.page = undefined;
	this.limit = undefined;
    this.sort = undefined;
    this.q = undefined;
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
    this.path =  this.pathResources.join('/') + '/';
    console.log("path: " +this.path);
    this.restlet = this.version + '/' + this.pathResources.join('/') + '/' + this.method.toLowerCase() + '/' + this.role + '/' + this.type + '.js';
    console.log("restlet:"+this.restlet);
    this.documentation = this.version + '/' + this.pathResources.join('/')+'/'+this.pathResources.join('/')+'.json';
    console.log("doc:" + this.documentation);

}

Resource.prototype.resolveQueryString = function(req) {
	
	this.resolveExpands(req);
	this.resolveScope(req);
	this.fields = req.query.fields;
	this.page = req.query.page;
	this.limit = req.query.limit;
	this.sort = req.query.sort;
    this.q = req.query.q;
}
Resource.prototype.resolveExpands = function(req) {
	if(req.query.expands) {
		this.expands = [];
        var that = this;
        req.query.expands.match(/(\w.+?\))/g).map(function(e){
            that.expands.push(new Expand(e));
        });


	}
}

Resource.prototype.resolveScope = function(req) {
    if(req.query.scope) {
        this.scope = [];
        var that = this;
        req.query.scope.match(/\[(.+?)\]/g).map(function(e){
            that.scope.push(new Scope(e));
        });
    }
}

Resource.prototype.setMethod = function(method) {
	this.method = method;
}

module.exports = Resource;