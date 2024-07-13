<script lang="ts" setup>
import Logo from '@/assets/images/Logo.png'
import { ref } from 'vue'

let { isShowInMobile, displayMobile } = defineProps(['isShowInMobile', 'displayMobile'])
let menus = ref([
  {
    text: 'Dashboard',
    route: '/Dashboard',
    isActive: true,
    icon: 'mdi-view-dashboard'
  },
  {
    text: 'Projects',
    route: '/Projects',
    isActive: false,
    icon: 'mdi-atom-variant'
  },
  {
    text: 'Employees',
    route: '/Employees',
    isActive: false,
    icon: 'mdi-account-supervisor'
  },
  {
    text: 'Clients',
    route: '/Clients',
    isActive: false,
    icon: 'mdi-account-tie'
  },
  {
    text: 'Tasks',
    route: '/Tasks',
    isActive: false,
    icon: 'mdi-calendar-check'
  },
  {
    text: 'Invoices',
    route: '/Invoices',
    isActive: false,
    icon: 'mdi-file-document-edit-outline'
  },
  {
    text: 'Recordes',
    route: '/Recordes',
    isActive: false,
    icon: 'mdi-record-circle'
  },
  {
    text: 'Recruitement',
    route: '/Recruitement',
    isActive: false,
    icon: 'mdi-briefcase'
  }
])
</script>

<template>
  <Transition name="menu">
    <div class="h-[100vh] w-[100%] border-r lg:w-[15%] lg:block" v-if="isShowInMobile">
      <span class="absolute right-3 top-3" @click="displayMobile"
        ><v-icon icon="mdi-close"></v-icon
      ></span>
      <div class="pr-2 p-4">
        <img :src="Logo" alt="" class="h-9 w-9" />
      </div>
      <div class="mt-5">
        <h3 class="text-sm text-0-GREY_GREY_70 px-4">MENU</h3>
        <ul class="mt-2">
          <li
            class="flex justify-between items-center relative line text-0-PRIMARY_NAVY p-4 rounded-lg hover:bg-0-PRIMARY_BLUE hover:text-0-PRIMARY_BLUE_LIGHT"
            v-for="menu in menus"
          >
            <p class="flex items-center">
              <v-icon :icon="menu.icon" size="medium"> </v-icon>
              <span class="text-lg lg:text-base ml-2">{{ menu.text }}</span>
            </p>
          </li>
        </ul>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.menu-enter-active {
  transition: all 0.1s 0.3s ease-out;
}

.menu-leave-active {
  transition: all 0 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}
</style>
