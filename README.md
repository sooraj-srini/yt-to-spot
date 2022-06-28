# Introduction 
YT-to-Spot is a firefox extension that takes in the url of a music video hosted on Youtube and opens a new tab containing the link to the same song hosted on Spotify. 
This is a surprising common task for me, and I wanted to automate this process to make a bit painless.
This uses the Spotify API and Youtube API to get the title of the youtube video and search it on Spotify API. 

# Usage

Clone the directory with `git clone github.com/sooraj-srini/yt-to-spot`.
Open the .xpi file stored and simply drag it to about:addons. The extension should work out of the box.
Note that the API calls are made from my account currently. OAuth2.0 is a bit tricky.

Once it's done, a popup should be present on your extensions list. Iff the url is a valid youtube url and the spotify search works, the extension will open up a new tab with 
the url of the song hosted on Spotify.


