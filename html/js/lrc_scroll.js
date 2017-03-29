var lrcScroll;
(function () {
    var audio = document.getElementById('audio_media');//播放器对象
    var lrcBox = document.getElementById('lrc_box');//歌词框
    lrcScroll = function (lrc) {
        //处理数据
        var lrcArray = lrc.replace(/\[\D(.*)]/, '').replace(/\[\d*:\d*((\.|\:)\d*)*\]/g, '++').split('++');
        lrcArray.shift();
        var timeArray = lrc.match(/\[\d*:\d*((\.|\:)\d*)*\]/g);
        for (var i = 0; i < timeArray.length; i++) {
            timeArray[i] = Number(timeArray[i].slice(1, 3)) * 60 + Number(timeArray[i].slice(4, 9));
        }
        //插入DOM
        var ul = document.createElement('ul');
        for (var j = 0; j < lrcArray.length; j++) {
            var item = document.createElement('li');
            item.innerHTML = lrcArray[j];
            ul.appendChild(item);
        }
        lrcBox.appendChild(ul);
        //歌词滚动
        ul.style.transition = 'transform 0.2s ease-out';
        ul.style.transform = 'translate3d(0px, ' + lrcBox.offsetHeight * 2 / 5 + 'px, 0px)';
        var lrc_timer = setInterval(function () {
            for (var i = 0; i < timeArray.length; i++) {
                if (Math.abs(audio.currentTime - timeArray[i]) < 0.1) {
                    var sumOffsetHight = 0;
                    for (var j = 0; j < i; j++) {
                        sumOffsetHight += ul.children[j].offsetHeight;
                    }
                    for (var o = 0; o < ul.children.length; o++) {
                        ul.children[o].className = '';
                    }
                    ul.children[i].className = 'lrc_on';
                    ul.style.transform = 'translate3d(0px, -' + (sumOffsetHight - lrcBox.offsetHeight * 2 / 5) + 'px, 0px)';
                }
            }
        }, 50)

    }
})()