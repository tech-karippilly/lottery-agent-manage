import { STRINGS } from "@/constants/strings";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const router = useRouter();

  const handleTicketsPress = () => {
    router.push("/settings/tickets" as any);
  };

  const handleAmountsPress = () => {
    router.push("/settings/amounts" as any);
  };

  const handleCountPress = () => {
    router.push("/settings/count" as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Text style={styles.title}>{STRINGS.SETTINGS.TITLE}</Text>
      
      <View style={styles.listContainer}>
        <TouchableOpacity 
          style={styles.listItem} 
          onPress={handleTicketsPress}
          activeOpacity={0.7}
        >
          <Text style={styles.listItemText}>{STRINGS.SETTINGS.TICKETS}</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.listItem} 
          onPress={handleAmountsPress}
          activeOpacity={0.7}
        >
          <Text style={styles.listItemText}>{STRINGS.SETTINGS.AMOUNTS}</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.listItem} 
          onPress={handleCountPress}
          activeOpacity={0.7}
        >
          <Text style={styles.listItemText}>{STRINGS.SETTINGS.COUNT}</Text>
          <Text style={styles.arrow}>›</Text>
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
    marginBottom: 24,
    color: "#000",
  },
  listContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  listItemText: {
    fontSize: 16,
    color: "#000",
  },
  arrow: {
    fontSize: 24,
    color: "#999",
  },
});
