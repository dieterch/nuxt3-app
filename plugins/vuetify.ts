// plugins/vuetify.ts
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VDateInput } from 'vuetify/labs/components'
import {Vuetify3Dialog} from 'vuetify3-dialog'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components: {
      components,
      VDateInput
    },
    directives,
  })

  nuxtApp.vueApp.use(vuetify)  
  nuxtApp.vueApp.use(Vuetify3Dialog)

})
