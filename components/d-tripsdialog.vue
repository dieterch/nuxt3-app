<template>
    <v-dialog
    v-model="ldialog"
    max-width="500"
    >
        <v-card>
        <v-card-title>{{ modeis('add') ? 'Add Trip' : 'Update Trip' }}</v-card-title>
        <v-card-text>
            <pre v-if="false">{{ selected }}</pre>
            <pre v-if="false">{{ props.item.users }}</pre>
            <v-form 
                ref="form" 
                v-model="isFormValid" 
                lazy-validation
            >
                <v-row dense>
                    <v-text-field
                        label="Trip Name"
                        v-model="dialogtrip.name"
                        :rules="[v => !!v || 'Name is required']"
                        required
                        density="compact"
                    ></v-text-field>
                </v-row>

                <v-row dense>
                    <v-col>
                        <v-data-table
                        :items="dialogusers"
                        :headers="usersHeaders"
                        v-model="selected"
                        density="compact"
                        hide-default-footer
                        hide-default-header
                        return-object
                        show-select
                        ></v-data-table>
                        <!-- User selection validation message -->
                        <v-alert
                        v-if="userError"
                        type="error"
                        dense
                        text
                        >
                        At least one user must be selected.
                        </v-alert>
                </v-col>
                <v-col>
                        <v-date-input
                        label="Start Date"
                        v-model="dialogtrip.startDate"
                        density="compact"
                        required
                    ></v-date-input>
              </v-col>
                </v-row>
  
            <small class="text-caption text-medium-emphasis">*indicates required field</small>
            </v-form>
          </v-card-text>
  
          <v-divider></v-divider>
  
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="modeis('add')" text="Add" @click="submitForm" :disabled="!isFormValid"/>
            <v-btn v-if="modeis('update')" text="Update" @click="updateForm" :disabled="!isFormValid"/>
            <v-btn text="Close" @click="closeDialog"/>
          </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { ref, onMounted } from 'vue'

    const props = defineProps(['dialog','mode','item']);
    const emit = defineEmits(['refresh','dialog']);

    const isFormValid = ref(false)
    const ldialog = ref(props.dialog)
    const dialogtrips = ref([])
    const dialogusers = ref([])
    const userError = ref(false) // Error for user selection
    const selected = ref([]) // Keep track of selected users
    const content = ref([])

    const usersHeaders = [
        { title: 'Name', key: 'name' },
    ]

    // State
    const dialogtrip = ref({
        name: '',
        startDate: null,
        users: {},
    })

    // Reset Form
    const resetForm = () => {
        dialogtrip.value = { name: '', startDate: null, users: {} }
        selected.value = []
        userError.value = false
    }

    // Fetch Data on Mount
    onMounted(async () => {
        const tripsdata = await $fetch('/api/trips')
        dialogtrips.value = tripsdata

        const usersdata = await $fetch('/api/users')
        dialogusers.value = usersdata

        switch(props.mode) {
            case 'add': 
                resetForm()
                break;
            case 'update':
                dialogtrip.value = {
                    ...dialogtrip.value,
                    id: props.item.id,
                    name: props.item.name,
                    startDate: new Date(props.item.startDate)
                }
                selected.value = props.item.users.map((rec) => rec.user )
                break;
        }
    
    })

    // Form Submission
    const submitForm = async () => {
        // Check if form is valid and if at least one user is selected
        if (!isFormValid.value || selected.value.length === 0) {
            userError.value = selected.value.length === 0
            return
        }

        if ( !valid ) {
            alert('users with active expenses may not be deleted!')
            return 
        }

        // Prepare users for submission
        const userArray = selected.value.map(element => ({
            userId: element.id,
        }))

        dialogtrip.value.users = { create: userArray }

        // Send data to API
        try {
            await $fetch('/api/trips', {
            method: 'POST',
            body: dialogtrip.value,
            })

            // Reset the form and close dialog
            resetForm()
            emit('refresh')

            ldialog.value = false
            emit('dialog', ldialog.value)
        } catch (error) {
            console.error('Error submitting form:', error)
        }
    }

    // Form Submission
    const updateForm = async () => {
        // Check if form is valid and if at least one user is selected
        if (!isFormValid.value || selected.value.length === 0) {
            userError.value = selected.value.length === 0
            return
        }

        let valid = true
        props.item.expenses.forEach((rec) => {
            valid = (valid) ? Boolean(selected.value.find((srec) => { return (srec.id === rec.userId) } )): valid
        })

        if (!valid) {
            alert('TripUsers with expenses cannot not be deleted!')
            ldialog.value = false
            emit('dialog', ldialog.value)
            return
        }

        // console.log('valid:', valid)
        // Prepare users for submission
        const userArray = selected.value.map(element => (
            { 
                userId: element.id,
                tripId: props.item.id
            }
        ))

        const rec = {
            id: props.item.id,
            name: dialogtrip.value.name,
            startDate: new Date(dialogtrip.value.startDate),
            users: userArray
        }
            
        // Send data to API
        try {
            await $fetch('/api/trips', {
            method: 'PUT',
            body: rec,
            })

            // Reset the form and close dialog
            resetForm()
            emit('refresh')

            ldialog.value = false
            emit('dialog', ldialog.value)
        } catch (error) {
            console.error('Error submitting form:', error)
        }
    }


    // Close Dialog without Submission of data
    const closeDialog = () => {
        resetForm()
        ldialog.value = false
        emit('dialog', ldialog.value)
    }

    const modeis = (e) => {
        // console.log('modeis:', props.mode, e, (props.mode == e))
        return (props.mode == e)
    }

</script>