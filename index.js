var http = require('http');
var express = require('express');
var app = express();

app.use(express.static('html'));

app.get('/list', function (req, res) {
    download('/api/playlist/detail?id=' + req.query.id, 'list');
    JSON.stringify(global.list)
    res.send(global.list);
})

app.get('/lrc', function (req, res) {
    download('/api/song/lyric?os=pc&lv=-1&kv=-1&tv=-1&id=' + req.query.id, 'lrc');
    JSON.stringify(global.lrc)
    res.send(global.lrc);
})

var server = app.listen(3000);
console.log('Listening on port 3000...');

//加载第三方页面
function download(url, type) {
    var opt = {
        host: 'music.163.com',
        port: '80',
        method: 'GET',//这里是发送的方法
        path: url,     //这里是访问的路径
        headers: {
            //这里放期望发送出去的请求头
        }
    }
    var req = http.request(opt, function (res) {
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
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => rawData += chunk);
        res.on('end', () => {
            try {
                let parsedData = JSON.parse(rawData);
                if (type === 'list') {
                    global.list = parsedData;
                }
                else if (type === 'lrc') {
                    global.lrc = parsedData;
                }

            } catch (e) {
                console.log(e.message);
            }
        });
    }).on('error', (e) => {
        console.log(`错误: ${e.message}`);
    });
    req.end();
}