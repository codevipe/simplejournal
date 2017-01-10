function auth(state = {
  isFetching: false,
  isAuthenticated: localStorage.getItem('id_token') ? true : false,
  user: localStorage.getItem('user_profile') ? JSON.parse(localStorage.getItem('user_profile')) : null,
}, action) {
  switch (action.type) {
    case 'SIGNUP_REQUEST':
      return { ...state,
        isFetching: true,
        isAuthenticated: false,
      };
    case 'SIGNUP_SUCCESS':
      return { ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: '',
      };
    case 'SIGNUP_FAILURE':
      return { ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.message,
      };
    case 'LOGIN_REQUEST':
      return { ...state,
        isFetching: true,
        isAuthenticated: false,
      };
    case 'LOGIN_SUCCESS':
      return { ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: null,
        user: action.user,
      };
    case 'LOGIN_FAILURE':
      return { ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.message,
      };
    case 'LOGOUT_REQUEST':
      return { ...state,
        isFetching: true,
        isAuthenticated: true,
      };
    case 'LOGOUT_SUCCESS':
      return { ...state,
        isFetching: false,
        isAuthenticated: false,
        user: null,
      };
    case 'USER_REQUEST':
      return { ...state,
        isFetching: true,
      };
    case 'USER_SUCCESS':
      return { ...state,
        isFetching: false,
        errorMessage: null,
        user: action.user,
      };
    case 'USER_FAILURE':
      return { ...state,
        isFetching: false,
        errorMessage: action.message,
      };
    default:
      return state;
  }
}

export default auth;
