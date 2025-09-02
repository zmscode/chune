import TrackPlayerService from "@/core/TrackPlayerService";
import { useAudioStore } from "@/stores/audioStore";
import { RepeatMode, Song } from "@/types";
import { useCallback, useEffect, useRef } from "react";
import {
	useProgress,
	usePlaybackState,
	useActiveTrack,
	State,
} from "react-native-track-player";

export const useAudioPlayer = () => {
	const {
		currentSong,
		queue,
		repeatMode,
		volume,
		isShuffled,
		setCurrentSong,
		setQueue,
		setPlaybackStatus,
		setVolume,
		setRepeatMode,
		toggleShuffle,
		setPlaybackState,
	} = useAudioStore();

	const progress = useProgress();
	const playbackState = usePlaybackState();
	const activeTrack = useActiveTrack();

	const isMounted = useRef(true);

	useEffect(() => {
		if (activeTrack) {
			const song: Song = {
				id: activeTrack.id as string,
				uri: activeTrack.url as string,
				title: activeTrack.title || "Unknown Title",
				artist: activeTrack.artist || undefined,
				artwork: activeTrack.artwork as string | undefined,
				duration: activeTrack.duration,
			};
			setCurrentSong(song);
		} else {
			setCurrentSong(null);
		}
	}, [activeTrack, setCurrentSong]);

	useEffect(() => {
		if (playbackState.state !== undefined) {
			setPlaybackState(playbackState.state);
		}
	}, [playbackState.state, setPlaybackState]);

	useEffect(() => {
		const state = playbackState.state ?? State.None;
		setPlaybackStatus({
			isLoading:
				state === State.Loading ||
				state === State.Buffering ||
				state === State.Connecting,
			isPlaying: state === State.Playing,
			isBuffering: state === State.Buffering,
			positionMillis: progress.position * 1000,
			durationMillis: progress.duration * 1000,
			isMuted: false,
			isLooping: false,
			didJustFinish: state === State.Ended,
		});
	}, [
		progress.position,
		progress.duration,
		playbackState.state,
		setPlaybackStatus,
	]);

	useEffect(() => {
		isMounted.current = true;

		const initializeService = async () => {
			await TrackPlayerService.initialise();
			await TrackPlayerService.setRepeatMode(repeatMode);
		};

		initializeService();

		const handleQueueUpdate = (newQueue: Song[]) => {
			if (!isMounted.current) return;
			setQueue(newQueue);
		};

		const handleVolumeUpdate = (newVolume: number) => {
			if (!isMounted.current) return;
			setVolume(newVolume);
		};

		const handleRepeatModeUpdate = (mode: RepeatMode) => {
			if (!isMounted.current) return;
			setRepeatMode(mode);
		};

		TrackPlayerService.on("queueUpdate", handleQueueUpdate);
		TrackPlayerService.on("volumeUpdate", handleVolumeUpdate);
		TrackPlayerService.on("repeatModeUpdate", handleRepeatModeUpdate);

		return () => {
			isMounted.current = false;
			TrackPlayerService.off("queueUpdate", handleQueueUpdate);
			TrackPlayerService.off("volumeUpdate", handleVolumeUpdate);
			TrackPlayerService.off("repeatModeUpdate", handleRepeatModeUpdate);
		};
	}, [setQueue, setVolume, setRepeatMode, repeatMode]);

	const play = useCallback(async () => {
		try {
			await TrackPlayerService.play();
		} catch (error) {
			console.error("Error playing:", error);
		}
	}, []);

	const pause = useCallback(async () => {
		try {
			await TrackPlayerService.pause();
		} catch (error) {
			console.error("Error pausing:", error);
		}
	}, []);

	const seek = useCallback(async (positionMillis: number) => {
		try {
			await TrackPlayerService.seek(positionMillis);
		} catch (error) {
			console.error("Error seeking:", error);
		}
	}, []);

	const skipToNext = useCallback(async () => {
		try {
			await TrackPlayerService.skipToNext();
		} catch (error) {
			console.error("Error skipping to next:", error);
		}
	}, []);

	const skipToPrevious = useCallback(async () => {
		try {
			await TrackPlayerService.skipToPrevious();
		} catch (error) {
			console.error("Error skipping to previous:", error);
		}
	}, []);

	const loadSong = useCallback(
		async (track: Song) => {
			try {
				await TrackPlayerService.loadSong(track);
				setCurrentSong(track);
			} catch (error) {
				console.error("Error loading song:", error);
			}
		},
		[setCurrentSong]
	);

	const setPlayerQueue = useCallback(
		async (songs: Song[]) => {
			await TrackPlayerService.setQueue(songs);
			setQueue(songs);
		},
		[setQueue]
	);

	const shuffleQueue = useCallback(
		async (keepCurrentSong: boolean = true) => {
			await TrackPlayerService.shuffleQueue(keepCurrentSong);
		},
		[]
	);

	const playSongAt = useCallback(async (index: number) => {
		try {
			await TrackPlayerService.playSongAt(index);
		} catch (error) {
			console.error("Error playing song at index:", error);
		}
	}, []);

	const updateVolume = useCallback(async (volumeLevel: number) => {
		try {
			await TrackPlayerService.setVolume(volumeLevel);
		} catch (error) {
			console.error("Error updating volume:", error);
		}
	}, []);

	const setRepeatModeCallback = useCallback(
		async (mode: RepeatMode) => {
			setRepeatMode(mode);
			await TrackPlayerService.setRepeatMode(mode);
		},
		[setRepeatMode]
	);

	const toggleShuffleCallback = useCallback(async () => {
		toggleShuffle();
		if (!isShuffled) {
			await TrackPlayerService.shuffleQueue(true);
		}
	}, [toggleShuffle, isShuffled]);

	const state = playbackState.state ?? State.None;
	const isPlaying = state === State.Playing;
	const isLoading =
		state === State.Loading ||
		state === State.Buffering ||
		state === State.Connecting;

	return {
		currentSong,
		isPlaying,
		position: progress.position * 1000,
		duration: progress.duration * 1000,
		queue,
		repeatMode,
		volume,
		isShuffled,
		isLoading,
		playbackState: state,

		play,
		pause,
		seek,
		skipToNext,
		skipToPrevious,
		loadSong,
		setQueue: setPlayerQueue,
		shuffleQueue,
		playSongAt,
		updateVolume,
		setRepeatMode: setRepeatModeCallback,
		toggleShuffle: toggleShuffleCallback,
	};
};
