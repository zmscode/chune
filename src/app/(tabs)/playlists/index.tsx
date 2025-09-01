import { PlaylistList } from "@/components/playlists/PlaylistList";
import { getAllPlaylists } from "@/utils/utility";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { PlaylistIcon } from "phosphor-react-native";
import { useCallback, useMemo } from "react";
import { ScrollView, Text, View } from "react-native";

const PlaylistsScreen = () => {
	const router = useRouter();
	const playlists = useMemo(() => getAllPlaylists(), []);

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
				paddingTop: Constants.statusBarHeight,
				backgroundColor: "#eeeeee",
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
						backgroundColor: "#91dc6e20",
						justifyContent: "center",
						alignItems: "center",
						marginRight: 12,
					}}
				>
					<PlaylistIcon size={24} color="#91dc6e" />
				</View>
				<View style={{ flex: 1 }}>
					<Text
						style={{
							fontSize: 28,
							fontWeight: "700",
							color: "#171f21",
						}}
					>
						Playlists
					</Text>
					<Text
						style={{
							fontSize: 14,
							color: "#2d3538",
							marginTop: 2,
						}}
					>
						{playlists.length}{" "}
						{playlists.length === 1 ? "playlist" : "playlists"}
					</Text>
				</View>
			</View>

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
