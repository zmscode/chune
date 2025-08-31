import { PlaylistList } from "@/components/playlists/PlaylistList";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { ScrollView, View } from "react-native";

const PlaylistsScreen = () => {
	const router = useRouter();

	const handlePlaylistSelect = useCallback(
		(playlistName: string) => {
			router.push(`/playlists/${encodeURIComponent(playlistName)}`);
		},
		[router]
	);

	return (
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
				<PlaylistList
					scrollEnabled={false}
					onPlaylistSelect={handlePlaylistSelect}
				/>
			</ScrollView>
		</View>
	);
};

export default PlaylistsScreen;
