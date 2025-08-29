import { UNKNOWN_SONG_IMAGE_URI } from "@/constants";
import { floatingPlayerStyles } from "@/styles/floatingPlayer";
import { TouchableOpacity, ViewProps, View } from "react-native";
import FastImage from "react-native-fast-image";
import { SideScrollingText } from "@/components/custom/SideScrollingText";
import {
	PlayPauseButton,
	SkipToNextButton,
} from "@/components/player/PlayerControls";
import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";

export const FloatingPlayer = ({ style }: ViewProps) => {
	const { currentSong } = useAudioPlayer();

	if (!currentSong) return null;

	const handlePress = () => {};

	return (
		<TouchableOpacity
			onPress={handlePress}
			activeOpacity={0.9}
			style={[floatingPlayerStyles.container, style]}
		>
			<FastImage
				source={{
					uri: currentSong.artwork ?? UNKNOWN_SONG_IMAGE_URI,
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
				<PlayPauseButton iconSize={24} />

				<SkipToNextButton iconSize={24} />
			</View>
		</TouchableOpacity>
	);
};
