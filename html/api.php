<?php


        //判断请求目的
    if ($_SERVER["REQUEST_METHOD"] == "GET") {
        if($_GET["type"] == "list"){
            getList();
        }
        elseif($_GET["type"] == "lrc"){
            getLrc();
        }
        elseif($_GET["type"] == "search"){
            search();
        }
    }

    function getList(){
        $id=$_GET["id"];
        $url='music.163.com/api/playlist/detail?id='.$id;
        $res=HttpGet($url);
        echo $res;
    }

    function getLrc(){
        $id=$_GET["id"];
        $url='music.163.com/api/song/lyric?os=pc&lv=-1&kv=-1&tv=-1&id='.$id;
        $res=HttpGet($url);
        echo $res;
    }

    function search(){
        $s=$_GET["s"];
        $s=rawurlencode($s);
        $url='music.163.com/api/search/pc?offset=0&limit=10&type=1&s='.$s;
        $res=HttpPost($url);
        echo $res;
    }
    
    function HttpGet($url){
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

     function HttpPost($url){

        $ch = curl_init();
        //如果$param是数组的话直接用
        curl_setopt($ch, CURLOPT_URL, $url);
        //如果$param是json格式的数据，则打开下面这个注释
        // curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        //         'Content-Type: application/json',
        //         'Content-Length: ' . strlen($param))
        // );
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