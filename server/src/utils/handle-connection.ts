import { PoolConnection, Pool } from 'mysql';


export const GET_CONNECTION = (pool: Pool): Promise<PoolConnection> => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject("CONNECTION_ERROR");
            } else {
                resolve(connection);
            }
        });
    });
};

export const QUERY = (connection: PoolConnection, SQL: string, values?: any[]): Promise<any> => {
    return new Promise((resolve, reject) => {
        connection.query(SQL, values, (err, result) => {
            if (err) {
                switch (err.code) {
                    case 'ER_DUP_ENTRY':
                        reject(new Error('ERR_DUPLICATE_VALUE'));
                        break;
                    case 'ER_BAD_FIELD_ERROR':
                        reject(new Error('ERR_SQL_QUERY'))
                    case 'PROTOCOL_CONNECTION_LOST':
                    case 'ECONNREFUSED':
                    case 'ER_CON_COUNT_ERROR':
                        reject(new Error("ERR_DATABASE_CONNECTION"));
                        break;
                    default:
                        reject(new Error(err.code));
                }
            } else {
                resolve(result);
            }
        });
    });
};
