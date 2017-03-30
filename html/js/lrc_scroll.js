var lrcScroll;
(function () {
    var audio = document.getElementById('audio_media');//播放器对象
    var lrcBox = document.getElementById('lrc_box');//歌词框
    lrcScroll = function (lrc) {
        //处理数据
        var lrcArray = lrc.split('\n');
        var dataObj = {},
            strArray = [],
            timeArray = [];
        for (var m = 0; m < lrcArray.length; m++) {
            var clause = lrcArray[m].replace(/\[\d*:\d*((\.|\:)\d*)*\]/g, '');
            var timeRegExpArr = lrcArray[m].match(/\[\d*:\d*((\.|\:)\d*)*\]/g);
            if (timeRegExpArr) {
                for (var k = 0; k < timeRegExpArr.length; k++) {
                    var time = Number(timeRegExpArr[k].slice(1, 3)) * 60 + Number(timeRegExpArr[k].slice(4, 9));
                    dataObj[time] = clause;
                }
            }
        }
        for (var key in dataObj) {
            timeArray.push(key);
        }
        var length = Object.getOwnPropertyNames(dataObj).length;
        timeArray.sort(function (a, b) {
            return a - b;
        })
        for (var n = 0; n < length; n++) {
            strArray.push(dataObj[timeArray[n]]);
        }
        //插入DOM
        var ul = document.createElement('ul');
        for (var l = 0; l < strArray.length; l++) {
            var item = document.createElement('li');
            item.innerHTML = strArray[l];
            ul.appendChild(item);
        }
        lrcBox.innerHTML = '';
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
}
)()