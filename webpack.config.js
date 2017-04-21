var path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'assets/jsx/App.jsx'),
    output: {
        path: path.resolve(__dirname, 'app/static/js'),
        publicPath: '/static/js',
        filename: 'speler.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: ['babel-loader']
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            }
        ]
    }
};
