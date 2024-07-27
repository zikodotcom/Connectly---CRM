<script setup>
import { axiosClient } from '@/axiosClient'
import Table from '@/components/Employee/Table.vue'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { validationRules } from '@/components/Employee/Validation'
let data = ref(null)
let dialog = ref(false)
let items = ref([])
const formData = ref({
  name: '',
  username: '',
  email: '',
  phone: '',
  country: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  role: '',
  salary: ''
})

onMounted(() => {
  display(1)
  axios.get(`https://restcountries.com/v3.1/all?fields=name,flags`).then((res) => {
    items.value = res.data
      .map((el) => {
        return {
          image: el.flags.png,
          name: el.name.common
        }
      })
      .filter((el) => el.name !== 'Israel' && el.name !== 'Western Sahara') //TODO: Filter the country didn't exists
      .sort((a, b) => {
        if (a.name < b.name) {
          return -1
        }
        if (a.name > b.name) {
          return 1
        }
        return 0
      })
  })
})
// display data function
const display = (page) => {
  axiosClient.get(`/employee?page=${page}`).then((res) => {
    data.value = res.data
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
    <Table :data="data" v-if="data" @page-changed="display" />
  </div>
  <!-- Modal add -->
  <v-dialog max-width="700" v-model="dialog">
    <v-card prepend-icon="mdi-account" title="User Profile">
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Name"
                variant="outlined"
                v-model="formData.name"
                :rules="validationRules.name"
                class="custom-inpt"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Username"
                variant="outlined"
                v-model="formData.username"
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
                v-model="formData.address"
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
                v-model="formData.zip"
                :rules="validationRules.zip"
                class="custom-inpt"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Role"
                variant="outlined"
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
                v-model="formData.salary"
                :rules="validationRules.salary"
                class="custom-inpt"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

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
          class="bg-0-PRIMARY_BLUE text-0-PRIMARY_BLUE_LIGHT text-sm font-normal py-2 px-4 mr-2 rounded-full shadow-lg border mt-2 hover:bg-0-PRIMARY_BLUE_LIGHT hover:border-0-PRIMARY_BLUE hover:text-0-PRIMARY_BLUE"
        >
          Add
        </button>
      </v-card-actions>
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
