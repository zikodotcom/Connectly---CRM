<script setup>
import CounterDashboard from '@/components/Dashboard/CounterDashboard.vue'
import Charts from '@/components/Dashboard/Charts.vue'
import ListClients from '@/components/Dashboard/ListClients.vue'
import { store } from '@/store/store'
import ListEmployee from '@/components/Dashboard/ListEmployee.vue'
</script>

<template>
  <CounterDashboard />
  <div class="flex space-x-4 p-4">
    <Charts />
    <ListClients />
    <ListEmployee />
  </div>
</template>
