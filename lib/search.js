var VIDEO_BASE = 'https://www.youtube.com/embed/';
var SEARCH_BASE = 'https://www.googleapis.com/youtube/v3/search';
var API_KEY = "38RZbrBm78K0K7O5IOuJrH4db7-UFhtKpHWBzmFM";
var BASE_KEY = "AIzaSyA-_35pvz44BvBsUNIKV8Kgs4GCEneQ4a4";
var BASE_FINDERS = " lyrics ";
var PRE = "<span class=\"pre\">Is this what you are looking for?</span><br>";
var QS_DATA = "?hl=en&amp;autoplay=1&amp;cc_load_policy=0&amp;loop=1&amp;iv_load_policy=0&amp;fs=0&amp;showinfo=0";

//window.downloadAudio = function(query) {
//    // Example with `filter` option.
//    var url = VIDEO_BASE + query;
//    ytdl(url, { filter: function(format) { return format.container === 'mp4'; } })
//        .pipe(fs.createWriteStream('vide.mp4'));
//}


var searchQuery = function(query) {

    if (event.keyCode !== 13) return;

    $.ajax({
        url: SEARCH_BASE,
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Accept", "*/*");
            xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        },
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        processData: true,
        data: {
            part: 'snippet',
            key: BASE_KEY,
            api_key: API_KEY,
            maxResults: 5,
            type: 'video',
            videoEmbeddable: 'true',
            q: query + BASE_FINDERS
        },
        success: function(data) {
            console.log((data));
            if (data) {
                var vtitle = data.items[0].snippet['title'];
                var vindex = data.items[0].id['videoId'];
                vtitle = vtitle.replace(/\(Lyrics\)/gi,'');
                vtitle = vtitle.replace(/Lyrics/gi,'');
                $('div#search_result').html(PRE+"<span id=\"srtitle\">"+vtitle+"</span>");
                $('iframe#front_player').attr('src', VIDEO_BASE + vindex + QS_DATA);
                $('#bars').show();
                $("#myInp").trigger("blur");
            }
        },
        error: function(data){
            alert("Cannot get data");
            alert(JSON.stringify(data));
        }
    });
}