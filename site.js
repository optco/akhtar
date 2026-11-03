// site.js
let allPages = [];

async function init() {
    try {
        const response = await fetch('manifest.json');
        allPages = await response.json();
        renderSidebar();
        renderCards(allPages);
    } catch (error) {
        console.error('Failed to load manifest:', error);
    }
}

function renderSidebar() {
    const continents = [...new Set(allPages.map(p => p.continent))].sort();
    const countries = [...new Set(allPages.map(p => p.country))].sort();
    const cities = [...new Set(allPages.map(p => p.city))].sort();

    const sidebar = document.getElementById('sidebar-content');
    
    const createCategory = (title, items) => `
        <div class="sidebar-category">
            <h4>${title}</h4>
            <ul>
                ${items.map(item => `<li><button onclick="filterBy('${item}')">${item}</button></li>`).join('')}
            </ul>
        </div>
    `;

    sidebar.innerHTML = `
        <div class="sidebar-category">
            <h4>Filters</h4>
            <button class="reset-btn" onclick="filterBy('all')">Show All</button>
        </div>
        ${createCategory('Continents', continents)}
        ${createCategory('Countries', countries)}
        ${createCategory('Cities', cities)}
    `;
}

function renderCards(pages) {
    const grid = document.getElementById('cards-grid');
    grid.innerHTML = pages.map(page => `
        <a href="${page.id}.html" class="card-link">
            <div class="card glass">
                <img src="${page.image}" alt="${page.title}" class="card-image" loading="lazy">
                <div class="card-content">
                    <div>
                        <div class="card-tags">
                            <span class="tag">${page.continent}</span>
                            <span class="tag">${page.country}</span>
                            <span class="tag">${page.city}</span>
                        </div>
                        <h3 class="card-title">${page.title}</h3>
                        <p class="card-description">${page.description}</p>
                    </div>
                    <span class="card-badge">View Journey</span>
                </div>
            </div>
        </a>
    `).join('');
}

function filterBy(criteria) {
    if (criteria === 'all') {
        renderCards(allPages);
        return;
    }
    const filtered = allPages.filter(p => 
        p.continent === criteria || p.country === criteria || p.city === criteria
    );
    renderCards(filtered);
}

document.addEventListener('DOMContentLoaded', init);