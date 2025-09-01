import { FavouritesInitialiser } from "@/components/custom/FavouritesInitialiser";
import AudioService from "@/core/AudioService";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SheetProvider } from "react-native-actions-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
	configureReanimatedLogger,
	ReanimatedLogLevel,
} from "react-native-reanimated";

configureReanimatedLogger({
	level: ReanimatedLogLevel.warn,
	strict: false,
});
SplashScreen.preventAutoHideAsync();

const App = () => {
	useEffect(() => {
		AudioService.initialise();
	}, []);
	SplashScreen.hideAsync();

	return (
		<SafeAreaProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<FavouritesInitialiser>
					<SheetProvider context="global">
						<RootNavigation />

						<StatusBar style="auto" />
					</SheetProvider>
				</FavouritesInitialiser>
			</GestureHandlerRootView>
		</SafeAreaProvider>
	);
};

const RootNavigation = () => {
	return (
		<Stack>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
		</Stack>
	);
};

export default App;
