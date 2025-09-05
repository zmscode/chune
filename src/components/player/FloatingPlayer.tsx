import { UNKNOWN_SONG_IMAGE_URI } from "@/constants";
import TrackPlayerService from "@/core/TrackPlayerService";
import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";
import { PlayerControlsProps } from "@/props";
import { floatingPlayerStyles } from "@/styles/floatingPlayer";
import { Image } from "expo-image";
import { FastForwardIcon, PauseIcon, PlayIcon } from "phosphor-react-native";
import { TouchableOpacity, View, ViewProps } from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import TextTicker from "react-native-text-ticker";

export const FloatingPlayer = ({ style }: ViewProps) => {
	const { currentSong, isPlaying } = useAudioPlayer();

	if (!currentSong) return null;

	const handlePress = async () => {
		try {
			console.log(
				"FloatingPlayer pressed - attempting to show player sheet"
			);
			await SheetManager.show("player");
			console.log("Sheet show command executed");
		} catch (error) {
			console.error("Error showing player sheet:", error);
		}
	};

	return (
		<TouchableOpacity
			onPress={handlePress}
			activeOpacity={0.9}
			style={[floatingPlayerStyles.container, style]}
		>
			<Image
				source={{
					uri: currentSong.artwork ?? UNKNOWN_SONG_IMAGE_URI,
				}}
				style={{
					width: 48,
					height: 48,
					borderRadius: 8,
				}}
			/>

			<View
				style={[
					floatingPlayerStyles.songTitleContainer,
					{ flex: 1, marginRight: 8, justifyContent: "center" },
				]}
			>
				<TextTicker
					style={floatingPlayerStyles.songTitle}
					duration={3000}
					loop
					bounce
					repeatSpacer={50}
					marqueeDelay={1000}
				>
					{currentSong.title ?? ""}
				</TextTicker>
			</View>

			<View style={floatingPlayerStyles.songControlsContainer}>
				<PlayPauseButton iconSize={32} isPlaying={isPlaying} />
				<SkipToNextButton iconSize={32} />
			</View>
		</TouchableOpacity>
	);
};

const PlayPauseButton = ({
	iconSize = 32,
	isPlaying,
}: PlayerControlsProps & { isPlaying: boolean }) => {
	const togglePlayPause = (e: any) => {
		e.stopPropagation();
		console.log("Play/Pause button pressed");
		isPlaying ? TrackPlayerService.pause() : TrackPlayerService.play();
	};

	return (
		<TouchableOpacity
			activeOpacity={0.85}
			onPress={togglePlayPause}
			hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
		>
			{isPlaying ? (
				<PauseIcon size={iconSize} color={"#171f21"} />
			) : (
				<PlayIcon size={iconSize} color={"#171f21"} />
			)}
		</TouchableOpacity>
	);
};

const SkipToNextButton = ({ iconSize = 32 }: PlayerControlsProps) => {
	const handlePress = (e: any) => {
		e.stopPropagation();
		console.log("Skip to next button pressed");
		TrackPlayerService.skipToNext();
	};

	return (
		<TouchableOpacity
			activeOpacity={0.7}
			onPress={handlePress}
			hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
		>
			<FastForwardIcon size={iconSize} color={"#171f21"} />
		</TouchableOpacity>
	);
};
