#apidoc
contains all resources documented with JSON for each version

/version/resources/resources.json

####example
/v1/news/news.json

#Abstract Classes
Can contain abstract classes!
/version/abstract/abstractresource/abstractresource.json

####example
/v1/abstract/objects/objects.json

#Naming convention
Resource names must be descripte in plural form.

#Resource

####title
Name of Resource in plural form

####singular
Sigular Version of Name

####request
relative path to resource

####version
version of resource

####type
unique type name in form "application/name"

####base
base class (none, if no base class)

####_testId
an id used for testing with grunt

####model
the database model
if a base class is defined the base class model will be extended

####permissions
the permissions
if a base class is defined the base class permissions will be extended, child permissions overrides base permissions

####example
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