import { SongList } from "@/components/songs/SongList";
import AudioService from "@/core/AudioService";
import { usePlaylistDuration } from "@/hooks/audio/usePlaylistDuration";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useLayoutEffect, useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import { generateSongListId, getPlaylistSongs } from "@/utils/utility";

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
		}
	}, [playlistName]);

	const handlePlayPlaylist = useCallback(() => {
		if (playlistSongs.length > 0) {
			AudioService.setQueue(playlistSongs);
			AudioService.playSongAt(0);
		}
	}, [playlistSongs]);

	const handleShufflePlaylist = useCallback(() => {
		if (playlistSongs.length > 0) {
			AudioService.setQueue(playlistSongs);
			AudioService.shuffleQueue(false);
			AudioService.playSongAt(0);
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
							<View
								style={{
									flex: 1,
									backgroundColor: "#91dc6e",
									paddingVertical: 12,
									borderRadius: 8,
									alignItems: "center",
								}}
							>
								<Text
									onPress={handlePlayPlaylist}
									style={{
										color: "#171f21",
										fontWeight: "600",
										fontSize: 16,
									}}
								>
									Play
								</Text>
							</View>
							<View
								style={{
									flex: 1,
									backgroundColor: "#b8b8b8",
									paddingVertical: 12,
									borderRadius: 8,
									alignItems: "center",
								}}
							>
								<Text
									onPress={handleShufflePlaylist}
									style={{
										color: "#171f21",
										fontWeight: "600",
										fontSize: 16,
									}}
								>
									Shuffle
								</Text>
							</View>
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
