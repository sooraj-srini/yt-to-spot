console.log("ut word");
function youtubeid(url, opts) {
    if (opts == undefined) {
        opts = { fuzzy: true };
    }

    if (/youtu\.?be/.test(url)) {

        // Look first for known patterns
        var i;
        var patterns = [
            /youtu\.be\/([^#\&\?]{11})/,  // youtu.be/<id>
            /\?v=([^#\&\?]{11})/,         // ?v=<id>
            /\&v=([^#\&\?]{11})/,         // &v=<id>
            /embed\/([^#\&\?]{11})/,      // embed/<id>
            /\/v\/([^#\&\?]{11})/         // /v/<id>
        ];

        // If any pattern matches, return the ID
        for (i = 0; i < patterns.length; ++i) {
            if (patterns[i].test(url)) {
                return patterns[i].exec(url)[1];
            }
        }

        if (opts.fuzzy) {
            // If that fails, break it apart by certain characters and look 
            // for the 11 character key
            var tokens = url.split(/[\/\&\?=#\.\s]/g);
            for (i = 0; i < tokens.length; ++i) {
                if (/^[^#\&\?]{11}$/.test(tokens[i])) {
                    return tokens[i];
                }
            }
        }
    }

    return null;
};

// just so it doesn't show up in automated searches
var DEFAULT_KEY = Buffer.from('QUl6YVN5QjBRNGdUaG1zMkp0LTZTZ01ZajR1ZFlLZlZmWE5zcmNj', 'base64') + ''

function getVideoTitle(id, key, cb) {
    if (typeof key === 'function') {
        cb = key
        key = DEFAULT_KEY
    }


    var url = 'https://www.googleapis.com/youtube/v3/videos'
    let searchParams = new URLSearchParams({
        key: key,
        part: 'snippet',
        id: id
    })
    // url += '?' + qs.stringify({
    //     key: key,
    //     part: 'snippet',
    //     id: id
    // })
    url += '?' + searchParams.toString()

    //https.request(url, onrequest).end()
    fetch(url)
    .then(res => res.json())
    .then(onresponse)

    function onresponse(json) {
        if (json.error) return cb(json.error)
        if (json.items.length === 0) return cb(new Error('Not found'))
        cb(null, json.items[0].snippet.title)
    }
}


let id = youtubeid('https://www.youtube.com/watch?v=34Na4j8AVgA&list=RD6366dxFf-Os&index=23')
let title;
const youtubekey = 'AIzaSyCU15C-xTQHFSQeOQNazQ-AswQHq6p1udQ'
const geturl = (url) => {
    console.log("geturl function is working")
    getVideoTitle(id, youtubekey, (err, tit) => {
        if (err != null) {
            console.log(err)
            return
        }
        returnSpot(tit)
    })
}

const returnSpot = (tit) => {
    let titk = encodeURIComponent(tit)
    const auth = "Bearer fc85f25a8ec74ff5b43ad700c91fbb7d"
    const weburl = "https://api.spotify.com/v1/search?q=track%3A" + titk + "&type=track"
    const headers = {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": auth
        }
    }

    fetch(weburl, headers)
    .then(res => res.json())
    .then(res => {
        console.log(res.tracks.items[0].external_urls.spotify)
    }).catch(err => {
        console.log(err)
        console.log(weburl)
    })
}
geturl()