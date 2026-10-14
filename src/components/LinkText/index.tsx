import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface LinkTextProps {
  label: string;
  linkLabel: string;
  onPress: () => void;
}

export const LinkText: React.FC<LinkTextProps> = ({
  label,
  linkLabel,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>
        {label} <Text style={styles.highlight}>{linkLabel}</Text>
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    color: '#666',
  },
  highlight: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default LinkText;
