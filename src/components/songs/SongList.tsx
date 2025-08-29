import { SongListProps } from "@/props";
import { useRef } from "react";
import { FlatList, View, Text } from "react-native";
import FastImage from "react-native-fast-image";
import { Song } from "@/types";
import { useAudioPlayerStore } from "@/stores/audioPlayerStore";
import { ItemDivider } from "@/components/custom/ItemDivider";
import { UNKNOWN_SONG_IMAGE_URI } from "@/constants";
import { SongListItem } from "@/components/songs/SongListItem";
import { useCurrentSong, useQueue } from "@/hooks/audio/audioPlayerHooks";

export const SongList = ({
	id,
	songs,
	hideQueueControls = false,
	...flatlistProps
}: SongListProps) => {
	const queueOffset = useRef(0);
	const activeQueueId = useRef<string | null>(null);

	const { setQueue, loadSong, playSongAtIndex } = useAudioPlayerStore(
		(state) => ({
			setQueue: state.setQueue,
			loadSong: state.loadSong,
			playSongAtIndex: state.playSongAtIndex,
		})
	);

	const { queue } = useQueue();
	const currentSong = useCurrentSong();

	const handleSongSelect = async (selectedSong: Song) => {
		const songIndex = songs.findIndex(
			(song) => song.url === selectedSong.url
		);

		if (songIndex === -1) return;

		const isChangingQueue = id !== activeQueueId.current;

		if (isChangingQueue) {
			const beforeSongs = songs.slice(0, songIndex);
			const afterSongs = songs.slice(songIndex + 1);

			const newQueue = [selectedSong, ...afterSongs, ...beforeSongs];

			setQueue(newQueue);

			loadSong(selectedSong, true);

			queueOffset.current = songIndex;
			activeQueueId.current = id;
		} else {
			const currentQueueIndex = queue.findIndex(
				(song: Song) => song.url === selectedSong.url
			);

			if (currentQueueIndex !== -1) {
				playSongAtIndex(currentQueueIndex);
			} else {
				const beforeSongs = songs.slice(0, songIndex);
				const afterSongs = songs.slice(songIndex + 1);
				const newQueue = [selectedSong, ...afterSongs, ...beforeSongs];

				setQueue(newQueue);
				loadSong(selectedSong, true);

				queueOffset.current = songIndex;
				activeQueueId.current = id;
			}
		}
	};

	return (
		<FlatList
			data={songs}
			contentContainerStyle={{ paddingTop: 10, paddingBottom: 128 }}
			// ListHeaderComponent={
			// 	!hideQueueControls ? (
			// 		<QueueControls
			// 			songs={songs}
			// 			style={{ paddingBottom: 20 }}
			// 		/>
			// 	) : undefined
			// }
			ListFooterComponent={ItemDivider}
			ItemSeparatorComponent={ItemDivider}
			ListEmptyComponent={
				<View>
					<Text
						style={{
							fontSize: 20,
							color: "#2d3538",
							textAlign: "center",
							marginTop: 20,
						}}
					>
						No songs found
					</Text>
					<FastImage
						source={{
							uri: UNKNOWN_SONG_IMAGE_URI,
							priority: FastImage.priority.normal,
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
			renderItem={({ item: track }) => (
				<SongListItem song={track} onSongSelect={handleSongSelect} />
			)}
			keyExtractor={(item) => item.url}
			{...flatlistProps}
		/>
	);
};
