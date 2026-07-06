import { Badge, Box, Button, FlatList, Flex, FormControl, Heading, HStack, Icon, IconButton, Image, Input, Modal, NativeBaseProvider, Pressable, Spacer, Text, Toast, VStack } from "native-base";
import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Banner from "./Bannerpantalla";
import SearchableSelect from "./SearchableSelect";
import Fontisto from "react-native-vector-icons/Fontisto";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { urlapi } from "./configuracion";
import { RefreshControl } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { inValidBreakpointProps } from "native-base/lib/typescript/theme/tools";
import { Line } from "react-native-svg";

function Menu({ navigation }: { navigation: any }) {
  const [empresaSelect, setEmpresaSelect] = React.useState<any>({});
  //Declaracion de funciones
  const [usuario, setUsuario] = React.useState({
    nombres: null,
    apellidos: null,
    token: null,
    ci: null,
    idusuario: null
  });
  const [reporte, setReporte] = React.useState<any>({
    idtb_empresa: null,
    idtb_lineaproducto: null,
    idtb_linea_producto: null,
    idtb_local: null,
    idtb_usuario: null,
  });
  const [datosform, setDatosform] = React.useState<any>({
    empresas:[],
    locales: []
  });
  const [loading, setLoading] = React.useState(false);
  const [lsteventos, setLsteventos] = React.useState([]);
  const [lstReportes, setLstReportes] = React.useState<any>([]);
  const [refreshing, setRefreshing] = React.useState(false); //Variable para controlar el refres de la pantalla.
  const [empresas, setEmpresas] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  useEffect(() => {
    verificarLogin();
    //listardatoscrearreporte();

  }, []);

  const leerRespuestaJson = async (response: Response) => {
    const respuestaTexto = await response.text();

    try {
      return JSON.parse(respuestaTexto);
    } catch (error) {
      console.log("Respuesta no JSON:", {
        status: response.status,
        url: response.url,
        respuesta: respuestaTexto.substring(0, 300),
      });
      throw new Error("El servidor no devolvio JSON.");
    }
  };

  //Funcion para el refresh de la pantalla
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      verificarLogin();
    });
  }, []);

  //Obtener los datos del usuario logueado.
  const verificarLogin = async () => {
    const session = await AsyncStorage.getItem("session");
    if (session) {
      const datos = JSON.parse(session);
      setUsuario(datos);
      reporte.idtb_usuario = datos.idusuario;
      //listareventos(datos.idusuario);
      listardatoscrearreporte();
      listareportes(datos.idusuario);

    }

  };
  //Funcion para registrar un nuevo reporte.
  const registrarreporte = async () => {
    try {
      const response = await fetch(urlapi + 'evento/registrarreporte', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }, body: JSON.stringify(reporte)
      });
      let respuesta = await response.json();
      if (respuesta.data) {
        Toast.show({
          description: "Reporte registrado correctamente."
        });
        setModalVisible(false);
        listareportes(usuario.idusuario);
      } else {
        Toast.show({
          description: "Error al registrar el reporte."
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        description: "Error en la conexión con el servidor."
      });
    }
  };

  //Funcion para obtener los datos necesarios para el formulario de registro de reportes.
  const listardatoscrearreporte = async () => {
    try {
      const response = await fetch(urlapi + 'evento/datosformevento', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      let respuesta = response.json();
      setDatosform({empresas: (await respuesta).data.listadoempresas, locales: (await respuesta).data.listadolocales });
      
    } catch (error) {
      console.log(error);
    }
  }

  //Obtener el listado de reportes del usuario logueado.
  const listareportes = async (auxidusuario: any) => {
    try {
      const response = await fetch(urlapi + 'evento/listarreportesxusuario', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }, body: JSON.stringify({
          idtb_usuario: auxidusuario
        })
      });
      const json = await leerRespuestaJson(response);

      if (!response.ok) {
        throw new Error(json.message || "Error al listar los reportes.");
      }

      setLstReportes(json.data);
    } catch (error) {
      console.log(error);
      Toast.show({
        description: "Error al listar los reportes."
      });
    }
  };


  //Componente para el formulario de registro de reportes.

  const Formularioregistro = ({ }) => {

    return (
      <Box>
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>Agregar reporte</Modal.Header>
            <Modal.Body>
              <FormControl>
                <FormControl.Label>Empresa</FormControl.Label>
                <SearchableSelect
                  value={reporte.idtb_empresa}
                  items={datosform.empresas || []}
                  labelKey="nombrecomercial"
                  valueKey="idtb_empresa"
                  placeholder="Seleccione empresa"
                  searchPlaceholder="Buscar empresa..."
                  onChange={(item) => {
                    setReporte((prevReporte: any) => ({
                      ...prevReporte,
                      idtb_empresa: item.idtb_empresa,
                      idtb_lineaproducto: null,
                      idtb_linea_producto: null,
                    }));
                    setEmpresaSelect(item);
                  }}
                />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>Linea producto</FormControl.Label>
                <SearchableSelect
                  value={reporte.idtb_lineaproducto}
                  items={empresaSelect.lineasproductos || []}
                  labelKey="nlineaproducto"
                  valueKey="idtb_linea_producto"
                  placeholder="Seleccione linea producto"
                  searchPlaceholder="Buscar linea producto..."
                  isDisabled={!reporte.idtb_empresa}
                  onChange={(item) => setReporte((prevReporte: any) => ({
                    ...prevReporte,
                    idtb_lineaproducto: item.idtb_linea_producto,
                    //idtb_linea_producto: item.idtb_linea_producto,
                  }))}
                />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>Local</FormControl.Label>
                <SearchableSelect
                  value={reporte.idtb_local}
                  items={datosform.locales || []}
                  labelKey="nombre"
                  valueKey="idtb_local"
                  placeholder="Seleccione local"
                  searchPlaceholder="Buscar local..."
                  onChange={(item) => setReporte((prevReporte: any) => ({ ...prevReporte, idtb_local: item.idtb_local }))}
                />
              </FormControl>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                  setModalVisible(false);
                }}>
                  Cancelar
                </Button>
                <Button onPress={() => {
                  registrarreporte();
                }}>
                  Guardar
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Box>
    );
  }
  //Componenete para mostrar los eventos.
  const Cardevento = ({ idtb_reporte, razonsocial, lineaproducto, nombrelocal, direccionlocal, logo, fechareporte }: { idtb_reporte: any, razonsocial: any, lineaproducto: any, nombrelocal: any, direccionlocal: any, logo: any , fechareporte: any}) => {
    const formatearFecha = (fecha: any) => {
      const soloFecha = String(fecha || "").split("T")[0].replace(".", "-");
      const [anio, mes, dia] = soloFecha.split("-");

      if (!anio || !mes || !dia) {
        return soloFecha;
      }

      return `${dia}-${mes}-${anio}`;
    };
    return (
      <Box w="100%" px="3" bg={"white"}>
        <Pressable
          onPress={() => navigation.navigate("Menuevento", {
            idevento: idtb_reporte
          })}
          rounded="8"
          overflow="hidden"
          borderWidth="1"
          borderColor="coolGray.300"
          w="100%"
          shadow="3"
          bg="coolGray.100"
          p="2"
        >
          <Box>
            <HStack>
              <Image size={"xl"} resizeMode="contain" borderColor={'red.700'} source={{
                uri: `data:image/jpg;base64,${logo}`
              }} alt={"Sin Logo de marca"} />
              <VStack flex={1}>
                <Heading size={"xs"} >{razonsocial}</Heading>
                <Heading size={"xs"} >{lineaproducto}</Heading>
                <HStack pt={1} alignItems="center">
                  <Icon as={<Fontisto name="shopping-store" />} size="sm" mr={2} />
                  <Text
                    fontSize="sm"
                    color="coolGray.600"
                    _dark={{ color: "warmGray.200" }}
                  >
                    {nombrelocal}
                  </Text>
                </HStack>
                <HStack pt={1} alignItems="center">
                  <Icon as={<Fontisto name="map-marker-alt" />} size="sm" mr={2} />
                  <Text
                    flex={1}
                    fontSize="sm"
                    color="coolGray.600"
                    _dark={{ color: "warmGray.200" }}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {direccionlocal}
                  </Text>
                </HStack>
                <HStack pt={1} alignItems="center">
                  <Icon as={<Fontisto name="date" />} size="sm" mr={2} />
                  <Text
                    flex={1}
                    fontSize="sm"
                    color="coolGray.600"
                    _dark={{ color: "warmGray.200" }}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {formatearFecha(fechareporte)}
                  </Text>
                </HStack>
              </VStack>

            </HStack>
          </Box>
        </Pressable>
      </Box >
    );
  }


  return (
    <Box flex={1}>
      <Header navigation={navigation} />
      <FlatList
        data={lstReportes}
        keyExtractor={(item: any, index: any) => String(item.idtb_evento || index)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <>
            <Banner />
            <HStack alignItems={"center"} justifyContent={"space-between"} ml={3} mr={3}>
              <Heading size={"md"} mt={5} mb={3} ml={3}>Reportes realizados</Heading>
              <IconButton icon={<Icon as={FontAwesome} name="plus-circle" size="md" color="gray.600" />} onPress={() => setModalVisible(true)} />
            </HStack>
          </>
        }
        renderItem={({ item }: { item: any }) => (
          <Cardevento idtb_reporte={item["idtb_reporte"]} razonsocial={item["nombrecomercial"]} lineaproducto={item["nlineaproducto"]} nombrelocal={item["nombrelocal"]} direccionlocal={item["direccion"]} logo={item["logomarca"]} fechareporte={item["fechareporte"]} />
        )}
      />
      <Formularioregistro />
      <Footer />
    </Box>
  );
}

export default Menu;
