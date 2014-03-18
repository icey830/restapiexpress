restapiexpress
=
a framework for creating uniform RESTful APIs quickly written in Node.js (ExpressJS and GruntJS)

Goals
=
Whit this framework it should be possible to create a full functional RESTful API with hypermedia.
The only thing you have to do is to write a uniformed documentation.

What This Framework do
=
It takes all your assiduity work - so the only thing your have to do is to design your models.
- the frameworks takes control over routing
- the framework handles permissions
- the framework handles sessions
- the framework handles API-TOKENS
- the framework serves HYPERMEDIA RESTFul JSON Files
- the framework creates data base controllers based on predefined templates for every request you have defined in the documentation with grunt.
- the framework serves an admin interface to write the documentation

How to write the documentation
=
- define model
- define permissions for every HTTP-Method (GET, POST, PUT, HEAD, OPTIONS, etc.)

How to write data base controller 
=
- define a template for every HTTP-Method you need.
- write an extension for every single controller create by grunt if needed to take over the control.

Work in PROGRESS
=
- the frameworks takes control over routing
- the framework handles permissions
- the framework handles sessions
- the framework handles API-TOKENS
- the framework serves HYPERMEDIA RESTFul JSON Files
- the framework creates data base controllers based on predefined templates for every request you have defined in the documentation with grunt.
- the framework serves an admin interface to write the documentation

Tasks implemented
=
Server response:
- returns a json representation of versions when accessing api.yourdomain.com/
- returns all documented functions of version1 of api when accessing api.yourdomain.com/v1/
- handles permissions in dev-mode via. header-field (DEV-ROLE)
Grunt tasks:
- creates json-files based on api.json (documentation, example: apidoc/v1/api.json) for every described VERB and permission-role
- creates js-files based on resource.json (example: apidoc/v1/contacts/contacts.json) for every described VERB and permission-role
- creates automated test cases based on resource.json or api.json.

Automated Test cases:
- responding with http-code 200 or 302 where no access was granted for every collection or resource

Next Steps
=
- improve hypermedia for serving more links
- improve hypermedia to suppress links if not needed
- connect database (for example MongoDb)
- create single sign on tables (Username, password, API-Token)
- generete sessions based on user

Become a contributer
=
We are looking for contributers. Please contact samuelschmid75@gmail.com.
