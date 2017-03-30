var getList,
    getLrc,
    search;
(function () {
    //获取歌单
    getList = function (ListId, callBack) {
        var data;
        axios.get('/list', {//获取歌单
            params: {
                id: ListId
            }
        })
            .then(function (res) {
                console.log(res.data.result)
                data = {//把json中有用的信息存储
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
                            id: res.data.result.tracks[i].album.id,
                            name: res.data.result.tracks[i].album.name,
                            img: res.data.result.tracks[i].album.picUrl
                        }
                    })
                };
                callBack(data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    //获取歌词
    getLrc = function (songId, callBack) {
        axios.get('/lrc', {
            params: {
                id: songId
            }
        })
            .then(callBack)
            .catch(function (error) {
                console.log(error);
            });

    }
    //搜索
    search = function (key, type, callBack) {
        axios.get('/search', {
            params: {
                s: key,
                type: type
            }
        })
            .then(callBack)
            .catch(function (error) {
                console.log(error);
            });
    }
}())
