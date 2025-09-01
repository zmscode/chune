import { FavouritesState } from "@/types";
import { loadLibrarySongs } from "@/utils/utility";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useFavouritesStore = create<FavouritesState>()(
	persist(
		(set, get) => ({
			favouriteIds: new Set<string>(),
			isInitialised: false,

			initialiseFromLibrary: () => {
				if (get().isInitialised) return;

				const songs = loadLibrarySongs();
				const favouriteSongIds = songs
					.filter((song) => song.rating === 1 && song.id)
					.map((song) => song.id!);

				set({
					favouriteIds: new Set(favouriteSongIds),
					isInitialised: true,
				});
			},

			addFavourite: (songId: string) => {
				set((state) => ({
					favouriteIds: new Set(state.favouriteIds).add(songId),
				}));
			},

			removeFavourite: (songId: string) => {
				set((state) => {
					const newFavourites = new Set(state.favouriteIds);
					newFavourites.delete(songId);
					return { favouriteIds: newFavourites };
				});
			},

			toggleFavourite: (songId: string) => {
				const isFav = get().isFavourite(songId);
				if (isFav) {
					get().removeFavourite(songId);
				} else {
					get().addFavourite(songId);
				}
				return !isFav;
			},

			isFavourite: (songId: string) => {
				if (!get().isInitialised) {
					get().initialiseFromLibrary();
				}
				return get().favouriteIds.has(songId);
			},

			clearFavourites: () => {
				set({ favouriteIds: new Set() });
			},

			getFavouriteCount: () => {
				if (!get().isInitialised) {
					get().initialiseFromLibrary();
				}
				return get().favouriteIds.size;
			},
		}),
		{
			name: "favourites-storage",
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) => ({
				favouriteIds: Array.from(state.favouriteIds),
				isInitialised: state.isInitialised,
			}),
			onRehydrateStorage: () => (state) => {
				if (state) {
					if (Array.isArray(state.favouriteIds)) {
						state.favouriteIds = new Set(state.favouriteIds);
					}
					if (state.favouriteIds && state.favouriteIds.size > 0) {
						state.isInitialised = true;
					}
				}
			},
		}
	)
);
