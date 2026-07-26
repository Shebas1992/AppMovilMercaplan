import { Box, Button, FormControl, HStack, Icon, Input, Modal, Pressable } from "native-base";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import DateTimePickerModal from "react-native-modal-datetime-picker";

type ProductoModalProps = {
    isOpen: boolean;
    onClose: () => void;
    producto: any;
    selectProducto: any;
    setSelectProducto: React.Dispatch<React.SetStateAction<any>>;
    onSave: () => void;
    saving?: boolean;
    mode: "inicial" | "venta";
    isDatePickerVisible: boolean;
    showDatePicker: () => void;
    hideDatePicker: () => void;
    handleConfirm: (date: Date) => void;
};

const ProductoModal = React.memo(function ProductoModal({
    isOpen,
    onClose,
    producto,
    selectProducto,
    setSelectProducto,
    onSave,
    saving = false,
    mode,
    isDatePickerVisible,
    showDatePicker,
    hideDatePicker,
    handleConfirm
}: ProductoModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} avoidKeyboard justifyContent="flex-start" top="5" size="lg">
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>{producto?.nproducto || "Producto"}</Modal.Header>
                <Modal.Body>
                    {mode === "inicial" ? (
                        <>
                            <FormControl mt="3">
                                <FormControl.Label>PVP</FormControl.Label>
                                <Input placeholder="PVP" value={selectProducto.pvp?.toString()} onChangeText={(e) => setSelectProducto({
                                    ...selectProducto,
                                    pvp: e
                                })} keyboardType="decimal-pad" />
                            </FormControl>
                            <FormControl mt="3">
                                <FormControl.Label>PVC</FormControl.Label>
                                <Input placeholder="PVC" value={selectProducto.pvc?.toString()} onChangeText={(e) => setSelectProducto({
                                    ...selectProducto,
                                    pvc: e
                                })} keyboardType="decimal-pad" />
                            </FormControl>
                            <FormControl mt="3">
                                <FormControl.Label>Inventario inicial:</FormControl.Label>
                                <Input placeholder="Cantidad incial stock" value={selectProducto.inventarioinicial?.toString()} onChangeText={(e) => setSelectProducto({
                                    ...selectProducto,
                                    inventarioinicial: e
                                })} keyboardType="decimal-pad" />
                            </FormControl>
                            <FormControl mt="3">
                                <FormControl.Label>Lote a caducar:</FormControl.Label>
                                <Input placeholder="Lote a caducar" value={selectProducto.lotecaduca?.toString()} onChangeText={(e) => setSelectProducto({
                                    ...selectProducto,
                                    lotecaduca: e
                                })} />
                            </FormControl>
                            <FormControl mt="3">
                                <FormControl.Label>Fecha de Lote:</FormControl.Label>
                                <Pressable onPress={showDatePicker}>
                                    <Box pointerEvents="none">
                                        <Input
                                            placeholder="Fecha a caducar"
                                            value={selectProducto.fechacaduca?.toString()}
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
                                    onCancel={hideDatePicker} />
                            </FormControl>
                        </>
                    ) : (
                        <>
                            <FormControl mt="3">
                                <FormControl.Label>Cantidad Venta</FormControl.Label>
                                <Input placeholder="Cantidad de venta" value={selectProducto.cantidad?.toString()} onChangeText={(e) => {
                                    const cantidad = Number(e) || 0;
                                    const pvp = Number(selectProducto.pvp) || 0;

                                    setSelectProducto((prev: any) => ({
                                        ...prev,
                                        cantidad: e,
                                        ventas: (cantidad * pvp).toString()
                                    }));
                                }} keyboardType="decimal-pad" />
                            </FormControl>
                            <FormControl mt="3">
                                <FormControl.Label>Reposición</FormControl.Label>
                                <Input placeholder="Reposición" value={selectProducto.reposicion?.toString()} onChangeText={(e) => {
                                    const cantidad = Number(selectProducto.cantidad) || 0;
                                    const invinicial = Number(selectProducto.inventarioinicial) || 0;
                                    const rep = Number(e) || 0;

                                    setSelectProducto((prev: any) => ({
                                        ...prev,
                                        reposicion: e,
                                        inventariofinal: (invinicial - cantidad + rep).toString()
                                    }));
                                }} keyboardType="decimal-pad" />
                            </FormControl>
                            <FormControl mt="3">
                                <FormControl.Label>Inventario Final</FormControl.Label>
                                <Input placeholder="Inventario final" value={selectProducto.inventariofinal?.toString()} keyboardType="number-pad" isReadOnly />
                            </FormControl>
                            <FormControl mt="3">
                                <FormControl.Label>Ventas</FormControl.Label>
                                <Input placeholder="Cantidad de ventas" isReadOnly value={`$ ${selectProducto.ventas?.toString() || '0'}`} keyboardType="number-pad" />
                            </FormControl>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <HStack w={"100%"} justifyContent={"space-around"}>
                        <Button onPress={onSave} leftIcon={<Icon as={Ionicons} name="save" size="sm" />} isDisabled={saving} isLoading={saving}>
                            {saving ? "Guardando..." : "Guardar"}
                        </Button>
                        <Button onPress={onClose}>
                            Cancelar
                        </Button>
                    </HStack>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
});

export default ProductoModal;
