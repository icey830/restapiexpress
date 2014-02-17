function Resource(req) {

	this.type = undefined;
	this.version = undefined;
	this.pathResources = [];
	this.ids = [];
	this.path = undefined;
	this.restlet = undefined;
	this.method = req.method;
	
	this.resolvePath(req);
	
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
    });

    (tmpPath.length % 2 == 0) ? this.type = 'instance' : this.type = 'collection';
    this.path = this.pathResources.join('/') + '/';
    this.restlet = this.pathResources.join('/') + '/_' + this.method.toLowerCase() + '_' + this.type + '_' + this.version + '.js';
}

Resource.prototype.setMethod = function(method) {
	this.method = method;
}

module.exports = Resource;