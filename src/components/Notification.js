import React, { useState, useEffect } from 'react';

const NotificationContainer = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Use this effect to manage notifications

        // Example: Add a new notification
        const newNotification = {
            id: Date.now(),
            text: 'This is a notification!',
        };

        // Add the new notification to the list
        setNotifications([...notifications, newNotification]);

        // You can remove notifications after a specific duration or when the user dismisses them
        // For this example, we'll remove them after 5 seconds
        setTimeout(() => {
            removeNotification(newNotification.id);
        }, 5000);
    }, []);

    const removeNotification = (id) => {
        const updatedNotifications = notifications.filter((notification) => notification.id !== id);
        setNotifications(updatedNotifications);
    };

    return (
        <div className="notification-container">
            {notifications.map((notification) => (
                <div className="notification" key={notification.id}>
                    <p>{notification.text}</p>
                    <button onClick={() => removeNotification(notification.id)}>Dismiss</button>
                </div>
            ))}
        </div>
    );
};

export default NotificationContainer;