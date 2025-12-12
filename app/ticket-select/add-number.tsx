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
  const [count, setCount] = useState("");
  const [box, setBox] = useState("");
  const [selectedDigit, setSelectedDigit] = useState<DigitOption>(3);
  const [showDigitSelector, setShowDigitSelector] = useState(false);

  const handleSave = () => {
    if (!number.trim()) {
      Alert.alert("Error", "Please enter a number");
      return;
    }
    if (!count.trim()) {
      Alert.alert("Error", "Please enter a count");
      return;
    }
    if (selectedDigit === 3 && !box.trim()) {
      Alert.alert("Error", "Please enter a box value");
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
    // Reset inputs when digit changes
    setNumber("");
    setCount("");
    setBox("");
  };

  const handleButtonPress = (buttonType: string) => {
    // TODO: Handle button press logic
    console.log("Button pressed:", buttonType);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="light" backgroundColor={SAVE_BUTTON_COLOR} />
      
      {/* Custom Header */}
      <View style={[styles.customHeader, { backgroundColor: SAVE_BUTTON_COLOR }]}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={!number.trim() || !count.trim() || (selectedDigit === 3 && !box.trim())}
        >
          <Text
            style={[
              styles.saveButtonText,
              (!number.trim() || !count.trim() || (selectedDigit === 3 && !box.trim())) && styles.saveButtonTextDisabled,
            ]}
          >
            {STRINGS.TICKET_SETTINGS.SAVE}
          </Text>
        </TouchableOpacity>

        <View style={styles.centerHeader}>
          <View style={styles.ticketLabelCircle}>
            <Text style={styles.ticketLabelHeader} numberOfLines={1}>
              {ticketName}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.digitSelectorButton}
          onPress={() => setShowDigitSelector(true)}
        >
          <View style={styles.digitCircle}>
            <Text style={styles.digitSelectorButtonText}>
              {selectedDigit}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Digit-based Input Component */}
      <View style={[styles.digitInputContainer, { backgroundColor: backgroundColor || "#f5f5f5" }]}>
        {selectedDigit === 3 && (
          <View style={styles.inputsRow}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabelSmall}>Number</Text>
              <TextInput
                style={styles.inputSmall}
                value={number}
                onChangeText={(text) => setNumber(text.slice(0, 3))}
                placeholder="000"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabelSmall}>Count</Text>
              <TextInput
                style={styles.inputSmall}
                value={count}
                onChangeText={(text) => setCount(text.slice(0, 2))}
                placeholder="00"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabelSmall}>Box</Text>
              <TextInput
                style={styles.inputSmall}
                value={box}
                onChangeText={(text) => setBox(text.slice(0, 2))}
                placeholder="00"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
          </View>
        )}

        {selectedDigit === 2 && (
          <View style={styles.inputsRow}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabelSmall}>Number</Text>
              <TextInput
                style={styles.inputSmall}
                value={number}
                onChangeText={(text) => setNumber(text.slice(0, 2))}
                placeholder="00"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabelSmall}>Count</Text>
              <TextInput
                style={styles.inputSmall}
                value={count}
                onChangeText={(text) => setCount(text.slice(0, 2))}
                placeholder="00"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
          </View>
        )}

        {selectedDigit === 1 && (
          <View style={styles.inputsRow}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabelSmall}>Number</Text>
              <TextInput
                style={styles.inputSmall}
                value={number}
                onChangeText={(text) => setNumber(text.slice(0, 1))}
                placeholder="0"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={1}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabelSmall}>Count</Text>
              <TextInput
                style={styles.inputSmall}
                value={count}
                onChangeText={(text) => setCount(text.slice(0, 2))}
                placeholder="00"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
          </View>
        )}

        {/* Buttons Section */}
        <View style={styles.buttonsContainer}>
          {selectedDigit === 3 && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#FF3B30" }]}
                onPress={() => handleButtonPress("super")}
              >
                <Text style={styles.actionButtonText}>Super</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#34C759" }]}
                onPress={() => handleButtonPress("box")}
              >
                <Text style={styles.actionButtonText}>Box</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#FF9500" }]}
                onPress={() => handleButtonPress("all")}
              >
                <Text style={styles.actionButtonText}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#5856D6" }]}
                onPress={() => handleButtonPress("add")}
              >
                <Text style={styles.actionButtonText}>Add</Text>
              </TouchableOpacity>
            </>
          )}

          {selectedDigit === 2 && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#FF3B30" }]}
                onPress={() => handleButtonPress("AB")}
              >
                <Text style={styles.actionButtonText}>AB</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#34C759" }]}
                onPress={() => handleButtonPress("BC")}
              >
                <Text style={styles.actionButtonText}>BC</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#FF9500" }]}
                onPress={() => handleButtonPress("AC")}
              >
                <Text style={styles.actionButtonText}>AC</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#AF52DE" }]}
                onPress={() => handleButtonPress("all")}
              >
                <Text style={styles.actionButtonText}>All</Text>
              </TouchableOpacity>
            </>
          )}

          {selectedDigit === 1 && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#FF3B30" }]}
                onPress={() => handleButtonPress("A")}
              >
                <Text style={styles.actionButtonText}>A</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#34C759" }]}
                onPress={() => handleButtonPress("B")}
              >
                <Text style={styles.actionButtonText}>B</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#FF9500" }]}
                onPress={() => handleButtonPress("C")}
              >
                <Text style={styles.actionButtonText}>C</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#AF52DE" }]}
                onPress={() => handleButtonPress("all")}
              >
                <Text style={styles.actionButtonText}>All</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View style={styles.content}>
        {/* Additional content can go here */}
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
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 8,
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
  ticketLabelCircle: {
    minWidth: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    maxWidth: 200,
  },
  ticketLabelHeader: {
    color: SAVE_BUTTON_COLOR,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  digitSelectorButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 60,
    alignItems: "flex-end",
  },
  digitCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  digitSelectorButtonText: {
    color: SAVE_BUTTON_COLOR,
    fontSize: 16,
    fontWeight: "600",
  },
  digitInputContainer: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  inputsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabelSmall: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  inputSmall: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: "#000",
    backgroundColor: "#fff",
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    minWidth: 70,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 20,
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
