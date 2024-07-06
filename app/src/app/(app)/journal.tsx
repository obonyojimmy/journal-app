import React, { useState } from 'react';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Appbar, Avatar, List, FAB, Searchbar, Chip, Portal, Modal, Text, Button } from 'react-native-paper';
import {  View, TextInput, Alert, Pressable, StyleSheet } from 'react-native';
//import MultiSelect from 'react-native-multiple-select';

export default function JournalScreen() {
    const params = useLocalSearchParams();
    console.log(params)
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const date = '2 hours ago'
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
                    headerTitle: () => (
                        <View style={styles.right}>
                            <Text variant='headlineSmall'>{params.title}</Text>
                            <Text variant='labelSmall'>{date}</Text>
                        </View>
                    ),
                    headerRight: () => <View style={styles.chipContainer}><Chip onPress={() => console.log('Pressed')}>Info</Chip></View>

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


                    <Button
                        onPress={handleSave}
                    >
                        Save
                    </Button>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    right: {
        flexDirection: 'column',
        //alignItems: 'flex-end',
    },
    chipContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 1
    },
});
