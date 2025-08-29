import { create } from "zustand";
import { AudioState } from "@/types";

export const useAudioStore = create<AudioState>((set) => ({
	currentTrack: null,
	queue: [],
	isPlaying: false,
	position: 0,
	duration: 0,
	isLoading: false,
	repeatMode: "off",
	isShuffled: false,

	setCurrentTrack: (track) => set({ currentTrack: track }),
	setQueue: (tracks) => set({ queue: tracks }),
	setPlaybackStatus: (status) =>
		set({
			isPlaying: status.isPlaying,
			position: status.positionMillis,
			duration: status.durationMillis,
			isLoading: status.isLoading,
		}),
	setRepeatMode: (mode) => set({ repeatMode: mode }),
	toggleShuffle: () => set((state) => ({ isShuffled: !state.isShuffled })),
}));
