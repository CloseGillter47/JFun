import { ConnectionConfig, PoolConfig } from "mysql";

const MySql: ConnectionConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: '123'
};
const Pool: PoolConfig = {
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: '123',
    database: 'jfun',
    multipleStatements: true
};

export default {
    MySql,
    Pool
}