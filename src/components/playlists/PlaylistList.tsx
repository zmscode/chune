import { ItemDivider } from "@/components/custom/ItemDivider";
import { PlaylistListItem } from "@/components/playlists/PlaylistListItem";
import { UNKNOWN_SONG_IMAGE_URI } from "@/constants";
import { PlaylistListProps } from "@/props";
import { getAllPlaylists, getPlaylistSongs } from "@/utils/utility";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { memo, useCallback, useMemo } from "react";
import { FlatList, FlatListProps, Text, View } from "react-native";

export const PlaylistList = ({
	onPlaylistSelect,
	hideEmptyPlaylists = false,
	...flatlistProps
}: PlaylistListProps) => {
	const router = useRouter();
	const allPlaylists = useMemo(() => getAllPlaylists(), []);

	const playlists = useMemo(() => {
		if (!hideEmptyPlaylists) return allPlaylists;

		return allPlaylists.filter((playlist) => {
			const songs = getPlaylistSongs(playlist);
			return songs.length > 0;
		});
	}, [allPlaylists, hideEmptyPlaylists]);

	const handlePlaylistSelect = useCallback(
		(playlistName: string) => {
			if (onPlaylistSelect) {
				onPlaylistSelect(playlistName);
			} else {
				router.push(`/playlists/${encodeURIComponent(playlistName)}`);
			}
		},
		[onPlaylistSelect, router]
	);

	return (
		<FlatList
			data={playlists}
			keyExtractor={(item) => item}
			contentContainerStyle={{
				paddingTop: 10,
				paddingBottom: 128,
				paddingHorizontal: 24,
			}}
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
							marginBottom: 20,
						}}
					>
						No playlists found
					</Text>

					<Image
						source={{
							uri: UNKNOWN_SONG_IMAGE_URI,
						}}
						style={{
							width: 200,
							height: 200,
							alignSelf: "center",
							marginTop: 20,
							opacity: 0.3,
						}}
					/>
				</View>
			}
			renderItem={({ item: playlist }) => (
				<PlaylistListItem
					playlistName={playlist}
					onPlaylistSelect={handlePlaylistSelect}
				/>
			)}
			{...flatlistProps}
		/>
	);
};

export const PlaylistsList = memo(PlaylistList);
