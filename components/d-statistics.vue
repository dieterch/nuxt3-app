<template>
    <table
        density="compact"
        @click="category_summary"
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
    <table
        density="compact"
        class="mt-1"
        v-if="showsummary"
    >
        <thead>
            <tr>
                <th>Category</th>
                <th>Total Amount</th>
                <th>Percentage</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="([category, { amount, percentage }], index) in Object.entries(expensesummary)" :key="index">
                <td>
                    {{  category }}
                </td>
                <td>
                    {{ Number(amount).toFixed(0) }}€
                </td>
                <td>
                    {{ percentage }}%
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps(['expenses','selectedTrip'])

const lselectedTrip = ref(props.selectedTrip)
const expenses = ref(props.expenses)
const showsummary = ref(false)
const expensesummary = ref({})

const overview = computed(() => {
    if (lselectedTrip.value) {
        const total = expenses.value.reduce( (sum, { amount }) => sum + amount, 0)
        const tdays = Math.ceil(totalDays())
        const avgexpense = total / tdays

        const summary = [
            { name:"Total", value: total + "€" },
            { name: "Days", value: tdays },
            { name:"Avg", value: avgexpense.toFixed(0) + "€" }
        ]
        const userbalance = (lselectedTrip.value.users.map((rec) => {
          const lsum = expenses.value.reduce( (sum, { amount, userId }) => ( userId === rec.user.id) ? sum + amount : sum, 0)
          return {
            name: rec.user.name,
            value: `${lsum.toFixed(0)}€`,
            share: `(${(expenses.value.length > 0) ? ((lsum / total) * 100).toFixed(0):"0"}%)`
          }
        }))
        return summary.concat(userbalance)
    } else {
        return 0
    }
})

const totalDays = () => {
    try {
        if ((lselectedTrip) && (expenses.value.length > 0)) {
            let startdate = lselectedTrip.value.startDate
            let lastdate = expenses.value[0].date
            expenses.value.forEach((rec) => { lastdate = (lastdate > rec.date) ? lastdate : rec.date})
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

const sumExpensesByCategory = (expenses, userName = null) => {
        const categorySums = expenses.reduce((acc, rec) => {
            if (!userName || rec.user.name === userName) {
                const category = rec.category.name;
                acc[category] = (acc[category] || 0) + rec.amount;
            }
            return acc;
        }, {});

        // Calculate total sum of all categories
        const totalAmount = Object.values(categorySums).reduce((sum, value) => sum + value, 0);

        // Add percentage for each category
        const categorySummary = {};
        for (const [category, amount] of Object.entries(categorySums)) {
                categorySummary[category] = {
                    amount,
                    percentage: totalAmount ? ((amount / totalAmount) * 100).toFixed(0) : 0,
                };
        }
        return categorySummary;
    }

const category_summary = () => {
    // // Get totals and percentages for a specific user, e.g., "Susanne"
    // const userExpenses = sumExpensesByCategory(expenses, "Susanne");
    // const userExpenseTable = generateExpenseTable(userExpenses);
    // console.log(userExpenses);  // Append the table to the document

    // Get totals and percentages for all users
    // const allExpenses = sumExpensesByCategory(expenses.value);
    expensesummary.value = sumExpensesByCategory(expenses.value);
    showsummary.value = !showsummary.value
    // console.log(allExpenses);  // Append the table to the document
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