import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { SheetProvider } from "react-native-actions-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet, Text } from "react-native";
import TrackPlayer from "react-native-track-player";
import { playbackService } from "@/utils/playbackService";
import { useSetupTrackPlayer } from "@/hooks/useSetupTrackPlayer";

SplashScreen.preventAutoHideAsync();
TrackPlayer.registerPlaybackService(() => playbackService);

const App = () => {
	useSetupTrackPlayer({
		onLoad: useCallback(() => {
			SplashScreen.hideAsync();
		}, []),
	});

	return (
		<SafeAreaProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				{/* <SheetProvider context="global"> */}
				{/* <RootNavigation /> */}

				<Text>Open up App.tsx to start working on your app!</Text>

				<StatusBar style="auto" />
				{/* </SheetProvider> */}
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffffff",
		alignItems: "center",
		justifyContent: "center",
	},
});

export default App;
