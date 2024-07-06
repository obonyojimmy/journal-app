import { formatRelative } from 'date-fns'
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const encodeFormData = (paramDict) => {
  const formData = new FormData()
  Object.entries(paramDict).forEach(([k, v]) => {
    formData.append(k, v)
  })
  /* for (const pair of formData.entries()) {
    console.log(pair[0], pair[1])
  } */
  return formData
}

export const timeAgo = (date?: string) => {
  if (!date) {
    return ''
  }
  const ago = formatRelative(date, new Date())
  return ago
}

export async function getStorageItem(key: string) {
  if (Platform.OS === 'web') {
    const value = localStorage.getItem(key)
    return value
  } else {
    const value = await SecureStore.getItemAsync(key)
    return value
  }
}

export async function saveStorageItem(key: string, value:string) {
  if (Platform.OS === 'web') {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  } else {
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
}