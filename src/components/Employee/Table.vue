<script setup>
import { onMounted, ref, watch } from 'vue'
let { data } = defineProps(['data'])
const emit = defineEmits(['pageChanged'])
let pageNumber = ref(0)
let page = ref()
onMounted(() => {
  pageNumber.value = data.last_page
})
// Watch if number changed or not
watch(page, (newValue, oldValue) => {
  emit('pageChanged', newValue)
})
</script>

<template>
  <div class="relative shadow-md sm:rounded-lg h-[77vh] p-4">
    <div class="flex justify-between">
      <!-- Search bar -->
      <div class="w-[25%]">
        <v-text-field
          density="compact"
          label="Search"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
      </div>
      <!-- Filter bar -->
      <div>
        <v-menu transition="scale-transition">
          <template v-slot:activator="{ props }">
            <button class="border p-2 rounded-lg mr-2" v-bind="props">
              <v-icon icon="mdi-filter-outline"></v-icon> Filter
            </button>
          </template>
          <v-list>
            <v-list-item>
              <template v-slot=""> test test2 </template>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu transition="scale-transition">
          <template v-slot:activator="{ props }">
            <button class="border p-2 rounded-lg" v-bind="props">
              <v-icon icon="mdi-sort-variant"></v-icon> Sort by
            </button>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title>Test</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
    <div class="overflow-auto h-[calc(100%-56px)]">
      <!-- Adjust height to account for search and filter bars -->
      <table class="min-w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-200 sticky top-0">
          <tr>
            <th scope="col" class="px-6 py-3">Name</th>
            <th scope="col" class="px-6 py-3">Phone</th>
            <th scope="col" class="px-6 py-3">Email</th>
            <th scope="col" class="px-6 py-3">Location</th>
            <th scope="col" class="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr class="odd:bg-white even:bg-gray-50 border-b" v-for="column in data.data">
            <td class="px-6 py-4">{{ column.fullName }}</td>
            <td class="px-6 py-4">{{ column.phone }}</td>
            <td class="px-6 py-4">{{ column.email }}</td>
            <td class="px-6 py-4">{{ column.country }}</td>
            <td class="px-6 py-4">Delete</td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-end">
        <v-pagination v-model="page" :length="pageNumber" class="my-4 w-[50%]"></v-pagination>
      </div>
    </div>
  </div>
</template>
