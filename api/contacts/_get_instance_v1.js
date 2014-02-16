exports.send = function(req, res, ressource) {

	var json = {	
	"id":"123456",
	"name": "Veith",
	"expands": {
		"adresses" : [
		{
			"city": "Balgach"
		},
		{
			"city": "Heerbrugg"
		}
		]
	
	},
	"links": [{
		"type":"application/com.github.restapiexpress.contact",
		"rel": "self",
		"method": "GET",
		"href": "http://localhost:3000/v1/contacts/123456" 
	},
	{
		"type":"application/com.github.restapiexpress.contact",
		"rel": "update contact data",
		"method": "PATCH",
		"href": "http://localhost:3000/v1/contacts/123456" 
	},
	{
		"type":"application/com.github.restapiexpress.contact",
		"rel": "update contact data",
		"method": "PUT",
		"href": "http://localhost:3000/v1/contacts/123456" 
	},
	{
		"type":"application/com.github.restapiexpress.contact",
		"rel": "delete contact with all sub resources",
		"method": "DELETE",
		"href": "http://localhost:3000/v1/contacts/123456" 
	}]
};	


	res.json(json);
};