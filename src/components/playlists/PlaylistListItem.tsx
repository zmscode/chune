import { UNKNOWN_SONG_IMAGE_URI } from "@/constants";
import { PlaylistListItemProps } from "@/props";
import { Song } from "@/types";
import { getPlaylistSongs } from "@/utils/utility";
import { Image } from "expo-image";
import { DotsThreeOutlineIcon, PlaylistIcon } from "phosphor-react-native";
import { useMemo } from "react";
import { Text, TouchableHighlight, View } from "react-native";

export const PlaylistListItem = ({
	playlistName,
	onPlaylistSelect,
	showSongCount = true,
}: PlaylistListItemProps) => {
	const playlistData = useMemo(() => {
		const songs = getPlaylistSongs(playlistName);
		return {
			songs,
			songCount: songs.length,
			artwork: songs[0]?.artwork || null,
		};
	}, [playlistName]);

	const getPlaylistArtwork = (): string => {
		return playlistData.artwork || UNKNOWN_SONG_IMAGE_URI;
	};

	const getPlaylistArtworkGrid = (songs: Array<Song>): string[] => {
		const artworks: Array<string> = [];
		const seen = new Set<string>();

		for (const song of songs) {
			if (song.artwork && !seen.has(song.artwork)) {
				artworks.push(song.artwork);
				seen.add(song.artwork);
				if (artworks.length >= 4) break;
			}
		}

		while (artworks.length < 4) {
			artworks.push(UNKNOWN_SONG_IMAGE_URI);
		}

		return artworks;
	};

	const renderArtwork = () => {
		const uniqueArtworks = new Set(
			playlistData.songs
				.filter((song) => song.artwork)
				.map((song) => song.artwork)
		);

		if (uniqueArtworks.size >= 4) {
			const gridArtworks = getPlaylistArtworkGrid(playlistData.songs);
			return (
				<View
					style={{
						width: 50,
						height: 50,
						borderRadius: 8,
						overflow: "hidden",
						flexDirection: "row",
						flexWrap: "wrap",
					}}
				>
					{gridArtworks.map((artwork, index) => (
						<Image
							key={index}
							source={{ uri: artwork }}
							style={{
								width: 25,
								height: 25,
							}}
						/>
					))}
				</View>
			);
		}

		if (playlistData.artwork) {
			return (
				<Image
					source={{ uri: getPlaylistArtwork() }}
					style={{
						borderRadius: 8,
						width: 50,
						height: 50,
					}}
				/>
			);
		}

		return (
			<View
				style={{
					width: 50,
					height: 50,
					borderRadius: 8,
					backgroundColor: "#d9d9d9",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<PlaylistIcon size={24} color="#2d3538" />
			</View>
		);
	};

	return (
		<TouchableHighlight
			onPress={() => onPlaylistSelect(playlistName)}
			underlayColor="#f5f5f5"
		>
			<View
				style={{
					flexDirection: "row",
					columnGap: 14,
					alignItems: "center",
					paddingRight: 20,
				}}
			>
				{renderArtwork()}

				<View
					style={{
						flex: 1,
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<View style={{ flex: 1, marginRight: 12 }}>
						<Text
							numberOfLines={1}
							style={{
								fontSize: 16,
								fontWeight: "600",
								color: "#171f21",
							}}
						>
							{playlistName}
						</Text>

						{showSongCount && (
							<Text
								style={{
									color: "#2d3538",
									fontSize: 14,
									marginTop: 4,
								}}
							>
								{playlistData.songCount}{" "}
								{playlistData.songCount === 1
									? "song"
									: "songs"}
							</Text>
						)}
					</View>

					<DotsThreeOutlineIcon size={18} color="#2b2e2f" />
				</View>
			</View>
		</TouchableHighlight>
	);
};
