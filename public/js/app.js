async function loadFeaturedProperties() {
    const container = document.getElementById('featured-properties');
    try {
        const properties = await api.get('/property/all');
        container.innerHTML = '';

        if (properties.length === 0) {
            container.innerHTML = '<p>No properties found.</p>';
            return;
        }

        properties.forEach(property => {
            const card = document.createElement('div');
            card.className = 'property-card';
            card.onclick = () => window.location.href = `/property-details.html?id=${property._id}`;

            const imagePath = property.images && property.images.length > 0
                ? `/${property.images[0]}`
                : 'https://via.placeholder.com/300x200?text=No+Image';

            card.innerHTML = `
                <div class="property-image" style="background-image: url('${imagePath}')"></div>
                <div class="property-info">
                    <div class="property-price">₹${property.price.toLocaleString()}</div>
                    <div class="property-title">${property.title}</div>
                    <div class="property-location">${property.city}, ${property.address}</div>
                    <div class="property-tags">
                        <span class="tag">${property.type}</span>
                        <span class="tag">${property.status}</span>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error(error);
        container.innerHTML = '<p>Error loading properties.</p>';
    }
}

function searchProperties() {
    const city = document.getElementById('city').value;
    const type = document.getElementById('type').value;
    const budget = document.getElementById('budget').value;

    let query = '?';
    if (city) query += `city=${city}&`;
    if (type) query += `type=${type}&`;
    if (budget) query += `budget=${budget}&`;

    window.location.href = `/properties.html${query}`;
}

if (document.getElementById('featured-properties')) {
    loadFeaturedProperties();
}
