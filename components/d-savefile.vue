<template>
    <d-btn icon="mdi-file-excel" @click="saveToExcel" />
</template>

<script setup>
  import { ref } from 'vue'
  import writeXlsxFile from 'write-excel-file'

  const props=defineProps(['selectedTrip'])
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
    }
  ]

  const demo_objects = ref([
    {
        date: new Date("2024-10-14T22:00:00.000Z"),
        category: 'Hotel',
        description: 'Hotelrechnung',
        amount: 1960.0,
        user: 'Dieter'
    },
    {
        date: new Date("2024-10-13T22:00:00.000Z"),
        category: 'Einkauf',
        description: 'Schokolade',
        amount: 12.0,
        user: 'Susanne'
    },
  ])

  const saveToExcel = async() => {

    const lfilteredexpenses = await $fetch('/api/tripexpenses', {
          method: 'POST',
          body: { id: lselectedTrip.value.id }
    })

    // design objects array:
    const lobjects = lfilteredexpenses.map(rec => ({
      date: new Date(rec.date),
      category: rec.category.name,
      description: rec.description,
      amount: rec.amount,
      currency: rec.currency,
      user: rec.user.name,
    }))

    await writeXlsxFile(lobjects, {
      schema,
      fileName: `${lselectedTrip.value.name}.xlsx`
    })
  }

</script>