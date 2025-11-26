import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Habit from '@/models/Habit';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const habits = await Habit.find({
            userId: session.user.id,
            archived: false,
        }).sort({ createdAt: -1 });

        return NextResponse.json({ habits });
    } catch (error) {
        console.error('Error fetching habits:', error);
        return NextResponse.json(
            { error: 'Failed to fetch habits' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title, description, frequency, customDays, reminderTime, category } = await req.json();

        if (!title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        const habit = await Habit.create({
            userId: session.user.id,
            title,
            description,
            frequency,
            customDays,
            reminderTime,
            category,
        });

        return NextResponse.json({ habit }, { status: 201 });
    } catch (error) {
        console.error('Error creating habit:', error);
        return NextResponse.json(
            { error: 'Failed to create habit' },
            { status: 500 }
        );
    }
}
