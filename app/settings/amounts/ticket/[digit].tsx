import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { STRINGS } from "@/constants/strings";
import { TicketAmount, TicketAmountInput } from "@/src/types/amounts";
import { getTicketAmountByDigit, saveTicketAmount } from "@/services/amountsService";

export default function TicketAmountDetailScreen() {
  const { digit } = useLocalSearchParams<{ digit: string }>();
  const router = useRouter();
  const digitNum = parseInt(digit || "3", 10) as 3 | 2 | 1;

  const [amount, setAmount] = useState<TicketAmount | null>(null);
  const [dcAmount, setDcAmount] = useState("");
  const [regularAmount, setRegularAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAmount();
  }, [digit]);

  const loadAmount = async () => {
    try {
      const data = await getTicketAmountByDigit(digitNum);
      setAmount(data);
      setDcAmount(data?.dcAmount.toString() || "");
      setRegularAmount(data?.amount.toString() || "");
    } catch (error) {
      Alert.alert("Error", "Failed to load amount");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const dc = parseFloat(dcAmount);
    const amt = parseFloat(regularAmount);
    if (isNaN(dc) || isNaN(amt)) {
      Alert.alert("Error", "Please enter valid numbers");
      return;
    }

    setSaving(true);
    try {
      const input: TicketAmountInput = {
        digit: digitNum,
        dcAmount: dc,
        amount: amt,
      };
      await saveTicketAmount(input);
      Alert.alert("Success", "Amount saved successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to save amount");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.centerContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {STRINGS.AMOUNTS_SETTINGS.TICKET_AMOUNTS} - {STRINGS.AMOUNTS_SETTINGS.DIGIT} {digitNum}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{STRINGS.AMOUNTS_SETTINGS.DC_AMOUNT}</Text>
          <TextInput
            style={styles.input}
            value={dcAmount}
            onChangeText={setDcAmount}
            placeholder="Enter DC amount"
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{STRINGS.AMOUNTS_SETTINGS.AMOUNT}</Text>
          <TextInput
            style={styles.input}
            value={regularAmount}
            onChangeText={setRegularAmount}
            placeholder="Enter amount"
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Saving..." : STRINGS.AMOUNTS_SETTINGS.SAVE}
          </Text>
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
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
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

