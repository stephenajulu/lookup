<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Lexend+Deca&family=Comfortaa:wght@700&display=swap");

html,
body {
  font-family: "Lexend Deca", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  background: rgb(15, 15, 15);
  margin: 0;
  padding: 0;
}

.btn {
  background: rgba(255, 255, 255, 0);
  border: 0;
  border-radius: 5px;
  width: 36px;
  height: 36px;
  background-size: 70% !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  &:hover {
    background: rgba(255, 255, 255, 0.24);
  }
}

button,
input {
  outline: none;
}

.pin {
  border-radius: 50%;
  background: rgba(255, 255, 255, 1);
  background-size: 80% !important;
  background-repeat: no-repeat !important;
  background-position: center;
  cursor: pointer;
}

.event {
  background-image: url("https://d1j8pt39hxlh3d.cloudfront.net/products/previews/RES3POBSZ353HFVPZOKR/3176_N5LbM7pRxO12S6MCOfauUTRZEcdQphnW.gif");
}

.tooltip {
  color: inherit;
  position: absolute;
  z-index: 999;
  backdrop-filter: blur(30px);
  font-size: 14px;
  padding: 4px;
  border-radius: 5px;
  margin: 5px 0;
  background-color: rgba(255, 255, 255, 0.14);
}
</style>
