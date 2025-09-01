import { SongList } from "@/components/songs/SongList";
import { generateSongListId } from "@/utils/utility";
import { loadLibrarySongs } from "@/utils/utility";
import Constants from "expo-constants";
import { useMemo } from "react";
import { ScrollView, View } from "react-native";

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
