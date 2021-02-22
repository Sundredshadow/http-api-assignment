const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);

const respond = (request, response, content, type, status) => {
  response.writeHead(status, { 'Content-Type': type });
  response.write(content);
  response.end();
};

const getIndex = (request, response) => respond(request, response, index, 'text/html', 200);

// format all xml and json
const getPageResponse = (request, response, acceptedTypes, responseJSON, status) => {
  if (acceptedTypes[0] === 'text/xml') {
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>'${responseJSON.message}'</message>`;
    responseXML = `${responseXML} <id>'${responseJSON.id}'</id>`;
    responseXML = `${responseXML} </response>`;

    return respond(request, response, responseXML, 'text/xml', status);
  }
  const JSONresponse = JSON.stringify(responseJSON);
  return respond(request, response, JSONresponse, 'application/json', status);
};

// potential status
const getSuccess = (request, response, acceptedTypes) => {
  const responseJSON = {
    message: 'This is a successful response',
    id: 'Found',
  };
  getPageResponse(request, response, acceptedTypes, responseJSON, 200);
};

const getBadRequest = (request, response, acceptedTypes, params) => {
  const responseJSON = {
    message: 'Missing valid query parameter set to true',
    id: 'badRequest',
  };
  if (!params.valid || params.valid !== 'true') { // return 400
    return getPageResponse(request, response, acceptedTypes, responseJSON, 400);
  }
  responseJSON.message = 'This is a successful response';
  responseJSON.id = 'Found';
  // return 200
  return getPageResponse(request, response, acceptedTypes, responseJSON, 200);
};

const getUnauthorizedRequest = (request, response, acceptedTypes, params) => {
  const responseJSON = {
    message: 'Missing loggedIN query parameter set to yes',
    id: 'Unauthorized',
  };
  if (!params.loggedIn || params.loggedIn !== 'yes') { // return 400
    return getPageResponse(request, response, acceptedTypes, responseJSON, 401);
  }
  // return 200
  responseJSON.message = 'This is a successful response';
  responseJSON.id = 'Found';
  return getPageResponse(request, response, acceptedTypes, responseJSON, 200);
};

const getForbiddenRequest = (request, response, acceptedTypes) => {
  const responseJSON = {
    message: 'You do not have access to this content',
    id: 'Forbidden',
  };
  getPageResponse(request, response, acceptedTypes, responseJSON, 403);
};

const getInternalServerError = (request, response, acceptedTypes) => {
  const responseJSON = {
    message: 'Internal Server Error. Something went wrong',
    id: 'Forbidden',
  };
  getPageResponse(request, response, acceptedTypes, responseJSON, 500);
};

const getNotImplemented = (request, response, acceptedTypes) => {
  const responseJSON = {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
    id: 'Not Implemented',
  };
  getPageResponse(request, response, acceptedTypes, responseJSON, 501);
};

const getNotFound = (request, response, acceptedTypes) => {
  const responseJSON = {
    message: 'The Page you are looking for was not found',
    id: 'Resource Not Found',
  };
  getPageResponse(request, response, acceptedTypes, responseJSON, 404);
};

module.exports = {
  getSuccess,
  getBadRequest,
  getUnauthorizedRequest,
  getForbiddenRequest,
  getInternalServerError,
  getNotImplemented,
  getNotFound,
  getIndex,
};
