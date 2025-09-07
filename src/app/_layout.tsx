import MGFONT_BLACK from "@/assets/fonts/MartianGrotesk-Black.otf";
import MGFONT_BOLD from "@/assets/fonts/MartianGrotesk-Bold.otf";
import MGFONT_EXTRA_BOLD from "@/assets/fonts/MartianGrotesk-ExtraBold.otf";
import MGFONT_EXTRA_LIGHT from "@/assets/fonts/MartianGrotesk-ExtraLight.otf";
import MGFONT_LIGHT from "@/assets/fonts/MartianGrotesk-Light.otf";
import MGFONT_MEDIUM from "@/assets/fonts/MartianGrotesk-Medium.otf";
import MGFONT_REGULAR from "@/assets/fonts/MartianGrotesk-Regular.otf";
import MGFONT_THIN from "@/assets/fonts/MartianGrotesk-Thin.otf";
import MGFONT_ULTRA_THIN from "@/assets/fonts/MartianGrotesk-UltraThin.otf";
import { FavouritesInitialiser } from "@/components/custom/FavouritesInitialiser";
import TrackPlayerService from "@/core/TrackPlayerService";
import "@/sheets/sheets";
import { PlaybackService } from "@/utils/service";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
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
