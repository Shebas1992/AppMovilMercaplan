import { Box, Button, Center, Heading, HStack, ScrollView, Text, VStack } from "native-base";
import React from "react";

function PrevisualizacionProducto({ route, navigation }: { route: any; navigation: any }) {
    const productos = route?.params?.productos || [];

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
                <Heading size="md">Resumen de ventas</Heading>
            </Center>
            <ScrollView px="4" py="2">
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
            </ScrollView>
            <HStack p="4" justifyContent="space-between">
                <Button flex={1} onPress={() => navigation.goBack()}>
                    Volver
                </Button>
            </HStack>
        </Box>
    );
}

export default PrevisualizacionProducto;
