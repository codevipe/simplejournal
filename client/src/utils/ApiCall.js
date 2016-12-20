import fetch from 'isomorphic-fetch';

export default class ApiCall {
  static get(token, dataType, query, cb) {
    let path;
    !query ? path = `/api/${dataType}` : path = `/api/${dataType}${query}`;
    return fetch(path, {
      method: 'get',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token,
      }),
    }).then(this.checkStatus)
      .then(this.parseJSON)
      .then(cb);
  }

  static post(token, dataType, data, query, cb) {
    let path;
    !query ? path = `/api/${dataType}` : path = `/api/${dataType}${query}`;
    return fetch(path, {
      method: 'post',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token,
      }),
      body: JSON.stringify(data),
    }).then(this.checkStatus)
      .then(this.parseJSON)
      .then(cb);
  }

  static checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error); // eslint-disable-line no-console
    throw error;
  }

  static parseJSON(response) {
    return response.json();
  }
}
