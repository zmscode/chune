export const MusicPlayer: React.FC = () => {
	// Initialize player on mount
	useInitializePlayer();

	// Get current track and controls
	const currentTrack = useCurrentTrack();
	const controls = useAudioControls();
	const { isPlaying, isLoading, volume } = usePlaybackState();
	const { progress, formattedCurrentTime, formattedDuration } =
		usePlaybackProgress();
	const {
		shuffleMode,
		repeatMode,
		toggleShuffle,
		cycleRepeatMode,
		setVolume,
	} = usePlayerSettings();

	// Subscribe to player events
	usePlayerEvents({
		onTrackChange: (track) => {
			console.log("Now playing:", track?.title);
		},
		onProgressUpdate: (current, duration) => {
			// Update UI or perform actions based on progress
		},
	});

	/**
	 * Example App Component showing how to integrate everything
	 */
	export const MusicApp: React.FC = () => {
		return (
			<View style={{ flex: 1 }}>
				{/* Main content - could be navigation stack */}
				<View style={{ flex: 1 }}>
					<TrackList />
				</View>

				{/* Persistent mini player at bottom */}
				<MiniPlayer />
			</View>
		);
	};

	/**
	 * Example of using player in a custom component
	 */
	export const CustomPlaylistView: React.FC<{ playlistName: string }> = ({
		playlistName,
	}) => {
		const { setQueue, playTrackAtIndex } = useQueueControls();
		const library: Track[] = libraryData;

		// Filter tracks by playlist
		const playlistTracks = library.filter((track) =>
			track.playlist?.includes(playlistName)
		);

		const handlePlayPlaylist = () => {
			setQueue(playlistTracks);
			if (playlistTracks.length > 0) {
				playTrackAtIndex(0);
			}
		};

		return (
			<View>
				<TouchableOpacity
					onPress={handlePlayPlaylist}
					style={styles.playlistHeader}
				>
					<Text style={styles.playlistTitle}>{playlistName}</Text>
					<Text style={styles.playButton}>▶️ Play All</Text>
				</TouchableOpacity>

				<FlatList
					data={playlistTracks}
					keyExtractor={(item) => item.url}
					renderItem={({ item, index }) => (
						<TrackListItem track={item} index={index} />
					)}
				/>
			</View>
		);
	};

	/**
	 * Example of programmatic control from anywhere in your app
	 */
	export const useAudioCommands = () => {
		const store = useAudioPlayerStore();

		// Example: Play a specific track by title
		const playTrackByTitle = (title: string) => {
			const library: Track[] = libraryData;
			const track = library.find((t) => t.title === title);

			if (track) {
				store.loadTrack(track);
			}
		};

		// Example: Play random track
		const playRandomTrack = () => {
			const library: Track[] = libraryData;
			const randomIndex = Math.floor(Math.random() * library.length);
			store.loadTrack(library[randomIndex]);
		};

		// Example: Create and play a custom queue
		const playCustomQueue = (filter: (track: Track) => boolean) => {
			const library: Track[] = libraryData;
			const filteredTracks = library.filter(filter);

			if (filteredTracks.length > 0) {
				store.setQueue(filteredTracks);
				store.playTrackAtIndex(0);
			}
		};

		return {
			playTrackByTitle,
			playRandomTrack,
			playCustomQueue,
		};
	};

	// Additional styles for new components
	const additionalStyles = StyleSheet.create({
		playlistHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			padding: 15,
			backgroundColor: "#f5f5f5",
		},
		playlistTitle: {
			fontSize: 18,
			fontWeight: "bold",
		},
		playButton: {
			fontSize: 16,
			color: "#007AFF",
		},
	});

	// Merge styles
	Object.assign(styles, additionalStyles);

	if (!currentTrack) {
		return (
			<View style={styles.playerContainer}>
				<Text style={styles.noTrackText}>No track selected</Text>
			</View>
		);
	}

	return (
		<View style={styles.playerContainer}>
			{/* Album Art */}
			{currentTrack.artwork && (
				<Image
					source={{ uri: currentTrack.artwork }}
					style={styles.artwork}
				/>
			)}

			{/* Track Info */}
			<Text style={styles.title}>{currentTrack.title}</Text>
			{currentTrack.artist && (
				<Text style={styles.artist}>{currentTrack.artist}</Text>
			)}

			{/* Progress Bar */}
			<View style={styles.progressContainer}>
				<Text style={styles.timeText}>{formattedCurrentTime}</Text>
				<Slider
					style={styles.progressSlider}
					value={progress}
					minimumValue={0}
					maximumValue={100}
					onSlidingComplete={(value) => {
						const duration =
							usePlaybackProgress.getState().duration;
						controls.seekTo((value / 100) * duration);
					}}
				/>
				<Text style={styles.timeText}>{formattedDuration}</Text>
			</View>

			{/* Playback Controls */}
			<View style={styles.controlsContainer}>
				<TouchableOpacity onPress={toggleShuffle}>
					<Text
						style={[
							styles.controlButton,
							shuffleMode && styles.activeControl,
						]}
					>
						🔀
					</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={controls.skipToPrevious}>
					<Text style={styles.controlButton}>⏮️</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={controls.togglePlayPause}
					disabled={isLoading}
				>
					{isLoading ? (
						<ActivityIndicator />
					) : (
						<Text style={styles.mainControlButton}>
							{isPlaying ? "⏸️" : "▶️"}
						</Text>
					)}
				</TouchableOpacity>

				<TouchableOpacity onPress={controls.skipToNext}>
					<Text style={styles.controlButton}>⏭️</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={cycleRepeatMode}>
					<Text
						style={[
							styles.controlButton,
							repeatMode !== "off" && styles.activeControl,
						]}
					>
						{repeatMode === "track"
							? "🔂"
							: repeatMode === "queue"
							? "🔁"
							: "➡️"}
					</Text>
				</TouchableOpacity>
			</View>

			{/* Volume Control */}
			<View style={styles.volumeContainer}>
				<Text style={styles.volumeIcon}>🔊</Text>
				<Slider
					style={styles.volumeSlider}
					value={volume}
					minimumValue={0}
					maximumValue={1}
					onValueChange={setVolume}
				/>
			</View>
		</View>
	);
};

/**
 * Track List Component
 */
export const TrackList: React.FC = () => {
	const { setQueue, playTrackAtIndex } = useQueueControls();
	const library: Track[] = libraryData;

	useEffect(() => {
		// Set the library as the initial queue
		setQueue(library);
	}, []);

	return (
		<FlatList
			data={library}
			keyExtractor={(item) => item.url}
			renderItem={({ item, index }) => (
				<TrackListItem track={item} index={index} />
			)}
		/>
	);
};

/**
 * Individual Track List Item
 */
const TrackListItem: { track: Track; index: number } = ({ track, index }) => {
	const isPlaying = useIsTrackPlaying(track.url);
	const { playTrackAtIndex } = useQueueControls();

	return (
		<TouchableOpacity
			style={[styles.trackItem, isPlaying && styles.activeTrack]}
			onPress={() => playTrackAtIndex(index)}
		>
			{track.artwork && (
				<Image
					source={{ uri: track.artwork }}
					style={styles.trackArtwork}
				/>
			)}
			<View style={styles.trackInfo}>
				<Text
					style={[styles.trackTitle, isPlaying && styles.activeText]}
				>
					{track.title}
				</Text>
				{track.artist && (
					<Text style={styles.trackArtist}>{track.artist}</Text>
				)}
				{track.playlist && track.playlist.length > 0 && (
					<Text style={styles.trackPlaylists}>
						{track.playlist.join(", ")}
					</Text>
				)}
			</View>
			{isPlaying && <Text style={styles.nowPlayingIndicator}>🎵</Text>}
		</TouchableOpacity>
	);
};

/**
 * Mini Player for use in tab bar or persistent UI
 */
export const MiniPlayer: React.FC = () => {
	const currentTrack = useCurrentTrack();
	const { togglePlayPause } = useAudioControls();
	const { isPlaying } = usePlaybackState();
	const { progress } = usePlaybackProgress();

	if (!currentTrack) return null;

	return (
		<View style={styles.miniPlayer}>
			<View style={styles.miniProgressBar}>
				<View
					style={[styles.miniProgress, { width: `${progress}%` }]}
				/>
			</View>

			<View style={styles.miniContent}>
				{currentTrack.artwork && (
					<Image
						source={{ uri: currentTrack.artwork }}
						style={styles.miniArtwork}
					/>
				)}

				<View style={styles.miniInfo}>
					<Text style={styles.miniTitle} numberOfLines={1}>
						{currentTrack.title}
					</Text>
					{currentTrack.artist && (
						<Text style={styles.miniArtist} numberOfLines={1}>
							{currentTrack.artist}
						</Text>
					)}
				</View>

				<TouchableOpacity
					onPress={togglePlayPause}
					style={styles.miniControl}
				>
					<Text>{isPlaying ? "⏸️" : "▶️"}</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

/**
 * Queue Manager Component
 */
export const QueueManager = () => {
	const { queue, currentIndex } = useQueue();
	const { removeFromQueue, playTrackAtIndex } = useQueueControls();

	return (
		<FlatList
			data={queue}
			keyExtractor={(item, index) => `${item.url}-${index}`}
			renderItem={({ item, index }) => (
				<View style={styles.queueItem}>
					<TouchableOpacity
						style={styles.queueItemContent}
						onPress={() => playTrackAtIndex(index)}
					>
						<Text
							style={[
								styles.queueItemTitle,
								index === currentIndex &&
									styles.currentQueueItem,
							]}
						>
							{index + 1}. {item.title}
						</Text>
						{item.artist && (
							<Text style={styles.queueItemArtist}>
								{item.artist}
							</Text>
						)}
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => removeFromQueue(index)}
						style={styles.removeButton}
					>
						<Text>❌</Text>
					</TouchableOpacity>
				</View>
			)}
		/>
	);
};
