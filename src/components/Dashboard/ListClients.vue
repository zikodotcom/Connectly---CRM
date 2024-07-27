<script setup>
import avatar from '@/assets/images/dashboard/Avatar.png'
</script>

<template>
  <div class="w-[50%] p-4 border shadow-sm rounded-xl">
    <div class="flex justify-between">
      <h3 class="font-bold text-0-PRIMARY_NAVY text-lg">Clients</h3>
      <a href="">View all</a>
    </div>
    <div class="flex justify-between items-center mt-2">
      <div class="flex space-x-2">
        <div>
          <img :src="avatar" alt="" />
        </div>
        <div>
          <p class="text-0-PRIMARY_NAVY font-semibold text-lg">Zakaria sdik</p>
          <p class="text-0-GREY_GREY_70 text-sm">zakariasdik123@gmail.com</p>
        </div>
      </div>
      <div>edit</div>
    </div>

    <div class="flex justify-between items-center mt-2">
      <div class="flex space-x-2">
        <div>
          <img :src="avatar" alt="" />
        </div>
        <div>
          <p class="text-0-PRIMARY_NAVY font-semibold text-lg">Zakaria sdik</p>
          <p class="text-0-GREY_GREY_70 text-sm">zakariasdik123@gmail.com</p>
        </div>
      </div>
      <div>edit</div>
    </div>

    <div class="flex justify-between items-center mt-2">
      <div class="flex space-x-2">
        <div>
          <img :src="avatar" alt="" />
        </div>
        <div>
          <p class="text-0-PRIMARY_NAVY font-semibold text-lg">Zakaria sdik</p>
          <p class="text-0-GREY_GREY_70 text-sm">zakariasdik123@gmail.com</p>
        </div>
      </div>
      <div>edit</div>
    </div>
  </div>
</template>
