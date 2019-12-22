module.exports = {
    entry: {
        app: './src/main.ts'
    },
    output: {
        path: __dirname + "/dist/",
        filename: 'main.js'
    },
    resolve: {
        extensions: ['.ts','.tsx', '.js']
    },
    devtool: 'source-map',
    plugins: [

    ],
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/
        }]
    }
}
