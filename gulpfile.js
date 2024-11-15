const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

// Sassファイルとディレクトリの自動生成タスク
gulp.task('create', function (done) {
  // 基本的なフォルダ構成
  const folders = [
    'sass',
    'img',
    'css',
    'js',
    'fonts',
    'sass/foundation',
    'sass/layout',
    'sass/object/component',
    'sass/object/project'
  ];

  // 各フォルダを作成
  folders.forEach(folder => {
    const folderPath = path.join(__dirname, 'assets', folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  });

  // Foundationフォルダに@useを含むファイルを作成
  const foundationFilePath = path.join(__dirname, 'assets', 'sass', 'foundation', '_foundation.scss');
  const foundationContent = `@use "../../foundation/variable" as v;
@use "../../foundation/mixin" as m;`;

  fs.writeFileSync(foundationFilePath, foundationContent);

  // Foundationフォルダにreset.scss、variable.scss、base.scss、mixin.scssを作成
  const foundationFiles = ['_reset.scss', '_variable.scss', '_base.scss', '_mixin.scss'];
  foundationFiles.forEach(file => {
    const filePath = path.join(__dirname, 'assets', 'sass', 'foundation', file);
    if (file === '_variable.scss') {
      const variableContent = `$bg-blue: #9ED0E0;
$bg-light-blue: #E9F6F8;
$bg-dark-blue: #67B0C7;
$font-sub_gray: #CCE1E4;
$font-accent_red: #CE2073;
$font-accent_yellow: #FFEE56;`;
      fs.writeFileSync(filePath, variableContent);  // 内容を追加してファイルを作成
    } else if (file === '_base.scss') {
      const baseContent = `@use './variable' as v;
@use '../foundation/mixin' as m;`;
      fs.writeFileSync(filePath, baseContent);  // 内容を追加してファイルを作成
    } else if (file === '_mixin.scss') {
      const mixinContent = `$breakpoint: (
  sp: 'screen and (max-width:767px)',
  tab: 'screen and (max-width:900px)',
  pc: 'screen and (min-width:901px)'
);

@mixin mq($bp) {
  @media #{map-get($breakpoint, $bp)} {
    @content;
  }
}`;
      fs.writeFileSync(filePath, mixinContent);  // 内容を追加してファイルを作成
    } else {
      fs.writeFileSync(filePath, '');  // 空ファイルを作成
    }
  });

  // Object/Projectフォルダ内のファイルを作成
  const projectFiles = ['_about.scss', '_price.scss', '_mv.scss', '_work.scss', '_policy.scss', '_skill.scss', '_contact.scss', '_page-work.scss', '_voice.scss'];
  projectFiles.forEach(file => {
    const filePath = path.join(__dirname, 'assets', 'sass', 'object', 'project', file);
    const projectContent = `@use "../../foundation/variable" as v;
@use "../../foundation/mixin" as m;`;
    fs.writeFileSync(filePath, projectContent);  // 内容を追加してファイルを作成
  });

  // Object/Componentフォルダ内のファイルを作成
  const componentFiles = ['_inner.scss', '_section.scss', '_swiper.scss'];
  componentFiles.forEach(file => {
    const filePath = path.join(__dirname, 'assets', 'sass', 'object', 'component', file);
    const componentContent = `@use "../../foundation/variable" as v;
@use "../../foundation/mixin" as m;`;
    fs.writeFileSync(filePath, componentContent);  // 内容を追加してファイルを作成
  });

  // layoutフォルダにファイルを作成
  const layoutFiles = ['_header.scss', '_footer.scss'];
  layoutFiles.forEach(file => {
    const filePath = path.join(__dirname, 'assets', 'sass', 'layout', file);
    const layoutContent = `@use "../foundation/variable" as v;
@use "../foundation/mixin" as m;`; // 修正：../に変更
    fs.writeFileSync(filePath, layoutContent);  // 内容を追加してファイルを作成
  });

  // style.scssを作成
  const styleFilePath = path.join(__dirname, 'assets', 'sass', 'style.scss');
  const styleContent = `/*--------------------------------------*
  * foundation
*--------------------------------------*/
@use "./foundation/reset";
@use "./foundation/variable";
@use "./foundation/base";

/*--------------------------------------*
    * layout
*--------------------------------------*/
@use "./layout/header";
@use "./layout/footer";

/*--------------------------------------*
    * component
*--------------------------------------*/

// @use "./object/component/button";
@use "./object/component/inner";
@use "./object/component/section";
@use "./object/component/swiper";
// @use "./object/component/point";
// @use "./object/component/tel";

/*--------------------------------------*
    * project
*--------------------------------------*/
@use "./object/project/mv";
@use "./object/project/about";
@use "./object/project/work";
@use "./object/project/policy";
@use "./object/project/skill";
@use "./object/project/contact";
@use "./object/project/page-work";
@use "./object/project/price";
@use "./object/project/voice";`;

  fs.writeFileSync(styleFilePath, styleContent);

  // ルート直下にindex.htmlを作成（空ファイル）
  const indexFilePath = path.join(__dirname, 'index.html');
  fs.writeFileSync(indexFilePath, ''); // 空ファイルを作成

  // ルート直下に.gitignoreを作成
  const gitignorePath = path.join(__dirname, '.gitignore');
  fs.writeFileSync(gitignorePath, 'node_modules'); // node_modulesをignore

  // jsフォルダにscript.jsを作成（空ファイル）
  const scriptFilePath = path.join(__dirname, 'assets', 'js', 'script.js');
  fs.writeFileSync(scriptFilePath, ''); // 空ファイルを作成

  done();
});

// EJSテンプレートをHTMLにコンパイルするタスク
gulp.task('ejs', () => {
  if (!argv.ejs) return;  // EJSの処理をスキップする場合
  return gulp.src('./assets/ejs/**/*.ejs')
    .pipe(ejs({}, {}, { ext: '.html' }).on('error', console.error))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest('./assets/dist'));
});

// 監視タスク
gulp.task('watch', () => {
  if (argv.ejs) {
    gulp.watch('./assets/ejs/**/*.ejs', gulp.series('ejs')); // EJSテンプレートの監視
  }
  // 他の監視設定があればここに追加
});

// デフォルトタスク
gulp.task('default', () => {
  const tasks = [];
  if (argv.ejs) {
    tasks.push('ejs');
  }
  tasks.push('watch');
  return gulp.series(...tasks)();
});