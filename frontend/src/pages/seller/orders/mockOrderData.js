export const mockOrders = [
    {
        _id: 'ORD12345',
        userId: { name: 'Priya Patel', email: 'priya.p@example.com' },
        items: [
            { productId: { _id: '1', name: 'Hand-painted Ceramic Vase', price: 3500, image: 'https://placehold.co/100x100/a3e635/333?text=Vase', description: 'A beautifully hand-painted ceramic vase, perfect for home decor.' }, quantity: 1 },
        ],
        totalAmount: 3500,
        shippingAddress: { addressLine1: '45, Jubilee Hills', city: 'Hyderabad', state: 'Telangana', postalCode: '500033', country: 'India' },
        status: 'processing',
        createdAt: new Date('2025-07-16T14:30:00Z'),
        statusHistory: [
            { status: 'processing', updatedAt: new Date('2025-07-16T14:31:00Z') },
            { status: 'paid', updatedAt: new Date('2025-07-16T14:30:05Z') },
        ],
    },
    {
        _id: 'ORD12346',
        userId: { name: 'Amit Singh', email: 'amit.s@example.com' },
        items: [
            { productId: { _id: '2', name: 'Woven Seagrass Basket', price: 1250, image: 'https://placehold.co/100x100/fcd34d/333?text=Basket', description: 'Eco-friendly and stylish woven seagrass basket.' }, quantity: 2 },
            { productId: { _id: '3', name: 'Custom Wooden Sign', price: 5500, image: 'https://placehold.co/100x100/93c5fd/333?text=Sign', description: 'A personalized wooden sign, crafted from high-quality pine.' }, quantity: 1 },
        ],
        totalAmount: 8000,
        shippingAddress: { addressLine1: '789, Koramangala', city: 'Bengaluru', state: 'Karnataka', postalCode: '560034', country: 'India' },
        status: 'packed',
        createdAt: new Date('2025-07-15T18:00:00Z'),
        statusHistory: [
            { status: 'packed', updatedAt: new Date('2025-07-16T10:00:00Z') },
            { status: 'processing', updatedAt: new Date('2025-07-15T18:01:00Z') },
        ],
    },
    {
        _id: 'ORD12347',
        userId: { name: 'Sunita Rao', email: 'sunita.r@example.com' },
        items: [
            { productId: { _id: '1', name: 'Hand-painted Ceramic Vase', price: 3500, image: 'https://placehold.co/100x100/a3e635/333?text=Vase', description: 'A beautifully hand-painted ceramic vase, perfect for home decor.' }, quantity: 1 },
        ],
        totalAmount: 3500,
        shippingAddress: { addressLine1: '101, Park Street', city: 'Kolkata', state: 'West Bengal', postalCode: '700016', country: 'India' },
        status: 'shipped',
        createdAt: new Date('2025-07-14T09:15:00Z'),
        statusHistory: [
            { status: 'shipped', updatedAt: new Date('2025-07-15T16:30:00Z') },
            { status: 'packed', updatedAt: new Date('2025-07-15T11:00:00Z') },
            { status: 'processing', updatedAt: new Date('2025-07-14T09:16:00Z') },
        ],
    },
     {
        _id: 'ORD12348',
        userId: { name: 'Rohan Verma', email: 'rohan.v@example.com' },
        items: [
            { productId: { _id: '4', name: 'Macrame Wall Hanging', price: 2200, image: 'https://placehold.co/100x100/fca5a5/333?text=Macrame', description: 'Intricate macrame wall hanging to add a bohemian touch to your space.' }, quantity: 1 },
        ],
        totalAmount: 2200,
        shippingAddress: { addressLine1: '22, Malabar Hill', city: 'Mumbai', state: 'Maharashtra', postalCode: '400006', country: 'India' },
        status: 'delivered',
        createdAt: new Date('2025-07-10T11:20:00Z'),
        statusHistory: [
            { status: 'delivered', updatedAt: new Date('2025-07-13T14:00:00Z') },
            { status: 'shipped', updatedAt: new Date('2025-07-11T17:00:00Z') },
            { status: 'packed', updatedAt: new Date('2025-07-11T09:30:00Z') },
            { status: 'processing', updatedAt: new Date('2025-07-10T11:21:00Z') },
        ],
    },
];
