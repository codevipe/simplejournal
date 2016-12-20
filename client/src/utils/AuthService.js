import Auth0 from 'auth0-js';
import { isTokenExpired } from './jwtHelper';

export default class AuthService {
  constructor(clientID, domain) {
    this.auth0 = new Auth0({
      clientID,
      domain,
      responseType: 'token',
    });

    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
  }

  login(params, onError) {
    // redirects the call to auth0 instance
    this.auth0.login(params, onError);
  }

  signup(params, onError) {
    // redirects the call to auth0 instance
    this.auth0.signup(params, onError);
  }

  parseHash(hash, cbUser) {
    // uses auth0 parseHash method to extract data from url hash
    // then saves user profile and returns it for callback
    const authResult = this.auth0.parseHash(hash);
    if (authResult.idToken) {
      this.setToken(authResult.idToken);

      this.auth0.getProfile(authResult.idToken, (err, profile) => {
        if (!err) {
          localStorage.setItem('user_profile', JSON.stringify(profile));
        }
        cbUser(err, profile);
      });
    }
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid, returns bool
    const token = this.getToken();
    return !!token && !isTokenExpired(token);
  }

  setToken(idToken) {
    // Saves user token to local storage
    localStorage.setItem('id_token', idToken);
  }

  getToken() {
    // Retrieves the user token from local storage
    return localStorage.getItem('id_token');
  }

  logout() {
    // Clear user token and profile data from local storage
    localStorage.removeItem('id_token');
    localStorage.removeItem('user_profile');
  }
}
