<script setup>
import { RouterView } from 'vue-router'
import Layout from './components/AppLayout.vue'
</script>

<template>
  <Layout>
    <RouterView />
  </Layout>
</template>
<style>

html,
body {
  height: 100%;
  margin: 0;
  background-color: black;
}

#app {
  height: 100%;
  background-color: black;
}
</style>
