import mysql from 'mysql'
import { DB_DATABASE, DB_HOST, DB_USERNAME, DB_PASSWORD } from '../env'

const DATABASE_INSTANCE = mysql.createPool(
    {
        user: DB_USERNAME,
        database: DB_DATABASE,
        password: DB_PASSWORD,
        host: DB_HOST,

        ssl: {
            rejectUnauthorized: true
        }
    })


DATABASE_INSTANCE.on('acquire', () =>
    console.log("Database Connected")
)

DATABASE_INSTANCE.on('error', (err) =>
    console.log("Database error", err)
)

DATABASE_INSTANCE.on('release', (err) =>
    console.log("Database Disconnected")
)


export default DATABASE_INSTANCE;
