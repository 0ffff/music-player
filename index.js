var http = require('http');
var express = require('express');
var app = express();

app.use(express.static('html'));

app.get('/data', function (req, res) {
    download('http://music.163.com/api/playlist/detail?id=' + req.query.id);
    JSON.stringify(global.data)
    res.send(global.data);
})

var server = app.listen(3000);
console.log('Listening on port 3000...');

//加载第三方页面
function download(url) {
    http.get(url, function (res) {
        const statusCode = res.statusCode;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
            error = new Error(`请求失败。\n` +
                `状态码: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error(`无效的 content-type.\n` +
                `期望 application/json 但获取的是 ${contentType}`);
        }
        if (error) {
            console.log(error.message);
            // 消耗响应数据以释放内存
            res.resume();
            return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => rawData += chunk);
        res.on('end', () => {
            try {
                let parsedData = JSON.parse(rawData);
                global.data = parsedData;
            } catch (e) {
                console.log(e.message);
            }
        });
    }).on('error', (e) => {
        console.log(`错误: ${e.message}`);
    });
}