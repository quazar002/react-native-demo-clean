import React, { useState } from 'react';
import {
  Modal,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';

const CustomDropdown = ({ selectedValue, onValueChange, items, placeholder }) => {
  const [visible, setVisible] = useState(false);

  const handleSelect = (value) => {
    onValueChange(value);
    setVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={dropdownStyles.dropdown}
        onPress={() => setVisible(true)}
      >
        <Text style={dropdownStyles.dropdownText}>
          {selectedValue ? selectedValue : placeholder || 'Select an option'}
        </Text>
      </TouchableOpacity>
      <Modal transparent visible={visible} animationType="fade">
        <TouchableOpacity
          style={dropdownStyles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setVisible(false)}
        >
          <View style={dropdownStyles.modalContent}>
            <ScrollView>
              {items.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={dropdownStyles.item}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text style={dropdownStyles.itemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const dropdownStyles = StyleSheet.create({
  dropdown: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 4,
  },
  dropdownText: {
    color: '#333',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 300,
    paddingVertical: 10,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  itemText: {
    fontSize: 14,
    color: '#333',
  },
});

export default CustomDropdown;
