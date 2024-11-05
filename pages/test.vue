<template>
<v-container>
    <v-row>
        <v-col>
            <v-btn 
                @click="cdtest1">
                Dialog 1
            </v-btn>
        </v-col>
        <v-col>
            <v-btn @click="cdtest2">
                Dialog 2
            </v-btn>
        </v-col>
        <v-col>
            <v-btn @click="cdtest3">
                Dialog 3
            </v-btn>
        </v-col>
    </v-row>
</v-container>
</template>

<script setup>
import { createDialog, warnDialog, confirmDialog } from 'vuetify3-dialog'
    import { createNotification, notifySuccess } from 'vuetify3-dialog'
    import { createBottomSheet } from 'vuetify3-dialog'

    const cdtest1 = async () => {

        const answer = await createDialog({ 
            title: "Please Confirm", 
            text: `XX has 5 trips and 6 expenses. Continue to delete ?`, 
            level: 'warning',
            icon: 'mdi-cart',
            cardOptions: {
                variant: 'elevated',
                nocolor: 'indigo',
                elevation:'16',
            },
            buttons: [
                { title: 'Ok', key: 'ok', /* any v-btn api option */ },
                { title: 'Cancel', key: 'cancel', /* any v-btn api option */ },
            ]
        })
        console.log(answer)
    } 

    const cdtest2 = async () => {

        const answer = await createDialog({ 
            title: "Please Confirm", 
            text: `XX has 5 trips and 6 expenses. Continue to delete ?`,
            level: 'warning',
            icon: 'mdi-emoticon-happy-outline',
        })
        console.log(answer)
    }

    const cdtest3 = async () => {

        const answer = await createDialog({ 
            title: "Edit in the Container", 
            text: `Ist das lustig ?`,
            level: 'error',
            icon: 'mdi-emoticon-happy-outline',
            buttons: [
                { title: 'Ok', key: 'ok', /* any v-btn api option */ },
            ]

        })
        console.log(answer)
        }

</script>