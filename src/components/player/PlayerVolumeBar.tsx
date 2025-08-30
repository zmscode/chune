import { SpeakerHighIcon, SpeakerLowIcon } from "phosphor-react-native";
import { View, ViewProps } from "react-native";
import { Slider } from "react-native-awesome-slider";
import { useSharedValue } from "react-native-reanimated";
import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";

export const PlayerVolumeBar = ({ style }: ViewProps) => {
	const { volume, updateVolume } = useAudioPlayer();

	const progress = useSharedValue(0);
	const min = useSharedValue(0);
	const max = useSharedValue(1);

	progress.value = volume ?? 0;

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
						containerStyle={{
							height: 7,
							borderRadius: 16,
						}}
						onValueChange={(value) => {
							updateVolume(value);
						}}
						renderBubble={() => null}
						theme={{
							minimumTrackTintColor: "rgba(rgba(43, 46, 47, 0.4)",
							maximumTrackTintColor: "rgba(rgba(43, 46, 47, 0.6)",
						}}
						thumbWidth={0}
						maximumValue={max}
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
