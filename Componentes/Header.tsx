import React, { useEffect } from "react";
import { VStack, HStack, Button, IconButton, Icon, Text, NativeBaseProvider, Center, Box, StatusBar, Image, Menu, Pressable, HamburgerIcon } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Header({ navigation }: {navigation: any }) {
    const [usuario, setUsuario] = React.useState({
        nombres: null,
        apellidos: null,
        token: null,
        ci: null,
        idusuario: null
    });
    useEffect(() => {
        verificarLogin();
    }, []);

    const logout = async () => {
        await AsyncStorage.removeItem("session");
        navigation.reset({
            index: 0,
            routes: [{ name: "Logout" }],
        });
    }

    const inicio = async () => {
        navigation.reset({
            index: 0,
            routes: [{ name: "Principal" }],
        });
    }

    const verificarLogin = async () => {
        const session = await AsyncStorage.getItem("session");
        if (session) {
            const datos = JSON.parse(session);
            setUsuario(datos);
        }
    };
    return (
        <Box>
            <StatusBar backgroundColor="#797979" barStyle="light-content" />
            <Box safeAreaTop bg="gray.600" />
            <HStack bg="gray.600" px="1" py="3" justifyContent="space-between" alignItems="center" w="100%" maxW="100%">
                <HStack alignItems="center">
                    <Image
                        w="20"
                        h="10"
                        source={require('../Images/iconomercatracker.png')}
                        alt="Logo Mercaplan"
                        resizeMode="contain"
                    />
                    <Text color="white" fontSize="20" fontWeight="bold" onPress={() => inicio()}>
                        Mercaplan
                    </Text>
                </HStack>
                <HStack alignItems={"center"}>
                    <IconButton icon={<Icon as={FontAwesome} name="user-o" size="sm" color="green.600" />} />

                    <Menu marginRight={"3"} w="190" trigger={triggerProps => {
                        return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                            <HStack >
                                <Text fontSize="xs" color={"white"} marginRight={"2"}>{usuario.apellidos}</Text>
                                <HamburgerIcon />
                            </HStack>

                        </Pressable>;
                    }}>
                        <Menu.Item>Acerca de</Menu.Item>
                        <Menu.Item onPress={() => logout()}>Salir</Menu.Item>

                    </Menu>
                </HStack>
            </HStack>
        </Box>
    );
}

export default Header;