import { useAuthToken } from './useAuthToken';
import { verifyToken } from "~/utils/jwt"

export const useUserInfo = async () => {
    const { getToken } = useAuthToken()
    const token = getToken()
    return await verifyToken(token);
};
