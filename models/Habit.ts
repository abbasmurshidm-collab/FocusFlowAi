import mongoose, { Document, Schema } from 'mongoose';

export interface IHabit extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    frequency: 'daily' | 'weekly' | 'custom';
    customDays?: number[]; // 0-6 for Sunday-Saturday
    reminderTime?: string; // HH:MM
    streak: number;
    completedDates: Date[];
    category: string;
    archived: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const HabitSchema = new Schema<IHabit>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Please provide a habit title'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'custom'],
            default: 'daily',
        },
        customDays: {
            type: [Number], // Array of day indices (0-6)
            default: [],
        },
        reminderTime: {
            type: String,
            match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        },
        streak: {
            type: Number,
            default: 0,
        },
        completedDates: {
            type: [Date],
            default: [],
        },
        category: {
            type: String,
            default: 'General',
        },
        archived: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient querying of user's active habits
HabitSchema.index({ userId: 1, archived: 1 });

export default mongoose.models.Habit || mongoose.model<IHabit>('Habit', HabitSchema);
