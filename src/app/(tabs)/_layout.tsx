import { FloatingPlayer } from "@/components/player/FloatingPlayer";
import { Tabs } from "expo-router";
import { HeartIcon, MusicNoteIcon, PlaylistIcon } from "phosphor-react-native";

const TabsNavigation = () => {
	return (
		<>
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: "#91dc6e",
					tabBarLabelStyle: {
						fontSize: 12,
						fontWeight: "500",
					},
					headerShown: false,
					tabBarStyle: {
						position: "absolute",
						borderTopLeftRadius: 20,
						borderTopRightRadius: 20,
						borderTopWidth: 0,
						paddingTop: 0,
						paddingBottom: 4,
					},
				}}
			>
				<Tabs.Screen
					name="(songs)"
					options={{
						title: "Songs",
						tabBarIcon: ({ color }: { color: string }) => (
							<MusicNoteIcon size={24} color={color} />
						),
					}}
				/>

				<Tabs.Screen
					name="favourites"
					options={{
						title: "Favourites",
						tabBarIcon: ({ color }: { color: string }) => (
							<HeartIcon size={24} color={color} />
						),
					}}
				/>

				<Tabs.Screen
					name="playlists"
					options={{
						title: "Playlists",
						tabBarIcon: ({ color }: { color: string }) => (
							<PlaylistIcon size={24} color={color} />
						),
					}}
				/>
			</Tabs>

			<FloatingPlayer
				style={{
					position: "absolute",
					left: 8,
					right: 8,
					bottom: 65,
				}}
			/>
		</>
	);
};

export default TabsNavigation;
