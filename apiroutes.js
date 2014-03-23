var services = {};

exports.new_service = function (req, res) {
  var body = req.body;
  var service = req.params.service_name;
  console.log('exports.new_service: body=' + req.body);
  console.log('exports.new_service: service=' + service);
  services[service] = body;     
  console.log("service data: " + JSON.stringify(services));
  var jsonResponse  = {service: service, status: "added"};
  console.log("new_service() response:" + JSON.stringify(jsonResponse));
  res.send(JSON.stringify(jsonResponse));
};

exports.get_service = function (req, res) {
  var service = req.params.service_name;
  var service_data = services[service];
  console.log('get_service() service=' + JSON.stringify(service_data) );
  res.send(JSON.stringify(service_data));
}
