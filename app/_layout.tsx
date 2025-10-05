import { Slot } from 'expo-router' ;
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { PaperProvider } from 'react-native-paper';

export default function Layout(){
   return <PaperProvider>
    <Slot />
    </PaperProvider> 
}
