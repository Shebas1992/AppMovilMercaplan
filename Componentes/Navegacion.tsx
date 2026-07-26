import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./Login";
import Menu from "./Menu";
import Evento from "./Evento";
import Asistencia from "./Asistencia";
import Fotografia from "./Fotografias";
import Productos from "./Productos";
import PantallaFirmar from "./Pantallafirmar";
import Reportes from "./Reportes";
import Promocionales from "./Promocionalesevento";

const Stack = createNativeStackNavigator();

function Navegacion({ logueado }: { logueado: any }) {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{
                headerShown: false
            }}>
                {logueado ? (
                    <Stack.Screen name="Menu" component={Menu} />
                ) : (
                    <Stack.Screen name="Login" component={Login} />
                )}
                {/*<Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Menu" component={Menu} />*/}
                <Stack.Screen name="Principal" component={Menu} />
                <Stack.Screen name="Logout" component={Login} />
                <Stack.Screen name="Menuevento" component={Evento} />
                <Stack.Screen name="Asistenciaevento" component={Asistencia} />
                <Stack.Screen name="Fotografiasevento" component={Fotografia} />
                <Stack.Screen name="Productosevento" component={Productos} />
                <Stack.Screen name="Reportes" component={Reportes} />
                <Stack.Screen name="Promocionalesevento" component={Promocionales} />
                <Stack.Screen
                    name="PantallaFirmar"
                    component={PantallaFirmar}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navegacion;