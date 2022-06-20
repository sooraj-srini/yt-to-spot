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


//let auth = "Bearer QCpYca94WxSzTZVpW9qoEsIkL1zrv17l5mrdzkvauBIkwTuJ3h1DvPWiUq2SNDhBjVwbgybHnJkDIxtAb_LQvVU7umk8Wq53eNoBjhkkPkc8-0Z9GN5EdSSaFhjL-xN52soDvg4sh1iEKFan1WPVDTrZgTnzwCkg6VphCWULIgqp9AZPbvMaHgEo9chdqd2O-g"
browser.storage.local.set({auth : "Bearer LL"});
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
            browser.storage.local.get(['auth'], res => {
                let auth = res.auth
                returnSpot(tit, auth)
            })
        }
    })
}

async function getAuth () {
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

    await fetch("https://accounts.spotify.com/api/token", requestOptions)
        .then(response => response.json())
        .then(result => {
            browser.storage.local.set({auth: "Bearer " + result.access_token})
            return 1
        })
        .catch(error => console.log('error', error));
}

const returnSpot = (tit, auth) => {
    console.log("returning spot")
    console.log(auth)
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
            getAuth().then(res => {
            browser.storage.local.get(['auth'], res => {
                let auth = res.auth
                console.log(weburl)
                returnSpot(tit, auth)
            })
            })
        })
}


const main = () => {
    console.log("I have maybe not given up on life")
    browser.runtime.onMessage.addListener( message => {
        let current_url = message.url;
        console.log(current_url)
        geturl(current_url)
        browser.storage.local.get(['auth'], res => {
            console.log(res.auth)
        })
    })
}

main();