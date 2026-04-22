import Netinfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

export const useNetworkStatus = async () => {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);

    useEffect(() => {
        const unsubscribe = Netinfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        return () => unsubscribe();
    }, []);

    return isConnected;
}