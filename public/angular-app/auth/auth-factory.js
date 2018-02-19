angular.module('meanhotel').factory('AuthFactory', AuthFactory);
//tells if user is logged in and is called in interceptor
function AuthFactory() {
  return {
    auth: auth
  };

  var auth = {
    isLoggedIn: false
  };
}