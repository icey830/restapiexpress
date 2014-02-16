exports.send = function(req, res, ressource) {
    console.dir(req);
	res.send(ressource);
};