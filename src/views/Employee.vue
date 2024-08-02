<script setup>
import { axiosClient } from '@/axiosClient'
import Table from '@/components/Employee/Table.vue'
import { onMounted, ref } from 'vue'
import { validationRules } from '@/components/Employee/Validation'
import { importCountrys } from '@/functions/countrys'
import { getCookie } from '@/functions/getCookie'
import { useToast } from 'vue-toastification'

let data = ref(null)
let dialog = ref(false)
let dialogUpdate = ref(false)
let items = ref([])
let pageNumber = ref(0)
let form = ref(null)
const formData = ref({})
const formDataUpdate = ref({})
const toast = useToast()
let error = ref({})
const id_e = ref(0)

onMounted(async () => {
  display(1)
  items.value = await importCountrys()
})
// display data function
const display = (page, isFilter, datas) => {
  if (isFilter) filter(datas, page)
  axiosClient.get(`/employee?page=${page}`).then((res) => {
    data.value = res.data
    pageNumber.value = res.data.last_page
  })
}
// Filter data
const filter = async (datas, page = 1) => {
  await axiosClient.get('sanctum/csrf-cookie')
  await axiosClient
    .post(`/employee/filter?page=${page}`, datas, {
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
      }
    })
    .then((res) => {
      data.value = res.data
      pageNumber.value = res.data.last_page
    })
}
// Sort data
const sort = (datas) => {
  axiosClient.get(`/employee/sort/${datas.column}/${datas.directrion}`).then((res) => {
    data.value = res.data
  })
}
// Search data
const search = (search) => {
  if (search !== '') {
    axiosClient.get(`/employee/search/${search}`).then((res) => {
      data.value = res.data
      pageNumber.value = res.data.last_page
    })
  } else {
    display(1)
  }
}
// Add employee
const addEmployee = async () => {
  let formData2 = new FormData()
  for (const key in formData.value) {
    formData2.append(key, formData.value[key])
  }
  if (form.value.validate()) {
    await axiosClient.get('sanctum/csrf-cookie')
    await axiosClient
      .post('/employee', formData2, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
        }
      })
      .then((res) => {
        if (res.status == 200) {
          display(1)
          dialog.value = false
          formData.value = {}
          toast.success('Employee added by success!', { timeout: 3000, closeOnClick: true })
        }
      })
      .catch(({ response }) => {
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
// Update employee
const updateEmployee = async () => {
  let formData2 = new FormData()
  for (const key in formDataUpdate.value) {
    formData2.append(key, formDataUpdate.value[key])
  }
  if (form.value.validate()) {
    await axiosClient.get('sanctum/csrf-cookie')
    await axiosClient
      .post(`/employee/${id_e.value}?_method=PUT`, formData2, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
        }
      })
      .then((res) => {
        if (res.status == 200) {
          display(1)
          dialogUpdate.value = false
          toast.success('Employee updated by success!', { timeout: 3000, closeOnClick: true })
        }
      })
      .catch(({ response }) => {
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
  axiosClient.get(`/employee/${id}`).then((res) => {
    for (const key in res.data) {
      formDataUpdate.value[key] = res.data[key]
      dialogUpdate.value = true
    }
    id_e.value = id
  })
}
// delete
const deleteFn = async (id) => {
  await axiosClient.get('sanctum/csrf-cookie')
  await axiosClient
    .delete(`/employee/${id}`, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
      }
    })
    .then((res) => {
      display(data.value.current_page)
      toast.success('Employee deleted by success!', { timeout: 3000, closeOnClick: true })
    })
    .catch((err) => {
      toast.error('Server error!', { timeout: 3000, closeOnClick: true })
    })
}
</script>

<template>
  <div class="py-2 px-4">
    <section class="flex justify-between items-center">
      <h4 class="font-bold text-0-PRIMARY_NAVY text-lg">Employees</h4>
      <button
        @click="dialog = true"
        class="bg-0-PRIMARY_BLUE text-0-PRIMARY_WHITE font-semibold rounded-md p-3 flex items-center border hover:border-0-PRIMARY_BLUE hover:text-0-PRIMARY_BLUE hover:bg-transparent"
      >
        <v-icon icon="mdi-plus" large="small"></v-icon>Add employees
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
    />
  </div>
  <!-- Modal add -->
  <v-dialog max-width="700" v-model="dialog">
    <v-card prepend-icon="mdi-account" title="User Profile">
      <v-card-text>
        <v-form ref="form" @submit.prevent="addEmployee">
          <v-row>
            <v-file-input
              clearable
              label="File input"
              variant="outlined"
              class="custom-inpt"
              accept="image/png, image/jpeg, image/bmp"
              prepend-icon="mdi-camera"
              :error-messages="error.photo"
              v-model="formData.photo"
            ></v-file-input>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Name"
                variant="outlined"
                :error-messages="error.fullName"
                v-model="formData.fullName"
                :rules="validationRules.name"
                class="custom-inpt"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Username"
                variant="outlined"
                :error-messages="error.userName"
                v-model="formData.userName"
                :rules="validationRules.username"
                class="custom-inpt"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Email"
                variant="outlined"
                :error-messages="error.email"
                v-model="formData.email"
                :rules="validationRules.email"
                class="custom-inpt"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Phone"
                variant="outlined"
                :error-messages="error.phone"
                v-model="formData.phone"
                :rules="validationRules.phone"
                class="custom-inpt"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-select
                :items="items"
                item-text="name"
                item-value="name"
                variant="outlined"
                label="Country"
                :error-messages="error.country"
                v-model="formData.country"
                :rules="validationRules.country"
                class="custom-inpt"
                required
              >
                <template v-slot:selection="{ item, index }">
                  <div class="flex items-center" v-if="item.value !== ''">
                    <img :src="item.raw.image" alt="" class="w-8 h-5 mr-4" />
                    <span>{{ item.value }}</span>
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
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Adresse"
                variant="outlined"
                :error-messages="error.adresse"
                v-model="formData.adresse"
                :rules="validationRules.address"
                class="custom-inpt"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="City"
                variant="outlined"
                :error-messages="error.city"
                v-model="formData.city"
                :rules="validationRules.city"
                class="custom-inpt"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="State"
                variant="outlined"
                :error-messages="error.state"
                v-model="formData.state"
                :rules="validationRules.state"
                class="custom-inpt"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Zip code"
                variant="outlined"
                :error-messages="error.zipCode"
                v-model="formData.zipCode"
                :rules="validationRules.zip"
                class="custom-inpt"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Role"
                variant="outlined"
                :error-messages="error.role"
                v-model="formData.role"
                :rules="validationRules.role"
                class="custom-inpt"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Salary"
                variant="outlined"
                :error-messages="error.salary"
                v-model="formData.salary"
                :rules="validationRules.salary"
                class="custom-inpt"
                required
              ></v-text-field>
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
    <v-card prepend-icon="mdi-account" title="Update employee">
      <v-card-text>
        <v-form ref="form" @submit.prevent="updateEmployee">
          <v-row>
            <v-file-input
              clearable
              label="File input"
              variant="outlined"
              class="custom-inpt"
              accept="image/png, image/jpeg, image/bmp"
              prepend-icon="mdi-camera"
              :error-messages="error.photo"
              v-model="formDataUpdate.photo"
            ></v-file-input>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Name"
                variant="outlined"
                :error-messages="error.fullName"
                v-model="formDataUpdate.fullName"
                :rules="validationRules.name"
                class="custom-inpt"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Username"
                variant="outlined"
                :error-messages="error.userName"
                v-model="formDataUpdate.userName"
                :rules="validationRules.username"
                class="custom-inpt"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Email"
                variant="outlined"
                :error-messages="error.email"
                v-model="formDataUpdate.email"
                :rules="validationRules.email"
                class="custom-inpt"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Phone"
                variant="outlined"
                :error-messages="error.phone"
                v-model="formDataUpdate.phone"
                :rules="validationRules.phone"
                class="custom-inpt"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-select
                :items="items"
                item-text="name"
                item-value="name"
                variant="outlined"
                label="Country"
                :error-messages="error.country"
                v-model="formDataUpdate.country"
                :rules="validationRules.country"
                class="custom-inpt"
                required
              >
                <template v-slot:selection="{ item, index }">
                  <div class="flex items-center" v-if="item.value !== ''">
                    <img :src="item.raw.image" alt="" class="w-8 h-5 mr-4" />
                    <span>{{ item.value }}</span>
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
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Adresse"
                variant="outlined"
                :error-messages="error.adresse"
                v-model="formDataUpdate.adresse"
                :rules="validationRules.address"
                class="custom-inpt"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="City"
                variant="outlined"
                :error-messages="error.city"
                v-model="formDataUpdate.city"
                :rules="validationRules.city"
                class="custom-inpt"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="State"
                variant="outlined"
                :error-messages="error.state"
                v-model="formDataUpdate.state"
                :rules="validationRules.state"
                class="custom-inpt"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Zip code"
                variant="outlined"
                :error-messages="error.zipCode"
                v-model="formDataUpdate.zipCode"
                :rules="validationRules.zip"
                class="custom-inpt"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Role"
                variant="outlined"
                :error-messages="error.role"
                v-model="formDataUpdate.role"
                :rules="validationRules.role"
                class="custom-inpt"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Salary"
                variant="outlined"
                :error-messages="error.salary"
                v-model="formDataUpdate.salary"
                :rules="validationRules.salary"
                class="custom-inpt"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>

            <button
              class="hover:bg-0-PRIMARY_BLUE hover:text-0-PRIMARY_BLUE_LIGHT text-sm font-normal py-2 px-4 mr-2 rounded-full shadow-lg border mt-2 bg-0-PRIMARY_BLUE_LIGHT border-0-PRIMARY_BLUE text-0-PRIMARY_BLUE"
              @click="dialogUpdate = false"
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
