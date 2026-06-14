import { Badge, Box, Button, CheckIcon, Flex, FormControl, Heading, HStack, Icon, IconButton, Image, Input, Modal, NativeBaseProvider, Pressable, ScrollView, Select, Spacer, Text, Toast, VStack } from "native-base";
import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Banner from "./Bannerpantalla";
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
    idtb_empresa: '',
    idtb_lineaproducto: '',
    idtb_local: null,
    idtb_usuario: null,
  });
  const [datosform, setDatosform] = React.useState<any>({
    empresas:[],
    locales: []
  });
  const [loading, setLoading] = React.useState(false);
  const [lsteventos, setLsteventos] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false); //Variable para controlar el refres de la pantalla.
  const [empresas, setEmpresas] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  useEffect(() => {
    verificarLogin();
    //listardatoscrearreporte();

  }, []);

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

    }

  };

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
      console.log(datosform.empresas);

    } catch (error) {
      console.log(error);
    }
  }
  //Obtener los eventos del usuario logueado.
  const listareventos = async (auxidusuario: any) => {
    try {
      const response = await fetch(urlapi + 'evento/listareventosusuario', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }, body: JSON.stringify({
          idtb_usuario: auxidusuario
        })
      });

      if (!response.ok) {
        throw new Error("Error en la conexión con el servidor.");
      }

      const json = await response.json();

      if (json.data == false) {
        setLoading(false);
        setTimeout(() => {
          Toast.show({
            description: "Sin eventos asignados."
          });
        }, 500);
      } else {
        setLoading(false);
        //Codigo para poner los eventos.
        setLsteventos(json.data);
      }

    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

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
                <Select selectedValue={reporte.idtb_empresa} minWidth="200" accessibilityLabel="Choose Service" placeholder="Choose Service" _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5"/>
                }} mt={1} onValueChange={itemValue => {setReporte({ ...reporte, idtb_empresa: itemValue }); 
                setEmpresaSelect(datosform.empresas.find((e: any) => e.idtb_empresa === itemValue)); console.log(empresaSelect);  } }>
                  {datosform.empresas.map((element:any, index:any) => (
                    <Select.Item key={index} label={element["nombrecomercial"]} value={element["idtb_empresa"]} />
                  ))}
                </Select>
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>Linea producto</FormControl.Label>
                  <Select selectedValue={reporte.idtb_lineaproducto} minWidth="200" accessibilityLabel="Choose Service" placeholder="Choose Service" _selectedItem={{
                  }} mt={1} onValueChange={itemValue => setReporte({ ...reporte, idtb_lineaproducto: itemValue })}>
                  {(empresaSelect.lineasproductos || []).map((element: any, index: any) => (
                    <Select.Item key={index} label={element["nlineaproducto"]} value={element["idtb_lineaproducto"]} />
                  ))}
                </Select>

              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>Local</FormControl.Label>
                  <Select selectedValue={reporte.idtb_local} minWidth="200" accessibilityLabel="Choose Service" placeholder="Choose Service" _selectedItem={{
                  }} mt={1} onValueChange={itemValue => setReporte({ ...reporte, idtb_local: itemValue })}>
                  {(datosform.locales||[]).map((element: any, index: any) => (
                    <Select.Item key={index} label={element["nombre"]} value={element["idtb_local"]} />
                  ))}
                </Select>
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
                  setModalVisible(false);
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
  const Cardevento = ({ idevento, razonsocial, lineaproducto, nombrelocal, direccionlocal, fechainicio, fechafin, horainicio, horafin, estado, logo }: { idevento: any, razonsocial: any, lineaproducto: any, nombrelocal: any, direccionlocal: any, fechainicio: any, fechafin: any, horainicio: any, horafin: any, estado: any, logo: any }) => {
    const formatearFecha = (fecha: string) => {
      const [anio, mes, dia] = fecha.split("T")[0].split("-");
      return `${dia}-${mes}-${anio}`;
    };
    return (
      <Box w="100%" px="3" bg={"white"}>
        <Pressable
          onPress={() => navigation.navigate("Menuevento", {
            idevento: idevento
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
            <HStack justifyContent={"flex-end"}>
              <Badge
                colorScheme="darkBlue"
                _text={{ color: "white" }}
                variant="solid"
                rounded="4"
              >
                {estado}
              </Badge>

            </HStack>
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
                  <Icon as={<FontAwesome6 name="map-location-dot" />} size="sm" mr={2} />
                  <Text
                    fontSize="sm"
                    color="coolGray.600"
                    _dark={{ color: "warmGray.200" }}
                  >
                    {direccionlocal}
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
      <ScrollView flex={1} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <Banner />
        <HStack alignItems={"center"} justifyContent={"space-between"} ml={3} mr={3}>
          <Heading size={"md"} mt={5} mb={3} ml={3}>Reportes realizados</Heading>
          <IconButton icon={<Icon as={FontAwesome} name="plus-circle" size="md" color="gray.600" />} onPress={() => setModalVisible(true)} />
        </HStack>

        {lsteventos.map((element, index) => (
          <Cardevento key={index} idevento={element["idtb_evento"]} razonsocial={element["nombrecomercial"]} lineaproducto={element["nlineaproducto"]} nombrelocal={element["nombre"]} direccionlocal={element["direccion"]} fechainicio={element["fechainicio"]} fechafin={element["fechafin"]} horainicio={element["horainicio"]} horafin={element["horafin"]} estado={element["estado"]} logo={element["logomarca"]} />
        ))}
        
      </ScrollView>
      <Formularioregistro />
      <Footer />
    </Box>
  );
}

export default Menu;
