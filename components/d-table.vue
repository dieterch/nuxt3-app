<template>
    <ForwardSlots :slots="$slots">
        <v-data-table 
            :items="props.items"
            :headers="props.headers"
            v-model:sort-by="props.sortBy"
            density="compact"
            nothide-default-footer
            v-if="lshow"
            @click:row="go"   
        >
        </v-data-table>
    </ForwardSlots>          
</template>

<script setup>
import { ref } from 'vue'
import {ForwardSlots} from "vue-forward-slots"

const props = defineProps(['items','headers','sortBy','show'])
const emit = defineEmits(['clickrow']);

const lshow = ref(props.show)

const go = ( event, row ) => {
   emit('clickrow', row.item.id) 
}

</script>