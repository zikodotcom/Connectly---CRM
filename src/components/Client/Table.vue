<script setup>
import { axiosClient } from '@/axiosClient'
import { importCountrys } from '@/functions/countrys'
import { onMounted, onUpdated, ref, watch } from 'vue'
import Swal from 'sweetalert2'
let { data, pageNumber } = defineProps(['data', 'pageNumber'])
let localData = ref(data)
const emit = defineEmits([
  'pageChanged',
  'filterData',
  'sortData',
  'searchData',
  'pageChangedFilter',
  'reset',
  'update',
  'delete'
])
let page = ref()
let filter = ref({})
let filterData = ref({})
let countrySearch = ref('')
let citySearch = ref('')
let stateSearch = ref('')
let roleSearch = ref('')
let elementFilter = ['industry', 'currency', 'languages', 'city', 'state']
let isFilter = ref(false)
let headList = [
  {
    name: 'Name',
    key: 'clientName'
  },
  {
    name: 'Phone',
    key: 'phone'
  },
  {
    name: 'Email',
    key: 'email'
  },
  {
    name: 'Location',
    key: 'country'
  },
  {
    name: 'Owner',
    key: 'owner'
  }
]
let sort = ref({
  column: '',
  directrion: ''
})
let search = ref('')
let importDataFilter = (column) => {
  // Import city
  axiosClient.get(`/client/filter/${column}`).then((res) => {
    filterData.value[column] = res.data
  })
}
onMounted(async () => {
  // Import country
  filterData.value.country = await importCountrys()
  // Import city
  elementFilter.map((el) => {
    importDataFilter(el)
  })
})
onUpdated(() => {
  localData.value = { ...localData.value }
})
// TODO: Search function in filter
const searchFn = async (column, newValue) => {
  let search = newValue
  if (search == '') {
    importDataFilter(column)
    filterData.value = { ...filterData.value }
  } else {
    filterData.value[column] = filterData.value[column].filter((el) =>
      el.toLowerCase().includes(search.toLowerCase())
    )
    filterData.value = { ...filterData.value }
  }
}
// TODO: Filter function
const fiterFn = async () => {
  emit('filterData', { condition: filter.value })
}
// TODO: Sort function
const sortFn = (column) => {
  sort.value = {
    column: column,
    directrion: sort.value.directrion == 'ASC' ? 'DESC' : 'ASC'
  }
  emit('sortData', sort.value)
}
// TODO: Delete function
const deleteFn = (id) => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })
  swalWithBootstrapButtons
    .fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!'
    })
    .then((result) => {
      if (result.isConfirmed) {
        emit('delete', id)
      }
    })
}
// Watch if number changed or not
watch(page, (newValue, oldValue) => {
  if (isFilter) {
    emit('pageChangedFilter', { condition: filter.value }, newValue)
  } else {
    emit('pageChanged', newValue)
  }
})
// Search country
watch(countrySearch, async (newValue, oldValue) => {
  let search = newValue
  if (search == '') {
    filterData.value.country = await importCountrys()
    filterData.value = { ...filterData.value }
  } else {
    filterData.value.country = filterData.value.country.filter((el) =>
      el.name.toLowerCase().includes(search.toLowerCase())
    )
    filterData.value = { ...filterData.value }
  }
})
// City search
watch(citySearch, async (newValue, oldValue) => {
  searchFn('city', newValue)
})
// state search
watch(stateSearch, async (newValue, oldValue) => {
  searchFn('state', newValue)
})
// role search
watch(roleSearch, async (newValue, oldValue) => {
  searchFn('role', newValue)
})
// Search function
watch(search, (newValue) => {
  emit('searchData', newValue)
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
          v-model="search"
        ></v-text-field>
      </div>
      <!-- Filter bar -->
      <div>
        <v-menu transition="scale-transition" location="start" :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <button class="border p-2 rounded-lg mr-2" v-bind="props">
              <v-icon icon="mdi-filter-outline"></v-icon> Filter
            </button>
          </template>
          <v-card
            class="mx-auto"
            min-width="300"
            max-height="500"
            prepend-icon="mdi-filter-outline"
            title="Filter"
          >
            <v-list>
              <v-list-item>
                <template v-slot="">
                  <label>Country</label>
                  <v-select
                    min-width="310"
                    max-width="310"
                    variant="outlined"
                    :items="filterData.country"
                    v-model="filter.country"
                  >
                    <template v-slot:prepend-item>
                      <v-select-items v-bind="props">
                        <v-text-field label="search" v-model="countrySearch"></v-text-field>
                      </v-select-items>
                    </template>
                    <template v-slot:selection="{ item, index }">
                      <div class="flex items-center" v-if="item.value !== ''">
                        <img :src="item.raw.image" alt="" class="w-8 h-5 mr-4" />
                        <span>{{ item.value.name }}</span>
                      </div>
                    </template>
                    <template v-slot:item="{ item, props }">
                      <v-select-items v-bind="props">
                        <div class="flex items-center p-4 cursor-pointer hover:bg-0-GREY_GREY_50">
                          <img :src="item.props.title.image" alt="" class="w-8 h-5 mr-4" />
                          <span>{{ item.props.title.name }}</span>
                        </div>
                      </v-select-items>
                    </template>
                  </v-select>
                </template>
              </v-list-item>
              <v-list-item v-for="itemFilter in elementFilter">
                <template v-slot="">
                  <label>{{ itemFilter }}</label>

                  <v-select
                    :items="filterData[itemFilter]"
                    variant="outlined"
                    v-model="filter[itemFilter]"
                  >
                    <template v-slot:prepend-item>
                      <v-select-items v-bind="props">
                        <v-text-field label="search" v-model="citySearch"></v-text-field>
                      </v-select-items>
                    </template>
                  </v-select>
                </template>
              </v-list-item>
            </v-list>
            <div class="flex justify-end p-2">
              <button
                class="hover:bg-0-PRIMARY_BLUE hover:text-0-PRIMARY_BLUE_LIGHT text-sm font-normal py-2 px-4 mr-2 rounded-full shadow-lg border mt-2 bg-0-PRIMARY_BLUE_LIGHT border-0-PRIMARY_BLUE text-0-PRIMARY_BLUE"
                @click="emit('reset')"
              >
                Reset
              </button>
              <button
                class="bg-0-PRIMARY_BLUE text-0-PRIMARY_BLUE_LIGHT text-sm font-normal py-2 px-4 mr-2 rounded-full shadow-lg border mt-2 hover:bg-0-PRIMARY_BLUE_LIGHT hover:border-0-PRIMARY_BLUE hover:text-0-PRIMARY_BLUE"
                @click="fiterFn"
              >
                Filter
              </button>
            </div>
          </v-card>
        </v-menu>
      </div>
    </div>
    <div class="overflow-auto h-[calc(100%-56px)]">
      <!-- Adjust height to account for search and filter bars -->
      <table class="min-w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-200 sticky top-0 z-50">
          <tr>
            <th
              v-for="head in headList"
              scope="col"
              class="px-6 py-3 cursor-pointer"
              @click="sortFn(head.key)"
            >
              {{ head.name }} {{ ' ' }}
              <span
                :class="[
                  sort.column == head.key && sort.directrion == 'ASC'
                    ? 'text-0-GREY_GREY_100'
                    : 'text-0-GREY_GREY_50'
                ]"
                ><v-icon icon="mdi-arrow-down"></v-icon
              ></span>
              <span
                :class="[
                  sort.column == head.key && sort.directrion == 'DESC'
                    ? 'text-0-GREY_GREY_100'
                    : 'text-0-GREY_GREY_50'
                ]"
                ><v-icon icon="mdi-arrow-up"></v-icon
              ></span>
            </th>
            <th scope="col" class="px-6 py-3 z-50">Contact</th>
            <th scope="col" class="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody v-if="data.data.length !== 0">
          <tr
            class="odd:bg-white even:bg-gray-50 border-b transition-all ease-in-out"
            v-for="column in data.data"
          >
            <td class="px-6 py-4 w-[16%]">
              <div class="flex items-center w-full">
                <img
                  :src="column.image"
                  alt=""
                  class="w-[40px] h-[40px] rounded-full mr-2 inline-block"
                />
                <span>{{ column.clientName }}</span>
              </div>
            </td>
            <td class="px-6 py-4 w-[16%]">{{ column.phone }}</td>
            <td class="px-6 py-4 w-[16%]">{{ column.email }}</td>
            <td class="px-6 py-4 w-[16%]">{{ column.country }}</td>
            <td class="px-6 py-4 w-[16%]">{{ column.owner }}</td>
            <td class="px-6 py-4 w-[16%]">
              <a target="_blank" :href="column.facebook" class="text-0-PRIMARY_BLUE"
                ><v-icon icon="mdi-facebook"></v-icon
              ></a>
              <a target="_blank" :href="column.twitter" class="text-[#1DA0F1]"
                ><v-icon icon="mdi-twitter"></v-icon
              ></a>
              <a target="_blank" :href="column.instgram" class="text-[#D5447F]"
                ><v-icon icon="mdi-instagram"></v-icon
              ></a>
              <a target="_blank" :href="column.linkedin" class="text-[#086B9C]"
                ><v-icon icon="mdi-linkedin"></v-icon
              ></a>
              <a target="_blank" :href="`https://wa.me/${column.whatsapp}`" class="text-[#47E864]"
                ><v-icon icon="mdi-whatsapp"></v-icon
              ></a>
            </td>
            <td class="px-6 py-4">
              <v-menu transition="scale-transition" :close-on-content-click="false">
                <template v-slot:activator="{ props }">
                  <button class="border p-2 rounded-lg mr-2" v-bind="props">
                    <v-icon icon="mdi-dots-vertical"></v-icon>
                  </button>
                </template>
                <v-card>
                  <div class="hover:bg-0-GREY_GREY_30">
                    <button class="p-2 block" @click="emit('update', column.idC)">Update</button>
                  </div>
                  <div class="hover:bg-0-GREY_GREY_30">
                    <button class="p-2" @click="deleteFn(column.idC)">Delete</button>
                  </div>
                </v-card>
              </v-menu>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr class="border-b border-r border-l p-4">
            <td colspan="6" class="px-6 py-4 text-center">No data to show</td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-end">
        <v-pagination v-model="page" :length="pageNumber" class="my-4 w-[50%]"></v-pagination>
      </div>
    </div>
  </div>
</template>
