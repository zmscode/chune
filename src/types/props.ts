import { ViewStyle } from "react-native";
import { StyleProps } from "react-native-reanimated";

export type SideScrollingTextProps = {
	text: string;
	animationThreshold: number;
	style?: StyleProps;
};

export type PlayerControlsProps = {
	style?: ViewStyle;
	iconSize?: number;
};
