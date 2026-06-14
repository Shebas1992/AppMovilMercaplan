import { Badge, Box, Button, Center, Flex, FormControl, Heading, HStack, Icon, Input, Modal, Pressable, ScrollView, Spacer, Text, Toast, VStack } from "native-base";
import React from "react";
import Header from "./Header";
import Banner from "./Bannerpantalla";
import Menuevento from "./Menuevento";
import Footer from "./Footer";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { urlapi } from "./configuracion";

function Productos({ route, navigation }: { route: any, navigation: any }) {
    React.useEffect(() => {

        verificarLogin();

    }, [])
    const { idevento, fechareporte } = route.params;
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalVisible2, setModalVisible2] = React.useState(false);
    const [palabra, setPalabra] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [lstproductos, setLstproductos] = React.useState([]);
    const [usuario, setUsuario] = React.useState({
        nombres: null,
        apellidos: null,
        token: null,
        ci: null,
        idusuario: null
    });
    const [selectProducto, setSelectProducto] = React.useState({
        nproducto: '',
        presentacion: '',
        pvp: "0",
        pvc: "0",
        inventarioinicial: "",
        inventariofinal: "",
        cantidad: "",
        ventas: "0",
        reposicion: "0",
        idtb_producto: "",
        idtb_usuario: null,
        idtb_evento: "",
        fechareporte: ""

    });

    const verificarLogin = async () => {
        const session = await AsyncStorage.getItem("session");
        if (session) {
            const aux = JSON.parse(session);
            setUsuario(aux);
            obtenerproductos(idevento, aux.idusuario);
        }
    };

    const obtenerproductos = async (auxidevento: any, auxidusuario: any) => {
        try {
            const response = await fetch(urlapi + 'usuario/listarproductosevento', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({
                    idevento: auxidevento,
                    idusuario: auxidusuario,
                    fechareporte: fechareporte
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
                setLstproductos(json.data);

            }

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const ingresardatosinicialesproducto = async () => {
        try {
            const productoActualizado = {
                ...selectProducto,
                idtb_usuario: usuario.idusuario,
                idtb_evento: idevento,
                fechareporte: fechareporte
            };

            setSelectProducto(productoActualizado);
            const response = await fetch(urlapi + 'usuario/ingresardatosproductosevento', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }, body: JSON.stringify(productoActualizado)
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
                if (json.data.isregis) {
                    obtenerproductos(idevento, usuario.idusuario);
                    setModalVisible(!modalVisible)
                    setTimeout(() => {
                        Toast.show({
                            description: json.data.mess,
                            bg: "emerald.500"
                        });
                    }, 500);
                } else {
                    setTimeout(() => {
                        Toast.show({
                            description: json.data.mess,
                            bg: "danger.500"
                        });
                    }, 500);
                }
                //setLstproductos(json.data);

            }

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const ingresardatosventasproducto = async () => {
        try {
            const productoActualizado = {
                ...selectProducto,
                idtb_usuario: usuario.idusuario,
                idtb_evento: idevento,
                fechareporte: fechareporte
            };

            setSelectProducto(productoActualizado);
            console.log(productoActualizado);
            const response = await fetch(urlapi + 'usuario/ingresardatosventasproducto', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }, body: JSON.stringify(productoActualizado)
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
                if (json.data.isregis) {
                    obtenerproductos(idevento, usuario.idusuario);
                    setModalVisible2(!modalVisible2)
                    setTimeout(() => {
                        Toast.show({
                            description: json.data.mess,
                            bg: "emerald.500"
                        });
                    }, 500);
                } else {
                    setTimeout(() => {
                        Toast.show({
                            description: json.data.mess,
                            bg: "danger.500"
                        });
                    }, 500);
                }
            }
        } catch (error) {

        }

    }

    const Producto = ({ producto }: { producto: any }) => {
        return (
            <Box alignItems="center" my={2}>
                <Pressable onPress={() => setSelectProducto(prev => ({
                    ...prev, ...producto
                }))} rounded="8" overflow="hidden" maxW="96" borderWidth="1" borderColor="coolGray.300" p="5">
                    <Box>
                        <VStack w={"50%"} justifyContent={"space-between"}>
                            <HStack alignItems={"center"}>
                                <VStack>
                                    <HStack>
                                        <Box paddingRight={"3"}>
                                            {producto.pvc == null && producto.inventarioinicial == null ?
                                                <Icon as={MaterialIcons} name="radio-button-unchecked" color={"gray.500"} size="md" /> :
                                                producto.inventariofinal == null ?
                                                    <Icon as={MaterialIcons} name="incomplete-circle" color={"amber.500"} size="md" /> :
                                                    <Icon as={MaterialIcons} name="check-circle" color={"emerald.500"} size="md" />}
                                        </Box>
                                        <Text color="coolGray.800" fontWeight="medium" fontSize="xs" textAlign={"center"}>
                                            {producto.nproducto}
                                        </Text>
                                    </HStack>
                                    <HStack alignItems={"center"}>
                                        <Text fontSize={"xs"}>{producto.presentacion}</Text>
                                    </HStack>
                                </VStack>
                            </HStack>

                        </VStack>



                        <HStack w={"100%"} justifyContent={"space-between"} my={3}>
                            <Button w={"50%"} leftIcon={<Icon as={MaterialIcons} name="inventory" size="sm" />} bgColor={"emerald.400"} onPress={() => {
                                setModalVisible(!modalVisible);
                                setSelectProducto(producto)
                            }}>
                                Info Inicial
                            </Button>
                            <Button w={"50%"} leftIcon={<Icon as={MaterialIcons} name="sell" size="sm" />} bgColor={"blueGray.400"} onPress={() => {
                                setModalVisible2(!modalVisible2);
                                setSelectProducto(producto)
                            }} isDisabled={producto.inventarioinicial == null && producto.pvc == null}>
                                Datos venta
                            </Button>
                        </HStack>
                    </Box>
                </Pressable>
            </Box>
        )
    }
    return (
        <Box flex={1}>
            <Box flex={1} bg={"white"}>
                <Header navigation={navigation} />
                <Banner />
                <Center my={2}>
                    <Heading size={"xs"}>Reporte de la fecha: {fechareporte.substring(0, fechareporte.indexOf(" "))}</Heading>
                </Center>
                <Center my={5}>
                    <Input w={{
                        base: "90%",
                        md: "25%"
                    }} InputLeftElement={<Icon as={<Ionicons name="search-outline" />} size={5} ml="2" color="muted.400" />} placeholder="Buscar producto" onChangeText={e => setPalabra(e)} />
                </Center>
                <ScrollView flex={1} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
                    {lstproductos.filter(function (item: any) {
                        return item.nproducto.toLowerCase().includes(palabra.toLowerCase()) || !palabra;
                    }).map((producto, index) => (
                        <Producto key={index} producto={producto} />
                    ))}

                </ScrollView>
                <Menuevento navigation={navigation} auxid={4} auxidevento={idevento} />
                <Footer />
            </Box>

            {/*Modal para realizar el registro de los datos iniciales del producto.*/}
            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} avoidKeyboard justifyContent="flex-start" top="5" size="lg">
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>{selectProducto.nproducto}</Modal.Header>
                    <Modal.Body>
                        <FormControl mt="3">
                            <FormControl.Label>PVP</FormControl.Label>
                            <Input placeholder="PVP" value={selectProducto.pvp?.toString()} onChangeText={(e) => setSelectProducto({
                                ...selectProducto,
                                pvp: e
                            })} keyboardType="number-pad" />
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>PVC</FormControl.Label>
                            <Input placeholder="PVC" value={selectProducto.pvc?.toString()} onChangeText={(e) => setSelectProducto({
                                ...selectProducto,
                                pvc: e
                            })} keyboardType="number-pad" />
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Inventario inicial:</FormControl.Label>
                            <Input placeholder="Cantidad incial stock" value={selectProducto.inventarioinicial?.toString()} onChangeText={(e) => setSelectProducto({
                                ...selectProducto,
                                inventarioinicial: e
                            })} keyboardType="number-pad" />
                        </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                        <HStack w={"100%"} justifyContent={"space-around"}>
                            <Button onPress={() => {
                                ingresardatosinicialesproducto();

                            }} leftIcon={<Icon as={Ionicons} name="save" size="sm" />} >
                                Guardar
                            </Button>
                            <Button onPress={() => {
                                setModalVisible(false);
                            }}>
                                Cancelar
                            </Button>
                        </HStack>

                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            {/*Modal para realizar el registro de los datos de venta.*/}
            <Modal isOpen={modalVisible2} onClose={() => setModalVisible2(false)} avoidKeyboard justifyContent="flex-start" top="5" size="lg">
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>{selectProducto.nproducto}</Modal.Header>
                    <Modal.Body>
                        <FormControl mt="3">
                            <FormControl.Label>Cantidad Venta</FormControl.Label>
                            <Input placeholder="Cantidad de venta" value={selectProducto.cantidad?.toString()} onChangeText={(e) => {
                                const cantidad = Number(e) || 0;
                                const pvp = Number(selectProducto.pvp) || 0;

                                setSelectProducto(prev => ({
                                    ...prev,
                                    cantidad: e,
                                    ventas: (cantidad * pvp).toString()
                                }))
                            }} keyboardType="number-pad" />
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Reposición</FormControl.Label>
                            <Input placeholder="Reposición" value={selectProducto.reposicion?.toString()} onChangeText={(e) => {
                                const cantidad = Number(selectProducto.cantidad) || 0;
                                const invinicial = Number(selectProducto.inventarioinicial) || 0;
                                const rep = Number(e) || 0;

                                setSelectProducto(prev => ({
                                    ...prev,
                                    reposicion: e,
                                    inventariofinal: (invinicial - cantidad + rep).toString()
                                }))
                            }} keyboardType="number-pad" />
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Inventario Final</FormControl.Label>
                            <Input placeholder="Inventario final" value={selectProducto.inventariofinal?.toString()} keyboardType="number-pad" isReadOnly />
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Ventas</FormControl.Label>
                            <Input placeholder="Cantidad de ventas" isReadOnly value={`$ ${selectProducto.ventas?.toString() || '0'}`} keyboardType="number-pad" />
                        </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                        <HStack w={"100%"} justifyContent={"space-around"}>
                            <Button onPress={() => {
                                setModalVisible(false);
                                ingresardatosventasproducto();
                            }} leftIcon={<Icon as={Ionicons} name="save" size="sm" />}>
                                Guardar
                            </Button>
                            <Button onPress={() => {
                                setModalVisible2(false);
                            }}>
                                Cancelar
                            </Button>
                        </HStack>

                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </Box>



    )
}

export default Productos;