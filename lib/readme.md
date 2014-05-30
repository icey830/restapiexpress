#Lib

This folder contains all routing files for RESTAPIEXPRESS

##apirouter.js
Handles all routing

for example http://localhost:3000/v1/news

##config.js
configuration of http protocoll

##expand.js
handles expands

####example
http://localhost:3000/v1/news/123.json?expands=categories(*),images(*)

##resource.js
handles requested resource

adds information from request:

- role: role from signed in user
- type: type of resource (instance|collection)
- version: version number
- pathResource: Array of path elements
- ids: Array of requested Ids
- path: path to api doc file
- restlet: path to requested restlet (news/get/public/instance.js)
- documentation: path to doc file
- documentationJson: json of doc file content
- method: requested VERB (GET|POST|etc)
- expands: Array of {Expands}
- scope: Array of {Scope}
- fileds: Array of database fields
- page: page number
- limit: limit
- sort: sort by
- q: search string
- isCollection: Boolean True if isCollection
 
##scope.js
handles scope

####example
http://localhost:3000/v1/news/123.json?scope=[“price”,“lt”,9],[“minStock”,“gte”,5]
