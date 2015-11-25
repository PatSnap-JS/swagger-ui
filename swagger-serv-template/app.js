'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

function getDocHostObj(host){
  var parse = require('url').parse;
  var h = host.indexOf('http')<=0 ? `http://${host}`:host;
  return parse(h);
}


SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);


  var swaggerHost = swaggerExpress.runner.swagger['host'];


  var hostObj = getDocHostObj(swaggerHost);
  if(hostObj.hostname == 'localhost' || hostObj.hostname == '127.0.0.1'){
    var port = getDocHostObj(swaggerHost).port || process.env.PORT || 10010;
    app.listen(port);
  }else{
    console.log(hostObj.hostname + ' is not local,not listening');
  }


  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
