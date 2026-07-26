import { Box, Button, Center, Heading, HStack, ScrollView, Spinner, Text, VStack } from "native-base";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "native-base";
import { urlapi } from "./configuracion";

function InformeAsistencia({ route, navigation }: { route: any; navigation: any }) {
    const [loading, setLoading] = React.useState(false);
    const [productos, setProductos] = React.useState<any[]>([]);
    const [usuario, setUsuario] = React.useState({ idusuario: null as any });
    const idevento = route?.params?.idevento;

    React.useEffect(() => {
        const verificarLogin = async () => {
            const session = await AsyncStorage.getItem("session");
            if (session) {
                const aux = JSON.parse(session);
                setUsuario(aux);
                await obtenerDatosVentas(aux.idusuario, idevento);
            }
        };

        verificarLogin();
    }, [idevento]);

    const normalizarProductos = (respuesta: any) => {
        const datos = respuesta?.data ?? respuesta;

        if (Array.isArray(datos)) return datos;
        if (Array.isArray(datos?.data)) return datos.data;
        if (Array.isArray(datos?.productos)) return datos.productos;
        if (Array.isArray(datos?.items)) return datos.items;
        if (Array.isArray(datos?.result)) return datos.result;

        return [];
    };

    const obtenerDatosVentas = async (auxidusuario: any, auxidevento: any) => {
        try {
            setLoading(true);
            const response = await fetch(urlapi + "usuario/listarproductosevento", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idtb_reporte: auxidevento,
                    idusuario: auxidusuario
                })
            });

            if (!response.ok) {
                throw new Error("Error en la conexión con el servidor.");
            }

            const json = await response.json();

            if (json.error) {
                Toast.show({ description: "Error al cargar la información." });
            } else {
                setProductos(normalizarProductos(json));
            }
        } catch (error) {
            console.log(error);
            Toast.show({ description: "No se pudo cargar el informe de ventas." });
        } finally {
            setLoading(false);
        }
    };

    const datos = productos
        .filter((producto: any) => Number(producto?.cantidad || 0) > 0)
        .map((producto: any, index: number) => ({
            key: producto?.idtb_producto || index,
            producto: `${producto?.nproducto || "—"}${producto?.presentacion ? ` - ${producto.presentacion}` : ""}`,
            pvp: producto?.pvp || "0",
            pvc: producto?.pvc || "0",
            inventarioInicial: producto?.inventarioinicial || "0",
            numeroVentas: producto?.cantidad || "0",
            totalVentas: producto?.ventas || "0",
        }));

    return (
        <Box flex={1} bg="white">
            <Center pt="16" pb="4">
                <Heading size="md">Informe de ventas</Heading>
            </Center>
            <ScrollView px="4" py="2">
                {loading ? (
                    <Center py="6">
                        <Spinner size="lg" />
                        <Text mt="3" color="muted.500">Cargando informe...</Text>
                    </Center>
                ) : (
                    <VStack space="3">
                        {datos.length > 0 ? datos.map((item: any) => (
                            <Box key={item.key} borderWidth="1" borderColor="coolGray.200" borderRadius="md" p="3">
                                <Text fontSize="sm" fontWeight="bold" color="coolGray.800">{item.producto}</Text>
                                <HStack justifyContent="space-between" mt="2">
                                    <Text fontSize="xs" color="muted.500">PVP</Text>
                                    <Text fontSize="xs" color="coolGray.800">$ {item.pvp}</Text>
                                </HStack>
                                <HStack justifyContent="space-between" mt="1">
                                    <Text fontSize="xs" color="muted.500">PVC</Text>
                                    <Text fontSize="xs" color="coolGray.800">$ {item.pvc}</Text>
                                </HStack>
                                <HStack justifyContent="space-between" mt="1">
                                    <Text fontSize="xs" color="muted.500">Inventario inicial</Text>
                                    <Text fontSize="xs" color="coolGray.800">{item.inventarioInicial}</Text>
                                </HStack>
                                <HStack justifyContent="space-between" mt="1">
                                    <Text fontSize="xs" color="muted.500">Número de ventas</Text>
                                    <Text fontSize="xs" color="coolGray.800">{item.numeroVentas}</Text>
                                </HStack>
                                <HStack justifyContent="space-between" mt="1">
                                    <Text fontSize="xs" color="muted.500">Total ventas</Text>
                                    <Text fontSize="xs" color="coolGray.800">$ {item.totalVentas}</Text>
                                </HStack>
                            </Box>
                        )) : (
                            <Center py="6">
                                <Text color="muted.500">No hay datos para mostrar.</Text>
                            </Center>
                        )}
                    </VStack>
                )}
            </ScrollView>
            <HStack p="4" space="3">
                <Button flex={1} variant="outline" onPress={() => navigation.goBack()}>
                    Volver
                </Button>
            </HStack>
        </Box>
    );
}

export default InformeAsistencia;
