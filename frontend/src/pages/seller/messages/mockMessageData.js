// Define the logged-in artisan's ID for consistent use in mock data.
export const currentArtisanId = 'artisan1';

const mockUsers = {
    [currentArtisanId]: { _id: currentArtisanId, name: 'Your Shop', profilePicture: `https://i.pravatar.cc/150?u=${currentArtisanId}` },
    'customer1': { _id: 'customer1', name: 'Priya Patel', profilePicture: 'https://i.pravatar.cc/150?u=customer1' },
    'customer2': { _id: 'customer2', name: 'Amit Singh', profilePicture: 'https://i.pravatar.cc/150?u=customer2' },
    'customer3': { _id: 'customer3', name: 'Sunita Rao', profilePicture: 'https://i.pravatar.cc/150?u=customer3' },
};

export const mockConversations = [
    {
        _id: 'convo1',
        participants: [mockUsers[currentArtisanId], mockUsers['customer1']],
        lastMessage: {
            senderId: 'customer1',
            content: 'That sounds great, thank you!',
            createdAt: new Date(new Date().setHours(new Date().getHours() - 2)),
        },
        messages: [
            { _id: 'msg1', senderId: 'customer1', content: 'Hi! I was wondering if you could make the vase in blue?', createdAt: new Date(new Date().setHours(new Date().getHours() - 3)) },
            { _id: 'msg2', senderId: currentArtisanId, content: 'Hello! Yes, absolutely. A custom blue glaze would take an extra 2 days. Is that okay?', createdAt: new Date(new Date().setHours(new Date().getHours() - 2.5)) },
            { _id: 'msg3', senderId: 'customer1', content: 'That sounds great, thank you!', createdAt: new Date(new Date().setHours(new Date().getHours() - 2)) },
        ]
    },
    {
        _id: 'convo2',
        participants: [mockUsers[currentArtisanId], mockUsers['customer2']],
        lastMessage: {
            senderId: currentArtisanId,
            content: 'Your custom sign is ready and will be shipped tomorrow.',
            createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
        },
        messages: [
            { _id: 'msg4', senderId: 'customer2', content: 'Just checking in on the status of my custom wooden sign order.', createdAt: new Date(new Date().setDate(new Date().getDate() - 1)) },
            { _id: 'msg5', senderId: currentArtisanId, content: 'Your custom sign is ready and will be shipped tomorrow.', createdAt: new Date(new Date().setDate(new Date().getDate() - 1)) },
        ]
    },
    {
        _id: 'convo3',
        participants: [mockUsers[currentArtisanId], mockUsers['customer3']],
        lastMessage: {
            senderId: 'customer3',
            content: 'Do you offer gift wrapping?',
            createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
        },
        messages: [
            { _id: 'msg6', senderId: 'customer3', content: 'Do you offer gift wrapping?', createdAt: new Date(new Date().setDate(new Date().getDate() - 3)) },
        ]
    }
];
