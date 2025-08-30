import { create } from "zustand";
import { DeviceState } from "@/types";
import { Dimensions, Platform } from "react-native";

export const getInitialDeviceState = (): DeviceState => {
	const { width, height } = Dimensions.get("window");
	return {
		os: Platform.OS,
		isMobile:
			Platform.OS === "android" || Platform.OS === "ios" ? true : false,
		width: width,
		height: height,
		isPortrait: height > width,
	};
};

export const useDeviceStore = create<DeviceState>()(() =>
	getInitialDeviceState()
);

Dimensions.addEventListener("change", ({ window }) => {
	useDeviceStore.setState({
		isPortrait: window.height > window.width,
	});
});
