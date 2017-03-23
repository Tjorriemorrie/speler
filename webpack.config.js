var path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'assets/jsx/App.jsx'),
    output: {
        path: path.resolve(__dirname, 'app/static/js'),
        publicPath: '/static/js',
        filename: 'speler.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loaders: ['react-hot', 'babel?cacheDirectory,presets[]=react,presets[]=es2015']
            }
        ]
    }
};
