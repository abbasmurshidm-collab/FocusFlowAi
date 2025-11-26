import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Habit from '@/models/Habit';
import User from '@/models/User';

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;
        const updates = await req.json();

        await dbConnect();

        const habit = await Habit.findOne({ _id: id, userId: session.user.id });

        if (!habit) {
            return NextResponse.json(
                { error: 'Habit not found' },
                { status: 404 }
            );
        }

        // Handle completion logic
        if (updates.completedDate) {
            const date = new Date(updates.completedDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Check if already completed today
            const alreadyCompleted = habit.completedDates.some((d: Date) => {
                const completed = new Date(d);
                completed.setHours(0, 0, 0, 0);
                return completed.getTime() === date.getTime();
            });

            if (!alreadyCompleted) {
                habit.completedDates.push(date);
                habit.streak += 1;

                // Award XP to user
                await User.findByIdAndUpdate(session.user.id, {
                    $inc: { xp: 10 } // 10 XP per habit completion
                });
            }
        } else {
            // Regular update
            Object.assign(habit, updates);
        }

        await habit.save();

        return NextResponse.json({ habit });
    } catch (error) {
        console.error('Error updating habit:', error);
        return NextResponse.json(
            { error: 'Failed to update habit' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;

        await dbConnect();

        const habit = await Habit.findOne({ _id: id, userId: session.user.id });

        if (!habit) {
            return NextResponse.json(
                { error: 'Habit not found' },
                { status: 404 }
            );
        }

        // Soft delete (archive)
        habit.archived = true;
        await habit.save();

        return NextResponse.json({ message: 'Habit archived successfully' });
    } catch (error) {
        console.error('Error deleting habit:', error);
        return NextResponse.json(
            { error: 'Failed to delete habit' },
            { status: 500 }
        );
    }
}
