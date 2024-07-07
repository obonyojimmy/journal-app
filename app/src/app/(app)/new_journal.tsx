import React, { useState } from 'react';
import { router, Stack } from 'expo-router';
import { Text, View, TextInput, Alert, Pressable } from 'react-native';
//import MultiSelect from 'react-native-multiple-select';
import { createJournal } from '../../api'
import { useJournal } from '../../hooks/useJournals';

export default function NewJournal() {
    const { addJournal } = useJournal()
    const [textHeight,setTextHeight] = useState(35);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');

    const handleSave = async () => {
        addJournal(title, content, category)
            .then(d => {
                console.log(d)
                router.replace('/');
            })
            .catch(() => {

            })
    };


    return (
        <View className="flex flex-1">
            <Stack.Screen
                options={{
                    title: 'Create Journal',

                }}
            />
            <View className="px-4 gap-4 text-center">
                <View className="gap-4 w-full">
                    <TextInput
                        className="flex border p-2 m-2 w-full rounded"
                        placeholder="title"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput
                        className="flex border p-2  m-2 w-full rounded"
                        style={{
                            flex: 1,
                            //alignSelf: "flex-end",
                            height:textHeight,
                            maxHeight:200
                        }}
                        placeholder="content"
                        value={content}
                        onChangeText={(e)=>{
                            setContent(e);
                            setTextHeight(35 + (e.split('\n').length-1) * 20);
                         }}
                        //onChangeText={setContent}
                        multiline
                    />

                    <TextInput
                        className="flex border p-2 m-2 w-full rounded"
                        placeholder="category"
                        value={category}
                        onChangeText={setCategory}
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
