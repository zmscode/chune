import { FavouriteButton } from "@/components/player/FavouriteButton";
import { PlayerProgressBar } from "@/components/player/PlayerProgressBar";
import { PlayerRepeatToggle } from "@/components/player/PlayerRepeatToggle";
import { PlayerShuffleToggle } from "@/components/player/PlayerShuffleToggle";
import { PlayerVolumeBar } from "@/components/player/PlayerVolumeBar";
import { UNKNOWN_SONG_IMAGE_URI } from "@/constants";
import TrackPlayerService from "@/core/TrackPlayerService";
import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";
import { PlayerControlsProps } from "@/props";
import { useDeviceStore } from "@/stores/globalStore";
import { playerControlsStyles } from "@/styles/playerControls";
import { Image } from "expo-image";
import React from "react";
import {
	ActivityIndicator,
	Text,
	TouchableOpacity,
	View
	} from "react-native";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TextTicker from "react-native-text-ticker";
import {
	FastForwardIcon,
	PauseIcon,
	PlayIcon,
	RewindIcon,
} from "phosphor-react-native";

const PlayerScreen = (props: SheetProps) => {
	const { currentSong, isLoading } = useAudioPlayer();
	const { height } = useDeviceStore();
	const { bottom } = useSafeAreaInsets();

	if (isLoading && !currentSong) {
		return (
			<ActionSheet
				id={props.sheetId}
				gestureEnabled={true}
				indicatorStyle={{
					width: 100,
					marginTop: 10,
				}}
				containerStyle={{
					backgroundColor: "#eeeeee",
				}}
			>
				<View
					style={{
						height: 200,
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<ActivityIndicator color={"#2b2e2f"} />
				</View>
			</ActionSheet>
		);
	}

	return (
		<ActionSheet
			id={props.sheetId}
			gestureEnabled={true}
			indicatorStyle={{
				width: 100,
				marginTop: 10,
			}}
			containerStyle={{
				backgroundColor: "#eeeeee",
			}}
		>
			<View
				style={{
					paddingTop: 30,
					paddingBottom: bottom + 20,
					paddingHorizontal: 24,
					minHeight: height * 0.9,
				}}
			>
				<View
					style={{
						alignItems: "center",
						marginBottom: 50,
					}}
				>
					<View
						style={{
							shadowOffset: {
								width: 0,
								height: 8,
							},
							shadowOpacity: 0.25,
							shadowRadius: 12,
							elevation: 8,
							borderRadius: 12,
						}}
					>
						<Image
							source={{
								uri:
									currentSong?.artwork ??
									UNKNOWN_SONG_IMAGE_URI,
							}}
							contentFit="cover"
							style={{
								width: height * 0.38,
								height: height * 0.38,
								maxWidth: 350,
								maxHeight: 350,
								borderRadius: 12,
							}}
						/>
					</View>
				</View>

				<View style={{ marginBottom: 40 }}>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: 8,
						}}
					>
						<View
							style={{
								flex: 1,
								overflow: "hidden",
								marginRight: 12,
							}}
						>
							<TextTicker
								style={{
									color: "#171f21",
									fontSize: 24,
									fontWeight: "700",
								}}
								duration={3000}
								loop
								bounce
								repeatSpacer={50}
								marqueeDelay={1000}
							>
								{currentSong?.title || "Unknown Title"}
							</TextTicker>
						</View>

						<FavouriteButton song={currentSong} size={26} />
					</View>

					{currentSong?.artist && (
						<Text
							numberOfLines={1}
							style={{
								color: "#171f21",
								fontSize: 18,
								opacity: 0.7,
							}}
						>
							{currentSong.artist}
						</Text>
					)}
				</View>

				<View style={{ marginBottom: 40 }}>
					<PlayerProgressBar />
				</View>

				<View
					style={[
						playerControlsStyles.container,
						{ marginBottom: 60 },
					]}
				>
					<View
						style={[
							playerControlsStyles.row,
							{
								justifyContent: "center",
								alignItems: "center",
							},
						]}
					>
						<SkipToPreviousButton iconSize={36} />

						<View style={{ width: 40 }} />

						<PlayPauseButton iconSize={56} />

						<View style={{ width: 40 }} />

						<SkipToNextButton iconSize={36} />
					</View>
				</View>

				<View style={{ marginBottom: 40 }}>
					<PlayerVolumeBar />
				</View>

				<View
					style={{
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<PlayerShuffleToggle />

					<View style={{ width: 80 }} />

					<PlayerRepeatToggle />
				</View>
			</View>
		</ActionSheet>
	);
};

export const PlayPauseButton = ({
	style,
	iconSize = 52,
}: PlayerControlsProps) => {
	const { isPlaying } = useAudioPlayer();

	const togglePlayPause = () => {
		isPlaying ? TrackPlayerService.pause() : TrackPlayerService.play();
	};

	return (
		<View style={[{ height: iconSize }, style]}>
			<TouchableOpacity
				activeOpacity={0.85}
				onPress={togglePlayPause}
				hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
			>
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
			onPress={() => TrackPlayerService.skipToNext()}
			hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
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
			onPress={() => TrackPlayerService.skipToPrevious()}
			hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
		>
			<RewindIcon size={iconSize} color={"#171f21"} />
		</TouchableOpacity>
	);
};

export default PlayerScreen;
