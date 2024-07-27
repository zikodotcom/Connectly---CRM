<script setup>
import CounterDashboard from '@/components/Dashboard/CounterDashboard.vue'
import Charts from '@/components/Dashboard/Charts.vue'
import ListClients from '@/components/Dashboard/ListClients.vue'
</script>

<template>
  <CounterDashboard />
  <div class="flex space-x-4 p-4">
    <Charts />
    <ListClients />
    <ListClients />
  </div>
</template>
