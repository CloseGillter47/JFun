import * as gulp from "gulp";
const del = require("del");
const gulpMocha = require("gulp-mocha");
const runSequence = require("run-sequence");
const sourceMaps = require("gulp-sourcemaps");
const tsc = require("gulp-typescript");
const uglify = require("gulp-uglify");

// 清理旧文件
gulp.task("clean", done => {
    // 允许在工作目录外操作文件 (删除)
    Object.assign(done, { force: true });
    return del(['../.dist/backend/bin'], done);
});

// 拷贝新启动脚本
gulp.task("copy", () => {
    return gulp.src("bin/*")
        .pipe(gulp.dest("../.dist/backend/bin"));
});

// 拷贝视图文件夹
gulp.task("copy:views", () => {
    return gulp.src("./src/views/*.pug")
        .pipe(gulp.dest("../.dist/backend/views"));
});

// 拷贝静态资源
gulp.task("copy:assets", () => {
    return gulp.src("./src/public/**/*.*")
        .pipe(gulp.dest("../.dist/backend/public"));
});

// 编译 ts 脚本
gulp.task("build:koa2", () => {
    const project = tsc.createProject("../tsconfig.json");
    const result = gulp.src("./src/**/*.ts")
        .pipe(sourceMaps.init())
        .pipe(project());
    return result.js
        // .pipe(uglify())
        .pipe(gulp.dest("../.dist/backend"));
});

// 运行测试
gulp.task("test:koa2", () => {

    gulp.src("../.dist/backend/tests", { read: false })
        .pipe(gulpMocha());
});

// 默认任务
gulp.task("default", done => {
    runSequence("clean", "copy", "copy:views", "copy:assets", "build:koa2");
})