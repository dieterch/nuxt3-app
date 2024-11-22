<template>
    <v-dialog v-model="ldialog" max-width="500px">
        <v-card>
            <v-card-title>{{ modeis('add') ? 'Add Trip' : 'Update Trip' }}</v-card-title>
            <v-card-text>
                <pre v-if="false">{{ selected }}</pre>
                <pre v-if="false">{{ props }}</pre>
                <v-form ref="form" v-model="isFormValid" lazy-validation>
                    <v-row dense>
                        <v-text-field
                            label="Trip Name*"
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
                        </v-col>
                        <v-col>
                            <v-date-input
                                label="Start Date*"
                                v-model="formTrip.startDate"
                                density="compact"
                                required
                                :rules="[v => !!v || 'Startdate is required']"
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
    import { createDialog } from 'vuetify3-dialog'
    const { $ifetch } = useNuxtApp()

    // import VueCookies from 'vue-cookies'

    const props = defineProps(['dialog','mode','item']);
    const emit = defineEmits(['refresh','dialog']);

    const isFormValid = ref(false)
    const trips = ref([])
    const users = ref([])
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
    }

    // Fetch Data on Mount
    onMounted(async () => {
        trips.value = await $ifetch.get('/api/trips')
        users.value = await $ifetch.get('/api/tripusers')
        // trips.value = await $fetch('/api/trips')
        // users.value = await $fetch('/api/tripusers')
        
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

        // Ensure the form is valid and at least one user is selected
        if (!isFormValid.value || selected.value.length === 0) {

            await createDialog({ 
                title: 'Select Trip Users', 
                text: 'At least one participant must be selected.',
                level: 'error',
                // icon: 'mdi-emoticon-happy-outline',
                buttons: [
                    { title: 'Ok', key: 'ok', /* any v-btn api option */ },
                ]
            })

            // close

            return;
        }

        // If in update mode, ensure all trip-related expenses have a valid owner
        if (method === 'PUT' && props.item.expenses.some(expense => 
            !selected.value.some(user => user.id === expense.userId)
        )) {
            // alert('TripUsers with expenses cannot be deleted!');
            await createDialog({ 
                title: 'Disconnect Trip Users', 
                text: 'users with expenses cannot be disconnected!',
                level: 'error',
                // icon: 'mdi-emoticon-happy-outline',
                buttons: [
                    { title: 'Ok', key: 'ok', /* any v-btn api option */ },
                ]
            })
            // closeDialog();
            return;
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
            // VueCookies.remove('selectedTripId')
            useCookie('selectedTripId').value = null
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