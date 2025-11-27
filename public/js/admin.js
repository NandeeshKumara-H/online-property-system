document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
        window.location.href = '/admin-login.html';
        return;
    }
    loadPendingProperties();
});

function showSection(section) {
    document.getElementById('pending-section').style.display = section === 'pending' ? 'block' : 'none';
    document.getElementById('users-section').style.display = section === 'users' ? 'block' : 'none';

    const links = document.querySelectorAll('.sidebar a');
    links.forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');

    if (section === 'pending') loadPendingProperties();
    if (section === 'users') loadUsers();
}

async function loadPendingProperties() {
    const container = document.getElementById('pending-properties');
    try {
        const properties = await api.get('/admin/properties/pending');
        container.innerHTML = '';
        if (properties.length === 0) {
            container.innerHTML = '<p>No pending properties.</p>';
            return;
        }

        properties.forEach(property => {
            const card = document.createElement('div');
            card.className = 'property-card';
            const imagePath = property.images && property.images.length > 0 ? `/${property.images[0]}` : 'https://via.placeholder.com/300x200';

            card.innerHTML = `
                <div class="property-image" style="background-image: url('${imagePath}')"></div>
                <div class="property-info">
                    <div class="property-price">₹${property.price.toLocaleString()}</div>
                    <div class="property-title">${property.title}</div>
                    <div class="property-location">
                        <strong>Location:</strong> ${property.village || ''}, ${property.hobli || ''}, ${property.taluka}, ${property.district}<br>
                        <strong>Survey No:</strong> ${property.surveyNumber || 'N/A'} | <strong>Size:</strong> ${property.size || ''} ${property.sizeUnit || ''}<br>
                        <strong>Owner:</strong> ${property.ownerName || 'N/A'} (${property.contactNumber || 'N/A'})<br>
                        <strong>Posted by:</strong> ${property.owner.name}
                    </div>
                    <div class="property-docs" style="margin-top: 5px;">
                        <strong>Docs:</strong> 
                        ${property.verificationDocs && property.verificationDocs.length > 0
                    ? property.verificationDocs.map((doc, i) => `<a href="/${doc}" target="_blank">Doc ${i + 1}</a>`).join(', ')
                    : 'None'}
                    </div>
                    <div style="display:flex; gap:10px; margin-top:10px;">
                        <button class="btn btn-primary" onclick="approveProperty('${property._id}')" style="flex:1; background:#28a745;">Verify & Approve</button>
                        <button class="btn btn-secondary" onclick="rejectProperty('${property._id}')" style="flex:1; border-color:#dc3545; color:#dc3545;">Reject</button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        container.innerHTML = '<p>Error loading properties.</p>';
    }
}

async function loadUsers() {
    const container = document.getElementById('users-list');
    try {
        const users = await api.get('/admin/users');
        let html = '<table style="width:100%; border-collapse:collapse;"><thead><tr style="background:#f0f0f0; text-align:left;"><th style="padding:10px;">Name</th><th style="padding:10px;">Email</th><th style="padding:10px;">Role</th></tr></thead><tbody>';

        users.forEach(u => {
            html += `<tr style="border-bottom:1px solid #eee;">
                <td style="padding:10px;">${u.name}</td>
                <td style="padding:10px;">${u.email}</td>
                <td style="padding:10px;">${u.role}</td>
            </tr>`;
        });
        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (err) {
        container.innerHTML = '<p>Error loading users.</p>';
    }
}

async function approveProperty(id) {
    if (confirm('Approve this property?')) {
        try {
            await api.put(`/admin/property/approve/${id}`, {});
            loadPendingProperties();
        } catch (err) {
            alert('Error approving property');
        }
    }
}

async function rejectProperty(id) {
    if (confirm('Reject and delete this property?')) {
        try {
            await api.delete(`/admin/property/delete/${id}`);
            loadPendingProperties();
        } catch (err) {
            alert('Error rejecting property');
        }
    }
}
