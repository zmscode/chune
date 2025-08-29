import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SheetProvider } from "react-native-actions-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useInitializeAudio } from "@/hooks/audio/audioPlayerHooks";

SplashScreen.preventAutoHideAsync();

const App = () => {
	useInitializeAudio();
	SplashScreen.hideAsync();

	return (
		<SafeAreaProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<SheetProvider context="global">
					<Stack>
						<Stack.Screen
							name="(tabs)"
							options={{ headerShown: true }}
						/>
					</Stack>

					<StatusBar style="auto" />
				</SheetProvider>
			</GestureHandlerRootView>
		</SafeAreaProvider>
	);
};

export default App;
