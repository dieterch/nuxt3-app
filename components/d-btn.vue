<template>
    <v-btn
        color="surface"
        class="ml-2"
        novariant="flat"
        rounded="0"
        elevation="1"
        size="x-small"
        :icon="props.icon"
    ></v-btn>
</template>

<script setup lang="ts">

    interface Props { icon: string }
    const props = defineProps<Props>()

</script>
