var  http = require('http');
var restify = require('restify');

var  apiroutes = require('./apiroutes');


var port = 8888;

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = restify.createServer();
server.use(restify.bodyParser());

server.listen(port, function() {
  console.log('%s listening at %s', server.name, server.url);
});



server.get('/service/:service_name', apiroutes.get_service);
server.post('/service/:service_name', apiroutes.new_service);
server.post('/service/:service_name/addhost/:host', apiroutes.add_host);
server.get('/service/:service_name/host/next', apiroutes.next_host);


server.get('/', function(req, res){
  //res.render('index', {service: 'sp_registry', add_link:'PUT /registry/xyzname', list: 'GET /registry'});
  data = {service: 'sp_registry', add_link:'PUT /registry/xyzname', list: 'GET /registry'};
  //req.write(JSON.stringify(data));
  //req.end();
  res.send(data);
});



