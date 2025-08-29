import AudioService from "@/core/AudioService";
import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";
import { PlayerControlsProps } from "@/props";
import { playerControlsStyles } from "@/styles/playerControls";
import {
	FastForwardIcon,
	PauseIcon,
	PlayIcon,
	RewindIcon,
} from "phosphor-react-native";
import { TouchableOpacity, View } from "react-native";

export const PlayerControls = ({ style }: PlayerControlsProps) => {
	return (
		<View style={[playerControlsStyles.container, style]}>
			<View style={playerControlsStyles.row}>
				<SkipToPreviousButton />

				<PlayPauseButton />

				<SkipToNextButton />
			</View>
		</View>
	);
};

export const PlayPauseButton = ({
	style,
	iconSize = 52,
}: PlayerControlsProps) => {
	const { isPlaying } = useAudioPlayer();

	const togglePlayPause = () => {
		isPlaying ? AudioService.pause() : AudioService.play();
	};

	return (
		<View style={[{ height: iconSize }, style]}>
			<TouchableOpacity activeOpacity={0.85} onPress={togglePlayPause}>
				{isPlaying ? (
					<PauseIcon size={iconSize} color={"#171f21"} />
				) : (
					<PlayIcon size={iconSize} color={"#171f21"} />
				)}
			</TouchableOpacity>
		</View>
	);
};

export const SkipToNextButton = ({ iconSize = 40 }: PlayerControlsProps) => {
	return (
		<TouchableOpacity
			activeOpacity={0.7}
			onPress={() => AudioService.skipToNext()}
		>
			<FastForwardIcon size={iconSize} color={"#171f21"} />
		</TouchableOpacity>
	);
};

export const SkipToPreviousButton = ({
	iconSize = 40,
}: PlayerControlsProps) => {
	return (
		<TouchableOpacity
			activeOpacity={0.7}
			onPress={() => AudioService.skipToPrevious()}
		>
			<RewindIcon size={iconSize} color={"#171f21"} />
		</TouchableOpacity>
	);
};
