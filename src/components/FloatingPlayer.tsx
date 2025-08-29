import { UNKNOWN_TRACK_IMAGE_URI } from "@/constants";
import { useCurrentTrack } from "@/hooks/audio/audioPlayerHooks";
import { floatingPlayerStyles } from "@/styles/floatingPlayer";
import { TouchableOpacity, ViewProps, View } from "react-native";
import FastImage from "react-native-fast-image";
import { SideScrollingText } from "@/components/custom/SideScrollingText";
import {
	PlayPauseButton,
	SkipToNextButton,
} from "@/components/player/PlayerControls";

export const FloatingPlayer = ({ style }: ViewProps) => {
	const currentTrack = useCurrentTrack();

	if (!currentTrack) return null;

	const handlePress = () => {};

	return (
		<TouchableOpacity
			onPress={handlePress}
			activeOpacity={0.9}
			style={[floatingPlayerStyles.container, style]}
		>
			<FastImage
				source={{
					uri: currentTrack.artwork ?? UNKNOWN_TRACK_IMAGE_URI,
				}}
			/>

			<View>
				<SideScrollingText
					style={floatingPlayerStyles.trackTitle}
					text={currentTrack.title ?? ""}
					animationThreshold={25}
				/>
			</View>

			<View style={floatingPlayerStyles.trackControlsContainer}>
				<PlayPauseButton iconSize={24} />

				<SkipToNextButton iconSize={24} />
			</View>
		</TouchableOpacity>
	);
};
