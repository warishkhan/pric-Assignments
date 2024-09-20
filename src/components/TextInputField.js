// components/TextInputField.js
import React from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import EyesClose from './eyeClose';
import EyesOpen from './eyesOpen';

const TextInputField = ({
  placeholder,
  value,
  onChangeText,
  isPassword,
  onTogglePassword,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      }}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPassword}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: '#fff',
          fontSize: 16,
          borderRadius: 8,
          paddingLeft: 16,
        }}
        placeholderTextColor="lightgrey"
      />
      {isPassword !== undefined && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 16,
          }}
          onPress={onTogglePassword}>
          {isPassword ? <EyesClose /> : <EyesOpen />}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TextInputField;
