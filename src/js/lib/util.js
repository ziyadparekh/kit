import { browserHistory } from 'react-router';
import Cookies from 'js-cookie';
import RESTController from 'lib/RESTController';

export function routeTo(path) {
  return browserHistory.push(path);
} 

export function startLoader() {
  return {
    type: types.IS_LOADING
  }
}

export function handleErrors(response) {
  if (!response.ok) {
    if (response.status === 401) {
      return routeTo('/login');
    }
    throw Error(response.statusText);
  }
  return response;
}