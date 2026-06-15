import React from 'react';
import { NativeBaseProvider, Box, Text, Heading, VStack, FormControl, Input, Link, Button, Icon, HStack, Center, Pressable } from 'native-base';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesing from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

function Menuevento({ navigation, auxid, auxidevento }: { navigation: any, auxid: any, auxidevento:any }) {
    const [selected, setSelected] = React.useState(0);
    React.useEffect(() => {
        setSelected(auxid);
        
    }, []);
    const ira = (auxid: any) => {
        switch (auxid) {
            case 1:
                navigation.navigate("Menuevento",{
                    idevento: auxidevento
                });
                break;

            case 2:
                navigation.navigate("Asistenciaevento",{
                    idevento: auxidevento
                });
                break;

            case 3:
                navigation.navigate("Fotografiasevento",{
                    idevento: auxidevento
                });
                break;

            case 4:
                navigation.navigate("Productosevento",{
                    idevento: auxidevento
                });
                break;
        }
    }
    return (
        <Box bg="white" safeAreaTop alignSelf="center" w={"100%"}>
            <HStack bg="gray.600" alignItems="center" safeAreaBottom shadow={6}>
                <Pressable opacity={selected === 1 ? 1 : 0.5} py="3" flex={1} onPress={() => ira(1)}>
                    <Center>
                        <Icon mb="1" as={<MaterialIcons
                         name='home' />} color="white" size="sm" />
                        <Text color="white" fontSize="12">
                            Inicio
                        </Text>
                    </Center>
                </Pressable>
                <Pressable opacity={selected === 2 ? 1 : 0.5} py="3" flex={1} onPress={() => ira(2)}>
                    <Center>
                        <Icon mb="1" as={<MaterialIcons name='calendar-today' />} color="white" size="sm" />
                        <Text color="white" fontSize="12">
                            Asistencia
                        </Text>
                    </Center>
                </Pressable>
                <Pressable opacity={selected === 3 ? 1 : 0.5} py="2" flex={1} onPress={() => ira(3)}>
                    <Center>
                        <Icon mb="1" as={<MaterialIcons name="camera" />} color="white" size="sm" />
                        <Text color="white" fontSize="12">
                            Fotografías
                        </Text>
                    </Center>
                </Pressable>
                <Pressable opacity={selected === 4 ? 1 : 0.6} py="2" flex={1} onPress={() => ira(4)}>
                    <Center>
                        <Icon mb="1" as={<MaterialIcons name={selected === 2 ? 'all-inbox' : 'all-inbox'} />} color="white" size="sm" />
                        <Text color="white" fontSize="12">
                            Productos
                        </Text>
                    </Center>
                </Pressable>
            </HStack>
        </Box>
    )
}

export default Menuevento;