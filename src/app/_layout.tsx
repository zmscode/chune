import { FavouritesInitialiser } from "@/components/custom/FavouritesInitialiser";
import TrackPlayerService from "@/core/TrackPlayerService";
import "@/sheets/sheets";
import { PlaybackService } from "@/utils/service";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SheetProvider } from "react-native-actions-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import TrackPlayer from "react-native-track-player";
import {
	configureReanimatedLogger,
	ReanimatedLogLevel,
} from "react-native-reanimated";

TrackPlayer.registerPlaybackService(() => PlaybackService);

configureReanimatedLogger({
	level: ReanimatedLogLevel.warn,
	strict: false,
});

SplashScreen.preventAutoHideAsync();

const App = () => {
	useEffect(() => {
		const initializePlayer = async () => {
			try {
				await TrackPlayerService.initialise();
				SplashScreen.hideAsync();
			} catch (error) {
				console.error("Error initializing player:", error);
				SplashScreen.hideAsync();
			}
		};

		initializePlayer();

		return () => {
			TrackPlayerService.cleanup();
		};
	}, []);

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
