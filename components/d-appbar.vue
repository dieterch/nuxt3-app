<template>
      <v-app-bar
        app
        color="grey-darken-3"
        dark
        density="compact"
        :elevation="5"
      >
        <!--v-toolbar-title>Expenses</v-toolbar-title>
        <Display User Role -->
        <v-btn variant="plain" :ripple="false" to="/">Expenses</v-btn>
        <v-spacer></v-spacer>
        <span>{{ userInfo.name }}&NonBreakingSpace;|&NonBreakingSpace;{{ userInfo.role }}</span>
        <v-btn>
          <span class="mdi mdi-menu"></span>
          <v-menu activator="parent">
            <v-list>
              <v-list-item>
                <v-btn variant="plain" :ripple="false" to="/trips">Trips</v-btn>
              </v-list-item>
              <v-list-item>
                <v-btn variant="plain" :ripple="false" to="/users">Users</v-btn>
              </v-list-item>
              <v-list-item>
                <v-btn variant="plain" :ripple="false" to="/categories">Categories</v-btn>
              </v-list-item>
              <v-list-item>
                <v-btn variant="plain" :ripple="false" to="/allexpenses">Expenses</v-btn>
              </v-list-item>
              <v-list-item>
                <v-btn variant="plain" :ripple="false" to="/test">Test</v-btn>
              </v-list-item>
              <v-list-item>
                <v-btn variant="plain" :ripple="false" to="/logout">Logout</v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </v-app-bar>
  </template>
  
  <script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useUserInfo} from '~/composables/useUserInfo'
    const userInfo = ref({})

    onMounted(async () => {
      const info = await useUserInfo()
      if (info) { userInfo.value = info }
    })

  </script>
  
  <style scoped>
  /* Additional styling if necessary */
  </style>
  