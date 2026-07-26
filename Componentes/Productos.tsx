import { Badge, Box, Button, Center, Flex, FormControl, Heading, HStack, Icon, Input, Modal, Pressable, ScrollView, Spacer, Spinner, Text, Toast, VStack } from "native-base";
import React from "react";
import Header from "./Header";
import Banner from "./Bannerpantalla";
import Menuevento from "./Menuevento";
import Footer from "./Footer";
import ProductoModal from "./ProductoModal";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { urlapi } from "./configuracion";

function Productos({ route, navigation }: { route: any, navigation: any }) {
    const idevento = route?.params?.idevento ?? route?.params?.idtb_reporte ?? route?.params?.idreporte;
    const fechareporte = route?.params?.fechareporte;

    React.useEffect(() => {
        verificarLogin();

        const unsubscribe = navigation?.addListener?.("focus", () => {
            verificarLogin();
        });

        return unsubscribe;
    }, [navigation, idevento]);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalVisible2, setModalVisible2] = React.useState(false);
    const [palabra, setPalabra] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [savingInicial, setSavingInicial] = React.useState(false);
    const [savingVenta, setSavingVenta] = React.useState(false);
    const [isDatePickerVisible, setDatePickerVisility] = React.useState(false)
    const [lstproductos, setLstproductos] = React.useState([]);
    const [mostrarCalendario, setMostrarCalendario] = React.useState(false);
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
        fechareporte: "",
        lotecaduca: "",
        fechacaduca: "",

    });


    const showDatePicker = React.useCallback(() => {
        setDatePickerVisility(true);
    }, []);

    const hideDatePicker = React.useCallback(() => {
        setDatePickerVisility(false);
    }, []);

    const handleConfirm = React.useCallback((date: Date) => {
        setSelectProducto(prev => ({
            ...prev,
            fechacaduca: date.toLocaleDateString()
        }));
        hideDatePicker();
    }, [hideDatePicker]);

    const abrirModalInicial = React.useCallback((producto: any) => {
        setSelectProducto(producto);
        navigation.navigate("RegistroInfoInicial", {
            producto,
            idevento,
            usuario: usuario.idusuario ? usuario : null,
            onRefresh: () => obtenerproductos(idevento, usuario.idusuario)
        });
    }, [idevento, navigation, usuario]);

    const abrirModalVenta = React.useCallback((producto: any) => {
        setSelectProducto(producto);
        navigation.navigate("RegistroVentas", {
            producto,
            idevento,
            usuario: usuario.idusuario ? usuario : null,
            onRefresh: () => obtenerproductos(idevento, usuario.idusuario)
        });
    }, [idevento, navigation, usuario]);

    const cerrarModalInicial = React.useCallback(() => {
        setModalVisible(false);
        setMostrarCalendario(false);
    }, []);

    const cerrarModalVenta = React.useCallback(() => {
        setModalVisible2(false);
    }, []);

    const productosDisponibles = React.useMemo(() => {
        if (Array.isArray(lstproductos)) {
            return lstproductos;
        }

        if (Array.isArray((lstproductos as any)?.data)) {
            return (lstproductos as any).data;
        }

        return [];
    }, [lstproductos]);

    const productosFiltrados = React.useMemo(() => {
        const textoBusqueda = (palabra || '').toLowerCase();

        return productosDisponibles.filter(function (item: any) {
            const nombreProducto = item?.nproducto?.toString() || '';
            return nombreProducto.toLowerCase().includes(textoBusqueda) || !textoBusqueda;
        });
    }, [productosDisponibles, palabra]);

    const normalizarProductos = (respuesta: any) => {
        const datos = respuesta?.data ?? respuesta;

        if (Array.isArray(datos)) return datos;
        if (Array.isArray(datos?.data)) return datos.data;
        if (Array.isArray(datos?.productos)) return datos.productos;
        if (Array.isArray(datos?.items)) return datos.items;
        if (Array.isArray(datos?.result)) return datos.result;

        return [];
    };

    const verificarLogin = async () => {
        if (!idevento) {
            setLoading(false);
            Toast.show({ description: "No se encontró el evento activo." });
            return;
        }

        const session = await AsyncStorage.getItem("session");
        if (session) {
            const aux = JSON.parse(session);
            setUsuario(aux);
            obtenerproductos(idevento, aux.idusuario);
        }
    };

    const obtenerproductos = async (auxidevento: any, auxidusuario: any) => {
        try {
            setLoading(true);
            const response = await fetch(urlapi + 'usuario/listarproductosevento', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({
                    idtb_reporte: auxidevento,
                    idusuario: auxidusuario
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
                setLoading(false);
            } else {
                const productos = normalizarProductos(json);
                setLoading(false);
                setLstproductos(productos);
            }

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const ingresardatosinicialesproducto = async () => {
        if (savingInicial) {
            return;
        }

        try {
            setSavingInicial(true);
            const productoActualizado = {
                ...selectProducto,
                idtb_usuario: usuario.idusuario,
                idtb_reporte: idevento
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
        } finally {
            setSavingInicial(false);
        }
    };

    const ingresardatosventasproducto = async () => {
        if (savingVenta) {
            return;
        }

        try {
            setSavingVenta(true);
            const productoActualizado = {
                ...selectProducto,
                idtb_usuario: usuario.idusuario,
                idtb_reporte: idevento
            };

            setSelectProducto(productoActualizado);
            //console.log(productoActualizado);
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
            console.log(error);
            setLoading(false);
        } finally {
            setSavingVenta(false);
        }

    }

    const Producto = React.memo(function Producto({ producto, onOpenInicial, onOpenVenta }: { producto: any, onOpenInicial: (producto: any) => void, onOpenVenta: (producto: any) => void }) {
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
                            <Button w={"50%"} leftIcon={<Icon as={MaterialIcons} name="inventory" size="sm" />} bgColor={"emerald.400"} onPress={(e: any) => {
                                e?.stopPropagation?.();
                                onOpenInicial(producto);
                            }}>
                                Info Inicial
                            </Button>
                            <Button w={"50%"} leftIcon={<Icon as={MaterialIcons} name="sell" size="sm" />} bgColor={"blueGray.400"} onPress={(e: any) => {
                                e?.stopPropagation?.();
                                onOpenVenta(producto);
                            }} isDisabled={producto.inventarioinicial == null && producto.pvc == null}>
                                Datos venta
                            </Button>
                        </HStack>
                    </Box>
                </Pressable>
            </Box>
        )
    });
    return (
        <Box flex={1}>
            <Box flex={1} bg={"white"}>
                <Header navigation={navigation} />
                <Banner />
                <Center my={2}>
                    <Heading size={"xs"}>Productos</Heading>
                </Center>
                <Center my={5}>
                    <Input w={{
                        base: "90%",
                        md: "25%"
                    }} InputLeftElement={<Icon as={<Ionicons name="search-outline" />} size={5} ml="2" color="muted.400" />} placeholder="Buscar producto" onChangeText={e => setPalabra(e)} />
                </Center>
                <Center mb={3}>
                    <Button size="sm" variant="outline" onPress={() => navigation.navigate("PrevisualizacionProducto", { productos: productosFiltrados })}>
                        Ver resumen de ventas
                    </Button>
                </Center>
                {loading ? <Center flex={1}><Spinner size="lg" />
                <Heading color="primary.500" fontSize="md">
        Cargando productos...
      </Heading></Center>:
                productosFiltrados.length > 0 ? (
                    <ScrollView flex={1} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
                        {productosFiltrados.map((producto: any, index: number) => (
                            <Producto key={index} producto={producto} onOpenInicial={abrirModalInicial} onOpenVenta={abrirModalVenta} />
                        ))}
                    </ScrollView>
                ) : (
                    <Center flex={1} px="6">
                        <Text color="muted.500">No hay productos para mostrar.</Text>
                    </Center>
                )}
                <Menuevento navigation={navigation} auxid={4} auxidevento={idevento} />
                <Footer />
            </Box>
            
            <ProductoModal
                isOpen={modalVisible}
                onClose={cerrarModalInicial}
                producto={selectProducto}
                selectProducto={selectProducto}
                setSelectProducto={setSelectProducto}
                onSave={ingresardatosinicialesproducto}
                saving={savingInicial}
                mode="inicial"
                isDatePickerVisible={isDatePickerVisible}
                showDatePicker={showDatePicker}
                hideDatePicker={hideDatePicker}
                handleConfirm={handleConfirm}
            />
            <ProductoModal
                isOpen={modalVisible2}
                onClose={cerrarModalVenta}
                producto={selectProducto}
                selectProducto={selectProducto}
                setSelectProducto={setSelectProducto}
                onSave={() => {
                    setModalVisible2(false);
                    ingresardatosventasproducto();
                }}
                saving={savingVenta}
                mode="venta"
                isDatePickerVisible={isDatePickerVisible}
                showDatePicker={showDatePicker}
                hideDatePicker={hideDatePicker}
                handleConfirm={handleConfirm}
            />
        </Box>



    )
}

export default Productos;
