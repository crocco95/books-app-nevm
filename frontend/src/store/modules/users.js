import axios from 'axios';
import firebaseApp from '../../config/firebase';
import 'firebase/firebase-auth';

const state = {
  user: firebaseApp.app.auth().currentUser,
}

const getters = {
  getUser: (state) => state.user,
  isLogged: (state) => state.user ? true : false,
}

const mutations = {
  setUser: (state,user) => ( state.user = user ),
}

const actions = {

  async registerAuthStateChangedListener({commit}){
    return firebaseApp.app
      .auth().onAuthStateChanged( (user) => {

        commit('setUser', user);

        user.getIdToken().then(token => {

          // axios.defaults.headers.common['Authorization'] = token;
          
          // Add a request interceptor
          axios.interceptors.request.use(function (config) {
            console.log(token);
            config.headers.Authorization =  token;
            return config;
          });
        });

        console.log("Auth state changed!");
        
      });
  },
  
  async login({commit}, params) {

    return firebaseApp.app
        .auth()
        .signInWithEmailAndPassword(params.email, params.password)
        .then( userCredential => userCredential.user)
        .then( user => {

          if( !user.emailVerified ){
            throw {
              message: 'The email address must be verified, check you email',
              code: 401
            }
          }

          commit('setUser', user);

          return user.getIdToken();
        })
        .then( idToken => {
          console.log(`Setting token: ${idToken}`)
          axios.defaults.headers.common['Authorization'] = idToken;
        });
  },

  async register({commit}, prams){
    return firebaseApp.app
        .auth()
        .createUserWithEmailAndPassword(prams.email, prams.password)
        .then( userCredential => {

          // Send email confirmation
          userCredential.user.sendEmailVerification();
        });
  },

  async logout({commit}){
    console.log("Logging out...");
    firebaseApp.app.auth().signOut().then(() => {
      delete axios.defaults.headers.common['Authorization'];
    })
    .catch(error => console.error(`Impossible to logout: ${error}`));
  }
}


export default {
  state,
  getters,
  actions,
  mutations
}