import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import { TicketInput } from "@/src/types/ticket";
import { STRINGS } from "@/constants/strings";

interface TicketFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (ticket: TicketInput) => Promise<void>;
  initialData?: TicketInput | null;
}

export default function TicketForm({
  visible,
  onClose,
  onSubmit,
  initialData,
}: TicketFormProps) {
  const [ticketName, setTicketName] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTicketName(initialData.ticketName);
      setTimeSlot(initialData.timeSlot.toString());
    } else {
      setTicketName("");
      setTimeSlot("");
    }
  }, [initialData, visible]);

  const handleSubmit = async () => {
    if (!ticketName.trim()) {
      Alert.alert("Error", "Please enter a ticket name");
      return;
    }

    const timeSlotNum = parseInt(timeSlot, 10);
    if (isNaN(timeSlotNum) || timeSlotNum < 0 || timeSlotNum > 23) {
      Alert.alert("Error", "Please enter a valid time slot (0-23)");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ticketName: ticketName.trim(),
        timeSlot: timeSlotNum,
      });
      setTicketName("");
      setTimeSlot("");
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to save ticket");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTicketName("");
    setTimeSlot("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {initialData ? STRINGS.TICKET_SETTINGS.EDIT_TICKET : STRINGS.TICKET_SETTINGS.ADD_TICKET}
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{STRINGS.TICKET_SETTINGS.TICKET_NAME}</Text>
            <TextInput
              style={styles.input}
              value={ticketName}
              onChangeText={setTicketName}
              placeholder="Enter ticket name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{STRINGS.TICKET_SETTINGS.TIME_SLOT}</Text>
            <TextInput
              style={styles.input}
              value={timeSlot}
              onChangeText={setTimeSlot}
              placeholder="Enter time slot (0-23)"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
            <Text style={styles.hint}>24-hour format (e.g., 8 for 8 PM, 15 for 3 PM)</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>{STRINGS.TICKET_SETTINGS.CANCEL}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? "Saving..." : STRINGS.TICKET_SETTINGS.SAVE}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#000",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
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
  hint: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  cancelButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

