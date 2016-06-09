import { getCurrentUser } from 'lib/util';
import SV from 'lib/SV';

const test_token = 'its_okay_just_testing';
const environment = SV.get('environment');
const { baseUrl } = environment;

const RESTController = {
  request(method, url, body, headers) {
    // Get current user token for all requests
    const token = RESTController._getUserToken();
    // construct environment aware url to support
    // prod, dev and qa versions of Nutboard
    const targetUrl = `${baseUrl}${url}`;
    // Build up request headers
    headers = headers || {};
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json';
    if (token) {
      headers['Authorization'] = token;
    }
    // Build up request body
    body = body ? JSON.stringify(body) : undefined;

    return fetch(targetUrl, {
      method,
      headers,
      body
    });
  },
  get(url, body) {
    let qs = RESTController._buildQueryString(body);
    url += '?' + qs;
    return RESTController.request('GET', url);
  },
  post(url, body) {
    return RESTController.request('POST', url, body);
  },
  put(url, body) {
    return RESTController.request('PUT', url, body);
  },
  _getUserToken() {
    const currentUser = getCurrentUser();
    return currentUser.token;
  },
  _buildQueryString(params) {
    let str = '';
    for (var key in params) {
      str += key + '=' + params[key] + '&';
    }
    str = str.slice(0, str.length - 1); 
    return str;
  }
}

export default RESTController;