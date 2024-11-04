<template>
    <v-dialog v-model="ldialog" max-width="500px">
        <v-card>
            <v-card-title>{{ modeis('add') ? 'Add Category' : 'Update Category' }}</v-card-title>
            <v-card-text>
                <v-form 
                    ref="form" v-model="isFormValid" lazy-validation>
                    <v-row dense>
                        <v-col>
                            <v-text-field 
                                label="Category Name*" 
                                v-model="formCategory.name" 
                                :rules="[v => !!v || 'Name is required']" 
                                required>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col>
                            <v-text-field 
                                label="Category Icon*" 
                                v-model="formCategory.icon" 
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
                <v-btn v-if="modeis('add')" text="Add" @click="handleForm('POST')" :disabled="!isFormValid"/>
                <v-btn v-if="modeis('update')" text="Update" @click="handleForm('PUT')" :disabled="!isFormValid"/>
                <v-btn text="Close" @click="closeDialog">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'

    const props = defineProps(['dialog','mode','item']);
    const emit = defineEmits(['refresh','dialog']);

    const isFormValid = ref(false)
    const categories = ref([])

    // State
    const formCategory = ref({
        name: '',
        icon: ''
    })
    
    // Helper for determining dialog visibility and mode
    const ldialog = computed({
        get: () => props.dialog,
        set: (value) => emit('dialog', value),
    })

    const modeis = (e) => props.mode === e
        
    const resetForm = () => { formCategory.value = {name: '',icon: '' }}

    // Fetch Data on Mount
    onMounted(async () => {
        categories.value = await $fetch('/api/categories')

        switch(props.mode) {
            case 'add': 
                resetForm()
                break;
            case 'update':
                formCategory.value = {
                    ...formCategory.value,
                    id: props.item.id,
                    name: props.item.name,
                    icon: props.item.icon,
                }
                break;
        }        
    })

    const handleForm = async (method) => {
        if (!isFormValid.value) return
        
        rec = { ...formCategory.value } 

        // Send data to API
        try {
            await $fetch('/api/categories', {
                method,
                body: rec,
            })

            // Reset the form
            resetForm()
            emit('refresh')
            closeDialog()
        } catch (error) {
            console.error('Error submitting form:', error)
            alert(error)
        }
        
    }

    // // Form Submission
    // const submitForm = async () => {
    //     // Check if form is valid and if at least one user is selected
    //     if (!isFormValid.value) return

    //     // Send data to API
    //     try {
    //         await $fetch('/api/categories', {
    //         method: 'POST',
    //         body: formCategory.value
    //     })

    //         // Reset the form and close dialog
    //         resetForm()
    //         emit('refresh')
    //         closeDialog()
    //     } catch (error) {
    //         console.error('Error submitting form:', error)
    //     }
    // }

    // Close Dialog without Submission of data
    const closeDialog = () => {
        resetForm()
        emit('dialog', false)
    }
</script>