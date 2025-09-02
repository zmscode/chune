import { SongList } from "@/components/songs/SongList";
import TrackPlayerService from "@/core/TrackPlayerService";
import { usePlaylistDuration } from "@/hooks/audio/usePlaylistDuration";
import { generateSongListId, getPlaylistSongs } from "@/utils/utility";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { PlayIcon, ShuffleIcon } from "phosphor-react-native";
import { useCallback, useLayoutEffect, useMemo } from "react";
import {
	ScrollView,
	Text,
	TouchableOpacity,
	View
	} from "react-native";

const PlaylistDetailScreen = () => {
	const { name } = useLocalSearchParams<{ name: string }>();

	const playlistName = useMemo(() => {
		if (!name) return null;
		return decodeURIComponent(name as string);
	}, [name]);

	const playlistSongs = useMemo(() => {
		if (!playlistName) return [];
		return getPlaylistSongs(playlistName);
	}, [playlistName]);

	useLayoutEffect(() => {
		if (playlistName) {
			// Layout effect if needed
		}
	}, [playlistName]);

	const handlePlayPlaylist = useCallback(async () => {
		if (playlistSongs.length > 0) {
			await TrackPlayerService.setQueue(playlistSongs);
			await TrackPlayerService.playSongAt(0);
		}
	}, [playlistSongs]);

	const handleShufflePlaylist = useCallback(async () => {
		if (playlistSongs.length > 0) {
			await TrackPlayerService.setQueue(playlistSongs);
			await TrackPlayerService.shuffleQueue(false);
			await TrackPlayerService.playSongAt(0);
		}
	}, [playlistSongs]);

	if (!playlistName || playlistSongs.length === 0) {
		console.warn(`Playlist ${playlistName} was not found or has no songs!`);
		return <Redirect href="/(tabs)/playlists" />;
	}

	const totalDuration = usePlaylistDuration(playlistSongs);

	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: playlistName,
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
							paddingVertical: 20,
							borderBottomWidth: 1,
							borderBottomColor: "#d9d9d9",
							marginBottom: 10,
						}}
					>
						<Text
							style={{
								fontSize: 24,
								fontWeight: "700",
								color: "#171f21",
								marginBottom: 8,
							}}
						>
							{playlistName}
						</Text>
						<Text
							style={{
								fontSize: 14,
								color: "#2d3538",
								marginBottom: 16,
							}}
						>
							{playlistSongs.length}{" "}
							{playlistSongs.length === 1 ? "song" : "songs"} •{" "}
							{totalDuration}
						</Text>

						<View
							style={{
								flexDirection: "row",
								gap: 12,
							}}
						>
							<TouchableOpacity
								onPress={handlePlayPlaylist}
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
									{"Play All"}
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={handleShufflePlaylist}
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
									{"Shuffle"}
								</Text>
							</TouchableOpacity>
						</View>
					</View>

					<SongList
						id={generateSongListId("playlist", playlistName)}
						songs={playlistSongs}
						queueName={playlistName}
						queueType="playlist"
						scrollEnabled={false}
					/>
				</ScrollView>
			</View>
		</>
	);
};

export default PlaylistDetailScreen;
