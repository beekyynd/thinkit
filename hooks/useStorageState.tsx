import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const storage = {
    get: async (key: string): Promise<string | null> => {
       try {
           return await SecureStore.getItemAsync(key); 
       } catch (error) {
           console.error(`Error getting item from storage:`, error);
           return null;
       }
},
set: async (key: string, value: string | null): Promise<void> => {
    try {
        if (Platform.OS === 'web') {
            value === null
                ? localStorage.removeItem(key)
                : localStorage.setItem(key, value);
        } else {
            value === null
                ? await SecureStore.deleteItemAsync(key)
                : await SecureStore.setItemAsync(key, value);
        }
    } catch (error) {
        console.error(`Error setting item in storage:`, error);
    }
}
};

type StorageState = [[boolean, string | null], (value: string | null) => void];
export const useStorageState = (key: string, initialValue: string | null = null): StorageState => {
    const [isLoading, setIsLoading] = useState(true);
    const [value, setValue] = useState<string | null>(initialValue);

    useEffect(() => {
        storage.get(key).then(value => {
            setValue(value);
            setIsLoading(false);
        });
}, [key]);

const updateValue = useCallback((newValue: string | null) => {
    setValue(newValue);
    storage.set(key, newValue);
}, [key]);

return [[isLoading, value], updateValue];

}