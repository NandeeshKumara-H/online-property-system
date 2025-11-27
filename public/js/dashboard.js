document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = '/login.html';
        return;
    }

    // Populate Districts if on Post Property page
    const districtSelect = document.getElementById('district');
    if (districtSelect && typeof karnatakaLocations !== 'undefined') {
        for (const district in karnatakaLocations) {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtSelect.appendChild(option);
        }
    }

    // Dashboard Overview
    if (document.getElementById('user-name')) {
        document.getElementById('user-name').textContent = user.name;
        try {
            const properties = await api.get('/property/my');
            document.getElementById('property-count').textContent = properties.length;
        } catch (err) {
            console.error(err);
        }
    }

    // Post Property
    const postPropertyForm = document.getElementById('post-property-form');
    if (postPropertyForm) {
        postPropertyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append('title', document.getElementById('title').value);
            formData.append('description', document.getElementById('description').value);
            formData.append('price', document.getElementById('price').value);
            formData.append('district', document.getElementById('district').value);
            formData.append('taluka', document.getElementById('taluka').value);
            formData.append('hobli', document.getElementById('hobli').value);
            formData.append('village', document.getElementById('village').value);
            formData.append('address', document.getElementById('address').value);
            formData.append('surveyNumber', document.getElementById('surveyNumber').value);
            formData.append('type', document.getElementById('type').value);
            formData.append('size', document.getElementById('size').value);
            formData.append('sizeUnit', document.getElementById('sizeUnit').value);
            formData.append('ownerName', document.getElementById('ownerName').value);
            formData.append('contactNumber', document.getElementById('contactNumber').value);

            const images = document.getElementById('images').files;
            for (let i = 0; i < images.length; i++) {
                formData.append('images', images[i]);
            }

            const verificationDocs = document.getElementById('verificationDocs').files;
            for (let i = 0; i < verificationDocs.length; i++) {
                formData.append('verificationDocs', verificationDocs[i]);
            }

            try {
                const res = await api.postFormData('/property/add', formData);
                if (res._id) {
                    alert('Property posted successfully! Waiting for admin approval.');
                    window.location.href = '/my-listings.html';
                } else {
                    alert('Failed to post property');
                }
            } catch (err) {
                alert('Error posting property');
            }
        });
    }

    // My Listings
    const myListingsContainer = document.getElementById('my-properties');
    if (myListingsContainer) {
        try {
            const properties = await api.get('/property/my');
            myListingsContainer.innerHTML = '';
            if (properties.length === 0) {
                myListingsContainer.innerHTML = '<p>No properties found.</p>';
            } else {
                properties.forEach(property => {
                    const card = document.createElement('div');
                    card.className = 'property-card';
                    const imagePath = property.images && property.images.length > 0 ? `/${property.images[0]}` : 'https://via.placeholder.com/300x200';
                    card.innerHTML = `
                        <div class="property-image" style="background-image: url('${imagePath}')"></div>
                        <div class="property-info">
                            <div class="property-price">₹${property.price.toLocaleString()}</div>
                            <div class="property-title">${property.title}</div>
                            <div class="property-location">${property.taluka}, ${property.district}</div>
                            <div class="property-tags">
                                <span class="tag" style="background:${property.status === 'approved' ? '#d4edda' : '#fff3cd'}; color:${property.status === 'approved' ? '#155724' : '#856404'}">${property.status}</span>
                            </div>
                            <button class="btn btn-secondary" style="margin-top:10px; width:100%;" onclick="deleteProperty('${property._id}')">Delete</button>
                        </div>
                    `;
                    myListingsContainer.appendChild(card);
                });
            }
        } catch (err) {
            myListingsContainer.innerHTML = '<p>Error loading properties.</p>';
        }
    }

    // Edit Profile
    const editProfileForm = document.getElementById('edit-profile-form');
    if (editProfileForm) {
        try {
            const profile = await api.get('/user/profile');
            document.getElementById('name').value = profile.name;
            document.getElementById('email').value = profile.email;
            document.getElementById('phone').value = profile.phone || '';
        } catch (err) {
            console.error(err);
        }

        editProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;

            try {
                const res = await api.put('/user/update', { name, phone });
                if (res.message) {
                    alert('Profile updated successfully');
                    localStorage.setItem('user', JSON.stringify(res.user));
                }
            } catch (err) {
                alert('Error updating profile');
            }
        });
    }
});

function populateTalukas() {
    const districtSelect = document.getElementById('district');
    const talukaSelect = document.getElementById('taluka');
    const selectedDistrict = districtSelect.value;

    talukaSelect.innerHTML = '<option value="">Select Taluka</option>';
    talukaSelect.disabled = true;

    if (selectedDistrict && karnatakaLocations[selectedDistrict]) {
        karnatakaLocations[selectedDistrict].forEach(taluka => {
            const option = document.createElement('option');
            option.value = taluka;
            option.textContent = taluka;
            talukaSelect.appendChild(option);
        });
        talukaSelect.disabled = false;
    }
}

async function deleteProperty(id) {
    if (confirm('Are you sure you want to delete this property?')) {
        try {
            await api.delete(`/property/delete/${id}`);
            window.location.reload();
        } catch (err) {
            alert('Error deleting property');
        }
    }
}
