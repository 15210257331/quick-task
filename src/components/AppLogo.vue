<template>
  <router-link :class="{ 'app-logo': true, 'app-logo-collapse': appstore.sideCollapse }" to="/">
    <img class="logo-img" src="../assets/logo.png" />
    <h2 class="logo-title">项目协作平台</h2>
  </router-link>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '@/store'

const appstore = useAppStore()
</script>
<style scoped lang="scss">
.app-logo-collapse {
  width: 64px !important;
  padding: 0;
  .logo-title {
    // display: none;
    // height: 0!important;
    width: 0 !important;
    color: var(--nice-primary-color)
  }
  .logo-img {
    width: 30px !important;
    height: 30px !important;
  }
}
.app-logo {
  transition: width 0.3s;
  position: relative;
  min-height: 49px;
  line-height: 49px;
  box-sizing: border-box;
  text-decoration: none;
  overflow: hidden;
  white-space: nowrap;
  display: inline-block;
  margin: 0 15px;
  & .logo-img {
    transition: all 0.3s;
    width: 35px;
    height: 35px;
    vertical-align: middle;
    border-radius: 3px;
    display: inline-block;
  }

  & .logo-title {
    transition: width 0.1s ease 0.2s;
    display: inline-block;
    width: 130px;
    margin: 0 0 0 10px;
    font-family: DFPSongW9;
    font-weight: 500;
    font-size: 17px;
    overflow: hidden;
    height: 35px;
    line-height: 35px;
    font-weight: 500;
    vertical-align: middle;
    color: var(--nice-primary-color);
    // color: $test-color
  }
}
</style>
