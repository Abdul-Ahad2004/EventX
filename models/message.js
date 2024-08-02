import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    sender: {
      id: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'sender.model',
      },
      model: {
        type: String,
        required: true,
        enum: ['User', 'Planner'],
      }
    },
    receiver: {
      id: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'receiver.model', 
      },
      model: {
        type: String,
        required: true,
        enum: ['User', 'Planner'], 
      }
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, 
  }
);

export const Message = mongoose.model("Message", messageSchema);
