import { getDbConnection } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type ScrapedData = {
    html: string;
};

export const GET = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const { searchParams } = new URL(req.url);
        const url = searchParams.get('url');
        console.log('Requested URL:', url);

        if (!url) {
            return NextResponse.json(
                { error: 'Missing required parameter: url' },
                { status: 400 }
            );
        }

        const pool = await getDbConnection();

        const result = await pool
            .request()
            .input('url', url)
            .query<ScrapedData[]>(
                'SELECT text_content FROM scraped_data WHERE url = @url'
            );

        if (result.recordset.length === 0) {
            return NextResponse.json(
                { error: 'No text contents found for the provided URL, check spelling.' },
                { status: 404 }
            );
        }

        return NextResponse.json(result.recordset[0], { status: 200 });
    } catch (error) {
        console.error('Database query error:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
};
