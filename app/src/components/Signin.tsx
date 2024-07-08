import React, { useState } from 'react';
import { router } from 'expo-router';
import { Text, View, TextInput, Alert, Pressable } from 'react-native';
import { Button } from 'react-native-paper';
import { useSession } from '../ctx';

export default function Signin() {
    const { signIn } = useSession();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            console.log('email')
            await signIn(email, password)
            router.replace('/');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };
    

    return (

        <View className="gap-4 w-full">
            <TextInput
                className="flex border p-2 m-2 w-full rounded-md"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                className="flex border p-2 m-2 w-full rounded-md"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button mode="contained" onPress={handleLogin}>Login</Button>

            
        </View>

    );
}
