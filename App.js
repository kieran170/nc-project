import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from "react-navigation/native";
import { createStackNavigator } from "react-navigation/stack";
import SignInUp from "./components/SignInUp"
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <SignInUp />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
