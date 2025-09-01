import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";
import { SpeakerHighIcon, SpeakerLowIcon } from "phosphor-react-native";
import { useEffect, useRef } from "react";
import { View, ViewProps } from "react-native";
import { Slider } from "react-native-awesome-slider";
import { useSharedValue } from "react-native-reanimated";

export const PlayerVolumeBar = ({ style }: ViewProps) => {
	const { volume, updateVolume } = useAudioPlayer();

	const progress = useSharedValue(volume ?? 1);
	const min = useSharedValue(0);
	const max = useSharedValue(1);
	const isSliding = useSharedValue(false);

	const lastVolumeUpdate = useRef(0);
	const pendingVolume = useRef<number | null>(null);
	const volumeTimeout = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (!isSliding.value && volume !== undefined) {
			progress.value = volume;
		}
	}, [volume, isSliding.value]);

	const handleVolumeChange = (value: number) => {
		const now = Date.now();

		if (volumeTimeout.current) {
			clearTimeout(volumeTimeout.current);
		}

		pendingVolume.current = value;

		volumeTimeout.current = setTimeout(() => {
			if (pendingVolume.current !== null) {
				updateVolume(pendingVolume.current);
				pendingVolume.current = null;
			}
		}, 30);

		lastVolumeUpdate.current = now;
	};

	return (
		<View style={style}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<SpeakerLowIcon
					size={20}
					color={"#2b2e2f"}
					style={{ opacity: 0.8 }}
				/>

				<View
					style={{
						flex: 1,
						flexDirection: "row",
						paddingHorizontal: 10,
					}}
				>
					<Slider
						progress={progress}
						minimumValue={min}
						maximumValue={max}
						containerStyle={{
							flex: 1,
							height: 7,
							borderRadius: 16,
						}}
						onSlidingStart={() => {
							isSliding.value = true;
						}}
						onValueChange={(value) => {
							progress.value = value;
							handleVolumeChange(value);
						}}
						onSlidingComplete={(value) => {
							isSliding.value = false;
							updateVolume(value);
						}}
						renderBubble={() => null}
						theme={{
							minimumTrackTintColor: "#91dc6e",
							maximumTrackTintColor: "rgba(43, 46, 47, 0.3)",
						}}
						thumbWidth={0}
					/>
				</View>

				<SpeakerHighIcon
					size={20}
					color={"#2b2e2f"}
					style={{ opacity: 0.8 }}
				/>
			</View>
		</View>
	);
};
