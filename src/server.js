const http = require('http');
const url = require('url');
const query = require('querystring');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': responseHandler.getIndex,
  '/success': responseHandler.getSuccess,
  '/badRequest': responseHandler.getBadRequest,
  '/unauthorized': responseHandler.getUnauthorizedRequest,
  '/forbidden': responseHandler.getForbiddenRequest,
  '/internal': responseHandler.getInternalServerError,
  '/notImplemented': responseHandler.getNotImplemented,
  '/notFound': responseHandler.getNotFound,
  notFound: responseHandler.getNotFound,
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);
  const acceptedTypes = request.headers.accept.split(',');

  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, acceptedTypes, params);
  } else {
    urlStruct.notFound(request, response,acceptedTypes);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
