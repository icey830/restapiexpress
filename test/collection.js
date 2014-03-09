/**
 * Created by samschmid on 09.03.14.
 */

var request = require('supertest')
    , app     = require('../app.js')
    , assert  = require("assert");

describe('GET /', function(){
    it('respond with json', function(done){
        request(app)
            .get('/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res){
                if (err) return done(err);
                done()
            });
    })
})