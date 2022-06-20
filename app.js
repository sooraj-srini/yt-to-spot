const axios = require('axios')
const youtubeid = require('get-youtube-id')
const youtubetitle = require('get-youtube-title');
const { exit } = require('process');

let id = youtubeid('https://www.youtube.com/watch?v=34Na4j8AVgA&list=RD6366dxFf-Os&index=23')
let title;
const youtubekey = 'AIzaSyCU15C-xTQHFSQeOQNazQ-AswQHq6p1udQ'
youtubetitle(id, youtubekey, (err, tit) => {
    if (err != null) {
        console.log(err)
        exit()
    }
    returnSpot(tit)
})

const returnSpot = (tit) => {
    let titk = encodeURIComponent(tit)
    const auth = "Bearer BQBGql4LfR2YPdXLm-Il63buiD08zS742rzcPZwc9rls_dx2z1l9lLW3axqMjZijyBZQXkN0RYD_yXBvyo0CjlGxj7knxEK4DWydtxsudW_6EY1pv6oOBPM382Yah-4XAHFuR6URZ0952svSEcvA-MGOWCjcCzHkBQAETcs399Lr9-mWMSZXq7seF2CZJ9qz"
    const weburl = "https://api.spotify.com/v1/search?q=track%3A" + titk + "&type=track"
    const headers = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": auth
        }
    }

    axios.get(weburl, headers).then(res => {
        console.log(res.data.tracks.items[0].external_urls.spotify)
    }).catch(err => {
        console.log(err)
        console.log(weburl)
    })
}