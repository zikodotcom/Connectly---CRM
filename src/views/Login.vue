<script setup>
import bg from '@/assets/images/bg.jpeg'
import logo from '@/assets/images/Logo.png'
import { axiosClient } from '@/axiosClient'
import { getCookie } from '@/functions/getCookie'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

let user = ref({
  email: '',
  password: ''
})
const form = ref(null)
const isAuth = ref(true)
const route = useRouter()
const rules = ref({
  required: (value) => !!value || 'Required.',
  min: (v) => v.length >= 8 || 'Min 8 characters',
  emailMatch: null
})
const show1 = ref(false)
const show2 = ref(true)
const onSubmit = async (e) => {
  e.preventDefault()
  let isValidate = await form.value.validate()

  if (isValidate.valid) {
    console.log(getCookie('XSRF-TOKEN'))
    await axiosClient.get('sanctum/csrf-cookie')
    await axiosClient
      .post('/login', user.value, {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
        }
      })
      .then((res) => {
        if (res.status == 204) {
          rules.value.emailMatch = null
          route.push('/dashboard')
        } else {
          rules.value.emailMatch = `The email and password you entered don't match`
        }
      })
      .catch((err) => {
        rules.value.emailMatch = `The email and password you entered don't match`
        console.log(isAuth.value)
      })
  }
}
</script>

<template>
  <main class="flex h-[100vh] overflow-hidden">
    <section
      class="w-[50%] h-full bg-0-PRIMARY_NAVY flex flex-col justify-center px-10 text-0-PRIMARY_BLUE_LIGHT"
    >
      <h1 class="text-xl flex justify-center items-center">
        <img v-lazy="logo" alt="" class="mr-4" />Login
      </h1>
      <v-form @submit="onSubmit" class="mt-4" ref="form">
        <v-text-field
          density="compact"
          label="Search"
          variant="outlined"
          prepend-inner-icon="mdi-email"
          v-model="user.email"
        ></v-text-field>
        <v-text-field
          v-model="user.password"
          variant="outlined"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          prepend-inner-icon="mdi-lock"
          :rules="[rules.required, rules.min]"
          :error-messages="rules.emailMatch"
          :type="show1 ? 'text' : 'password'"
          label="Password"
          name="input-10-1"
          @click:append="show1 = !show1"
        ></v-text-field>
        <button
          class="bg-0-PRIMARY_BLUE text-0-PRIMARY_BLUE_LIGHT text-sm font-normal py-2 px-4 mr-2 rounded-full shadow-lg border mt-2 hover:bg-0-PRIMARY_BLUE_LIGHT hover:border-0-PRIMARY_BLUE hover:text-0-PRIMARY_BLUE"
        >
          Login
        </button>
      </v-form>
    </section>
    <section class="w-[50%] h-full bg-login"></section>
  </main>
</template>
