<template>
  <v-container>
    <h2>Manage Trips</h2>

    <v-row>
      <v-col class="text-right">
        <d-btn icon="mdi-plus" @click="tmode = 'add'; titem={}; isTripsDialogOpen = true"/>
        <d-tripsdialog 
          :dialog="isTripsDialogOpen"
          :key="isTripsDialogOpen"
          :mode="tmode"
          :item="titem"
          @refresh="refreshTrips"
          @dialog="(e)=>{isTripsDialogOpen = e}"
          />
        <d-btn icon="mdi-bug" @click="debug = !debug" />
        <d-btn icon="mdi-refresh" @click="refreshTrips" />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <d-table
          :items="trips"
          :headers="tripsHeaders"
          :show=true
        >
            <template v-slot:item.users="{ item }">
              <span v-for="(e, index) in item.users" :key="index">
                {{ e.user.name }}<span v-if="index < item.users.length - 1">, </span>
              </span>
            </template>
            <template v-slot:item.actions="{ item }">
              <div class="button-container">
                <d-btn icon="mdi-delete" @click="deleteTrip(item)" />
                <d-btn icon="mdi-square-edit-outline" @click="tmode = 'update'; titem=item; isTripsDialogOpen = true"/>
              </div>
            </template>
        </d-table>
      </v-col>
    </v-row>

    <v-divider color="black" thickness="1"></v-divider>
    <pre v-if="debug">{{ trips }}</pre>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const trips = ref([])
const users = ref([])
const selected = ref([]) // Keep track of selected users
const debug = ref(false)
const isTripsDialogOpen = ref(false)
const tmode = ref('')
const titem = ref({})

// Data Table Headers
const tripsHeaders = [
  // { title: 'Start Date', key: 'startDate' },
  { title: 'Start Date', key: 'formateddate', width: "15%", value: item => new Date(item.startDate).toLocaleDateString("de-CA", {year:"numeric", month: "2-digit", day:"2-digit"}), sortable: "false", align: "end"},
  { title: 'Trip Name', key: 'name', width: "30%" },
  { title: 'Participants', key: 'users' },
  { title: 'Expenses', key:'countexpenses', value: item => item.expenses.length},
  { title: 'Actions', key: 'actions', align: 'center', width: "5%" , sortable: false },
]

const fetchTrips = async () => {
    const data = await $fetch('/api/trips')
    trips.value = data
  }

// Fetch Data
onMounted(async () => {
  fetchTrips()
})

// Delete Trip
const deleteTrip = async (item) => {
  let permit = true
  if (item.expenses.length > 0) {
    permit = confirm(`${item.name} has ${item.expenses.length} expenses. Continue ?`)
  }
  if (permit) {

    await $fetch('/api/trips', {
      method: 'DELETE',
      body: item,
    })
    refreshTrips()
  }
}

const refreshTrips = async () => {
  fetchTrips()
}

</script>

<style lang="css" scoped>
.button-container {
  display: flex;
}
</style>