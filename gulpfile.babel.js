import gulp from 'gulp';
import babel from 'gulp-babel';
import nodemon from 'gulp-nodemon';

gulp.task('nodemon', () => {
  nodemon({
    script: './server/index.js',
    execMap: {
      js: 'node_modules/babel-cli/bin/babel-node.js',
    },
    ext: 'js html',
    env: {
      NODE_ENV: 'development',
    },
  });
});

gulp.task('release', () => {
  gulp.src('server/**/*.js')
    .pipe(babel({
      presets: ['es2015', 'es2017'],
      plugins: [
        [
          'transform-runtime',
          {
            polyfill: false,
            regenerator: true,
          },
        ],
      ],
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['nodemon'], () => {
});
