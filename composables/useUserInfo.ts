// composables/useUserInfo.ts
import { useNuxtApp } from '#app'
import { useAuthToken } from './useAuthToken';
import { type JWTPayload } from 'jose'
import { ref } from 'vue'

export const useUserInfo = () => {
    const { $jwtHelper } = useNuxtApp()
    const { getToken } = useAuthToken()
    const userInfo = ref<JWTPayload | null>(null)

    const fetchUserInfo = async () => {
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
    }

    return {
      userInfo,
      fetchUserInfo // Ensure this is returned here
    }
}
