/**
 * log4js 配置文件
 * 
 * 日志等级由低到高
 * ALL TRACE DEBUG INFO WARN ERROR FATAL OFF. 
 * 
 * 关于log4js的appenders的配置说明
 * https://github.com/nomiddlename/log4js-node/wiki/Appenders
 */

import * as path from "path"

//日志根目录
const baseLogPath = path.resolve(__dirname, '../logs')

export default {
    "appenders": {
        "access": {
            "type": "dateFile",
            "filename": `${baseLogPath}/access.log`,
            "pattern": "-yyyy-MM-dd",
            "category": "http"
        },
        "app": {
            "type": "file",
            "filename": `${baseLogPath}/app.log`,
            "maxLogSize": 10485760,
            "numBackups": 3
        },
        "out": { type: "stdout" },
        "server": {
            "type": "dateFile",
            "filename": `${baseLogPath}/server`,
            "pattern": " [yyyy.MM.dd].log",
            "alwaysIncludePattern": true,
            "layout": {
                "type": 'pattern',
                "pattern": '[%d{yyyy-MM-dd}][%r] - [%p] - %m%n'
            }
        },
        "errors": {
            "type": "dateFile",
            "level": "ERROR",
            "filename": `${baseLogPath}/errors`,
            "pattern": "  [yyyy.MM.dd].log",
            "alwaysIncludePattern": true
        },
        "console": {
            "type": "console",
            "layout": {
                "type": 'pattern',
                "pattern": '[ %[%d{yyyy.MM.dd}%] ][ %[%r%] ] [ %[%p%] ] - %m%n'
            }
        }
    },
    "categories": {
        "default": { "appenders": ["app", "server"], "level": "INFO" },
        "http": { "appenders": ["access"], "level": "DEBUG" },
        "[server]": { "appenders": ["app", "server"], "level": "DEBUG" },
        "[errors]": { "appenders": ["app", "errors"], "level": "ERROR" },
        "[console]": { "appenders": ["console"], "level": "ALL" }
    }
}