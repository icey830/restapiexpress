restapiexpress
=
**A framework for creating uniform RESTful APIs quickly written in Node.js on top of ExpressJS and GruntJS**

Goals
-
Whit this framework it should be possible to create a full functional RESTful API with hypermedia.
The only thing you have to do is to write a uniformed documentation.

What This Framework do
-
It takes all your assiduity work - so the only thing your have to do is to design your models.
* the frameworks takes control over routing
* the framework handles permissions
* the framework handles sessions
* the framework handles API-TOKENS
* the framework serves HYPERMEDIA RESTFul JSON Files
* the framework creates data base controllers based on predefined templates for every request you have defined in the documentation with grunt.
* the framework serves an admin interface to write the documentation

Installation
=
> For the moment there is only database supported is mongodb. So you have to install mongo db first. (no Username an Password). Work is very in progress. What you can do now: Install it and run it. thats basically all. The documentation is prepared for the API Version 1 with one resource (contacts).
> You can call following routes which should work:
> * http://localhost:3000/
> * http://localhost:3000/v1/
> * http://localhost:3000/v1/contacts
> * http://localhost:3000/v1/contacts/123.json
> * Documentation of resource: http://localhost:3000/doc/v1/contacts
> If you want to write some data then you have to set a Header "DEV-ROLE" = "admin"
> POST to http://localhost:3000/v1/contacts
> Example
> post: 
> ```bash 
curl -X POST -H "Content-Type: application/json" -H "DEV-ROLE: admin" -d '{"id": "Barrack","name": "Obama","email": "Bob@bob.com","importance": "5"}' http://localhost:3000/v1/contacts
```
> GET all entries
> ```bash 
> curl -X GET -H "DEV-ROLE: admin" http://localhost:3000/v1/contacts
> ```

Then you can make the following steps

1. Fork this project 
2. Download it on your Computer
3. Move In your Project Folder
4. Edit config.json and set you database location (example)
   ```json
"db" : {
        ...
        "location" : "localhost:27017/restapiexpress",
        ...
    }
        
   ```
4. Install Node Dependencies

   ```javascript
   npm install
   ```
5. Install Database Dependencies

   ```javascript
   grunt setup
   ```
6. Create Routes based on Documentation 

   ```javascript
   grunt 
   ```
7. Test Routes based on Documentation 

   ```javascript
   grunt test
   ```

How to write the documentation
-
* TBD
* doc are based in folder apidoc/*
* define model
* define permissions for every HTTP-Method (GET, POST, PUT, HEAD, OPTIONS, etc.)

How to write data base controller 
-
* define a template for every HTTP-Method you need.
* write an extension for every single controller create by grunt if needed to take over the control.

Work in PROGRESS
=
* the frameworks takes control over routing
* the framework handles permissions
* the framework handles sessions
* the framework handles API-TOKENS
* the framework serves HYPERMEDIA RESTFul JSON Files
* the framework creates data base controllers based on predefined templates for every request you have defined in the documentation with grunt.
* the framework serves an admin interface to write the documentation

Tasks implemented
-
### Server response:
* returns a json representation of versions when accessing api.yourdomain.com/
* returns all documented functions of version1 of api when accessing api.yourdomain.com/v1/
* handles permissions in dev-mode via. header-field (DEV-ROLE)
* connect database mongodb with mongoose
* handles page, limit, sort, fields and scope

### Grunt tasks:
* creates json-files based on api.json (documentation, example: apidoc/v1/api.json) for every described VERB and permission-role
* creates js-files based on resource.json (example: apidoc/v1/contacts/contacts.json) for every described VERB and permission-role
* creates automated test cases based on resource.json or api.json.
* creates mongoose schemes for database
* downloads database dependencies
* extends schemes for serverside validation
* create correct route for GET on instance and collection
* create correct route for POST on instance and collection
* create correct route for PUT on instance and collection
* create correct route for DELETE on collection

### Automated Test cases:
* responding with http-code 200 if access granted or 302 where no access was granted for every collection or resource
* responding with http-code 201 a resource was created
* responding with http-code 400 if bad access
* responding with http-code 405 if method not supported on put

## Next Steps
* create template for DELETE on instance
* create template for PATCH on instance and collection
* create template for OPTIONS on instance and collection
* verify HEAD on instance and collection is really the same as GET
* create template for OPTIONS on instance and collection
* create single sign on tables (Username, password, API-Token)
* generete sessions based on user
* handle expands for mongodb
* improve hypermedia to suppress links if not needed

# Become a contributer
We are looking for contributers. Please contact samuelschmid75@gmail.com.
