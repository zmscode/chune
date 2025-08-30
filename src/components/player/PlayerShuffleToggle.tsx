import { ShuffleIcon } from "phosphor-react-native";
import { TouchableOpacity } from "react-native";
import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";

export const PlayerShuffleToggle = () => {
	const { isShuffled, toggleShuffle } = useAudioPlayer();

	const getIconColor = () => {
		return isShuffled ? "#91dc6e" : "#2b2e2f";
	};

	const getOpacity = () => {
		return isShuffled ? 1 : 0.7;
	};

	return (
		<TouchableOpacity
			activeOpacity={0.7}
			onPress={toggleShuffle}
			style={{
				padding: 8,
			}}
		>
			<ShuffleIcon
				size={22}
				color={getIconColor()}
				style={{ opacity: getOpacity() }}
			/>
		</TouchableOpacity>
	);
};
