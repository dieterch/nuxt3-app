<template>
    <v-table
        density="compact"
    >
        <thead>
            <tr>
                <th class="text-left">
                Days
                </th>
                <th class="text-left">
                Total
                </th>
                <th class="text-left">
                per Day
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ props.totalDays }}</td>
                <td>{{ props.totalExpenses }}</td>
                <td>{{ props.expensePerDay }}</td>
            </tr>
        </tbody>
    </v-table>
</template>

<script setup>
import { ref, defineProps } from 'vue'

const props = defineProps(['totalDays','totalExpenses','expensePerDay'])

</script>