/*
================================================================================
File: frontend/src/pages/seller/MessagesPage.jsx (New File)
Description: The main page for the messaging system. It features a two-column
             layout for the conversation list and the active chat window.
================================================================================
*/
import React, { useState } from 'react';
import { mockConversations } from './mockMessageData';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';

const MessagesPage = () => {
    const [conversations, setConversations] = useState(mockConversations);
    const [activeConversationId, setActiveConversationId] = useState(conversations[0]?._id);

    const activeConversation = conversations.find(c => c._id === activeConversationId);

    const handleSendMessage = (conversationId, messageContent) => {
        const newMessage = {
            _id: `msg${Date.now()}`,
            senderId: 'artisan1', // Assuming the current user is the artisan
            content: messageContent,
            createdAt: new Date(),
        };

        const updatedConversations = conversations.map(convo => {
            if (convo._id === conversationId) {
                return {
                    ...convo,
                    messages: [...convo.messages, newMessage],
                    lastMessage: newMessage,
                };
            }
            return convo;
        });

        console.log("Sending message:", newMessage);
        setConversations(updatedConversations);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Messages</h1>
            <div className="bg-white rounded-lg shadow-md h-[75vh] flex">
                {/* Left Column: Conversation List */}
                <div className="w-1/3 border-r border-gray-200">
                    <ConversationList 
                        conversations={conversations}
                        activeConversationId={activeConversationId}
                        onSelectConversation={setActiveConversationId}
                    />
                </div>

                {/* Right Column: Chat Window */}
                <div className="w-2/3 flex flex-col">
                    {activeConversation ? (
                        <ChatWindow 
                            conversation={activeConversation}
                            onSendMessage={handleSendMessage}
                        />
                    ) : (
                        <div className="flex-grow flex items-center justify-center text-gray-500">
                            <p>Select a conversation to start messaging.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;
