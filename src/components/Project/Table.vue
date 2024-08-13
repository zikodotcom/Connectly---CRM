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
let elementFilter = ['city', 'state', 'role']
let isFilter = ref(false)
let headList = [
  {
    name: 'Project name',
    key: 'projectName'
  },
  {
    name: 'Responsable',
    key: 'fullName'
  },
  {
    name: 'Client',
    key: 'clientName'
  },
  {
    name: 'Start date',
    key: 'dateS'
  },
  {
    name: 'Due date',
    key: 'dateF'
  },
  {
    name: 'Priority',
    key: 'priority'
  },
  {
    name: 'Status',
    key: 'status'
  }
]
let sort = ref({
  column: '',
  directrion: ''
})
let search = ref('')
let importDataFilter = (column) => {
  // Import city
  axiosClient.get(`/employee/filter/${column}`).then((res) => {
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
  if (isFilter.value) {
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
              <v-list-item>
                <template v-slot="">
                  <label>City</label>

                  <v-select :items="filterData.city" variant="outlined" v-model="filter.city">
                    <template v-slot:prepend-item>
                      <v-select-items v-bind="props">
                        <v-text-field label="search" v-model="citySearch"></v-text-field>
                      </v-select-items>
                    </template>
                  </v-select>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot="">
                  <label>State</label>
                  <v-select :items="filterData.state" variant="outlined" v-model="filter.state">
                    <template v-slot:prepend-item>
                      <v-select-items v-bind="props">
                        <v-text-field label="search" v-model="stateSearch"></v-text-field>
                      </v-select-items>
                    </template>
                  </v-select>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot="">
                  <label>Role</label>
                  <v-select :items="filterData.role" variant="outlined" v-model="filter.role">
                    <template v-slot:prepend-item>
                      <v-select-items v-bind="props">
                        <v-text-field label="search" v-model="roleSearch"></v-text-field>
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
      <table class="min-w-full w-auto text-sm text-left text-gray-500 overflow-x-auto">
        <thead class="text-xs text-gray-700 uppercase bg-gray-200 sticky top-0">
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
            <th scope="col" class="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody v-if="data.data.length !== 0">
          <tr
            class="odd:bg-white even:bg-gray-50 border-b transition-all ease-in-out"
            v-for="column in data.data"
          >
            <td class="px-6 py-4 w-auto">{{ column.projectName }}</td>
            <td class="px-6 py-4 w-auto">
              <div class="flex items-center w-full">
                <img
                  :src="column.photo"
                  alt=""
                  class="w-[40px] h-[40px] rounded-full mr-2 inline-block"
                />
                <span>{{ column.fullName }}</span>
              </div>
            </td>
            <td class="px-6 py-4 w-auto">
              <div class="flex items-center w-full">
                <img
                  :src="column.image"
                  alt=""
                  class="w-[40px] h-[40px] rounded-full mr-2 inline-block"
                />
                <span>{{ column.clientName }}</span>
              </div>
            </td>
            <td class="px-6 py-4 w-auto">{{ column.dateS }}</td>
            <td class="px-6 py-4 w-auto">{{ column.dateF }}</td>
            <td class="px-6 py-4 w-auto">
              <span
                class="text-white p-1 rounded-xl"
                :class="
                  column.priority == 'High'
                    ? 'bg-red-600'
                    : column.priority == 'Medium'
                      ? 'bg-orange-600'
                      : 'bg-yellow-400'
                "
                >{{ column.priority }}</span
              >
            </td>
            <td class="px-6 py-4 w-auto">
              <span
                class="text-white p-1 rounded-xl"
                :class="
                  column.status == 'Completed'
                    ? 'bg-green-600'
                    : column.status == 'In Progress'
                      ? 'bg-blue-500'
                      : 'bg-orange-600'
                "
                >{{ column.status }}</span
              >
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
                    <button class="p-2 block" @click="emit('update', column.id_e)">Update</button>
                  </div>
                  <div class="hover:bg-0-GREY_GREY_30">
                    <button class="p-2" @click="deleteFn(column.id_e)">Delete</button>
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
