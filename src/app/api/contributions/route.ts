import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { convertToUSDCents } from '@/lib/currency';

export async function GET() {
    try {
        const contributions = await prisma.contribution.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(contributions);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch contributions' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amount, currency, userId } = body;

        if (!amount || !currency) {
            return NextResponse.json({ error: 'Amount and currency required' }, { status: 400 });
        }

        // Convert to USD cents
        // amount is incoming as string or number of MAJOR units (e.g. 100 which means 100 SEK)
        const amountInt = parseInt(amount);
        const { usdCents, rate } = await convertToUSDCents(amountInt, currency);

        const contribution = await prisma.contribution.create({
            data: {
                amount: usdCents,
                originalAmount: amountInt, // Major units integers
                originalCurrency: currency,
                exchangeRate: rate,
                userId: userId || 'Anonymous',
            }
        });

        // Update currentAmount in Goal
        // Find goal (assuming single goal)
        const goal = await prisma.goal.findFirst();
        if (goal) {
            await prisma.goal.update({
                where: { id: goal.id },
                data: {
                    currentAmount: { increment: usdCents }
                }
            });
        }

        return NextResponse.json(contribution);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create contribution' }, { status: 500 });
    }
}
