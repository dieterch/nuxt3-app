<template>
    <v-container>
        <v-form 
            ref = "form"
            @submit.prevent="login">
            <v-text-field 
                label="Email"
                v-model="email" 
                placeholder="Email" 
                required
                :rules="[v => !!v || 'Email is required']"/>
            <v-text-field
                label="Password"
                v-model="password" 
                type="password" 
                placeholder="Password"
                required
                :rules="[v => !!v || 'Password is required']" />
          <v-btn type="submit">Login</v-btn>
        </v-form>
    </v-container>
</template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useCookie, navigateTo } from '#app'
  
  const email = ref<string>('')
  const password = ref<string>('')
  
  const login = async () => {
    try {
      const { token } = await $fetch<{ token: string }>('/api/login', {
        method: 'POST',
        body: { email: email.value, password: password.value },
      })
      useCookie('auth_token').value = token
      navigateTo('/')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }
  </script>
  