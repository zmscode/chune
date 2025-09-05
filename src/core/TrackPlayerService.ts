import { RepeatMode, Song } from "@/types";
// src/core/TrackPlayerService.ts
import TrackPlayer, {
	AppKilledPlaybackBehavior,
	Capability,
	Event,
	PlaybackState,
	ProgressUpdateEvent,
	RepeatMode as TPRepeatMode,
	State,
	Track,
	Position,
} from "react-native-track-player";

class TrackPlayerService {
	private isInitialised = false;
	private listeners: Map<string, Set<Function>> = new Map();

	async initialise(): Promise<void> {
		if (this.isInitialised) return;

		try {
			await TrackPlayer.setupPlayer({
				autoHandleInterruptions: true,
			});

			await TrackPlayer.updateOptions({
				android: {
					appKilledPlaybackBehavior:
						AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
				},
				capabilities: [
					Capability.Play,
					Capability.Pause,
					Capability.SkipToNext,
					Capability.SkipToPrevious,
					Capability.Stop,
					Capability.SeekTo,
				],
				compactCapabilities: [
					Capability.Play,
					Capability.Pause,
					Capability.SkipToNext,
					Capability.SkipToPrevious,
				],
				progressUpdateEventInterval: 1,
			});

			this.setupEventListeners();
			this.isInitialised = true;
			console.log("TrackPlayerService initialized successfully");
		} catch (error) {
			console.error("Failed to initialise TrackPlayerService:", error);
			// Don't throw - try to recover
			this.isInitialised = false;
		}
	}

	private setupEventListeners(): void {
		TrackPlayer.addEventListener(Event.PlaybackState, (event: Event) => {
			console.log("Playback state changed:", event.state);
			this.emit("playbackStateChange", event.state);
		});

		TrackPlayer.addEventListener(
			Event.PlaybackActiveTrackChanged,
			async (event: Event) => {
				console.log("Active track changed:", event);
				if (event.track) {
					const song = this.trackToSong(event.track);
					this.emit("trackChange", song);
				}
			}
		);

		TrackPlayer.addEventListener(
			Event.PlaybackProgressUpdated,
			(event: ProgressUpdateEvent) => {
				this.emit("progressUpdate", {
					position: event.position * 1000,
					duration: event.duration * 1000,
					buffered: event.buffered * 1000,
				});
			}
		);

		TrackPlayer.addEventListener(Event.PlaybackError, (event: Event) => {
			console.error("Playback error:", event);
			this.emit("playbackError", event);
		});

		TrackPlayer.addEventListener(Event.RemotePlay, () => this.play());
		TrackPlayer.addEventListener(Event.RemotePause, () => this.pause());
		TrackPlayer.addEventListener(Event.RemoteNext, () => this.skipToNext());
		TrackPlayer.addEventListener(Event.RemotePrevious, () =>
			this.skipToPrevious()
		);
		TrackPlayer.addEventListener(
			Event.RemoteSeek,
			({ position }: Position) => this.seek(position * 1000)
		);
	}

	on(event: string, callback: Function): void {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, new Set());
		}
		this.listeners.get(event)?.add(callback);
	}

	off(event: string, callback: Function): void {
		this.listeners.get(event)?.delete(callback);
	}

	private emit(event: string, data?: unknown): void {
		this.listeners.get(event)?.forEach((callback) => callback(data));
	}

	private songToTrack(song: Song): Track {
		return {
			id: song.id || song.uri,
			url: song.uri,
			title: song.title || "Unknown Title",
			artist: song.artist || "Unknown Artist",
			artwork: song.artwork || undefined,
			duration: song.duration,
		};
	}

	private trackToSong(track: Track): Song {
		return {
			id: track.id as string,
			uri: track.url as string,
			title: track.title || "Unknown Title",
			artist: track.artist || undefined,
			artwork: track.artwork as string | undefined,
			duration: track.duration,
		};
	}

	async loadSong(song: Song): Promise<void> {
		try {
			console.log("Loading song:", song.title);
			const track = this.songToTrack(song);
			await TrackPlayer.reset();
			await TrackPlayer.add(track);
			this.emit("trackChange", song);
		} catch (error) {
			console.error("Error loading track:", error);
			throw error;
		}
	}

	async play(): Promise<void> {
		try {
			await TrackPlayer.play();
			this.emit("playbackStateChange", State.Playing);
		} catch (error) {
			console.error("Error playing:", error);
		}
	}

	async pause(): Promise<void> {
		try {
			await TrackPlayer.pause();
			this.emit("playbackStateChange", State.Paused);
		} catch (error) {
			console.error("Error pausing:", error);
		}
	}

	async seek(positionMillis: number): Promise<void> {
		try {
			await TrackPlayer.seekTo(positionMillis / 1000);
			this.emit("seekComplete", positionMillis);
		} catch (error) {
			console.error("Error seeking:", error);
		}
	}

	async setQueue(songs: Song[]): Promise<void> {
		try {
			console.log(`Setting queue with ${songs.length} songs`);
			const tracks = songs.map((song) => this.songToTrack(song));
			await TrackPlayer.reset();
			await TrackPlayer.add(tracks);
			this.emit("queueUpdate", songs);
			console.log("Queue set successfully");
		} catch (error) {
			console.error("Error setting queue:", error);
			throw error;
		}
	}

	async addToQueue(song: Song): Promise<void> {
		try {
			const track = this.songToTrack(song);
			await TrackPlayer.add(track);
			const queue = await this.getQueue();
			this.emit("queueUpdate", queue);
		} catch (error) {
			console.error("Error adding to queue:", error);
		}
	}

	async removeFromQueue(index: number): Promise<void> {
		try {
			const queue = await TrackPlayer.getQueue();
			if (index >= 0 && index < queue.length) {
				await TrackPlayer.remove(index);
				const updatedQueue = await this.getQueue();
				this.emit("queueUpdate", updatedQueue);
			}
		} catch (error) {
			console.error("Error removing from queue:", error);
		}
	}

	async clearQueue(): Promise<void> {
		try {
			await TrackPlayer.reset();
			this.emit("queueUpdate", []);
		} catch (error) {
			console.error("Error clearing queue:", error);
		}
	}

	async playSongAt(index: number): Promise<void> {
		try {
			console.log(`Playing song at index ${index}`);
			await TrackPlayer.skip(index);
			await TrackPlayer.play();
			console.log("Song playing");
		} catch (error) {
			console.error("Error playing song at index:", error);
		}
	}

	async skipToNext(): Promise<void> {
		try {
			await TrackPlayer.skipToNext();
		} catch (error) {
			console.error("Error skipping to next:", error);
		}
	}

	async skipToPrevious(): Promise<void> {
		try {
			const position = await TrackPlayer.getProgress();

			// If more than 3 seconds into the song, restart it
			if (position.position > 3) {
				await TrackPlayer.seekTo(0);
			} else {
				await TrackPlayer.skipToPrevious();
			}
		} catch (error) {
			console.error("Error skipping to previous:", error);
		}
	}

	async shuffleQueue(keepCurrentSong: boolean = true): Promise<void> {
		try {
			const queue = await TrackPlayer.getQueue();
			const currentTrackIndex = await TrackPlayer.getActiveTrackIndex();

			if (queue.length <= 1) return;

			const currentTrack =
				currentTrackIndex !== null ? queue[currentTrackIndex] : null;
			const shuffledQueue = [...queue];

			// Fisher-Yates shuffle
			for (let i = shuffledQueue.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[shuffledQueue[i], shuffledQueue[j]] = [
					shuffledQueue[j],
					shuffledQueue[i],
				];
			}

			if (keepCurrentSong && currentTrack) {
				const currentTrackNewIndex = shuffledQueue.findIndex(
					(track) => track.id === currentTrack.id
				);
				if (currentTrackNewIndex > 0) {
					shuffledQueue.splice(currentTrackNewIndex, 1);
					shuffledQueue.unshift(currentTrack);
				}
			}

			await TrackPlayer.reset();
			await TrackPlayer.add(shuffledQueue);

			if (keepCurrentSong && currentTrack) {
				await TrackPlayer.skip(0);
				await TrackPlayer.play();
			}

			const songs = shuffledQueue.map((track) => this.trackToSong(track));
			this.emit("queueUpdate", songs);
		} catch (error) {
			console.error("Error shuffling queue:", error);
		}
	}

	async getCurrentSong(): Promise<Song | null> {
		try {
			const currentTrack = await TrackPlayer.getActiveTrack();
			return currentTrack ? this.trackToSong(currentTrack) : null;
		} catch (error) {
			console.error("Error getting current song:", error);
			return null;
		}
	}

	async getQueue(): Promise<Song[]> {
		try {
			const queue = await TrackPlayer.getQueue();
			return queue.map((track: Track) => this.trackToSong(track));
		} catch (error) {
			console.error("Error getting queue:", error);
			return [];
		}
	}

	async getCurrentIndex(): Promise<number> {
		try {
			const index = await TrackPlayer.getActiveTrackIndex();
			return index ?? -1;
		} catch (error) {
			console.error("Error getting current index:", error);
			return -1;
		}
	}

	async setRepeatMode(mode: RepeatMode): Promise<void> {
		try {
			let tpRepeatMode: TPRepeatMode;

			switch (mode) {
				case "off":
					tpRepeatMode = TPRepeatMode.Off;
					break;
				case "song":
					tpRepeatMode = TPRepeatMode.Track;
					break;
				case "queue":
					tpRepeatMode = TPRepeatMode.Queue;
					break;
				default:
					tpRepeatMode = TPRepeatMode.Off;
			}

			await TrackPlayer.setRepeatMode(tpRepeatMode);
			this.emit("repeatModeUpdate", mode);
		} catch (error) {
			console.error("Error setting repeat mode:", error);
		}
	}

	async getRepeatMode(): Promise<RepeatMode> {
		try {
			const tpRepeatMode = await TrackPlayer.getRepeatMode();

			switch (tpRepeatMode) {
				case TPRepeatMode.Off:
					return "off";
				case TPRepeatMode.Track:
					return "song";
				case TPRepeatMode.Queue:
					return "queue";
				default:
					return "off";
			}
		} catch (error) {
			console.error("Error getting repeat mode:", error);
			return "off";
		}
	}

	async setVolume(volumeLevel: number): Promise<void> {
		try {
			const clampedVolume = Math.max(0, Math.min(1, volumeLevel));
			await TrackPlayer.setVolume(clampedVolume);
			this.emit("volumeUpdate", clampedVolume);
		} catch (error) {
			console.error("Error setting volume:", error);
		}
	}

	async getVolume(): Promise<number> {
		try {
			const volume = await TrackPlayer.getVolume();
			return volume;
		} catch (error) {
			console.error("Error getting volume:", error);
			return 1;
		}
	}

	async getPlaybackState(): Promise<PlaybackState> {
		try {
			const state = await TrackPlayer.getPlaybackState();
			return state;
		} catch (error) {
			console.error("Error getting playback state:", error);
			return { state: State.None };
		}
	}

	async cleanup(): Promise<void> {
		try {
			await TrackPlayer.stop();
			await TrackPlayer.reset();

			this.listeners.clear();

			console.log("TrackPlayerService cleaned up");
		} catch (error) {
			console.error("Error cleaning up:", error);
		}
	}
}

export default new TrackPlayerService();
