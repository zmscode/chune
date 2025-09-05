import { FontWeight, TextVariant, ThemedTextProps } from "@/types";
import { TextStyle } from "react-native";

const getFontFamily = (weight: FontWeight): string => {
	const fontMap: Record<FontWeight, string> = {
		thin: "MartianGrotesk-Thin",
		extraLight: "MartianGrotesk-ExtraLight",
		light: "MartianGrotesk-Light",
		regular: "MartianGrotesk-Regular",
		medium: "MartianGrotesk-Medium",
		semiBold: "MartianGrotesk-SemiBold",
		bold: "MartianGrotesk-Bold",
		extraBold: "MartianGrotesk-ExtraBold",
		black: "MartianGrotesk-Black",
	};

	return fontMap[weight];
};

const variantStyles: Record<
	TextVariant,
	{ weight: FontWeight; fontSize: number; lineHeight?: number }
> = {
	heading1: {
		weight: "bold",
		fontSize: 28,
		lineHeight: 36,
	},
	heading2: {
		weight: "bold",
		fontSize: 24,
		lineHeight: 32,
	},
	heading3: {
		weight: "semiBold",
		fontSize: 20,
		lineHeight: 28,
	},
	body: {
		weight: "regular",
		fontSize: 16,
		lineHeight: 24,
	},
	bodySmall: {
		weight: "regular",
		fontSize: 14,
		lineHeight: 20,
	},
	caption: {
		weight: "medium",
		fontSize: 12,
		lineHeight: 16,
	},
	button: {
		weight: "semiBold",
		fontSize: 16,
		lineHeight: 24,
	},
	label: {
		weight: "medium",
		fontSize: 14,
		lineHeight: 20,
	},
};

export const ThemedText = ({
	variant = "body",
	weight,
	color = "#171f21",
	style,
	children,
}: ThemedTextProps) => {
	const baseStyle = variantStyles[variant];
	const fontWeight = weight || baseStyle.weight;

	const textStyle: TextStyle = {
		fontFamily: getFontFamily(fontWeight),
		fontSize: baseStyle.fontSize,
		lineHeight: baseStyle.lineHeight,
		color,
	};

	return <Text style={[textStyle, style]}>{children}</Text>;
};
