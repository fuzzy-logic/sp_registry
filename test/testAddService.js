var assert = require('assert');
var request = require("superagent");
require('../app.js'); //Boot up the server for tests
//var host = config.host + ':' + config.port;
var host = 'http://localhost:8888';


describe('service registry', function(){

  it('should return success', function(done){

	var req = request.post(host + '/service/testservice');
	req.type('form');
	req.send({name: 'testservice'});

	req.end(function(res){
    	  assert.ok(res.text.indexOf('added') > -1);
    	  done();
    	});

  });

});
