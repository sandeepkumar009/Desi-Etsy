import mongoose from 'mongoose';

// Conversation Model * Represents a single message thread between two or more participants.
const ConversationSchema = new mongoose.Schema({
    // Array of user IDs participating in the conversation
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    // Reference to the most recent message for quick display
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },
}, { timestamps: true });

ConversationSchema.index({ participants: 1 });

const Conversation = mongoose.model('Conversation', ConversationSchema);
export default Conversation;
