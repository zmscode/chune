import { formatTime } from "@/utils/utility";
import { Text, View, ViewProps } from "react-native";
import { Slider } from "react-native-awesome-slider";
import { useSharedValue } from "react-native-reanimated";
import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";

export const PlayerProgressBar = ({ style }: ViewProps) => {
	const { position, duration, seek } = useAudioPlayer();

	const isSliding = useSharedValue(false);
	const progress = useSharedValue(0);
	const min = useSharedValue(0);
	const max = useSharedValue(1);

	const trackElapsedTime = formatTime(position / 1000);
	const trackRemainingTime = formatTime((duration - position) / 1000);

	if (!isSliding.value)
		progress.value = duration > 0 ? position / duration : 0;

	return (
		<View style={style}>
			<Slider
				progress={progress}
				minimumValue={min}
				maximumValue={max}
				containerStyle={{
					height: 7,
					borderRadius: 16,
				}}
				thumbWidth={0}
				renderBubble={() => null}
				theme={{
					minimumTrackTintColor: "rgba(rgba(43, 46, 47, 0.4)",
					maximumTrackTintColor: "rgba(rgba(43, 46, 47, 0.6)",
				}}
				onSlidingStart={() => (isSliding.value = true)}
				onValueChange={async (value) => {
					await seek(value * duration);
				}}
				onSlidingComplete={async (value) => {
					if (!isSliding.value) return;

					isSliding.value = false;

					await seek(value * duration);
				}}
			/>

			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "baseline",
					marginTop: 20,
				}}
			>
				<Text
					style={{
						color: "#171f21",
						opacity: 0.75,
						fontSize: 12,
						letterSpacing: 0.7,
						fontWeight: "500",
					}}
				>
					{trackElapsedTime}
				</Text>

				<Text
					style={{
						color: "#171f21",
						opacity: 0.75,
						fontSize: 12,
						letterSpacing: 0.7,
						fontWeight: "500",
					}}
				>
					{trackRemainingTime}
				</Text>
			</View>
		</View>
	);
};
