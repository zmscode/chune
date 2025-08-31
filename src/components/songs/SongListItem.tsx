import { UNKNOWN_SONG_IMAGE_URI } from "@/constants";
import {
	DotsThreeOutlineIcon,
	EqualizerIcon,
	PauseIcon,
} from "phosphor-react-native";
import { Text, TouchableHighlight, View } from "react-native";
import { SongListItemProps } from "@/props";
import { Image } from "expo-image";

export const SongListItem = ({
	song,
	onSongSelect: handleSongSelect,
	isPlaying = false,
	isActiveQueue = false,
}: SongListItemProps) => {
	const isActiveSong = isPlaying && isActiveQueue;

	return (
		<TouchableHighlight onPress={() => handleSongSelect(song)}>
			<View
				style={{
					flexDirection: "row",
					columnGap: 14,
					alignItems: "center",
					paddingRight: 20,
				}}
			>
				<View>
					<Image
						source={{
							uri: song.artwork ?? UNKNOWN_SONG_IMAGE_URI,
						}}
						style={{
							borderRadius: 8,
							width: 50,
							height: 50,
							opacity: isActiveSong ? 0.35 : 1,
						}}
					/>

					{isActiveSong &&
						(isPlaying ? (
							<EqualizerIcon
								size={24}
								color={"#2d3538"}
								style={{
									position: "absolute",
									top: 0,
									bottom: 0,
									left: 0,
									right: 0,
									margin: 12,
								}}
							/>
						) : (
							<PauseIcon
								size={24}
								color={"#2d3538"}
								style={{
									position: "absolute",
									top: 0,
									bottom: 0,
									left: 0,
									right: 0,
									margin: 12,
								}}
							/>
						))}
				</View>

				<View
					style={{
						flex: 1,
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<View style={{ width: "100%" }}>
						<Text
							numberOfLines={1}
							style={{
								...{
									fontSize: 16,
									fontWeight: "600",
									maxWidth: "90%",
								},
								color: isActiveSong ? "#91dc6e" : "#171f21",
							}}
						>
							{song.title}
						</Text>

						{song.artist && (
							<Text
								numberOfLines={1}
								style={{
									color: "#2d3538",
									fontSize: 14,
									marginTop: 4,
								}}
							>
								{song.artist}
							</Text>
						)}
					</View>

					<DotsThreeOutlineIcon size={18} color={"#2b2e2f"} />
				</View>
			</View>
		</TouchableHighlight>
	);
};
