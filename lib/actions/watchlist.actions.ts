'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';
import { auth } from '@/lib/better-auth/auth';
import type { WatchlistListItem, WatchlistMutationResult } from '@/types/watchlist';

function normalizeSymbol(symbol: string): string {
  return symbol.trim().toUpperCase();
}

async function resolveUserIdByEmail(email: string): Promise<string | null> {
  if (!email) return null;

  const mongoose = await connectToDatabase();
  const db = mongoose.connection.db;

  if (!db) throw new Error('MongoDB connection not found');

  const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });
  if (!user) return null;

  return (user.id as string) || String(user._id || '') || null;
}

async function getRequiredSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  return session.user;
}

async function getWatchlistSymbolsByUserId(userId: string): Promise<string[]> {
  if (!userId) return [];

  await connectToDatabase();

  const items = await Watchlist.find({ userId }, { _id: 0, symbol: 1 }).lean<Array<{ symbol: string }>>();
  return items.map((item) => String(item.symbol));
}

function revalidateWatchlistPaths() {
  revalidatePath('/watchlist');
  revalidatePath('/stocks/[symbol]', 'page');
}

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  try {
    const userId = await resolveUserIdByEmail(email);
    if (!userId) return [];

    return getWatchlistSymbolsByUserId(userId);
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err);
    return [];
  }
}

export async function getCurrentUserWatchlist(): Promise<WatchlistListItem[]> {
  const user = await getRequiredSessionUser();

  await connectToDatabase();

  const items = await Watchlist.find(
    { userId: user.id },
    { _id: 0, userId: 1, symbol: 1, company: 1, addedAt: 1 }
  )
    .sort({ addedAt: -1 })
    .lean<Array<WatchlistListItem>>();

  return items.map((item) => ({
    userId: String(item.userId),
    symbol: normalizeSymbol(String(item.symbol)),
    company: String(item.company),
    addedAt: new Date(item.addedAt),
  }));
}

export async function isInCurrentUserWatchlist(symbol: string): Promise<boolean> {
  const user = await getRequiredSessionUser();

  await connectToDatabase();

  const item = await Watchlist.exists({ userId: user.id, symbol: normalizeSymbol(symbol) });
  return Boolean(item);
}

export async function addToCurrentUserWatchlist({
  symbol,
  company,
}: {
  symbol: string;
  company: string;
}): Promise<WatchlistMutationResult> {
  try {
    const user = await getRequiredSessionUser();
    const normalizedSymbol = normalizeSymbol(symbol);
    const normalizedCompany = company.trim() || normalizedSymbol;

    await connectToDatabase();

    await Watchlist.updateOne(
      { userId: user.id, symbol: normalizedSymbol },
      {
        $setOnInsert: {
          userId: user.id,
          symbol: normalizedSymbol,
          company: normalizedCompany,
          addedAt: new Date(),
        },
      },
      { upsert: true }
    );

    revalidateWatchlistPaths();
    return { success: true };
  } catch (err) {
    console.error('addToCurrentUserWatchlist error:', err);
    return { success: false, error: 'Failed to add stock to watchlist.' };
  }
}

export async function removeFromCurrentUserWatchlist(symbol: string): Promise<WatchlistMutationResult> {
  try {
    const user = await getRequiredSessionUser();

    await connectToDatabase();

    await Watchlist.deleteOne({ userId: user.id, symbol: normalizeSymbol(symbol) });

    revalidateWatchlistPaths();
    return { success: true };
  } catch (err) {
    console.error('removeFromCurrentUserWatchlist error:', err);
    return { success: false, error: 'Failed to remove stock from watchlist.' };
  }
}
