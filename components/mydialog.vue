<template>
    <v-sheet>
        {{ lselectedTrip }}
    </v-sheet>
    <v-dialog v-model="isDialogOpen" max-width="410">
        <template #activator="{ props }">
        <v-row justify="start">
          <v-col>
            <v-btn
              v-bind="props"
              color="surface-variant"
              rounded="0"
              elevation="1"
              :notdisabled="!lselectedTrip"
            >
              Add Expense
            </v-btn>
          </v-col>
          <v-col>
            <!--v-sheet>
              {{ totalExpenses }}€ - {{ totalDays }} days<br>
              {{ expensePerDay }}€ per day.<br>
            </v-sheet-->
          </v-col>
        </v-row>
        </template>

        <v-card>
          <v-card-title>Add Expense - {{ lselectedTrip.name }}</v-card-title>
          <v-card-text>
 
          <v-form ref="expenseForm" v-model="isFormValid" lazy-validation>
            <v-row>
              <!-- Description Input -->
              <v-col cols="12" md="8">
                <v-text-field
                  density="compact"
                  v-model="lformData.description"
                  label="Title"
                  placeholder="brief description of the expense"
                  required
                  :rules="[v => !!v || 'Description is required']"
                ></v-text-field>
              </v-col>
              <!-- Category Dropdown -->
              <v-col cols="12" md="4">
                <v-select
                  density="compact"
                  v-model="lformData.categoryId"
                  :items="dialogcategories"
                  item-title="name"
                  item-value="id"
                  label="♥"
                  required
                  :rules="[v => !!v || 'required']"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
            <!-- Currency Dropdown -->
            <v-col cols="12" md="3">
                <v-select
                  density="compact"
                  v-model="lformData.currency"
                  :items="currencies"
                  item-title="symbol"
                  item-value="symbol"
                  nolabel="Currency"
                  required
                  :rules="[v => !!v || 'required']"
                ></v-select>
              </v-col> 
              <!-- Amount Input -->
              <v-col cols="12" md="9">
                <v-text-field
                  density="compact"
                  v-model="lformData.amount"
                  type="number"
                  label="Amount"
                  required
                  :rules="[v => !!v || 'Amount is required']"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>

              <!-- User Dropdown -->
              <v-col cols="12" md="6">
                <v-select
                  density="compact"
                  v-model="lformData.userId"
                  :items="lselectedTrip.users"
                  item-title="user.name"
                  item-value="user.id"
                  label="Select User"
                  required
                  :rules="[v => !!v || 'User is required']"
                ></v-select>
              </v-col>

              <!-- Date Input -->
              <v-col cols="12" md="6">
                  <v-date-input
                    density="compact"
                    v-model="lformData.date"
                    label="Expense Date"
                    required
                    :rules="[v => !!v || 'Date is required']"
                  ></v-date-input>
              </v-col>
            </v-row>
          </v-form>
            
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="Add" @click="submitExpense" :disabled="!isFormValid">Add</v-btn>
            <v-btn text="Close" @click="closeDialog">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

</template>

<script>
    import { ref, onMounted, defineProps } from 'vue'
    import VueCookies from 'vue-cookies'

    const props = defineProps(['formData']);
    
    const isFormValid = ref(false)
    const isDialogOpen = ref(false)
    const lselectedTrip = ref(null)
    const lformData = ref(props.formData)

    onMounted(async () => {
        // read selected Trip from cookiev...
        lselectedTrip.value = VueCookies.get('selectedTrip')
        console.log("selectedTrip: ",lselectedTrip.value)
    })
</script>