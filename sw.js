// Service Worker für NBA- & Dashboard-Push-Benachrichtigungen
const DEFAULT_ICON = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%230b110f"/><text x="50" y="70" font-size="60" text-anchor="middle">🏀</text></svg>';

self.addEventListener('push', function(event) {
    let data = {
        title: '🏀 NBA Endergebnis',
        body: 'Es gibt ein neues Spielergebnis!',
        icon: DEFAULT_ICON,
        badge: DEFAULT_ICON,
        url: './',
        eventKey: 'nba-push'
    };

    if (event.data) {
        try {
            const parsed = event.data.json();
            data = { ...data, ...parsed };
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: data.icon || DEFAULT_ICON,
        badge: data.badge || data.icon || DEFAULT_ICON,
        tag: data.eventKey || 'nba-push',
        renotify: true,
        vibrate: [200, 100, 200],
        data: {
            url: data.url || './'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title || '🏀 NBA Endergebnis', options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    const targetUrl = event.notification.data?.url || './';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (const client of clientList) {
                if ('focus' in client) {
                    if ('navigate' in client && client.url !== targetUrl) {
                        client.navigate(targetUrl);
                    }
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
