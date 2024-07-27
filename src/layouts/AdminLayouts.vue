<script lang="ts" setup>
import Header from '@/components/Header.vue'
import Menu from '@/components/Menu.vue'
import { onMounted, onUnmounted, ref } from 'vue'
let isShowInMobile = ref(false)
let innerWidth = ref(window.innerWidth)

let displayMobile = () => {
  isShowInMobile.value = !isShowInMobile.value
}
const updateInnerWidth = () => {
  innerWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateInnerWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateInnerWidth)
})
</script>

<template>
  <div class="flex">
    <div class="w-[100%] md:w-[15%]" v-if="isShowInMobile || innerWidth > 768">
      <Menu :isShowInMobile="isShowInMobile" :displayMobile="displayMobile" />
    </div>
    <div class="flex flex-col w-[100%] md:w-[85%]">
      <Header :isShowInMobile="isShowInMobile" :displayMobile="displayMobile" />
      <div>
        <router-view> </router-view>
      </div>
    </div>
  </div>
</template>
