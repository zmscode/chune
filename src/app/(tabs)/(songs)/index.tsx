import { useQueueWithAudio } from "@/stores/queueStore";
import { generateSongListId } from "@/utils/utility";
import { View, ScrollView } from "react-native";
import { SongList } from "@/components/songs/SongList";
import { loadLibrarySongs } from "@/utils/utility";
import { useMemo } from "react";

const SongsScreen = () => {
	const songs = useMemo(() => loadLibrarySongs(), []);

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
