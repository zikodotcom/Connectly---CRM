<script setup>
import avatar from '@/assets/images/dashboard/Avatar.png'
import { axiosClient } from '@/axiosClient'
import { onMounted, ref } from 'vue'

const data = ref()
onMounted(() => {
  axiosClient.get(`/employee`).then((res) => {
    data.value = res.data.data.slice(0, 3)
  })
})
</script>

<template>
  <div class="w-[50%] p-4 border shadow-sm rounded-xl">
    <div class="flex justify-between">
      <h3 class="font-bold text-0-PRIMARY_NAVY text-lg">Employees</h3>
      <RouterLink to="/employee">View all</RouterLink>
    </div>
    <div class="flex justify-between items-center mt-2" v-for="client in data">
      <div class="flex space-x-2">
        <div>
          <v-avatar :image="client.photo" />
        </div>
        <div>
          <p class="text-0-PRIMARY_NAVY font-semibold text-lg">{{ client.fullName }}</p>
          <p class="text-0-GREY_GREY_70 text-sm">{{ client.email }}</p>
        </div>
      </div>
      <div><RouterLink to="/employee">edit</RouterLink></div>
    </div>
  </div>
</template>
