var getData = (function () {
    //获取歌单
    function getList(ListId, callBack) {
        axios.get('./api.php', {//获取歌单
            params: {
                id: ListId,
                type: 'list'
            }
        })
            .then(function (res) {
                var data = {//把json中有用的信息存储
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
    function getLrc(songId, callBack) {
        axios.get('./api.php', {
            params: {
                id: songId,
                type: 'lrc'
            }
        })
            .then(callBack)
            .catch(function (error) {
                console.log(error);
            });

    }
    //搜索
    function search(key, callBack) {
        axios.get('./api.php', {
            params: {
                s: key,
                type: 'search'
            }
        })
            .then(function (res) {
                var data = [];//把json中有用的信息存储
                for (var i = 0; i < res.data.result.songs.length; i++) {
                    data.push({
                        id: res.data.result.songs[i].id,
                        name: res.data.result.songs[i].name,
                        art: res.data.result.songs[i].artists[0].name,
                        time: res.data.result.songs[i].duration,
                        mp3: res.data.result.songs[i].mp3Url,
                        album: {
                            id: res.data.result.songs[i].album.id,
                            name: res.data.result.songs[i].album.name,
                            img: res.data.result.songs[i].album.picUrl
                        }
                    })
                };
                callBack(data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    return {
        list: getList,
        lrc: getLrc,
        search: search
    }
}())
