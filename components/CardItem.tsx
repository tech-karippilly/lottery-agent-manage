import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CardItemProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  backgroundColor?: string;
    size?: number;
    color?: string;
    style?: object;
}

export default function CardItem({
  title,
  icon,
  onPress,
  size=22,
  color= "#fff",
  backgroundColor = "#FF2B54",
  style,
}: CardItemProps) {
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor }, style]} onPress={onPress}>
      <Text style={styles.cardText}>{title}</Text>
      <Ionicons name={icon} size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    elevation: 2,
  },
  cardText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});
