import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { STRINGS } from "@/constants/strings";
import { Count, CountInput } from "@/src/types/count";
import { getCount, saveCount } from "@/services/countService";

export default function CountSettingsScreen() {
  const [count, setCount] = useState<Count | null>(null);
  const [countValue, setCountValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCount();
  }, []);

  const loadCount = async () => {
    try {
      const data = await getCount();
      setCount(data);
      setCountValue(data?.count.toString() || "");
    } catch (error) {
      Alert.alert("Error", "Failed to load count");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const countNum = parseInt(countValue, 10);
    if (isNaN(countNum) || countNum < 0) {
      Alert.alert("Error", "Please enter a valid count (positive number)");
      return;
    }

    setSaving(true);
    try {
      const input: CountInput = {
        count: countNum,
      };
      await saveCount(input);
      await loadCount();
      Alert.alert("Success", "Count saved successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to save count");
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
        <Text style={styles.title}>{STRINGS.COUNT_SETTINGS.TITLE}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            {STRINGS.COUNT_SETTINGS.DIGIT_3_COUNT}
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{STRINGS.COUNT_SETTINGS.COUNT}</Text>
          <TextInput
            style={styles.input}
            value={countValue}
            onChangeText={setCountValue}
            placeholder={STRINGS.COUNT_SETTINGS.ENTER_COUNT}
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Saving..." : STRINGS.COUNT_SETTINGS.SAVE}
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoContainer: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
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

