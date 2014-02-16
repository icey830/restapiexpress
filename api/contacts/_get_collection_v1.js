exports.send = function(req, res, ressource) {

	var json = {	
	"data":[
		{"id": 123456, "name": "Veith", "links": [{
		"type":"application/com.github.restapiexpress.contact",
		"rel": "self",
		"method": "GET",
		"href": "http://localhost:3000/v1/contacts/123456" }]},
		{"id": 234567, "name" : "Samuel", "links": [{
		"type":"application/com.github.restapiexpress.contact",
		"rel": "self",
		"method": "GET",
		"href": "http://localhost:3000/v1/contacts/234567" }]},
		{"id": 324567, "name" : "Flo", "links": [{
		"type":"application/com.github.restapiexpress.contact",
		"rel": "self",
		"method": "GET",
		"href": "http://localhost:3000/v1/contacts/324567" }]},
	],
	"links": [{
		"type":"application/com.github.restapiexpress.contact",
		"rel": "self",
		"method": "GET",
		"href": "http://localhost:3000/v1/contacts/" 
	},
	{
		"type":"application/com.github.restapiexpress.contact",
		"rel": "create new contact",
		"method": "POST",
		"href": "http://localhost:3000/v1/contacts/" 
	}]
};	


	res.json(json);
};