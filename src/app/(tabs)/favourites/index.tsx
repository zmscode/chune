import { SongList } from "@/components/songs/SongList";
import AudioService from "@/core/AudioService";
import { useFavourites } from "@/hooks/audio/useFavourites";
import { generateSongListId } from "@/utils/utility";
import Constants from "expo-constants";
import { HeartIcon, PlayIcon, ShuffleIcon } from "phosphor-react-native";
import { useCallback } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const FavouritesScreen = () => {
	const { favouriteSongs, favouriteCount } = useFavourites();

	const handlePlayFavourites = useCallback(() => {
		if (favouriteSongs.length > 0) {
			AudioService.setQueue(favouriteSongs);
			AudioService.playSongAt(0);
		}
	}, [favouriteSongs]);

	const handleShuffleFavourites = useCallback(() => {
		if (favouriteSongs.length > 0) {
			AudioService.setQueue(favouriteSongs);
			AudioService.shuffleQueue(false);
			AudioService.playSongAt(0);
		}
	}, [favouriteSongs]);

	if (favouriteSongs.length === 0) {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: "#eeeeee",
					paddingTop: Constants.statusBarHeight,
				}}
			>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						paddingHorizontal: 24,
						paddingVertical: 16,
						backgroundColor: "#eeeeee",
						borderBottomWidth: 1,
						borderBottomColor: "#d9d9d9",
					}}
				>
					<View
						style={{
							width: 40,
							height: 40,
							borderRadius: 20,
							backgroundColor: "#f8637020",
							justifyContent: "center",
							alignItems: "center",
							marginRight: 12,
						}}
					>
						<HeartIcon size={24} color="#f86370" />
					</View>
					<View style={{ flex: 1 }}>
						<Text
							style={{
								fontSize: 28,
								fontWeight: "700",
								color: "#171f21",
							}}
						>
							Favourites
						</Text>
						<Text
							style={{
								fontSize: 14,
								color: "#2d3538",
								marginTop: 2,
							}}
						>
							No favourites yet
						</Text>
					</View>
				</View>

				<View
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
						paddingHorizontal: 40,
						marginTop: -60,
					}}
				>
					<View
						style={{
							width: 120,
							height: 120,
							borderRadius: 60,
							backgroundColor: "#f8637020",
							justifyContent: "center",
							alignItems: "center",
							marginBottom: 24,
						}}
					>
						<HeartIcon size={60} color="#f86370" />
					</View>

					<Text
						style={{
							fontSize: 24,
							fontWeight: "700",
							color: "#171f21",
							marginBottom: 12,
						}}
					>
						No Favourites Yet
					</Text>

					<Text
						style={{
							fontSize: 16,
							color: "#2d3538",
							textAlign: "center",
							lineHeight: 22,
						}}
					>
						Songs you mark as favourite will appear here. Tap the
						heart icon on any song to add it to your favourites.
					</Text>
				</View>
			</View>
		);
	}

	return (
		<View
			style={{
				flex: 1,
				paddingTop: Constants.statusBarHeight,
				backgroundColor: "#eeeeee",
			}}
		>
			<View
				style={{
					paddingHorizontal: 24,
					paddingVertical: 16,
					backgroundColor: "#eeeeee",
					borderBottomWidth: 1,
					borderBottomColor: "#d9d9d9",
				}}
			>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginBottom: 16,
					}}
				>
					<View
						style={{
							width: 40,
							height: 40,
							borderRadius: 20,
							backgroundColor: "#f8637020",
							justifyContent: "center",
							alignItems: "center",
							marginRight: 12,
						}}
					>
						<HeartIcon size={24} color="#f86370" />
					</View>
					<View style={{ flex: 1 }}>
						<Text
							style={{
								fontSize: 28,
								fontWeight: "700",
								color: "#171f21",
							}}
						>
							Favourites
						</Text>
						<Text
							style={{
								fontSize: 14,
								color: "#2d3538",
								marginTop: 2,
							}}
						>
							{favouriteCount}{" "}
							{favouriteCount === 1 ? "song" : "songs"}
						</Text>
					</View>
				</View>

				<View
					style={{
						flexDirection: "row",
						gap: 12,
					}}
				>
					<TouchableOpacity
						onPress={handlePlayFavourites}
						activeOpacity={0.8}
						style={{
							flex: 1,
							backgroundColor: "#91dc6e",
							paddingVertical: 12,
							borderRadius: 24,
							alignItems: "center",
							flexDirection: "row",
							justifyContent: "center",
						}}
					>
						<PlayIcon size={20} color="#171f21" />
						<Text
							style={{
								color: "#171f21",
								fontWeight: "600",
								fontSize: 16,
								marginLeft: 8,
							}}
						>
							Play All
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={handleShuffleFavourites}
						activeOpacity={0.8}
						style={{
							flex: 1,
							backgroundColor: "#b8b8b8",
							paddingVertical: 12,
							borderRadius: 24,
							alignItems: "center",
							flexDirection: "row",
							justifyContent: "center",
						}}
					>
						<ShuffleIcon size={20} color="#171f21" />
						<Text
							style={{
								color: "#171f21",
								fontWeight: "600",
								fontSize: 16,
								marginLeft: 8,
							}}
						>
							Shuffle
						</Text>
					</TouchableOpacity>
				</View>
			</View>

			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={{ paddingHorizontal: 24 }}
			>
				<SongList
					id={generateSongListId("favourites")}
					songs={favouriteSongs}
					queueName="Favourites"
					queueType="playlist"
					scrollEnabled={false}
				/>
			</ScrollView>
		</View>
	);
};

export default FavouritesScreen;
