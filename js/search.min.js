window.downloadAudio = function(query) {
    // Example with `filter` option.
    var url = VIDEO_BASE + query;
    ytdl(url, { filter: function(format) { return format.container === 'mp4'; } })
        .pipe(fs.createWriteStream('vide.mp4'));
}

var BASE_FINDERS = " lyrics -kids -kidzbop ";
var PRE = "<span class=\"pre status\">Now playing...</span><br>";
var POST = "<span class=\"pre\"><br><br>controls:<br>[enter] - Next<br>[space] - Pause</span><br>";
var QS_DATA = "?hl=en&amp;autoplay=1&amp;cc_load_policy=0&amp;loop=1&amp;iv_load_policy=0&amp;fs=0&amp;showinfo=0";
var API_KEY = "38RZbrBm78K0K7O5IOuJrH4db7-UFhtKpHWBzmFM";
var VIDEO_BASE = 'https://www.youtube.com/embed/';
var META_BASE = 'https://www.googleapis.com/youtube/v3/videos';
var SEARCH_BASE = 'https://www.googleapis.com/youtube/v3/search';
var BASE_KEY = "AIzaSyA-_35pvz44BvBsUNIKV8Kgs4GCEneQ4a4";
var vtime = new Timer(null, 1000000000);
var videoHistory = [];
var currentSong = "";
var currentDuration = 0;

if (screen.width <= 800) {
    window.location = "../mobile.html";
}

var searchQuery = function(event, query) {

    var keypress = event ? event : window.event;
    keypress.stopPropagation();

    if (event === null || keypress.keyCode === 13) {

        if (query.trim() === '') {
            if (currentSong) getNextSong(currentSong);
            return;
        }

        hideVisual();
        vtime.stop();

        var options = [];
        options.url = SEARCH_BASE;
        options.type = 'GET';
        options.data = {
            part: 'snippet',
            key: BASE_KEY,
            api_key: API_KEY,
            maxResults: 1,
            type: 'video',
            videoEmbeddable: 'true',
            q: query + " " + BASE_FINDERS
        };

        sendAjaxRequest(options, successCallback);

    }

};

function convert_time(duration) {
    var a = duration.match(/\d+/g);

    if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
        a = [0, a[0], 0];
    }

    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
        a = [a[0], 0, a[1]];
    }
    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
        a = [a[0], 0, 0];
    }

    duration = 0;

    if (a.length == 3) {
        duration = duration + parseInt(a[0]) * 3600;
        duration = duration + parseInt(a[1]) * 60;
        duration = duration + parseInt(a[2]);
    }

    if (a.length == 2) {
        duration = duration + parseInt(a[0]) * 60;
        duration = duration + parseInt(a[1]);
    }

    if (a.length == 1) {
        duration = duration + parseInt(a[0]);
    }
    return duration
}

function getRandom(min, max) {
    return Math.round( Math.random() * (max - min) + min);
}

function playNextSong(data) {
    if (!data) return;
    var rand = getRandom(0, 5);
    data.random = rand;
    searchQuery(null, data.items[rand].snippet.title);
}

function getNextSong(vindex) {
    //get next song
    options = [];
    options.url = SEARCH_BASE;
    options.type = 'GET';

    options.data = {
        part: 'snippet',
        key: BASE_KEY,
        api_key: API_KEY,
        maxResults: 6,
        type: 'video',
        relatedToVideoId: vindex
    };
    vtime.stop();
    sendAjaxRequest(options, playNextSong);
}

function returnDuration(data) {
    var duration = data.items[0].contentDetails ? data.items[0].contentDetails['duration'] : 'ERROR';
    var vindex = data.items[0].id ? data.items[0].id : 'ERROR';
    if (duration != 'ERROR') {
        var timeout = convert_time(duration);
        timeout = (timeout * 1000) - 1700;
        timeout = Math.min(360000, timeout);
        vtime.stop();
        vtime = new Timer(function() {
            currentDuration = timeout;
            getNextSong(vindex);
        },timeout);
    }
}

var getDurationAndNextSong = function(vindex) {
    //get duration
    options = [];
    options.url = META_BASE;
    options.type = 'GET';
    options.data = {
        part: 'contentDetails',
        key: BASE_KEY,
        api_key: API_KEY,
        type: 'video',
        id: vindex
    };
    sendAjaxRequest(options, returnDuration);
};

var successCallback = function(data) {
    //console.log((data));
    if (data) {
        var vtitle = data.items[0].snippet['title'];
        var vindex = data.items[0].id['videoId'];
        var dupe = $.grep(videoHistory, function(hit) {
            return hit.index == vindex;
        });
        if (dupe.length>0) {
            console.log("ALREADY PLAYED: " + vtitle);
            vtime.stop();
            getNextSong(vindex);
        }
        vtitle = vtitle.replace(/\(Lyrics\)/gi,'');
        vtitle = vtitle.replace(/Lyrics/gi,'');
        vtitle = vtitle.replace(/w\//gi,'');
        vtitle = vtitle.replace(/\+/gi,' ');
        vtitle = vtitle.replace(/\[/gi,'');
        vtitle = vtitle.replace(/audio/gi,'');
        vtitle = vtitle.replace(/video/gi,'');
        vtitle = vtitle.replace(/\)/gi,'');
        vtitle = vtitle.replace(/\(/gi,'');
        vtitle = vtitle.replace(/official/gi,'');
        vtitle = vtitle.replace(/]/gi,'');
        vtitle = vtitle.replace(/wmv/gi,'');
        vtitle = vtitle.replace(/mp3/gi,'');
        vtitle = vtitle.replace(/\./gi,'');
        vtitle = vtitle.trim();
        $('div#search_result').html(PRE+"<span id=\"srtitle\">"+vtitle+"</span>"+POST);
        $('iframe#front_player').attr('src', VIDEO_BASE + vindex + QS_DATA);
        currentSong = vindex;
        videoHistory.push({index:vindex,title:vtitle});
        console.log(videoHistory);
        console.log(vtitle);
        window.setTimeout(showVisual, 2000);
        $("#myInp").trigger("blur");
        $("#myInp").val("");
        getDurationAndNextSong(vindex);
    }
};

function sendAjaxRequest(options, successCallback) {
    $.ajax({
        url: options.url ? options.url : 'ERROR',
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Accept", "*/*");
            xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        },
        type: options.type ? options.type : 'GET',
        dataType: 'json',
        contentType: 'application/json',
        processData: true,
        data: options.data ? options.data : {},
        success: successCallback ? successCallback : function(data) {
            console.log("SUCCESS");
            console.log(JSON.stringify(data));
        },
        error: options.error ? options.error : function(data){
            console.log("ERROR: Cannot get data");
            console.log(JSON.stringify(data));
        }
    });
}

var showVisual = function() {
    $('#bars').fadeIn(1000);
};

var hideVisual = function() {
    $('#bars').fadeOut(1000);
};

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-17692414-10', 'auto');
ga('send', 'pageview');

function audioController(event) {

    if ($('#front_player').attr('src')==='') return;

    var e = event ? event : window.event;
    e.stopPropagation();

    if (e.keyCode||e.charCode === 13) {
        getNextSong(currentSong);
    }

    if (e.keyCode||e.charCode === 32) {
        if ($('iframe#front_player').attr('src') === "") {
            $('iframe#front_player').attr('src', VIDEO_BASE + currentSong + QS_DATA + "&amp;start=" + (currentDuration));
            showVisual();
            vtime.resume();
        } else {
            $('iframe#front_player').attr('src', '');
            hideVisual();
            vtime.pause();
        }
    }

}

//window.addEventListener('keypress',function(){audioController()});

$(document).keypress(function(event) {
    audioController(event);
    event.preventDefault();
});

function Timer(callback, delay) {
    var timerId, start, remaining = delay;
    var total = (remaining);

    this.stop = function() {
        window.clearTimeout(timerId);
    };

    this.pause = function() {
        $('span.status').html("Paused...");
        window.clearTimeout(timerId);
        remaining -= new Date() - start;
        console.log('remaining:' + remaining);
        currentDuration = Math.floor((total-remaining)/1000);
    };

    this.resume = function() {
        $('span.status').html("Now playing...");
        start = new Date();
        window.clearTimeout(timerId);
        timerId = window.setTimeout(callback, remaining);
    };

    this.resume();

    return timerId;
}