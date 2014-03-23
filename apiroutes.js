var services = {};

exports.new_service = function (req, res) {
  var body = req.body;
  var service = req.params.service_name;
  console.log('exports.new_service: body=' + req.body);
  console.log('exports.new_service: service=' + service);
  services[service] = body;     
  console.log(JSON.stringify(services));
  res.send(JSON.stringify({service: service, status: "added"}));
};

exports.get_service = function (req, res) {
  var service = req.params.service_name;
  console.log('exports.new_service: service=' + service);
  var service_data = services[service];
  res.send(JSON.stringify(service_data));
}
