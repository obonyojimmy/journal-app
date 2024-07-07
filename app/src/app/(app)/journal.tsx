import React, { useState, useEffect } from 'react';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Appbar, Avatar, List, FAB, Searchbar, Chip, Portal, IconButton, Text, Button, Menu } from 'react-native-paper';
import { View, TextInput, Alert, Pressable, StyleSheet } from 'react-native';
//import MultiSelect from 'react-native-multiple-select';
import { getJournal } from '../../api'

export interface JournalSearchParams {
    id: string;
    title: string;
    date?: string;
    category?: string;
}

export default function JournalScreen() {
    const params = useLocalSearchParams();
    console.log(params)
    //const {id, title, date, category} = params
    const [actionsVisible, setActionsVisible] = useState(false);
    const [title, setTitle] = useState(params?.title);
    const [category, setCategory] = useState(params?.category);
    const [content, setContent] = useState('');
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
                            <Menu.Item onPress={() => { }} title="Edit" />
                            <Menu.Item onPress={() => { }} title="Delete" />
                        </Menu>
                    )

                }}
            />

            <View className="p-2">
                <Text>
                    {content}
                </Text>
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
