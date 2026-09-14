import { Tabs, router } from 'expo-router';
import { CustomTabBar } from '../../src/navigation/CustomTabBar';
import { toCustomTabBarProps } from '../../src/navigation/tabBarAdapter';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => {
        const routeNames = props.state.routes.map((route) => route.name);
        const activeRouteName = props.state.routes[props.state.index].name;
        const tabBarProps = toCustomTabBarProps(
          routeNames,
          activeRouteName,
          (key) => props.navigation.navigate(key),
          () => router.push('/capture'),
        );
        return <CustomTabBar {...tabBarProps} />;
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="history" />
      <Tabs.Screen name="goals" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
