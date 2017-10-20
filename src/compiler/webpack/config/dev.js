
var webpack = require('webpack')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

var os = require("os");
var HappyPack = require('happypack');
var happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

var cssLoader = require('../../utils/cssLoaders.js');

module.exports = function (outpath, emiConfig) {

    var config = {
        devtool : '#cheap-module-eval-source-map',
        plugins : [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('development')
                }
            }),
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new FriendlyErrorsPlugin()
        ]
    }

    if (emiConfig.cssLoader) {
        if (emiConfig.cssLoader.happypack) {

            var loaders = cssLoader.createHappypackLoaders(emiConfig.cssLoader, 'dev');

            Object.keys(loaders).forEach(function(key) {
                var _loaders  = loaders[key];
                config.plugins.push(
                    new HappyPack({
                        id : key,
                        threadPool : happyThreadPool,
                        loaders :_loaders,
                        debug : true
                    })
                );
            });
        }


        if (emiConfig.cssLoader.packCss) {
            config.plugins.push(
                new ExtractTextPlugin({
                    filename : path.join(outpath, 'styles/[name].css')
                }
                ));
        }

    }

    return config;

}
    