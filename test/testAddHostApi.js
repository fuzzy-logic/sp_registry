var assert = require('assert');
var request = require("superagent");
require("./mockDockerApi.js");
require('../app.js'); //Boot up the server for tests
//var host = config.host + ':' + config.port;
var host = 'http://localhost:8888';


describe('test adding service and host via service registry', function(){

  it('create new service and ensure response returns success', function(done){
    var senddata = {name: "testservice",  port: "8888",  hosts: ["192.168.0.1:80", "192.168.0.2:80"]};  
	var req = request.post(host + '/service/testservice');
    req.type('form');
	req.set('Content-Type', 'application/json');
    req.send( JSON.stringify(senddata) );

	req.end(function(res){
          //console.dir("response: " + JSON.stringify(res.text));
    	  assert.ok(res.text.indexOf('added') > -1);
    	  done();
    	});

  });
    
 it('create second service and ensure response returns success', function(done){
     var senddata = {name: "my.other.service", port: "80", hosts: ["192.168.1.1:80", "192.168.1.2:80"]};
	var req = request.post(host + '/service/my.other.service');
    req.type('form');
    req.set('Content-Type', 'application/json');
	req.send( JSON.stringify(senddata) );

	req.end(function(res){
         //console.dir(res);
    	  assert.ok(res.text.indexOf('added') > -1);
    	  done();
    	});

  });
    
  it('next host round robin', function(done){
	var req = request.get(host + '/service/testservice/host/next');
	req.end(function(res){
         //console.log("res1: " + res.text)
          var json = JSON.parse(res.text);
    	  assert.ok(contains(json.host, '192.168.0.2'));
          assert.ok(contains(json.port, '80'));
    	 
    	});
 
	var req2 = request.get(host + '/service/testservice/host/next');
	req2.end(function(res){
          //console.log("res2: " + res.text)
    	  //assert.ok(contains(res.text, '192.168.0.1:80'));
          var json = JSON.parse(res.text);
    	  assert.ok(contains(json.host, '192.168.0.1'));
          assert.ok(contains(json.port, '80'));
    	 
    	});

	var req3 = request.get(host + '/service/testservice/host/next');
	req3.end(function(res){
          //console.log("res3: " + res.text)
    	  //assert.ok(contains(res.text, '192.168.0.2:80'));
          var json = JSON.parse(res.text);
    	  assert.ok(contains(json.host, '192.168.0.2'));
          assert.ok(contains(json.port, '80'));
    	  
    	});
 
	var req4 = request.get(host + '/service/testservice/host/next');
	req4.end(function(res){
          //console.log("res4: " + res.text)
    	  //assert.ok(contains(res.text, '192.168.0.1:80'));
          var json = JSON.parse(res.text);
    	  assert.ok(contains(json.host, '192.168.0.1'));
          assert.ok(contains(json.port, '80'));
    	  done();
    	});

  });    
     
    
  it('test add new host', function(done){
	var req = request.post(host + '/service/testservice/addhost/192.168.0.3/80');
	req.end(function(res){
          //console.log("res: " + res.text)
    	  assert.ok(contains(res.text, '192.168.0.3:80') );
    	  done();
    	});

  });
    
  it('new host data should be returned', function(done){
	var req = request.get(host + '/service/testservice');
	req.end(function(res){
          //console.log("res: " + res.text)
    	  assert.ok(contains(res.text, '192.168.0.1:80'));
          assert.ok(contains(res.text, '192.168.0.2:80'));
          //assert.ok(contains(res.text, '192.168.0.3:80'));
    	  done();
    	});

  });
    
 it('service list contains newly added data', function(done){
	var req = request.get(host + '/service');
	req.end(function(res){
          //console.log("res: " + res.text);
          assert.ok(contains(res.text, 'testservice'));          
    	  assert.ok(contains(res.text, '192.168.0.1:80'));
          assert.ok(contains(res.text, '192.168.0.2:80'));
          assert.ok(contains(res.text, '192.168.0.3:80'));
          assert.ok(contains(res.text, 'my.other.service'));
          assert.ok(contains(res.text, '192.168.1.1:80'));
          assert.ok(contains(res.text, '192.168.1.2:80'));
    	  done();
    	});

  });
    
  it('delete host /service/testservice/host/192.168.0.3/80', function(done){
	var req = request.del(host + '/service/testservice/host/192.168.0.3/80');
	req.end(function(res){
          //console.log("del res: " + res.text);
    	  assert.ok(contains(res.text, '192.168.0.1:80'));
          assert.ok(contains(res.text, '192.168.0.2:80'));
          assert.ok(! contains(res.text, '192.168.0.3:80'));
    	  done();
    	});

  });
    
    
  it('check docker api when no match', function(done){
	var req = request.get(host + '/service/sp-control-plane');
	req.end(function(res){
          //console.log("res: " + res.text);
    	  //assert.ok(contains(res.text, '192.168.0.1:80'));
    	  done();
    	});

  });
    


});


function contains(string, value) {
    return string.indexOf(value) > -1    
}