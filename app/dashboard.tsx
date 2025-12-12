import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CardItem from "@/components/CardItem";

export default function Dashboard() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.userBox}>
          <Ionicons name="person-circle-outline" size={30} color="#444" />
          <Text style={styles.userId}>Tester</Text>
        </View>

        <CardItem title="Add" icon="cart-outline" onPress={() => router.push("/ticket-select")} />
        <CardItem title="Reports" icon="document-text-outline" onPress={() => router.push("/report")} />
      
        <CardItem title="Manage Sales" icon="settings-outline" onPress={() => router.push("/settings")} />
        <CardItem
          title="Logout"
          icon="log-out-outline"
          backgroundColor="#E53935"
          onPress={() => router.push("/dashboard")}
          style={styles.logoutCard}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  userBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#cfcbcbca",
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  userId: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },

  logoutCard: {
    marginTop: 30,
  },
});
