import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Find first goal or create default
        let goal = await prisma.goal.findFirst();

        if (!goal) {
            goal = await prisma.goal.create({
                data: {
                    targetAmount: 500000, // $5,000.00 default (stored as cents)
                    currency: 'USD',
                }
            });
        }

        return NextResponse.json(goal);
    } catch (error) {
        console.error('Goal fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch goal' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, targetAmount, currency } = body;

        const goal = await prisma.goal.update({
            where: { id },
            data: {
                targetAmount: targetAmount !== undefined ? parseInt(targetAmount) : undefined,
                currency,
            }
        });

        return NextResponse.json(goal);
    } catch (error) {
        console.error('Goal update error:', error);
        return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 });
    }
}
