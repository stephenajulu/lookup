<template>
  <div class="header">
    <div class="title">lookup</div>
    <div
      v-if="logged"
      class="userimg"
      :style="'background:url(' + userimg + ') center center'"
      v-tooltip.auto="'Log Out'"
      @click="handleLogout"
    ></div>
    <div v-if="!logged && logged != null">
      <button
        class="btn github"
        @click="handleGithub"
        v-tooltip.auto="'Sign In with Github'"
      ></button>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  name: "Header",
  props: ["logged", "userimg"],
  methods: {
    handleGithub() {
      var provider = new firebase.auth.GithubAuthProvider();
      firebase.auth().signInWithRedirect(provider);
    },
    handleLogout() {
      firebase
        .auth()
        .signOut()
        .then(function() {
          alert("Signed Out!!");
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  z-index: 2;
  position: relative;
  .title {
    font-size: 20px;
    color: rgb(255, 255, 255);
    font-family: "Comfortaa", cursive;
    font-weight: 700;
  }
  .userimg {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    cursor: pointer;
  }
}

.btn {
  margin-left: 15px;
}

.google {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M3.064 7.51A9.996 9.996 0 0 1 12 2c2.695 0 4.959.99 6.69 2.605l-2.867 2.868C14.786 6.482 13.468 5.977 12 5.977c-2.605 0-4.81 1.76-5.595 4.123-.2.6-.314 1.24-.314 1.9 0 .66.114 1.3.314 1.9.786 2.364 2.99 4.123 5.595 4.123 1.345 0 2.49-.355 3.386-.955a4.6 4.6 0 0 0 1.996-3.018H12v-3.868h9.418c.118.654.182 1.336.182 2.045 0 3.046-1.09 5.61-2.982 7.35C16.964 21.105 14.7 22 12 22A9.996 9.996 0 0 1 2 12c0-1.614.386-3.14 1.064-4.49z' fill='rgba(255,255,255,1)'/%3E%3C/svg%3E");
}

.github {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.013-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.338 1.087 2.912.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z' fill='rgba(255,255,255,1)'/%3E%3C/svg%3E");
}
</style>
