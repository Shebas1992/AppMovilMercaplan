import React from "react";
import { VStack, HStack, Button, IconButton, Icon, Text, NativeBaseProvider, Center, Box, StatusBar } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

function Footer() {
    return (
            <Box position={"absolute"} bottom={0} w={"100%"}>
                <StatusBar backgroundColor="#797979" barStyle="light-content" />
                
                <HStack bg="gray.600" px="1" py="3" justifyContent="space-around" alignItems="center" w="100%" maxW="100%">
                    <HStack alignItems="center">
                        <Icon as={FontAwesome6} name="copyright" size="xs" color="white" mr={2} />
                        <Text color="white" fontSize={"2xs"}>
                            Mercaplan
                        </Text>
                    </HStack>
                    <HStack>
                        <VStack justifyContent={"center"} mr={"2"}>
                            <Text fontSize="2xs" color={"white"}>Desarrollado: Sebastian Bahamonde</Text>
                        </VStack>
                    </HStack>
                </HStack>
            </Box>
    );
}

export default Footer;