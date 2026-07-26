import * as React from "react";
import { Box, Text, Heading, VStack, FormControl, Input, Button, ScrollView, Toast } from "native-base";
import Footer from "./Footer";
import Menuevento from "./Menuevento";
import Banner from "./Bannerpantalla";
import Header from "./Header";

function Promocionales({ navigation }: { navigation: any }) {
    const [impulsadora, setImpulsadora] = React.useState({
        producto: "",
        cantidad: ""
    });
    const [cliente, setCliente] = React.useState({
        nombreCliente: "",
        numeroFactura: "",
        tipoPromocional: ""
    });
    const [savingImpulsadora, setSavingImpulsadora] = React.useState(false);
    const [savingCliente, setSavingCliente] = React.useState(false);

    const guardarImpulsadora = () => {
        if (!impulsadora.producto || !impulsadora.cantidad) {
            Toast.show({ description: "Completa el producto y la cantidad", bg: "danger.500" });
            return;
        }

        setSavingImpulsadora(true);
        setTimeout(() => {
            Toast.show({ description: "Entrega a impulsadora registrada", bg: "emerald.500" });
            setImpulsadora({ producto: "", cantidad: "" });
            setSavingImpulsadora(false);
        }, 500);
    };

    const guardarCliente = () => {
        if (!cliente.nombreCliente || !cliente.numeroFactura || !cliente.tipoPromocional) {
            Toast.show({ description: "Completa nombre, factura y tipo de promocional", bg: "danger.500" });
            return;
        }

        setSavingCliente(true);
        setTimeout(() => {
            Toast.show({ description: "Entrega al cliente registrada", bg: "emerald.500" });
            setCliente({ nombreCliente: "", numeroFactura: "", tipoPromocional: "" });
            setSavingCliente(false);
        }, 500);
    };

    return (
        <Box flex={1} bg="white">
            <Header navigation={navigation} />
            <Banner />
            <ScrollView flex={1} contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
                <Heading color="primary.500" textAlign="center" fontSize="md" mb="4">
                    Sección de Promocionales
                </Heading>

                <Box borderWidth="1" borderColor="coolGray.200" borderRadius="md" p="4" mb="4">
                    <Heading size="sm" mb="3">Entrega a la impulsadora</Heading>
                    <FormControl>
                        <FormControl.Label>Producto promocional</FormControl.Label>
                        <Input
                            placeholder="Ej. Gorras"
                            value={impulsadora.producto}
                            onChangeText={(text) => setImpulsadora(prev => ({ ...prev, producto: text }))}
                        />
                    </FormControl>
                    <FormControl mt="3">
                        <FormControl.Label>Cantidad entregada</FormControl.Label>
                        <Input
                            placeholder="Cantidad"
                            keyboardType="numeric"
                            value={impulsadora.cantidad}
                            onChangeText={(text) => setImpulsadora(prev => ({ ...prev, cantidad: text }))}
                        />
                    </FormControl>
                    <Button mt="4" onPress={guardarImpulsadora} isLoading={savingImpulsadora} isDisabled={savingImpulsadora}>
                        Guardar entrega a impulsadora
                    </Button>
                </Box>

                <Box borderWidth="1" borderColor="coolGray.200" borderRadius="md" p="4">
                    <Heading size="sm" mb="3">Entrega al cliente</Heading>
                    <FormControl>
                        <FormControl.Label>Nombre del cliente</FormControl.Label>
                        <Input
                            placeholder="Nombre del cliente"
                            value={cliente.nombreCliente}
                            onChangeText={(text) => setCliente(prev => ({ ...prev, nombreCliente: text }))}
                        />
                    </FormControl>
                    <FormControl mt="3">
                        <FormControl.Label>Número de factura</FormControl.Label>
                        <Input
                            placeholder="Número de factura"
                            value={cliente.numeroFactura}
                            onChangeText={(text) => setCliente(prev => ({ ...prev, numeroFactura: text }))}
                        />
                    </FormControl>
                    <FormControl mt="3">
                        <FormControl.Label>Tipo de promocional entregado</FormControl.Label>
                        <Input
                            placeholder="Ej. Gorras, camisetas"
                            value={cliente.tipoPromocional}
                            onChangeText={(text) => setCliente(prev => ({ ...prev, tipoPromocional: text }))}
                        />
                    </FormControl>
                    <Button mt="4" onPress={guardarCliente} isLoading={savingCliente} isDisabled={savingCliente}>
                        Guardar entrega al cliente
                    </Button>
                </Box>
            </ScrollView>
            <Menuevento navigation={navigation} auxid={5} auxidevento={0} />
            <Footer />
        </Box>
    );
}

export default Promocionales;