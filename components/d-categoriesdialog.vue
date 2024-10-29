<template>
    <v-dialog
    v-model="dialog"
    max-width="410"
    >
    <template v-slot:activator="{ props: activatorProps }">
        <v-btn
            noclass="text-none font-weight-regular"
            prepend-icon="mdi-shape"
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
        <v-card-title>Add Category</v-card-title>
        <v-card-text>
            <v-form 
                ref="form" 
                v-model="isFormValid" 
                lazy-validation
            >
                <v-row dense>
                    <v-col>
                        <v-text-field 
                            label="Category Name*" 
                            v-model="dialogcategory.name" 
                            :rules="[v => !!v || 'Name is required']" 
                            required>
                        </v-text-field>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col>
                        <v-text-field 
                            label="Category Icon*" 
                            v-model="dialogcategory.icon" 
                            :rules="[v => !!v || 'Icon is required']" 
                            required>
                        </v-text-field>
                    </v-col> 
                </v-row>
                <v-row dense>
                    <v-col>
                        <v-list-item>
                            <small class="text-caption text-medium-emphasis">*indicates required field</small>
                        </v-list-item>
                    </v-col>
                    <v-col class="text-right">
                        <v-list-item 
                            target="_blank" 
                            href="https://pictogrammers.com/library/mdi/"
                        ><small>open link: mdi-icons</small></v-list-item>
                    </v-col>
                </v-row>
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
    const dialogcategories = ref([])

    // State
    const dialogcategory = ref({name: '',icon: ''})
    const resetForm = () => { dialogcategory.value = {name: '',icon: '' }}

    // Fetch Data on Mount
    onMounted(async () => {
        const { data: categoriesData } = await useFetch('/api/categories')
        dialogcategories.value = categoriesData.value
    })

    // Form Submission
    const submitForm = async () => {
        // Check if form is valid and if at least one user is selected
        if (!isFormValid.value) return

        // Send data to API
        try {
            await $fetch('/api/categories', {
            method: 'POST',
            body: dialogcategory.value
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