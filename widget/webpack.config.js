const path = require('path');

module.exports = {
    entry: './src/index.jsx',
    output: {
        path: path.resolve(__dirname, '../public'),
        filename: 'widget.js',
        library: 'VetChatWidget',
        libraryTarget: 'umd',
        globalObject: 'this',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    optimization: {
        minimize: true,
    },
};
