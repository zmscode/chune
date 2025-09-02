import { PlayerScreen } from "@/components/player/PlayerScreen";
import { SheetData } from "@/types";
import { SheetManager } from "react-native-actions-sheet";
import { registerSheet } from "react-native-actions-sheet";

export const sheets: Array<SheetData> = [
	{
		title: "player",
		onOpen: () => SheetManager.show("player"),
	},
];

registerSheet("player", PlayerScreen);
