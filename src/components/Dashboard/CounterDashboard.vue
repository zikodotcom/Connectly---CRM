<script setup>
import clients from '@/assets/images/dashboard/clients.png'
import employees from '@/assets/images/dashboard/employees.png'
import projects from '@/assets/images/dashboard/projects.png'
import invoices from '@/assets/images/dashboard/invoices.png'
</script>

<template>
  <section class="flex justify-between flex-col space-y-2 md:flex-row p-4">
    <!-- Card 1 -->
    <div class="shadow-xl w-[100%] md:w-[22%] rounded-lg p-4">
      <div class="flex justify-between">
        <div>
          <p class="text-0-GREY_GREY_70 font-light">Total clients</p>
          <p class="text-0-PRIMARY_NAVY text-lg font-bold">20000</p>
        </div>
        <div>
          <img v-lazy="clients" alt="" />
        </div>
      </div>
    </div>
    <!-- Card 2 -->
    <div class="shadow-xl w-[100%] md:w-[22%] rounded-lg p-4">
      <div class="flex justify-between">
        <div>
          <p class="text-0-GREY_GREY_70 font-light">Total employees</p>
          <p class="text-0-PRIMARY_NAVY text-lg font-bold">200</p>
        </div>
        <div>
          <img v-lazy="employees" alt="" />
        </div>
      </div>
    </div>
    <!-- Card 3 -->
    <div class="shadow-xl w-[100%] md:w-[22%] rounded-lg p-4">
      <div class="flex justify-between">
        <div>
          <p class="text-0-GREY_GREY_70 font-light">Total projects</p>
          <p class="text-0-PRIMARY_NAVY text-lg font-bold">20000</p>
        </div>
        <div>
          <img v-lazy="projects" alt="" />
        </div>
      </div>
    </div>
    <!-- Card 4 -->
    <div class="shadow-xl w-[100%] md:w-[22%] rounded-lg p-4">
      <div class="flex justify-between">
        <div>
          <p class="text-0-GREY_GREY_70 font-light">Total invoices</p>
          <p class="text-0-PRIMARY_NAVY text-lg font-bold">50</p>
        </div>
        <div>
          <img v-lazy="invoices" alt="" />
        </div>
      </div>
    </div>
  </section>
</template>
