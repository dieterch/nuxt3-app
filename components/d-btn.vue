<template>
    <v-btn
        color="surface"
        class="ml-2 mb-1 mt-1"
        novariant="flat"
        rounded="0"
        elevation="1"
        size="xx-small"
        :icon="props.icon"
    ></v-btn>
</template>

<script setup lang="ts">

    interface Props { icon: string }
    const props = defineProps<Props>()

</script>
