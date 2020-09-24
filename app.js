/* MY ALGORITHM
    - check if the input space is empty, if it isn't, move on, if it is, throw an error
    - check if the URL is a valid URL, if it is move on to the next step, if it isnt, throw an error
    - make the POST api call, to send the data and get the hashid
    - make the GET api call, to get the data from the api
    - append the result and the original to the sessionStorage
    - fetch from sessionStorage to the HTML page
*/

// Get HTML elements
let queryResDiv = document.querySelector('.results');
let theForm = document.getElementById('the-form');
let originalUrlInput = document.getElementById('original-url-input');

//session storage variable
let ss = sessionStorage;

// Event listeners
theForm.addEventListener('submit', linkCheck);
window.addEventListener('load', outputData)

// Functions


// to check that the input link is okay
function linkCheck(e) {
    let originalUrl = document.getElementById('original-url-input').value;
    e.preventDefault();

    if (originalUrl == "") {
        let errorInput = document.querySelector('.error-input');
        errorInput.style.display = "block";
        originalUrlInput.classList.add('error-border');
    }
    else {
        if (validateUrl(originalUrl) == false) {
            let errorUrl = document.querySelector('.error-url');
            let errorInput = document.querySelector('.error-input');
            errorInput.style.display = "none";
            errorUrl.style.display = "block";
            originalUrlInput.classList.add('error-border');
        }
        else {
            let errorUrl = document.querySelector('.error-url');
            errorUrl.style.display = "none";
            originalUrlInput.classList.remove('error-border');

            postData(originalUrl)
        }
    }
    theForm.reset();
}

// to validate the URL
function validateUrl(aLink) {
    let validator = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    return validator.test(aLink);
}


// to make the API POST call
function postData(link) {
    // let theUrl = link;
    // - API touch point
    let api = "https://rel.ink/api/links/";

    // POST CALL
    fetch(api, {
        // the method I want to use
        method: "POST",
        // the data type I am sending
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: link
        })
    })
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            // run the GET function here
            getDataVal(data)
        })
        .catch(function (err) {
            console.log(err)
        })
}


// GET VALUE FROM THE API
function getDataVal(value) {
    // collect data from the post api call
    let newhash = value.hashid
    let newapi = `https://rel.ink/api/links/${newhash}`

    fetch(newapi)
        .then(res => {
            return res.json()
        })
        .then(data => {
            // add to sessionStorage
            storeToSs(data)
        })
        .catch(err => {
            console.log(err)
        })
}

function storeToSs(value) {
    // collect data from the api call
    let urlInfo = {
        url: value.url,
        hashid: value.hashid
    }
    // check if ss is empty
    if (ss.getItem('urlData') == null) {
        // if it is, create empty array and push into it
        urlData = []
        urlData.push(urlInfo)
        // convert to JSON string
        ss.setItem('urlData', JSON.stringify(urlData))
    }
    else {
        // if it isnt, append value to it
        // convert it back to an array that can be pushhed into
        urlData = JSON.parse(ss.getItem('urlData'))
        urlData.push(urlInfo)
        // convert it back to a stringify for session storage
        ss.setItem('urlData', JSON.stringify(urlData))
    }
    outputData()
}


function outputData() {
    // output data from session storage

    // get the array that can be looped through
    let urlData = JSON.parse(ss.getItem('urlData'));
    if (urlData == null) {
        console.log("Hi")
    }

    else {
        // output div
        let outputDiv = document.querySelector('.results');
        for (i = 0; i < urlData.length; i++) {
            let siteUrl = urlData[i].url;
            let siteHashid = urlData[i].hashid;

            outputDiv.innerHTML += `<article class="result-card">
    <p class="original-url">${siteUrl}</p>
    <a href="${siteUrl}" class="shortened-url" target="blank">https://rel.ink/api/links/${siteHashid}</a>
</article>`
            // <button onclick="copyLink()"  class="btn btn-rounded" id = "copy-me">Copy</button>
        }
    }

}

// to copy link to clipboard
// function copyLink() {
//     let outputDiv = document.querySelector('.results').getElementsByTagName('button');
//     // gives an iterable array

//     for(i=0; i<outputDiv.length; i++){
//             let btn = document.querySelector('#copy-me')
//             // console.log(this.btn[i])

//     }
//     //use the this keyword
//     // when the button is clicked, do the following
//     // - copy the blue text to clipboard
//     // - change the color of the copy btn and the text for 3 seconds
//     // setTimeout(() => {
//     //     change the color and text for 3 seconds
//     // }, 3000);
// }

//MENU SECTION
// toggle the hide class on the block and the buttons

let openMobile = document.getElementById('mobile-open');
let closeMobile = document.getElementById('mobile-close');
let theMenu = document.querySelector('.nav-mobile-links');

openMobile.addEventListener('click', showMenu);
closeMobile.addEventListener('click', hideMenu);

function showMenu() {
    openMobile.classList = "hide"
    closeMobile.classList = "show"
    theMenu.style.display = "block"
}

function hideMenu() {
    closeMobile.classList = "hide"
    openMobile.classList = "show"
    theMenu.style.display = "none"
}

