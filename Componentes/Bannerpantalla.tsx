import { Heading, HStack, Image, NativeBaseProvider, Text, VStack } from "native-base";
import React from "react";

function Banner() {
    return (
            <HStack bg={"white"}
                px="1"
                alignItems="center"
                w="100%"
                space={3}
            >
                {/* Imagen */}
                <Image
                    w="130"
                    h="20"
                    source={require('../Images/logomercaplan.jpeg')}
                    alt="Logo Mercaplan"
                    resizeMode="contain"
                />

                {/* Texto */}
                <VStack flex={1}>
                    <Heading size="sm" flexWrap="wrap">
                        Bienvenido/a a Mercaplan
                    </Heading>
                    <Text flexWrap="wrap">
                        Estos son tus eventos asignados
                    </Text>
                </VStack>
            </HStack>
    )
}

export default Banner;