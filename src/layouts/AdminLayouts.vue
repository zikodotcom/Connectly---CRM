<script lang="ts" setup>
import Header from '@/components/Header.vue'
import Menu from '@/components/Menu.vue'
import { ref } from 'vue'
let isShowInMobile = ref(false)
let displayMobile = () => {
  isShowInMobile.value = !isShowInMobile.value
}
</script>

<template>
  <div class="flex items-start">
    <Menu :isShowInMobile="isShowInMobile" :displayMobile="displayMobile" />
    <Header :isShowInMobile="isShowInMobile" :displayMobile="displayMobile" />
  </div>
  <routerView></routerView>
</template>
