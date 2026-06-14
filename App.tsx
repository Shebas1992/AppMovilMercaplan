/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import Navegacion from './Componentes/Navegacion';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Orientation from 'react-native-orientation-locker';
import { NativeBaseProvider } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App({navigation}:{navigation:any}): React.JSX.Element | null{
  const [logueado, setLogueado] = useState<boolean | null>(false);

  useEffect(() => {
    Orientation.lockToPortrait();
    verificarLogin();

    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  const verificarLogin = async () => {
    const token = await AsyncStorage.getItem("session");

    if (token) {
      setLogueado(true);
    } else {
      setLogueado(false);
    }
  };

  if (logueado === null) {
    return null; // pantalla de carga opcional
  }

  return (
    <NativeBaseProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Navegacion logueado={logueado} />
      </GestureHandlerRootView>
    </NativeBaseProvider>
  );
}

export default App;
