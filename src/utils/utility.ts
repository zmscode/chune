import { Song } from "@/types";
import libraryData from "@/assets/data/library.json";
import { useDeviceStore } from "@/stores/globalStore";
import { Image, ImageSourcePropType } from "react-native";

export const getImageUri = (imageSource: ImageSourcePropType): string => {
	const { isMobile } = useDeviceStore.getState();
	if (isMobile) {
		const resolved = Image.resolveAssetSource(imageSource);
		return resolved?.uri || "";
	}
	return typeof imageSource === "string" ? imageSource : "";
};

export const formatTime = (seconds: number): string => {
	if (!seconds || seconds === 0) return "0:00";

	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);

	return `${mins.toString().padStart(1, "0")}:${secs
		.toString()
		.padStart(2, "0")}`;
};

export const generateSongListId = (songListName: string, search?: string) => {
	if (!search) return `${songListName}`;

	return `${songListName}-${search}`;
};

export const normaliseSong = (song: Song, index: number): Song => ({
	id: song.id || `song-${index}-${song.uri.slice(-8)}`,
	uri: song.uri,
	title: song.title || "Unknown Title",
	artist: song.artist,
	artwork: song.artwork,
	rating: song.rating,
	playlist: song.playlist || [],
});

export const loadLibrarySongs = (): Song[] => {
	return libraryData.map((song, index) => normaliseSong(song, index));
};

export const getPlaylistSongs = (playlistName: string): Song[] => {
	return loadLibrarySongs().filter((song) =>
		song.playlist?.includes(playlistName)
	);
};

export const getAllPlaylists = (): string[] => {
	const playlists = new Set<string>();
	libraryData.forEach((song) => {
		song.playlist?.forEach((p) => playlists.add(p));
	});
	return Array.from(playlists);
};
