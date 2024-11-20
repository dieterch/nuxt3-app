<template>
    <v-dialog v-model="ldialog" max-width="500px">
        <v-card>
            <v-card-title>{{ modeis('add') ? 'Add User' : 'Update User' }}</v-card-title>
            <v-card-text>
                <v-form ref="form" v-model="isFormValid" lazy-validation>
                    <v-text-field 
                        label="User Name*" 
                        v-model="formUser.name" 
                        :rules="[v => !!v || 'Name is required']" 
                        required>
                    </v-text-field>

                    <v-text-field 
                        label="User Email*" 
                        v-model="formUser.email" 
                        :rules="[v => !!v || 'Name is required']"  
                        required>
                    </v-text-field>

                    <v-text-field
                        label="Password*" 
                        v-model="formUser.password"
                        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        :norules="[v => !!v || 'Password is required',v => v.length >= 8 || 'Min 8 characters']" 
                        :type="showPassword ? 'text' : 'password'"
                        hint="At least 8 characters"
                        @click:append="showPassword = !showPassword"
                        v-if="uRole(['admin'])"
                    ></v-text-field>
                    
                    <v-select
                        label="Role*"
                        density="compact"
                        v-model="formUser.role"
                        :items="roles"
                        required
                        :rules="[v => !!v || 'required']"
                    ></v-select>

                    <small class="text-caption text-medium-emphasis">*indicates required field</small>
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
    import { useUserInfo } from '~/composables/useUserInfo'
    const { userInfo, loggedIn, uRole, fetchUserInfo } = useUserInfo()
    const { $jwtHelper } = useNuxtApp()
    import { hashSync }from 'bcryptjs' // for frontend

    import { ref, computed, onMounted } from 'vue'

    const props = defineProps(['dialog','mode','item']);
    const emit = defineEmits(['refresh','dialog']);

    const isFormValid = ref(false)
    const showPassword = ref(false)
    const users = ref([])

    // roles seed => 
    // it would make sense to transfer this table to the database.
    const roles = [
        'user',
        'admin',
    ]

    // State
    const formUser = ref({ 
        name: '', 
        email: '',
        password: '',
        role: 'user'
    })

    // Helper for determining dialog visibility and mode
    const ldialog = computed({
        get: () => props.dialog,
        set: (value) => emit('dialog', value),
    })

    const modeis = (e) => props.mode === e
    
    // Reset Form
    const resetForm = () => { 
        formUser.value = { name: '', email: '', password: '' }
    }
    
    // Fetch Data on Mount
    onMounted(async () => {
        await fetchUserInfo()
        users.value = await $fetch('/api/users')

        switch(props.mode) {
            case 'add': 
                resetForm()
                break;
            case 'update':
                formUser.value = {
                    ...formUser.value,
                    id: props.item.id,
                    name: props.item.name,
                    email: props.item.email,
                    // password: props.item.password,
                    role: props.item.role
                }
                break;
        }

    })


    const handleForm = async (method) => {
        if (!isFormValid.value) return
        
        // rec is the same for BOTH methods
        let rec = { ...formUser.value }

        if (formUser.value.password != '') {
            rec.password = hashSync(formUser.value.password, 10)
        } else console.log('Password not changed.')
        
        // Send data to API
        try {
            await $fetch('/api/users', {
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

    // Close Dialog without Submission of data
    const closeDialog = () => {
        resetForm()
        emit('dialog', false)
    }
</script>