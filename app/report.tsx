import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { STRINGS } from "@/constants/strings";
import { ROUTES } from "@/constants/routes";

export default function ReportScreen() {
  const router = useRouter();

  const handleSalesReportPress = () => {
    router.push(ROUTES.SALES_REPORT as any);
  };

  const handleWinningReportPress = () => {
    router.push(ROUTES.WINNING_REPORT as any);
  };

  const handleNetPayReportPress = () => {
    router.push(ROUTES.NET_PAY_REPORT as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Text style={styles.title}>{STRINGS.REPORT.TITLE}</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.reportButton} 
          onPress={handleSalesReportPress}
          activeOpacity={0.7}
        >
          <Text style={styles.reportButtonText}>{STRINGS.REPORT.SALES_REPORT}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.reportButton} 
          onPress={handleWinningReportPress}
          activeOpacity={0.7}
        >
          <Text style={styles.reportButtonText}>{STRINGS.REPORT.WINNING_REPORT}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.reportButton} 
          onPress={handleNetPayReportPress}
          activeOpacity={0.7}
        >
          <Text style={styles.reportButtonText}>{STRINGS.REPORT.NET_PAY_REPORT}</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 32,
    color: "#000",
  },
  buttonContainer: {
    gap: 16,
  },
  reportButton: {
    backgroundColor: "#007AFF",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

