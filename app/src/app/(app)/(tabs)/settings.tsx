
import React, { useState } from 'react';
import { Text, View, TextInput, Alert, Pressable } from 'react-native';

export default function Settings() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSave = async () => {
        try {
            console.log('email')
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };


    return (
        <View className="px-4 md:px-6 flex flex-col items-center ">
            <View className="gap-4 w-full">
                <TextInput
                    className="flex border p-2 m-2 w-full rounded"
                    placeholder="Names"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    className="flex border p-2 m-2 w-full rounded"
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    
                />
                <TextInput
                    className="flex border p-2 m-2 w-full rounded"
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    
                />


                <Pressable
                    className="flex h-9 items-center justify-center overflow-hidden rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 web:shadow ios:shadow transition-colors hover:bg-gray-900/90 active:bg-gray-400/90 web:focus-visible:outline-none web:focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                    onPress={handleSave}
                >
                    <Text className='text-sm font-medium text-gray-50'>Update settings</Text>
                </Pressable>
            </View>
        </View>
    );
}
