var assert = require('assert');
var request = require("superagent");
require('../app.js'); //Boot up the server for tests
//var host = config.host + ':' + config.port;
var host = 'http://localhost:8888';


describe('service registry', function(){

  it('new service response should return success', function(done){

	var req = request.post(host + '/service/testservice');
	req.send( {name: 'testservice',
                port: 8888,
                hosts: ['192.168.0.1', '192.168.0.2']}
            );

	req.end(function(res){
    	  assert.ok(res.text.indexOf('added') > -1);
    	  done();
    	});

  });
    
  it('new service data should be returned upon get', function(done){

	var req = request.get(host + '/service/testservice');
	req.end(function(res){
    	  assert.ok(res.text.indexOf('192.168.0.1') > -1);
          assert.ok(res.text.indexOf('192.168.0.2') > -1);
    	  done();
    	});

  });
    
  it('can add new host', function(done){

	var req = request.post(host + '/service/testservice/addhost/192.168.0.3');
	req.end(function(res){
    	  assert.ok(res.text.indexOf('192.168.0.3') > -1);
    	  done();
    	});

  });

});
