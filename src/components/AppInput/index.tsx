import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

export const AppInput: React.FC<TextInputProps> = ({ style, ...props }) => {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor="#999"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 12,
    fontSize: 16,
  },
});

export default AppInput;
