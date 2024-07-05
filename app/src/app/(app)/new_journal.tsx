import React, { useState } from 'react';
import { router, Stack } from 'expo-router';
import { Text, View, TextInput, Alert, Pressable } from 'react-native';
//import MultiSelect from 'react-native-multiple-select';

export default function CreateJournal() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSave = async () => {
        try {
            console.log('email')
            //await signInWithEmailAndPassword(auth, email, password);
            router.replace('/');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };


    return (
        <View className="flex flex-1">
            <Stack.Screen
                options={{
                    title: 'Create Journal',

                }}
            />
            <View className="px-4 md:px-6 flex flex-col items-center gap-4 text-center">
                <View className="gap-4 w-full">
                    <TextInput
                        className="flex border p-2 m-2 w-full rounded"
                        placeholder="title"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput
                        className="flex border p-2 m-2 w-full rounded"
                        placeholder="content"
                        value={content}
                        onChangeText={setContent}
                        multiline
                    />


                    <Pressable
                        className="flex h-9 items-center justify-center overflow-hidden rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 web:shadow ios:shadow transition-colors hover:bg-gray-900/90 active:bg-gray-400/90 web:focus-visible:outline-none web:focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                        onPress={handleSave}
                    >
                        <Text className='text-sm font-medium text-gray-50'>Save</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
