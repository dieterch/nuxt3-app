<template>
  <v-container>
    <d-appbar :pagetitle="ltripname" />
    <!--v-divider color="black" thickness="1"></v-divider>
      <v-select
        density="compact"
        v-model="selectedTrip"
        @update:modelValue="tripChanged"
        :items="trips"
        item-title="name"
        item-value="id"
        label="Select Trip"
        return-object
      ></v-select-->

    <v-row>
      <v-col md="6">
        <d-statistics
          :key="filteredexpenses"
          :expenses="filteredexpenses"
          :selectedTrip="selectedTrip"
          :v-bind="selectedTrip"
        />
      </v-col>
      <v-col class="text-right">
        <d-btn
          icon="mdi-plus"
          @click="
            emode = 'add';
            eitem = {};
            isExpenseDialogOpen = true;
          "
        />
        <d-expensedialog
          :dialog="isExpenseDialogOpen"
          :key="isExpenseDialogOpen"
          :mode="emode"
          :item="eitem"
          :selectedTrip="selectedTrip"
          @refresh="tripChanged"
          @dialog="
            (e) => {
              isExpenseDialogOpen = e;
            }
          "
        />
        <d-savefile
          :key="tripkey(1)"
          :selectedTrip="selectedTrip"
          mode="single"
          :v-bind="selectedTrip"
        />

        <d-btn icon="mdi-bug" @click="debug = !debug" v-if="uRole(['admin'])" />
        <d-btn icon="mdi-refresh" @click="tripChanged" />
      </v-col>
    </v-row>
    <v-row>
      <!--v-divider color="black" thickness="1"></v-divider-->
    </v-row>
    <v-row>
      <v-col>
        <d-table
          :key="filteredexpenses"
          :items="filteredexpenses"
          :headers="expense_headers"
          :show="selectedTrip"
          :sort-by="sortBy"
        >
          <template v-slot:item.category.icon="{ item }">
            <v-icon :icon="item.category.icon"></v-icon>
          </template>
          <template v-slot:item.actions="{ item }">
            <div class="button-container">
              <d-btn icon="mdi-delete" @click="deleteExpense(item)" />
              <d-btn
                icon="mdi-square-edit-outline"
                @click="
                  emode = 'update';
                  eitem = item;
                  isExpenseDialogOpen = true;
                "
              />
            </div>
          </template>
        </d-table>
      </v-col>
    </v-row>
    <div v-if="debug">
      Selected Trip:
      <pre>{{ selectedTrip }}</pre>

      Filtered Expenses:
      <pre>{{ filteredexpenses }}</pre>
    </div>
  </v-container>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});

// const config = useRuntimeConfig()
// console.log(config.public.DO_NOT_USE_AUTH)

import { useUserInfo } from "~/composables/useUserInfo";
const { userInfo, loggedIn, uRole, fetchUserInfo } = useUserInfo();

import { ref, onMounted, computed } from "vue";
import { confirmDialog } from "vuetify3-dialog";

import { useIFetch } from "@/composables/UseIonosfetch";
// Fetch utility composable
const ifetch = useIFetch();

import { CapacitorCookies } from "@capacitor/core";
// import VueCookies from 'vue-cookies'

const isExpenseDialogOpen = ref(false);
const emode = ref("");
const eitem = ref({});
const trips = ref([]);
const ltripname = ref("");
const selectedTrip = ref(null);
const selectedTripId = ref("");
const filteredexpenses = ref([]);
const debug = ref(false);

const tripkey = (index) => {
  return selectedTrip.value
    ? `${selectedTrip.value.id} + ${index}`
    : `${index}`;
};

// Fetch Data on Mount
onMounted(async () => {
  await fetchUserInfo();

  // fetch available trips
  // trips.value = await $fetch('/api/trips')
  trips.value = await ifetch.get("/api/trips");
  const temp = await CapacitorCookies.getCookies();
  // console.log("Capacitor Cookies:", temp);
  //if ( useCookie('selectedTripId').value ) {
  if (temp["selectedTripId"]) {
    // selectedTripId.value = VueCookies.get('selectedTripId')
    // selectedTripId.value = useCookie('selectedTripId').value
    selectedTripId.value = temp.selectedTripId;
    console.log(
      "selectedTripId exists in cookies, selectedTripId.value=",
      selectedTripId.value
    );
    selectedTrip.value = trips.value.find(
      (item) => item.id === selectedTripId.value
    );
    ltripname.value = selectedTrip.value.name;
    fetchFilteredExpenses();
    // console.log("selectedTrip", selectedTrip.value, "selectedTripId: ",selectedTripId.value)
  } else {
    console.log(
      "selectedTripId does not exist in cookies, selectedTripId.value=",
      selectedTripId.value
    );
  }
});

//define the expense v-data-table
//sort is reversed order of dates
const sortBy = [{ key: "date", order: "desc" }];
//columns definition & optimization
const expense_headers = [
  //format the date
  {
    title: "Date",
    key: "formateddate",
    width: "5%",
    value: (item) =>
      new Date(item.date).toLocaleDateString("de-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
    sortable: "false",
    align: "end",
  },
  // do not display the Trip Name:
  // { title: 'Trip', key: 'trip.name', sortable: "false"},
  { title: "Cat", key: "category.icon", width: "auto", align: "left" },
  { title: "Description", key: "description", align: "left" },
  //combine amount & Currency into one column:
  {
    title: "Expense",
    key: "expense",
    width: "5%",
    value: (item) => `${item.amount}${item.currency}`,
    align: "end",
  },
  { title: "User", key: "user.name", width: "5%" },
  //add a column for action buttons
  { title: "Actions", key: "actions", sortable: false },
];

const fetchFilteredExpenses = async () => {
  try {
    filteredexpenses.value = await ifetch.post("/api/tripexpenses", {
      // data: { id: "9bb38019-873f-4bf4-8a35-ac4dffb49bf7" },
      data: { id: selectedTripId.value },
      headers: { "Content-Type": "application/json" },
    });
    // filteredexpenses.value = await $fetch('/api/tripexpenses', {
    // method: 'POST',
    // body: { id: selectedTripId.value }
    //})
  } catch (error) {
    console.error("Error fetching filtered Expenses", error);
  }
};

// fetch filtered Expenses
const tripChanged = async () => {
  if (selectedTrip.value) {
    selectedTripId.value = selectedTrip.value.id;
    fetchFilteredExpenses();
    // Store selected Trip in a cookie for 30 days.
    // useCookie("selectedTripId", { maxAge: 60 * 60 * 24 * 30 }).value =
    //   selectedTrip.value.id;
    await CapacitorCookies.setCookie({
      key: "selectedTripId",
      value: selectedTrip.value.id,
      maxAge: 60 * 60 * 24 * 30,
    });
    // VueCookies.set('selectedTripId', selectedTrip.value.id, "30d")
  }
};

// Delete Expense
const deleteExpense = async (item) => {
  let permit = await confirmDialog({
    title: "Please Confirm",
    text: `Delete " ${item.description} ". Continue?`,
    level: "warning",
    // icon: 'mdi-emoticon-happy-outline',
    cancelText: "Cancel",
    confirmationText: "Ok",
  });

  if (permit) {
    await ifetch.del("/api/expenses", {
      data: { id: item.id },
      headers: { "Content-Type": "application/json" },
    });
    // await $fetch('/api/expenses', {
    //   method: 'DELETE',
    //   body: item,
    // })
    // Refresh expenses
    tripChanged();
  }
};
</script>

<style lang="css" scoped>
.button-container {
  display: flex;
}
</style>
