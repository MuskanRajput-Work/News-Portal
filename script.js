// --- SELECT ELEMENTS ---
const primaryPost = document.querySelector('.primary-post');
const smallPostsContainer = document.querySelector('.small-post-group');
const toggleButton = document.getElementById('theme-toggle');

// --- 1. THEME TOGGLE ---
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    toggleButton.checked = true;
}

toggleButton.addEventListener('change', () => {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
});

// --- 2. FETCH & DISTRIBUTE NEWS ---
async function fetchNews() {
    try {
        // Added a timestamp (?t=...) to force the browser to get fresh news every time
        const response = await fetch(`https://saurav.tech/NewsAPI/top-headlines/category/general/in.json?t=${new Date().getTime()}`);
        const data = await response.json();
        const articles = data.articles;

        // Big Main Post
        displayPrimary(articles[0]);
        
        // 4 Grid Posts
        displaySmall(articles.slice(1, 5));
        
        // Tech & Lifestyle Posts (the bottom ones)
        displayMiniFeed(articles.slice(5, 9)); 

    } catch (error) {
        console.error("News failed to load:", error);
    }
}

function displayPrimary(article) {
    primaryPost.style.backgroundImage = `url('${article.urlToImage}')`;
    primaryPost.innerHTML = `
        <a href="${article.url}" target="_blank" style="text-decoration:none; color:inherit;">
            <div class="caption-box">
                <h3>${article.title}</h3>
            </div>
        </a>`;
}

function displaySmall(articles) {
    smallPostsContainer.innerHTML = ''; 
    articles.forEach(article => {
        const card = document.createElement('article');
        card.className = 'side-card';
        card.style.backgroundImage = `url('${article.urlToImage}')`;
        card.innerHTML = `
            <a href="${article.url}" target="_blank" style="text-decoration:none; color:inherit;">
                <div class="caption-box">
                    <h4>${article.title}</h4>
                </div>
            </a>`;
        smallPostsContainer.appendChild(card);
    });
}

// THIS IS THE PART THAT WAS MISSING OR MISMATCHED
function displayMiniFeed(articles) {
    const miniCards = document.querySelectorAll('.mini-card');
    articles.forEach((article, index) => {
        if(miniCards[index]) {
            const thumb = miniCards[index].querySelector('.thumb-box');
            const title = miniCards[index].querySelector('h4');
            
            // Set image and text
            thumb.style.backgroundImage = `url('${article.urlToImage}')`;
            thumb.style.backgroundSize = 'cover';
            title.innerText = article.title;
            
            // Make the whole card clickable
            miniCards[index].style.cursor = "pointer";
            miniCards[index].onclick = () => window.open(article.url, '_blank');
        }
    });
}

// --- 3. UTILITIES (Date, Search, Ticker) ---
function updateDate() {
    const dateElement = document.getElementById('current-date');
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    dateElement.innerText = new Date().toLocaleDateString('en-US', options);
}

function searchNews() {
    let input = document.getElementById('search-input').value.toLowerCase();
    let cards = document.querySelectorAll('.primary-post, .side-card, .mini-card');
    cards.forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(input) ? "" : "none";
    });
}

const headlines = ["Sensex hits new high", "AI Breakthrough in Web", "Weather: Mostly Sunny"];
let hIndex = 0;
function rotateTicker() {
    const tickerText = document.querySelector('.news-ticker p');
    const datePart = document.getElementById('current-date').innerText;
    hIndex = (hIndex + 1) % headlines.length;
    tickerText.innerHTML = `<span id="current-date">${datePart}</span> | ${headlines[hIndex]}`;
}

// --- START ---
fetchNews();
updateDate();
setInterval(rotateTicker, 4000);