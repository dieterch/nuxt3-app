import { useAuthToken } from './useAuthToken';
import { verifyToken } from "~/utils/jwt"

const role = ref<string | null>(null);

export const useUserRole = async () => {
    const { getToken } = useAuthToken()
    const token = getToken()
    const payload = await verifyToken(token);
    if (payload) {
        role.value = <string>payload.role;
    }
    return role;
};
