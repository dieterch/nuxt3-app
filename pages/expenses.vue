<template>
    <v-container>

      <v-divider color="black" thickness="1"></v-divider>

      <v-select
        density="compact"
        v-model="selectedTrip"
        @update:modelValue="tripChanged"
        :items="dialogtrips"
        item-title="name"
        item-value="id"
        label="Select Trip"
        return-object
      ></v-select>

      <v-row>
        <v-col md="6">
          <d-statistics
            :key="filteredexpenses"
            :filteredexpenses="filteredexpenses"
            :selectedTrip="selectedTrip"
            :v-bind="selectedTrip"
          />
        </v-col>
        <v-col class="text-right">
          <!--d-btn icon="mdi-plus" @click="tdialog = true" />
          <d-testdialog 
            :dialog="tdialog" 
            :key="tdialog" 
            @dialog="(e)=>{tdialog = e}"/-->
          <d-btn icon="mdi-plus" @click="emode = 'add'; edialog = true"/>
          <d-btn icon="mdi-square-edit-outline" @click="emode = 'edit'; edialog = true"/>
          <d-expensedialog
            :dialog="edialog"
            :key="edialog"
            :mode="emode"
            :selectedTrip="selectedTrip" 
            @refresh="tripChanged"
            @dialog="(e)=>{edialog = e}"
            />

          <d-savefile 
            :key="tripkey(1)" 
            :selectedTrip="selectedTrip" 
            :v-bind="selectedTrip"/>

          <d-btn icon="mdi-bug" @click="debug = !debug" />
          <d-btn icon="mdi-refresh" @click="tripChanged" />

        </v-col>
    </v-row>
    <v-row>
      <v-divider color="black" thickness="1"></v-divider>
    </v-row>
    <v-row>
      <v-col>
        <d-table
          :key="filteredexpenses"
          :items="filteredexpenses"
          :headers="expense_headers"
          :show="selectedTrip"
          :sort-by="sortBy"
        >
          <template v-slot:item.category.icon="{ item }">
            <v-icon :icon=item.category.icon></v-icon>
          </template>
          <template v-slot:item.actions="{ item }">
            <d-btn icon="mdi-delete" @click="deleteExpense(item)" />
          </template>
        </d-table>
      </v-col>
    </v-row>
    <div v-if="debug">
      Selected Trip:
      <pre>{{ selectedTrip }}</pre>

      Filtered Expenses:
      <pre>{{ filteredexpenses }}</pre>
    </div>
    </v-container>
</template>
  
<script setup>
  import { ref, onMounted, computed } from 'vue'
  import VueCookies from 'vue-cookies'

  const tdialog = ref(false)
  const edialog = ref(false)
  const emode = ref('')
  const dialogtrips = ref([])
  const selectedTrip = ref(null)
  const filteredexpenses = ref([])
  const debug = ref(false)

  const tripkey = (index) => {
    return (selectedTrip.value) ? 
      `${selectedTrip.value.id} + ${index}` : `${index}`
  }
  
  // Fetch Data on Mount
  onMounted(async () => {

    const data = await $fetch('/api/trips')
    dialogtrips.value = data
    
    // read selected Trip from cookiev...
    selectedTrip.value = VueCookies.get('selectedTrip')
    //DEBUG: console.log("selectedTrip: ",selectedTrip.value)
    
    // refresh if dialogtrips.
    if (selectedTrip) {
      tripChanged()
    }
  })
  
  //define the expense v-data-table
  //sort is reversed order of dates
  const sortBy = [{ key: 'date', order: 'desc' }]
  //columns definition & optimization
  const expense_headers = [
    //format the date 
    { title: 'Date', key: 'formateddate', width: "5%", value: item => new Date(item.date).toLocaleDateString("de-CA", {year:"numeric", month: "2-digit", day:"2-digit"}), sortable: "false", align: "end"},
    // do not display the Trip Name:
    // { title: 'Trip', key: 'trip.name', sortable: "false"},
    { title: 'Cat', key: 'category.icon', width: "5%", align: "left" },
    { title: 'Description', key: 'description', align: "left" },
    //combine amount & Currency into one column:
    { title: 'Expense', key: 'expense', width: "5%", value: item => `${item.amount}${item.currency}`, align: "end"},
    { title: 'User', key: 'user.name' , width: "5%"},
    //add a column for action buttons
    { title: 'Actions', key: 'actions', width: "5%", sortable: false },
  ]

  // fetch filtered Expenses
  const tripChanged = async () => {
    // Call filtered data from API
    try {
      filteredexpenses.value = await $fetch('/api/tripexpenses', {
          method: 'POST',
          body: { id: selectedTrip.value.id }
      })
      // Store selected Trip in a cookie for 30 days.
      VueCookies.set('selectedTrip', selectedTrip.value, "30d")
    } catch (error) {
        console.error('Error calling filtered expenses:', error)
        // alert(error)
    }
  }

  // Delete Expense
  const deleteExpense = async (item) => {
    await $fetch('/api/expenses', {
      method: 'DELETE',
      body: item,
    })

    // Refresh expenses
    tripChanged()
  }

</script>
  