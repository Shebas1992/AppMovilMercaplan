import { Box, Button, Center, FormControl, Heading, HStack, Icon, Input, Pressable, ScrollView, Text, Toast, VStack } from "native-base";
import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { urlapi } from "./configuracion";

function RegistroInfoInicial({ route, navigation }: { route: any; navigation: any }) {
    const { producto, idevento, usuario, onRefresh } = route.params || {};
    const [saving, setSaving] = React.useState(false);
    const [isDatePickerVisible, setDatePickerVisible] = React.useState(false);
    const [form, setForm] = React.useState({
        nproducto: producto?.nproducto || "",
        presentacion: producto?.presentacion || "",
        pvp: producto?.pvp || "",
        pvc: producto?.pvc || "",
        inventarioinicial: producto?.inventarioinicial || "",
        lotecaduca: producto?.lotecaduca || "",
        fechacaduca: producto?.fechacaduca || "",
        idtb_producto: producto?.idtb_producto || "",
    });

    const handleConfirm = (date: Date) => {
        setForm(prev => ({ ...prev, fechacaduca: date.toLocaleDateString() }));
        setDatePickerVisible(false);
    };

    const handleSave = async () => {
        if (saving) return;

        try {
            setSaving(true);
            const payload = {
                ...form,
                idtb_usuario: usuario?.idusuario,
                idtb_reporte: idevento,
            };

            const response = await fetch(urlapi + 'usuario/ingresardatosproductosevento', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const json = await response.json();

            if (json?.error || !response.ok) {
                throw new Error(json?.mess || 'No se pudo guardar');
            }

            if (json?.data?.isregis) {
                onRefresh?.();
                Toast.show({ description: json.data.mess || 'Guardado correctamente', bg: 'emerald.500' });
                navigation.goBack();
            } else {
                Toast.show({ description: json.data?.mess || 'No se pudo guardar', bg: 'danger.500' });
            }
        } catch (error: any) {
            Toast.show({ description: error?.message || 'Error al guardar', bg: 'danger.500' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box flex={1} bg="white">
            <Center pt="16" pb="4">
                <Heading size="md">Información inicial</Heading>
                <Text mt="2" color="muted.500">{`${producto?.nproducto || 'Producto'}${producto?.presentacion ? ` - ${producto.presentacion}` : ''}`}</Text>
            </Center>
            <ScrollView px="4" py="2">
                <VStack space="3">
                    <FormControl>
                        <FormControl.Label>PVP</FormControl.Label>
                        <Input value={form.pvp?.toString()} onChangeText={(e) => setForm(prev => ({ ...prev, pvp: e }))} keyboardType="decimal-pad" />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>PVC</FormControl.Label>
                        <Input value={form.pvc?.toString()} onChangeText={(e) => setForm(prev => ({ ...prev, pvc: e }))} keyboardType="decimal-pad" />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Inventario inicial</FormControl.Label>
                        <Input value={form.inventarioinicial?.toString()} onChangeText={(e) => setForm(prev => ({ ...prev, inventarioinicial: e }))} keyboardType="decimal-pad" />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Lote a caducar</FormControl.Label>
                        <Input value={form.lotecaduca?.toString()} onChangeText={(e) => setForm(prev => ({ ...prev, lotecaduca: e }))} />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Fecha de caducidad</FormControl.Label>
                        <Pressable onPress={() => setDatePickerVisible(true)}>
                            <Box pointerEvents="none">
                                <Input
                                    value={form.fechacaduca?.toString()}
                                    isReadOnly
                                    InputRightElement={<Icon as={MaterialIcons} name="calendar-today" size="sm" mr="3" color="muted.400" />}
                                />
                            </Box>
                        </Pressable>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            locale="es-ES"
                            onConfirm={handleConfirm}
                            onCancel={() => setDatePickerVisible(false)}
                        />
                    </FormControl>
                </VStack>
            </ScrollView>
            <HStack p="4" space="3">
                <Button flex={1} variant="outline" onPress={() => navigation.goBack()}>
                    Cancelar
                </Button>
                <Button flex={1} onPress={handleSave} isDisabled={saving} isLoading={saving}>
                    Guardar
                </Button>
            </HStack>
        </Box>
    );
}

export default RegistroInfoInicial;
