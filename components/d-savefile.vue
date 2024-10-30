<template>
    <d-btn icon="mdi-file-excel" @click="saveToExcel" />
</template>

<script setup>
import { ref } from 'vue'
import writeXlsxFile from 'write-excel-file'


const HEADER_ROW = ref([
    {
      value: 'Name',
      fontWeight: 'bold'
    },
    {
      value: 'Date of Birth',
      fontWeight: 'bold'
    },
    {
      value: 'Cost',
      fontWeight: 'bold'
    },
    {
      value: 'Paid',
      fontWeight: 'bold'
    }
  ])


const Tripexpense_Header = ref([
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
    {
        value: 'Datum',
        fontWeight: 'bold'
    },
    {
        value: 'Titel',
        fontWeight: 'bold'        
    },
    {
        value: 'Zahlung',
        fontWeight: 'bold'         
    }
])

const Tripexpense_ROW_1 = ref([
    {
        type: Date,
        value: new Date("2024-10-14T22:00:00.000Z"),
        format: 'dd.mm.yyyy'
    },
    {
        type: String,
        value: 'Hotelrechnung'
    },
    {
        type: Number,
        value: 1960.0 
    }
])

const Tripexpense_ROW_2 = ref([
    {
        type: Date,
        value: new Date("2024-10-13T22:00:00.000Z"),
        format: 'dd.mm.yyyy'
    },
    {
        type: String,
        value: 'Schokolade'
    },
    {
        type: Number,
        value: 12.0 
    }
])

  const DATA_ROW_1 = ref([
    // "Name"
    {
      type: String,
      value: 'John Smith'
    },
  
    // "Date of Birth"
    {
      type: Date,
      value: new Date(),
      format: 'mm/dd/yyyy'
    },
  
    // "Cost"
    {
      type: Number,
      value: 1800
    },  

    // "Paid"
    {
      type: Boolean,
      value: true
    }
  ])


    const saveToExcel = async() => {
    
    // const data = [
    //     HEADER_ROW.value,
    //     DATA_ROW_1.value,
    // ]

    const data = [ 
        Tripexpense_Header.value,
        Tripexpense_ROW_1.value,
        Tripexpense_ROW_2.value,
    ]

    console.log(data)

    // await writeXlsxFile(data, {
    //     HEADER_ROW,
    //     fileName: 'file.xlsx'
    // })

    await writeXlsxFile(data, {
        Tripexpense_Header,
        fileName: 'Rogner Bad Blumau.xlsx'
    })

    await alert("Excel Export successful!")
}

</script>