import AudioService from "@/core/AudioService";
import { useAudioStore } from "@/stores/audioStore";
import { RepeatMode, Song } from "@/types";
import { AudioStatus } from "expo-audio";
import { useCallback, useEffect, useRef } from "react";

export const useAudioPlayer = () => {
	const {
		currentSong,
		isPlaying,
		position,
		duration,
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
		isLoading,
	} = useAudioStore();

	const isMounted = useRef(true);

	useEffect(() => {
		isMounted.current = true;

		AudioService.initialise();

		AudioService.setRepeatMode(repeatMode);

		const handleStatusUpdate = (status: AudioStatus) => {
			if (!isMounted.current) return;

			setPlaybackStatus({
				isLoading: status.isLoaded ? false : true,
				isPlaying: status.playing,
				isBuffering: status.isBuffering,
				positionMillis: status.currentTime * 1000,
				durationMillis: status.duration * 1000,
				isMuted: status.mute,
				isLooping: status.loop,
				didJustFinish: status.didJustFinish,
			});
		};

		const handleSongChange = (song: Song) => {
			if (!isMounted.current) return;
			setCurrentSong(song);
		};

		const handleQueueUpdate = (newQueue: Array<Song>) => {
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

		AudioService.on("statusUpdate", handleStatusUpdate);
		AudioService.on("trackChange", handleSongChange);
		AudioService.on("queueUpdate", handleQueueUpdate);
		AudioService.on("volumeUpdate", handleVolumeUpdate);
		AudioService.on("repeatModeUpdate", handleRepeatModeUpdate);

		return () => {
			isMounted.current = false;
			AudioService.off("statusUpdate", handleStatusUpdate);
			AudioService.off("trackChange", handleSongChange);
			AudioService.off("queueUpdate", handleQueueUpdate);
			AudioService.off("volumeUpdate", handleVolumeUpdate);
			AudioService.off("repeatModeUpdate", handleRepeatModeUpdate);
		};
	}, [
		setCurrentSong,
		setQueue,
		setPlaybackStatus,
		setVolume,
		setRepeatMode,
		repeatMode,
	]);

	const play = useCallback(async () => {
		try {
			await AudioService.play();
		} catch (error) {
			console.error("Error playing:", error);
		}
	}, []);

	const pause = useCallback(async () => {
		try {
			await AudioService.pause();
		} catch (error) {
			console.error("Error pausing:", error);
		}
	}, []);

	const seek = useCallback(async (positionMillis: number) => {
		try {
			await AudioService.seek(positionMillis);
		} catch (error) {
			console.error("Error seeking:", error);
		}
	}, []);

	const skipToNext = useCallback(async () => {
		try {
			await AudioService.skipToNext();
		} catch (error) {
			console.error("Error skipping to next:", error);
		}
	}, []);

	const skipToPrevious = useCallback(async () => {
		try {
			await AudioService.skipToPrevious();
		} catch (error) {
			console.error("Error skipping to previous:", error);
		}
	}, []);

	const loadSong = useCallback(
		async (track: Song) => {
			try {
				await AudioService.loadSong(track);
				setCurrentSong(track);
			} catch (error) {
				console.error("Error loading song:", error);
			}
		},
		[setCurrentSong]
	);

	const setPlayerQueue = useCallback(
		(songs: Array<Song>) => {
			AudioService.setQueue(songs);
			setQueue(songs);
		},
		[setQueue]
	);

	const shuffleQueue = useCallback((keepCurrentSong: boolean = true) => {
		AudioService.shuffleQueue(keepCurrentSong);
	}, []);

	const playSongAt = useCallback(async (index: number) => {
		try {
			await AudioService.playSongAt(index);
		} catch (error) {
			console.error("Error playing song at index:", error);
		}
	}, []);

	const updateVolume = useCallback(async (volumeLevel: number) => {
		try {
			const clampedVolume = Math.max(0, Math.min(1, volumeLevel));
			await AudioService.setVolume(clampedVolume);
		} catch (error) {
			console.error("Error updating volume:", error);
		}
	}, []);

	const setRepeatModeCallback = useCallback(
		(mode: RepeatMode) => {
			setRepeatMode(mode);
			AudioService.setRepeatMode(mode);
		},
		[setRepeatMode]
	);

	const toggleShuffleCallback = useCallback(() => {
		toggleShuffle();
		if (!isShuffled) {
			AudioService.shuffleQueue(true);
		}
	}, [toggleShuffle, isShuffled]);

	return {
		// State
		currentSong,
		isPlaying,
		position,
		duration,
		queue,
		repeatMode,
		volume,
		isShuffled,
		isLoading,

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
