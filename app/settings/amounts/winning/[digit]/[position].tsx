import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { STRINGS } from "@/constants/strings";
import { WinningAmount, WinningAmountInput } from "@/src/types/amounts";
import { getWinningAmountsByDigit, saveWinningAmount } from "@/services/amountsService";

export default function WinningAmountDetailScreen() {
  const { digit, position, label } = useLocalSearchParams<{
    digit: string;
    position: string;
    label?: string;
  }>();
  const router = useRouter();
  const digitNum = parseInt(digit || "1", 10) as 3 | 2 | 1;
  const positionNum = parseInt(position || "1", 10) as 1 | 2 | 3 | 4 | 5 | 6;
  const labelValue = label as "super" | "box" | undefined;

  const [amount, setAmount] = useState<WinningAmount | null>(null);
  const [dcAmount, setDcAmount] = useState("");
  const [regularAmount, setRegularAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAmount();
  }, [digit, position, label]);

  const loadAmount = async () => {
    try {
      const amounts = await getWinningAmountsByDigit(digitNum);
      const found = amounts.find((a) => {
        const matchesPosition = a.position === positionNum;
        // For digit 3, match the label; for digits 1 and 2, label should be null/undefined
        let matchesLabel = false;
        if (digitNum === 3) {
          matchesLabel = a.label === labelValue;
        } else {
          // For digits 1 and 2, label should be null or undefined
          matchesLabel = (a.label === null || a.label === undefined);
        }
        return matchesPosition && matchesLabel;
      });
      setAmount(found || null);
      setDcAmount(found?.dcAmount.toString() || "");
      setRegularAmount(found?.amount.toString() || "");
    } catch (error) {
      console.error("Error loading amount:", error);
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

    // Validate: For digit 3, label must be provided
    if (digitNum === 3 && !labelValue) {
      Alert.alert("Error", "Label (super or box) is required for digit 3");
      return;
    }

    setSaving(true);
    try {
      const input: WinningAmountInput = {
        digit: digitNum,
        position: positionNum,
        // For digit 3, always include label; for digits 1 and 2, it should be undefined
        label: digitNum === 3 ? labelValue : undefined,
        dcAmount: dc,
        amount: amt,
      };
      await saveWinningAmount(input);
      Alert.alert("Success", "Amount saved successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to save amount");
    } finally {
      setSaving(false);
    }
  };

  const getTitle = () => {
    let title = `${STRINGS.AMOUNTS_SETTINGS.WINNING_AMOUNTS} - ${STRINGS.AMOUNTS_SETTINGS.DIGIT} ${digitNum}`;
    if (digitNum === 3 && labelValue) {
      title += ` - ${labelValue.toUpperCase()}`;
    }
    title += ` - ${STRINGS.AMOUNTS_SETTINGS.POSITION} ${positionNum}`;
    return title;
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
        <Text style={styles.title}>{getTitle()}</Text>
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

