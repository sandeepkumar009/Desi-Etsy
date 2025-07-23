import React from 'react';

// Configuration for status icons and colors
const statusConfig = {
    pending_payment: { icon: '💳', color: 'text-gray-500', ring: 'ring-gray-300' },
    paid: { icon: '💰', color: 'text-cyan-600', ring: 'ring-cyan-400' },
    processing: { icon: '⚙️', color: 'text-yellow-600', ring: 'ring-yellow-400' },
    packed: { icon: '📦', color: 'text-blue-600', ring: 'ring-blue-400' },
    shipped: { icon: '🚚', color: 'text-indigo-600', ring: 'ring-indigo-400' },
    delivered: { icon: '🏠', color: 'text-green-600', ring: 'ring-green-400' },
    cancelled: { icon: '❌', color: 'text-red-600', ring: 'ring-red-400' },
};

const OrderStatusTracker = ({ history, currentStatus }) => {
    // The history is naturally sorted newest-first from the backend, so we reverse it for chronological display.
    const chronologicalHistory = [...history].reverse();

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Status</h2>
            <div className="relative pl-4">
                {/* Vertical line */}
                <div className="absolute left-8 top-0 h-full w-0.5 bg-gray-200" aria-hidden="true"></div>

                <ul className="space-y-8">
                    {chronologicalHistory.map((event, index) => {
                        const config = statusConfig[event.status] || statusConfig.processing;
                        const isCurrent = event.status === currentStatus;

                        return (
                            <li key={index} className="relative flex items-center gap-4">
                                {/* Status Icon/Dot */}
                                <div className={`z-10 flex items-center justify-center h-8 w-8 rounded-full ring-4 ${isCurrent ? config.ring : 'ring-gray-200'} bg-white`}>
                                    <span className={`text-lg ${isCurrent ? '' : 'opacity-70'}`}>{config.icon}</span>
                                </div>

                                {/* Status Details */}
                                <div className="flex-grow">
                                    <p className={`font-bold capitalize ${isCurrent ? config.color : 'text-gray-700'}`}>
                                        {event.status.replace('_', ' ')}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(event.updatedAt).toLocaleString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default OrderStatusTracker;