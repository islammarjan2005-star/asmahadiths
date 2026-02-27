let permissionGranted = false;

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') {
    permissionGranted = true;
    return true;
  }
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  permissionGranted = result === 'granted';
  return permissionGranted;
}

export function isNotificationSupported() {
  return 'Notification' in window;
}

export function getPermissionStatus() {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

export function sendNotification(title, options = {}) {
  if (!permissionGranted && Notification.permission !== 'granted') return;
  try {
    new Notification(title, {
      icon: '/asmahadiths/vite.svg',
      badge: '/asmahadiths/vite.svg',
      ...options,
    });
  } catch {
    // Notification API may fail in some contexts
  }
}

// Schedule a notification after a delay (in minutes)
// Note: This only works while the app/tab is open
let scheduledTimers = [];

export function scheduleNotification(title, options = {}, delayMinutes = 0) {
  if (delayMinutes <= 0) {
    sendNotification(title, options);
    return;
  }
  const timer = setTimeout(() => {
    sendNotification(title, options);
  }, delayMinutes * 60 * 1000);
  scheduledTimers.push(timer);
  return timer;
}

export function clearAllScheduled() {
  scheduledTimers.forEach(clearTimeout);
  scheduledTimers = [];
}

// Schedule prayer reminders based on prayer times
export function schedulePrayerReminders(prayerTimes) {
  if (!prayerTimes || !permissionGranted) return;
  clearAllScheduled();

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const prayers = [
    { name: 'Fajr', time: prayerTimes.fajr },
    { name: 'Dhuhr', time: prayerTimes.dhuhr },
    { name: 'Asr', time: prayerTimes.asr },
    { name: 'Maghrib', time: prayerTimes.maghrib },
    { name: 'Isha', time: prayerTimes.isha },
  ];

  prayers.forEach(({ name, time }) => {
    const [h, m] = time.split(':').map(Number);
    const prayerMinutes = h * 60 + m;
    const reminderMinutes = prayerMinutes - 15; // 15 min before

    if (reminderMinutes > currentMinutes) {
      const delayMin = reminderMinutes - currentMinutes;
      scheduleNotification(
        `${name} in 15 minutes`,
        { body: `Time to prepare for ${name} prayer`, tag: `prayer-${name}` },
        delayMin
      );
    }
  });
}
