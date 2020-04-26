import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";
import firebase from "firebase";
import VTooltip from "v-tooltip";

var firebaseConfig = {
  apiKey: "AIzaSyCvTPE6A1wxAcT76MDoQ_B_MpO1Nc7Yswc",
  authDomain: "mylookupapp.firebaseapp.com",
  databaseURL: "https://mylookupapp.firebaseio.com",
  projectId: "mylookupapp",
  storageBucket: "mylookupapp.appspot.com",
  messagingSenderId: "147224680392",
  appId: "1:147224680392:web:e0092e08f8c6c71a3212fd",
  measurementId: "G-0QFQE7JKPL"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

Vue.config.productionTip = false;

Vue.use(VTooltip);

new Vue({
  router,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");
