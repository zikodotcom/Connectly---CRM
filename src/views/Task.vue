<script setup>
import { axiosClient } from '@/axiosClient'
import { onMounted, ref } from 'vue'
import { validationRules } from '@/components/Task/Validation'
import { getCookie } from '@/functions/getCookie'
import draggable from 'vuedraggable'
import { useToast } from 'vue-toastification'
import TaskDialog from '@/components/Task/TaskDialog.vue'
import Avatar from 'primevue/avatar'

const taskDialog = ref(null)
const toast = useToast()
const addDialog = ref(false)
const formData = ref({})
const listProject = ref([])
const error = ref([])
const dateS = ref(false)
const dateF = ref(false)
const formAdd = ref(null)
const isLoad = ref(false)
const employeeList = ref([])
const tasks = ref({
  Pending: [],
  'In progress': [],
  'In review': [],
  Completed: []
})
const task = ref({})
const isOpen = ref(false)
const key = ref(0)

onMounted(() => {
  axiosClient.get('/getProject').then((res) => {
    listProject.value = res.data
  })
  axiosClient.get('/getEmployee').then((res) => {
    employeeList.value = res.data
  })
  display()
})
// TODO: Display task
const display = () => {
  axiosClient.get('/task').then((res) => {
    tasks.value = res.data
  })
}
// TODO: Open task dialog function
const openAddTaskDialog = (status = 'Pending') => {
  formData.value.status = status
  addDialog.value = true
}
// TODO: Add task function
const addTask = async () => {
  let isValidate = await formAdd.value.validate()
  if (isValidate.valid) {
    isLoad.value = true
    await axiosClient.get('/sanctum/csrf-cookie')
    await axiosClient
      .post('/task', formData.value, {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
        }
      })
      .then((res) => {
        tasks.value[res.data.status].push(res.data)
        addDialog.value = false
        formData.value = []
      })
  }
}
// TODO: Move function
const move = async (evt) => {
  const elementTag = evt.to.parentElement.parentElement.getAttribute('data-status')
  await axiosClient.get('/sanctum/csrf-cookie')
  await axiosClient
    .post(
      '/task/updateStatus',
      { data: tasks.value[elementTag], status: elementTag },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
        }
      }
    )
    .then((res) => {
      toast.success('Task status updated.')
    })
}
// TODO: Display one task
const displayTask = async (id) => {
  await axiosClient
    .get(`/task/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
      }
    })
    .then((res) => {
      task.value = res.data.data
      isOpen.value = true
      key.value++
    })
}
const searchEmployee = (e) => {
  if (e !== '') {
    employeeList.value = employeeList.value.filter((el) =>
      el.fullName.toLowerCase().includes(e.toLowerCase())
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
      <h4 class="font-bold text-0-PRIMARY_NAVY text-lg">Tasks</h4>
      <button
        @click="openAddTaskDialog('Pending')"
        class="bg-0-PRIMARY_BLUE text-0-PRIMARY_WHITE font-semibold rounded-md p-3 flex items-center border hover:border-0-PRIMARY_BLUE hover:text-0-PRIMARY_BLUE hover:bg-transparent"
      >
        <v-icon icon="mdi-plus" large="small"></v-icon>Add tasks
      </button>
    </section>
  </div>
  <v-divider class="border-opacity-100" color="info"></v-divider>
  <div class="p-4 flex justify-center flex-wrap space-x-2">
    <!-- Pending -->
    <div class="bg-0-GREY_GREY_30 p-2 rounded-xl w-[24%] mt-2 min-w-[300px]" data-status="Pending">
      <div class="flex justify-between p-2 bg-0-PRIMARY_YELLOW text-white rounded-xl">
        <div class="flex">
          <div class="bg-[#fff] rounded-full w-6 h-6 text-center mr-2">
            <span class="text-0-PRIMARY_YELLOW">{{ tasks['Pending'].length }}</span>
          </div>
          <span>Pending</span>
        </div>
        <div>
          <button>
            <v-icon icon="mdi-plus"></v-icon>
          </button>
        </div>
      </div>

      <div class="mt-4 space-y-2 overflow-y-auto h-[65vh]">
        <!-- TODO: Tasks -->
        <draggable
          tag="div"
          :group="{ name: 'Pending', put: true }"
          @change="dragTask"
          @end="move"
          v-model="tasks['Pending']"
        >
          <template #item="{ element: task }">
            <div
              class="bg-white p-4 rounded-xl border-2 cursor-pointer"
              :data-id="task.id_task"
              :key="task.id_task"
              @click="displayTask(task.id_task)"
            >
              <h5 class="font-bold">{{ task.taskName }}</h5>
              <p class="text-0-GREY_GREY_70">
                {{ task.description }}
              </p>
              <div class="flex justify-between items-center my-2">
                <div>
                  <v-tooltip v-for="collab in task.collaborators" :text="collab.fullName">
                    <template v-slot:activator="{ props }">
                      {{ collab.Nom }}
                      <Avatar :image="collab.photo" class="mr-2" shape="circle" v-bind="props" />
                    </template>
                  </v-tooltip>
                </div>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>
    <!-- In progress -->
    <div
      class="bg-0-GREY_GREY_30 p-2 rounded-xl w-[24%] mt-2 min-w-[300px]"
      data-status="In progress"
    >
      <div class="flex justify-between p-2 bg-0-PRIMARY_BLUE text-white rounded-xl">
        <div class="flex">
          <div class="bg-[#fff] rounded-full w-6 h-6 text-center mr-2">
            <span class="text-0-PRIMARY_BLUE">{{ tasks['In progress'].length }}</span>
          </div>
          <span>In progress</span>
        </div>
        <div>
          <button>
            <v-icon icon="mdi-plus"></v-icon>
          </button>
        </div>
      </div>

      <div class="mt-4 space-y-2 overflow-y-auto h-[65vh]">
        <!-- TODO: Tasks -->
        <draggable
          tag="div"
          :group="{ name: 'In progress', put: true }"
          @change="dragTask"
          @end="move"
          v-model="tasks['In progress']"
        >
          <template #item="{ element: task }">
            <div
              class="bg-white p-4 rounded-xl border-2 cursor-pointer"
              :data-id="task.id_task"
              :key="task.id_task"
              @click="displayTask(task.id_task)"
            >
              <h5 class="font-bold">{{ task.taskName }}</h5>
              <p class="text-0-GREY_GREY_70">
                {{ task.description }}
              </p>
              <div class="flex justify-between items-center my-2">
                <div>
                  <v-tooltip v-for="collab in task.collaborators" :text="collab.fullName">
                    <template v-slot:activator="{ props }">
                      {{ collab.Nom }}
                      <Avatar :image="collab.photo" class="mr-2" shape="circle" v-bind="props" />
                    </template>
                  </v-tooltip>
                </div>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>
    <!-- In review -->
    <div
      class="bg-0-GREY_GREY_30 p-2 rounded-xl w-[24%] mt-2 min-w-[300px]"
      data-status="In review"
    >
      <div class="flex justify-between p-2 bg-0-PRIMARY_PINK text-white rounded-xl">
        <div class="flex">
          <div class="bg-[#fff] rounded-full w-6 h-6 text-center mr-2">
            <span class="text-0-PRIMARY_PINK">{{ tasks['In review'].length }}</span>
          </div>
          <span>In review</span>
        </div>
        <div>
          <button>
            <v-icon icon="mdi-plus"></v-icon>
          </button>
        </div>
      </div>

      <div class="mt-4 space-y-2 overflow-y-auto h-[65vh]">
        <!-- TODO: Tasks -->
        <draggable
          tag="div"
          :group="{ name: 'In review', put: true }"
          @change="dragTask"
          @end="move"
          v-model="tasks['In review']"
        >
          <template #item="{ element: task }">
            <div
              class="bg-white p-4 rounded-xl border-2 cursor-pointer"
              :data-id="task.id_task"
              :key="task.id_task"
              @click="displayTask(task.id_task)"
            >
              <h5 class="font-bold">{{ task.taskName }}</h5>
              <p class="text-0-GREY_GREY_70">
                {{ task.description }}
              </p>
              <div class="flex justify-between items-center my-2">
                <div>
                  <v-tooltip v-for="collab in task.collaborators" :text="collab.fullName">
                    <template v-slot:activator="{ props }">
                      {{ collab.Nom }}
                      <Avatar :image="collab.photo" class="mr-2" shape="circle" v-bind="props" />
                    </template>
                  </v-tooltip>
                </div>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>
    <!-- Completed -->
    <div
      class="bg-0-GREY_GREY_30 p-2 rounded-xl w-[24%] mt-2 min-w-[300px]"
      data-status="Completed"
    >
      <div class="flex justify-between p-2 bg-0-PRIMARY_GREEN text-white rounded-xl">
        <div class="flex">
          <div class="bg-[#fff] rounded-full w-6 h-6 text-center mr-2">
            <span class="text-0-PRIMARY_GREEN">{{ tasks['Completed'].length }}</span>
          </div>
          <span>Completed</span>
        </div>
        <div>
          <button>
            <v-icon icon="mdi-plus"></v-icon>
          </button>
        </div>
      </div>

      <div class="mt-4 space-y-2 overflow-y-auto h-[65vh]">
        <!-- TODO: Tasks -->
        <draggable
          tag="div"
          :group="{ name: 'Completed', put: true }"
          @change="dragTask"
          @end="move"
          v-model="tasks['Completed']"
        >
          <template #item="{ element: task }">
            <div
              class="bg-white p-4 rounded-xl border-2 cursor-pointer"
              :data-id="task.id_task"
              :key="task.id_task"
              @click="displayTask(task.id_task)"
            >
              <h5 class="font-bold">{{ task.taskName }}</h5>
              <p class="text-0-GREY_GREY_70">
                {{ task.description }}
              </p>
              <div class="flex justify-between items-center my-2">
                <div>
                  <v-tooltip v-for="collab in task.collaborators" :text="collab.fullName">
                    <template v-slot:activator="{ props }">
                      {{ collab.Nom }}
                      <Avatar :image="collab.photo" class="mr-2" shape="circle" v-bind="props" />
                    </template>
                  </v-tooltip>
                </div>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
  <!-- Add task -->
  <v-dialog max-width="700" v-model="addDialog">
    <v-card title="Add task">
      <v-card-text>
        <v-form ref="formAdd" @submit.prevent="addTask">
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Task name"
                variant="outlined"
                :error-messages="error.taskName"
                v-model="formData.taskName"
                :rules="validationRules.taskName"
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
                    :error-messages="error.dateS"
                    :rules="validationRules.dateS"
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
                    label="Due date"
                    variant="outlined"
                    class="custom-inpt"
                    persistent-hint
                    readonly
                    v-model="formData.dateF"
                    :error-messages="error.dateF"
                    :rules="validationRules.dateF"
                    v-bind="props"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="formData.dateF" no-title></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="6">
              <v-select
                label="Status"
                :items="['Pending', 'In Progress', 'In review', 'Completed']"
                variant="outlined"
                :error-messages="error.status"
                v-model="formData.status"
                :rules="validationRules.status"
                class="custom-inpt"
                required
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                label="Project"
                :items="listProject"
                variant="outlined"
                :error-messages="error.id"
                v-model="formData.id"
                :rules="validationRules.id"
                class="custom-inpt"
                item-title="projectName"
                item-value="id"
                required
              ></v-select>
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
          <v-card-actions>
            <v-spacer></v-spacer>

            <button
              class="hover:bg-0-PRIMARY_BLUE hover:text-0-PRIMARY_BLUE_LIGHT text-sm font-normal py-2 px-4 mr-2 rounded-full shadow-lg border mt-2 bg-0-PRIMARY_BLUE_LIGHT border-0-PRIMARY_BLUE text-0-PRIMARY_BLUE"
              @click="addDialog = false"
            >
              Close
            </button>

            <button
              class="bg-0-PRIMARY_BLUE !text-0-PRIMARY_BLUE_LIGHT text-sm font-normal py-2 px-4 mr-2 rounded-full shadow-lg border mt-2 hover:bg-0-PRIMARY_BLUE_LIGHT hover:border-0-PRIMARY_BLUE hover:!text-0-PRIMARY_BLUE"
              type="submit"
            >
              Add task
            </button>
          </v-card-actions>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
    </v-card>
  </v-dialog>
  <TaskDialog
    :task="task"
    :employees="employeeList"
    v-if="isOpen"
    @search="searchEmployee"
    :key="key"
  />
</template>
