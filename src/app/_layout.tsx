import { FavouritesInitialiser } from "@/components/custom/FavouritesInitialiser";
import TrackPlayerService from "@/core/TrackPlayerService";
import "@/sheets/sheets";
import { PlaybackService } from "@/utils/service";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { SheetProvider } from "react-native-actions-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import TrackPlayer from "react-native-track-player";
import { TamaguiProvider } from "tamagui";
import { tamaguiConfig } from "tamagui.config";
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
	const [loaded] = useFonts({
		"MartianGrotesk-StdTh": require("./assets/fonts/MartianGrotesk-StdTh.otf"),
		"MartianGrotesk-StdUlt": require("./assets/fonts/MartianGrotesk-StdUlt.otf"),
		"MartianGrotesk-StdxLt": require("./assets/fonts/MartianGrotesk-StdxLt.otf"),
		"MartianGrotesk-StdLt": require("./assets/fonts/MartianGrotesk-StdLt.otf"),
		"MartianGrotesk-StdRg": require("./assets/fonts/MartianGrotesk-StdRg.otf"),
		"MartianGrotesk-StdMd": require("./assets/fonts/MartianGrotesk-StdMd.otf"),
		"MartianGrotesk-StdBd": require("./assets/fonts/MartianGrotesk-StdBd.otf"),
		"MartianGrotesk-StdxBd": require("./assets/fonts/MartianGrotesk-StdxBd.otf"),
		"MartianGrotesk-StdBl": require("./assets/fonts/MartianGrotesk-StdBl.otf"),
	});

	useEffect(() => {
		if (loaded) {
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
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

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
	const colorScheme = useColorScheme();

	return (
		<TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			</Stack>
		</TamaguiProvider>
	);
};

export default App;
