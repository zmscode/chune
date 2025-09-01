import { ArtistListItem } from "@/components/artist/ArtistListItem";
import { ItemDivider } from "@/components/custom/ItemDivider";
import { UNKNOWN_ARTIST_IMAGE_URI } from "@/constants";
import { ArtistListProps } from "@/props";
import { Artist } from "@/types";
import { getAllArtists } from "@/utils/utility";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { memo, useCallback, useMemo } from "react";
import { FlatList, Text, View } from "react-native";

export const ArtistList = ({
	onArtistSelect,
	hideEmptyArtists = false,
	...flatlistProps
}: ArtistListProps) => {
	const router = useRouter();
	const allArtists = useMemo(() => getAllArtists(), []);

	const artists = useMemo(() => {
		if (!hideEmptyArtists) return allArtists;

		return allArtists.filter((artist) => artist.songCount > 0);
	}, [allArtists, hideEmptyArtists]);

	const handleArtistSelect = useCallback(
		(artist: Artist) => {
			if (onArtistSelect) {
				onArtistSelect(artist);
			} else {
				router.push(`/artists/${encodeURIComponent(artist.name)}`);
			}
		},
		[onArtistSelect, router]
	);

	return (
		<FlatList
			data={artists}
			keyExtractor={(item) => item.name}
			contentContainerStyle={{
				paddingTop: 10,
				paddingBottom: 128,
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
						No artists found
					</Text>

					<Image
						source={{
							uri: UNKNOWN_ARTIST_IMAGE_URI,
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
			renderItem={({ item: artist }) => (
				<ArtistListItem
					artist={artist}
					onArtistSelect={handleArtistSelect}
				/>
			)}
			{...flatlistProps}
		/>
	);
};

export const ArtistsList = memo(ArtistList);
