const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    'nodes/Vika/Vika.node': './nodes/Vika/Vika.node.ts',
    'credentials/VikaApi.credentials': './credentials/VikaApi.credentials.ts',
  },
  target: 'node',
  externals: {
    // n8n相关的包保持为外部依赖
    'n8n-workflow': 'commonjs n8n-workflow',
    'n8n-core': 'commonjs n8n-core',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
    clean: false, // 不清理dist目录，保留其他文件
  },
  optimization: {
    minimize: false, // 不压缩，保持可读性
  },
  stats: {
    warnings: false,
  },
};