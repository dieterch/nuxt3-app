<template>
    <d-btn icon="mdi-file-excel" @click="saveToExcel" />
</template>

<script setup>
  import { ref } from 'vue'
  import writeXlsxFile from 'write-excel-file'

  const props=defineProps(['selectedTrip','mode'])
  const lselectedTrip = ref(props.selectedTrip)

  //   id          String   @id @default(uuid())
  //   amount      Float
  //   currency    String
  //   date        DateTime
  //   location    String
  //   description String?
  //   trip        Trip     @relation(fields: [tripId], references: [id], onDelete: Cascade)
  //   tripId      String
  //   user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  //   userId      String
  //   category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  //   categoryId  String
  //   createdAt   DateTime @default(now())
  //   updatedAt   DateTime @updatedAt
  const schema = [
    {
      column: 'Datum',
      type: Date,
      format: 'dd.mm.yyyy',
      value: rec => rec.date 
    },
    {
      column: 'Kategorie',
      type: String,
      value: rec => rec.category,
    },
    {
      column: 'Titel',
      type: String,
      value: rec => rec.description 
    },
    {
      column: 'Ausgabe',
      type: Number,
      format: '#,##0.00',
      value: rec => rec.amount 
    },
    {
      column: 'Währung',
      type: String,
      value: rec => rec.currency
    },
    {
      column: 'Teilnehmer',
      type: String,
      value: rec => rec.user 
    },
    {
      column: 'Reise',
      type: String,
      value: rec => rec.tripname,
    },
  ]

  const saveToExcel = async() => {

    const lexpenses = (props.mode == 'single') ? 
    await $fetch('/api/tripexpenses', { // mode 'single'
          method: 'POST',
          body: { id: lselectedTrip.value.id }
    }) :
    await $fetch('/api/expenses') // mode 'all'

    // design objects array:
    const lobjects = lexpenses.map(rec => ({
      date: new Date(rec.date),
      tripname: rec.trip.name,
      category: rec.category.name,
      description: rec.description,
      amount: rec.amount,
      currency: rec.currency,
      user: rec.user.name,
    }))

    const lfilename = (props.mode == 'single') ? `${lselectedTrip.value.name}.xlsx` : 'allexpenses.xlsx'
    await writeXlsxFile(lobjects, {
      schema,
      fileName: lfilename  // `${lselectedTrip.value.name}.xlsx`
    })
  }

</script>