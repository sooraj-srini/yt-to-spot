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
var DEFAULT_KEY = 'QUl6YVN5QjBRNGdUaG1zMkp0LTZTZ01ZajR1ZFlLZlZmWE5zcmNj'

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


let auth = "Bearer BQCxaLe28j_Mh8HVSi1MYPNH_MXqmBlyCcHNk2F10KJmlSQFFBp4PZ6Ls-difQfvrNeOOV4cozbfmEx96TT6-YPc0cISdlZtZAQw-Vu4urduw7BRX6bj7hSqcIrQX5YhJ3pVYhnHvtwv6QXZs8ygC5d5C1MEc284owGSAVGx1Zwsmbh4g9CjyymbUmUOOtRHKQQ"
let id = youtubeid('https://www.youtube.com/watch?v=34Na4j8AVgA&list=RD6366dxFf-Os&index=23')
let title;
const youtubekey = 'AIzaSyCU15C-xTQHFSQeOQNazQ-AswQHq6p1udQ'
const geturl = (url) => {
    console.log("geturl function is working")
    id = youtubeid(url)
    if (id == null) {
        console.log("id is null")
        return
    }
    getVideoTitle(id, youtubekey, (err, tit) => {
        if (err != null) {
            console.log(err)
            return
        } else {
            returnSpot(tit, auth)
        }
    })
}

const getAuth = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic YmFlOTYzZjRhNmE1NDEwZTk0ZDRkZmM4NmMyMzhmOWE6ZmM4NWYyNWE4ZWM3NGZmNWI0M2FkNzAwYzkxZmJiN2Q=");
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Cookie", "__Host-device_id=AQAdFpMwsPwN1u7r_pLtpe5YmEdiErXMOz4_I8p58Krx9HzCsu0onICvZ0dVLWwlxlJCEQADwvLRn4bPrA-rqgjYYauxFnBmfCQ; sp_tr=false");

    var urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "refresh_token");
    urlencoded.append("refresh_token", "AQBVDMYr_bIxDSB-KM22zC8W4WVKlPlAQQ6AvbQliyZKX2aTu2SzWPVxBjWfOygxMe-51eY2w6cTho3_gnXLMECwMxboovfwYXkLOkRKZC7dPUkywdZ4_c8VeLiZnkIvOYk");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    fetch("https://accounts.spotify.com/api/token", requestOptions)
        .then(response => response.json())
        .then(result => {
            return result.access_token;
        })
        .catch(error => console.log('error', error));
}

const returnSpot = (tit, auth) => {
    let titk = encodeURIComponent(tit)
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
            let spoturl = res.tracks.items[0].external_urls.spotify
            browser.tabs.create({ url: spoturl })
        }).catch(err => {
            console.log(err)
            auth = getAuth()
            console.log(auth)
            console.log(weburl)
            returnSpot(tit, auth)
        })
}


const main = () => {
    console.log("I have maybe not given up on life")
    browser.runtime.onMessage( message => {
        let current_url;
        browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
            current_url = tabs[0].url;
            console.log(current_url)
            geturl(current_url)
        })
    })
}

main();