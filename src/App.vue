<template>
  <div id="app">
    <img src="./assets/logo.jpg">
    <MainView />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import MainView from './components/MainView.vue';

export default Vue.extend({
  name: 'app',
  components: {
    MainView,
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
