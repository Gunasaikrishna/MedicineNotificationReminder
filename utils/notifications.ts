import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestNotificationsPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleNotification({
  title,
  body,
  trigger,
}: {
  title: string;
  body: string;
  trigger: Date;
}) {
  const hasPermission = await requestNotificationsPermission();
  
  if (!hasPermission) {
    console.log('No notification permission');
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: {
      hour: trigger.getHours(),
      minute: trigger.getMinutes(),
      repeats: true,
    },
  });
}