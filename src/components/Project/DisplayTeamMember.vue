<script setup>
import { onMounted } from 'vue'

const props = defineProps(['data'])
const listMemberWithImage = ref()
onMounted(() => {
  listMemberWithImage.value = props?.data?.split(',')
  listMemberWithImage.value = listMemberWithImage.value?.map((el) => {
    let persone = el.split(';')
    return {
      img: persone[0],
      name: persone[1]
    }
  })
})
</script>

<template>
  <v-tooltip :text="team.name" v-if="props.data !== ''" v-for="team in listMemberWithImage">
    <template v-slot:activator="{ props }">
      <img v-lazy="team.img" alt="" />
    </template>
  </v-tooltip>
</template>
