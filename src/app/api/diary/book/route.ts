import { NextResponse } from 'next/server';

import { getDiaryBookDataAPI } from '@/lib/diary';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const year = Number(searchParams.get('year')) || undefined;
  const month = Number(searchParams.get('month')) || undefined;

  const { code, message, data } = await getDiaryBookDataAPI({ year, month });

  return NextResponse.json({ code, message, data }, { headers: { 'Cache-Control': 'no-store' } });
}
