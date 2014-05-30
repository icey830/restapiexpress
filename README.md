# restapiexpress

**A framework for creating uniform RESTful APIs quickly written in Node.js on top of ExpressJS and with help of GruntJS**

## Goals

Whit this framework it is possible to create a full functional and 100% tested RESTful API with hypermedia.
The only thing you have to do is to write a uniformed documentation.

## What This Framework does

It takes all your assiduity work - so the only thing your have to do is to design your models.
* the frameworks takes control over routing
* the framework handles permissions
* the framework handles sessions
* the framework handles API-TOKENS
* the framework serves HYPERMEDIA RESTFul JSON Files
* the framework creates data base controllers based on predefined templates for every request you have defined in the documentation with grunt.
* the framework serves an admin interface to write the documentation

# Test it - and give me a feedback

I need your help to improve it.
If you test it, its a good help.

Because we have no user management at the moment, you have to send the a HTTP-Header "DEV-ROLE" if you want to use a specific user role.

## Example

"DEV-ROLE: admin"

> GET all entries
> ```bash
> curl -X GET -H "DEV-ROLE: admin" http://localhost:3000/v1/contacts
> ```


# Installation

> For the moment there is only database supported is mongodb. So you have to install mongoDB first. (no Username an Password). Work is very in progress. What you can do now: Install it and run it. thats basically all. The documentation is prepared for the API Version 1 with three resource (contacts, news and newsimages).

To install you follow the following steps

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

So far you have the a running System with default resource:
* Contact
* News
* Newsimages

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


# How to define your Resources?

**Just 3 simple steps**

1. write a documentation for your resource

2. run grunt in your project folder
    ```javascript
    grunt
    ```

3. run grunt test in your project folder (if not success, you probably made a mistake in step one)
    ```javascript
    grunt test
    ```

## How to describe a documentation file?
Take a look into the folder apidoc/, there are some default documentations.

There are some fields you have to describe.

* define base model (Yes, you can have abstract "classes")
* define title, description, version etc.
* define database model
* define permissions for every User-Role and HTTP-Method (GET, POST, PUT, HEAD, OPTIONS, etc.)

### Optional and not implemented in current version

* define parameters on collection
* define HTTP-States messages
* define cache-controls
* define supported mime-types

## Example News.json
```json
{
    "title": "News",
    "singular": "News",
    "request": "/news/",
    "description": "News",
    "version" : "1",
    "type": "application/com.github.restapiexpress.news",
    "base": "application/com.github.restapiexpress.object.abstract",
    "_testId" : "5339a146d46d35ebe953030a",
    "model": {
        "title": {
            "name": "title",
            "description": "News Title",
            "mandatory": true,
            "type": "string",
            "test" : "Starving?",
            "regex": ""
        },
        "content": {
            "name": "content",
            "description": "News content",
            "mandatory": true,
            "test" : "Hans is hungry",
            "type": "string"
        },
        "images": {
            "name": "images",
            "description": "News images",
            "mandatory": false,
            "test" : "[]",
            "type": "application/com.github.restapiexpress.newsimages[]",
            "multiple": true,
            "reference" : "news",
            "referenceRule" : "cascade"
        },
        "latestImage": {
            "name": "latestImage",
            "description": "latest News images",
            "mandatory": false,
            "test" : "null",
            "type": "application/com.github.restapiexpress.newsimages",
            "reference" : "news",
            "referenceRule" : "noaction"
        }
    },
    "permission": [
        {
            "role": "Public",
            "description": "Rolle Public kann...",
            "allowedMethods" : ["GET"]
        },
        {
            "role": "User",
            "description": "Authentifizierte Benutzer können...",
            "allowedMethods" : ["GET", "HEAD", "OPTIONS"]

        },
        {
            "role": "Admin",
            "description": "Rolle Administrator kann...",
            "allowedMethods" : ["GET", "PUT", "PATCH", "POST", "DELETE", "HEAD", "OPTIONS"]
        }
    ]
}
```

## References

Its quite Easy to handle references.
To show you how, i work with two resources "News" and "Newsimages".
In the documentations of the two resources you have to add a property in each model.

### 1 : 1

News have exactly one Newsimage. If the News will be deleted, the images is deleted too.
If the image will be deleted, the news will still stay alive.

#### News.json:

```json
{
    "model": {
        "image": {
            "name": "image",
            "description": "Reference from News to Newsimage",
            "mandatory": false,
            "test" : "null",
            "type": "application/com.github.restapiexpress.newsimages",
            "multiple": false,
            "reference" : "news",
            "referenceRule" : "cascade"
        }
    }
}
```

#### Newsimages.json:

```json
{
    "model": {
        "news": {
            "name": "news",
            "description": "Referece from Newsimage to News",
            "mandatory": true,
            "test" : "5339a146d46d35ebe953030a",
            "type": "application/com.github.restapiexpress.news",
            "multiple": false,
            "reference" : "news",
            "referenceRule" : "nullify"
        }
    }
}
```

### 1 : n

News have multiple Newsimage. If the News will be deleted, the images are deleted too.
If a image will be deleted, the news will still stay alive.

#### News.json:

```json
{
    "model": {
        "image": {
            "name": "image",
            "description": "Reference from News to Newsimage",
            "mandatory": false,
            "test" : "[]",
            "type": "application/com.github.restapiexpress.newsimages[]",
            "multiple": true,
            "reference" : "news",
            "referenceRule" : "cascade"
        }
    }
}
```

#### Newsimages.json:

```json
{
    "model": {
        "news": {
            "name": "news",
            "description": "Referece from Newsimage to News",
            "mandatory": true,
            "test" : "5339a146d46d35ebe953030a",
            "type": "application/com.github.restapiexpress.news",
            "multiple": false,
            "reference" : "news",
            "referenceRule" : "nullify"
        }
    }
}
```

### n : m

News have multiple Newsimages. Newsimages can be atached to multiple News. If the News will be deleted, the images will still stay alive.
If a image will be deleted, the news will still stay alive.

#### News.json:

```json
{
    "model": {
        "image": {
            "name": "image",
            "description": "Reference from News to Newsimage",
            "mandatory": false,
            "test" : "[]",
            "type": "application/com.github.restapiexpress.newsimages[]",
            "multiple": true,
            "reference" : "news",
            "referenceRule" : "nullify"
        }
    }
}
```

#### Newsimages.json:

```json
{
    "model": {
        "news": {
            "name": "news",
            "description": "Referece from Newsimage to News",
            "mandatory": true,
            "test" : "[5339a146d46d35ebe953030a]",
            "type": "application/com.github.restapiexpress.news[]",
            "multiple": false,
            "reference" : "news",
            "referenceRule" : "nullify"
        }
    }
}
```

# Work in PROGRESS
* the framework handles permissions
* the framework handles sessions
* the framework handles API-TOKENS
* the framework serves an admin interface to write the documentation

## Tasks implemented

### General
* generete sessions based on user
* usermanagement (Username, password)

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
* create correct route for DELETE on instance and collection
* create correct route for PATCH on instance and collection
* create correct route for OPTIONS on instance and collection
* create custom types for mongodb schemes

### Automated Test cases:
* responding with http-code 200 if access granted or 302 where no access was granted for every collection or resource
* responding with http-code 201 a resource was created
* responding with http-code 400 if bad access
* responding with http-code 405 if method not supported on put
* automatic handling of relationships

## Next Steps
* handle API-Tokens
* handle roles
* handle expands for mongodb
* improve hypermedia to suppress links if not needed

# Become a contributer
We are looking for contributers. Please contact samuelschmid75@gmail.com.

{{md  Grunt.md }}
{{md  LICENSE.md }}