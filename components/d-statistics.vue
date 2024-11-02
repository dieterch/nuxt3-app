<template>
    <!--pre>
{{ overview }}
    </pre-->
    <table
        density="compact"
    >
        <thead>
            <tr>
                <th v-for="(item, index) in overview" :key="index">
                    {{ item.name }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td v-for="(item, index) in overview" :key="index">
                        {{ item.value }} {{ item.share }}
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps(['filteredexpenses','selectedTrip'])

const lselectedTrip = ref(props.selectedTrip)
const lfilteredexpenses = ref(props.filteredexpenses)

const overview = computed(() => {
    if (lselectedTrip.value) {
        const total = lfilteredexpenses.value.reduce( (sum, { amount }) => sum + amount, 0)
        const tdays = Math.ceil(totalDays())
        const avgexpense = total / tdays

        const summary = [
            { name:"Total", value: total + "€" },
            { name: "Days", value: tdays },
            { name:"Avg", value: avgexpense + "€" }
        ]
        const userbalance = (lselectedTrip.value.users.map((rec) => {
          const lsum = lfilteredexpenses.value.reduce( (sum, { amount, userId }) => ( userId === rec.user.id) ? sum + amount : sum, 0)
          return {
            name: rec.user.name,
            value: `${lsum.toFixed(0)}€`,
            share: `(${(lfilteredexpenses.value.length > 0) ? ((lsum / total) * 100).toFixed(0):"0"}%)`
          }
        }))
        return summary.concat(userbalance)
    } else {
        return 0
    }
})

const totalDays = () => {
    try {
        if ((lselectedTrip) && (lfilteredexpenses.value.length > 0)) {
            let startdate = lselectedTrip.value.startDate
            let lastdate = lfilteredexpenses.value[0].date
            lfilteredexpenses.value.forEach((rec) => { lastdate = (lastdate > rec.date) ? lastdate : rec.date})
            let diff = (new Date(lastdate) - new Date(startdate))/(1000*60*60*24)
            return diff
        } else {
            return 1
        }
    } 
    catch(error) {
        console.log(error)
        return 1
    }
}

</script>

<style scoped>
table {
    font-size: x-small;
}
table, td, th {
    border: 1px solid grey;
    border-collapse: collapse;
    min-width: 50px;
    padding: 5px;
    text-align: center;
        }
th {
    background-color: gray;
    color: white;
}
</style>