<script setup>
import Logo from '@/assets/images/Logo.png'
import { ref } from 'vue'

// Inner width
let { isShowInMobile, displayMobile } = defineProps(['isShowInMobile', 'displayMobile'])
let menus = ref([
  {
    text: 'Dashboard',
    route: '/',
    isActive: true,
    icon: 'mdi-view-dashboard'
  },
  {
    text: 'Projects',
    route: '/project',
    isActive: false,
    icon: 'mdi-atom-variant'
  },
  {
    text: 'Employees',
    route: '/employee',
    isActive: false,
    icon: 'mdi-account-supervisor'
  },
  {
    text: 'Clients',
    route: '/client',
    isActive: false,
    icon: 'mdi-account-tie'
  },
  {
    text: 'Tasks',
    route: '/task',
    isActive: false,
    icon: 'mdi-calendar-check'
  }
])
</script>

<template>
  <Transition name="menu">
    <div class="h-[100vh] w-[100%] fixed md:relative bg-0-PRIMARY_BLUE_LIGHT border-r block z-50">
      <span class="absolute right-3 top-3 md:hidden" @click="displayMobile"
        ><v-icon icon="mdi-close"></v-icon
      ></span>
      <div class="pr-2 p-4">
        <img v-lazy="Logo" alt="" class="h-9 w-9" />
      </div>
      <div class="mt-5">
        <h3 class="text-sm text-0-GREY_GREY_70 px-4">MENU</h3>
        <ul class="mt-2">
          <li
            class="flex justify-between items-center relative line text-0-PRIMARY_NAVY p-4 hover:bg-0-PRIMARY_BLUE hover:text-0-PRIMARY_BLUE_LIGHT"
            v-for="menu in menus"
          >
            <RouterLink :to="menu.route">
              <p class="flex items-center">
                <v-icon :icon="menu.icon" size="medium"> </v-icon>
                <span class="text-lg lg:text-sm ml-2">{{ menu.text }}</span>
              </p></RouterLink
            >
          </li>
        </ul>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.menu-enter-active {
  transition: all 0.3s ease-out;
  transform-origin: top left;
}

.menu-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
  transform-origin: top left;
}

.menu-enter-from,
.menu-leave-to {
  transform: scale(0);
  transform-origin: top left;
}
</style>
