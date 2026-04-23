const primaryPost = document.querySelector('.primary-post');
const smallPostsContainer = document.querySelector('.small-post-group');
const toggleButton = document.getElementById('theme-toggle');

const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    toggleButton.checked = true; 
}

toggleButton.addEventListener('change', () => {
    document.body.classList.toggle('dark-theme');
    
    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

async function fetchNews() {
    try {
        const response = await fetch('https://saurav.tech/NewsAPI/top-headlines/category/general/in.json');
        const data = await response.json();
        const articles = data.articles;

        displayPrimary(articles[0]);

        displaySmall(articles.slice(1, 5));

    } catch (error) {
        console.error("News failed to load:", error);
    }
}

function displayPrimary(article) {
    primaryPost.style.backgroundImage = `url('${article.urlToImage}')`;
    primaryPost.style.backgroundSize = 'cover';
    primaryPost.innerHTML = `
        <a href="${article.url}" target="_blank" style="text-decoration:none; color:inherit;">
            <div class="caption-box">
                <h3>${article.title}</h3>
            </div>
        </a>
    `;
}

function displaySmall(articles) {
    smallPostsContainer.innerHTML = ''; 
    articles.forEach(article => {
        const card = document.createElement('article');
        card.className = 'side-card';
        card.style.backgroundImage = `url('${article.urlToImage}')`;
        card.style.backgroundSize = 'cover';
        card.innerHTML = `
            <a href="${article.url}" target="_blank" style="text-decoration:none; color:inherit;">
                <div class="caption-box">
                    <h4>${article.title}</h4>
                </div>
            </a>
        `;
        smallPostsContainer.appendChild(card);
    });
}

fetchNews();