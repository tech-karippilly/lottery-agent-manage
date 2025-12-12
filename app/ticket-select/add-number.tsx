import type { DigitOption } from "@/components/DigitSelector";
import DigitSelector from "@/components/DigitSelector";
import { STRINGS } from "@/constants/strings";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SAVE_BUTTON_COLOR = "#007AFF";

export default function AddNumberScreen() {
  const router = useRouter();
  const { ticketName, backgroundColor, ticketId } = useLocalSearchParams<{
    ticketName: string;
    backgroundColor: string;
    ticketId: string;
  }>();

  const [number, setNumber] = useState("");
  const [selectedDigit, setSelectedDigit] = useState<DigitOption>(3);
  const [showDigitSelector, setShowDigitSelector] = useState(false);

  const handleSave = () => {
    if (!number.trim()) {
      Alert.alert("Error", "Please enter a number");
      return;
    }
    // TODO: Handle number submission to Firestore
    Alert.alert("Success", `Number ${number} added to ${ticketName}`, [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const handleDigitSelect = (digit: DigitOption) => {
    setSelectedDigit(digit);
    setShowDigitSelector(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="light" backgroundColor={SAVE_BUTTON_COLOR} />
      
      {/* Custom Header */}
      <View style={[styles.customHeader, { backgroundColor: SAVE_BUTTON_COLOR }]}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={!number.trim()}
        >
          <Text
            style={[
              styles.saveButtonText,
              !number.trim() && styles.saveButtonTextDisabled,
            ]}
          >
            {STRINGS.ADD_NUMBER.ADD}
          </Text>
        </TouchableOpacity>

        <View style={styles.centerHeader}>
          <Text style={styles.ticketLabelHeader} numberOfLines={1}>
            {ticketName}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.digitSelectorButton}
          onPress={() => setShowDigitSelector(true)}
        >
          <Text style={styles.digitSelectorButtonText}>
            {selectedDigit} Digit
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
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
      </View>

      {/* Digit Selector Modal */}
      <Modal
        visible={showDigitSelector}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDigitSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Digit</Text>
              <TouchableOpacity
                onPress={() => setShowDigitSelector(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <DigitSelector
              selectedValue={selectedDigit}
              onSelect={handleDigitSelect}
              showAll={false}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 60,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButtonTextDisabled: {
    opacity: 0.5,
  },
  centerHeader: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  ticketLabelHeader: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  digitSelectorButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 60,
    alignItems: "flex-end",
  },
  digitSelectorButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 20,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
  },
});
