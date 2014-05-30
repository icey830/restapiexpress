#route
Containing all supported VERBs as subfolders
in this folders there must be a resource-writer.js and a test-resource-writer.js.

First creates the routes for instance and collection, secound creates the tests.

##api-route-writer.js
writes a route for each supported VERB for instance and collection of resource

###Collection:
VERB http://localhost:3000/v1/resources

###Instance:
VERB http://localhost:3000/v1/resources/132456789.json


##integration-test-writer.js
writing integrations tests for resource and all supported VERBs

##test-api-route-writer.js
writes a route tests for each supported VERBs

GET/POST/PUT/PATCH/HEAD/OPTIONS/DELETE

writes a integration test with test user having all rights