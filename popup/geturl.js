document.addEventListener("click", e => {
    browser.tabs.query({active: true, currentWindow: true})
    .then(tabs => {
        let current_url = tabs[0].url;
        browser.runtime.sendMessage( {url: current_url})
    })
})