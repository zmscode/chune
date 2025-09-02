import { ItemDivider } from "@/components/custom/ItemDivider";
import { SongListItem } from "@/components/songs/SongListItem";
import { UNKNOWN_SONG_IMAGE_URI } from "@/constants";
import TrackPlayerService from "@/core/TrackPlayerService";
import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";
import { SongListProps } from "@/props";
import { Song } from "@/types";
import { Image } from "expo-image";
import { memo, useCallback } from "react";
import { FlatList, Text, View } from "react-native";

export const SongList = ({
	id,
	songs,
	hideQueueControls = false,
	queueName = "Queue",
	queueType = "custom",
	...flatlistProps
}: SongListProps) => {
	const { currentSong } = useAudioPlayer();

	const handleSongSelect = useCallback(
		async (selectedSong: Song) => {
			try {
				await TrackPlayerService.initialise();

				await TrackPlayerService.setQueue(songs);

				const selectedIndex = songs.findIndex(
					(song) => song.id === selectedSong.id
				);

				if (selectedIndex >= 0) {
					await TrackPlayerService.playSongAt(selectedIndex);
				} else {
					await TrackPlayerService.loadSong(selectedSong);
					await TrackPlayerService.play();
				}
			} catch (error) {
				console.error("Error playing song:", error);
			}
		},
		[songs]
	);

	return (
		<FlatList
			data={songs}
			keyExtractor={(item) => item.id || item.uri}
			contentContainerStyle={{ paddingTop: 10, paddingBottom: 128 }}
			ListFooterComponent={ItemDivider}
			ItemSeparatorComponent={ItemDivider}
			ListEmptyComponent={
				<View>
					<Text
						style={{
							fontSize: 16,
							color: "#666",
							textAlign: "center",
							marginTop: 40,
							opacity: 0.3,
						}}
					>
						No songs found
					</Text>

					<Image
						source={{
							uri: UNKNOWN_SONG_IMAGE_URI,
						}}
						style={{
							width: 200,
							height: 200,
							alignSelf: "center",
							marginTop: 40,
							opacity: 0.3,
						}}
					/>
				</View>
			}
			renderItem={({ item: song }) => (
				<SongListItem
					song={song}
					onSongSelect={handleSongSelect}
					isPlaying={currentSong?.id === song.id}
					isActiveQueue={true}
				/>
			)}
			{...flatlistProps}
		/>
	);
};

export const SongsList = memo(SongList);
