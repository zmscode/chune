import { ArtistList } from "@/components/artist/ArtistList";
import { Artist } from "@/types";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { ScrollView, View } from "react-native";

const ArtistsScreen = () => {
	const router = useRouter();

	const handleArtistSelect = useCallback(
		(artist: Artist) => {
			router.push(`/artists/${encodeURIComponent(artist.name)}`);
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
				<ArtistList
					scrollEnabled={false}
					onArtistSelect={handleArtistSelect}
				/>
			</ScrollView>
		</View>
	);
};

export default ArtistsScreen;
