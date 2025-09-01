import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";
import { formatTime } from "@/utils/utility";
import { useEffect, useRef } from "react";
import { Text, View, ViewProps } from "react-native";
import { Slider } from "react-native-awesome-slider";
import { useSharedValue } from "react-native-reanimated";

export const PlayerProgressBar = ({ style }: ViewProps) => {
	const { position, duration, seek } = useAudioPlayer();

	const isSliding = useSharedValue(false);
	const progress = useSharedValue(0);
	const min = useSharedValue(0);
	const max = useSharedValue(1);

	const lastSeekTime = useRef(0);
	const pendingSeek = useRef<number | null>(null);
	const seekTimeout = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (!isSliding.value && duration > 0) {
			progress.value = position / duration;
		}
	}, [position, duration, isSliding.value]);

	const trackElapsedTime = formatTime(position / 1000);
	const trackRemainingTime = formatTime((duration - position) / 1000);

	const handleSeek = async (value: number) => {
		const now = Date.now();
		const targetPosition = value * duration;

		if (seekTimeout.current) {
			clearTimeout(seekTimeout.current);
		}

		pendingSeek.current = targetPosition;

		seekTimeout.current = setTimeout(async () => {
			if (pendingSeek.current !== null) {
				await seek(pendingSeek.current);
				pendingSeek.current = null;
			}
		}, 50);

		lastSeekTime.current = now;
	};

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
					minimumTrackTintColor: "#91dc6e",
					maximumTrackTintColor: "rgba(43, 46, 47, 0.3)",
				}}
				onSlidingStart={() => {
					isSliding.value = true;
				}}
				onValueChange={(value) => {
					progress.value = value;
				}}
				onSlidingComplete={async (value) => {
					isSliding.value = false;
					await handleSeek(value);
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
					-{trackRemainingTime}
				</Text>
			</View>
		</View>
	);
};
