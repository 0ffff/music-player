var list = {};
(function () {
    var data;
    axios.get('/list', {
        params: {
            id: 60198
        }
    })
        .then(function (res) {
            console.log(res.data.result)
            data = {
                name: res.data.result.name,
                img: res.data.result.coverImgUrl,
                songs: []
            };
            for (var i = 0; i < res.data.result.tracks.length; i++) {
                data.songs.push({
                    id: res.data.result.tracks[i].id,
                    name: res.data.result.tracks[i].name,
                    art: res.data.result.tracks[i].artists[0].name,
                    time: res.data.result.tracks[i].duration,
                    mp3: res.data.result.tracks[i].mp3Url,
                    album: {
                        name: res.data.result.tracks[i].album.name,
                        img: res.data.result.tracks[i].album.picUrl
                    }
                })
            };
            list = data;
            dom();
        })
        .catch(function (error) {
            console.log(error);
        });
}())
//获取歌词
function getLrc(songId) {
    axios.get('/lrc', {
        params: {
            id: songId
        }
    })
        .then(function (res) {
            list.lrc = res.data.lrc.lyric;
            list.tlyric = res.data.tlyric.lyric;
        })
        .catch(function (error) {
            console.log(error);
        });

}
