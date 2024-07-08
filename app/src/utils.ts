import { formatRelative } from 'date-fns'
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { formatISO, startOfToday, endOfToday, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';


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

export const searchParams = (paramDict) => {
  const params = new URLSearchParams()
  Object.entries(paramDict).forEach(([k, v]) => {
    params.append(k, v)
  })
  return params.toString()
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

export const getDateFromLabel = (label) => {
  let start_date;
  let end_date;
  
  switch (label) {
    case 'today':
      start_date = startOfToday();
      end_date = endOfToday();
      break;
    case 'week':
      start_date = startOfWeek(new Date());
      end_date = endOfWeek(new Date());
      break;
    case 'month':
      start_date = startOfMonth(new Date());
      end_date = endOfMonth(new Date());
      break;
    case 'year':
      start_date = startOfYear(new Date());
      end_date = endOfYear(new Date());
      break;
    default:
      start_date = startOfToday();
      end_date = endOfToday();
  }

  return {
    from_date: formatISO(start_date),
    to_date: formatISO(end_date),
  };
};
