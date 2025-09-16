// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const searchInput = document.getElementById('searchInput');
const searchSuggestions = document.getElementById('searchSuggestions');
const contactForm = document.getElementById('contactForm');
const plannerResults = document.getElementById('plannerResults');
const languageSelector = document.getElementById('languageSelector');
const accessibilityControls = document.getElementById('accessibilityControls');

// Global State
let currentLanguage = 'en';
let isHighContrast = false;
let isLargeFont = false;
let isScreenReaderMode = false;
let isOnline = navigator.onLine;
let cachedSchedules = {};
let userPreferences = {
    locationTracking: false,
    notifications: true,
    language: 'en',
    accessibility: {
        highContrast: false,
        largeFont: false,
        screenReader: false
    }
};

// Sample data for search functionality
const busRoutes = [
    { name: 'Route 42A', from: 'City Center', to: 'Airport', stops: ['Central Station', 'Mall Road', 'University', 'Airport Terminal'] },
    { name: 'Route 15B', from: 'Railway Station', to: 'Hospital', stops: ['Railway Station', 'Bus Stand', 'Market', 'Hospital'] },
    { name: 'Route 8C', from: 'University', to: 'Mall', stops: ['University Gate', 'Library', 'Sports Complex', 'Shopping Mall'] },
    { name: 'Route 23D', from: 'Airport', to: 'City Center', stops: ['Airport Terminal', 'Highway', 'Downtown', 'City Center'] },
    { name: 'Route 7A', from: 'Hospital', to: 'Railway Station', stops: ['Hospital', 'Medical College', 'Bus Stand', 'Railway Station'] }
];

const busStops = [
    'Central Station', 'Mall Road', 'University', 'Airport Terminal', 'Railway Station',
    'Bus Stand', 'Market', 'Hospital', 'University Gate', 'Library', 'Sports Complex',
    'Shopping Mall', 'Highway', 'Downtown', 'City Center', 'Medical College'
];

// Navigation functionality
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Smooth scrolling to sections
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Navbar scroll effect
function handleNavbarScroll() {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
}

// Smart search functionality
function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;
    
    const results = [];
    
    // Search in bus routes
    busRoutes.forEach(route => {
        if (route.name.toLowerCase().includes(query) ||
            route.from.toLowerCase().includes(query) ||
            route.to.toLowerCase().includes(query) ||
            route.stops.some(stop => stop.toLowerCase().includes(query))) {
            results.push({
                type: 'route',
                title: route.name,
                subtitle: `${route.from} → ${route.to}`,
                data: route
            });
        }
    });
    
    // Search in bus stops
    busStops.forEach(stop => {
        if (stop.toLowerCase().includes(query)) {
            results.push({
                type: 'stop',
                title: stop,
                subtitle: 'Bus Stop',
                data: { name: stop }
            });
        }
    });
    
    displaySearchResults(results);
}

function displaySearchResults(results) {
    if (results.length === 0) {
        searchSuggestions.innerHTML = '<div class="suggestion-item">No results found</div>';
    } else {
        searchSuggestions.innerHTML = results.map(result => `
            <div class="suggestion-item" onclick="selectSearchResult('${result.title}')">
                <strong>${result.title}</strong>
                <div style="color: #666; font-size: 0.9rem;">${result.subtitle}</div>
            </div>
        `).join('');
    }
    searchSuggestions.style.display = 'block';
}

function selectSearchResult(selected) {
    searchInput.value = selected;
    searchSuggestions.style.display = 'none';
    // Here you would typically navigate to the route details or show live tracking
    showNotification(`Searching for ${selected}...`);
}

// Make My Transport functionality
function planTransport() {
    const destination = document.getElementById('destination').value;
    const arrivalTime = document.getElementById('arrival-time').value;
    
    if (!destination || !arrivalTime) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate planning
    const results = generateTransportPlan(destination, arrivalTime);
    displayTransportPlan(results);
}

function generateTransportPlan(destination, arrivalTime) {
    // Mock data for demonstration
    const plans = [
        {
            route: 'Bus Route 42A → Metro Station → Walk 5 min',
            departure: '8:15 AM',
            arrival: '8:45 AM',
            duration: '30 min',
            cost: '₹25',
            reliability: '95%'
        },
        {
            route: 'Bus Route 15B → Direct',
            departure: '8:20 AM',
            arrival: '8:50 AM',
            duration: '30 min',
            cost: '₹15',
            reliability: '85%'
        }
    ];
    
    return plans[Math.floor(Math.random() * plans.length)];
}

function displayTransportPlan(plan) {
    plannerResults.innerHTML = `
        <div class="result-card">
            <h4>Recommended Route</h4>
            <p>${plan.route}</p>
            <div class="timing-info">
                <span><i class="fas fa-clock"></i> Leave at ${plan.departure}</span>
                <span><i class="fas fa-map-marker-alt"></i> Arrive at ${plan.arrival}</span>
                <span><i class="fas fa-stopwatch"></i> Duration: ${plan.duration}</span>
                <span><i class="fas fa-rupee-sign"></i> Cost: ${plan.cost}</span>
                <span><i class="fas fa-check-circle"></i> Reliability: ${plan.reliability}</span>
            </div>
            <button class="plan-btn" onclick="setDepartureAlert()" style="margin-top: 20px;">
                <i class="fas fa-bell"></i>
                Set Departure Alert
            </button>
        </div>
    `;
}

function setDepartureAlert() {
    showNotification('Departure alert set! We\'ll notify you 10 minutes before departure.', 'success');
}

// Contact form functionality
function handleContactForm(event) {
    event.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Basic validation
    if (!name || !email || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate form submission
    showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
    contactForm.reset();
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Scroll animations
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Real-time bus tracking simulation
function simulateBusTracking() {
    const busIcons = document.querySelectorAll('.bus-icon');
    busIcons.forEach(icon => {
        // Add random movement to simulate real-time tracking
        setInterval(() => {
            const randomX = Math.random() * 20 - 10;
            const randomY = Math.random() * 10 - 5;
            icon.style.transform = `translate(-50%, -50%) translate(${randomX}px, ${randomY}px)`;
        }, 3000);
    });
}

// Search input handling
function handleSearchInput() {
    const query = searchInput.value.trim();
    
    if (query.length < 2) {
        searchSuggestions.style.display = 'none';
        return;
    }
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
        performSearch();
    }, 300);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load user preferences first
    loadUserPreferences();
    
    // Add fade-in class to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in');
    });
    
    // Event listeners
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Search functionality
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length >= 2) {
            performSearch();
        }
    });
    
    // Hide search suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            searchSuggestions.style.display = 'none';
        }
        if (!e.target.closest('.language-selector') && !e.target.closest('.accessibility-btn[onclick="toggleLanguage()"]')) {
            languageSelector.style.display = 'none';
        }
    });
    
    // Language selector event listeners
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            changeLanguage(lang);
            
            // Update active state
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Contact form
    contactForm.addEventListener('submit', handleContactForm);
    
    // Scroll events
    window.addEventListener('scroll', () => {
        handleNavbarScroll();
        handleScrollAnimations();
    });
    
    // Initialize animations
    handleScrollAnimations();
    simulateBusTracking();
    
    // Initialize GTFS-Realtime simulation
    simulateGTFSRealtime();
    
    // Cache schedule data for offline use
    cacheScheduleData();
    
    // Load cached schedules if available
    if (!isOnline) {
        loadCachedSchedules();
        showOfflineIndicator();
    }
    
    // Add CSS for notifications and modals
    const additionalStyles = document.createElement('style');
    additionalStyles.textContent = `
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0;
            margin-left: auto;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .hamburger.active .bar:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active .bar:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }
        
        .hamburger.active .bar:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }
        
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        
        .modal {
            background: white;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid var(--light-gray);
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--medium-gray);
        }
        
        .modal-content {
            padding: 20px;
        }
        
        .privacy-settings label {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
            cursor: pointer;
        }
        
        .privacy-settings input[type="checkbox"] {
            width: 18px;
            height: 18px;
            accent-color: var(--primary-green);
        }
        
        .privacy-settings button {
            background: #f44336;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 10px;
        }
    `;
    document.head.appendChild(additionalStyles);
    
    // Show welcome message
    setTimeout(() => {
        showNotification('Welcome to TransitTracker! Search for your bus route to get started.', 'info');
    }, 1000);
    
    // Initialize real-time updates
    setInterval(() => {
        if (isOnline) {
            simulateGTFSRealtime();
        }
    }, 30000); // Update every 30 seconds
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
    
    // Escape to close mobile menu
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        searchSuggestions.style.display = 'none';
    }
});

// Performance optimization: Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
});

// Offline functionality
window.addEventListener('online', () => {
    showNotification('Connection restored! Real-time tracking is now active.', 'success');
});

window.addEventListener('offline', () => {
    showNotification('You\'re offline. Some features may be limited.', 'error');
});

// Accessibility Functions
function toggleHighContrast() {
    isHighContrast = !isHighContrast;
    document.body.classList.toggle('high-contrast', isHighContrast);
    userPreferences.accessibility.highContrast = isHighContrast;
    saveUserPreferences();
    showNotification(`High contrast mode ${isHighContrast ? 'enabled' : 'disabled'}`, 'info');
}

function toggleLanguage() {
    languageSelector.style.display = languageSelector.style.display === 'none' ? 'block' : 'none';
}

function changeLanguage(lang) {
    currentLanguage = lang;
    userPreferences.language = lang;
    saveUserPreferences();
    
    // Update all elements with data attributes
    document.querySelectorAll('[data-en]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`) || element.getAttribute('data-en');
        element.textContent = text;
    });
    
    // Update document language
    document.documentElement.lang = lang;
    
    // Hide language selector
    languageSelector.style.display = 'none';
    
    showNotification(`Language changed to ${getLanguageName(lang)}`, 'success');
}

function getLanguageName(lang) {
    const names = {
        'en': 'English',
        'hi': 'हिन्दी',
        'pa': 'ਪੰਜਾਬੀ',
        'ur': 'اردو'
    };
    return names[lang] || 'English';
}

function toggleFontSize() {
    isLargeFont = !isLargeFont;
    document.body.classList.toggle('large-font', isLargeFont);
    userPreferences.accessibility.largeFont = isLargeFont;
    saveUserPreferences();
    showNotification(`Large font mode ${isLargeFont ? 'enabled' : 'disabled'}`, 'info');
}

function toggleScreenReader() {
    isScreenReaderMode = !isScreenReaderMode;
    document.body.classList.toggle('screen-reader-mode', isScreenReaderMode);
    userPreferences.accessibility.screenReader = isScreenReaderMode;
    saveUserPreferences();
    showNotification(`Screen reader mode ${isScreenReaderMode ? 'enabled' : 'disabled'}`, 'info');
}

// GTFS-Realtime Simulation
function simulateGTFSRealtime() {
    const liveBuses = [
        { id: '42A-001', route: '42A', position: { x: 20, y: 30 }, status: 'on-time', nextStop: 'University' },
        { id: '15B-002', route: '15B', position: { x: 60, y: 70 }, status: 'delayed', nextStop: 'Market' },
        { id: '8C-003', route: '8C', position: { x: 80, y: 40 }, status: 'on-time', nextStop: 'Sports Complex' }
    ];
    
    updateLiveBusPositions(liveBuses);
    updateArrivalPredictions();
    updateServiceAlerts();
}

function updateLiveBusPositions(buses) {
    const liveBusesContainer = document.getElementById('liveBuses');
    if (!liveBusesContainer) return;
    
    liveBusesContainer.innerHTML = '';
    
    buses.forEach(bus => {
        const marker = document.createElement('div');
        marker.className = 'bus-marker';
        marker.style.left = `${bus.position.x}%`;
        marker.style.top = `${bus.position.y}%`;
        marker.innerHTML = bus.route;
        marker.title = `Route ${bus.route} - ${bus.status} - Next: ${bus.nextStop}`;
        
        marker.addEventListener('click', () => {
            showBusDetails(bus);
        });
        
        liveBusesContainer.appendChild(marker);
    });
}

function updateArrivalPredictions() {
    const busList = document.getElementById('busList');
    if (!busList) return;
    
    const predictions = [
        { route: '42A', destination: 'Airport', eta: '5 min', status: 'on-time' },
        { route: '15B', destination: 'Hospital', eta: '12 min', status: 'delayed' },
        { route: '8C', destination: 'Mall', eta: '8 min', status: 'on-time' }
    ];
    
    busList.innerHTML = predictions.map(pred => `
        <div class="bus-item">
            <div class="bus-info">
                <div class="bus-icon">${pred.route}</div>
                <div class="bus-details">
                    <h4>Route ${pred.route}</h4>
                    <p>To ${pred.destination}</p>
                </div>
            </div>
            <div class="bus-eta">
                <div class="eta-time">${pred.eta}</div>
                <div class="eta-status">${pred.status}</div>
            </div>
        </div>
    `).join('');
}

function updateServiceAlerts() {
    const alertsList = document.getElementById('alertsList');
    if (!alertsList) return;
    
    const alerts = [
        { type: 'warning', title: 'Route 15B Delayed', message: 'Route 15B is experiencing delays due to traffic congestion. Expected delay: 10-15 minutes.', time: '2 min ago' },
        { type: 'info', title: 'New Route Added', message: 'Route 23D now serves the new Airport Terminal. Check updated schedules.', time: '1 hour ago' },
        { type: 'warning', title: 'Service Disruption', message: 'Route 7A temporarily suspended due to road construction. Alternative routes available.', time: '3 hours ago' }
    ];
    
    alertsList.innerHTML = alerts.map(alert => `
        <div class="alert-item ${alert.type}">
            <div class="alert-header">
                <div class="alert-title">${alert.title}</div>
                <div class="alert-time">${alert.time}</div>
            </div>
            <div class="alert-message">${alert.message}</div>
        </div>
    `).join('');
}

// Live Tracking Functions
function showMapView() {
    document.getElementById('mapView').style.display = 'block';
    document.getElementById('listView').style.display = 'none';
    document.getElementById('alertsPanel').style.display = 'none';
    
    document.querySelectorAll('.tracking-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.tracking-btn').classList.add('active');
}

function showListView() {
    document.getElementById('mapView').style.display = 'none';
    document.getElementById('listView').style.display = 'block';
    document.getElementById('alertsPanel').style.display = 'none';
    
    document.querySelectorAll('.tracking-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.tracking-btn').classList.add('active');
}

function toggleAlerts() {
    const alertsPanel = document.getElementById('alertsPanel');
    const isVisible = alertsPanel.style.display === 'block';
    
    document.getElementById('mapView').style.display = isVisible ? 'block' : 'none';
    document.getElementById('listView').style.display = 'none';
    alertsPanel.style.display = isVisible ? 'none' : 'block';
    
    document.querySelectorAll('.tracking-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.tracking-btn').classList.toggle('active', !isVisible);
}

// Enhanced Route Planning
function getCurrentLocation(field) {
    if (!navigator.geolocation) {
        showNotification('Geolocation is not supported by this browser', 'error');
        return;
    }
    
    showNotification('Getting your location...', 'info');
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Simulate reverse geocoding
            const location = reverseGeocode(lat, lng);
            document.getElementById(field).value = location;
            
            showNotification('Location detected successfully', 'success');
        },
        (error) => {
            showNotification('Unable to get your location', 'error');
        }
    );
}

function reverseGeocode(lat, lng) {
    // Simulate reverse geocoding - in real app, use Google Maps API or similar
    const locations = [
        'Central Station',
        'Mall Road',
        'University Gate',
        'Railway Station',
        'Bus Stand'
    ];
    return locations[Math.floor(Math.random() * locations.length)];
}

// Favorites Management
function addToFavorites(type, item) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
    if (!favorites[type]) favorites[type] = [];
    
    if (!favorites[type].includes(item)) {
        favorites[type].push(item);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        showNotification(`${item} added to favorites`, 'success');
        updateFavoritesDisplay();
    }
}

function removeFavorite(type, item) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
    if (favorites[type]) {
        favorites[type] = favorites[type].filter(fav => fav !== item);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        showNotification(`${item} removed from favorites`, 'info');
        updateFavoritesDisplay();
    }
}

function updateFavoritesDisplay() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
    // Update favorites display in the UI
}

// Privacy & Security Functions
function showPrivacySettings() {
    const settings = `
        <div class="privacy-settings">
            <h3>Privacy Settings</h3>
            <label>
                <input type="checkbox" ${userPreferences.locationTracking ? 'checked' : ''} onchange="toggleLocationTracking()">
                Allow location tracking for real-time updates
            </label>
            <label>
                <input type="checkbox" ${userPreferences.notifications ? 'checked' : ''} onchange="toggleNotifications()">
                Enable push notifications
            </label>
            <button onclick="clearAllData()">Clear All Data</button>
        </div>
    `;
    
    showModal('Privacy Settings', settings);
}

function toggleLocationTracking() {
    userPreferences.locationTracking = !userPreferences.locationTracking;
    saveUserPreferences();
    showNotification(`Location tracking ${userPreferences.locationTracking ? 'enabled' : 'disabled'}`, 'info');
}

function toggleNotifications() {
    userPreferences.notifications = !userPreferences.notifications;
    saveUserPreferences();
    showNotification(`Notifications ${userPreferences.notifications ? 'enabled' : 'disabled'}`, 'info');
}

function downloadData() {
    const userData = {
        preferences: userPreferences,
        favorites: JSON.parse(localStorage.getItem('favorites') || '{}'),
        searchHistory: JSON.parse(localStorage.getItem('searchHistory') || '[]'),
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'transit-tracker-data.json';
    link.click();
    
    showNotification('Your data has been downloaded', 'success');
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
        localStorage.clear();
        userPreferences = {
            locationTracking: false,
            notifications: true,
            language: 'en',
            accessibility: {
                highContrast: false,
                largeFont: false,
                screenReader: false
            }
        };
        showNotification('All data cleared successfully', 'success');
    }
}

// Offline Functionality
function cacheScheduleData() {
    const scheduleData = {
        routes: busRoutes,
        stops: busStops,
        lastUpdated: new Date().toISOString()
    };
    
    cachedSchedules = scheduleData;
    localStorage.setItem('cachedSchedules', JSON.stringify(scheduleData));
}

function loadCachedSchedules() {
    const cached = localStorage.getItem('cachedSchedules');
    if (cached) {
        cachedSchedules = JSON.parse(cached);
        return true;
    }
    return false;
}

function showOfflineIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'offline-indicator show';
    indicator.textContent = 'You are offline. Some features may be limited.';
    document.body.appendChild(indicator);
    
    setTimeout(() => {
        indicator.remove();
    }, 5000);
}

// User Preferences Management
function saveUserPreferences() {
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
}

function loadUserPreferences() {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
        userPreferences = { ...userPreferences, ...JSON.parse(saved) };
        
        // Apply saved preferences
        if (userPreferences.accessibility.highContrast) {
            toggleHighContrast();
        }
        if (userPreferences.accessibility.largeFont) {
            toggleFontSize();
        }
        if (userPreferences.accessibility.screenReader) {
            toggleScreenReader();
        }
        if (userPreferences.language !== 'en') {
            changeLanguage(userPreferences.language);
        }
    }
}

// Modal System
function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
            </div>
            <div class="modal-content">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Enhanced Search with Multi-modal Support
function performAdvancedSearch() {
    const source = document.getElementById('source')?.value;
    const destination = document.getElementById('destination')?.value;
    
    if (!source || !destination) {
        showNotification('Please enter both source and destination', 'error');
        return;
    }
    
    const preferences = {
        bus: document.getElementById('preferBus')?.checked || false,
        walk: document.getElementById('preferWalk')?.checked || false,
        metro: document.getElementById('preferMetro')?.checked || false
    };
    
    const results = generateMultiModalRoutes(source, destination, preferences);
    displayRouteResults(results);
}

function generateMultiModalRoutes(source, destination, preferences) {
    // Simulate multi-modal route generation
    const routes = [
        {
            type: 'bus',
            name: 'Direct Bus Route',
            steps: [`Take Route 42A from ${source} to ${destination}`],
            duration: '25 min',
            cost: '₹15',
            reliability: '95%'
        },
        {
            type: 'multi-modal',
            name: 'Bus + Walk',
            steps: [`Take Route 15B from ${source} to Central Station`, `Walk 8 minutes to ${destination}`],
            duration: '35 min',
            cost: '₹10',
            reliability: '90%'
        }
    ];
    
    return routes.filter(route => {
        if (route.type === 'bus') return preferences.bus;
        if (route.type === 'multi-modal') return preferences.bus && preferences.walk;
        return true;
    });
}

function displayRouteResults(routes) {
    const resultsContainer = document.getElementById('plannerResults');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = routes.map((route, index) => `
        <div class="result-card">
            <h4>${route.name}</h4>
            <div class="route-steps">
                ${route.steps.map(step => `<p>• ${step}</p>`).join('')}
            </div>
            <div class="route-info">
                <span><i class="fas fa-clock"></i> ${route.duration}</span>
                <span><i class="fas fa-rupee-sign"></i> ${route.cost}</span>
                <span><i class="fas fa-check-circle"></i> ${route.reliability}</span>
            </div>
            <button class="plan-btn" onclick="selectRoute(${index})">
                <i class="fas fa-route"></i>
                Select This Route
            </button>
        </div>
    `).join('');
}

function selectRoute(index) {
    showNotification('Route selected! Setting up navigation...', 'success');
    // In a real app, this would start navigation
}

// Service Worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
