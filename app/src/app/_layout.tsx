import "../global.css";
import { PaperProvider } from 'react-native-paper';
import { Slot } from 'expo-router';
import { SessionProvider } from '../ctx';

export default function Root() {
  // Set up the auth context and render our layout inside of it.
  return (
    <PaperProvider>
      <SessionProvider>
        <Slot />
      </SessionProvider>
    </PaperProvider>

  );
}