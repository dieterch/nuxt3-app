// composables/useUserInfo.ts
import { useNuxtApp } from '#app'
import { useAuthToken } from './useAuthToken';
import { compareSync }from 'bcryptjs' // for frontend
import { type JWTPayload } from 'jose'
import { ref } from 'vue'

export const useUserInfo = () => {
    const { $jwtHelper } = useNuxtApp()
    const { getToken } = useAuthToken()
    const userInfo = ref<JWTPayload | null>(null)
    const config = useRuntimeConfig()

    const fetchUserInfo = async () => {
        if (!compareSync(
            'useNoAuthSystem'
            ,config.public.DO_NOT_USE_AUTH)
        ) {
            try {
                const token = getToken()
                // console.log('in useUserInfo token:', token)
                if (token) {
                    const payload = await $jwtHelper.verifyToken(token)
                    //console.log('in useUserInfo payload:', payload)
                    userInfo.value = payload
                } else {
                    console.warn("No token found")
                }
            } catch (error) {
                console.error("Error verifying token:", error)
            }
        } else {
            userInfo.value = {
                name: 'NA',
                role: 'admin'
            }
            console.log('in useUserInfo, unas:', 
                compareSync( 'useNoAuthSystem',
                config.public.DO_NOT_USE_AUTH))
        }
    }

    const loggedIn = () => {
        return (userInfo?.value)
    }

    const uRole = ( roles:[] ) => {
        if (userInfo?.value) {
        // @ts-ignore
        //console.log('luserInfo.role:', userInfo.value.role, 'role:', roles, ' == ', (roles.find(( e ) => ( e == userInfo.value.role )) == userInfo.value.role) )
          // @ts-ignore
          return (roles.find(( e ) => ( e == userInfo.value.role )) == userInfo.value.role)
        } else return false
      }

    return {
      userInfo,
      loggedIn,
      uRole,
      fetchUserInfo // Ensure this is returned here
    }
}
