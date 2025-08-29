import { Song } from "@/types";
import { AudioStatus } from "expo-audio";
import AudioService from "@/core/AudioService";
import { useCallback, useEffect } from "react";
import { useAudioStore } from "@/stores/audioStore";

export const useAudioPlayer = () => {
	const {
		currentSong,
		isPlaying,
		position,
		duration,
		queue,
		repeatMode,
		setCurrentSong,
		setQueue,
		setPlaybackStatus,
	} = useAudioStore();

	useEffect(() => {
		AudioService.initialize();

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

		AudioService.on("statusUpdate", handleStatusUpdate);
		AudioService.on("trackChange", handleSongChange);
		AudioService.on("queueUpdate", handleQueueUpdate);

		return () => {
			AudioService.off("statusUpdate", handleStatusUpdate);
			AudioService.off("trackChange", handleSongChange);
			AudioService.off("queueUpdate", handleQueueUpdate);
		};
	}, [setCurrentSong, setQueue, setPlaybackStatus]);

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
		(tracks: Song[]) => {
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

	return {
		currentSong,
		isPlaying,
		position,
		duration,
		queue,
		repeatMode,

		play,
		pause,
		seek,
		skipToNext,
		skipToPrevious,
		loadSong,
		setQueue: setPlayerQueue,
		shuffleQueue,
		playSongAt,
	};
};
