# restapiexpress dependencies

## Database (config.json)

You can use the database of your choice.
Currently only MongoDB is supported with a integration.

### MongoDB

#### mongodb 2.0.53

MongoDB legacy driver emulation layer on top of mongodb-core

#### mongoose 3.8.16

Mongoose MongoDB ODM
Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
TODO Update to 4.3.4

#### mongoose-schema-extend 0.1.7

mongoose schema inheritance and discriminator key extension
TODO Update to 0.2.0


## Webserver (package.json)

### connect-mongo 1.0.2

MongoDB session store for Express and Connect

### posix 4.0.0

The missing POSIX system calls

### express 4.9.5

Fast, unopinionated, minimalist web framework
TODO Update to 4.13.3

### compression 1.1.0

Node.js compression middleware
TODO Update to 1.6.0

### body-parser 1.9.0

Node.js body parsing middleware
TODO Update to 1.14.2
TODO Replace because it's deprecated
body-parser deprecated undefined extended: provide extended option

### cookie-parser 1.3.3

cookie parsing with signatures
TODO Update to 1.4.0

### morgan 1.3.1

HTTP request logger middleware for node.js
TODO Update to 1.6.1

### serve-favicon 2.1.5

favicon serving middleware with caching
TODO Update to 2.3.0

### method-override 2.2.0

Override HTTP verbs
TODO Update to 2.3.5

### express-session 1.8.2

Simple session middleware for Express
TODO Update to 1.12.1
express-session deprecated undefined resave option; provide resave option app.js:47:9
express-session deprecated undefined saveUninitialized option; provide saveUninitialized option app.js:47:9

### errorhandler 1.2.0

Development-only error handler middleware
TODO Update to 1.4.2

## Development (package.json)

### grunt 0.4.2

JavaScript Task Runner
TODO Update to 0.4.5

### supertest 0.13.0

Super-agent driven library for testing HTTP servers
TODO Update to 1.1.0

### mocha *

simple, flexible, fun test framework
TODO Update to specific version

### should 8.0.2

test framework agnostic BDD-style assertions

### assert 1.3.0

commonjs assert - node.js api compatible

### chai 3.1.4

BDD/TDD assertion library for node.js and the browser. Test framework agnostic.