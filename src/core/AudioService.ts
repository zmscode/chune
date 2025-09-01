import { RepeatMode, Song } from "@/types";
import { AudioPlayer, AudioSource, createAudioPlayer } from "expo-audio";

class AudioService {
	private player: AudioPlayer | null = null;
	private queue: Array<Song> = [];
	private currentIndex: number = -1;
	private isInitialised = false;
	private listeners: Map<string, Set<Function>> = new Map();
	private volume: number = 1.0;
	private repeatMode: RepeatMode = "off";
	private isSkippingTrack: boolean = false;
	private isSeeking: boolean = false;
	private lastSeekTime: number = 0;

	async initialise(): Promise<void> {
		if (this.isInitialised) return;

		try {
			this.player = createAudioPlayer(null);

			this.player.addListener("playbackStatusUpdate", (status) => {
				if (!this.isSkippingTrack && !this.isSeeking) {
					this.emit("statusUpdate", status);
				}

				if (status.didJustFinish && !this.isSkippingTrack) {
					this.handleSongEnd();
				}
			});

			this.isInitialised = true;
		} catch (error) {
			console.error("Failed to initialise AudioService:", error);
			throw error;
		}
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

	private emit(event: string, data: any): void {
		this.listeners.get(event)?.forEach((callback) => callback(data));
	}

	async loadSong(song: Song): Promise<void> {
		try {
			const audioUrl = song.uri;
			if (!audioUrl) {
				throw new Error("No audio URL provided for song");
			}

			const audioSource: AudioSource = { uri: audioUrl };

			if (!this.player) {
				await this.initialise();
			}

			if (this.player) {
				this.player.replace(audioSource);
				if (this.volume !== 1.0) {
					this.player.volume = this.volume;
				}
			}

			this.emit("trackChange", song);
		} catch (error) {
			console.error("Error loading track:", error);
			throw error;
		}
	}

	async play(): Promise<void> {
		if (!this.player) return;
		this.player.play();
	}

	async pause(): Promise<void> {
		if (!this.player) return;
		this.player.pause();
	}

	async seek(positionMillis: number): Promise<void> {
		if (!this.player) return;

		const now = Date.now();
		if (now - this.lastSeekTime < 50) return;
		this.lastSeekTime = now;

		this.isSeeking = true;

		try {
			await this.player.seekTo(positionMillis / 1000);

			const status = this.player.currentStatus;
			if (status) {
				this.emit("statusUpdate", {
					...status,
					currentTime: positionMillis / 1000,
				});
			}
		} catch (error) {
			console.error("Error seeking:", error);
		} finally {
			setTimeout(() => {
				this.isSeeking = false;
			}, 100);
		}
	}

	setQueue(songs: Array<Song>): void {
		this.queue = [...songs];
		this.currentIndex = -1;
		this.emit("queueUpdate", this.queue);
	}

	addToQueue(song: Song): void {
		this.queue.push(song);
		this.emit("queueUpdate", this.queue);
	}

	removeFromQueue(index: number): void {
		if (index >= 0 && index < this.queue.length) {
			this.queue.splice(index, 1);
			if (index < this.currentIndex) {
				this.currentIndex--;
			} else if (index === this.currentIndex) {
				this.currentIndex = Math.min(
					this.currentIndex,
					this.queue.length - 1
				);
			}
			this.emit("queueUpdate", this.queue);
		}
	}

	clearQueue(): void {
		this.queue = [];
		this.currentIndex = -1;
		this.emit("queueUpdate", this.queue);
	}

	async playSongAt(index: number): Promise<void> {
		if (index >= 0 && index < this.queue.length) {
			this.isSkippingTrack = true;
			this.currentIndex = index;
			await this.loadSong(this.queue[index]);
			await this.play();
			setTimeout(() => {
				this.isSkippingTrack = false;
			}, 200);
		}
	}

	async skipToNext(): Promise<void> {
		if (this.queue.length === 0) return;

		const repeatMode = this.getRepeatMode();

		if (repeatMode === "song") {
			const wasPlaying = this.player?.currentStatus?.playing || false;
			this.isSkippingTrack = true;
			await this.seek(0);
			if (wasPlaying) {
				await this.play();
			}
			setTimeout(() => {
				this.isSkippingTrack = false;
			}, 100);
			return;
		}

		let nextIndex = this.currentIndex + 1;

		if (nextIndex >= this.queue.length) {
			if (repeatMode === "queue") {
				nextIndex = 0;
			} else {
				return;
			}
		}

		await this.playSongAt(nextIndex);
	}

	async skipToPrevious(): Promise<void> {
		if (this.queue.length === 0) return;

		const status = this.player?.currentStatus;
		const currentPosition = status?.currentTime || 0;

		const repeatMode = this.getRepeatMode();

		if (repeatMode === "song") {
			const wasPlaying = this.player?.currentStatus?.playing || false;
			this.isSkippingTrack = true;
			await this.seek(0);
			if (wasPlaying) {
				await this.play();
			}
			setTimeout(() => {
				this.isSkippingTrack = false;
			}, 100);
			return;
		}

		if (currentPosition > 3) {
			await this.seek(0);
			return;
		}

		let previousIndex = this.currentIndex - 1;

		if (previousIndex < 0) {
			if (repeatMode === "queue") {
				previousIndex = this.queue.length - 1;
			} else {
				await this.seek(0);
				return;
			}
		}

		await this.playSongAt(previousIndex);
	}

	shuffleQueue(keepCurrentSong: boolean = true): void {
		if (this.queue.length <= 1) return;

		const currentSong =
			this.currentIndex >= 0 ? this.queue[this.currentIndex] : null;
		const newQueue = [...this.queue];

		for (let i = newQueue.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[newQueue[i], newQueue[j]] = [newQueue[j], newQueue[i]];
		}

		if (keepCurrentSong && currentSong) {
			const currentSongIndex = newQueue.findIndex(
				(t) => t.id === currentSong.id
			);
			if (currentSongIndex > 0) {
				newQueue.splice(currentSongIndex, 1);
				newQueue.unshift(currentSong);
			}
			this.currentIndex = 0;
		} else {
			this.currentIndex = -1;
		}

		this.queue = newQueue;
		this.emit("queueUpdate", this.queue);
	}

	getCurrentSong(): Song | null {
		return this.currentIndex >= 0 ? this.queue[this.currentIndex] : null;
	}

	getQueue(): Array<Song> {
		return [...this.queue];
	}

	getCurrentIndex(): number {
		return this.currentIndex;
	}

	private getRepeatMode(): RepeatMode {
		return this.repeatMode;
	}

	setRepeatMode(mode: RepeatMode): void {
		this.repeatMode = mode;
		this.emit("repeatModeUpdate", mode);
	}

	getRepeatModePublic(): RepeatMode {
		return this.repeatMode;
	}

	private async handleSongEnd(): Promise<void> {
		const repeatMode = this.getRepeatMode();

		if (repeatMode === "song") {
			await this.seek(0);
			await this.play();
		} else if (
			repeatMode === "queue" ||
			this.currentIndex < this.queue.length - 1
		) {
			await this.skipToNext();
		}
	}

	async setVolume(volumeLevel: number): Promise<void> {
		if (volumeLevel < 0 || volumeLevel > 1) {
			console.warn("Volume must be between 0 and 1, clamping value");
			volumeLevel = Math.max(0, Math.min(1, volumeLevel));
		}

		this.volume = volumeLevel;

		if (this.player) {
			try {
				this.player.volume = volumeLevel;
			} catch (error) {
				console.error("Error setting volume:", error);
			}
		}

		this.emit("volumeUpdate", this.volume);
	}

	getVolume(): number {
		return this.volume;
	}

	async cleanup(): Promise<void> {
		if (this.player) {
			this.player.remove();
			this.player = null;
		}
		this.queue = [];
		this.currentIndex = -1;
		this.isInitialised = false;
		this.listeners.clear();
	}
}

export default new AudioService();
