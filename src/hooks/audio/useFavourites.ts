import { useFavouritesStore } from "@/stores/favouritesStore";
import { Song } from "@/types";
import { loadLibrarySongs } from "@/utils/utility";
import { useEffect, useMemo } from "react";

export const useFavourites = () => {
	const {
		favouriteIds,
		isInitialised,
		initialiseFromLibrary,
		addFavourite,
		removeFavourite,
		toggleFavourite,
		isFavourite,
		clearFavourites,
		getFavouriteCount,
	} = useFavouritesStore();

	useEffect(() => {
		if (!isInitialised) {
			initialiseFromLibrary();
		}
	}, [isInitialised, initialiseFromLibrary]);

	const favouriteSongs = useMemo(() => {
		const allSongs = loadLibrarySongs();
		return allSongs.filter((song) => song.id && favouriteIds.has(song.id));
	}, [favouriteIds]);

	const checkIsFavourite = (song: Song): boolean => {
		if (song.id && isFavourite(song.id)) {
			return true;
		}
		return song.rating === 1;
	};

	const toggleSongFavourite = (song: Song): boolean => {
		if (!song.id) return false;
		return toggleFavourite(song.id);
	};

	const addSongToFavourites = (song: Song): void => {
		if (song.id) {
			addFavourite(song.id);
		}
	};

	const removeSongFromFavourites = (song: Song): void => {
		if (song.id) {
			removeFavourite(song.id);
		}
	};

	return {
		favouriteSongs,
		favouriteCount: getFavouriteCount(),
		isFavourite: checkIsFavourite,
		toggleFavourite: toggleSongFavourite,
		addToFavourites: addSongToFavourites,
		removeFromFavourites: removeSongFromFavourites,
		clearAllFavourites: clearFavourites,
		isInitialised,
	};
};
