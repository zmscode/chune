import { PlayerProgressBar } from "@/components/player/PlayerProgressBar";
import { PlayerRepeatToggle } from "@/components/player/PlayerRepeatToggle";
import { PlayerShuffleToggle } from "@/components/player/PlayerShuffleToggle";
import { PlayerVolumeBar } from "@/components/player/PlayerVolumeBar";
import { UNKNOWN_SONG_IMAGE_URI } from "@/constants";
import AudioService from "@/core/AudioService";
import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";
import { PlayerControlsProps } from "@/props";
import { useDeviceStore } from "@/stores/globalStore";
import { playerControlsStyles } from "@/styles/playerControls";
import { Image } from "expo-image";
import { useState } from "react";
import {
	ActivityIndicator,
	Text,
	TouchableOpacity,
	View
	} from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
	FastForwardIcon,
	HeartIcon,
	PauseIcon,
	PlayIcon,
	RewindIcon,
} from "phosphor-react-native";

export const PlayerScreen = () => {
	const { currentSong, isLoading } = useAudioPlayer();

	const { height } = useDeviceStore();
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
			isModal={false}
			gestureEnabled={true}
			indicatorStyle={{
				width: 100,
				marginTop: 10,
			}}
			containerStyle={{
				height: height,
				backgroundColor: "white",
			}}
		>
			<View
				style={{
					height: height - top - 20,
					paddingTop: 30,
					paddingBottom: bottom + 20,
					paddingHorizontal: 24,
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
							<MarqueeText
								style={{
									color: "#171f21",
									fontSize: 24,
									fontWeight: "700",
								}}
								delayms={2000}
								durationms={5000}
								spacing={30}
							>
								{currentSong?.title || "Unknown Title"}
							</MarqueeText>
						</View>

						<TouchableOpacity
							activeOpacity={0.7}
							onPress={toggleFavourite}
							disabled={!currentSong?.id}
							hitSlop={{
								top: 10,
								bottom: 10,
								left: 10,
								right: 10,
							}}
						>
							<HeartIcon
								size={26}
								color={isFavourite ? "#f86370" : "#2b2e2f"}
							/>
						</TouchableOpacity>
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
		isPlaying ? AudioService.pause() : AudioService.play();
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
			onPress={() => AudioService.skipToNext()}
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
			onPress={() => AudioService.skipToPrevious()}
			hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
		>
			<RewindIcon size={iconSize} color={"#171f21"} />
		</TouchableOpacity>
	);
};
