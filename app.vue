<template>
  <v-app>
    <!--v-app-bar 
      app 
      _color="primary" 
      dark
      name="menu-bar" 
      density="compact"
      color="grey-darken-3"
      :elevation="5"
      >
      <v-toolbar-title>Expenses</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/">Main</v-btn>
      <v-btn>
        <span class="mdi mdi-menu"></span>
        <v-menu activator="parent">
          <v-list>
            <v-list-item><v-btn text variant="flat" to="/trips">Trips</v-btn></v-list-item>
            <v-list-item><v-btn text variant="flat" to="/users">Users</v-btn></v-list-item>
            <v-list-item><v-btn text variant="flat" to="/categories">Categories</v-btn></v-list-item>
            <v-list-item><v-btn text variant="flat" to="/allexpenses">Expenses</v-btn></v-list-item>
            <v-list-item><v-btn text variant="flat" to="/test">Test</v-btn></v-list-item>
            <v-list-item><v-btn text variant="flat" to="/logout">Logout</v-btn></v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </v-app-bar
    a test change-->
      
      <v-main>
        <nuxt-page />
      </v-main>

      <v-footer app>
        <v-spacer></v-spacer>
        <v-col class="text-center">
          &copy; {{ new Date().getFullYear() }}&NonBreakingSpace;
          Expense&NonBreakingSpace;Management
        </v-col>
        <v-spacer></v-spacer>
      </v-footer>

    </v-app>
</template>

<script setup>
</script>

<style>
/* Falls nötig, hier zusätzliche globale Stile hinzufügen */
</style>