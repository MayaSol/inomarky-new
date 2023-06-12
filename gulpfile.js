const gulp = require('gulp');
const { series, parallel, src, dest, watch, lastRun, task } = require('gulp');
// const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
// const webpackStream = require('webpack-stream');
// const autoprefixer = require('autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const postcss = require('gulp-postcss')
const terser = require("gulp-terser");
var rename = require("gulp-rename");
const cleanCSS = require("gulp-clean-css");
// var buffer = require('vinyl-buffer');
var imagemin = require('gulp-imagemin');
// var merge = require('merge-stream');
var spritesmith = require('gulp.spritesmith');
const sass = require('gulp-sass');
const debug = require('gulp-debug');
const replace = require('gulp-replace');
// const remoteSync = require('remote-sync');
// var map = require('map-stream');
const fs = require('fs');
const concat = require('gulp-concat');
const insert = require('gulp-insert');
const svgstore = require('gulp-svgstore');
// const tailwindcss = require('tailwindcss');
const penthouse = require('penthouse');
const merge = require('merge-stream');


// Список и настройки плагинов postCSS
let postCssPlugins = [
  // autoprefixer({grid: true}),
  // mqpacker({
  //   sort: true
  // }),
  // atImport(),
  // inlineSVG(),
  // objectFitImages(),
];


const rfiles = [];
const remoteDir = 'https://www.autopeugeot.ru/';

const now = new Date();
const dateStr = `${now.getFullYear()}.${String("0" + (now.getMonth()+1)).slice(-2)}.${String("0" + now.getDate()).slice(-2)}`;
// Список файлов, новые версии которых надо забрать с сервера, а старые сохранить


function archiveFiles(done) {
      const files = [
      // 'css/*.css',
      // 'css/*sources/main/*.{css,scss}',
      'css/ltr.min.css',
      'js/script.js',
      // 'js/second/script_second.js',
      // 'css/bootstrap.min.css'
    ];
    return gulp.src(files)
        .pipe(plumber({
            errorHandler: function(err) {
                console.log(err.message);
                this.emit('end');
            }
        }))
        .pipe(rename(function (path) {
            // path.dirname += "/css",
            // path.basename = path.basename
            // path.extname = ".md"
        }))
        // .pipe(rename({
        //         suffix: suffix
        //     }))
        .pipe(gulp.dest('./old/' + dateStr + '/local'));
    done();
};

gulp.task('arch', gulp.series(archiveFiles));


function cssHome(done) {
    const files = ['css/sources/main/main.css'];
    src(files)
        .pipe(plumber({
            errorHandler: function(err) {
                console.log(err.message);
                this.emit('end');
            }
        }))
        .pipe(replace(
            'url(/image/catalog/sprite.png)',
            'url(http://maiiasol.ru/peugeout/image/catalog/sprite.png)'))
        .pipe(replace(
            'url(/image/catalog/',
            'url(file:///home/helloworld/Work/pego/image/catalog/'))
        .pipe(dest('./css/sources/main/'));
    done();
};

task('csshome', series(cssHome));

// function grabFile(done) {
//     const files = [
//       'css/*.css',
//       // 'js/*.js'
//     ];
//     files.forEach(function(file) {
//         const config = {
//             operations : [
//                 {
//                     operation : 'Get file',
//                     command : `mget -e -O ./css/ /httpdocs/${file}`
//                 }
//             ],
//             user : 'maiialab01',
//             pw : '"vGo#@Jk75tk&&a6e"',
//             host : 'www.autopeugeot.ru',
//             lftp_settings : {
//                 'ssl:verify-certificate':'false',
//                 'cmd:trace':'true'
//             }
//         };
//         const client = new remoteSync(config);
//         client.perform();
//     });
//     done();
// }

// gulp.task('grab', gulp.series(grabFile));

// function cssTmp(done) {
//     return gulp.src(files)
//         .pipe(plumber({
//             errorHandler: function(err) {
//                 console.log(err.message);
//                 this.emit('end');
//             }
//         }))
//         .pipe(replace(
//                 '/fonts/',
//                 remoteDir + '/fonts/'))
//         .pipe(gulp.dest('./tmp'));
//     done();
// };

// gulp.task('csstmp', gulp.series(cssTmp));




// function toMy(done) {
//     let filesLocal = [];
//     files.forEach(function(file) {
//         filesLocal.push(/[^/]*$/.exec(file)[0]);
//     });
//     console.log(filesLocal);
//     filesLocal.forEach(function(file) {
//         const config = {
//             operations : [
//                 {
//                     operation : 'Put file',
//                     command : `put -O www/maiia.ru/shifa/css/ tmp/${file}`
//                 }
//             ],
//             user : 'u1093846',
//             pw : 'o9EQ2J!d',
//             host : '37.140.192.54',
//             lftp_settings : {
//                 'ssl:verify-certificate':'false'
//             }
//         };
//         const client = new remoteSync(config);
//         client.perform();
//     });
//     done();
// }

// gulp.task('tomy', gulp.series(toMy));


gulp.task('js', () =>
    gulp.src('src/js/*.js')
        .pipe(babel({
            presets: [
            ['@babel/preset-env',
	            {  
			        "useBuiltIns": "entry",
			        "corejs": 3,
	            	"targets": {
			          "ie": "11",
	        		}
	            }
            ]],
            "plugins": ["@babel/plugin-transform-object-assign"],
        }))
        .pipe(gulp.dest('dist'))
);

gulp.task('js-unite-second', () =>
  gulp.src([
    'js/second/utils_second.js',
    'js/second/main_second.min.js'
  ])
    .pipe( plumber() )
    .pipe( concat( 'script_second.min.js' ) )
    // .pipe( terser() )
    .pipe( gulp.dest( 'js/second/' ) )
)

function makeConcat(done) {
  // gulp.src('css/sources/utils/*')
  return gulp.src([
    'css/sources/main/style.min.css',
    'css/sources/main/form.css',
    'css/sources/main/style_re.css',
    'css/sources/main/style_ctx.css',
    'css/sources/main/style-media.min.css',
    'css/sources/main/style_newcars.css',
    'css/sources/main/style_newcars_media.css'
    ])
    .pipe( plumber() )
    .pipe(insert.transform(function(contents, file) {
      console.log(file.basename);
      return `/*! ${file.basename} */` + contents;
    }))
    .pipe( concat( 'main.css' ) )
    // .pipe( terser() )
    .pipe( gulp.dest( 'css/sources/main/' ) )
    done();
};

gulp.task('concat', gulp.series(makeConcat));

gulp.task('js-min', () =>
    // gulp.src('js/script.js')
    // gulp.src('js/second/second.js')
    gulp.src(['js/script.js'])
        .pipe(terser())
        .pipe(rename(function (path) {
          // Updates the object in-place
          path.extname = ".min.js";
        }))
        .pipe(gulp.dest('js/'))
        // .pipe(gulp.dest('js/second'))
);

gulp.task('js-min-second', () =>
    gulp.src('js/second/main_second.js')
        .pipe(terser())
        .pipe(rename(function (path) {
          // Updates the object in-place
          path.extname = ".min.js";
        }))
        // .pipe(gulp.dest('js/'))
        .pipe(gulp.dest('js/second'))
);

gulp.task('js-second', gulp.series('js-min-second','js-unite-second'));

function makeSass(done) {
  return gulp.src([
    'css/all_icons.scss',
  ])
    .pipe(plumber({
      errorHandler: function (err) {
        console.log(err.message);
        this.emit('end');
      }
    }))
    .pipe(debug({title: 'Compiles:'}))
    .pipe(sass())
    // .pipe(sass({includePaths: [__dirname+'/','node_modules']}))
    .pipe(postcss(postCssPlugins))
    // .pipe(csso({
    //   restructure: false,
    // }))
    // .pipe(dest(`${dir.build}/css`, { sourcemaps: '.' }))
    // .pipe(browserSync.stream());
    // .pipe(rename('style.min.css'))
    // .pipe(rename('form.css'))
    .pipe(gulp.dest('css/'))
  done();
};

gulp.task('sass', gulp.series(makeSass));


gulp.task('bundle', () =>
  gulp.src(`./src/bundle/script_tooltips.js`)
    .pipe(plumber())
    .pipe(webpackStream({
      mode: 'production',
      entry: {'bundle': './src/bundle/script_tooltips.js'},
      output: {
        filename: '[name].js',
      },
      module: {
        rules: [
          {
            test: /\.(js)$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            query: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      },
      // externals: {
      //   jquery: 'jQuery'
      // }
    }))
    .pipe(gulp.dest('dist'))
);


function cssMin(done) {

  // return gulp.src('./css/utils.css')
  // return gulp.src('./css/sources/utils/css/*.css')
  // return gulp.src('./css/sources/utils/css/*.css')
  return gulp.src('./css/sources/main/main.css')
  // return gulp.src('./css/sources/utils/css/slick-theme.css')
    .pipe(sourcemaps.init())
    // .pipe(postcss([ autoprefixer({grid: 'autoplace'}) ]))
    .pipe(cleanCSS())
    .pipe(rename(function (path) {
      path.extname = ".min.css";
    }))
    // .pipe(sourcemaps.write('.'))
    // .pipe(gulp.dest('./css/sources/utils/'))
    .pipe(gulp.dest('./css/sources/main/'))
    done();
}

gulp.task('cssmin', gulp.series(cssMin));


function makeSprite() {
  // Generate our spritesheet
  var spriteData = gulp.src('imgs/sprite/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.scss',
    cssTemplate: 'handlebarsStrDefault.scss.handlebars',
    // algorithm: 'diagonal'
    // cssVarMap: function (sprite) {
    //   console.log(sprite);
    //   sprite.name = sprite.name;
    // }
  }));
 
  // Pipe image stream through image optimizer and onto disk
  var imgStream = spriteData.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
    .pipe(buffer())
    .pipe(imagemin())
    .pipe(gulp.dest('imgs/sprite/sprite-png'));
 
  // Pipe CSS stream through CSS optimizer and onto disk
  var cssStream = spriteData.css
    .pipe(gulp.dest('css/'));

  // Return a merged stream to handle both `end` events
  return merge(imgStream, cssStream);
};


gulp.task('sprite', gulp.series(makeSprite));



//Заменить пути к иконкам на @include sprite($...)
function replaceIcons(done) {
  // let files = ["css/style.scss",  "css/form.scss","css/style_re-init.scss"];
  let files = ["css/style_newcars-init.scss"];
  let icons = fs.readdirSync('./img/sprite/');

  files.forEach(function(file) {

    let fileContent = fs.readFileSync(file, "utf8");

    icons.forEach(icon => {
      console.log(icon);
      let stem = icon.replace(/\..*/g,'');
      // Находим строки от 'background' до } или \n или ;, содержащие stem
      let regExp = new RegExp(`background(.+)\/${stem}\\.png(.+)[\\n;}]`,'g');
      fileContent = fileContent.replace(regExp, replace(stem));
    });

    fs.writeFile(file,fileContent,
      (err) => {
        if (err)
          console.log(err);
        else {
          console.log("File written successfully");
    }});
  });

  function replace(stem) {
    return (match,_,index) => {
      console.log(match);
      let res = `@include sprite(\$${stem});\n`;
      if (/(.*?)no-repeat(.*?)/g.test(match)) {
        res = res + `\tbackground-repeat:  no-repeat;\n`;
      }
      return res;
    }
  }

  done();
}

gulp.task('replace', gulp.series(replaceIcons));

function generateSvgSprite(cb) {
    return src('imgs/sprite-svg/*.svg')
      // .pipe(svgmin(function () {
      //   return { plugins: [{ cleanupIDs: { minify: true } }] }
      // }))
      // .pipe(svgstore({ inlineSvg: true }))
      .pipe(svgstore({ }))
      .pipe(rename('sprite.svg'))
      .pipe(dest(`imgs/sprite-svg/sprite/`));
}

gulp.task('svg', gulp.series(generateSvgSprite));


function htmlDeploy(done) {
  files = ['index.html','cars.html'];
  path = './deploy/'
  files.forEach(function(file) {
    let fileContent = fs.readFileSync(file, "utf8");
    // let regBase = new RegExp(`<base(.+)\/>`);
    // fileContent = fileContent.replace(regBase, `<base href="http://maiiasol.ru/rikta/" />`);
    regScript = new RegExp('file:///home/helloworld/Work/inomarky-new/dist/', "g");
    fileContent = fileContent.replace(
      regScript,
      'file:///home/helloworld/Work/inomarky-new/css/');
    regScript = new RegExp('file:///home/helloworld/Work/inomarky-new/', "g");
    fileContent = fileContent.replace(
      regScript,
      'http://maiiasol.ru/inomarki/');
    regScript = new RegExp('/fonts/material/icon.woff2');
    fileContent = fileContent.replace(
      regScript,
      'http://maiiasol.ru/inomarki/fonts/material/icon.woff2');
    regScript = new RegExp('/fonts/material/icon.css');
    fileContent = fileContent.replace(
      regScript,
      'http://maiiasol.ru/inomarki/css/icon.css');

    // let regScript = new RegExp(`<script src="\/js\/`,'g');
    // fileContent = fileContent.replace(regScript, `<script src="/peugeout/js/`);
    // let regScript2 = new RegExp(`="\/catalog\/`,'g');
    // fileContent = fileContent.replace(regScript2, `="/peugeout/catalog/`);
    // let regSrc = new RegExp(`="\/price_slider\/`,'g');
    // fileContent = fileContent.replace(regSrc, `="/peugeout/price_slider/`);
    // let href = new RegExp(`href="\/css\/`,'g');
    // fileContent = fileContent.replace(href, `href="/peugeout/css/`);
    // let href2 = new RegExp(`="\/slick\/`,'g');
    // fileContent = fileContent.replace(href2, `="/peugeout/slick/`);
    // let regImg = new RegExp(`<img src="\/image\/`,'g')
    // fileContent = fileContent.replace(regImg, `<img src="/peugeout/image/`);
    // let regImg2 = new RegExp(`src="http://new.autopeugeot.ru/image/`,'g')
    // fileContent = fileContent.replace(regImg2, `src="/peugeout/image/`);
    // let regImg3 = new RegExp(`data-src="http://new.autopeugeot.ru/image/`,'g')
    // fileContent = fileContent.replace(regImg3, `data-src="/peugeout/image/`);
    // let regLazy = new RegExp(`<img class="lazyload" data-src="\/image\/`,'g')
    // fileContent = fileContent.replace(regLazy, `<img class="lazyload" data-src="/peugeout/image/`);
    // let regFonts = new RegExp(`href="/fonts/`,'g')
    // fileContent = fileContent.replace(regFonts, `href="/peugeout/fonts/`);
    // fileContent = fileContent.replace(
    //   'css/sources/main/main.min.css', 
    //   'css/main.min.css');
    // regScript = new RegExp('<script src="file:///home/helloworld/Work/pego/js/', "g");
    // fileContent = fileContent.replace(
    //   regScript,
    //   '<script src="http://maiiasol.ru/peugeout/js/');
    // var regPath = new RegExp('href="file:///home/helloworld/Work/pego/css/', "g");
    // fileContent = fileContent.replace(
    //   regPath,'href="http://maiiasol.ru/peugeout/css/');
    // regSvg = new RegExp("file:///home/helloworld/Work/pego/image/sprite.svg","g");
    // fileContent = fileContent.replace(
    //   regSvg,'http://maiiasol.ru/peugeout/image/sprite.svg');
    // regImg = new RegExp('src="/img/',"g");
    // fileContent = fileContent.replace(
    //   regImg,'src="http://maiiasol.ru/peugeout/img/');
    
    fs.writeFile(path + file,fileContent,
    (err) => {
      if (err)
        console.log(err);
      else {
        console.log("File written successfully");
    }});
  });

  done();
}


function insertBeforeLastOccurrence(strToSearch, strToFind, strToInsert) {
    var n = strToSearch.lastIndexOf(strToFind);
    if (n < 0) return strToSearch;
    return strToSearch.substring(0,n) + strToInsert + strToSearch.substring(n);    
}

function cssTmp(done) {
  files = ['css/style_i1.css'];
  path = './tmp/'
  files.forEach(function(file) {
    let regExp = /[^/]+(?=\.css$)/;
    console.log(file);
    let fileName = regExp.exec(file);
    console.log(fileName[0]);
    let fileContent = fs.readFileSync(file, "utf8");
    let regImage = new RegExp("file:///home/helloworld/Work/rikta/fonts/",'g');
    fileContent = fileContent.replace(regImage, `/rikta/fonts/`);
    regImage = new RegExp("file:///home/helloworld/Work/rikta/imgs",'g');
    fileContent = fileContent.replace(regImage, `/rikta/bitrix/templates/innova_sshop/imgs/`);
    regImage = new RegExp("file:///home/helloworld/Work/rikta/promo/",'g');
    fileContent = fileContent.replace(regImage, `/rikta/promo/`);

    // let regImage = new RegExp("\\(\/image\/catalog",'g');
    // fileContent = fileContent.replace(regImage, `(/peugeout/image/catalog`);
    // let regFonts = new RegExp("\/fonts\/",'g');
    // fileContent = fileContent.replace(regFonts, `/peugeout/fonts/`);


    fs.writeFile('./tmp/' + fileName[0] + '.css', fileContent,
    (err) => {
      if (err)
        console.log(err);
      else {
        console.log("File written successfully");
    }});
  });

  done();
}

gulp.task('deploy', gulp.series(htmlDeploy));


// function cssDeploy(done) {
//   files = ['css/style_i1.css'];
//   path = './deploy/'
//   files.forEach(function(file) {
//     let regExp = /[^/]+(?=\.css$)/;
//     console.log(file);
//     let fileName = regExp.exec(file);
//     console.log(fileName[0]);
//     let fileContent = fs.readFileSync(file, "utf8");
//     let regFont = new RegExp("file:///home/helloworld/Work/rikta/fonts/",'g');
//     fileContent = fileContent.replace(regFont, `fonts/`);
//     let regImage = new RegExp("file:///home/helloworld/Work/rikta/bitrix/templates/innova_sshop/imgs/",'g');
//     fileContent = fileContent.replace(regImage, `imgs/`);
//     regImage = new RegExp("file:///home/helloworld/Work/rikta/imgs/",'g');
//     fileContent = fileContent.replace(regImage, `imgs/`);
//     regImage = new RegExp("file:///home/helloworld/Work/rikta/promo/",'g');
//     fileContent = fileContent.replace(regImage, `/promo/`);


//     // let regImage = new RegExp("\\(\/image\/catalog",'g');
//     // fileContent = fileContent.replace(regImage, `(/peugeout/image/catalog`);
//     // let regFonts = new RegExp("\/fonts\/",'g');
//     // fileContent = fileContent.replace(regFonts, `/peugeout/fonts/`);


//     fs.writeFile('./deploy/' + fileName[0] + '.css', fileContent,
//     (err) => {
//       if (err)
//         console.log(err);
//       else {
//         console.log("File written successfully");
//     }});
//   });

//   done();
// }

// gulp.task('deploy', gulp.series(cssDeploy));


function compileTailwind() {
  let plugins = [
        tailwindcss()
  ];
  console.log(plugins);
  return src(`./css/input/input.css`)
    .pipe(plumber({
      errorHandler: function (err) {
        console.log(err.message);
        this.emit('end');
      }
    }))
    .pipe(debug({title: 'Compiles:'}))
    .pipe(postcss(plugins))
    .pipe(dest(`css`, { sourcemaps: '.' }))
    // .pipe(browserSync.stream());
}


gulp.task('tailwind', gulp.series(compileTailwind));

function criticalCss() {
  penthouse({
    url: 'https://www.inomarkispb.ru/',
    css: 'dist/ltr.min.css'
  })
  .then(criticalCss => {
    // use the critical css
    fs.writeFileSync('critical.css', criticalCss);
  })
}

gulp.task('criticalCss', gulp.series(criticalCss));

gulp.task('css', () => {
  var files = ['./css/icon.css']


  var tasks = files.map(function(file) {
    return gulp.src(file)
      .pipe(sourcemaps.init())
      // .pipe(postcss([ autoprefixer({grid: 'autoplace'}) ]))
      .pipe(cleanCSS())
      .pipe(rename(function (path) {
        path.extname = ".min.css";
      }))
      // .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./css'))
  })

  return merge(tasks);
})

// gulp.task('main', gulp.series(makeSprite,makeSass,makeConcat,cssMin));
gulp.task('main', gulp.series(makeSass,makeConcat,cssMin));
