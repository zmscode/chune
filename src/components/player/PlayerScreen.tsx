import AudioService from "@/core/AudioService";
import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";
import { PlayerControlsProps } from "@/props";
import { useDeviceStore } from "@/stores/globalStore";
import { playerControlsStyles } from "@/styles/playerControls";
import {
	FastForwardIcon,
	HeartIcon,
	PauseIcon,
	PlayIcon,
	RewindIcon,
} from "phosphor-react-native";
import { useState } from "react";
import { ActivityIndicator, TouchableOpacity, Text, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SideScrollingText } from "@/components/custom/SideScrollingText";
import FastImage from "react-native-fast-image";
import { UNKNOWN_SONG_IMAGE_URI } from "@/constants";
import { PlayerProgressBar } from "@/components/player/PlayerProgressBar";
import { PlayerVolumeBar } from "@/components/player/PlayerVolumeBar";
import { PlayerRepeatToggle } from "@/components/player/PlayerRepeatToggle";
import { PlayerShuffleToggle } from "@/components/player/PlayerShuffleToggle";

export const PlayerScreen = () => {
	const { currentSong, isLoading } = useAudioPlayer();

	const { width, height } = useDeviceStore();
	const { top, bottom } = useSafeAreaInsets();

	const [localFavourites, setLocalFavourites] = useState<Set<string>>(
		new Set()
	);
	const isFavourite = currentSong
		? localFavourites.has(currentSong.id || "")
		: false;

	const toggleFavourite = () => {
		if (!currentSong?.id) return;

		setLocalFavourites((prev) => {
			const newFavs = new Set(prev);
			if (newFavs.has(currentSong.id!)) {
				newFavs.delete(currentSong.id!);
			} else {
				newFavs.add(currentSong.id!);
			}
			return newFavs;
		});
	};

	if (isLoading && !currentSong) {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: "#eeeeee",
					justifyContent: "center",
				}}
			>
				<ActivityIndicator color={"#2b2e2f"} />
			</View>
		);
	}

	return (
		<ActionSheet
			id="player"
			gestureEnabled={true}
			indicatorStyle={{
				width: width / 4,
			}}
			containerStyle={{
				width: width,
				height: height,
			}}
			isModal={false}
		>
			<View
				style={{
					flex: 1,
					backgroundColor: "#eeeeee",
					paddingHorizontal: 24,
				}}
			>
				<View
					style={{
						flex: 1,
						marginTop: top + 50,
						marginBottom: bottom,
						justifyContent: "space-between",
					}}
				>
					<FastImage
						source={{
							uri: currentSong?.artwork ?? UNKNOWN_SONG_IMAGE_URI,
							priority: FastImage.priority.high,
						}}
						resizeMode="cover"
						style={{
							width: "90%",
							aspectRatio: 1,
							maxWidth: 350,
							borderRadius: 12,
						}}
					/>

					<View style={{ flex: 1 }}>
						<View style={{ marginTop: "auto" }}>
							<View style={{ height: 60 }}>
								<View
									style={{
										flexDirection: "row",
										justifyContent: "space-between",
										alignItems: "center",
									}}
								>
									<View
										style={{ flex: 1, overflow: "hidden" }}
									>
										<SideScrollingText
											text={
												currentSong?.title ||
												"Unknown Title"
											}
											animationThreshold={30}
											style={{
												color: "#171f21",
												fontSize: 22,
												fontWeight: 700,
											}}
										/>
									</View>

									<TouchableOpacity
										activeOpacity={0.8}
										onPress={toggleFavourite}
										disabled={!currentSong?.id}
									>
										<HeartIcon
											size={24}
											color={
												isFavourite
													? "#f86370"
													: "#2b2e2f"
											}
											style={{ marginLeft: 14 }}
										/>
									</TouchableOpacity>
								</View>

								{currentSong?.artist && (
									<Text
										numberOfLines={1}
										style={{
											color: "#171f21",
											fontSize: 20,
											opacity: 0.8,
										}}
									>
										{currentSong.artist}
									</Text>
								)}
							</View>

							<PlayerProgressBar style={{ marginTop: 32 }} />

							<View
								style={[
									playerControlsStyles.container,
									{ marginBottom: 50 },
								]}
							>
								<View style={playerControlsStyles.row}>
									<SkipToPreviousButton />

									<PlayPauseButton />

									<SkipToNextButton />
								</View>
							</View>
						</View>

						<PlayerVolumeBar
							style={{ marginTop: "auto", marginBottom: 30 }}
						/>

						<View
							style={{
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
								margin: "auto",
							}}
						>
							<PlayerShuffleToggle />

							<PlayerRepeatToggle />
						</View>
					</View>
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
