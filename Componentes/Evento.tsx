import React, { useEffect } from "react";
import Header from "./Header";
import { Box, Center, Divider, Heading, HStack, Icon, Image, Link, ScrollView, Text, Toast, VStack } from "native-base";
import Banner from "./Bannerpantalla";
import Footer from "./Footer";
import Menuevento from "./Menuevento";
import Fontisto from "react-native-vector-icons/Fontisto";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { Linking } from "react-native";
import { urlapi } from "./configuracion";
function Evento({ route, navigation }: { route: any, navigation: any }) {

    const { idevento } = route.params;
    const [loading, setLoading] = React.useState(false);
    const [evento, setEvento] = React.useState({
        logo: "",
        nlineaproducto: null,
        nombreempresa: null,
        nlocal: null,
        direccionlocal: null,
        urllocal: "",
        telefonolocal: null,
        adminlocal: null

    });
    useEffect(() => {
        obtenerevento(idevento);

    }, []);

    const llamar = () => {
        +
            Linking.openURL("tel:${evento.telefonolocal}");
    };

    const obtenerevento = async (auxidevento: any) => {
        try {
            const response = await fetch(urlapi + 'evento/obtenereventousuario', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({
                    idevento: auxidevento
                })
            });

            if (!response.ok) {
                throw new Error("Error en la conexión con el servidor.");
            }

            const json = await response.json();

            if (json.error) {
                setLoading(false);
                setTimeout(() => {
                    Toast.show({
                        description: "Error al cargar la información."
                    });
                }, 500);
            } else {
                setLoading(false);
                //Codigo para poner los eventos.
                //setLsteventos(json.data);
                setEvento(json.data);


            }

        } catch (error) {
            console.log(error);
             setTimeout(() => {
                    Toast.show({
                        description: "Error al cargar la información."
                    });
                }, 500);
            setLoading(false);
        }
    };



    return (
        <Box flex={1} bg={"white"}>
            <Header navigation={navigation} />
            <Banner />
            <ScrollView flex={1} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
                <VStack>
                    <HStack w={"100%"} flex={1}>
                        <Box flex={1}>
                            <Center>
                                {evento.logo && (
                                    <Image
                                        size="2xl"
                                        resizeMode="contain"
                                        borderColor="red.700"
                                        source={{
                                            uri: `data:image/jpeg;base64,${evento.logo}`
                                        }}
                                        alt="Sin Logo de marca"
                                    />
                                )}
                                 <Heading size={"xs"} >{evento.nombreempresa}</Heading>
                                <Text>{evento.nlineaproducto}</Text>
                            </Center>
                        </Box>
                    </HStack>
                </VStack>
                <VStack w={"100%"}>
                    <HStack ml={5} pt={1} alignItems="center">
                        <VStack w={"40%"}>
                            <HStack>
                                <Icon as={<Fontisto name="shopping-store" />} size="sm" mr={2} />
                                <Text
                                    fontSize="sm"
                                    color="coolGray.600"
                                    _dark={{ color: "warmGray.200" }}
                                >
                                    Nombre local:
                                </Text>
                            </HStack>
                        </VStack>
                        <VStack w={"40%"} alignContent={"end"}>
                            <HStack>
                                <Text
                                    fontSize="sm"
                                    justifyContent={"flex-end"}
                                    color="coolGray.600"
                                    _dark={{ color: "warmGray.200" }}
                                >
                                    {evento.nlocal}
                                </Text>
                            </HStack>
                        </VStack>
                    </HStack>
                </VStack>
                <Divider my={2} />
                <VStack w={"100%"}>
                    <HStack ml={5} pt={1} alignItems="center">
                        <VStack w={"40%"}>
                            <HStack>
                                <Icon as={<FontAwesome6 name="map-location-dot" />} size="sm" mr={2} />
                                <Text
                                    fontSize="sm"
                                    color="coolGray.600"
                                    _dark={{ color: "warmGray.200" }}
                                >
                                    Dirección:
                                </Text>
                            </HStack>
                        </VStack>
                        <VStack w={"60%"} alignContent={"end"}>
                            <HStack>
                                <Text
                                    fontSize="sm"
                                    justifyContent={"flex-end"}
                                    color="coolGray.600"
                                    _dark={{ color: "warmGray.200" }}
                                >
                                    {evento.direccionlocal}
                                </Text>
                            </HStack>
                        </VStack>
                    </HStack>
                </VStack>
                <Divider my={2} />
                <VStack w={"100%"}>
                    <HStack ml={5} pt={1} alignItems="center">
                        <VStack w={"40%"}>
                            <HStack>
                                <Icon as={<FontAwesome6 name="map-pin" />} size="sm" mr={2} />
                                <Text
                                    fontSize="sm"
                                    color="coolGray.600"
                                    _dark={{ color: "warmGray.200" }}
                                >
                                    Maps Ubicación:
                                </Text>
                            </HStack>
                        </VStack>
                        <VStack w={"60%"} alignContent={"end"}>
                            <HStack>
                                <Text
                                    fontSize="sm"
                                    justifyContent={"flex-end"}
                                    color="coolGray.600"
                                    _dark={{ color: "warmGray.200" }}
                                >
                                    <Link _text={{
                                        color: "indigo.500",
                                        fontWeight: "medium",
                                        fontSize: "sm"
                                    }} href={evento.urllocal}>
                                        Abrir google maps
                                    </Link>
                                </Text>
                            </HStack>
                        </VStack>
                    </HStack>
                </VStack>
                <Divider my={2} />
                <VStack w={"100%"}>
                    <HStack ml={5} pt={1} alignItems="center">
                        <VStack w={"40%"}>
                            <HStack>
                                <Icon as={<FontAwesome6 name="person" />} size="sm" mr={2} />
                                <Text
                                    fontSize="sm"
                                    color="coolGray.600"
                                    _dark={{ color: "warmGray.200" }}
                                >
                                    Administrador:
                                </Text>
                            </HStack>
                        </VStack>
                        <VStack w={"60%"} alignContent={"end"}>
                            <HStack>
                                <Text
                                    fontSize="sm"
                                    color="coolGray.600"
                                    _dark={{ color: "warmGray.200" }}
                                >
                                    {evento.adminlocal}
                                </Text>
                            </HStack>
                        </VStack>
                    </HStack>
                </VStack>
                <Divider my={2} />
                <VStack w={"100%"}>
                    <HStack ml={5} pt={1} alignItems="center">
                        <VStack w={"40%"}>
                            <HStack>
                                <Icon as={<FontAwesome6 name="phone" />} size="sm" mr={2} />
                                <Text
                                    fontSize="sm"
                                    color="coolGray.600"
                                    _dark={{ color: "warmGray.200" }}
                                >
                                    Teléfono:
                                </Text>
                            </HStack>
                        </VStack>
                        <VStack w={"60%"} alignContent={"end"}>
                            <HStack>
                                <Text
                                    fontSize="sm"
                                    justifyContent={"flex-end"}
                                    color="coolGray.600"
                                    _dark={{ color: "warmGray.200" }}
                                >
                                    <Link _text={{
                                        color: "indigo.500",
                                        fontWeight: "medium",
                                        fontSize: "sm"
                                    }} onPress={llamar}>
                                        {evento.telefonolocal}
                                    </Link>
                                </Text>
                            </HStack>
                        </VStack>
                    </HStack>
                </VStack>
                <Divider my={2} />
            </ScrollView>
            <Menuevento navigation={navigation} auxid={1} auxidevento={idevento}/>
            <Footer />
        </Box>
    )
}

export default Evento;