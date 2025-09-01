import AudioService from "@/core/AudioService";
import { useAudioStore } from "@/stores/audioStore";
import { RepeatMode, Song } from "@/types";
import { AudioStatus } from "expo-audio";
import { useCallback, useEffect } from "react";

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

	useEffect(() => {
		AudioService.initialize();

		AudioService.setRepeatMode(repeatMode);

		const handleStatusUpdate = (status: AudioStatus) => {
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
			setCurrentSong(song);
		};

		const handleQueueUpdate = (newQueue: Array<Song>) => {
			setQueue(newQueue);
		};

		const handleVolumeUpdate = (newVolume: number) => {
			setVolume(newVolume);
		};

		const handleRepeatModeUpdate = (mode: RepeatMode) => {
			setRepeatMode(mode);
		};

		AudioService.on("statusUpdate", handleStatusUpdate);
		AudioService.on("trackChange", handleSongChange);
		AudioService.on("queueUpdate", handleQueueUpdate);
		AudioService.on("volumeUpdate", handleVolumeUpdate);
		AudioService.on("repeatModeUpdate", handleRepeatModeUpdate);

		return () => {
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
		await AudioService.play();
	}, []);

	const pause = useCallback(async () => {
		await AudioService.pause();
	}, []);

	const seek = useCallback(async (position: number) => {
		await AudioService.seek(position);
	}, []);

	const skipToNext = useCallback(async () => {
		await AudioService.skipToNext();
	}, []);

	const skipToPrevious = useCallback(async () => {
		await AudioService.skipToPrevious();
	}, []);

	const loadSong = useCallback(
		async (track: Song) => {
			await AudioService.loadSong(track);
			setCurrentSong(track);
		},
		[setCurrentSong]
	);

	const setPlayerQueue = useCallback(
		(tracks: Array<Song>) => {
			AudioService.setQueue(tracks);
			setQueue(tracks);
		},
		[setQueue]
	);

	const shuffleQueue = useCallback((keepCurrentSong: boolean = true) => {
		AudioService.shuffleQueue(keepCurrentSong);
	}, []);

	const playSongAt = useCallback(async (index: number) => {
		await AudioService.playSongAt(index);
	}, []);

	const updateVolume = useCallback(async (volumeLevel: number) => {
		await AudioService.setVolume(volumeLevel);
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
		AudioService.shuffleQueue(true);
	}, [toggleShuffle]);

	return {
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
