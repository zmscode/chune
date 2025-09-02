import { SongList } from "@/components/songs/SongList";
import TrackPlayerService from "@/core/TrackPlayerService";
import { generateSongListId, getArtistByName } from "@/utils/utility";
import { Image } from "expo-image";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { PlayIcon, ShuffleIcon, UserCircleIcon } from "phosphor-react-native";
import { useCallback, useMemo } from "react";
import {
	ScrollView,
	Text,
	TouchableOpacity,
	View
	} from "react-native";

const ArtistDetailScreen = () => {
	const { name } = useLocalSearchParams<{ name: string }>();

	const artistName = useMemo(() => {
		if (!name) return null;
		return decodeURIComponent(name as string);
	}, [name]);

	const artist = useMemo(() => {
		if (!artistName) return null;
		return getArtistByName(artistName);
	}, [artistName]);

	const handlePlayArtist = useCallback(async () => {
		if (artist && artist.songs.length > 0) {
			await TrackPlayerService.setQueue(artist.songs);
			await TrackPlayerService.playSongAt(0);
		}
	}, [artist]);

	const handleShuffleArtist = useCallback(async () => {
		if (artist && artist.songs.length > 0) {
			await TrackPlayerService.setQueue(artist.songs);
			await TrackPlayerService.shuffleQueue(false);
			await TrackPlayerService.playSongAt(0);
		}
	}, [artist]);

	if (!artist || !artistName) {
		console.warn(`Artist ${artistName} was not found!`);
		return <Redirect href="/(tabs)/artists" />;
	}

	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: artistName,
				}}
			/>
			<View
				style={{
					flex: 1,
					backgroundColor: "#eeeeee",
				}}
			>
				<ScrollView
					contentInsetAdjustmentBehavior="automatic"
					style={{ paddingHorizontal: 24 }}
				>
					<View
						style={{
							alignItems: "center",
							paddingVertical: 30,
							borderBottomWidth: 1,
							borderBottomColor: "#d9d9d9",
							marginBottom: 10,
						}}
					>
						{artist.artwork ? (
							<Image
								source={{ uri: artist.artwork }}
								style={{
									width: 120,
									height: 120,
									borderRadius: 60,
									marginBottom: 16,
								}}
							/>
						) : (
							<View
								style={{
									width: 120,
									height: 120,
									borderRadius: 60,
									backgroundColor: "#d9d9d9",
									justifyContent: "center",
									alignItems: "center",
									marginBottom: 16,
								}}
							>
								<UserCircleIcon size={60} color="#2d3538" />
							</View>
						)}

						<Text
							style={{
								fontSize: 28,
								fontWeight: "700",
								color: "#171f21",
								marginBottom: 8,
							}}
						>
							{artist.name}
						</Text>

						<Text
							style={{
								fontSize: 14,
								color: "#2d3538",
								marginBottom: 20,
							}}
						>
							{artist.songCount}{" "}
							{artist.songCount === 1 ? "song" : "songs"}
						</Text>

						<View
							style={{
								flexDirection: "row",
								gap: 12,
							}}
						>
							<TouchableOpacity
								onPress={handlePlayArtist}
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
								onPress={handleShuffleArtist}
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

					<View style={{ marginTop: 10 }}>
						<Text
							style={{
								fontSize: 18,
								fontWeight: "600",
								color: "#171f21",
								marginBottom: 16,
							}}
						>
							Songs
						</Text>

						<SongList
							id={generateSongListId("artist", artist.name)}
							songs={artist.songs}
							queueName={artist.name}
							queueType="artist"
							scrollEnabled={false}
						/>
					</View>
				</ScrollView>
			</View>
		</>
	);
};

export default ArtistDetailScreen;
