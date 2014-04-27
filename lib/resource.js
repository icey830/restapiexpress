var Expand = require('./expand');
var Scope = require('./scope');

function Resource() {
    this.role = undefined;
	this.type = undefined;
	this.version = undefined;
	this.pathResources = [];
	this.ids = [];
	this.path = undefined;
	this.restlet = undefined;
    this.documentation = undefined;
    this.documentationJson = undefined;
	this.method = undefined;
	this.expands = [];
	this.scope = [];
	this.fields = [];
	this.page = undefined;
	this.limit = undefined;
    this.sort = undefined;
    this.q = undefined;
	this.isCollection = undefined;

}

Resource.prototype.initWithRequestAndRole = function(req, role) {

    this.role = role;
    this.method = req.method;
    this.resolvePathWithReq(req);
    this.resolveRestlet();
    this.resolveDocumentation();
    this.resolveQueryString(req);
    console.log("load Resource... ");

}

Resource.prototype.initWithPath = function(path) {

    console.log("load Resource " + path);

    this.resolvePathWithPath(path);
    this.resolveDocumentation();
    console.log(JSON.stringify(this));

}

Resource.prototype.resolvePathWithReq = function(req) {
	
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
    //console.log("path: " +this.path);
}

Resource.prototype.resolvePathWithPath = function(path) {


    var that = this;
    var tmpPath = path.split("/");
    this.version = tmpPath[0];
    tmpPath.splice(0, 1);
    tmpPath.map(function (e, index) {
        (index % 2 == 0) ? that.pathResources.push(e) : that.ids.push(e);

    });
    (tmpPath.length % 2 == 0) ? that.isCollection = true : that.isCollection = false;
    (tmpPath.length % 2 == 0) ? this.type = 'instance' : this.type = 'collection';
    this.path =  this.pathResources.join('/') + '/';
    //console.log("path: " +this.path);
}

Resource.prototype.resolveRestlet = function() {

    this.restlet = this.version + '/' + this.pathResources.join('/') + '/' + this.method.toLowerCase() + '/' + this.role + '/' + this.type + '.js';
    //console.log("restlet:"+this.restlet);


}

Resource.prototype.resolveDocumentation = function() {

    this.documentation = this.version + '/' + this.pathResources.join('/')+'/'+this.pathResources.join('/')+'.json';
    //console.log("doc:" + this.documentation);

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

            var scope = new Scope();
            scope.initWithQueryString(e);
            that.scope.push(scope);
        });
    }
}

Resource.prototype.setMethod = function(method) {
	this.method = method;
}

module.exports = Resource;

