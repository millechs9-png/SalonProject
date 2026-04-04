document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle functionality
  const mobileSidebar = document.getElementById('mobile-sidebar');
  const mobileOverlay = document.getElementById('mobile_sidebar-overlay');
  const header = document.querySelector('header');

  // Global function for HTML onclick handlers
  window.toggleMobileMenu = function() {
    if (mobileSidebar && mobileOverlay && header) {
      const isActive = mobileSidebar.classList.contains('active');
      
      if (isActive) {
        // Close menu
        mobileSidebar.classList.remove('active');
        mobileOverlay.classList.remove('active');
        header.classList.remove('menu-open');
        document.body.style.overflow = ''; // Re-enable scroll
      } else {
        // Open menu
        mobileSidebar.classList.add('active');
        mobileOverlay.classList.add('active');
        header.classList.add('menu-open');
        document.body.style.overflow = 'hidden'; // Lock scroll
      }
    }
  };

  // Overlay click to close
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', function(e) {
      if (e.target === mobileOverlay) {
        window.toggleMobileMenu();
      }
    });
  }

  // Close notification dropdown when opening mobile menu
  const notificationDropdown = document.getElementById('notificationDropdown');
  const originalToggle = window.toggleMobileMenu;
  window.toggleMobileMenu = function() {
    if (notificationDropdown) {
      notificationDropdown.classList.remove('active');
    }
    originalToggle();
  };

  // Fixed slider carousel - only if slides exist
  const slides = document.querySelectorAll('.slide');
  if (slides.length > 0) {
    let counter = 0;
    
    // Position slides
    slides.forEach((slide, index) => {
      slide.style.left = `${index * 100}%`;
      slide.style.position = 'relative';
      slide.style.transition = 'transform 0.5s ease-in-out';
    });

    const goPrev = () => {
      counter = (counter - 1 + slides.length) % slides.length;
      slideImg();
    };
    
    const goNext = () => {
      counter = (counter + 1) % slides.length;
      slideImg();
    };

    const slideImg = () => {
      slides.forEach(slide => {
        slide.style.transform = `translateX(-${counter * 100}%)`;
      });
    };

    // Auto-attach to prev/next buttons if they exist
    const prevBtn = document.querySelector('.slide-prev, .prev');
    const nextBtn = document.querySelector('.slide-next, .next');
    if (prevBtn) prevBtn.addEventListener('click', goPrev);
    if (nextBtn) nextBtn.addEventListener('click', goNext);

    // Initial slide
    slideImg();
  }

  // Notification dropdown
  const notificationBtn = document.getElementById('notificationBtn');
  const mobileNotificationBtn = document.getElementById('mobileNotificationBtn');
  
  if (notificationBtn && notificationDropdown) {
    notificationBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      notificationDropdown.classList.toggle('active');
    });
    
    // Mobile bell click
    if (mobileNotificationBtn && notificationDropdown) {
      mobileNotificationBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        notificationDropdown.classList.toggle('active');
      });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!notificationBtn?.contains(e.target) && 
          !mobileNotificationBtn?.contains(e.target) && 
          !notificationDropdown.contains(e.target)) {
        notificationDropdown.classList.remove('active');
      }
    });
  }

  // Accordion Script
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      document.querySelectorAll('.accordion-item').forEach(item => {
        if (item !== header.parentElement) {
          item.classList.remove('active');
        }
      });
      header.parentElement.classList.toggle('active');
    });
  });

  // Sidebar tab switching
  document.querySelectorAll('.sidebar-menu li[data-tab]').forEach(li => {
    li.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-menu li').forEach(l => l.classList.remove('active'));
      document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
      
      li.classList.add('active');
      const tabContent = document.getElementById(li.dataset.tab);
      if (tabContent) tabContent.classList.add('active');
    });
  });

  // Account dropdown toggle in mobile sidebar
  document.querySelectorAll('.account-menu').forEach(menu => {
    const link = menu.querySelector('a');
    const dropMenu = menu.querySelector('.drop-menu');
    
    if (link && dropMenu) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        menu.classList.toggle('open');
      });
      
      // Close dropdown and handle tab when clicking submenu item
      dropMenu.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          menu.classList.remove('open');
          
          // Trigger existing tab functionality
          if (item.dataset.tab) {
            document.querySelectorAll('.sidebar-menu li').forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            item.classList.add('active');
            const targetSection = document.getElementById(item.dataset.tab);
            if (targetSection) targetSection.classList.add('active');
          }
          
          // Close mobile sidebar after selection
          const mobileSidebar = document.getElementById('mobile-sidebar');
          if (mobileSidebar) {
            mobileSidebar.classList.remove('active');
            document.getElementById('mobile_sidebar-overlay')?.classList.remove('active');
          }
        });
      });
    }
  });

  // Preferences functionality (preserved)
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

  function loadPreferences() {
    const saved = JSON.parse(localStorage.getItem('userPreferences')) || {};
    Object.keys(preferenceCheckboxes).forEach(key => {
      if (preferenceCheckboxes[key]) {
        preferenceCheckboxes[key].checked = saved[key] !== false;
      }
    });
    updateDisplay();
  }

  function updateDisplay() {
    Object.keys(preferenceCheckboxes).forEach(key => {
      const labelText = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      const item = document.querySelector(`#preferencesDisplay [label="${labelText}"]`);
      if (item) {
        const status = item.querySelector('.preference-status');
        if (status && preferenceCheckboxes[key]) {
          status.textContent = preferenceCheckboxes[key].checked ? 'Enabled' : 'Disabled';
          status.style.color = preferenceCheckboxes[key].checked ? '#28a745' : '#dc3545';
        }
      }
    });
  }

  function savePreferences() {
    const prefs = {};
    Object.keys(preferenceCheckboxes).forEach(key => {
      if (preferenceCheckboxes[key]) {
        prefs[key] = preferenceCheckboxes[key].checked;
      }
    });
    localStorage.setItem('userPreferences', JSON.stringify(prefs));
    updateDisplay();
    if (preferencesDisplay) preferencesDisplay.style.display = 'flex';
    if (preferencesEdit) preferencesEdit.style.display = 'none';
    if (preferencesDisplayButtons) preferencesDisplayButtons.style.display = 'block';
  }

  if (editPreferencesBtn) {
    editPreferencesBtn.addEventListener('click', () => {
      if (preferencesDisplay) preferencesDisplay.style.display = 'none';
      if (preferencesEdit) preferencesEdit.style.display = 'flex';
      if (preferencesDisplayButtons) preferencesDisplayButtons.style.display = 'none';
    });
  }

  if (savePreferencesBtn) {
    savePreferencesBtn.addEventListener('click', savePreferences);
  }

  if (cancelPreferencesBtn) {
    cancelPreferencesBtn.addEventListener('click', () => {
      loadPreferences();
      if (preferencesDisplay) preferencesDisplay.style.display = 'flex';
      if (preferencesEdit) preferencesEdit.style.display = 'none';
      if (preferencesDisplayButtons) preferencesDisplayButtons.style.display = 'block';
    });
  }

  loadPreferences();

  // Profile edit functionality (preserved - same as original)
  const editProfileBtn = document.getElementById('editProfileBtn');
  const saveProfileBtn = document.getElementById('saveProfileBtn');
  const detailDisplay = document.getElementById('detailDisplay');
  const detailEdit = document.getElementById('detailEdit');

  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
      if (detailDisplay) detailDisplay.style.display = 'none';
      if (detailEdit) detailEdit.style.display = 'block';
      editProfileBtn.style.display = 'none';
    });
  }

  if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', () => {
      const inputFullName = document.getElementById('inputFullName');
      const inputPhone = document.getElementById('inputPhone');
      const inputAddress = document.getElementById('inputAddress');
      const displayFullName = document.getElementById('displayFullName');
      const displayPhone = document.getElementById('displayPhone');
      const displayAddress = document.getElementById('displayAddress');

      if (inputFullName && displayFullName) displayFullName.textContent = inputFullName.value;
      if (inputPhone && displayPhone) displayPhone.textContent = inputPhone.value;
      if (inputAddress && displayAddress) displayAddress.textContent = inputAddress.value;

      const profileData = {
        fullName: inputFullName ? inputFullName.value : 'Macoy Manuel Veloso',
        phone: inputPhone ? inputPhone.value : '+1 233 432 5532',
        address: inputAddress ? inputAddress.value : 'Paliparan 3 Mabuhay City subd., blg. 123, Dasmariñas City, Cavite'
      };
      localStorage.setItem('userProfile', JSON.stringify(profileData));

      if (detailDisplay) detailDisplay.style.display = 'block';
      if (detailEdit) detailEdit.style.display = 'none';
      if (editProfileBtn) editProfileBtn.style.display = 'block';
    });
  }

  const savedProfile = JSON.parse(localStorage.getItem('userProfile'));
  if (savedProfile) {
    const displayFullName = document.getElementById('displayFullName');
    const displayPhone = document.getElementById('displayPhone');
    const displayAddress = document.getElementById('displayAddress');
    const inputFullName = document.getElementById('inputFullName');
    const inputPhone = document.getElementById('inputPhone');
    const inputAddress = document.getElementById('inputAddress');
    
    if (displayFullName) displayFullName.textContent = savedProfile.fullName || 'Macoy Manuel Veloso';
    if (displayPhone) displayPhone.textContent = savedProfile.phone || '+1 233 432 5532';
    if (displayAddress) displayAddress.textContent = savedProfile.address || 'Paliparan 3 Mabuhay City subd., blg. 123, Dasmariñas City, Cavite';
    if (inputFullName) inputFullName.value = savedProfile.fullName || 'Macoy Manuel Veloso';
    if (inputPhone) inputPhone.value = savedProfile.phone || '+1 233 432 5532';
    if (inputAddress) inputAddress.value = savedProfile.address || 'Paliparan 3 Mabuhay City subd., blg. 123, Dasmariñas City, Cavite';
  }

  const cancelProfileBtn = document.getElementById('cancelProfileBtn');
  if (cancelProfileBtn) {
    cancelProfileBtn.addEventListener('click', () => {
      const savedProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
      const inputFullName = document.getElementById('inputFullName');
      const inputPhone = document.getElementById('inputPhone');
      const inputAddress = document.getElementById('inputAddress');
      
      if (inputFullName) inputFullName.value = savedProfile.fullName || 'Macoy Manuel Veloso';
      if (inputPhone) inputPhone.value = savedProfile.phone || '+1 233 432 5532';
      if (inputAddress) inputAddress.value = savedProfile.address || 'Paliparan 3 Mabuhay City subd., blg. 123, Dasmariñas City, Cavite';
      
      if (detailDisplay) detailDisplay.style.display = 'block';
      if (detailEdit) detailEdit.style.display = 'none';
      if (editProfileBtn) editProfileBtn.style.display = 'block';
    });
  }

  if (preferencesDisplayButtons) {
    preferencesDisplayButtons.style.display = 'block';
  }
});
