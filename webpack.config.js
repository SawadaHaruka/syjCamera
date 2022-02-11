module.exports = {
  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: `./src/index.js`,

  // ファイルの出力設定
  output: {
    // 出力ファイル名
    filename: "main.js"
  },

  // 開発用(わかりやすい)
  mode: "development",
  //本番用(軽い)
  // mode: "production",
  //[npm run build]
  //[npm run watch]こっち

    // ローカル開発用環境を立ち上げる
  // 実行時にブラウザが自動的に localhost を開く
  devServer: {
    static: "dist",
    open: true
  }
  //[npm run start]か[npx webpack serve]
};