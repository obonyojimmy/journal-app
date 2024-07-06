
import React, { useEffect } from 'react';
import { Text, View, TextInput, Alert, Pressable } from 'react-native';
import { useSession } from '../../../ctx';

export default function Logout() {
    const { signOut } = useSession();

    useEffect(() => {
        signOut()
    })

    return (
        <View className="px-4 md:px-6 flex flex-col items-center justify-center">
            <Text>logging out...</Text>
        </View>
    );
}
