<script setup>
import Logo from '@/assets/images/Logo.png'
import User from '@/assets/images/User.png'
</script>

<template>
  <header class="flex justify-between items-center border-b">
    <div class="flex items-center">
      <div class="border-r pr-2 h-full p-2">
        <img :src="Logo" alt="" />
      </div>
      <div class="pl-2">
        <v-btn icon="mdi-magnify" size="small"></v-btn>
      </div>
    </div>

    <div class="flex p-2">
      <button
        class="bg-0-PRIMARY_BLUE text-0-PRIMARY_BLUE_LIGHT text-sm font-semibold py-2 px-4 mr-2 rounded-full shadow-lg"
      >
        Add New <v-icon icon="mdi-plus"></v-icon>
      </button>
      <img :src="User" alt="" />
    </div>
  </header>
</template>
