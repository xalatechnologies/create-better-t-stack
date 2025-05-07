import { Container } from "@/components/container";
import { StatusBar } from "expo-status-bar";
import { Platform, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function Modal() {
  return (
    <>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <Container>
        <View style={styles.container}>
          <Text style={styles.text}>Model</Text>
        </View>
      </Container>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  text: {
    color: theme.colors.typography,
  },
  container: {
    flex: 1,
    paddingBottom: 100,
    justifyContent: "center",
    alignItems: "center",
  },
}));
