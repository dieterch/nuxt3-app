<template>
  <v-app>

    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Expenses</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/">Home</v-btn>
      <v-btn text to="/dialogtrips">Trips</v-btn>
      <v-btn text to="/dialogusers">Users</v-btn>
      <v-btn text to="/dialogcategories">Categories</v-btn>
      <v-btn text to="/dialogexpenses">Dialog Expenses</v-btn>
      <v-btn text to="/expenses">Expenses</v-btn>
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