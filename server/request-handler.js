/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var objectId = 1;
var resultsObj = {results: [{username: 'Thelegend27', text: 'Blaze it #blessed', objectId: objectId, roomname: 'lobby'}]};
var requestHandler = function(request, response) {
  var statusCode = 200;
  var headers = defaultCorsHeaders;

  var requestUrl = request.url.slice(0, 17);
  console.log('Serving request type ' + request.method + ' for url ' + requestUrl);

  headers['Content-Type'] = 'jsonp';
  if (requestUrl !== '/classes/messages') {
    statusCode = 404;   
    response.writeHead(statusCode, headers);
    response.end();
  }

  if (request.method === 'POST') {
    statusCode = 201;
    response.writeHead(statusCode, headers);
  } else {
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(resultsObj));
  }
  var promise = new Promise((resolve, reject) => {
    request.on('data', (data) => {
      resolve(JSON.parse(data.toString()));
    });
  });
  promise.then((data) => {
    objectId ++;
    data.objectId = objectId;
    resultsObj.results.push(data);
    response.end(JSON.stringify(resultsObj));
    console.log(resultsObj);
  }).catch((err) => {
    console.error(err);
  });
};

module.exports.requestHandler = requestHandler;
