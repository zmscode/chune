import { useMemo } from "react";
import { Text, FlatList, TouchableOpacity } from "react-native";
import { getAllPlaylists, getPlaylistSongs } from "@/utils/utility";
import { useRouter } from "expo-router";

const PlaylistsScreen = () => {
	const router = useRouter();
	const playlists = useMemo(() => getAllPlaylists(), []);

	return (
		<FlatList
			data={playlists}
			keyExtractor={(item) => item}
			renderItem={({ item }) => {
				const songCount = getPlaylistSongs(item).length;
				return (
					<TouchableOpacity
						onPress={() =>
							router.push(`/playlist/${encodeURIComponent(item)}`)
						}
						style={{
							padding: 16,
							borderBottomWidth: 1,
							borderBottomColor: "#eee",
						}}
					>
						<Text style={{ fontSize: 18, fontWeight: "600" }}>
							{item}
						</Text>
						<Text style={{ fontSize: 14, color: "#666" }}>
							{songCount} songs
						</Text>
					</TouchableOpacity>
				);
			}}
		/>
	);
};

export default PlaylistsScreen;
