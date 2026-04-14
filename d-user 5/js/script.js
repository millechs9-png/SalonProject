const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item => {
	const li = item.parentElement;

	item.addEventListener('click', function (e) {
		// If has dropdown, toggle only
		if (li.classList.contains('has-dropdown') || item.classList.contains('has-dropdown')) {
			e.preventDefault();
			li.classList.toggle('active');
			return;
		}

		// Normal navigation
		allSideMenu.forEach(i => {
			i.parentElement.classList.remove('active');
		});
		li.classList.add('active');
	});
});

// Dynamic sidebar active highlight based on current page
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname.split('/').pop() || 'home.html';
    allSideMenu.forEach(item => {
        const li = item.parentElement;
        if (item.getAttribute('href') === currentPath) {
            allSideMenu.forEach(i => i.parentElement.classList.remove('active'));
            li.classList.add('active');
        }
    });
});



// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})




const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
	if(window.innerWidth < 576) {
		e.preventDefault();
		searchForm.classList.toggle('show');
		if(searchForm.classList.contains('show')) {
			searchButtonIcon.classList.replace('bx-search', 'bx-x');
		} else {
			searchButtonIcon.classList.replace('bx-x', 'bx-search');
		}
	}
})





if(window.innerWidth < 768) {
	sidebar.classList.add('hide');
} else if(window.innerWidth > 576) {
	searchButtonIcon.classList.replace('bx-x', 'bx-search');
	searchForm.classList.remove('show');
}


window.addEventListener('resize', function () {
	if(this.innerWidth > 576) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
		searchForm.classList.remove('show');
	}
})



const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
	if(this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})

/* Booking History Functionality */
function loadBookings() {
    const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    const scheduleContent = document.getElementById('scheduleContent');
    const historyContent = document.getElementById('historyContent');
    const historySection = document.getElementById('historySection');
    const historyBtn = document.getElementById('historyBtn');

    // Filter upcoming and history
    const upcoming = bookings.filter(booking => new Date(booking.date) >= today);
    const history = bookings.filter(booking => new Date(booking.date) < today);

    // Populate schedule (upcoming)
    if (upcoming.length > 0) {
        let upcomingHTML = '';
        upcoming.forEach(booking => {
            const date = new Date(booking.date);
            const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            const formattedDate = date.toLocaleDateString('en-US', options);
            upcomingHTML += `
                <div class="booking-details-card">
                    <div class="booking-header">
                        <div class="booking-id">#${booking.bookingId}</div>
                        <span class="booking-status">Upcoming</span>
                    </div>
                    <div class="booking-info">
                        <div class="info-item">
                            <i class='bx bx scissors'></i>
                            <span><strong>Service:</strong> ${booking.service}</span>
                        </div>
                        <div class="info-item">
                            <i class='bx bx-user'></i>
                            <span><strong>Stylist:</strong> ${booking.stylist}</span>
                        </div>
                        <div class="info-item">
                            <i class='bx bx-calendar'></i>
                            <span><strong>Date & Time:</strong> ${formattedDate}</span>
                        </div>
                        <div class="info-item">
                            <i class='bx bx-money'></i>
                            <span><strong>Price:</strong> ${booking.price}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        scheduleContent.innerHTML = upcomingHTML;
    } else {
        scheduleContent.innerHTML = `
            <p>No upcoming appointments</p>
            <button id="historyBtn" class="history-toggle-btn"><i class='bx bx-time-five'></i>View Booking History</button>
            <a href="appointment.html" class="btn-book">Book an Appointment</a>
        `;
        // Re-attach event listener if reset
        if (historyBtn) historyBtn.addEventListener('click', toggleHistory);
    }

    // Populate history
    if (history.length > 0) {
        let historyHTML = '';
        history.forEach(booking => {
            const date = new Date(booking.date);
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            const formattedDate = date.toLocaleDateString('en-US', options);
            historyHTML += `
                <div class="booking-details-card">
                    <div class="booking-header">
                        <div class="booking-id">#${booking.bookingId}</div>
                        <span class="booking-status completed">Completed</span>
                    </div>
                    <div class="booking-info">
                        <div class="info-item">
                            <i class='bx bx scissors'></i>
                            <span><strong>Service:</strong> ${booking.service}</span>
                        </div>
                        <div class="info-item">
                            <i class='bx bx-user'></i>
                            <span><strong>Stylist:</strong> ${booking.stylist}</span>
                        </div>
                        <div class="info-item">
                            <i class='bx bx-calendar-check'></i>
                            <span><strong>Date:</strong> ${formattedDate}</span>
                        </div>
                        <div class="info-item">
                            <i class='bx bx-time'></i>
                            <span><strong>Time:</strong> ${booking.time}</span>
                        </div>
                        <div class="info-item">
                            <i class='bx bx-money'></i>
                            <span><strong>Price:</strong> ${booking.price}</span>
                        </div>
                    </div>
                    <div class="booking-slots">
                        <i class='bx bx-check-circle'></i>
                        <span>Service completed successfully</span>
                    </div>
                </div>
            `;
        });
        historyContent.innerHTML = historyHTML;
    } else {
        historyContent.innerHTML = '<p class="history-empty">No past bookings found. Your completed appointments will appear here.</p>';
    }
}

function toggleHistory() {
    const historySection = document.getElementById('historySection');
    const historyBtn = document.getElementById('historyBtn');
    const isVisible = historySection.style.display === 'block' || historySection.classList.contains('show');

    if (isVisible) {
        historySection.style.display = 'none';
        historySection.classList.remove('show');
        historyBtn.classList.remove('active');
        historyBtn.innerHTML = '<i class=\'bx bx-time-five\'></i>View Booking History';
    } else {
        historySection.style.display = 'block';
        setTimeout(() => historySection.classList.add('show'), 10);
        historyBtn.classList.add('active');
        historyBtn.innerHTML = '<i class=\'bx bx-chevron-up\'></i>Hide Booking History';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadBookings();
    
    // Event listener for history button (in case dynamically added)
    const historyBtn = document.getElementById('historyBtn');
    if (historyBtn) {
        historyBtn.addEventListener('click', toggleHistory);
    }
});

