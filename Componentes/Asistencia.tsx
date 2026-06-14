import { Box, Button, Center, FormControl, Heading, HStack, Icon, Input, Modal, ScrollView, Select, Spinner, Text, Toast, VStack } from "native-base";
import React from "react";
import Header from "./Header";
import Banner from "./Bannerpantalla";
import Menuevento from "./Menuevento";
import Footer from "./Footer";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from "@react-native-async-storage/async-storage";
import SignatureScreen from "react-native-signature-canvas";
import { urlapi } from "./configuracion";


function Asistencia({ route, navigation }: { route: any, navigation: any }) {

    const [hora, setHora] = React.useState("");
    const refFirma = React.useRef<any>();
    const [modalVisible, setModalVisible] = React.useState(false);
    const [firmaKey, setFirmaKey] = React.useState(0);
    const [mostrarFirma, setMostrarFirma] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [datos, setDatos] = React.useState({
        idtb_evento: null,
        idtb_usuario: null,
        idtb_tipo_asistencia: "",
        fechahora: null,
        ubicacion: "",
        nombreresponsable: "",
        firmaresponsable: ""
    });
    const [usuario, setUsuario] = React.useState({
        nombres: null,
        apellidos: null,
        token: null,
        ci: null,
        idusuario: null
    });
    const { idevento } = route.params;


    React.useEffect(() => {

        verificarLogin();

        if (route.params?.firma) {

            console.log("PARAMS RECIBIDOS:", route.params);

            const firma = route.params.firma;
            const nombre = route.params.nombreresponsable;

            setDatos(prev => ({
                ...prev,
                firmaresponsable: firma,
                nombreresponsable: nombre
            }));

            // limpiar params para evitar ejecuciones futuras
            navigation.setParams({
                firma: undefined,
                nombreresponsable: undefined
            });

        }

        const intervalo = setInterval(() => {

            const ahora = new Date();

            const horaFormateada =
                ahora.getHours().toString().padStart(2, "0") +
                ":" +
                ahora.getMinutes().toString().padStart(2, "0") +
                ":" +
                ahora.getSeconds().toString().padStart(2, "0");

            setHora(horaFormateada);

        }, 1000);

        return () => clearInterval(intervalo);

    }, [route.params?.firma]);

    //Obtener los datos del usuario logueado.
    const verificarLogin = async () => {
        const session = await AsyncStorage.getItem("session");
        if (session) {
            const aux = JSON.parse(session);
            setUsuario(aux);
            setDatos({ ...datos, idtb_usuario: aux.idusuario, idtb_evento: idevento });
        }

    };
    const obtenerubicacion = () => {
        Geolocation.getCurrentPosition((ubicacion) => {
            setDatos({ ...datos, ubicacion: ubicacion["coords"]["latitude"] + "/" + ubicacion["coords"]["longitude"] });
            //setDatos()guardarubicacion(auxidvisita, ubicacion["coords"]["latitude"], ubicacion["coords"]["longitude"]);
        })
    }

    const guardarasistencia = async () => {
        try {
            if (datos.idtb_tipo_asistencia != "4") {
                datos.firmaresponsable = "";
                datos.nombreresponsable = "";
            }
            obtenerubicacion();
            const response = await fetch(urlapi + 'usuario/registrarasistenciausuario', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }, body: JSON.stringify(datos)
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
                //Codigo para poner los eventos.
                //setLsteventos(json.data);
                if (json.data.isregis) {
                    setTimeout(() => {
                        Toast.show({
                            description: json.data.mess,
                            bg: "green.500"
                        });
                    }, 500);
                } else {
                    setTimeout(() => {
                        Toast.show({
                            description: json.data.mess,
                            bg: "red.500"
                        });
                    }, 500);
                }

                setLoading(false);

            }

        } catch (error) {
            console.log(error);
            setLoading(false);
        }


    }

    const handleOK = (signature: any) => {

        // devuelve base64 de la firma
        setDatos((prev) => ({
            ...prev,
            firmaresponsable: signature
        }));
        setTimeout(() => {
            Toast.show({
                render: () => {
                    return (
                        <Box bg="success.500" px="4" py="3" rounded="sm" mb={5} zIndex={9999}>
                            <Text color={"white"}>Firma guardada correctamente</Text>
                        </Box>
                    );
                }
            });
        }, 500);
    };

    return (
        <Box flex={1}>
            <Box flex={1} bg={"white"}>
                <Header navigation={navigation} />
                <Banner />
                <Center flex={1} px={"1"} bgColor={"white"}>
                    <ScrollView
                        flex={1}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            paddingBottom: 80
                        }}
                    >

                        <Box w="100%">
                            <Heading size={"sm"} textAlign={"center"} py={5}>
                                REGISTRO DE ASISTENCIA
                            </Heading>

                            <Center py={5}>
                                <Select
                                    textAlign={"center"}
                                    minWidth="200"
                                    w={"70%"}
                                    placeholder="Tipo asistencia"
                                    mt={1} selectedValue={datos.idtb_tipo_asistencia}
                                    onValueChange={(value) =>
                                        setDatos({
                                            ...datos,
                                            idtb_tipo_asistencia: value
                                        })
                                    }
                                >
                                    <Select.Item label={"Entrada"} value={"1"} />
                                    <Select.Item label={"Salida a almuerzo"} value={"2"} />
                                    <Select.Item label={"Regreso de almuerzo"} value={"3"} />
                                    <Select.Item label={"Salida final"} value={"4"} />
                                </Select>
                            </Center>

                            <Heading size={"sm"} textAlign={"center"} py={5}>
                                {hora}
                            </Heading>

                            <Center py={5}>
                                {!loading ?
                                    <Button
                                        py={3} onPress={() => {
                                            console.log(datos);

                                            if (datos.idtb_tipo_asistencia == "4" && !datos.firmaresponsable && !datos.nombreresponsable) {
                                                navigation.navigate("PantallaFirmar");
                                            } else {
                                                guardarasistencia();
                                            }
                                        }}
                                        leftIcon={<Icon as={FontAwesome6} name="clock" size="sm" />}
                                    >
                                        MARCAR
                                    </Button> : <HStack space={2} justifyContent="center">
                                        <Spinner accessibilityLabel="Loading posts" />
                                        <Heading color="primary.500" fontSize="md">
                                            Loading
                                        </Heading>
                                    </HStack>}
                            </Center>
                        </Box>

                    </ScrollView>
                </Center>
                <Menuevento navigation={navigation} auxid={2} auxidevento={idevento} />
                <Footer />
            </Box>
        </Box>)
}

export default Asistencia;