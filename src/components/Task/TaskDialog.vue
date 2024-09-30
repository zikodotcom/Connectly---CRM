<script setup>
import { axiosClient } from '@/axiosClient'
import { getCookie } from '@/functions/getCookie'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import Drawer from 'primevue/drawer'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'

import { onMounted, ref, watch } from 'vue'

const fileInpt = ref(null)
const dialog = ref(true)
const dialogColl = ref(false)
const { task, employees } = defineProps(['task', 'employees'])
const listTeam = ref([])
const emp = employees
let page = 0
let paginateEmployees = ref(emp.slice(page, 10))
const emit = defineEmits(['search', 'close'])

const isDateS = ref(true)

const isDateF = ref(true)

const isDesc = ref(true)

onMounted(() => {
  listTeam.value = task.collaborators.map((el) => el.id_e)
  // Handle img file
  task.attachments = task.attachments.map(async (el) => {
    let extension = el.name.split('.')
    let img = await import(`@/assets/images/files/${extension[1]}.png`)
    return {
      ...el,
      img
    }
  })
})
const changeDateS = () => {
  isDateS.value = false
}
const changeDateF = () => {
  isDateF.value = false
}
const changeDesc = () => {
  isDesc.value = false
}
const update = (key) => {
  axiosClient
    .post(
      `/task/${task.id_task}?_method=PUT`,
      { key, value: task[key] },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
        }
      }
    )
    .then((res) => {
      isDateS.value = true
      isDateF.value = true
      isDesc.value = true
    })
}
const custimizeDate = (date) => {
  let dates = new Date(date)
  return dates.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  })
}
const searchEmployee = (e) => {
  emit('search', e.target.value)
}
const handleScroll = (e) => {
  const element = e.target
  if (element.scrollHeight - element.scrollTop === element.clientHeight) {
    if (paginateEmployees.value.length < employees.length) {
      page = page + 10
      const empl = emp.slice(page, page + 10)
      empl.map((el) => {
        paginateEmployees.value.push(el)
      })
    }
  }
}
// Assign collab
const assignCollabs = async () => {
  await axiosClient
    .post(
      '/task/assignCoolab',
      {
        id_task: task.id_task,
        id_e: listTeam.value
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
        }
      }
    )
    .then((res) => {
      task.collaborators = res.data
      dialogColl.value = false
    })
}
// Add attachments
const uploadFile = (e) => {
  const form = new FormData()
  form.append('file', e.target.files[0])
  form.append('id_task', task.id_task)
  axiosClient
    .post('/task/assignAttachment', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
      }
    })
    .then((res) => {
      console.log(res.data)
    })
}
const getExtension = async (name) => {
  const extension = name.split('.').pop().toLowerCase()

  try {
    const img = await import(`@/assets/images/files/${extension}.png`)
    return img
  } catch (error) {
    console.error(`Image for extension ${extension} not found`, error)
    return null
  }
}
const getName = (name) => {
  let newName = name.split('/')
  return newName[1]
}
</script>

<template>
  <Drawer
    v-model:visible="dialog"
    :header="task.taskName"
    position="right"
    class="!w-full md:!w-80 lg:!w-[30rem]"
  >
    <!-- TODO: Collaborators -->
    <h3 class="flex items-center space-x-2">
      <span><v-icon icon="mdi-account-group"></v-icon></span><strong>Collaborator</strong>
    </h3>
    <div class="flex mt-4">
      <v-tooltip v-for="coll in task.collaborators" :text="coll.Nom">
        <template v-slot:activator="{ props }">
          <Avatar :image="coll.image" class="mr-2" shape="circle" v-bind="props" />
        </template>
      </v-tooltip>
      <v-tooltip text="Add collaborators">
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-plus" size="x-small" v-bind="props" @click="dialogColl = true"> </v-btn>
        </template>
      </v-tooltip>
    </div>
    <!-- TODO: Start date -->
    <h3 class="flex items-center space-x-2 mt-4">
      <span><v-icon icon="mdi-calendar-range"></v-icon></span><strong>Start date</strong>
    </h3>
    <div>
      <strong v-if="isDateS" @dblclick="changeDateS">{{ custimizeDate(task.dateS) }}</strong>
      <div v-else>
        <DatePicker
          v-model="task.dateS"
          showIcon
          fluid
          iconDisplay="input"
          :invalid="task.dateS == null"
        />
        <Button
          label="Change"
          @click="update('dateS')"
          class="mt-2"
          :disabled="task.dateS == null"
        />
      </div>
    </div>
    <!-- TODO: due date -->
    <h3 class="flex items-center space-x-2 mt-4">
      <span><v-icon icon="mdi-calendar-range"></v-icon></span><strong>Due date</strong>
    </h3>
    <strong @dblclick="changeDateF" v-if="isDateF">{{ custimizeDate(task.dateF) }}</strong>
    <div v-else>
      <DatePicker
        v-model="task.dateF"
        showIcon
        fluid
        iconDisplay="input"
        :invalid="task.dateS == null"
      />
      <Button label="Change" @click="update('dateF')" class="mt-2" :disabled="task.dateS == null" />
    </div>
    <!-- TODO: Description -->
    <h3 class="flex items-center space-x-2 mt-4">
      <span><v-icon icon="mdi-text-box"></v-icon></span><strong>Description</strong>
    </h3>
    <p @dblclick="changeDesc" v-if="isDesc">
      {{ task.description }}
    </p>
    <div v-else>
      <Textarea
        v-model="task.description"
        rows="5"
        cols="30"
        class="block"
        :invalid="task.description == ''"
      />
      <Button
        label="Change"
        @click="update('description')"
        class="my-2"
        :disabled="task.description == ''"
      />
    </div>
    <!-- TODO: Attachements -->
    <h3 class="flex items-center space-x-2 mt-4">
      <span><v-icon icon="mdi-paperclip"></v-icon></span><strong>Attachements</strong>
      <v-tooltip text="Add attachment">
        <template v-slot:activator="{ props }">
          <v-btn
            icon="mdi-plus"
            size="x-small"
            v-bind="props"
            @click="
              () => {
                fileInpt.click()
              }
            "
          >
          </v-btn>
        </template>
      </v-tooltip>
      <input
        type="file"
        class="hidden"
        ref="fileInpt"
        accept=".pdf, .doc, .docx, .ppt, .csv, .xls, .xlsx"
        @change="uploadFile"
      />
    </h3>
    <div>
      <div class="flex items-center mb-2" v-for="attach in task.attachments">
        <div>
          {{ attach }}
          <img :src="attach.img" alt="" class="w-8 h-8" />
        </div>
        <div class="ml-2">
          <a href="javascript::void" class="text-base hover:text-0-PRIMARY_NAVY">{{ test }}</a>
          <p class="text-sm">{{ attach.size / 1024 }} ~ <button>Delete</button></p>
        </div>
      </div>
    </div>
    <!-- TODO: Comments -->
    <h3 class="flex items-center space-x-2 mt-4">
      <span><v-icon icon="mdi-comment"></v-icon></span><strong>Comments</strong>
    </h3>
    <div>
      <Textarea rows="5" cols="30" class="block" />
      <Button label="Add" class="my-2" />
    </div>
    <div class="flex">
      <div>
        <Avatar
          image="https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png"
          class="mr-2"
          shape="circle"
          v-bind="props"
        />
      </div>
      <div>
        <h5 class="font-bold">Zakaria Sdik</h5>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam, pariatur.</p>
        <div class="text-sm">
          <button>Like</button> - <button>Reply</button> - <button>Delete</button>
        </div>
      </div>
    </div>
  </Drawer>
  <!-- TODO: Assign collaborator -->
  <v-dialog max-width="700" v-model="dialogColl">
    <v-card title="Assign Collaborators">
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field label="search" @input="searchEmployee"></v-text-field>
          </v-col>
        </v-row>
        <div class="max-h-[400px] overflow-x-hidden" @scroll="handleScroll">
          <v-row v-for="employee in paginateEmployees">
            <v-col cols="6">
              <div class="flex items-center">
                <img
                  v-lazy="employee.photo"
                  alt=""
                  class="w-8 h-8 rounded-full mr-2 border border-0-PRIMARY_BLUE"
                />
                <span>{{ employee.fullName }}</span>
              </div>
            </v-col>
            <v-col cols="4"></v-col>
            <v-col cols="2">
              <v-switch
                v-model="listTeam"
                color="success"
                :value="employee.id_e"
                hide-details
              ></v-switch
            ></v-col>
          </v-row>
        </div>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <button
          class="hover:bg-0-PRIMARY_BLUE hover:text-0-PRIMARY_BLUE_LIGHT text-sm font-normal py-2 px-4 mr-2 rounded-full shadow-lg border mt-2 bg-0-PRIMARY_BLUE_LIGHT border-0-PRIMARY_BLUE text-0-PRIMARY_BLUE"
          @click="
            () => {
              dialogColl = false
              listTeam = []
            }
          "
        >
          Close
        </button>

        <button
          class="bg-0-PRIMARY_BLUE !text-0-PRIMARY_BLUE_LIGHT text-sm font-normal py-2 px-4 mr-2 rounded-full shadow-lg border mt-2 hover:bg-0-PRIMARY_BLUE_LIGHT hover:border-0-PRIMARY_BLUE hover:!text-0-PRIMARY_BLUE"
          @click="assignCollabs"
        >
          Assign Collaborators
        </button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
