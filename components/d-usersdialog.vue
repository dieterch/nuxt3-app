<template>
    <v-dialog
    v-model="dialog"
    max-width="410"
    >
    <template v-slot:activator="{ props: activatorProps }">
        <v-btn
            noclass="text-none font-weight-regular"
            prepend-icon="mdi-account"
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
        <v-card-title>Add User</v-card-title>
        <v-card-text>
            <v-form 
                ref="form" 
                v-model="isFormValid" 
                lazy-validation
            >
                <v-text-field 
                    label="User Name*" 
                    v-model="dialoguser.name" 
                    :rules="[v => !!v || 'Name is required']" 
                    required>
                </v-text-field>
                <v-text-field 
                    label="User Email*" 
                    v-model="dialoguser.email" 
                    :rules="[v => !!v || 'Name is required']"  
                    required>
                </v-text-field>  
                <small class="text-caption text-medium-emphasis">*indicates required field</small>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="Add" @click="submitForm">Add</v-btn>
            <v-btn text="Close" @click="closeDialog">Close</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    const emit = defineEmits(['refresh']);

    const isFormValid = ref(false)
    const dialog = ref(false)
    const dialogusers = ref([])

    // State
    const dialoguser = ref({ name: '', email: ''})
    const resetForm = () => { dialoguser.value = { name: '', email: '' }
}

    // Fetch Data on Mount
    onMounted(async () => {
        const { data: usersData } = await useFetch('/api/users')
        dialogusers.value = usersData.value
    })

    // Form Submission
    const submitForm = async () => {
        // Check if form is valid and if at least one user is selected
        if (!isFormValid.value) return

        // Send data to API
        try {
            await $fetch('/api/users', {
            method: 'POST',
            body: dialoguser.value,
            })

            // Reset the form and close dialog
            resetForm()
            emit('refresh')
            dialog.value = false
        } catch (error) {
            console.error('Error submitting form:', error)
        }
    }

    // Close Dialog without Submission of data
    const closeDialog = () => {
        resetForm()
        dialog.value = false
    }
</script>