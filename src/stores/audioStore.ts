import {
	AudioState,
	ExtendedAudioState,
	RepeatMode,
	Song
	} from "@/types";
import { State } from "react-native-track-player";
import { create } from "zustand";

export const useAudioStore = create<ExtendedAudioState>((set) => ({
	currentSong: null,
	queue: [],
	isPlaying: false,
	position: 0,
	duration: 0,
	isLoading: false,
	repeatMode: "off" as RepeatMode,
	isShuffled: false,
	volume: 1.0,
	isSeeking: false,
	playbackState: State.None,

	setCurrentSong: (song: Song | null) => set({ currentSong: song }),
	setQueue: (songs: Song[]) => set({ queue: songs }),
	setPlaybackStatus: (status) =>
		set({
			isPlaying: status.isPlaying,
			position: status.positionMillis,
			duration: status.durationMillis,
			isLoading: status.isLoading,
		}),
	setPlaybackState: (state: State) =>
		set({
			playbackState: state,
			isPlaying: state === State.Playing,
			isLoading: state === State.Loading || state === State.Buffering,
		}),
	setRepeatMode: (mode: RepeatMode) => set({ repeatMode: mode }),
	toggleShuffle: () => set((state) => ({ isShuffled: !state.isShuffled })),
	setVolume: (volume: number) => set({ volume }),
	setIsSeeking: (isSeeking: boolean) => set({ isSeeking }),
}));
