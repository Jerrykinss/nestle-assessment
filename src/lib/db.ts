import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import sql, { ConnectionPool, config as SqlConfig } from 'mssql';

const config: SqlConfig = {
    user: process.env.SQL_USER || '',
    password: process.env.SQL_PASSWORD || '',
    server: process.env.SQL_SERVER || '',
    database: process.env.SQL_DATABASE || '',
    options: {
        encrypt: true,
        enableArithAbort: true,
    },
};


let pool: ConnectionPool | null = null;

export const getDbConnection = async (): Promise<ConnectionPool> => {
    if (!pool) {
        try {
            pool = await sql.connect(config);
            console.log('Connected to Azure SQL Database');
        } catch (error) {
            console.error('Failed to connect to Azure SQL Database:', error);
            throw error;
        }
    }
    return pool;
};
