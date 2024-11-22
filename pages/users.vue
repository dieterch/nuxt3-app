<template>
  <v-container>
    <d-appbar pagetitle="Users"/>
    <v-row>
      <v-col class="text-right">
        <d-btn
          icon="mdi-plus"
          @click="
            umode = 'add';
            uitem = {};
            isUserDialogOpen = true;
          "
        />
        <d-usersdialog
          :dialog="isUserDialogOpen"
          :key="isUserDialogOpen"
          :mode="umode"
          :item="uitem"
          @refresh="fetchUsers"
          @dialog="
            (e) => {
              isUserDialogOpen = e;
            }
          "
        />
        <d-btn icon="mdi-bug" @click="debug = !debug" />
        <d-btn icon="mdi-refresh" @click="fetchUsers" />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <d-table :items="users" :headers="usersHeaders" :show="true">
          <template v-slot:item.actions="{ item }">
            <div class="button-container">
              <d-btn icon="mdi-delete" @click="deleteUser(item)" />
              <d-btn
                icon="mdi-square-edit-outline"
                @click="
                  umode = 'update';
                  uitem = item;
                  isUserDialogOpen = true;
                "
              />
            </div>
          </template>
        </d-table>
      </v-col>
    </v-row>

    <v-divider color="black" thickness="1"></v-divider>
    <pre v-if="debug">{{ users }}</pre>
  </v-container>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});

import { ref, onMounted } from "vue";
import { confirmDialog } from "vuetify3-dialog";

const { $ifetch } = useNuxtApp();
import { CapacitorCookies } from "@capacitor/core";

const users = ref([]);
// const isFormValid = ref(false)
const debug = ref(false);
const isUserDialogOpen = ref(false);
const umode = ref("");
const uitem = ref({});

const usersHeaders = [
  { title: "Email", key: "email", width: "20%", align: "start" },
  { title: "Name", key: "name", width: "auto", align: "start" },
  { title: "Role", key: "role", width: "auto", align: "start" },
  {
    title: "Expenses",
    key: "countexpenses",
    value: (item) => item.expenses.length,
  },
  { title: "Trips", key: "counttrips", value: (item) => item.trips.length },
  { title: "Actions", key: "actions", width: "5%", sortable: false },
];

const fetchUsers = async () => {
  users.value = await $ifetch.get("/api/users");
  // users.value = await $fetch("/api/users");
};

// Fetch Data
onMounted(async () => {
  fetchUsers();
});

// Delete User
const deleteUser = async (item) => {
  let permit =
    item.expenses.length > 0
      ? await confirmDialog({
          title: "Please Confirm",
          text: `"${item.name}" takes part in ${item.trips.length} trips and owns ${item.expenses.length} expenses. All connected expenses in all relevant trips will be deleted.   Continue ?`,
          level: "warning",
          // icon: 'mdi-emoticon-happy-outline',
          cancelText: "Cancel",
          confirmationText: "Ok",
        })
      : true;

  if (permit) {
    await $ifetch.delete("/api/users", {
      data: { id: item.id },
      headers: { "Content-Type": "application/json" },
    });
    // await $fetch("/api/users", {
    //   method: "DELETE",
    //   body: item,
    // });
    fetchUsers();
  }
};
</script>

<style lang="css" scoped>
.button-container {
  display: flex;
}
</style>
