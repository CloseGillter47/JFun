import development_env from "./app.dev"
import test_env from "./app.test"

//根据不同的NODE_ENV，输出不同的配置对象，默认输出development的配置对象
export default {
    development: development_env,
    test: test_env
}[process.env.NODE_ENV || 'development']