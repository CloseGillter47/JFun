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

//错误日志目录
const errorPath = "/error";
//错误日志文件名
const errorFileName = "error";
//错误日志输出完整路径
const errorLogPath = baseLogPath + errorPath + "/" + errorFileName;


//响应日志目录
const responsePath = "/response";
//响应日志文件名
const responseFileName = "response";
//响应日志输出完整路径
const responseLogPath = baseLogPath + responsePath + "/" + responseFileName;

export default {
    "appenders": [
        // 错误日志
        {
            // 日志类型          
            "type": "dateFile",
            // logger名称
            "category": "errorLogger",
            // 日志输出位置                 
            "filename": errorLogPath,
            // 是否总是有后缀名          
            "alwaysIncludePattern": true,
            // 后缀，每小时创建一个新的日志文件        
            "pattern": "-yyyy-MM-dd-hh.log",
            // 自定义属性，错误日志的根目录  
            "path": errorPath
        },
        // 响应日志
        {
            "type": "dateFile",
            "category": "resLogger",
            "filename": responseLogPath,
            "alwaysIncludePattern": true,
            "pattern": "-yyyy-MM-dd-hh.log",
            "path": responsePath
        }
    ],
    // 设置logger名称对应的的日志等级
    "levels": {
        "errorLogger": "ERROR",
        "resLogger": "ALL"
    },
    // logs根目录
    "baseLogPath": baseLogPath
}