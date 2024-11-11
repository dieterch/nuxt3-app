<template>
    <v-container>
        <d-appbar />
        <d-logindialog 
          dialog="isLoginDialogOpen" 
          @dialog="(e)=>{isLoginDialogOpen = e}"  
        />
    </v-container>
</template>
  
<script setup lang="ts">
  const isLoginDialogOpen = ref(true)
</script>
  