const path = require("path");
const webpack = require("webpack");

module.exports = [
  // pdf-annotate-render 빌드
  {
    // Entry 설정 (입력 파일 경로)
    // 기본엔트리 : index.js -> 사용자 기본 엔트리파일 변경
    entry: "./external/pdf-annotate.js/src/PDFJSAnnotate.js",
    // Output 설정 (출력 디렉터리와 파일 이름)
    // 기본경로 : dist/main.js -> 사용자 경로 및 출력파일 이름 변경
    output: {
      filename: "pdf-annotate-render.js",
      path: path.resolve(__dirname, "lib"),
      // library : 엔트리 포인트의 export를 내보내는 라이브러리 설정
      // https://webpack.kr/configuration/output/#outputlibrary
      library: "PDFAnnotateRender",
      // libraryTarget : 라이브러리를 내보내는 방식을 설정
      // https://webpack.kr/configuration/output/#outputlibrarytarget
      // 'this', 'window', 'global', 'commonjs', 'module', 'commonjs2',
      // 'amd', 'amd-require', 'umd'
      libraryTarget: "umd",
    },
    plugins: [
      // 웹팩의 빌드 진행율을 표시해주는 플러그인
      new webpack.ProgressPlugin(),
    ],
    // 모드
    // development -> 개발모드
    // production -> 배포모드(기본값)
    // none -> 기본 최적화 옵션 해제
    mode: "none",
    // 소스 맵
    // https://webpack.kr/configuration/devtool/#devtool
    // (none) -> 최대 성능을 갖춘 프로덕션 빌드를 위해 추천하는 옵션
    // inline-source-map -> 단일 파일을 내보낼 때 선택
    // source-map -> 고품질 소스맵을 포함한 프로덕션 빌드를 위해 추천하는 옵션
    devtool: "inline-source-map",
  },
  //
  {
    // Entry 설정 (입력 파일 경로)
    // 기본엔트리 : index.js -> 사용자 기본 엔트리파일 변경
    entry: "./external/pdfAnnotate/src/index.ts",
    // Output 설정 (출력 디렉터리와 파일 이름)
    // 기본경로 : dist/main.js -> 사용자 경로 및 출력파일 이름 변경
    output: {
      filename: "pdf-annotate-writer.js",
      path: path.resolve(__dirname, "lib"),
      // library : 엔트리 포인트의 export를 내보내는 라이브러리 설정
      // https://webpack.kr/configuration/output/#outputlibrary
      library: "PDFAnnotateWriter",
      // libraryTarget : 라이브러리를 내보내는 방식을 설정
      // https://webpack.kr/configuration/output/#outputlibrarytarget
      // 'this', 'window', 'global', 'commonjs', 'module', 'commonjs2',
      // 'amd', 'amd-require', 'umd'
      libraryTarget: "umd",
      // libraryTarget: "umd"를 사용할 때 output.umdNamedDefine을 true로 설정하면 UMD 빌드의 AMD 모듈 이름이 지정됩니다.
      // 그렇지 않으면 익명의 define이 사용됩니다.
      // https://webpack.kr/configuration/output/#outputumdnameddefine
      umdNamedDefine: true,
    },
    plugins: [
      // 웹팩의 빌드 진행율을 표시해주는 플러그인
      new webpack.ProgressPlugin(),
    ],
    // 모드
    // development -> 개발모드
    // production -> 배포모드(기본값)
    // none -> 기본 최적화 옵션 해제
    mode: "none",
    // 소스 맵
    // https://webpack.kr/configuration/devtool/#devtool
    // (none) -> 최대 성능을 갖춘 프로덕션 빌드를 위해 추천하는 옵션
    // inline-source-map -> 단일 파일을 내보낼 때 선택
    // source-map -> 고품질 소스맵을 포함한 프로덕션 빌드를 위해 추천하는 옵션
    devtool: "inline-source-map",

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      fallback: {
        fs: false,
      },
      extensions: [".tsx", ".ts", ".js"],
    },
  },
];
