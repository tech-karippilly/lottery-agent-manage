import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { STRINGS } from "@/constants/strings";

export default function NetPayReportScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Text style={styles.title}>{STRINGS.NET_PAY_REPORT.TITLE}</Text>
      <Text style={styles.subtitle}>Net pay report content will go here</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
});

