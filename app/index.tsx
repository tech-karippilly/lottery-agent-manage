import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function Index() {
  return (
    <>
      <Link href="/login" style={styles.loginLink}>Go to Login</Link>
    </>
  );
}

const styles = StyleSheet.create({
  loginLink: {
    fontSize: 18,
    color: "blue",
    padding: 10,
  },
});
