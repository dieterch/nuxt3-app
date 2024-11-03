<template>
    <v-dialog v-model="ldialog" max-width="500px">
        <v-card>
            <v-card-title>{{ modeis('add') ? 'Add Trip' : 'Update Trip' }}</v-card-title>
            <v-card-text>
                <pre v-if="false">{{ selected }}</pre>
                <pre v-if="false">{{ props.item.users }}</pre>
                <v-form ref="form" v-model="isFormValid" lazy-validation>
                    <v-row dense>
                        <v-text-field
                            label="Trip Name"
                            v-model="formTrip.name"
                            :rules="[v => !!v || 'Name is required']"
                            required
                            density="compact"
                        ></v-text-field>
                    </v-row>
                    <v-row dense>
                        <v-col>
                            <v-data-table
                                :items="users"
                                :headers="usersHeaders"
                                v-model="selected"
                                density="compact"
                                hide-default-footer
                                hide-default-header
                                return-object
                                show-select
                            ></v-data-table>
                            <v-alert v-if="userError" type="error" dense text >
                                At least one user must be selected.
                            </v-alert>
                        </v-col>
                        <v-col>
                            <v-date-input
                                label="Start Date"
                                v-model="formTrip.startDate"
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
                <v-btn v-if="modeis('add')" text="Add" @click="handleForm('POST')" :disabled="!isFormValid"/>
                <v-btn v-if="modeis('update')" text="Update" @click="handleForm('PUT')" :disabled="!isFormValid"/>
                <v-btn text="Close" @click="closeDialog"/>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'

    const props = defineProps(['dialog','mode','item']);
    const emit = defineEmits(['refresh','dialog']);

    const isFormValid = ref(false)
    const trips = ref([])
    const users = ref([])
    const userError = ref(false) // Error for user selection
    const selected = ref([]) // Keep track of selected users

    const usersHeaders = [{ title: 'Name', key: 'name' }]

    // State for the trip data
    const formTrip = ref({
        name: '',
        startDate: null,
        users: {},
    })

    // Helper for determining dialog visibility and mode
    const ldialog = computed({
        get: () => props.dialog,
        set: (value) => emit('dialog', value),
    })

    const modeis = (e) => props.mode === e

    // Reset Form
    const resetForm = () => {
        formTrip.value = { name: '', startDate: null, users: {} }
        selected.value = []
        userError.value = false
    }

    // Fetch Data on Mount
    onMounted(async () => {
        trips.value = await $fetch('/api/trips')
        users.value = await $fetch('/api/users')
        
        switch(props.mode) {
            case 'add': 
                resetForm()
                break;
            case 'update':
                formTrip.value = {
                    ...formTrip.value,
                    id: props.item.id,
                    name: props.item.name,
                    startDate: new Date(props.item.startDate)
                }
                selected.value = props.item.users.map((rec) => rec.user )
                break;
        }
    
    })

    const handleForm = async (method) => {
        // Check if form is valid and if at least one user is selected
        if (!isFormValid.value || selected.value.length === 0) {
            userError.value = selected.value.length === 0
            return
        }

        // if in update, check if all trip related expenses 
        // have a valid owner
        if (method === 'PUT') {
            let valid = true
            props.item.expenses.forEach((rec) => {
                valid = (valid) ? Boolean(selected.value.find((srec) => { return (srec.id === rec.userId) } )): valid
            })
            if (!valid) {
                alert('TripUsers with expenses cannot not be deleted!')
                closeDialog()
                return
            }
        }

        // Prepare users for submission
        const userArray = selected.value.map(element => ({ userId: element.id }))
        const rec = {
            ...formTrip.value,
            users: (method === 'POST') ? { create: userArray } : userArray
        }
        if (method === 'PUT') { rec.id = props.item.id }

        // Send data to API
        try {
            await $fetch('/api/trips', {
                method,
                body: rec,
            })

            // Reset the form and close dialog
            resetForm()
            emit('refresh')
            closeDialog()
        } catch (error) {
            console.error('Error submitting form:', error)
        }
    }

    // Close Dialog without Submission of data
    const closeDialog = () => {
        resetForm()
        emit('dialog', false)
    }

</script>