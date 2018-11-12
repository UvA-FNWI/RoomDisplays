<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.jpg">
    <HelloWorld />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from './components/HelloWorld.vue';

export default Vue.extend({
  name: 'app',
  components: {
    HelloWorld,
  },
});
</script>

<style lang="scss">
body {
  background: rgb(29,29,27);
}

#app {
  font-family: 'Quicksand';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: white;
  padding-top: 35px;
  background: rgb(29,29,27);
  height: 100%;

  img {
    display: block;
    margin-left: 10%;
    margin-right: 10%;
    width: 80%;
  }
}
</style>
