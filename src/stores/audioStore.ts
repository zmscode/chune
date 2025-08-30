import { create } from "zustand";
import { AudioState } from "@/types";

export const useAudioStore = create<AudioState>((set) => ({
	currentSong: null,
	queue: [],
	isPlaying: false,
	position: 0,
	duration: 0,
	isLoading: false,
	repeatMode: "off",
	isShuffled: false,
	volume: 1.0,

	setCurrentSong: (song) => set({ currentSong: song }),
	setQueue: (songs) => set({ queue: songs }),
	setPlaybackStatus: (status) =>
		set({
			isPlaying: status.isPlaying,
			position: status.positionMillis,
			duration: status.durationMillis,
			isLoading: status.isLoading,
		}),
	setRepeatMode: (mode) => set({ repeatMode: mode }),
	toggleShuffle: () => set((state) => ({ isShuffled: !state.isShuffled })),
	setVolume: (volume) => set({ volume }),
}));
