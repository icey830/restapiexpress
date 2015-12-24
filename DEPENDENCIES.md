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

### express 4.13.3

Fast, unopinionated, minimalist web framework

### compression 1.6.0

Node.js compression middleware

### body-parser 1.9.0

Node.js body parsing middleware
TODO Update to 1.14.2
TODO Replace because it's deprecated
body-parser deprecated undefined extended: provide extended option

### cookie-parser 1.4.0

cookie parsing with signatures

### morgan 1.6.1

HTTP request logger middleware for node.js

### serve-favicon 2.3.0

favicon serving middleware with caching

### method-override 2.3.5

Override HTTP verbs

### express-session 1.8.2

Simple session middleware for Express
TODO Update to 1.12.1
express-session deprecated undefined resave option; provide resave option app.js:47:9
express-session deprecated undefined saveUninitialized option; provide saveUninitialized option app.js:47:9

### errorhandler 1.4.2

Development-only error handler middleware

## Development (package.json)

### grunt 0.4.5

JavaScript Task Runner

### supertest 1.1.0

Super-agent driven library for testing HTTP servers

### mocha 2.3.4

simple, flexible, fun test framework

### should 8.0.2

test framework agnostic BDD-style assertions

### assert 1.3.0

commonjs assert - node.js api compatible

### chai 3.4.1

BDD/TDD assertion library for node.js and the browser. Test framework agnostic.