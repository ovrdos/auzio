window.downloadAudio = function(e) {
    var t = VIDEO_BASE + e;
    ytdl(t, {
        filter: function(e) {
            return "mp4" === e.container
        }
    }).pipe(fs.createWriteStream("vide.mp4"))
};

function convert_time(e) {
    var t = e.match(/\d+/g);
    return e.indexOf("M") >= 0 && -1 == e.indexOf("H") && -1 == e.indexOf("S") && (t = [0, t[0], 0]), e.indexOf("H") >= 0 && -1 == e.indexOf("M") && (t = [t[0], 0, t[1]]), e.indexOf("H") >= 0 && -1 == e.indexOf("M") && -1 == e.indexOf("S") && (t = [t[0], 0, 0]), e = 0, 3 == t.length && (e += 3600 * parseInt(t[0]), e += 60 * parseInt(t[1]), e += parseInt(t[2])), 2 == t.length && (e += 60 * parseInt(t[0]), e += parseInt(t[1])), 1 == t.length && (e += parseInt(t[0])), e
}

function getRandom(e, t) {
    return Math.round(Math.random() * (t - e) + e)
}

function onYouTubePlayerAPIReady() {
    front_player = window.player = new YT.Player("front_player", {
        height: "390",
        width: "640"
    })
}

var playNextSong = function(e) {
    if (e) {
        var t = getRandom(0, 5);
        e.random = t, e.items[t] && successCallback(e)
    }
}

var getNextSong = function(e) {
    options = [], options.url = SEARCH_BASE, options.type = "GET", options.data = {
        part: "snippet",
        key: BASE_KEY,
        api_key: API_KEY,
        maxResults: 6,
        type: "video",
        relatedToVideoId: e
    }, vtime.stop(), sendAjaxRequest(options, playNextSong)
}

function returnDuration(e) {
    var t = e.items[0].contentDetails ? e.items[0].contentDetails.duration : "ERROR",
        n = e.items[0].id ? e.items[0].id : "ERROR";
    if ("ERROR" != t) {
        var o = convert_time(t);
        o = 1e3 * o - 1700, o = Math.min(36e4, o), vtime.stop(), vtime = new Timer(function() {
            currentDuration = o, getNextSong(n)
        }, o)
    }
}

function sendAjaxRequest(e, t) {
    $.ajax({
        url: e.url ? e.url : "ERROR",
        beforeSend: function(e) {
            e.setRequestHeader("Accept", "*/*"), e.setRequestHeader("Access-Control-Allow-Origin", "*")
        },
        type: e.type ? e.type : "GET",
        dataType: "json",
        contentType: "application/json",
        processData: !0,
        data: e.data ? e.data : {},
        success: t ? t : function(e) {
            console.log("SUCCESS"), console.log(JSON.stringify(e))
        },
        error: e.error ? e.error : function(e) {
            console.log("ERROR: Cannot get data"), console.log(JSON.stringify(e))
        }
    })
}

function audioController(e) {
    "" !== currentSong && ((e.keyCode || 13 === e.charCode) && getNextSong(currentSong), (e.keyCode || 32 === e.charCode) && (1 != front_player.getPlayerState() ? (front_player.playVideo(), showVisual(), vtime.resume()) : (front_player.pauseVideo(), hideVisual(), vtime.pause())))
}

function Timer(e, t) {
    var n, o, i = t,
        a = i;
    return this.stop = function() {
        window.clearTimeout(n)
    }, this.pause = function() {
        $("span.status").html("Paused..."), window.clearTimeout(n), i -= new Date - o, console.log("remaining:" + i), currentDuration = Math.floor((a - i) / 1e3)
    }, this.resume = function() {
        $("span.status").html("Now playing..."), o = new Date, window.clearTimeout(n), n = window.setTimeout(e, i)
    }, this.resume(), n
}

var tag = document.createElement("script");
tag.src = "https://www.youtube.com/player_api";

var playSong = function() {
    front_player.playVideo();
    showVisual();
    vtime.resume();
}

var pauseSong = function() {
    front_player.pauseVideo();
    hideVisual();
    vtime.pause();
}

var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var front_player, BASE_FINDERS = " lyrics -kids -kidzbop ",
    PRE = '<span class="pre status">Now playing...</span><br>',
    POST = '<span class="pre"><br><img class="pause" src="media/svg/pause.svg" onclick="pauseSong()"/><img class="play" src="media/svg/play.svg" onclick="playSong()"/><img class="next" src="media/svg/next.svg" onclick="getNextSong(currentSong)"/><br>[enter] -> next song<br>[space] -> <span class="pauser">pause</span></span><br>',
    QS_DATA = "?hl=en&amp;autoplay=1&amp;cc_load_policy=0&amp;loop=1&amp;iv_load_policy=0&amp;fs=0&amp;showinfo=0",
    API_KEY = "38RZbrBm78K0K7O5IOuJrH4db7-UFhtKpHWBzmFM",
    VIDEO_BASE = "https://www.youtube.com/embed/",
    META_BASE = "https://www.googleapis.com/youtube/v3/videos",
    SEARCH_BASE = "https://www.googleapis.com/youtube/v3/search",
    BASE_KEY = "AIzaSyA-_35pvz44BvBsUNIKV8Kgs4GCEneQ4a4",
    vtime = new Timer(null, 1e9),
    videoHistory = [],
    currentSong = "",
    currentDuration = 0,
    quePlayer = "div#front_player";

var searchQuery = function(e, t) {
var n = e ? e : window.event;
if (n.stopPropagation(), null === e || 13 === n.keyCode) {
    if ("" === t.trim()) return void(currentSong && getNextSong(currentSong));
    hideVisual(), vtime.stop();
    var o = [];
    o.url = SEARCH_BASE, o.type = "GET", o.data = {
        part: "snippet",
        key: BASE_KEY,
        api_key: API_KEY,
        maxResults: 3,
        type: "video",
        videoEmbeddable: "true",
        q: t + " " + BASE_FINDERS
    }, sendAjaxRequest(o, successCallback)
}
},

getDurationAndNextSong = function(e) {
    options = [], options.url = META_BASE, options.type = "GET", options.data = {
        part: "contentDetails",
        key: BASE_KEY,
        api_key: API_KEY,
        type: "video",
        id: e
    }, sendAjaxRequest(options, returnDuration)
},

successCallback = function(e) {
    if (0 == e.items.length) return $("div#search_result").html(PRE), void $("span.status").html("Coudn't find that one...");

    if (e) {
        var t = e.items[0].snippet.title,
            n = e.items[0].id.videoId,
            o = $.grep(videoHistory, function(e) {
                return e.index == n
            });
        o.length > 0 && (console.log("ALREADY PLAYED: " + t), t = e.items[1].snippet.title, n = e.items[1].id.videoId), t = t.replace(/with lyrics/gi, ""), t = t.replace(/\(lyrics\)/gi, ""), t = t.replace(/lyrics/gi, ""), t = t.replace(/lyric/gi, ""), t = t.replace(/w\//gi, ""), t = t.replace(/\+/gi, " "), t = t.replace(/\[/gi, ""), t = t.replace(/audio/gi, ""), t = t.replace(/video/gi, ""), t = t.replace(/\)/gi, ""), t = t.replace(/\(/gi, ""), t = t.replace(/official/gi, ""), t = t.replace(/]/gi, ""), t = t.replace(/wmv/gi, ""), t = t.replace(/mp3/gi, ""), t = t.replace(/\./gi, ""), t = t.trim(), $("div#search_result").html(PRE + '<span id="srtitle">' + t + "</span>" + POST), front_player.loadVideoById(n), currentSong = n, videoHistory.push({
            index: n,
            title: t
        }), console.log(videoHistory), console.log(t), window.setTimeout(showVisual, 2e3), $("#myInp").trigger("blur"), $("#myInp").val(""), getDurationAndNextSong(n)
    }

    setTimeout(function(){front_player.playVideo()}, 2000);
},

showVisual = function() {
    $("#bars").fadeIn(500)
},

hideVisual = function() {
    $("#bars").fadeOut(500)
};

document.addEventListener('keypress', function(event) {
    var e = event ? event : window.event;
    console.log(e.keyCode);
    "" !== currentSong && ((13 === e.keyCode || 13 === e.charCode) && getNextSong(currentSong), (32 === e.keyCode || 32 === e.charCode) && (1 != front_player.getPlayerState() ? (front_player.playVideo(), showVisual(), vtime.resume()) : (front_player.pauseVideo(), hideVisual(), vtime.pause())))
});


(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-17692414-10', 'auto');
ga('send', 'pageview');