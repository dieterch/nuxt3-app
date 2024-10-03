<!--template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>
</template-->

<template>
  <v-app>

    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Expense Management</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/">Home</v-btn>
      <v-btn text to="/dialogtrips">Dialog Trips</v-btn>
      <v-btn text to="/trips">Trips</v-btn>
      <v-btn text to="/expenses">Expenses</v-btn>
      <v-btn text to="/users">Users</v-btn>
      <v-btn text to="/categories">Categories</v-btn>
      </v-app-bar>
      
      <v-main>
        <nuxt-page />
      </v-main>

      <v-footer app>
        <v-spacer></v-spacer>
        <v-col class="text-center">
          &copy; {{ new Date().getFullYear() }} - Expense Management
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