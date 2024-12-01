import { getDbConnection } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type ScrapedData = {
    url: string;
};

export const GET = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const pool = await getDbConnection();

        const result = await pool.request().query<ScrapedData[]>(
            'SELECT url FROM scraped_data'
        );

        return NextResponse.json(result.recordset, { status: 200 });
    } catch (error) {
        console.error('Database query error:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
};
