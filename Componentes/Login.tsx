import * as React from "react";
import { Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center, NativeBaseProvider, Image, ScrollView, Icon, Spinner, Toast } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { RefreshControl } from "react-native-gesture-handler";
import { Pressable } from "react-native";
import { urlapi } from "./configuracion";
import AsyncStorage from "@react-native-async-storage/async-storage";


function Login({ navigation }: { navigation: any }) {

    //Declaracion de variables.
    const [refreshing, setRefreshing] = React.useState(false);
    const [cedula, setCedula] = React.useState('');
    const [contrasenia, setContrasenia] = React.useState('');
    const [show, setShow] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [ingresando, setIngresando] = React.useState(false);

    //Declaracion de funciones.
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        });
    }, []);
    //----------Funcion para realizar el ingreso ----------------
    const ingresar = async () => {
        try {
            setIngresando(true);
            
            const response = await fetch(urlapi + 'usuario/loginusuario', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tipoapp: 'mpmov',
                    ci: cedula,
                    contrasenia: contrasenia
                }),
            });
            console.log(response);
            setIngresando(false);
            if (!response.ok) {
                setTimeout(() => {
                    Toast.show({
                        description: "Error al conectar la red."
                    });
                }, 500);
                throw new Error("Error en la conexión con el servidor.");
                
            }

            const json = await response.json();
            console.log(json);

            if (json.data == false) {
                setLoading(false);
                setTimeout(() => {
                    Toast.show({
                        description: "Usuario incorrecto."
                    });
                }, 500);
            } else {
                setLoading(false);

                // guardar sesión
                await AsyncStorage.setItem('session', JSON.stringify((json.data)));
                
                navigation.navigate("Principal");
            }

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };
    return (
        <Center flex={1} px={"1"} bgColor={"white"}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} >
                <Center flex={1}>
                    <Box safeArea p="2" py="4" w="90%" maxW="85%">
                        
                        <Image source={require('../Images/logomercaplan.jpeg')} alt="Logo Mercaplan" resizeMode="contain" />
                        
                        <Heading textAlign={"center"} _dark={{
                            color: "warmGray.200"
                        }} color="coolGray.600" fontWeight="medium" size="xs">
                            Ingrese sus credenciales
                        </Heading>

                        <VStack space={3} mt="5">
                            <FormControl>
                                <Input placeholder="Ingrese su n° de cédula" InputLeftElement={<Icon as={<AntDesign name="idcard" />} size={5} ml="2" color="muted.400" />}
                                    keyboardType="phone-pad"
                                    size={5} color="muted.400" onChangeText={e => setCedula(e)} />
                            </FormControl>
                            <FormControl>
                                <Input InputLeftElement={<Icon as={<MaterialIcons name="password" />} size={5} ml="2" color="muted.400" />} w={{
                                    base: "100%",
                                    md: "25%"
                                }} type={show ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShow(!show)}>
                                    <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
                                </Pressable>} placeholder="Password" onChangeText={e => setContrasenia(e)} />
                            </FormControl>
                            {ingresando ? <HStack space={2} justifyContent="center">
                                <Spinner accessibilityLabel="Loading posts" />
                                <Heading color="primary.500" fontSize="md">
                                    Cargando
                                </Heading>
                                
                            </HStack> : <Button mt="2" colorScheme={"coolGray"} leftIcon={<Icon as={<MaterialIcons name="login" />} size="sm" />} onPress={() => ingresar()}>
                                Ingresar
                            </Button>}
                           <Heading textAlign={"center"} _dark={{
                            color: "warmGray.200"
                        }} color="coolGray.400" fontWeight="medium" size="xs">
                            Plataforma de Trade Marketing
                        </Heading>
                        </VStack>
                    </Box>
                </Center>
            </ScrollView>
        </Center>
    )
}

export default Login;
//export default Login;