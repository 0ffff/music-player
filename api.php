<?php


        //判断请求目的
    if ($_SERVER["REQUEST_METHOD"] == "GET") {
        if($get->type == "list"){
            getList();
        }
        elseif($get->type == "lrc"){
            getLrc();
        }
        elseif($get->type == "search"){
            search();
        }
    }

    function getList(){
        $id=$get->id;
        $url='music.163.com/api/playlist/detail?id='.$id;
        $res=HttpGet($url);
        each $res;
    }

    function getLrc(){
        $id=$get->id;
        $url='music.163.com/api/song/lyric?os=pc&lv=-1&kv=-1&tv=-1&id='.$id;
        $res=HttpGet($url);
        each $res;
    }

    function search(){
        $s=$get->s;
        $param={
            "s":$s,
            "offset":0,
            "limit":10,
            "type":1
        }
        $url='music.163.com/api/search/pc';
        $res=HttpPost($url,$param);
        each $res;
    }
    
    public function HttpGet($url){
        $curl = curl_init ();
        curl_setopt ( $curl, CURLOPT_URL, $url );
        curl_setopt ( $curl, CURLOPT_RETURNTRANSFER, true );
        // curl_setopt ( $curl, CURLOPT_TIMEOUT, 500 );
        // curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36');
        
        //如果用的协议是https则打开鞋面这个注释
        //curl_setopt ( $curl, CURLOPT_SSL_VERIFYPEER, false );
        // curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        
        $res = curl_exec ( $curl );
        curl_close ( $curl );
        return $res;
    }

     public function HttpPost($url,$param){

        $ch = curl_init();
        //如果$param是数组的话直接用
        curl_setopt($ch, CURLOPT_URL, $url);
        //如果$param是json格式的数据，则打开下面这个注释
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json',
                'Content-Length: ' . strlen($param))
        );
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $param);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        //如果用的协议是https则打开鞋面这个注释
        // curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        // curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);

        $data = curl_exec($ch);

        curl_close($ch);
        return $data;

    }
    
?>