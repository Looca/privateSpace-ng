myApp.factory('Authentication', ['$rootScope', '$firebaseAuth', '$location', 'FIREBASE_URL', function($rootScope, $firebaseAuth,$location, FIREBASE_URL){

  var ref = new Firebase(FIREBASE_URL);
  var auth = $firebaseAuth(ref);

  return {
    login: function(user){
      // https://www.firebase.com/docs/web/api/firebase/authwithpassword.html
      auth.$authWithPassword({
          email: user.email,
          password: user.password
      }).then(function(regUser){
        $location.path('/success')
      }).catch(function(error){
        $rootScope.message = error;
      });
    },
    register: function(user){
      auth.$createUser({
        email: user.email,
        password: user.password
      }).then(function(regUser){
          // https://www.firebase.com/docs/web/api/firebase/child.html
          var regRef = new Firebase(FIREBASE_URL + 'users')
          .child(regUser.uid).set({
            date: Firebase.ServerValue.TIMESTAMP,
            regUser: regUser.uid,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email
          });

        $rootScope.message = "Welcome " + user.firstname + " , thanks for registering"
      }).catch(function(error){
        $rootScope.message = error.message;
      });
    }
  }
}]);
