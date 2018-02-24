import * as mysql from "mysql";

import CONFIG from "../config/mysql.config";
import { Logger } from "../utils/log.util";

const log = new Logger();

export class MSql {

    private pool: mysql.Pool;

    constructor() {
        this.init();
    }

    protected init() {
        this.pool = mysql.createPool(CONFIG.Pool);
        this.event(this.pool);
    }

    private event(pool: mysql.Pool) {

        pool.on("acquire", connection => {
            console.log('Connection %d acquired', connection.threadId);
        });

        pool.on("connection", connection => {
            connection.query('SET SESSION auto_increment_increment=1')
        });

        pool.on("enqueue", () => {
            console.log('Waiting for available connection slot');
        });

        pool.on("release", connection => {
            console.log('Connection %d released', connection.threadId);
        });
    }

    public create() {
        return this.pool;
    }

    public static query(sql: string) {

        return new Promise((resolve, reject) => {

            let pool = new MSql().create();

            pool.query(sql, (error, results, fields) => {

                error ? reject(error) : resolve(results);
            });
        });
    }

    public static exect(sql: string, ...params: any[]) {

        return new Promise((resolve, reject) => {

            let pool = new MSql().create();

            pool.getConnection((error: Error, connection: mysql.PoolConnection) => {

                error ? reject(error) : connection.query(sql, params, (err, res) => {

                    connection.release();

                    err ? reject(err) : resolve(res);
                });

            });
        });
    }
}