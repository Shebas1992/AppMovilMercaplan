import * as React from "react";
import { Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center, NativeBaseProvider, Image, ScrollView, Icon, Spinner, Toast, Pressable, IconButton, FlatList } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import Header from "./Header";
import Banner from "./Bannerpantalla";
import Menuevento from "./Menuevento";
import Footer from "./Footer";
import { urlapi } from "./configuracion";

function Reportes({ route, navigation }: { route: any, navigation: any }) {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [modalVisible2, setModalVisible2] = React.useState(false);
    const { idevento } = route.params;
    const [dias, setDias] = React.useState<String[]>([]);
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
    React.useEffect(() => {
        obtenerevento(idevento);

    }, []);

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
                const auxdias = generarDias(json.data.fechainicio, json.data.fechafin);
                setDias(auxdias);
                console.log(dias);

            }

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };
    const generarDias = (fechaInicio: any, fechaFin: any) => {


        const dias = [];

        let fechaActual = new Date(fechaInicio);
        let fechaFinal = new Date(fechaFin);

        while (fechaActual <= fechaFinal) {

            dias.push(fechaActual.toISOString().split('T')[0]); // 👈 clave

            fechaActual.setUTCDate(fechaActual.getUTCDate() + 1); // 👈 clave
        }

        return dias;
    };



    const Rep = ({ fechareporte }: { fechareporte: any }) => {
        return (
            <Box alignItems="center" my={2}>
                <Pressable onPress={() => navigation.navigate("Productosevento", {
                    idevento: idevento,
                    fechareporte: fechareporte
                })} rounded="8" overflow="hidden" maxW="96" borderWidth="1" borderColor="coolGray.300" p="5">
                    <Box>
                        <HStack justifyContent={"space-around"}>
                            <HStack w={"50%"}>
                                <IconButton icon={<Icon as={Ionicons} name="document-text-outline" size="xl" color="green.600" />} />
                                <Text color="coolGray.800" mt="3" fontWeight="medium" fontSize="md" textAlign={"center"}>
                                    Reporte Ventas
                                </Text>
                            </HStack>
                            <HStack w={"50%"} justifyContent={"flex-end"} my={3}>
                                <Text bold color={"gray.500"}>Fecha:</Text>
                                <Text>{fechareporte}</Text>
                            </HStack>
                        </HStack>
                    </Box>
                </Pressable>
            </Box >
        )
    }
    return (
        <Box flex={1}>
            <Box flex={1} bg={"white"}>
                <Header navigation={navigation} />
                <Banner />
                <ScrollView flex={1} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
                    {dias.map((element, index) => (
                        <Rep key={index} fechareporte={element} />
                    ))}
                </ScrollView>
                <Menuevento navigation={navigation} auxid={4} auxidevento={idevento} />
                <Footer />
            </Box>

        </Box>



    )
}

export default Reportes;