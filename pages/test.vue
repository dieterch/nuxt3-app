<template>
    <d-appbar />
    <v-container
        class="ma-6"
        fluid
        style="flex-grow: 0;"
    >
        <v-row
            align="start"
            justify="start"
        >
            <v-col cols="auto">
                    <v-btn 
                        @click="cdtest1">
                        Dialog 1
                    </v-btn>
            </v-col>
            <v-col cols="auto">
                    <v-btn @click="cdtest2">
                        Dialog 2
                    </v-btn>
            </v-col>
            <v-col cols="auto">
                    <v-btn @click="cdtest3">
                        Dialog 3
                    </v-btn>
            </v-col>
            <v-col cols="auto">
                    <v-btn @click="capfetch">
                        Fetch through capacitor Test
                    </v-btn>
            </v-col>
            <v-col cols="auto">
                    <v-btn @click="capfetchexpenses">
                        Fetch expenses through capacitor
                    </v-btn>
            </v-col>
        </v-row>
        <pre>{{ test }}</pre>
    </v-container>
</template>

<script setup>
    import { createDialog, warnDialog, confirmDialog } from 'vuetify3-dialog'
    import { createNotification, notifySuccess } from 'vuetify3-dialog'
    import { createBottomSheet } from 'vuetify3-dialog'
    import { CapacitorHttp } from '@capacitor/core'
    const { $ifetch } = useNuxtApp()

    const test = ref({ test: "nothing" })

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

    const capfetch = async () => {
        const response = await CapacitorHttp.get({
            url: 'http://192.168.15.175:3600/hello'
        })
        //const response = await $ifetch.get('http://192.168.15.175:3600/hello')
        console.log('capfetch called',response.data)
    }

    const capfetchexpenses = async () => {
        // const response = await CapacitorHttp.get({
        //     url: 'http://192.168.15.175:5678/api/expenses'
        // })
        const response = await $ifetch.get('/api/expenses')
        test.value = response.data
        console.log('capfetchexpenses called', response.data)
    }
</script>