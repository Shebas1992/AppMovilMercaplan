import * as React from "react";
import { Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center, NativeBaseProvider, Image, ScrollView, Icon, Spinner, Toast } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { RefreshControl } from "react-native-gesture-handler";
import { Pressable } from "react-native";
import { urlapi } from "./configuracion";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Footer from "./Footer";
import Menuevento from "./Menuevento";
import Banner from "./Bannerpantalla";
import Header from "./Header";


function Promocionales({ navigation }: { navigation: any }) {
    return (
        <Box flex={1} bg={"white"}>
            <Header navigation={navigation} />
            <Banner />
            <Box flex={1}>
                <Heading color="primary.500" textAlign={"center"} fontSize="md">
                    Sección de Promocionales
                </Heading>
            </Box>
            <Menuevento navigation={navigation} auxid={5} auxidevento={0} />
            <Footer />
        </Box>
    )
}
export default Promocionales;