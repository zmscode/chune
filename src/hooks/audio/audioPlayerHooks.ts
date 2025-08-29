import { Track } from "@/types/types";
import { useEffect, useMemo } from "react";
import { formatTime } from "@/utils/utility";
import { useAudioPlayerStore } from "@/stores/audioPlayerStore";

export const useCurrentTrack = () => {
	const currentTrack = useAudioPlayerStore((state) => state.currentTrack);
	return currentTrack;
};

export const useAudioControls = () => {
	const controls = useAudioPlayerStore((state) => ({
		play: () => state.setIsPlaying(true),
		pause: () => state.setIsPlaying(false),
		togglePlayPause: () => state.setIsPlaying(!state.isPlaying),
		skipToNext: state.skipToNext,
		skipToPrevious: state.skipToPrevious,
		seekTo: state.setSeekTarget,
	}));

	return controls;
};

export const usePlaybackState = () => {
	const state = useAudioPlayerStore((state) => ({
		isPlaying: state.isPlaying,
		isLoading: state.isLoading,
		isBuffering: state.isBuffering,
		currentTime: state.currentTime,
		duration: state.duration,
		playbackRate: state.playbackRate,
		volume: state.volume,
	}));

	return state;
};

export const useQueue = () => {
	const queue = useAudioPlayerStore((state) => state.queue);
	const currentTrackIndex = useAudioPlayerStore(
		(state) => state.currentTrackIndex
	);

	return {
		queue,
		currentIndex: currentTrackIndex,
		hasNext: currentTrackIndex < queue.length - 1,
		hasPrevious: currentTrackIndex > 0,
	};
};

export const useQueueControls = () => {
	const controls = useAudioPlayerStore((state) => ({
		setQueue: state.setQueue,
		addToQueue: state.addToQueue,
		removeFromQueue: state.removeFromQueue,
		clearQueue: state.clearQueue,
		playTrackAtIndex: state.playTrackAtIndex,
	}));

	return controls;
};

export const usePlayerSettings = () => {
	const settings = useAudioPlayerStore((state) => ({
		shuffleMode: state.shuffleMode,
		repeatMode: state.repeatMode,
		volume: state.volume,
		playbackRate: state.playbackRate,
		toggleShuffle: state.toggleShuffle,
		cycleRepeatMode: state.cycleRepeatMode,
		setVolume: state.setVolume,
		setPlaybackRate: state.setPlaybackRate,
	}));

	return settings;
};

export const usePlaybackProgress = () => {
	const currentTime = useAudioPlayerStore((state) => state.currentTime);
	const duration = useAudioPlayerStore((state) => state.duration);

	const progress = useMemo(() => {
		if (duration === 0) return 0;
		return (currentTime / duration) * 100;
	}, [currentTime, duration]);

	return {
		progress,
		currentTime,
		duration,
		formattedCurrentTime: formatTime(currentTime),
		formattedDuration: formatTime(duration),
	};
};

export const usePlaybackHistory = () => {
	const history = useAudioPlayerStore((state) => state.playbackHistory);
	return history;
};

export const useIsTrackPlaying = (trackUrl: string) => {
	const currentTrack = useAudioPlayerStore((state) => state.currentTrack);
	const isPlaying = useAudioPlayerStore((state) => state.isPlaying);

	return currentTrack?.url === trackUrl && isPlaying;
};

export const useIsCurrentTrack = (trackUrl: string) => {
	const currentTrack = useAudioPlayerStore((state) => state.currentTrack);
	return currentTrack?.url === trackUrl;
};

export const usePlayTrack = () => {
	const loadTrack = useAudioPlayerStore((state) => state.loadTrack);

	return (track: Track, autoPlay = true) => loadTrack(track, autoPlay);
};

export const useInitializeAudio = () => {
	const initializeAudio = useAudioPlayerStore(
		(state) => state.initializeAudio
	);
	const reset = useAudioPlayerStore((state) => state.reset);

	useEffect(() => {
		initializeAudio();

		return () => {
			reset();
		};
	}, []);
};

export const useSeekTarget = () => {
	const seekTarget = useAudioPlayerStore((state) => state.seekTarget);
	const clearSeekTarget = useAudioPlayerStore(
		(state) => state.clearSeekTarget
	);

	return { seekTarget, clearSeekTarget };
};

export const useUpdatePlaybackProgress = () => {
	const updateProgress = useAudioPlayerStore(
		(state) => state.updatePlaybackProgress
	);
	const setIsBuffering = useAudioPlayerStore((state) => state.setIsBuffering);
	const setIsLoading = useAudioPlayerStore((state) => state.setIsLoading);
	const handleTrackEnd = useAudioPlayerStore((state) => state.handleTrackEnd);

	return {
		updateProgress,
		setIsBuffering,
		setIsLoading,
		handleTrackEnd,
	};
};

export const usePlayerEvents = (callbacks: {
	onTrackChange?: (track: Track | null) => void;
	onPlaybackStateChange?: (isPlaying: boolean) => void;
	onProgressUpdate?: (currentTime: number, duration: number) => void;
	onVolumeChange?: (volume: number) => void;
	onRepeatModeChange?: (mode: "off" | "track" | "queue") => void;
}) => {
	useEffect(() => {
		let prevTrack = useAudioPlayerStore.getState().currentTrack;
		let prevIsPlaying = useAudioPlayerStore.getState().isPlaying;
		let prevProgress = {
			currentTime: useAudioPlayerStore.getState().currentTime,
			duration: useAudioPlayerStore.getState().duration,
		};
		let prevVolume = useAudioPlayerStore.getState().volume;
		let prevRepeatMode = useAudioPlayerStore.getState().repeatMode;

		const unsubscribe = useAudioPlayerStore.subscribe((state) => {
			if (callbacks.onTrackChange && state.currentTrack !== prevTrack) {
				callbacks.onTrackChange(state.currentTrack);
				prevTrack = state.currentTrack;
			}

			if (
				callbacks.onPlaybackStateChange &&
				state.isPlaying !== prevIsPlaying
			) {
				callbacks.onPlaybackStateChange(state.isPlaying);
				prevIsPlaying = state.isPlaying;
			}

			if (
				callbacks.onProgressUpdate &&
				(state.currentTime !== prevProgress.currentTime ||
					state.duration !== prevProgress.duration)
			) {
				callbacks.onProgressUpdate(state.currentTime, state.duration);
				prevProgress = {
					currentTime: state.currentTime,
					duration: state.duration,
				};
			}

			if (callbacks.onVolumeChange && state.volume !== prevVolume) {
				callbacks.onVolumeChange(state.volume);
				prevVolume = state.volume;
			}

			if (
				callbacks.onRepeatModeChange &&
				state.repeatMode !== prevRepeatMode
			) {
				callbacks.onRepeatModeChange(state.repeatMode);
				prevRepeatMode = state.repeatMode;
			}
		});

		return () => {
			unsubscribe();
		};
	}, []);
};

export const useFullPlayerState = () => {
	return useAudioPlayerStore();
};

export const useQuickPlay = () => {
	const loadTrack = useAudioPlayerStore((state) => state.loadTrack);
	const setQueue = useAudioPlayerStore((state) => state.setQueue);

	return {
		playTrack: (track: Track) => {
			loadTrack(track, true);
		},

		playTrackExclusive: (track: Track) => {
			setQueue([track]);
			loadTrack(track, true);
		},

		playTracks: (tracks: Track[], startIndex = 0) => {
			if (tracks.length === 0) return;
			setQueue(tracks);
			if (tracks[startIndex]) {
				loadTrack(tracks[startIndex], true);
			}
		},
	};
};

export const useIsPlaying = () => {
	const isPlaying = useAudioPlayerStore((state) => state.isPlaying);
	return isPlaying;
};
