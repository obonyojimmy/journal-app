
import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text, View, Alert, Pressable } from 'react-native';
import { TextInput, Button , Appbar} from 'react-native-paper';
import { GetUser, UpdateUser } from '../../../api'

export default function Settings() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState(null);
    const [password, setPassword] = useState(null);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {

        GetUser()
            .then(d => {
                console.log(d)
                setEmail(d?.email)
                setName(d?.profile.name)
                setAge(d?.profile.age)
            })
            .catch(() => {

            })


    }, [])

    const handleSaveChanges = async () => {
        const user = await UpdateUser(name, age, password)
        setEditMode(false)
    };


    return (
        <View>
            <Stack.Screen
                options={{
                    headerRight: () => <FontAwesome className='px-2'  name="edit" size={20}   onPress={()=> setEditMode(true)} />
                    /* headerRight: () => (
                        <Appbar.Action icon="edit" onPress={() => { setEditMode(true) }} />
                    ) */

                }}
            />
            <View className="px-4 py-2">
            <View className="gap-4 w-full">
                <TextInput
                    //className="flex border p-2 m-2 w-full rounded"
                    label="Names"
                    //placeholder="Names"
                    value={name}
                    onChangeText={setName}
                    disabled={!editMode}
                />
                <TextInput
                    //className="flex border p-2 m-2 w-full rounded"
                    label="Email"
                    //placeholder="Email"
                    value={email}
                    //onChangeText={setEmail}
                    disabled

                />
                <TextInput
                    //className="flex border p-2 m-2 w-full rounded"
                    label="Password"
                    //placeholder="Password"
                    //value={editMode ? password : '****'}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    disabled={!editMode}
                />
                <TextInput
                    //className="flex border p-2 m-2 w-full rounded"
                    label="Age"
                    //placeholder="Age"
                    value={age}
                    onChangeText={setAge}
                    disabled={!editMode}

                />
                <View className="pt-4">
                    {
                        editMode &&
                        <View className="pt-4">
                            <Button onPress={handleSaveChanges}>Save changes</Button>
                            <Button onPress={() => setEditMode(false)}>Cancel</Button>
                        </View>
                    }
                </View>
            </View>
        </View>
        </View>
        
    );
}
