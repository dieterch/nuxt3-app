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
    <div v-html="htmlcontent" class="mt-2"></div>
</template>

<script setup>
import { ref } from 'vue'
import Allexpenses from '~/pages/allexpenses.vue';

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
            { name:"Avg", value: avgexpense.toFixed(0) + "€" }
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
                    percentage: totalAmount ? ((amount / totalAmount) * 100).toFixed(2) : 0,
                };
        }
         return categorySummary;
    }

const htmlcontent = ref('')

const generateExpenseTable = (expenseSummary) => {
  let html = '<table border="1"><tr><th>Category</th><th>Total Amount</th><th>Percentage</th></tr>';
  for (const [category, { amount, percentage }] of Object.entries(expenseSummary)) {
    html += `<tr><td>${category}</td><td>${amount.toFixed(2)}</td><td>${percentage}%</td></tr>`;
  }
  html += '</table>';
  return html;
}

const category_summary = () => {
    // const expenses = lfilteredexpenses.value
    // // Get totals and percentages for a specific user, e.g., "Susanne"
    // const userExpenses = sumExpensesByCategory(expenses, "Susanne");
    // const userExpenseTable = generateExpenseTable(userExpenses);
    // console.log(userExpenses);  // Append the table to the document

    // Get totals and percentages for all users
    const allExpenses = sumExpensesByCategory(lfilteredexpenses.value);
    const allExpenseTable = generateExpenseTable(allExpenses);
    htmlcontent.value = allExpenseTable
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