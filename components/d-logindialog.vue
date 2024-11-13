<template>
    <v-dialog v-model="ldialog" max-width="500px">
        <v-card>
            <v-card-title>Login</v-card-title>
            <v-card-text>
                <v-form 
                    ref="form" 
                    v-model="isFormValid" 
                    lazy-validation>

                    <v-text-field 
                        label="Email" 
                        v-model="email"
                        placeholder="Email" 
                        :rules="[v => !!v || 'Email is required']" 
                        required>
                    </v-text-field>

                    <v-text-field 
                        label="Password" 
                        v-model="password"
                        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showPassword ? 'text' : 'password'"
                        placeholder="Password"
                        :rules="[v => !!v || 'Password is required']" 
                        @click:append="showPassword = !showPassword">
                    </v-text-field>
                </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="Login" @click="login" :disabled="!isFormValid"/>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { createDialog } from 'vuetify3-dialog'

    const props = defineProps(['dialog']);
    const emit = defineEmits(['dialog']);

    const isFormValid = ref(false)
    const showPassword = ref(false)

    const email = ref<string>('')
    const password = ref<string>('')

    // Helper for determining dialog visibility and mode
    const ldialog = computed({
        get: () => props.dialog,
        set: (value) => emit('dialog', value),
    })

    const login = async () => {
    try {
        const { token } = await $fetch<{ token: string }>('/api/login', {
        method: 'POST',
        body: { email: email.value, password: password.value },
      })
      // useCookie('auth_token').value = token
      navigateTo('/')
      emit('dialog', false)
    } catch (error) {
        console.error('Login failed:', error)
        await createDialog({ 
            title: "Login", 
            text: `Login failed, please check and try again`,
            level: 'error',
            icon: 'mdi-alert-circle',
            buttons: [
                { title: 'Ok', key: 'ok', /* any v-btn api option */ },
            ]

        })
    }
  }


</script>