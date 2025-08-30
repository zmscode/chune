import { RepeatIcon, RepeatOnceIcon } from "phosphor-react-native";
import { TouchableOpacity } from "react-native";
import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";
import { RepeatMode } from "@/types";

export const PlayerRepeatToggle = () => {
	const { repeatMode, setRepeatMode } = useAudioPlayer();

	const toggleRepeatMode = () => {
		let nextMode: RepeatMode;
		switch (repeatMode) {
			case "off":
				nextMode = "queue";
				break;
			case "queue":
				nextMode = "song";
				break;
			case "song":
				nextMode = "off";
				break;
			default:
				nextMode = "off";
		}
		setRepeatMode(nextMode);
	};

	const getIconColor = () => {
		return repeatMode !== "off" ? "#91dc6e" : "#2b2e2f";
	};

	const getOpacity = () => {
		return repeatMode !== "off" ? 1 : 0.7;
	};

	return (
		<TouchableOpacity
			activeOpacity={0.7}
			onPress={toggleRepeatMode}
			style={{
				padding: 8,
			}}
		>
			{repeatMode === "song" ? (
				<RepeatOnceIcon
					size={22}
					color={getIconColor()}
					style={{ opacity: getOpacity() }}
				/>
			) : (
				<RepeatIcon
					size={22}
					color={getIconColor()}
					style={{ opacity: getOpacity() }}
				/>
			)}
		</TouchableOpacity>
	);
};
