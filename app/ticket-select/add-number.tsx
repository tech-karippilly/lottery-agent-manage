import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { STRINGS } from "@/constants/strings";

export default function AddNumberScreen() {
  const router = useRouter();
  const { ticketName, backgroundColor, ticketId } = useLocalSearchParams<{
    ticketName: string;
    backgroundColor: string;
    ticketId: string;
  }>();

  const [number, setNumber] = useState("");

  const handleAddNumber = () => {
    if (!number.trim()) {
      Alert.alert("Error", "Please enter a number");
      return;
    }
    // TODO: Handle number submission to Firestore
    Alert.alert("Success", `Number ${number} added to ${ticketName}`, [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>{STRINGS.ADD_NUMBER.TITLE}</Text>
      </View>

      <View style={styles.content}>
        {/* Ticket Display */}
        <View style={styles.ticketContainer}>
          <Text style={styles.ticketLabel}>{STRINGS.ADD_NUMBER.TICKET}</Text>
          <View
            style={[
              styles.ticketBadge,
              { backgroundColor: backgroundColor || "#007AFF" },
            ]}
          >
            <Text style={styles.ticketBadgeText}>{ticketName}</Text>
          </View>
        </View>

        {/* Number Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{STRINGS.ADD_NUMBER.NUMBER}</Text>
          <TextInput
            style={styles.input}
            value={number}
            onChangeText={setNumber}
            placeholder={STRINGS.ADD_NUMBER.ENTER_NUMBER}
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        {/* Add Button */}
        <TouchableOpacity
          style={[
            styles.addButton,
            !number.trim() && styles.addButtonDisabled,
          ]}
          onPress={handleAddNumber}
          disabled={!number.trim()}
        >
          <Text style={styles.addButtonText}>{STRINGS.ADD_NUMBER.ADD}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  ticketContainer: {
    marginBottom: 32,
  },
  ticketLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  ticketBadge: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  ticketBadgeText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  addButtonDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

