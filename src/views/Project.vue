<script setup>
import { axiosClient } from '@/axiosClient'
import Table from '@/components/Project/Table.vue'
import { onMounted, ref, watch } from 'vue'
import { validationRules } from '@/components/Project/Validation'
import { importCountrys } from '@/functions/countrys'
import { getCookie } from '@/functions/getCookie'
import { useToast } from 'vue-toastification'
import { useDate } from 'vuetify'

const adapter = useDate()
let data = ref(null)
let dialog = ref(false)
let dialogUpdate = ref(false)
let dialogTeam = ref(false)
let items = ref([])
let pageNumber = ref(0)
let form = ref(null)
const formData = ref({})
const formDataUpdate = ref({})
const toast = useToast()
let error = ref({})
const idP = ref(0)
const isLoad = ref(false)
const dateS = ref(false)
const dateF = ref(false)
const clientList = ref([])
const employeeList = ref([])
const listTeam = ref([])

onMounted(async () => {
  display(1)
  items.value = await importCountrys()
  axiosClient.get('/getClient').then((res) => {
    clientList.value = res.data
  })
  axiosClient.get('/getEmployee').then((res) => {
    employeeList.value = res.data
  })
})
// display data function
const display = (page, isFilter, datas) => {
  isLoad.value = true
  if (isFilter) filter(datas, page)
  axiosClient.get(`/project?page=${page}`).then((res) => {
    isLoad.value = false
    data.value = res.data
    pageNumber.value = res.data.last_page
  })
}
// Filter data
const filter = async (datas, page = 1) => {
  isLoad.value = true
  await axiosClient.get('sanctum/csrf-cookie')
  await axiosClient
    .post(`/project/filter?page=${page}`, datas, {
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
      }
    })
    .then((res) => {
      data.value = res.data
      pageNumber.value = res.data.last_page
      isLoad.value = false
    })
}
// Sort data
const sort = (datas) => {
  isLoad.value = true
  axiosClient.get(`/project/sort/${datas.column}/${datas.directrion}`).then((res) => {
    isLoad.value = true
    data.value = res.data
  })
}
// Search data
const search = (search) => {
  isLoad.value = true
  if (search !== '') {
    axiosClient.get(`/project/search/${search}`).then((res) => {
      isLoad.value = false
      data.value = res.data
      pageNumber.value = res.data.last_page
    })
  } else {
    display(1)
  }
}
// Add project
const addProject = async () => {
  let isValidate = await form.value.validate()
  if (isValidate.valid) {
    formData.value['dateS'] = changeFormat(formData.value['dateS'])
    formData.value['dateF'] = changeFormat(formData.value['dateF'])
    isLoad.value = true
    await axiosClient.get('sanctum/csrf-cookie')
    await axiosClient
      .post('/project', formData.value, {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
        }
      })
      .then((res) => {
        if (res.status == 200) {
          isLoad.value = false
          display(1)
          dialog.value = false
          formData.value = {}
          toast.success('Project added by success!', { timeout: 3000, closeOnClick: true })
        }
      })
      .catch(({ response }) => {
        isLoad.value = false
        if (response.status == 422) {
          for (const key in response.data.errors) {
            error.value[key] = response.data.errors[key]
          }
        } else {
          toast.error('Server error!', { timeout: 3000, closeOnClick: true })
        }
      })
  }
}
// Update project
const updateProject = async () => {
  let isValidate = await form.value.validate()

  if (isValidate.valid) {
    isLoad.value = true
    await axiosClient.get('sanctum/csrf-cookie')
    await axiosClient
      .post(`/project/${idP.value}?_method=PUT`, formDataUpdate.value, {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
        }
      })
      .then((res) => {
        if (res.status == 200) {
          isLoad.value = false
          display(1)
          dialogUpdate.value = false
          toast.success('Project updated by success!', { timeout: 3000, closeOnClick: true })
        }
      })
      .catch(({ response }) => {
        isLoad.value = false
        if (response.status == 422) {
          for (const key in response.data.errors) {
            error.value[key] = response.data.errors[key]
          }
        } else {
          toast.error('Server error!', { timeout: 3000, closeOnClick: true })
        }
      })
  }
}
// Fill the update form
const fillForm = (id) => {
  axiosClient.get(`/project/${id}`).then((res) => {
    for (const key in res.data) {
      if (key == 'dateS' || key == 'dateF') {
        formDataUpdate.value[key] = adapter.parseISO(res.data[key])
      } else {
        formDataUpdate.value[key] = res.data[key]
      }
      dialogUpdate.value = true
    }
    idP.value = id
  })
}

// delete
const deleteFn = async (id) => {
  await axiosClient.get('sanctum/csrf-cookie')
  await axiosClient
    .delete(`/project/${id}`, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
      }
    })
    .then((res) => {
      display(data.value.current_page)
      toast.success('Project deleted by success!', { timeout: 3000, closeOnClick: true })
    })
    .catch((err) => {
      toast.error('Server error!', { timeout: 3000, closeOnClick: true })
    })
}

// Change the forma of date
function changeFormat(date) {
  let dates = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
  return dates
}
// Assign team dialog
const assignTeamDialog = (id) => {
  dialogTeam.value = true
  idP.value = id
}
// Assign team function
const assignTeam = async () => {
  await axiosClient.get('sanctum/csrf-cookie')
  await axiosClient
    .post(
      '/project/assignTeam',
      { id: idP.value, id_e: listTeam.value },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
        }
      }
    )
    .then((res) => {
      display(data.value.current_page)
      toast.success('Teams assigned by success!', { timeout: 3000, closeOnClick: true })
    })
    .catch((err) => {
      toast.error('Server error!', { timeout: 3000, closeOnClick: true })
    })
}
// search employee
const searchEmployee = (e) => {
  if (e.target.value !== '') {
    employeeList.value = employeeList.value.filter((el) =>
      el.fullName.toLowerCase().includes(e.target.value.toLowerCase())
    )
  } else {
    axiosClient.get('/getEmployee').then((res) => {
      employeeList.value = res.data
    })
  }
}
</script>

<template>
  <div class="py-2 px-4">
    <section class="flex justify-between items-center">
      <h4 class="font-bold text-0-PRIMARY_NAVY text-lg">Projects</h4>
      <button
        @click="dialog = true"
        class="bg-0-PRIMARY_BLUE text-0-PRIMARY_WHITE font-semibold rounded-md p-3 flex items-center border hover:border-0-PRIMARY_BLUE hover:text-0-PRIMARY_BLUE hover:bg-transparent"
      >
        <v-icon icon="mdi-plus" large="small"></v-icon>Add projects
      </button>
    </section>
  </div>
  <div class="bg-white m-4">
    <Table
      :data="data"
      :pageNumber="pageNumber"
      v-if="data"
      @page-changed="display"
      @filter-data="filter"
      @sort-data="sort"
      @search-data="search"
      @pageChangedFilter="filter"
      @reset="display(1)"
      @update="fillForm"
      @delete="deleteFn"
      @assign="assignTeamDialog"
    />
  </div>
  <!-- Modal add -->
  <v-dialog max-width="700" v-model="dialog">
    <v-card prepend-icon="mdi-account" title="Add project">
      <v-card-text>
        <v-form ref="form" @submit.prevent="addProject">
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Project Name"
                variant="outlined"
                :error-messages="error.projectName"
                v-model="formData.projectName"
                :rules="validationRules.projectName"
                class="custom-inpt"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-menu
                v-model="dateS"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ props }">
                  <v-text-field
                    label="Start date"
                    variant="outlined"
                    class="custom-inpt"
                    persistent-hint
                    readonly
                    v-model="formData.dateS"
                    v-bind="props"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="formData.dateS" no-title></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="6">
              <v-menu
                v-model="dateF"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ props }">
                  <v-text-field
                    label="End date"
                    variant="outlined"
                    class="custom-inpt"
                    persistent-hint
                    readonly
                    v-model="formData.dateF"
                    v-bind="props"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="formData.dateF" no-title></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="6">
              <v-select
                label="Priority"
                :items="['Low', 'Medium', 'High']"
                variant="outlined"
                :error-messages="error.priority"
                v-model="formData.priority"
                :rules="validationRules.priority"
                class="custom-inpt"
                required
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                label="Status"
                :items="['Pending', 'In Progress', 'Completed']"
                variant="outlined"
                :error-messages="error.status"
                v-model="formData.status"
                :rules="validationRules.status"
                class="custom-inpt"
                required
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Project amount"
                variant="outlined"
                :error-messages="error.amount"
                v-model="formData.amount"
                :rules="validationRules.amount"
                class="custom-inpt"
                type="number"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select
                label="Client name"
                :items="clientList"
                variant="outlined"
                item-value="idC"
                :error-messages="error.idC"
                v-model="formData.idC"
                :rules="validationRules.idC"
                class="custom-inpt"
                required
              >
                <template v-slot:selection="{ item, index }">
                  <div class="flex items-center" v-if="item.value !== ''">
                    <img v-lazy="item.raw.image" alt="" class="w-8 h-8 mr-4 rounded-full" />
                    <span>{{ item.raw.clientName.substring(0, 20) }}</span>
                  </div>
                </template>
                <template v-slot:item="{ item, props }">
                  <v-select-items v-bind="props">
                    <div class="flex items-center p-4 cursor-pointer hover:bg-0-GREY_GREY_50">
                      <img
                        v-lazy="item.props.title.image"
                        alt=""
                        class="w-8 h-8 mr-4 rounded-full"
                      />
                      <span>{{ item.props.title.clientName }}</span>
                    </div>
                  </v-select-items>
                </template>
              </v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                label="Responsable"
                :items="employeeList"
                variant="outlined"
                item-value="id_e"
                :error-messages="error.responsable"
                v-model="formData.responsable"
                :rules="validationRules.responsable"
                class="custom-inpt"
                required
              >
                <template v-slot:selection="{ item, index }">
                  <div class="flex items-center" v-if="item.value !== ''">
                    <img v-lazy="item.raw.photo" alt="" class="w-8 h-8 mr-4 rounded-full" />
                    <span>{{ item.raw.fullName.substring(0, 20) }}</span>
                  </div>
                </template>
                <template v-slot:item="{ item, props }">
                  <v-select-items v-bind="props">
                    <div class="flex items-center p-4 cursor-pointer hover:bg-0-GREY_GREY_50">
                      <img
                        v-lazy="item.props.title.photo"
                        alt=""
                        class="w-8 h-8 mr-4 rounded-full"
                      />
                      <span>{{ item.props.title.fullName }}</span>
                    </div>
                  </v-select-items>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-textarea
                label="Description"
                variant="outlined"
                :error-messages="error.description"
                v-model="formData.description"
                :rules="validationRules.description"
                class="custom-inpt"
                required
              ></v-textarea>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>

            <button
              class="hover:bg-0-PRIMARY_BLUE hover:text-0-PRIMARY_BLUE_LIGHT text-sm font-normal py-2 px-4 mr-2 rounded-full shadow-lg border mt-2 bg-0-PRIMARY_BLUE_LIGHT border-0-PRIMARY_BLUE text-0-PRIMARY_BLUE"
              @click="dialog = false"
            >
              Close
            </button>

            <button
              class="bg-0-PRIMARY_BLUE !text-0-PRIMARY_BLUE_LIGHT text-sm font-normal py-2 px-4 mr-2 rounded-full shadow-lg border mt-2 hover:bg-0-PRIMARY_BLUE_LIGHT hover:border-0-PRIMARY_BLUE hover:!text-0-PRIMARY_BLUE"
              type="submit"
            >
              Add
            </button>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
  <!-- Modal update -->
  <v-dialog max-width="700" v-model="dialogUpdate">
    <v-card prepend-icon="mdi-account" title="Update project">
      <v-card-text>
        <v-form ref="form" @submit.prevent="updateProject">
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Project Name"
                variant="outlined"
                :error-messages="error.projectName"
                v-model="formDataUpdate.projectName"
                :rules="validationRules.projectName"
                class="custom-inpt"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-menu
                v-model="dateS"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ props }">
                  <v-text-field
                    label="Start date"
                    variant="outlined"
                    class="custom-inpt"
                    persistent-hint
                    readonly
                    v-model="formDataUpdate.dateS"
                    v-bind="props"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="formDataUpdate.dateS" no-title></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="6">
              <v-menu
                v-model="dateF"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ props }">
                  <v-text-field
                    label="End date"
                    variant="outlined"
                    class="custom-inpt"
                    persistent-hint
                    readonly
                    v-model="formDataUpdate.dateF"
                    v-bind="props"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="formDataUpdate.dateF" no-title></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="6">
              <v-select
                label="Priority"
                :items="['Low', 'Medium', 'High']"
                variant="outlined"
                :error-messages="error.priority"
                v-model="formDataUpdate.priority"
                :rules="validationRules.priority"
                class="custom-inpt"
                required
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                label="Status"
                :items="['Pending', 'In Progress', 'Completed']"
                variant="outlined"
                :error-messages="error.status"
                v-model="formDataUpdate.status"
                :rules="validationRules.status"
                class="custom-inpt"
                required
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Project amount"
                variant="outlined"
                :error-messages="error.amount"
                v-model="formDataUpdate.amount"
                :rules="validationRules.amount"
                class="custom-inpt"
                type="number"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select
                label="Client name"
                :items="clientList"
                variant="outlined"
                item-value="idC"
                :error-messages="error.idC"
                v-model="formDataUpdate.idC"
                :rules="validationRules.idC"
                class="custom-inpt"
                required
              >
                <template v-slot:selection="{ item, index }">
                  <div class="flex items-center" v-if="item.value !== ''">
                    <img v-lazy="item.raw.image" alt="" class="w-8 h-8 mr-4 rounded-full" />
                    <span>{{ item.raw.clientName.substring(0, 20) }}</span>
                  </div>
                </template>
                <template v-slot:item="{ item, props }">
                  <v-select-items v-bind="props">
                    <div class="flex items-center p-4 cursor-pointer hover:bg-0-GREY_GREY_50">
                      <img
                        v-lazy="item.props.title.image"
                        alt=""
                        class="w-8 h-8 mr-4 rounded-full"
                      />
                      <span>{{ item.props.title.clientName }}</span>
                    </div>
                  </v-select-items>
                </template>
              </v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                label="Responsable"
                :items="employeeList"
                variant="outlined"
                item-value="id_e"
                :error-messages="error.responsable"
                v-model="formDataUpdate.responsable"
                :rules="validationRules.responsable"
                class="custom-inpt"
                required
              >
                <template v-slot:selection="{ item, index }">
                  <div class="flex items-center" v-if="item.value !== ''">
                    <img v-lazy="item.raw.photo" alt="" class="w-8 h-8 mr-4 rounded-full" />
                    <span>{{ item.raw.fullName.substring(0, 20) }}</span>
                  </div>
                </template>
                <template v-slot:item="{ item, props }">
                  <v-select-items v-bind="props">
                    <div class="flex items-center p-4 cursor-pointer hover:bg-0-GREY_GREY_50">
                      <img
                        v-lazy="item.props.title.photo"
                        alt=""
                        class="w-8 h-8 mr-4 rounded-full"
                      />
                      <span>{{ item.props.title.fullName }}</span>
                    </div>
                  </v-select-items>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-textarea
                label="Description"
                variant="outlined"
                :error-messages="error.description"
                v-model="formDataUpdate.description"
                :rules="validationRules.description"
                class="custom-inpt"
                required
              ></v-textarea>
            </v-col>
          </v-row>
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>

            <button
              class="hover:bg-0-PRIMARY_BLUE hover:text-0-PRIMARY_BLUE_LIGHT text-sm font-normal py-2 px-4 mr-2 rounded-full shadow-lg border mt-2 bg-0-PRIMARY_BLUE_LIGHT border-0-PRIMARY_BLUE text-0-PRIMARY_BLUE"
              @click="dialog = false"
            >
              Close
            </button>

            <button
              class="bg-0-PRIMARY_BLUE !text-0-PRIMARY_BLUE_LIGHT text-sm font-normal py-2 px-4 mr-2 rounded-full shadow-lg border mt-2 hover:bg-0-PRIMARY_BLUE_LIGHT hover:border-0-PRIMARY_BLUE hover:!text-0-PRIMARY_BLUE"
              type="submit"
            >
              Update
            </button>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
  <!-- Assign team -->
  <v-dialog max-width="700" v-model="dialogTeam">
    <v-card title="Assign team">
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field label="search" @input="searchEmployee"></v-text-field>
          </v-col>
        </v-row>
        <div class="max-h-[400px] overflow-x-hidden">
          <v-row v-for="employee in employeeList">
            <v-col cols="6">
              <div class="flex items-center">
                <img v-lazy="employee.photo" alt="" class="w-8 h-8 rounded-full mr-2" />
                <span>{{ employee.fullName }}</span>
              </div>
            </v-col>
            <v-col cols="4"></v-col>
            <v-col cols="2">
              <v-switch
                v-model="listTeam"
                color="success"
                :value="employee.id_e"
                hide-details
              ></v-switch
            ></v-col>
          </v-row>
        </div>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <button
          class="hover:bg-0-PRIMARY_BLUE hover:text-0-PRIMARY_BLUE_LIGHT text-sm font-normal py-2 px-4 mr-2 rounded-full shadow-lg border mt-2 bg-0-PRIMARY_BLUE_LIGHT border-0-PRIMARY_BLUE text-0-PRIMARY_BLUE"
          @click="dialogTeam = false"
        >
          Close
        </button>

        <button
          class="bg-0-PRIMARY_BLUE !text-0-PRIMARY_BLUE_LIGHT text-sm font-normal py-2 px-4 mr-2 rounded-full shadow-lg border mt-2 hover:bg-0-PRIMARY_BLUE_LIGHT hover:border-0-PRIMARY_BLUE hover:!text-0-PRIMARY_BLUE"
          @click="assignTeam"
        >
          Assign teams
        </button>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <Loader v-if="isLoad" />
</template>
<style>
.custom-inpt .v-input__control .v-field--variant-outlined .v-field__field .v-field__input {
  background-color: #f6fafd !important;
  border: 1px solid #d6e1e6 !important;
}
.custom-inpt .v-input__control .v-field--variant-outlined .v-field__field .v-field__input:hover {
  background-color: #f6fafd !important;
  border: 1px solid #d6e1e6 !important;
}
.custom-inpt .v-input__control .v-field--variant-outlined .v-field__field .v-field__input:focus {
  background-color: #f6fafd !important;
  border: 1px solid #d6e1e6 !important;
}
.custom-inpt .v-input__control .v-field--variant-outlined .v-field__field {
  background-color: #f6fafd !important;
  border: 1px solid #d6e1e6 !important;
}
</style>
