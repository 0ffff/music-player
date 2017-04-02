(function () {
    var playList = document.getElementById('play_list');//播放列表
    var audio = document.getElementById('audio_media');//播放器对象
    var bg = document.getElementById('bg');//背景图片
    var album = document.getElementById('album');//封面图片
    var curInfo = document.getElementById('cur_info');//当前歌曲信息 
    var lrcBox = document.getElementById('lrc_box');//歌词框
    var prev = document.getElementById('prev');//上一曲按键
    var play = document.getElementById('play');//开始/暂停按键
    var next = document.getElementById('next');//下一曲按键
    var info = document.getElementById('player_music_info');//当前播放的歌曲信息
    var time = document.getElementById('player_music_time');//当前播放的歌曲时长
    var progress = document.getElementById('player_progress').firstElementChild;//歌曲进度条
    var loop = document.getElementById('loop');//循环类型按键
    var loopType = 'list';//循环类型标志
    var down = document.getElementById('down');//当前下载按钮
    var mute = document.getElementById('mute');//静音按钮
    var volume = document.getElementById('volume_progress');//音量调节
    var searchBox = document.getElementById('search_box').firstElementChild;//搜索栏
    var searchList = document.getElementById('search_list');//搜索结果列表
    var curPlayIndex = null,//当前正在播放歌曲的序号
        curPlayList = [];//当前播放列表

    function init() {//初始化
        if (localStorage.data && localStorage.data !== '[]') {
            curPlayList = JSON.parse(localStorage.data);
            for (var i = 0; i < curPlayList.length; i++) {//播放列表渲染DOM
                playList.appendChild(randerDOM(curPlayList[i]));
            }
        }
        else {
            getList(60198, function (data) {//获取初始数据
                curPlayList = data.songs;//把数据存入播放列表
                for (var i = 0; i < curPlayList.length; i++) {//播放列表渲染DOM
                    playList.appendChild(randerDOM(curPlayList[i]));
                }
            });
        }
    }

    function renderSwtichBtn(index) {//渲染所有开始/暂停按键的状态
        for (var i = 0; i < play_list.children.length; i++) {
            for (var j = 0; j < play_list.children[i].children.length; j++) {
                if (play_list.children[i].children[j].className.indexOf('mod_list_menu') !== -1) {
                    if (!audio.paused) {
                        if (i === index) {
                            play_list.children[index].children[j].children[0].innerHTML = '<i class="iconfont icon-pause"></i>';
                        }
                        else {
                            play_list.children[i].children[j].children[0].innerHTML = '<i class="iconfont icon-iconfontplay2"></i>';
                        }
                        play.innerHTML = '<i class="iconfont icon-playerpause-copy"></i>';
                    }
                    else {
                        play_list.children[i].children[j].children[0].innerHTML = '<i class="iconfont icon-iconfontplay2"></i>';
                        play.innerHTML = '<i class="iconfont icon-playerplay"></i>';
                    }
                }

            }
        }
    }

    function fix(num, length) {//格式化数字位数
        return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
    }


    function playListIndex(id) {//根据歌曲ID返回歌曲在播放列表中的序号
        for (var i = 0; i < curPlayList.length; i++) {
            if (curPlayList[i].id == id) {
                return i
            }
        }
    }

    function curPlayer() {//渲染当前播放器播放状态（包括歌曲信息、歌曲长度、下载按钮地址等）
        album.innerHTML = '<img src="' + curPlayList[curPlayIndex].album.img + '" alt="' + curPlayList[curPlayIndex].album.name + '">';
        curInfo.innerHTML = '<p>歌曲：' + curPlayList[curPlayIndex].name + '</p>' +
            '<p>歌手：<a href="javascript:;">' + curPlayList[curPlayIndex].art + '</a></p>' +
            '<p>专辑：<a href="javascript:;">' + curPlayList[curPlayIndex].album.name + '</a></p>';
        getLrc(curPlayList[curPlayIndex].id, function (res) {
            lrcScroll(res.data.lrc.lyric);
        });
        info.innerHTML = curPlayList[curPlayIndex].name + ' - ' + curPlayList[curPlayIndex].art;
        audio.src = curPlayList[curPlayIndex].mp3;
        down.href = curPlayList[curPlayIndex].mp3;
        bg.style.backgroundImage = 'url("' + curPlayList[curPlayIndex].album.img + '")';
    }

    var timer = setInterval(function () {
        if (audio.duration) {//更新播放时间
            time.innerHTML = fix(Math.round(audio.currentTime / 60), 2) + ':' + fix(Math.round(audio.currentTime % 60), 2) + '/' + fix(Math.round(audio.duration / 60), 2) + ':' + fix(Math.round(audio.duration % 60), 2);
            progress.max = audio.duration;
            progress.value = audio.currentTime;
        }
        else {
            time.innerHTML = '00:00';
        }
        for (var i = 0; i < playList.children.length; i++) {
            playList.children[i].className = '';
        }
        if (!audio.paused) {//显示正在播放状态的样式
            playList.children[curPlayIndex].className = 'cur_play';
        }
    }, 500)

    function randerDOM(song) {//根据歌曲数据渲染DOM
        var node = document.createElement('li');
        node.innerHTML =
            '<div class="songlist_songname" title=" ' + song.name + ' "> ' + song.name + ' </div>' +
            '<div class="mod_list_menu">' +
            '<a href="javascript:;" class="list_menu_item switch" title="开始/暂停">' +
            '<i class="iconfont icon-iconfontplay2"></i></a>' +
            '<a href="' + song.mp3 + '" class="list_menu_item" title="下载"  download="' + song.name + '">' +
            '<i class="iconfont icon-download"></i></a>' +
            '</div>' +
            '<div class="songlist_artist">' +
            '<a href="javascript:;" id="singer_name"> ' + song.art + ' </a>' +
            '</div>' +
            '<div class="songlist_time"> ' + fix(Math.round(song.time / 60000), 2) + ':' + fix(Math.round(song.time / 1000 % 60), 2) + ' </div>' +
            '<a href="javascript:;" class="songlist_delete" title="删除">' +
            '<i class="iconfont icon-del"></i>' +
            '</a>';

        for (var i = 0; i < node.children.length; i++) {
            if (node.children[i].className.indexOf('mod_list_menu') !== -1) {
                node.children[i].children[0].addEventListener('click', function (id) {//给歌单中的每一首歌上的按钮绑定事件
                    return function () {//按钮绑定开始/暂停事件
                        if (!audio.paused) {
                            if (curPlayIndex === playListIndex(id)) {
                                audio.pause();
                                renderSwtichBtn(curPlayIndex);
                            }
                            else {
                                curPlayIndex = playListIndex(id);
                                curPlayer();
                                audio.play();
                                renderSwtichBtn(curPlayIndex);
                            }
                        }
                        else {
                            if (curPlayIndex !== playListIndex(id)) {
                                curPlayIndex = playListIndex(id);
                                curPlayer();
                            }
                            audio.play();
                            renderSwtichBtn(curPlayIndex);
                        }

                    }
                }(song.id))
            }
            if (node.children[i].className.indexOf('songlist_songname') !== -1) {
                node.children[i].addEventListener('dblclick', function (id) {//给歌单中的每一首歌上的歌曲名字绑定事件
                    return function () {//歌名绑定双击开始/暂停事件
                        if (!audio.paused) {
                            if (curPlayIndex === playListIndex(id)) {
                                audio.pause();
                                renderSwtichBtn(curPlayIndex);
                            }
                            else {
                                curPlayIndex = playListIndex(id);
                                curPlayer();
                                audio.play();
                                renderSwtichBtn(curPlayIndex);
                            }
                        }
                        else {
                            if (curPlayIndex !== playListIndex(id)) {
                                curPlayIndex = playListIndex(id);
                                curPlayer();
                            }
                            audio.play();
                            renderSwtichBtn(curPlayIndex);
                        }

                    }
                }(song.id))
            }
            if (node.children[i].className.indexOf('songlist_delete') !== -1) {
                var removed = node;
                node.children[i].addEventListener('click', function (id, removed) {//绑定删除事件
                    return function () {
                        if (curPlayIndex || curPlayIndex < playListIndex(id)) {
                            curPlayIndex--;
                        }
                        if (playListIndex(id) == curPlayIndex) {
                            var flag = audio.paused;
                            curPlayList.splice(playListIndex(id), 1);
                            curPlayer();
                            if (!flag) {
                                audio.play();
                            }
                            else {
                                audio.pause();
                            }
                            renderSwtichBtn(curPlayIndex);
                        }
                        else {
                            curPlayList.splice(playListIndex(id), 1);
                        }
                        playList.removeChild(node);
                        localStorage.data = JSON.stringify(curPlayList);
                    }
                }(song.id, removed))
            }
        }
        return node;

    }

    function mPlay() {//开始/暂停
        if (!audio.src) {
            curPlayIndex = 0;
            curPlayer();
        }
        if (audio.paused) {
            audio.play();
        }
        else {
            audio.pause();
        }
        renderSwtichBtn(curPlayIndex);
    }

    function mPrev() {//上一曲
        var flag = audio.paused;
        if (curPlayIndex === 0) {
            curPlayIndex = curPlayList.length - 1;
        }
        else {
            curPlayIndex--;
        }
        curPlayer();
        if (!flag) {
            audio.play();
        }
        else {
            audio.pause();
        }
        renderSwtichBtn(curPlayIndex);
    }

    function mNext() {//下一曲
        var flag = audio.paused;
        if (loopType === 'list' || loopType === 'loop') {//根据循环类型标志确定循环方式
            audio.loop = false;
            if (curPlayIndex === curPlayList.length - 1) {
                curPlayIndex = 0;
            }
            else {
                curPlayIndex++;
            }
        }
        else if (loopType === 'random') {
            audio.loop = false;
            curPlayIndex = Math.floor(Math.random() * curPlayList.length);
        }
        curPlayer();
        if (!flag) {
            audio.play();
        }
        else {
            audio.pause();
        }
        renderSwtichBtn(curPlayIndex);
    }

    function mLoop() {//循环类型
        if (loopType === 'list') {
            loopType = 'random';
            loop.innerHTML = '<i class="iconfont icon-random"></i>';
        }
        else if (loopType === 'random') {
            loopType = 'loop';
            loop.innerHTML = '<i class="iconfont icon-single1"></i>';
        }
        else if (loopType === 'loop') {
            loopType = 'list';
            loop.innerHTML = '<i class="iconfont icon-single"></i>';
        }
    }

    function mMute() {//静音
        if (audio.muted) {
            mute.innerHTML = '<i class="iconfont icon-playervolumeup"></i>';
            volume.value = 100;
        }
        else {
            mute.innerHTML = '<i class="iconfont icon-player-volume-off-copy"></i>';
            volume.value = 0;
        }
        audio.volume = volume.value / 100
        audio.muted = !audio.muted;
    }

    function mSearch() {//搜索
        search(searchBox.value, function (data) {
            var ul = document.createElement('ul');
            for (var i = 0; i < data.length; i++) {//把搜索结果插入DOM
                var item = document.createElement('li');
                item.innerHTML = data[i].name + ' - ' + data[i].art;
                item.addEventListener('click', function (data) {//点击插入播放列表
                    return function () {
                        curPlayList.push(data);
                        playList.appendChild(randerDOM(data));
                        localStorage.data = JSON.stringify(curPlayList);
                        searchList.innerHTML = '';
                        searchList.style.display = 'none';
                        searchBox.value = '';
                    }
                }(data[i]))
                searchList.innerHTML = '';
                searchList.style.display = 'none';
                ul.appendChild(item);
                searchList.style.display = 'block';
            }
            searchList.appendChild(ul);
        })
    }

    init();//运行初始化

    window.onload = function () {//为功能按钮绑定事件
        play.addEventListener('click', function () {
            mPlay();
        })
        prev.addEventListener('click', function () {
            mPrev();
        })
        next.addEventListener('click', function () {
            mNext();
        })
        loop.addEventListener('click', function () {
            mLoop();
        })
        mute.addEventListener('click', function () {
            mMute();
        })
        audio.addEventListener('ended', function () {//切换下一曲的方式
            if (loopType === 'list') {//根据循环类型标志确定循环方式
                audio.loop = false;
                if (curPlayIndex === curPlayList.length - 1) {
                    curPlayIndex = 0;
                }
                else {
                    curPlayIndex++;
                }
            }
            else if (loopType === 'random') {
                audio.loop = false;
                curPlayIndex = Math.floor(Math.random() * curPlayList.length);
            }
            else if (loopType === 'loop') {
                audio.loop = true;
            }
            curPlayer();
            renderSwtichBtn(curPlayIndex);
        })
        progress.addEventListener('change', function () {//拖动歌曲进度条
            audio.currentTime = progress.value;
        })
        volume.addEventListener('change', function () {//拖动音量进度条
            if (volume.value == 0) {//如果音量为0则切换静音标志
                audio.muted = true;
                mute.innerHTML = '<i class="iconfont icon-player-volume-off-copy"></i>';
            }
            else {
                audio.muted = false;
                mute.innerHTML = '<i class="iconfont icon-playervolumeup"></i>';
            }
            audio.volume = volume.value / 100;
        })
        searchBox.addEventListener('keyup', function () {//搜索
            searchList.innerHTML = '';
            searchList.style.display = 'none';
            mSearch();

        })
        searchBox.addEventListener('focus', function () {//搜索
            searchBox.parentElement.style.borderColor = '#ff9800';
            mSearch();
        })
        searchBox.addEventListener('blur', function () {//搜索框失焦边框颜色复位
            searchBox.parentElement.style.borderColor = 'rgba(225, 225, 225, 0.8)';
        })
        document.addEventListener('click', function (e) {//输入框失焦隐藏搜索结果
            if (searchList.innerHTML) {
                e = e || window.event; //for IE8,7 compatibility
                var t = e.target || e.srcElement; // clicked element
                var sig = false;
                // now check all parents
                while (t) {
                    if (t === searchBox || t === searchList) {
                        sig = true;
                    }
                    t = t.parentNode;
                }
                if (sig) {
                    return;
                }
                searchList.innerHTML = '';
                searchList.style.display = 'none';
            }
        })
        document.addEventListener('keydown', function (e) {
            switch (e.keyCode) {
                case 32:
                case 19:
                    mPlay();
                    break;
                case 37:
                    e.altKey && mBack();
                    break;
                case 39:
                    e.altKey && mNext();
                    break;
                case 38:
                    e.altKey && (audio.volume = audio.volume + 0.1);
                    break;
                case 40:
                    e.altKey && (audio.volume = audio.volume - 0.1);
                    break;
                case 67:
                    e.altKey && mLoop();
                    break;
                case 68:
                    e.altKey && document.getElementById('down').click();
            }
        })
    }
})()