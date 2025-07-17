import React from 'react';
import { currentArtisanId } from './mockMessageData';

const ConversationList = ({ conversations, activeConversationId, onSelectConversation }) => {

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Inbox</h2>
            </div>
            <ul className="overflow-y-auto flex-grow">
                {conversations.map(convo => {
                    // Find the other participant (the customer)
                    const otherParticipant = convo.participants.find(p => p._id !== currentArtisanId);
                    const isActive = convo._id === activeConversationId;

                    return (
                        <li key={convo._id}>
                            <button 
                                onClick={() => onSelectConversation(convo._id)}
                                className={`w-full text-left p-4 flex items-center gap-4 transition-colors ${isActive ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                            >
                                <img 
                                    src={otherParticipant?.profilePicture || 'https://i.pravatar.cc/150'} 
                                    alt={otherParticipant?.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-grow overflow-hidden">
                                    <p className={`font-semibold ${isActive ? 'text-indigo-700' : 'text-gray-800'}`}>
                                        {otherParticipant?.name || 'Unknown User'}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">
                                        {convo.lastMessage.content}
                                    </p>
                                </div>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ConversationList;
