import { UNKNOWN_SONG_IMAGE_URI } from "@/constants";
import { floatingPlayerStyles } from "@/styles/floatingPlayer";
import { TouchableOpacity, ViewProps, View } from "react-native";
import { SideScrollingText } from "@/components/custom/SideScrollingText";
import {
	PlayPauseButton,
	SkipToNextButton,
	PlayerScreen,
} from "@/components/player/PlayerScreen";
import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";
import { sheets } from "@/sheets/sheetManager";
import { Image } from "expo-image";

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

				<View>
					<SideScrollingText
						style={floatingPlayerStyles.songTitle}
						text={currentSong.title ?? ""}
						animationThreshold={25}
					/>
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
