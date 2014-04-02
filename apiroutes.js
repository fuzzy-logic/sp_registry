var services = {};

exports.new_service = function (req, res) {
  console.log('exports.new_service() body=' + req.body);
  console.dir(req.body);
  var body = {};       
    try {
        body = JSON.parse(req.body);
    } catch (e) {
        body = req.body;
    }
  var servicename = req.params.service_name;
  console.log('exports.new_service(): service=' + servicename);
  body['link'] = "/service/" + servicename 
  services[servicename] = body;     
  console.log("new_service() service data: " + JSON.stringify(services));
  var jsonResponse  = {service: servicename, status: "added"};
  console.log("new_service() response:" + JSON.stringify(jsonResponse));
  res.send(JSON.stringify(jsonResponse));
};

exports.services = function (req, res) {
  console.log('services()');
  res.send(JSON.stringify(services));
}

exports.get_service = function (req, res) {
  var service = req.params.service_name;
  var service_data = services[service];
  console.log('get_service() service=' + JSON.stringify(service_data) );
  res.send(JSON.stringify(service_data));
}

exports.add_host = function (req, res) {
  console.log('add_host()');
  var service = req.params.service_name;
  var host = req.params.host;
  console.log('add_host() new host: ' + host);
  var service_data = services[service];
  console.log('add_host() hosts: ' + service_data.hosts);
  service_data.hosts.push(host);
  console.log('add_host() new service=' + JSON.stringify(service_data) );
  var jsonResponse  = {service: service, status: "added host " + host};
  console.log("add_host() response:" + JSON.stringify(jsonResponse));
  res.send(JSON.stringify(jsonResponse));
}

exports.next_host = function(req, res) {
    var service = req.params.service_name;
    console.log("next_host() for service " + service );
    var service_data = services[service];
    //console.log("service data: " + JSON.stringify(service_data) );
    if ( service_data['counter'] == undefined ) {
        service_data['counter'] = 0;
        
    } 
    
    console.log("counter: " + service_data.counter);
    console.log("hosts: " + service_data.hosts.length); 
    var  newcounter = service_data.counter + 1;
    var modCounter = newcounter % service_data.hosts.length ;        
    //console.log("newcounter: " + newcounter);
    //console.log("%: " + modCounter );
    //console.log(" 2 % 3: " + 3 % 2 );
    service_data['counter'] =  modCounter; 
    //console.log("counter: " + service_data.counter);
    host = service_data.hosts[service_data.counter];
    console.log("returning round robin host: " + host);
    
    res.send({host: host});
}

