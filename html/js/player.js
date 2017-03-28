var dom;
(function () {
    var play_list = document.getElementById('play_list');//播放列表
    var audio = document.getElementById('audio_media');//播放器对象
    var back = document.getElementById('back');//上一曲按键
    var play = document.getElementById('play');//开始/暂停按键
    var last = document.getElementById('last');//下一曲按键
    var loop = document.getElementById('loop');//循环类型按键
    var loopType = 'list';//循环类型标志
    var down = document.getElementById('down');//当前下载按钮
    var voice = document.getElementById('voice');//音量按钮
    var curPlayIndex = null,//当前正在播放歌曲的序号
        curPlayList = [];//当前播放列表

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

    function playListIndex(id) {//根据歌曲ID返回歌曲在播放列表中的序号
        for (var i = 0; i < curPlayList.length; i++) {
            if (curPlayList[i].id == id) {
                return i
            }
        }
    }


    dom = function () {//根据歌单渲染dom
        for (var i = 0; i < list.songs.length; i++) {
            curPlayList.push(list.songs[i]);
            var item = document.createElement('li');
            item.innerHTML =
                '<input type="checkbox" class="songlist_checkbox">' +
                // '<div class="songlist_number">' + (i + 1) + '</div>' +
                '<div class="songlist_songname" title=" ' + curPlayList[i].name + ' "> ' + curPlayList[i].name + ' </div>' +
                '<div class="mod_list_menu">' +
                '<a href="javascript:;" class="list_menu_item switch" title="开始/暂停">' +
                '<i class="iconfont icon-iconfontplay2"></i></a>' +
                '<a href="' + curPlayList[i].mp3 + '" class="list_menu_item" title="下载"  download="' + curPlayList[i].name + '">' +
                '<i class="iconfont icon-download"></i></a>' +
                '</div>' +
                '<div class="songlist_artist">' +
                '<a href="#" class="singer_name"> ' + curPlayList[i].art + ' </a>' +
                '</div>' +
                '<div class="songlist_time"> ' + Math.floor(curPlayList[i].time / 60000) + ':' + Math.floor(curPlayList[i].time / 1000 % 60) + ' </div>' +
                '<a href="javascript:;" class="songlist_delete" title="删除">' +
                '<i class="iconfont icon-del"></i>' +
                '</a>';
            play_list.appendChild(item);//将歌单中的歌曲按照模板插入dom树
            for (var j = 0; j < play_list.children[i].children.length; j++) {
                if (play_list.children[i].children[j].className.indexOf('mod_list_menu') !== -1) {
                    play_list.children[i].children[j].children[0].addEventListener('click', function (i, j) {//给歌单中的每一首歌上的按钮绑定事件
                        return function () {//绑定开始/暂停事件
                            if (!audio.paused) {
                                if (curPlayIndex === playListIndex(list.songs[i].id)) {
                                    audio.pause();
                                    renderSwtichBtn(curPlayIndex);
                                }
                                else {
                                    curPlayIndex = playListIndex(list.songs[i].id);
                                    audio.src = list.songs[curPlayIndex].mp3;
                                    audio.play();
                                    renderSwtichBtn(curPlayIndex);
                                }
                            }
                            else {
                                if (curPlayIndex !== playListIndex(list.songs[i].id)) {
                                    curPlayIndex = playListIndex(list.songs[i].id);
                                    audio.src = list.songs[i].mp3;
                                    down.href = list.songs[i].mp3;
                                }
                                audio.play();
                                renderSwtichBtn(curPlayIndex);
                            }

                        }
                    }(i, j))
                }
                if (play_list.children[i].children[j].className.indexOf('songlist_delete') !== -1) {
                    var removed = play_list.children[i];
                    removed.children[j].addEventListener('click', function (removed, i) {//绑定删除事件
                        return function () {
                            if (curPlayIndex < i) {
                                curPlayIndex--;
                            }
                            curPlayList.splice(playListIndex(list.songs[i].id), 1);
                            play_list.removeChild(removed);
                            if (i === curPlayIndex) {
                                audio.src = curPlayList[0].mp3;
                                audio.pause();
                            }
                        }
                    }(removed, i))
                }
            }
        }
    }

    window.onload = function () {//为功能按钮绑定事件
        play.addEventListener('click', function () {//开始/暂停
            if (audio.paused) {
                audio.play();
            }
            else {
                audio.pause();
            }
            renderSwtichBtn(curPlayIndex);
        })
        back.addEventListener('click', function () {//上一曲
            var flag = audio.paused;
            if (curPlayIndex === 0) {
                curPlayIndex = curPlayList.length - 1;
            }
            else {
                curPlayIndex--;
            }
            audio.src = curPlayList[curPlayIndex].mp3;
            down.href = curPlayList[curPlayIndex].mp3;
            if (!flag) {
                audio.play();
            }
            else {
                audio.pause();
            }
            renderSwtichBtn(curPlayIndex);
        })
        last.addEventListener('click', function () {//下一曲
            var flag = audio.paused;
            if (curPlayIndex === curPlayList.length - 1) {
                curPlayIndex = 0;
            }
            else {
                curPlayIndex++;
            }
            audio.src = curPlayList[curPlayIndex].mp3;
            down.href = curPlayList[curPlayIndex].mp3;
            if (!flag) {
                audio.play();
            }
            else {
                audio.pause();
            }
            renderSwtichBtn(curPlayIndex);
        })
        loop.addEventListener('click', function () {//循环类型
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
        })
        voice.addEventListener('click', function () {//静音
            if (audio.muted) {
                voice.innerHTML = '<i class="iconfont icon-playervolumeup"></i>';
            }
            else {
                voice.innerHTML = '<i class="iconfont icon-player-volume-off-copy"></i>';
            }
            audio.muted = !audio.muted;
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

            audio.src = curPlayList[curPlayIndex].mp3;
            down.href = curPlayList[curPlayIndex].mp3;
            renderSwtichBtn(curPlayIndex);
        })
    }
})()