import { UNKNOWN_SONG_IMAGE_URI } from "@/constants";
import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";
import { sheets } from "@/sheets/sheetManager";
import { floatingPlayerStyles } from "@/styles/floatingPlayer";
import { Image } from "expo-image";
import { TouchableOpacity, View, ViewProps } from "react-native";
import AutoScroll, { AnimationMode } from "rn-marquee-text";
import {
	PlayPauseButton,
	SkipToNextButton,
	PlayerScreen,
} from "@/components/player/PlayerScreen";

export const FloatingPlayer = ({ style }: ViewProps) => {
	const { currentSong } = useAudioPlayer();

	if (!currentSong) return null;

	const playerSheet = sheets.find((sheet) => sheet.title === "player");

	const handlePress = () => {
		if (!playerSheet) return;

		playerSheet.onOpen();
	};

	return (
		<>
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
					<MarqueeText
						style={floatingPlayerStyles.songTitle}
						delayms={2000}
						durationms={5000}
						spacing={30}
					>
						{currentSong.title ?? ""}
					</MarqueeText>
				</View>

				<View style={floatingPlayerStyles.songControlsContainer}>
					<PlayPauseButton iconSize={32} />

					<SkipToNextButton iconSize={32} />
				</View>
			</TouchableOpacity>

			<PlayerScreen />
		</>
	);
};
