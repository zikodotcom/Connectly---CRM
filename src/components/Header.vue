<script setup>
import Logo from '@/assets/images/Logo.png'
import User from '@/assets/images/User.png'
import { ref } from 'vue'
let dropdown = ref(false)
let { isShowInMobile, displayMobile } = defineProps(['isShowInMobile', 'displayMobile'])
</script>

<template>
  <header class="hidden md:flex justify-between items-center border-b w-full">
    <div class="flex items-center">
      <input
        type="search"
        name="search"
        placeholder="search"
        class="outline-none border rounded-full ml-2 p-2"
      />
      <div class="pl-2">
        <v-btn icon="mdi-magnify" size="small"></v-btn>
      </div>
    </div>

    <div class="flex p-4">
      <button
        class="bg-0-PRIMARY_BLUE text-0-PRIMARY_BLUE_LIGHT text-sm font-normal py-2 px-4 mr-2 rounded-full shadow-lg border hover:bg-0-PRIMARY_BLUE_LIGHT hover:border-0-PRIMARY_BLUE hover:text-0-PRIMARY_BLUE"
      >
        Add New <v-icon icon="mdi-plus"></v-icon>
      </button>
      <img v-lazy="User" alt="" class="w-9 h-9 cursor-pointer" @click="dropdown = !dropdown" />
      <div
        class="absolute border bg-0-PRIMARY_BLUE_LIGHT shadow-lg rounded-sm right-[5px] top-[71px] w-[13%] z-50"
        v-if="dropdown"
      >
        <div
          class="text-0-PRIMARY_BLUE py-4 px-2 cursor-pointer hover:bg-0-PRIMARY_GREEN hover:text-0-PRIMARY_BLUE_LIGHT"
        >
          <v-icon size="small" icon="mdi-account"></v-icon>
          <span class="pl-2">Account</span>
        </div>
        <div
          class="text-0-PRIMARY_BLUE py-4 px-2 cursor-pointer hover:bg-0-PRIMARY_GREEN hover:text-0-PRIMARY_BLUE_LIGHT"
        >
          <v-icon size="small" icon="mdi-cog"></v-icon>
          <span class="pl-2">Settings</span>
        </div>
        <div
          class="text-0-PRIMARY_BLUE py-4 px-2 cursor-pointer hover:bg-0-PRIMARY_GREEN hover:text-0-PRIMARY_BLUE_LIGHT"
        >
          <v-icon size="small" icon="mdi-logout"></v-icon>
          <span class="pl-2">Logout</span>
        </div>
      </div>
    </div>
  </header>
  <header
    class="flex justify-between items-center p-2 border-b w-full md:hidden"
    v-if="!isShowInMobile"
  >
    <div><img v-lazy="Logo" alt="" class="h-9 w-9" /></div>
    <div>
      <button @click="displayMobile"><v-icon icon="mdi-menu"></v-icon></button>
    </div>
  </header>
</template>
