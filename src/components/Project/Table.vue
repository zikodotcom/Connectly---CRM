<script setup>
import { axiosClient } from '@/axiosClient'
import { importCountrys } from '@/functions/countrys'
import { computed, onMounted, onUpdated, ref, watch } from 'vue'
import Swal from 'sweetalert2'
import DisplayTeamMember from './DisplayTeamMember.vue'
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
let status = ['In Progress', 'Pending', 'Completed']
let priority = ['Low', 'Medium', 'High']
let clientSearch = ref('')
let responsableSearch = ref('')
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
function getClientFilter() {
  axiosClient.get('/project/filter/idC').then((res) => {
    filterData.value['idC'] = res.data
  })
}
function getEmployeeFilter() {
  axiosClient.get('/project/filter/responsable').then((res) => {
    filterData.value['responsable'] = res.data
  })
}
onMounted(async () => {
  getClientFilter()
  getEmployeeFilter()
})
onUpdated(() => {
  localData.value = { ...localData.value }
})
// TODO: Filter function
const fiterFn = async () => {
  isFilter.value = true
  emit('filterData', { condition: filter.value })
}
// TODO: Reset function
const reset = () => {
  isFilter.value = false
  emit('reset')
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
// client search
watch(clientSearch, async (newValue, oldValue) => {
  if (newValue !== '') {
    filterData.value.idC = filterData.value.idC.filter((el) =>
      el.name.toLowerCase().includes(newValue.toLowerCase())
    )
  } else {
    getClientFilter()
  }
})
// responsable search
watch(responsableSearch, async (newValue, oldValue) => {
  if (newValue !== '') {
    filterData.value.responsable = filterData.value.responsable.filter((el) =>
      el.name.toLowerCase().includes(newValue.toLowerCase())
    )
  } else {
    getEmployeeFilter()
  }
})
// Search function
watch(search, (newValue) => {
  emit('searchData', newValue)
})
// Display team members
const displayTeamMembers = (team) => {
  if (team !== '') {
    let listTeam = team.split(',')
    return listTeam.map((el) => {
      let person = el.split(';')
      return {
        img: person[0],
        name: person[1]
      }
    })
  }
}
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
                  <label>Status</label>

                  <v-select :items="status" variant="outlined" v-model="filter.status"> </v-select>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot="">
                  <label>Priority</label>
                  <v-select :items="priority" variant="outlined" v-model="filter.priority">
                  </v-select>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot="">
                  <label>Client</label>
                  <v-select
                    :items="filterData.idC"
                    item-title="name"
                    item-value="idC"
                    variant="outlined"
                    v-model="filter.idC"
                  >
                    <template v-slot:prepend-item>
                      <v-select-items v-bind="props">
                        <v-text-field label="search" v-model="clientSearch"></v-text-field>
                      </v-select-items>
                    </template>
                  </v-select>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot="">
                  <label>Responsable</label>
                  <v-select
                    :items="filterData.responsable"
                    item-title="name"
                    item-value="responsable"
                    variant="outlined"
                    v-model="filter.responsable"
                  >
                    <template v-slot:prepend-item>
                      <v-select-items v-bind="props">
                        <v-text-field label="search" v-model="responsableSearch"></v-text-field>
                      </v-select-items>
                    </template>
                  </v-select>
                </template>
              </v-list-item>
            </v-list>
            <div class="flex justify-end p-2">
              <button
                class="hover:bg-0-PRIMARY_BLUE hover:text-0-PRIMARY_BLUE_LIGHT text-sm font-normal py-2 px-4 mr-2 rounded-full shadow-lg border mt-2 bg-0-PRIMARY_BLUE_LIGHT border-0-PRIMARY_BLUE text-0-PRIMARY_BLUE"
                @click="reset"
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
    <div class="overflow-auto w-auto h-[calc(100%-56px)]">
      <!-- Adjust height to account for search and filter bars -->
      <table class="min-w-full w-auto text-sm text-left text-gray-500 overflow-x-auto">
        <thead class="text-xs text-gray-700 uppercase bg-gray-200 sticky top-0">
          <tr>
            <th
              v-for="head in headList"
              scope="col"
              class="px-6 py-3 cursor-pointer whitespace-nowrap"
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
            <th scope="col" class="px-6 py-3">Teams</th>
            <th scope="col" class="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody v-if="data.data.length !== 0">
          <tr
            class="odd:bg-white even:bg-gray-50 border-b transition-all ease-in-out"
            v-for="column in data.data"
          >
            <td class="px-6 py-4 whitespace-nowrap">{{ column.projectName }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center w-full">
                <img
                  v-lazy="column.resp_project.photo"
                  alt=""
                  class="w-[40px] h-[40px] rounded-full mr-2 inline-block"
                />
                <span>{{ column.resp_project.fullName }}</span>
              </div>
            </td>
            <td class="px-6 py-4 w-auto whitespace-nowrap">
              <div class="flex items-center w-full">
                <img
                  v-lazy="column.client.image"
                  alt=""
                  class="w-[40px] h-[40px] rounded-full mr-2 inline-block"
                />
                <span>{{ column.client.clientName }}</span>
              </div>
            </td>
            <td class="px-6 py-4 w-auto whitespace-nowrap">{{ column.dateS }}</td>
            <td class="px-6 py-4 w-auto whitespace-nowrap">{{ column.dateF }}</td>
            <td class="px-6 py-4 w-auto whitespace-nowrap">
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
            <td class="px-6 py-4 w-auto whitespace-nowrap">
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
            <td class="px-6 py-4 w-auto whitespace-nowrap flex space-x-1">
              <div v-for="team in column.employees" class="w-auto">
                <v-tooltip :text="team.fullName">
                  <template v-slot:activator="{ props }">
                    <v-avatar :image="team.photo" size="30" v-bind="props"></v-avatar>
                  </template>
                </v-tooltip>
              </div>
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
                    <button class="p-2 block" @click="emit('update', column.id)">Update</button>
                  </div>
                  <div class="hover:bg-0-GREY_GREY_30">
                    <button class="p-2" @click="deleteFn(column.id)">Delete</button>
                  </div>
                  <div class="hover:bg-0-GREY_GREY_30">
                    <button class="p-2" @click="emit('assign', column.id)">Assign team</button>
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
