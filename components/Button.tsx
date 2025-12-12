import { router, Href } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type ButtonProps = {
  buttonText: string;
  link: Href;
};

export const Button = ({ buttonText, link }: ButtonProps) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => router.push(link)}  // ✅ Navigate correctly
    >
      <Text style={styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FF0000",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
