import { SongList } from "@/components/songs/SongList";
import { generateSongListId, loadLibrarySongs } from "@/utils/utility";
import Constants from "expo-constants";
import { MusicNoteIcon } from "phosphor-react-native";
import { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";

const SongsScreen = () => {
	const songs = useMemo(() => loadLibrarySongs(), []);

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
					<MusicNoteIcon size={24} color="#91dc6e" />
				</View>
				<View style={{ flex: 1 }}>
					<Text
						style={{
							fontSize: 28,
							fontWeight: "700",
							color: "#171f21",
						}}
					>
						Songs
					</Text>
					<Text
						style={{
							fontSize: 14,
							color: "#2d3538",
							marginTop: 2,
						}}
					>
						{songs.length} songs in your library
					</Text>
				</View>
			</View>

			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={{ paddingHorizontal: 24 }}
			>
				<SongList
					id={generateSongListId("songs")}
					songs={songs}
					queueName="Songs"
					scrollEnabled={false}
				/>
			</ScrollView>
		</View>
	);
};

export default SongsScreen;
