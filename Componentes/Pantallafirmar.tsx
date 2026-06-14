import React from "react";
import { Box, Button, FormControl, Input, VStack } from "native-base";
import SignatureScreen from "react-native-signature-canvas";

function PantallaFirmar({ navigation, route }: any) {

    const refFirma = React.useRef<any>();
    const [nombre, setNombre] = React.useState("");

    const guardarFirma = (firma: string) => {

        navigation.navigate({
            name: "Asistenciaevento",
            params: {
                firma: firma,
                nombreresponsable: nombre
            },
            merge: true
        });

    };

    return (
        <Box flex={1} bg="white">
            <VStack p={4} space={3}>

                <FormControl>
                    <FormControl.Label>Nombre del responsable</FormControl.Label>
                    <Input
                        value={nombre}
                        onChangeText={setNombre}
                        placeholder="Ingrese el nombre"
                    />
                </FormControl>

            </VStack>
            <Box flex={1}>
                <SignatureScreen
                    ref={refFirma}
                    onOK={guardarFirma}
                    descriptionText="Firma aquí"
                    scrollable={false}
                />
            </Box>

            <VStack p={4} space={3}>

                <Button onPress={() => refFirma.current.clearSignature()}>
                    Limpiar
                </Button>

                <Button onPress={() => refFirma.current.readSignature()}>
                    Guardar firma
                </Button>

                <Button
                    colorScheme="danger"
                    onPress={() => navigation.goBack()}
                >
                    Cancelar
                </Button>

            </VStack>

        </Box>
    );
}

export default PantallaFirmar;