import { useMemo } from "react";
import { create } from "zustand";
import { QueueStore } from "@/types";
import { persist } from "zustand/middleware";
import AudioService from "@/core/AudioService";
import { useAudioStore } from "@/stores/audioStore";

export const useQueueStore = create<QueueStore>()(
	persist(
		(set, get) => ({
			activeQueue: null,
			queueHistory: [],
			originalQueue: null,
			upNext: [],

			setActiveQueue: (metadata, songs) => {
				const currentQueue = get().activeQueue;

				if (currentQueue && currentQueue.id !== metadata.id) {
					set((state) => ({
						queueHistory: [
							...state.queueHistory.slice(-9),
							currentQueue,
						],
					}));
				}

				set({
					activeQueue: metadata,
					originalQueue: null,
				});

				AudioService.setQueue(songs);
			},

			clearActiveQueue: () =>
				set({
					activeQueue: null,
					originalQueue: null,
					upNext: [],
				}),

			addToUpNext: (song) =>
				set((state) => ({
					upNext: [...state.upNext, song],
				})),

			removeFromUpNext: (songId) =>
				set((state) => ({
					upNext: state.upNext.filter((s) => s.id !== songId),
				})),

			clearUpNext: () => set({ upNext: [] }),

			saveOriginalQueue: (songs) => set({ originalQueue: songs }),

			restoreOriginalQueue: () => {
				const original = get().originalQueue;
				set({ originalQueue: null });
				return original;
			},

			addToHistory: (metadata) =>
				set((state) => ({
					queueHistory: [...state.queueHistory.slice(-9), metadata],
				})),

			getPreviousQueue: () => {
				const history = get().queueHistory;
				if (history.length === 0) return null;

				const previous = history[history.length - 1];
				set((state) => ({
					queueHistory: state.queueHistory.slice(0, -1),
				}));

				return previous;
			},
		}),
		{
			name: "queue-storage",
			partialize: (state) => ({
				activeQueue: state.activeQueue,
				queueHistory: state.queueHistory.slice(-3),
			}),
		}
	)
);

export const useActiveQueue = () => useQueueStore((state) => state.activeQueue);

export const useUpNext = () => useQueueStore((state) => state.upNext);

export const useSetActiveQueue = () => useQueueStore((state) => state.setActiveQueue);

export const useQueueActions = () =>
	useQueueStore((state) => ({
		setActiveQueue: state.setActiveQueue,
		clearActiveQueue: state.clearActiveQueue,
		addToUpNext: state.addToUpNext,
		removeFromUpNext: state.removeFromUpNext,
		clearUpNext: state.clearUpNext,
	}));

export const useQueueWithAudio = () => {
	const { activeQueue, upNext } = useQueueStore();
	const { queue: currentSongs } = useAudioStore();

	const fullQueue = useMemo(
		() => [...currentSongs, ...upNext],
		[currentSongs, upNext]
	);

	return {
		activeQueue,
		songs: fullQueue,
		upNext,
		currentQueueSize: currentSongs.length,
		upNextSize: upNext.length,
	};
};
