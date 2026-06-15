import React from "react";
import { FlatList } from "react-native";
import { Box, CheckIcon, HStack, Input, Modal, Pressable, Text } from "native-base";
import FontAwesome from "react-native-vector-icons/FontAwesome";

type SearchableSelectProps = {
  value: any;
  items: any[];
  labelKey: string;
  valueKey: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  isDisabled?: boolean;
  onChange: (item: any) => void;
};

function SearchableSelect({
  value,
  items,
  labelKey,
  valueKey,
  placeholder = "Seleccione una opcion",
  searchPlaceholder = "Buscar...",
  emptyText = "Sin resultados",
  isDisabled = false,
  onChange,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const selectedItem = React.useMemo(
    () => items.find((item: any) => String(item[valueKey]) === String(value)),
    [items, value, valueKey],
  );

  const normalizeText = (text: any) =>
    String(text || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filteredItems = React.useMemo(() => {
    const term = normalizeText(search);

    if (!term) {
      return items;
    }

    return items.filter((item: any) => normalizeText(item[labelKey]).includes(term));
  }, [items, labelKey, search]);

  const closeModal = () => {
    setIsOpen(false);
    setSearch("");
  };

  const selectItem = (item: any) => {
    onChange(item);
    closeModal();
  };

  return (
    <>
      <Pressable isDisabled={isDisabled} onPress={() => setIsOpen(true)}>
        <Box
          borderWidth="1"
          borderColor={isDisabled ? "coolGray.200" : "coolGray.300"}
          bg={isDisabled ? "coolGray.100" : "white"}
          rounded="4"
          minH="10"
          px="3"
          py="2"
          justifyContent="center"
        >
          <HStack alignItems="center" justifyContent="space-between" space={2}>
            <Text
              flex={1}
              color={selectedItem ? "coolGray.800" : "coolGray.400"}
              numberOfLines={1}
            >
              {selectedItem ? selectedItem[labelKey] : placeholder}
            </Text>
            <FontAwesome name="chevron-down" size={14} color={isDisabled ? "#CBD5E0" : "#718096"} />
          </HStack>
        </Box>
      </Pressable>

      <Modal isOpen={isOpen} onClose={closeModal} avoidKeyboard justifyContent="center">
        <Modal.Content maxH="70%" my="auto">
          <Modal.CloseButton />
          <Modal.Header>{placeholder}</Modal.Header>
          <Modal.Body>
            <Input value={search} onChangeText={setSearch} placeholder={searchPlaceholder} mb="3" />
            <Box h="320">
              <FlatList
                data={filteredItems}
                keyExtractor={(item: any) => String(item[valueKey])}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator
                nestedScrollEnabled
                ListEmptyComponent={
                  <Text color="coolGray.500" textAlign="center" py="4">
                    {emptyText}
                  </Text>
                }
                renderItem={({ item }: { item: any }) => {
                  const isSelected = String(item[valueKey]) === String(value);

                  return (
                    <Pressable
                      onPress={() => selectItem(item)}
                      borderBottomWidth="1"
                      borderColor="coolGray.100"
                    >
                      <HStack alignItems="center" justifyContent="space-between" py="3">
                        <Text flex={1} color="coolGray.800">
                          {item[labelKey]}
                        </Text>
                        {isSelected ? <CheckIcon size="5" color="teal.600" /> : null}
                      </HStack>
                    </Pressable>
                  );
                }}
              />
            </Box>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
}

export default SearchableSelect;
