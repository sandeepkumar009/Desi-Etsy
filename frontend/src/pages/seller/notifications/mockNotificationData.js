/*
================================================================================
File: frontend/src/pages/seller/mockNotificationData.js (New File)
Description: Contains mock data for seller-specific notifications, based on
             the notificationModel.js schema.
================================================================================
*/
export const mockNotifications = [
    {
        _id: 'notif1',
        recipientId: 'artisanUserId',
        senderId: 'customerUserId1',
        type: 'new_order',
        message: 'You have a new order (#ORD12345) for "Hand-painted Ceramic Vase".',
        link: '/seller/orders/ORD12345',
        read: false,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 0)),
    },
    {
        _id: 'notif2',
        recipientId: 'artisanUserId',
        senderId: 'customerUserId1',
        type: 'new_review',
        message: 'Priya Patel left a 5-star review on "Hand-painted Ceramic Vase".',
        link: '/seller/products/1', // Link to the product page
        read: false,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    },
    {
        _id: 'notif3',
        recipientId: 'artisanUserId',
        senderId: 'customerUserId2',
        type: 'new_message',
        message: 'Amit Singh sent you a new message about "Custom Wooden Sign".',
        link: '/seller/messages/amit-singh', // Example link to a conversation
        read: true,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    },
    {
        _id: 'notif4',
        recipientId: 'artisanUserId',
        senderId: 'adminUserId',
        type: 'product_approved',
        message: 'Your new product "Woven Seagrass Basket" has been approved.',
        link: '/seller/products/2',
        read: true,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
    },
    {
        _id: 'notif5',
        recipientId: 'artisanUserId',
        type: 'low_stock', // Assuming this could be a future notification type
        message: 'Low stock alert: "Custom Wooden Sign" has only 5 items left.',
        link: '/seller/products/edit/3',
        read: false,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 4)),
    },
];
