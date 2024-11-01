<template>
    <v-dialog
    v-model="ldialog"
    width="auto"
    >
    <v-card
        max-width="400"
        prepend-icon="mdi-update"
        text="Your application will relaunch automatically after the update is complete."
        title="Update in progress"
    >
        <template v-slot:actions>
        <v-btn
            class="ms-auto"
            text="Ok"
            @click="ldialog = false; update()"
        ></v-btn>
        </template>
    </v-card>
    </v-dialog>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({dialog: Boolean})
const emit = defineEmits(['dialog'])

const ldialog = ref(props.dialog)

const update = () => {
    emit('dialog', ldialog.value);
}
</script>