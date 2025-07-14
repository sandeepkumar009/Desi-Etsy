import mongoose from 'mongoose';

//  Message Model * Represents a single message within a conversation.
const MessageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    // To track if the message has been read by the recipient(s)
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
}, { timestamps: true });

MessageSchema.index({ conversationId: 1 });

const Message = mongoose.model('Message', MessageSchema);
export default Message;
