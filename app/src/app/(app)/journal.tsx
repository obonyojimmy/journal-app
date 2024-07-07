import React, { useState, useEffect } from 'react';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Appbar, Avatar, List, FAB, Searchbar, Chip, Portal, IconButton, Text, Button, Menu } from 'react-native-paper';
import { View, TextInput, Alert, Pressable, StyleSheet } from 'react-native';
//import MultiSelect from 'react-native-multiple-select';
import { getJournal } from '../../api'
import { useJournal } from '../../hooks/useJournals';

export interface JournalSearchParams {
    id: string;
    title: string;
    date?: string;
    category?: string;
}

export default function JournalScreen() {
    const params = useLocalSearchParams();
    console.log(params)
    const { updateJournal, deleteJournal } = useJournal()
    //const {id, title, date, category} = params
    const [actionsVisible, setActionsVisible] = useState(false);
    const [title, setTitle] = useState(params?.title);
    const [category, setCategory] = useState(params?.category);
    const [content, setContent] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [textHeight, setTextHeight] = useState(35);
    const date = params.date //'2 hours ago'

    useEffect(() => {
        if (params?.id) {
            getJournal(params.id)
                .then(d => {
                    console.log(d)
                    setContent(d.content)
                })
                .catch(() => {

                })
        }

    }, [params?.id])

    const handleSaveChanges = async () => {
        await updateJournal(params.id, content)
        setEditMode(false)
    };

    const handleDelete = async () => {
        await deleteJournal(params.id)
        router.replace('/');
    }


    return (
        <View className="flex flex-1">
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <View style={styles.right}>
                            <Text variant='headlineSmall'>{params.title}</Text>
                            <View className='flex-auto flex-row space-x-2 items-center'>
                                <Text variant='labelSmall'>{date}</Text>
                                <Chip onPress={() => console.log('Pressed')} className='p-2' textStyle={styles.chipText}>{category}</Chip>
                            </View>

                        </View>
                    ),
                    //headerRight: () => <FontAwesome  name="ellipsis-v"   onPress={()=> {}} />
                    headerRight: () => (
                        <Menu
                            visible={actionsVisible}
                            onDismiss={() => { setActionsVisible(false) }}
                            anchor={<Appbar.Action icon="chevron-down" onPress={() => { setActionsVisible(true) }} />}
                            anchorPosition='top'
                        >
                            <Menu.Item onPress={() => setEditMode(true)} title="Edit" />
                            <Menu.Item onPress={() => { handleDelete() }} title="Delete" />
                        </Menu>
                    )

                }}
            />

            <View className="p-2">
                {
                    editMode ?
                        <TextInput
                            className="flex border p-2  m-2 w-full h-full rounded"
                            style={{
                                flex: 1,
                                //alignSelf: "flex-end",
                                height: textHeight,
                                maxHeight: 200
                            }}
                            placeholder="content"
                            value={content}
                            onChangeText={(e) => {
                                setContent(e);
                                setTextHeight(35 + (e.split('\n').length - 1) * 20);
                            }}
                            //onChangeText={setContent}
                            multiline
                        /> : <Text>{content}</Text>
                }
                <View className="pt-4">
                    {
                        editMode &&
                        <View className="pt-4">
                            <Button onPress={handleSaveChanges}>Save changes</Button>
                            <Button onPress={()=> setEditMode(false)}>Cancel</Button>
                        </View>
                    }
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
    chipText: {
        lineHeight: 10,
        marginHorizontal: 2
    }
});
