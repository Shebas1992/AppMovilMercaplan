import { Box, Button, Center, FormControl, Heading, HStack, Input, ScrollView, Text, Toast, VStack } from "native-base";
import React from "react";
import { urlapi } from "./configuracion";

function RegistroVentas({ route, navigation }: { route: any; navigation: any }) {
    const { producto, idevento, usuario, onRefresh } = route.params || {};
    const [saving, setSaving] = React.useState(false);
    const [form, setForm] = React.useState({
        nproducto: producto?.nproducto || "",
        presentacion: producto?.presentacion || "",
        pvp: producto?.pvp || "",
        inventarioinicial: producto?.inventarioinicial || "",
        cantidad: producto?.cantidad || "",
        reposicion: producto?.reposicion || "",
        inventariofinal: producto?.inventariofinal || "",
        ventas: producto?.ventas || "",
        idtb_producto: producto?.idtb_producto || "",
    });

    const handleChange = (field: string, value: string) => {
        if (field === 'cantidad') {
            const cantidad = Number(value) || 0;
            const pvp = Number(form.pvp) || 0;
            const inventarioInicial = Number(form.inventarioinicial) || 0;
            const reposicion = Number(form.reposicion) || 0;

            setForm(prev => ({
                ...prev,
                cantidad: value,
                ventas: (cantidad * pvp).toString(),
                inventariofinal: (inventarioInicial - cantidad + reposicion).toString(),
            }));
            return;
        }

        if (field === 'reposicion') {
            const cantidad = Number(form.cantidad) || 0;
            const inventarioInicial = Number(form.inventarioinicial) || 0;
            const reposicion = Number(value) || 0;

            setForm(prev => ({
                ...prev,
                reposicion: value,
                inventariofinal: (inventarioInicial - cantidad + reposicion).toString(),
            }));
            return;
        }

        setForm(prev => ({ ...prev, [field]: value }));
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

            const response = await fetch(urlapi + 'usuario/ingresardatosventasproducto', {
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
                <Heading size="md">Datos de venta</Heading>
                <Text mt="2" color="muted.500">{`${producto?.nproducto || 'Producto'}${producto?.presentacion ? ` - ${producto.presentacion}` : ''}`}</Text>
            </Center>
            <ScrollView px="4" py="2">
                <VStack space="3">
                    <FormControl>
                        <FormControl.Label>Cantidad de venta</FormControl.Label>
                        <Input value={form.cantidad?.toString()} onChangeText={(e) => handleChange('cantidad', e)} keyboardType="decimal-pad" />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Reposición</FormControl.Label>
                        <Input value={form.reposicion?.toString()} onChangeText={(e) => handleChange('reposicion', e)} keyboardType="decimal-pad" />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Inventario final</FormControl.Label>
                        <Input value={form.inventariofinal?.toString()} isReadOnly keyboardType="number-pad" />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Ventas</FormControl.Label>
                        <Input value={`$ ${form.ventas?.toString() || '0'}`} isReadOnly keyboardType="number-pad" />
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

export default RegistroVentas;
