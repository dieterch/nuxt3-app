<template>
    <v-dialog
    v-model="dialog"
    max-width="410"
    >
    <template v-slot:activator="{ props: activatorProps }">
        <v-btn
        class="text-none font-weight-regular"
        prepend-icon="mdi-cash-register"
        color="surface-variant"
        rounded="0"
        elevation="1"
        size="small"
        text="+"
        novariant="tonal"
        v-bind="activatorProps"
        ></v-btn>
    </template>
        <v-card>
            <v-card-title>
                <v-sheet>
                    <v-icon icon="mdi-cash-register"></v-icon>
                    Expense - {{ props.selectedTrip.name }}       
                </v-sheet>
            </v-card-title>
        <v-card-text>
            <v-form 
                ref="expenseForm" 
                v-model="isFormValid" 
                lazy-validation
            >
            <v-row dense>
                <!-- Description Input -->
                <v-col
                    cols="12"
                    md="8"
                    sm="12"
                >
                    <v-text-field
                        density="compact"
                        v-model="lformData.description"
                        label="Title*"
                        placeholder="brief description of the expense"
                        required
                        :rules="[v => !!v || 'Description is required']"
                    ></v-text-field>
                </v-col>
  
                <!-- Category Dropdown -->
                <v-col
                    cols="12"
                    md="4"
                    sm="6"
                >
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

                <!-- Currency Dropdown -->
                <v-col
                    cols="12"
                    md="3"
                    sm="4"
                >
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
                <v-col
                    cols="12"
                    md="9"
                    sm="12"
                >
                    <v-text-field
                        density="compact"
                        v-model="lformData.amount"
                        type="number"
                        label="Amount"
                        required
                        :rules="[v => !!v || 'Amount is required']"
                    ></v-text-field>
                </v-col>

                <!-- User Dropdown -->  
                <v-col
                    cols="12"
                    md="6"
                    sm="12"
                >
                    <v-select
                        density="compact"
                        v-model="lformData.userId"
                        :items="props.selectedTrip.users"
                        item-title="user.name"
                        item-value="user.id"
                        label="Select User"
                        required
                        :rules="[v => !!v || 'User is required']"
                    ></v-select>
                </v-col>

                <!-- Date Input -->  
                <v-col
                    cols="12"
                    md="6"
                    sm="12"
                >
                    <v-date-input
                        density="compact"
                        v-model="lformData.date"
                        label="Expense Date"
                        required
                        :rules="[v => !!v || 'Date is required']"
                    ></v-date-input>
                </v-col>  
            </v-row>
  
            <small class="text-caption text-medium-emphasis">*indicates required field</small>
            </v-form>
          </v-card-text>
  
          <v-divider></v-divider>
  
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="Add" @click="submitExpense" :disabled="!isFormValid">Add</v-btn>
            <v-btn text="Close" @click="closeDialog">Close</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import VueCookies from 'vue-cookies'

    const props = defineProps(['selectedTrip']);
    const emit = defineEmits(['refresh']);

    const isFormValid = ref(false)
    const dialog = ref(false)
    const dialogcategories = ref([])
    //const lselectedTrip = ref(null)

    const lformData = ref({
        amount: null,
        currency: '€',
        date: new Date(),
        location: '',
        categoryId: null,
        description: '',
        tripId: '',
        userId: '',
  })

  // Reset the Form
  const resetForm = async () => {
    lformData.value.amount = null
    lformData.value.date = new Date()
    lformData.value.description = ''
    lformData.value.categoryId = null  
  }

  //currencies seed => would make sense to transfer this table to the database.
  const currencies = [
    { name: 'USD', symbol: '$' },
    { name: 'EUR', symbol: '€' },
  ]

    // Fetch Data on Mount
    onMounted(async () => {
        const data = await $fetch('/api/categories')
        dialogcategories.value = data
    }) 

    //Submit the 'add expense' dialog content:
    const submitExpense = async () => {
        if (!isFormValid.value) return

        //DEBUG: console.log('Submitted Data before:', formData.value)
        // Add logic to submit the data via your API
        lformData.value.tripId = props.selectedTrip.id
        lformData.value.amount = parseFloat(lformData.value.amount)

        //DEBUG: console.log('Submitted Data after:', formData.value)
        
        // Send data to API
        try {
        await $fetch('/api/expenses', {
            method: 'POST',
            body: lformData.value,
        })

        // Reset the form
        resetForm()
        emit('refresh')

        // close the Dialog form
        dialog.value = false
        } catch (error) {
            console.error('Error submitting form:', error)
            alert(error)
        }
    }

    // Close Dialog without Submission of data
    const closeDialog = () => {
        resetForm()
        dialog.value = false
    }
</script>