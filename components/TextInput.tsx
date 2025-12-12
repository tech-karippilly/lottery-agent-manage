import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  type TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = TextInputProps & {
  isPassword?: boolean;
};

export const CustomTextInput = ({ isPassword, style, ...props }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <TextInput
        {...props}
        secureTextEntry={isPassword && !showPassword}
        style={[styles.input, style]}
        placeholderTextColor="#888"
      />

      {isPassword && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={22}
            color="#888"
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#A0A0A0",
    marginBottom: 30,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingVertical: 0,
  },
  icon: {
    paddingHorizontal: 10,
  },
});
