import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions } from 'react-native';
const { height } = Dimensions.get('window');

import { Button } from '@/components/Button';
import { CustomTextInput } from '@/components/TextInput';

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <View style={styles.logoSpace}>
        </View>

        <View style={styles.card}>

          <CustomTextInput
            placeholder="ID"
          />

          <CustomTextInput
            placeholder="Password"
            isPassword
          />

          <Button buttonText="Login" link={'/dashboard'} />

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoSpace: {
    height: height * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    height: height * 0.5,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
});
