import React, { useState } from 'react';
import { router, Link } from 'expo-router';
import { Text, View, TextInput, Alert, Pressable } from 'react-native';
import { Button, Snackbar } from 'react-native-paper';
import Logo from "../components/logo";
import { useSession } from '../ctx';
import { CallRegister } from '../api';

export default function Register() {
    const { signIn } = useSession();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState(false);
    const [error, setError] = useState('');

    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => setVisible(false);

    const handleSignup = async () => {
        try {
            console.log('email')
            const user = await CallRegister(email, password, name)
            await signIn(email, password)
            router.replace('/');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View className="flex flex-1">
            <View className="flex-1">
                <View className="py-12 md:py-24 lg:py-32 xl:py-48">
                    <View className="px-4 md:px-6">

                        <View className="flex flex-col items-center gap-4 text-center">
                            <Logo />
                            <Text
                                role="heading"
                                className="text-3xl text-center native:text-5xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl"
                            >
                                My Journal
                            </Text>
                            <Text className="mx-auto max-w-[700px] text-lg text-center text-gray-500 md:text-xl dark:text-gray-400">
                                All your journals in one place and much more
                            </Text>
                            <View className="gap-4 w-full">
                                <TextInput
                                    className="flex border p-2 m-2 w-full rounded-md"
                                    placeholder="Name"
                                    value={name}
                                    onChangeText={setName}
                                />
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

                                <Button mode="contained" onPress={handleSignup}>REGISTER</Button>
                                <Snackbar
                                    visible={visible}
                                    onDismiss={onDismissSnackBar}
                                    icon="close"
                                >
                                    {error}
                                </Snackbar>
                            </View>
                            <View
                                className="flex items-center pt-5 mt-6 border-t border-slate-200"
                            >
                                <Text style={{ color: 'rgb(123,121,121)', textAlign: 'center' }}>
                                    Have an account?{' '}
                                    <Link
                                        suppressHighlighting
                                        className="ml-2 text-sky-400"
                                        //className="flex h-9 mt-2 items-center justify-center overflow-hidden rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 web:shadow ios:shadow transition-colors hover:bg-gray-900/90 active:bg-gray-400/90 web:focus-visible:outline-none web:focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                                        href="/login"
                                    >
                                        Login
                                    </Link>

                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

        </View>
    );
}
