myApp.factory('Authentication', ['$rootScope', '$firebaseAuth', '$firebaseObject', '$location', 'FIREBASE_URL', function($rootScope, $firebaseAuth,$firebaseObject, $location, FIREBASE_URL){

  var ref = new Firebase(FIREBASE_URL);
  var auth = $firebaseAuth(ref);

  auth.$onAuth(function(authUser){
    if(authUser){
      var userRef = new Firebase(FIREBASE_URL + 'users/' + authUser.uid );
      var userObj = $firebaseObject(userRef);
      $rootScope.currentUser = userObj;
    } else {
      $rootScope.currentUser = '';
    }
  });

  var myObject= {
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
    logout: function(){
      return auth.$unauth();
    },
    requireAuth: function(){
      return auth.$requireAuth();
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

          myObject.login(user);

      }).catch(function(error){
        $rootScope.message = error.message;
      });
    }
  };
  return myObject;
}]);
