<script setup>
import { onMounted, ref } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { axiosClient } from '@/axiosClient'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
onMounted(async () => {
  await axiosClient.get('/task').then((res) => {
    chartData.value.datasets[0]['data'] = [
      res.data['Pending'].length,
      res.data['In progress'].length,
      res.data['In review'].length,
      res.data['Completed'].length
    ]
  })
})
let chartData = ref({
  labels: ['Pending', 'In progress', 'In review', 'Completed'],
  datasets: [
    {
      label: 'Tasks',
      backgroundColor: '#514EF3',
      data: []
    }
  ]
})
let chartOptions = ref({
  responsive: true,
  animations: {
    tension: {
      duration: 1000,
      easing: 'linear',
      from: 1,
      to: 0,
      loop: true
    }
  }
})
</script>

<template>
  <div class="w-[50%]">
    <h1>Tasks</h1>
    <Bar
      id="my-chart-id"
      v-if="chartData.datasets[0].data.length !== 0"
      :options="chartOptions"
      :data="chartData"
    />
  </div>
</template>
