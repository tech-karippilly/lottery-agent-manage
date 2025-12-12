import { StyleSheet, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  loginLink: {
    fontSize: 18,
    color: "blue",
    padding: 10,
  },
});
