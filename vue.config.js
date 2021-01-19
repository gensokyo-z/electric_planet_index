const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production';
function resolve(dir) {
  return path.join(__dirname, dir);
}
function resolveApp(relativePath) {
  return path.resolve(relativePath);
}
const cdn = {
  // 引用CDN资源
  externals: {
    QRCode: 'QRCode',
    wx: 'wx'
  },
  // cdn的css链接
  css: ['//at.alicdn.com/t/font_1983148_odm3rw4ju0p.css'],
  // cdn的js链接
  js: [
    '//res2.wx.qq.com/open/js/jweixin-1.6.0.js',
    '//ddxq.tech/h5/qrcode/qrcode.js',
  ]
};
console.log(`NODE_ENV:${process.env.NODE_ENV},npm_config_report: ${process.env.npm_config_report}`);
module.exports = {
  // publicPath: !isProduction ? './' : '//e.kuaidi100.com/h5/', // 打包后引用的资源路径
  publicPath: !isProduction ? './' : '//ddxq.tech/community', // 打包后引用的资源路径
  outputDir: 'community', // 打包目录
  productionSourceMap: !isProduction || process.env.VUE_APP_CONFIG === 'test', // 生产打包的map文件是否生成
  devServer: {
    open: true, // 是否自动打开浏览器页面
    host: 'index.tech', // 指定使用一个 host，默认是 localhost
    port: 80, // 端口地址
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: `https://ddxq.tech`,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  },

  configureWebpack: config => {
    // webpack cdn自定义配置
    config.externals = cdn.externals;
    // 生产环境打包分析体积
    if (isProduction && process.env.npm_config_report) {
      return {
        plugins: [new BundleAnalyzerPlugin()]
      };
    }
    // 生产环境 启动gzip
    if (isProduction) {
      return {
        plugins: [
          new CompressionWebpackPlugin({
            // filename: '[path].gz[query]',
            test: /\.js$|\.html$|\.css/, // 匹配文件名
            threshold: 10240, // 文件压缩阈值，对超过10k的进行压缩
            deleteOriginalAssets: false // 是否删除源文件
          })
        ]
      };
    }
    return {
      resolve: {
        alias: {
          // 别名
          vue$: 'vue/dist/vue.esm.js'
        }
      }
    };
  },
  chainWebpack: config => {
    // 生产环境或本地需要cdn时，才注入cdn
    config.plugin('html').tap(args => {
      args[0].cdn = cdn;
      args[0].template = resolve('public/index.html');
      args[0].inject = true;
      args[0].favicon = resolveApp('favicon.png');
      return args;
    });
    // CLI内部webpack配置
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
    types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)));
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
};

// 全局样式 变量、函数
function addStyleResource(rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [resolve('src/styles/variables.less'), resolve('src/styles/mixin.less')]
    });
}
