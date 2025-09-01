import libraryData from "@/assets/data/library.json";
import { useDeviceStore } from "@/stores/globalStore";
import { Artist, Song } from "@/types";
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

export const normaliseSong = (song: any, index: number): Song => ({
	id: song.id || `song-${index}-${song.uri.slice(-8)}`,
	uri: song.uri,
	title: song.title || "Unknown Title",
	artist: song.artist,
	artwork: song.artwork,
	rating: song.rating === 1 ? 1 : undefined,
	playlist: song.playlist || [],
});

export const loadLibrarySongs = (): Array<Song> => {
	return libraryData.map((song, index) => normaliseSong(song, index));
};

export const getPlaylistSongs = (playlistName: string): Array<Song> => {
	return loadLibrarySongs().filter((song) =>
		song.playlist?.includes(playlistName)
	);
};

export const getAllPlaylists = (): Array<string> => {
	const playlists = new Set<string>();
	libraryData.forEach((song) => {
		song.playlist?.forEach((p) => playlists.add(p));
	});
	return Array.from(playlists);
};

export const getAllArtists = (): Array<Artist> => {
	const artistMap = new Map<string, Array<Song>>();

	loadLibrarySongs().forEach((song) => {
		if (song.artist) {
			if (!artistMap.has(song.artist)) {
				artistMap.set(song.artist, []);
			}
			artistMap.get(song.artist)?.push(song);
		}
	});

	const artists: Array<Artist> = [];
	artistMap.forEach((songs, name) => {
		const artwork = songs.find((song) => song.artwork)?.artwork;

		artists.push({
			name,
			songCount: songs.length,
			songs,
			artwork,
		});
	});

	return artists.sort((a, b) => a.name.localeCompare(b.name));
};

export const getArtistSongs = (artistName: string): Array<Song> => {
	return loadLibrarySongs().filter((song) => song.artist === artistName);
};

export const getArtistByName = (artistName: string): Artist | null => {
	const songs = getArtistSongs(artistName);
	if (songs.length === 0) return null;

	const artwork = songs.find((song) => song.artwork)?.artwork;

	return {
		name: artistName,
		songCount: songs.length,
		songs,
		artwork,
	};
};
