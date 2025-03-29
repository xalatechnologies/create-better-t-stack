import { useQuery } from "@tanstack/react-query";
import { View, Text, ScrollView } from "react-native";
import { Container } from "@/components/container";
import { trpc } from "@/utils/trpc";

export default function Home() {
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());

  return (
    <Container>
      <ScrollView className="py-4 flex-1">
        <Text className="font-mono text-foreground text-2xl font-bold mb-6">
          BETTER T STACK
        </Text>

        <View className="rounded-lg border border-foreground p-4">
          <Text className="mb-2 font-medium text-foreground">API Status</Text>
          <View className="flex-row items-center gap-2">
            <View
              className={`h-2.5 w-2.5 rounded-full ${
                healthCheck.data ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <Text className="text-sm text-foreground">
              {healthCheck.isLoading
                ? "Checking..."
                : healthCheck.data
                  ? "Connected"
                  : "Disconnected"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
}
