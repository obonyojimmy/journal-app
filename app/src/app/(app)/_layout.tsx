import { Redirect, Stack } from 'expo-router';
import { Text, View } from "react-native";
import { useSession } from '../../ctx'
import { JournalProvider } from '../../hooks/useJournals';

export default function AppLayout() {
    const { session, isLoading } = useSession();

    //console.log('AppLayout.session', session)
    // You can keep the splash screen open, or render a loading screen like we do here.
    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    // Only require authentication within the (app) group's layout as users
    // need to be able to access the (auth) group and sign in again.
    if (!session || session === undefined) {
        console.log('AppLayout', '!session')
        // On web, static rendering will stop here as the user is not authenticated
        // in the headless Node process that the pages are rendered in.
        return <Redirect href="/login" />;
    }

    // This layout can be deferred because it's not the root layout.
    //return <Stack />;
    return (
        <JournalProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </JournalProvider>
    )
}
