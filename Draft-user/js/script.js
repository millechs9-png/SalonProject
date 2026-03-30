let menuToggle = document.querySelector('.menuToggle');
let header = document.querySelector('header');
let section = document.querySelector('section');
// let section = document.getElementsByTagName('*');


menuToggle.onclick = function () {
    header.classList.toggle('active')
    section.classList.toggle('active')
    
    // Close notification dropdown on mobile menu toggle
    const notificationDropdown = document.getElementById('notificationDropdown');
    if (notificationDropdown) {
      notificationDropdown.classList.remove('active');
    }
}

const slides = document.querySelectorAll('.slide');

// console.log(slides)

let counter = 0;
// console.log(i)



slides.forEach((slide, index) => {
    slide.style.left = `${index * 100}%`

});

const goPrev = () => {
    counter--
    slideImg()
}
const goNext = () => {
    counter++ 
    slideImg()
}


const slideImg = () => {
    for (let i = 0; i < slides.length; i++) {
        if (counter >= slides.length) {
            slides.forEach(slide => {
                slide.style.transform = `translateX(-${counter * 0}%)`
            });
        } else {
            slides.forEach(slide => {
                slide.style.transform = `translateX(-${counter * 100}%)`
            });
        }
    }
}


document.addEventListener('DOMContentLoaded', function() {
  const notificationBtn = document.getElementById('notificationBtn');
  const notificationDropdown = document.getElementById('notificationDropdown');
  
  if (notificationBtn && notificationDropdown) {
    notificationBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      notificationDropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!notificationBtn.contains(e.target)) {
        notificationDropdown.classList.remove('active');
      }
    });
  }

  // Accordion Script
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        // Close all other items (only one open at a time)
        document.querySelectorAll('.accordion-item').forEach(item => {
        if (item !== header.parentElement) {
            item.classList.remove('active');
        }
        });
        // Toggle the clicked one
        header.parentElement.classList.toggle('active');
    });
  });

  // Sidebar tab switching
  document.querySelectorAll('.sidebar-menu li[data-tab]').forEach(li => {
    li.addEventListener('click', () => {
      // Remove active from all sidebar items and content sections
      document.querySelectorAll('.sidebar-menu li').forEach(l => l.classList.remove('active'));
      document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
      
      // Add active to clicked
      li.classList.add('active');
      document.getElementById(li.dataset.tab).classList.add('active');
    });
  });

  // Preferences functionality
  const editPreferencesBtn = document.getElementById('editPreferencesBtn');
  const savePreferencesBtn = document.getElementById('savePreferencesBtn');
  const cancelPreferencesBtn = document.getElementById('cancelPreferencesBtn');
  const preferencesDisplay = document.getElementById('preferencesDisplay');
  const preferencesEdit = document.getElementById('preferencesEdit');
  const preferencesDisplayButtons = document.querySelector('.preferences-display-buttons');

  const preferenceCheckboxes = {
    emailNotif: document.getElementById('emailNotif'),
    scheduleReminder: document.getElementById('scheduleReminder'),
    smsAlert: document.getElementById('smsAlert'),
    promotionalNotif: document.getElementById('promotionalNotif')
  };

  // Load preferences from localStorage
  function loadPreferences() {
    const saved = JSON.parse(localStorage.getItem('userPreferences')) || {};
    Object.keys(preferenceCheckboxes).forEach(key => {
      if (preferenceCheckboxes[key]) {
        preferenceCheckboxes[key].checked = saved[key] !== false;
      }
    });
    updateDisplay();
  }

  // Update display section based on checkboxes
  function updateDisplay() {
    Object.keys(preferenceCheckboxes).forEach(key => {
      const item = document.querySelector(`#preferencesDisplay [label="${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}"]`);
      if (item) {
        const status = item.querySelector('.preference-status');
        if (status) {
          status.textContent = preferenceCheckboxes[key].checked ? 'Enabled' : 'Disabled';
          status.style.color = preferenceCheckboxes[key].checked ? '#28a745' : '#dc3545';
        }
      }
    });
  }

  // Save preferences to localStorage
  function savePreferences() {
    const prefs = {};
    Object.keys(preferenceCheckboxes).forEach(key => {
      prefs[key] = preferenceCheckboxes[key].checked;
    });
    localStorage.setItem('userPreferences', JSON.stringify(prefs));
    updateDisplay();
    preferencesDisplay.style.display = 'flex';
    preferencesEdit.style.display = 'none';
    if (preferencesDisplayButtons) preferencesDisplayButtons.style.display = 'block';
  }

  // Edit preferences
  if (editPreferencesBtn) {
    editPreferencesBtn.addEventListener('click', () => {
      preferencesDisplay.style.display = 'none';
      preferencesEdit.style.display = 'flex';
      if (preferencesDisplayButtons) preferencesDisplayButtons.style.display = 'none';
    });
  }

// Profile edit functionality
  const editProfileBtn = document.getElementById('editProfileBtn');
  const saveProfileBtn = document.getElementById('saveProfileBtn');
  const detailDisplay = document.getElementById('detailDisplay');
  const detailEdit = document.getElementById('detailEdit');

  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
      detailDisplay.style.display = 'none';
      detailEdit.style.display = 'block';
      editProfileBtn.style.display = 'none';
    });
  }

  if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', () => {
      // Update display values
      document.getElementById('displayFullName').textContent = document.getElementById('inputFullName').value;
      document.getElementById('displayPhone').textContent = document.getElementById('inputPhone').value;
      document.getElementById('displayAddress').textContent = document.getElementById('inputAddress').value;

      // Save to localStorage
      const profileData = {
        fullName: document.getElementById('inputFullName').value,
        phone: document.getElementById('inputPhone').value,
        address: document.getElementById('inputAddress').value
      };
      localStorage.setItem('userProfile', JSON.stringify(profileData));

      // Switch back to display
      detailDisplay.style.display = 'block';
      detailEdit.style.display = 'none';
      editProfileBtn.style.display = 'block';
    });
  }

// Load profile on init
  const savedProfile = JSON.parse(localStorage.getItem('userProfile'));
  if (savedProfile) {
    document.getElementById('displayFullName').textContent = savedProfile.fullName || 'Macoy Manuel Veloso';
    document.getElementById('displayPhone').textContent = savedProfile.phone || '+1 233 432 5532';
    document.getElementById('displayAddress').textContent = savedProfile.address || 'Paliparan 3 Mabuhay City subd., blg. 123, Dasmariñas City, Cavite';
    document.getElementById('inputFullName').value = savedProfile.fullName || 'Macoy Manuel Veloso';
    document.getElementById('inputPhone').value = savedProfile.phone || '+1 233 432 5532';
    document.getElementById('inputAddress').value = savedProfile.address || 'Paliparan 3 Mabuhay City subd., blg. 123, Dasmariñas City, Cavite';
  }

  // Profile cancel functionality
  const cancelProfileBtn = document.getElementById('cancelProfileBtn');
  if (cancelProfileBtn) {
    cancelProfileBtn.addEventListener('click', () => {
      const savedProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
      document.getElementById('inputFullName').value = savedProfile.fullName || 'Macoy Manuel Veloso';
      document.getElementById('inputPhone').value = savedProfile.phone || '+1 233 432 5532';
      document.getElementById('inputAddress').value = savedProfile.address || 'Paliparan 3 Mabuhay City subd., blg. 123, Dasmariñas City, Cavite';
      
      detailDisplay.style.display = 'block';
      detailEdit.style.display = 'none';
      editProfileBtn.style.display = 'block';
    });
  }

// Show edit button on load
  if (preferencesDisplayButtons) {
    preferencesDisplayButtons.style.display = 'block';
  }

  // Save preferences
  if (savePreferencesBtn) {
    savePreferencesBtn.addEventListener('click', savePreferences);
  }

  // Cancel - reload from storage
  if (cancelPreferencesBtn) {
    cancelPreferencesBtn.addEventListener('click', () => {
      loadPreferences();
      preferencesDisplay.style.display = 'flex';
      preferencesEdit.style.display = 'none';
      if (preferencesDisplayButtons) preferencesDisplayButtons.style.display = 'block';
    });
  }

  // Initial load
  loadPreferences();

});
