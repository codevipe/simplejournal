import fetch from 'isomorphic-fetch';

export default class Api {
  static get(dataType, query, cb) {
    const token = localStorage.getItem('id_token');
    const path = `/api/${dataType}${query}`;
    return fetch(path, {
      method: 'get',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    }).then(this.checkStatus)
      .then(this.parseJSON)
      .then(cb)
      .catch(cb);
  }

  static post(dataType, data, cb) {
    const token = localStorage.getItem('id_token');
    const path = `/api/${dataType}`;
    return fetch(path, {
      method: 'post',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify({ ...data }),
    }).then(this.checkStatus)
      .then(this.parseJSON)
      .then(cb)
      .catch(cb);
  }

  static checkStatus(response) {
    if (response.ok) {
      return response;
    }
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    throw error;
  }

  static parseJSON(response) {
    return response.json();
  }
}
