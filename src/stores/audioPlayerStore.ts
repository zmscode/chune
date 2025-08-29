import { create } from "zustand";
import { setAudioModeAsync } from "expo-audio";
import { AudioPlayerState, Track } from "@/types";

export const useAudioPlayerStore = create<AudioPlayerState>((set, get) => ({
	currentTrack: null,
	currentTrackIndex: -1,
	isPlaying: false,
	isLoading: false,
	isBuffering: false,
	duration: 0,
	currentTime: 0,
	playbackRate: 1,
	volume: 1,
	queue: [],
	shuffleMode: false,
	repeatMode: "off",
	playbackHistory: [],
	seekTarget: null,

	initializeAudio: async () => {
		try {
			await setAudioModeAsync({
				playsInSilentMode: true,
				shouldPlayInBackground: true,
				interruptionMode: "doNotMix",
				interruptionModeAndroid: "doNotMix",
			});

			console.log("Audio settings initialized");
		} catch (error) {
			console.error("Failed to initialize audio settings:", error);
		}
	},

	loadTrack: (track: Track, autoPlay = true) => {
		const state = get();

		const newHistory = [...state.playbackHistory, track].slice(-50);

		const trackIndex = state.queue.findIndex((t) => t.url === track.url);

		set({
			currentTrack: track,
			playbackHistory: newHistory,
			currentTrackIndex: trackIndex !== -1 ? trackIndex : -1,
			isPlaying: autoPlay,
			currentTime: 0,
			duration: 0,
		});
	},

	setIsPlaying: (playing: boolean) => {
		set({ isPlaying: playing });
	},

	setSeekTarget: (seconds: number) => {
		set({ seekTarget: seconds });
	},

	clearSeekTarget: () => {
		set({ seekTarget: null });
	},

	skipToNext: () => {
		const { queue, currentTrackIndex, repeatMode, shuffleMode } = get();

		if (queue.length === 0) return;

		let nextIndex: number;

		if (shuffleMode) {
			do {
				nextIndex = Math.floor(Math.random() * queue.length);
			} while (nextIndex === currentTrackIndex && queue.length > 1);
		} else if (currentTrackIndex < queue.length - 1) {
			nextIndex = currentTrackIndex + 1;
		} else if (repeatMode === "queue") {
			nextIndex = 0;
		} else {
			set({ isPlaying: false });
			return;
		}

		get().playTrackAtIndex(nextIndex);
	},

	skipToPrevious: () => {
		const { queue, currentTrackIndex, currentTime } = get();

		if (queue.length === 0) return;

		if (currentTime > 3) {
			get().setSeekTarget(0);
			return;
		}

		let prevIndex: number;

		if (currentTrackIndex > 0) {
			prevIndex = currentTrackIndex - 1;
		} else {
			prevIndex = queue.length - 1;
		}

		get().playTrackAtIndex(prevIndex);
	},

	setQueue: (tracks: Array<Track>) => {
		set({ queue: tracks });
	},

	addToQueue: (track: Track) => {
		set((state) => ({ queue: [...state.queue, track] }));
	},

	removeFromQueue: (index: number) => {
		set((state) => {
			const newQueue = [...state.queue];
			newQueue.splice(index, 1);

			let newIndex = state.currentTrackIndex;
			if (index < state.currentTrackIndex) {
				newIndex--;
			} else if (index === state.currentTrackIndex) {
				newIndex = -1;
			}

			return { queue: newQueue, currentTrackIndex: newIndex };
		});
	},

	clearQueue: () => {
		set({ queue: [], currentTrackIndex: -1 });
	},

	playTrackAtIndex: (index: number) => {
		const { queue } = get();

		if (index >= 0 && index < queue.length) {
			get().loadTrack(queue[index], true);
		}
	},

	setVolume: (volume: number) => {
		const clampedVolume = Math.max(0, Math.min(1, volume));
		set({ volume: clampedVolume });
	},

	setPlaybackRate: (rate: number) => {
		const clampedRate = Math.max(0.5, Math.min(2, rate));
		set({ playbackRate: clampedRate });
	},

	toggleShuffle: () => {
		set((state) => ({ shuffleMode: !state.shuffleMode }));
	},

	cycleRepeatMode: () => {
		set((state) => {
			const modes: Array<"off" | "track" | "queue"> = [
				"off",
				"track",
				"queue",
			];
			const currentIndex = modes.indexOf(state.repeatMode);
			const nextIndex = (currentIndex + 1) % modes.length;
			return { repeatMode: modes[nextIndex] };
		});
	},

	updatePlaybackProgress: (currentTime: number, duration: number) => {
		set({ currentTime, duration });
	},

	setIsBuffering: (buffering: boolean) => {
		set({ isBuffering: buffering });
	},

	setIsLoading: (loading: boolean) => {
		set({ isLoading: loading });
	},

	handleTrackEnd: () => {
		const { repeatMode } = get();

		if (repeatMode === "track") {
			get().setSeekTarget(0);
			set({ isPlaying: true });
		} else {
			get().skipToNext();
		}
	},

	reset: () => {
		set({
			currentTrack: null,
			currentTrackIndex: -1,
			isPlaying: false,
			isLoading: false,
			isBuffering: false,
			currentTime: 0,
			duration: 0,
			seekTarget: null,
		});
	},
}));
