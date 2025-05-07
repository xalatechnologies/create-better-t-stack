import { Stack } from "expo-router";
import { StyleSheet } from "react-native-unistyles";
import { Container } from "@/components/container";
import { Text, View } from "react-native";

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: "Tab Two" }} />
      <Container>
        <View style={styles.container}>
          <Text style={styles.text}>Tab Two</Text>
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
