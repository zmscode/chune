import { ArtistList } from "@/components/artist/ArtistList";
import { Artist } from "@/types";
import { getAllArtists } from "@/utils/utility";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { UserCircleIcon } from "phosphor-react-native";
import { useCallback, useMemo } from "react";
import { ScrollView, Text, View } from "react-native";

const ArtistsScreen = () => {
	const router = useRouter();
	const artists = useMemo(() => getAllArtists(), []);

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
					<UserCircleIcon size={24} color="#91dc6e" />
				</View>
				<View style={{ flex: 1 }}>
					<Text
						style={{
							fontSize: 28,
							fontWeight: "700",
							color: "#171f21",
						}}
					>
						Artists
					</Text>
					<Text
						style={{
							fontSize: 14,
							color: "#2d3538",
							marginTop: 2,
						}}
					>
						{artists.length}{" "}
						{artists.length === 1 ? "artist" : "artists"}
					</Text>
				</View>
			</View>

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
