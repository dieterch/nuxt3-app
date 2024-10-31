<template>
    <ForwardSlots :slots="$slots">
        <v-data-table 
            :items="props.items"
            :headers="props.headers"
            v-model:sort-by="props.sortBy"
            density="compact"
            nothide-default-footer
            v-if="lshow"            
        >
        </v-data-table>
    </ForwardSlots>          
</template>

<script setup>
import { ref } from 'vue'
import {ForwardSlots} from "vue-forward-slots"

const props = defineProps(['items','headers','sortBy','show'])
const lshow = ref(props.show)

</script>