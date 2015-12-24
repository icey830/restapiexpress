/**
 * Created by samschmid on 11.04.14.
 */
var request = require('supertest')
    , app     = require('../../app.js')
    , assert  = require("assert");

process.env.NODE_ENV = 'test';

//Create a news object without image 1 (5347cf038499f5f507a62ca7)
describe('PUT /v1/news/5347cf038499f5f507a62ca7 --admin', function(){
    it('respond with json', function(done){
        var json = {"title":"Starving?","content":"Hans is hungry","timestamp":"2011-07-14T19:43:37+0100"};
        request(app)
            .put('/v1/news/5347cf038499f5f507a62ca7')
            .set('Accept', 'application/*')
            .set('DEV-ROLE', 'admin')
            .expect('Content-Type', /json/)
            .send(json)
            .expect(200)
            .expect({
                "item": {
                    "__t": "application/com.github.restapiexpress.news",
                    "__v": 0,
                    "_id": "5347cf038499f5f507a62ca7",

                    "timestamp": "2011-07-14T19:43:37+0100",
                    "content": "Hans is hungry",
                    "images": null,
                    "latestImage": null,
                    "timestamp": "2011-07-14T18:43:37.000Z",
                    "title": "Starving?"
                },
                "location": "news/5347cf038499f5f507a62ca7",
                "message": "document was updated"

            })
            .end(function(err, res){
                if (err) return done(err);
                done()
            });
    })
})

//Create a news object without image 2 (5347cf038499f5f507a62ca8)
describe('PUT /v1/news/5347cf038499f5f507a62ca8 --admin', function(){
    it('respond with json', function(done){
        var json = {"title":"Starving?","content":"Hans is hungry","timestamp":"2011-07-14T19:43:37+0100"};
        request(app)
            .put('/v1/news/5347cf038499f5f507a62ca8')
            .set('Accept', 'application/*')
            .set('DEV-ROLE', 'admin')
            .expect('Content-Type', /json/)
            .send(json)
            .expect(200)
            .expect({
            "item": {
                "__t": "application/com.github.restapiexpress.news",
                "__v": 0,
                "_id": "5347cf038499f5f507a62ca8",

                    "timestamp": "2011-07-14T19:43:37+0100",
                    "content": "Hans is hungry",
                    "images": null,
                    "latestImage": null,
                    "timestamp": "2011-07-14T18:43:37.000Z",
                     "title": "Starving?"
              },
                "location": "news/5347cf038499f5f507a62ca8",
                "message": "document was updated"

            })
            .end(function(err, res){
                if (err) return done(err);
                done()
            });
    })
})

//Create a newsimage  add to news 1 (5347cf038499f5f507a62ca7)
describe('PUT /v1/newsimages/5347cf038499f5f507a62000 --admin', function(){
    it('respond with json', function(done){
        var json = {"news":"5347cf038499f5f507a62ca7","url":"https://scontent-b-fra.xx.fbcdn.net/hphotos-prn2/t1.0-9/1458448_10202078525385199_2069574105_n.jpg","isPublic":false,"lastChanged":"2011-07-14T19:43:37+0100","timestamp":"2011-07-14T19:43:37+0100"};
        request(app)
            .put('/v1/newsimages/5347cf038499f5f507a62000')
            .set('Accept', 'application/*')
            .set('DEV-ROLE', 'admin')
            .expect('Content-Type', /json/)
            .send(json)
            .expect(200)
            .expect({
             "item":
            {
                "__t" : "application/com.github.restapiexpress.newsimages",
                "_id" : "5347cf038499f5f507a62000",
                "isPublic" : false,
                "url" : "https://scontent-b-fra.xx.fbcdn.net/hphotos-prn2/t1.0-9/1458448_10202078525385199_2069574105_n.jpg",
                "news" : "5347cf038499f5f507a62ca7",
                "lastChanged" : "2011-07-14T18:43:37.000Z",
                "timestamp" : "2011-07-14T18:43:37.000Z",
                "__v" : 0
            },
            "location": "newsimages/5347cf038499f5f507a62000",
                "message": "document was updated"

        }
            )
            .end(function(err, res){
                if (err) return done(err);
                done()
            });
    })
})

//Check if newsimages is attached to news 1 (5347cf038499f5f507a62ca7)
describe('GET /v1/news/5347cf038499f5f507a62ca7 --admin', function(){
    it('respond with json', function(done){
        request(app)
            .get('/v1/news/5347cf038499f5f507a62ca7?fields=images,latestImage')
            .set('Accept', 'application/*')
            .set('DEV-ROLE', 'admin')
            .expect('Content-Type', /json/)
            .send()
            .expect(200)
            .expect({
                "item": {
                    "_id": "5347cf038499f5f507a62ca7",
                    "images": [
                        "5347cf038499f5f507a62000"
                    ],
                    "latestImage": "5347cf038499f5f507a62000"
                },
                "links": [
                    {
                        "type": "application/com.github.restapiexpress.news",
                        "rel": "self",
                        "method": "GET",
                        "href": "http://127.0.0.1:3000/v1/news/5347cf038499f5f507a62ca7"
                    }
                ],
                "doc": {
                    "type": "application/com.github.restapiexpress.news",
                    "rel": "show documentation",
                    "method": "GET",
                    "href": "http://127.0.0.1:3000/doc/v1/news/"
                }
            }
        )
            .end(function(err, res){
                if (err) return done(err);
                done()
            });
    })
})

//change newsimage to attach to news 2 (5347cf038499f5f507a62ca8)
describe('POST /v1/newsimages/5347cf038499f5f507a62000 --admin', function(){
    it('respond with json', function(done){
        var json = {"news" : "5347cf038499f5f507a62ca8"}
        request(app)
            .post('/v1/newsimages/5347cf038499f5f507a62000')
            .set('Accept', 'application/*')
            .set('DEV-ROLE', 'admin')
            .expect('Content-Type', /json/)
            .send(json)
            .expect(200)
            .end(function(err, res){
                if (err) return done(err);
                done()
            });
    })
})

//Check if news image is attached to news 1 (5347cf038499f5f507a62ca7) ->No
describe('News image should not be attached to news 1 /v1/news/5347cf038499f5f507a62ca7 --admin', function(){
    it('respond with json', function(done){
        request(app)
            .get('/v1/news/5347cf038499f5f507a62ca7?fields=images,latestImage')
            .set('Accept', 'application/*')
            .set('DEV-ROLE', 'admin')
            .expect('Content-Type', /json/)
            .send()
            .expect(200)
            .expect({
                "item": {
                    "_id": "5347cf038499f5f507a62ca7",
                    "images": [

                    ],
                    "latestImage": null
                },
                "links": [
                    {
                        "type": "application/com.github.restapiexpress.news",
                        "rel": "self",
                        "method": "GET",
                        "href": "http://127.0.0.1:3000/v1/news/5347cf038499f5f507a62ca7"
                    }
                ],
                "doc": {
                    "type": "application/com.github.restapiexpress.news",
                    "rel": "show documentation",
                    "method": "GET",
                    "href": "http://127.0.0.1:3000/doc/v1/news/"
                }
            }
        )
            .end(function(err, res){
                if (err) return done(err);
                done()
            });
    })
})

describe('News image should be attached to news 2 /v1/news/5347cf038499f5f507a62ca8 --admin', function(){
    it('respond with json', function(done){
        request(app)
            .get('/v1/news/5347cf038499f5f507a62ca8?fields=images,latestImage')
            .set('Accept', 'application/*')
            .set('DEV-ROLE', 'admin')
            .expect('Content-Type', /json/)
            .send()
            .expect(200)
            .expect({
                "item": {
                    "_id": "5347cf038499f5f507a62ca8",
                    "images": [
                        "5347cf038499f5f507a62000"
                    ],
                    "latestImage": "5347cf038499f5f507a62000"
                },
                "links": [
                    {
                        "type": "application/com.github.restapiexpress.news",
                        "rel": "self",
                        "method": "GET",
                        "href": "http://127.0.0.1:3000/v1/news/5347cf038499f5f507a62ca8"
                    }
                ],
                "doc": {
                    "type": "application/com.github.restapiexpress.news",
                    "rel": "show documentation",
                    "method": "GET",
                    "href": "http://127.0.0.1:3000/doc/v1/news/"
                }
            }
        )
            .end(function(err, res){
                if (err) return done(err);
                done()
            });
    })
})

describe('News image should be referenced to news 2 GET /v1/newsimages/5347cf038499f5f507a62000 --admin', function(){
    it('respond with json', function(done){
        request(app)
            .get('/v1/newsimages/5347cf038499f5f507a62000?fields=news')
            .set('Accept', 'application/*')
            .set('DEV-ROLE', 'admin')
            .expect('Content-Type', /json/)
            .send()
            .expect(200)
            .expect({
                "item": {
                    "_id": "5347cf038499f5f507a62000",
                    "news": "5347cf038499f5f507a62ca8"
                },
                "links": [
                    {
                        "type": "application/com.github.restapiexpress.newsimages",
                        "rel": "self",
                        "method": "GET",
                        "href": "http://127.0.0.1:3000/v1/newsimages/5347cf038499f5f507a62000"
                    }
                ],
                "doc": {
                    "type": "application/com.github.restapiexpress.newsimages",
                    "rel": "show documentation",
                    "method": "GET",
                    "href": "http://127.0.0.1:3000/doc/v1/newsimages/"
                }
            }
        )
            .end(function(err, res){
                if (err) return done(err);
                done()
            });
    })
})

describe('Attached Newsimage to News 1 (5347cf038499f5f507a62ca7) POST /v1/newsimages/5347cf038499f5f507a62000 --admin', function(){
    it('respond with json', function(done){
        var json = {"news" : "5347cf038499f5f507a62ca7"}
        request(app)
            .post('/v1/newsimages/5347cf038499f5f507a62000')
            .set('Accept', 'application/*')
            .set('DEV-ROLE', 'admin')
            .expect('Content-Type', /json/)
            .send(json)
            .expect(200)
            .end(function(err, res){
                if (err) return done(err);
                done()
            });
    })
})

describe('Newsimage should be attached to News 1 GET after patch IMAGE 4 /v1/news/5347cf038499f5f507a62ca7 --admin', function(){
    it('respond with json', function(done){
        request(app)
            .get('/v1/news/5347cf038499f5f507a62ca7?fields=images,latestImage')
            .set('Accept', 'application/*')
            .set('DEV-ROLE', 'admin')
            .expect('Content-Type', /json/)
            .send()
            .expect(200)
            .expect({
                "item": {
                    "_id": "5347cf038499f5f507a62ca7",
                    "images": [
                        "5347cf038499f5f507a62000"
                    ],
                    "latestImage": "5347cf038499f5f507a62000"
                },
                "links": [
                    {
                        "type": "application/com.github.restapiexpress.news",
                        "rel": "self",
                        "method": "GET",
                        "href": "http://127.0.0.1:3000/v1/news/5347cf038499f5f507a62ca7"
                    }
                ],
                "doc": {
                    "type": "application/com.github.restapiexpress.news",
                    "rel": "show documentation",
                    "method": "GET",
                    "href": "http://127.0.0.1:3000/doc/v1/news/"
                }
            }
        )
            .end(function(err, res){
                if (err) return done(err);
                done()
            });
    })
})

describe('News image should not be attached to news 2 (5347cf038499f5f507a62ca8) /v1/news/5347cf038499f5f507a62ca8 --admin', function(){
    it('respond with json', function(done){
        request(app)
            .get('/v1/news/5347cf038499f5f507a62ca8?fields=images,latestImage')
            .set('Accept', 'application/*')
            .set('DEV-ROLE', 'admin')
            .expect('Content-Type', /json/)
            .send()
            .expect(200)
            .expect({
                "item": {
                    "_id": "5347cf038499f5f507a62ca8",
                    "images": [
                     ],
                    "latestImage": null
                },
                "links": [
                    {
                        "type": "application/com.github.restapiexpress.news",
                        "rel": "self",
                        "method": "GET",
                        "href": "http://127.0.0.1:3000/v1/news/5347cf038499f5f507a62ca8"
                    }
                ],
                "doc": {
                    "type": "application/com.github.restapiexpress.news",
                    "rel": "show documentation",
                    "method": "GET",
                    "href": "http://127.0.0.1:3000/doc/v1/news/"
                }
            }
        )
            .end(function(err, res){
                if (err) return done(err);
                done()
            });
    })
})

describe('GET after PATCH image 6 /v1/newsimages/5347cf038499f5f507a62000 --admin', function(){
    it('respond with json', function(done){
        request(app)
            .get('/v1/newsimages/5347cf038499f5f507a62000?fields=news')
            .set('Accept', 'application/*')
            .set('DEV-ROLE', 'admin')
            .expect('Content-Type', /json/)
            .send()
            .expect(200)
            .expect({
                "item": {
                    "_id": "5347cf038499f5f507a62000",
                    "news": "5347cf038499f5f507a62ca7"
                },
                "links": [
                    {
                        "type": "application/com.github.restapiexpress.newsimages",
                        "rel": "self",
                        "method": "GET",
                        "href": "http://127.0.0.1:3000/v1/newsimages/5347cf038499f5f507a62000"
                    }
                ],
                "doc": {
                    "type": "application/com.github.restapiexpress.newsimages",
                    "rel": "show documentation",
                    "method": "GET",
                    "href": "http://127.0.0.1:3000/doc/v1/newsimages/"
                }
            }
        )
            .end(function(err, res){
                if (err) return done(err);
                done()
            });
    })
})

describe('DELETE /v1/newsimages/5347cf038499f5f507a62000 --admin', function(){
    it('respond with json', function(done){
        request(app)
            .del('/v1/newsimages/5347cf038499f5f507a62000')
            .set('Accept', 'application/*')
            .set('DEV-ROLE', 'admin')
            .expect('Content-Type', /json/)
            .send()
            .expect(200)
            .end(function(err, res){
                if (err) return done(err);
                done()
            });
    })
})

describe('DELETE /v1/news/5347cf038499f5f507a62ca8 --admin', function(){
    it('respond with json', function(done){
        request(app)
            .del('/v1/news/5347cf038499f5f507a62ca8')
            .set('Accept', 'application/*')
            .set('DEV-ROLE', 'admin')
            .expect('Content-Type', /json/)
            .send()
            .expect(200)
            .end(function(err, res){
                if (err) return done(err);
                done()
            });
    })
})

describe('DELETE /v1/news/5347cf038499f5f507a62ca7 --admin', function(){
    it('respond with json', function(done){
        request(app)
            .del('/v1/news/5347cf038499f5f507a62ca7')
            .set('Accept', 'application/*')
            .set('DEV-ROLE', 'admin')
            .expect('Content-Type', /json/)
            .send()
            .expect(200)
            .end(function(err, res){
                if (err) return done(err);
                done()
            });
    })
})