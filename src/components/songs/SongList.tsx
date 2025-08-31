import { SongListProps } from "@/props";
import { FlatList, View, Text } from "react-native";
import { Song } from "@/types";
import { ItemDivider } from "@/components/custom/ItemDivider";
import { useAudioPlayer } from "@/hooks/audio/useAudioPlayer";
import { useDeviceStore } from "@/stores/globalStore";
import { memo, useCallback } from "react";
import AudioService from "@/core/AudioService";
import { UNKNOWN_SONG_IMAGE_URI } from "@/constants";
import { SongListItem } from "@/components/songs/SongListItem";
import { Image } from "expo-image";

export const SongList = ({
	id,
	songs,
	hideQueueControls = false,
	queueName = "Queue",
	queueType = "custom",
	...flatlistProps
}: SongListProps) => {
	const { currentSong } = useAudioPlayer();

	const handleSongSelect = useCallback(async (selectedSong: Song) => {
		try {
			await AudioService.initialize();
			
			// Set the queue and find the selected song's index
			AudioService.setQueue(songs);
			const selectedIndex = songs.findIndex(song => song.id === selectedSong.id);
			
			if (selectedIndex >= 0) {
				await AudioService.playSongAt(selectedIndex);
			} else {
				await AudioService.loadSong(selectedSong);
				await AudioService.play();
			}
		} catch (error) {
			console.error("Error playing song:", error);
		}
	}, [songs]);

	/* ListHeaderComponent={
		!hideQueueControls ? (
			<QueueControls
				songs={songs}
				queueId={id}
				isActive={isActiveQueue}
				style={{ paddingBottom: 20 }}
			/>
		) : undefined
	} */

	return (
		<FlatList
			data={songs}
			contentContainerStyle={{ paddingTop: 10, paddingBottom: 128 }}
			ListFooterComponent={ItemDivider}
			ItemSeparatorComponent={ItemDivider}
			ListEmptyComponent={
				<View>
					<Text
						style={{
							width: 200,
							height: 200,
							alignSelf: "center",
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
