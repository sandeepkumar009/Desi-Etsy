/*
================================================================================
File: frontend/src/pages/seller/ChatWindow.jsx (Updated Code)
Description: This component is updated to correctly align messages. Sent
             messages now appear on the right with a branded color, and
             received messages appear on the left.
================================================================================
*/
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../../components/common/Button';
import { currentArtisanId } from './mockMessageData'; // Import the mock ID

const ChatWindow = ({ conversation, onSendMessage }) => {
    const { user } = useAuth(); // We still get the user for their real profile picture
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Find the other participant in the conversation
    const otherParticipant = conversation.participants.find(p => p._id !== currentArtisanId);

    // Auto-scroll to the bottom when new messages are added or conversation changes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation.messages]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(conversation._id, newMessage.trim());
            setNewMessage('');
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center gap-4 bg-white">
                <img 
                    src={otherParticipant?.profilePicture || 'https://i.pravatar.cc/150'} 
                    alt={otherParticipant?.name}
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                    <h3 className="font-semibold text-gray-800">{otherParticipant?.name || 'Unknown User'}</h3>
                    <p className="text-xs text-green-500">Online</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-grow p-6 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                    {conversation.messages.map(message => {
                        // === THE FIX ===
                        // Compare with the consistent mock ID instead of the real user._id
                        const isSentByMe = message.senderId === currentArtisanId;

                        return (
                            <div key={message._id} className={`flex items-end gap-2 ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
                                {!isSentByMe && (
                                    <img src={otherParticipant?.profilePicture} alt={otherParticipant?.name} className="w-6 h-6 rounded-full self-start" />
                                )}
                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                    isSentByMe 
                                    ? 'bg-indigo-600 text-white rounded-br-none' 
                                    : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                                }`}>
                                    <p className="text-sm">{message.content}</p>
                                </div>
                                {isSentByMe && (
                                     <img src={user?.profilePicture || `https://i.pravatar.cc/150?u=${currentArtisanId}`} alt={user?.name} className="w-6 h-6 rounded-full self-start" />
                                )}
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Message Input Form */}
            <div className="p-4 border-t bg-white">
                <form onSubmit={handleFormSubmit} className="flex items-center gap-4">
                    <input 
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        autoComplete="off"
                    />
                    <Button type="submit" className="rounded-full">Send</Button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;
