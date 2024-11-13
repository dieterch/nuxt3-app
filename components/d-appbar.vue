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
        <span v-if="loggedIn()">{{ userInfo.name }}&NonBreakingSpace;|&NonBreakingSpace;{{ userInfo.role }}</span>
        <v-btn>
          <span class="mdi mdi-menu"></span>
          <v-menu activator="parent">
            <v-list>
              <v-list-item v-if="uRole(['user','admin'])">
                <v-btn variant="plain" :ripple="false" to="/trips">Trips</v-btn>
              </v-list-item>
              <v-list-item v-if="uRole(['admin'])">
                <v-btn variant="plain" :ripple="false" to="/users">Users</v-btn>
              </v-list-item>
              <v-list-item v-if="uRole(['user','admin'])">
                <v-btn variant="plain" :ripple="false" to="/categories">Categories</v-btn>
              </v-list-item>
              <v-list-item v-if="uRole(['admin'])">
                <v-btn variant="plain" :ripple="false" to="/allexpenses">All Expenses</v-btn>
              </v-list-item>
              <!--v-list-item v-if="loggedIn()">
                <v-btn variant="plain" :ripple="false" to="/test">Test (unprotected)</v-btn>
              </v-list-item-->
              <v-list-item v-if="!uRole(['user','admin'])">
                <v-btn variant="plain" :ripple="false" to="/login">Login</v-btn>
              </v-list-item>
              <v-list-item v-if="uRole(['user','admin'])">
                <v-btn variant="plain" :ripple="false" to="/logout">Logout</v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </v-app-bar>
  </template>
  
  <script setup>
    import { ref, onMounted } from 'vue'
    import { useUserInfo } from '~/composables/useUserInfo'
    const { userInfo, loggedIn, uRole, fetchUserInfo } = useUserInfo()

    onMounted(async () => {
      await fetchUserInfo()
    })

  </script>
  
  <style scoped>
  /* Additional styling if necessary */
  </style>
  