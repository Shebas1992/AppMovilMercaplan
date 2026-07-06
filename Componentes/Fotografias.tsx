import { Box, Button, Card, Center, Divider, FormControl, Heading, HStack, Icon, IconButton, Image, Input, Modal, ScrollView, Select, Spinner, Text, Toast, VStack } from "native-base";
import React from "react";
import Header from "./Header";
import Banner from "./Bannerpantalla";
import Menuevento from "./Menuevento";
import Footer from "./Footer";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from 'react-native-image-picker';
import { urlapi } from "./configuracion";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import RNFS from 'react-native-fs';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';


function Fotografia({ route, navigation }: { route: any, navigation: any }) {

    const { idevento } = route.params;
    const [cargando, setCargando] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [loadingDeleteId, setLoadingDeleteId] = React.useState<number | null>(null);
    const [img, setImg] = React.useState<any>(null);
    const [listadoImagenes, setListadoImagenes] = React.useState([]);
    const [tipoImg, setTipoImg] = React.useState("");
    const [modalVisible, setModalVisible] = React.useState(false);
    const [aux, setAux] = React.useState({
        foto: null,
        idtb_fotografia: null,
        tipoasistencia: null
    })
    const [usuario, setUsuario] = React.useState({
        nombres: null,
        apellidos: null,
        token: null,
        ci: null,
        idusuario: null
    });

    React.useEffect(() => {
        verificarLogin();

    }, []);

    //Funciones para abrir la cámara o galería.
    const options: ImagePicker.ImageLibraryOptions = {
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.5,
    }

    /*const openCamera = React.useCallback(() => {
        
        ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) {

            } else if (response.errorCode) {

            } else {

                setImg(response);
            }
        });
    }, []);*/

    const openCamera = React.useCallback(async () => {

        // 🔐 Pedir permiso primero
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Permiso de Cámara',
                    message: 'La app necesita acceder a la cámara',
                    buttonPositive: 'Aceptar',
                    buttonNegative: 'Cancelar',
                }
            );

            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Permiso denegado');
                return;
            }
        }

        // 📸 Abrir cámara
        ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('Cancelado');
            } else if (response.errorCode) {
                console.log('Error:', response.errorMessage);
            } else {

                setImg(response);
            }
        });

    }, []);


    const openGallery = React.useCallback(() => {
        //ImagePicker.launchImageLibrary(options, setImgCamionFrontal);
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {

            } else if (response.errorCode) {

            } else {


                setImg(response);
            }
        });
    }, []);
    const verificarLogin = async () => {
        setCargando(true);
        const session = await AsyncStorage.getItem("session");
        if (session) {
            const aux = JSON.parse(session);
            setUsuario(aux);
            listarfotografias(aux.idusuario);
        } else {
            setCargando(false);
        }


    };

    const obtenerUbicacion = (): Promise<any> => {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                (pos) => resolve(pos.coords),
                (error) => reject(error),
                { enableHighAccuracy: true, timeout: 15000 }
            );
        });
    };
    const guardarfotografia = async () => {
        try {
            setLoading(true);
            const coords = await obtenerUbicacion();
            let datos = {
                foto: img["assets"][0]["base64"] || '',
                idtb_reporte: idevento,
                idtb_usuario: usuario.idusuario,
                tipofoto: tipoImg,
                latitud: coords.latitude,
                longitud: coords.longitude
            }


            const response = await fetch(urlapi + 'usuario/registrarfotografia', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }, body: JSON.stringify(datos)
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
                if (json.data.isregis) {
                    setTimeout(() => {
                        Toast.show({
                            description: json.data.mess,
                            bg: "emerald.500"
                        });
                    }, 500);
                    setImg(null);
                    setTipoImg("");
                    listarfotografias(usuario.idusuario);
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
        }
    }

    const descargarImagen = async (base64: any) => {
        try {
            const fileName = `foto_${Date.now()}.jpg`;

            // 📍 Ruta según plataforma
            const path =
                Platform.OS === 'android'
                    ? `${RNFS.DownloadDirectoryPath}/${fileName}`
                    : `${RNFS.DocumentDirectoryPath}/${fileName}`;

            // 🔐 Permiso Android
            /*if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                );
    
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Permiso denegado');
                    return;
                }
            }*/

            // 💾 Guardar archivo
            await RNFS.writeFile(path, base64, 'base64');
            await CameraRoll.save(`file://${path}`, {
  type: 'photo',
});
            setTimeout(() => {
                Toast.show({
                    description: "Imagen guardada en descargas.",
                    bg: "emerald.500"
                });
            }, 500);

            console.log('Imagen guardada en:', path);
        } catch (error) {
            console.error(error);
        }
    };

    const eliminarfotografia = async (auxidtb_foto: any) => {
        try {
            const response = await fetch(urlapi + 'usuario/eliminarfotografiaevento', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({
                    idtb_fotografia: auxidtb_foto
                })
            });

            if (!response.ok) {
                throw new Error("Error en la conexión con el servidor.");
            }

            const json = await response.json();

            if (json.error) {
                setTimeout(() => {
                    Toast.show({
                        description: "Error al cargar la información."
                    });
                }, 500);
            } else {
                if (json.data.isregis) {
                    setTimeout(() => {
                        Toast.show({
                            description: json.data.mess,
                            bg: "emerald.500"
                        });
                    }, 500);
                    setImg(null);
                    setTipoImg("");
                    listarfotografias(usuario.idusuario);
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
        } finally {
            setLoadingDeleteId(null);
        }
    }

    //Obtener los eventos del usuario logueado.
    const listarfotografias = async (auxid: any) => {
        try {
            const response = await fetch(urlapi + 'usuario/listarfotografiasevento', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({
                    idtb_reporte: idevento,
                    idtb_usuario: auxid
                })
            });

            if (!response.ok) {
                throw new Error("Error en la conexión con el servidor.");
            }

            const json = await response.json();
            setCargando(false);
            if (json.data == false) {
                setLoading(false);
                setTimeout(() => {
                    Toast.show({
                        description: "Sin fotografías registradas.",
                        bg: "emerald.500"
                    });
                }, 500);
            } else {
                setLoading(false);
                //Codigo para poner los eventos.

                setListadoImagenes(json.data);
            }

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };
    const Card = ({ tipofoto, infofoto, foto, idtb_foto }: { tipofoto: any, infofoto: any, foto: any, idtb_foto: any }) => {
        return (
            <Box>
                <HStack justifyContent={"space-around"}>
                    <HStack>
                        <VStack>
                            <Text>{tipofoto}</Text>
                            <Text>{new Date(infofoto).toLocaleString("es-EC", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit"
                            })}</Text>
                        </VStack>
                    </HStack>
                    <Divider orientation="vertical" mx="3" _light={{
                        bg: "muted.800"
                    }} _dark={{
                        bg: "muted.50"
                    }} />
                    <HStack space={2}>
                        <IconButton
                            icon={<Icon as={FontAwesome} name="download" />}
                            _icon={{ size: "md" }} onPress={() => {
                                descargarImagen(foto);
                                //setModalVisible(!modalVisible);
                                /*setAux({
                                    ...aux,
                                    foto: foto,
                                    idtb_fotografia: idtb_foto,
                                    tipoasistencia: tipofoto
                                });*/
                            }}
                        />
                        {loadingDeleteId !== idtb_foto ? (
                            <IconButton
                                icon={<Icon as={MaterialIcons} name="delete" />}
                                _icon={{ color: "red.500", size: "md" }}
                                onPress={() => {
                                    setLoadingDeleteId(idtb_foto);
                                    eliminarfotografia(idtb_foto);
                                }}
                            />
                        ) : (
                            <Spinner size="sm" />
                        )}

                    </HStack>
                </HStack>
                <Divider m={3}></Divider>

            </Box>


        )
    }
    return (
        <Box flex={1}>
            <Box flex={1} bg={"white"}>
                <Header navigation={navigation} />
                <Banner />
                <ScrollView flex={1} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }} m={3}>
                    <HStack py={5}>
                        <Center>
                            <Heading size={"sm"} textAlign={"center"}>Registrar fotográfico</Heading>
                        </Center>
                    </HStack>
                    <HStack justifyContent={"space-around"}>
                        <Select
                            textAlign={"center"}
                            minWidth="200"
                            w={"70%"}
                            placeholder="Tipo fotografía"
                            mt={1} selectedValue={tipoImg}
                            onValueChange={(value) => {
                                setTipoImg(value);
                            }}
                        >
                            <Select.Item label={"Entrada"} value={"1"} />
                            <Select.Item label={"Salida a almuerzo"} value={"2"} />
                            <Select.Item label={"Regreso de almuerzo"} value={"3"} />
                            <Select.Item label={"Salida final"} value={"4"} />
                            <Select.Item label={"Impulsos"} value={"5"} />
                        </Select>
                        <HStack space={2}>
                            <IconButton
                                icon={<Icon as={MaterialIcons} name="camera" />}
                                onPress={() => openCamera()}
                                _icon={{ color: "blue.400", size: "md" }}
                            />

                            <IconButton
                                icon={<Icon as={Octicons} name="file-directory" />}
                                onPress={() => openGallery()}
                                _icon={{ size: "md" }}
                            />
                            {!loading ?
                                <Box>
                                    {img == null ?
                                        <IconButton
                                            icon={<Icon as={Ionicons} name="save" />}
                                            onPress={() => console.log("eliminar")}
                                            _icon={{ color: "red.500", size: "md" }}
                                        /> : <IconButton
                                            icon={<Icon as={Ionicons} name="save" />}
                                            onPress={() => guardarfotografia()}
                                            _icon={{ color: "emerald.500", size: "md" }}
                                        />}</Box> : <HStack space={8} justifyContent="center" alignItems="center">
                                    <Spinner size="sm" />
                                </HStack>}
                        </HStack>

                    </HStack>
                    <HStack>
                        <Center flex={1}>
                            {img == null ?
                                <Box h="200">
                                    <Center flex={1} w="100%">
                                        <HStack alignItems="center">
                                            <Icon as={MaterialIcons} name="preview" size="md" mx={3} />
                                            <Heading size="xs" color="gray.400">
                                                Vista previa
                                            </Heading>
                                        </HStack>
                                    </Center>
                                </Box>
                                :
                                <Box p={"3"}>
                                    <Image
                                        size="2xl"
                                        resizeMode="cover"
                                        borderColor="red.700"
                                        source={{
                                            uri: `data:image/jpg;base64,${img["assets"][0]["base64"]}`
                                        }}
                                        alt="Sin Imagen"
                                    />
                                </Box>
                            }
                        </Center>
                    </HStack>
                    {cargando ?
                        <VStack>
                            <Center>
                                <Spinner accessibilityLabel="Loading posts" />
                                <Heading color="primary.500" fontSize="md">
                                    Cargando
                                </Heading>
                            </Center>
                        </VStack> :
                        <VStack >
                            <Text bold my={5}>Listado de fotografías ingresadas:</Text>
                            {listadoImagenes.map((element, index) => (
                                <Card key={index} tipofoto={element["tipoasistencia"]} foto={element["foto"]} infofoto={element["fecharegistro"]} idtb_foto={element["idtb_fotografia"]} />
                            ))}
                        </VStack>}

                </ScrollView>
                <Menuevento navigation={navigation} auxid={3} auxidevento={idevento} />
                <Footer />
            </Box>


            {//Modal para mostrar la imagen*/
            }
            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} >
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>{aux.tipoasistencia}</Modal.Header>
                    <Modal.Body>
                        <Box p={"3"}>
                            <Image
                                size="2xl"
                                resizeMode="cover"
                                borderColor="red.700"
                                source={{
                                    uri: `data:image/jpg;base64,${aux["foto"]}`
                                }}
                                alt="Sin Imagen"
                            />
                        </Box>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box >)
}

export default Fotografia;