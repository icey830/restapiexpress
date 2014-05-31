#Providers
Every database can be connected, at the moment, only one provider (mongoose) is supported.
But its easy to write your own provider if you need an other database than MongoDB.
You have to create a subfolder here for your provider an support the same methods like mongoose-provider.js.

Don't forget to write scheme and lib for your grunt task. See [grunt database provider](/grunt/database/providers)

##mongoose
classes in this folders handles all database operations on monogDB

##TODO
we have to writer javascript abstract class, which can be extended.
at the moment just have a look in mongoose/mongoose-provider.js to see what methods must be implemented

