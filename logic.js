/**
 * findPicture - Image Search Application
 * Main JavaScript logic for API integration and DOM manipulation
 * 
 * Dependencies: Unsplash API
 * Author: Kunal-mob
 * License: MIT
 */

/* ============================================
   Configuration Object
   ============================================ */
const CONFIG = {
  API_BASE_URL: 'https://api.unsplash.com/search/photos',
  API_KEY: '5avYHhjkw2sRyj4StFtWyCI5bqEtXtPkSxCoZN2LQCo',
  IMAGES_PER_PAGE: 12,
};

/* ============================================
   State Management
   ============================================ */
const state = {
  page: 1,
  query: '',
  isLoading: false,
  totalResults: 0,
};

/* ============================================
   DOM Elements
   ============================================ */
const elements = {
  inputData: document.getElementById('input-data'),
  searchBtn: document.getElementById('search-btn'),
  allPics: document.getElementById('all-pics'),
  showMore: document.getElementById('show-more'),
  loading: document.getElementById('loading'),
  errorMessage: document.getElementById('error-message'),
};

/* ============================================
   Event Listeners
   ============================================ */

/**
 * Search button click handler
 */
elements.searchBtn.addEventListener('click', handleSearch);

/**
 * Enter key handler for input field
 */
elements.inputData.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    handleSearch();
  }
});

/**
 * Load more button click handler
 */
elements.showMore.addEventListener('click', loadMoreImages);

/* ============================================
   Main Functions
   ============================================ */

/**
 * Handle search action
 * Validates input, resets pagination, and fetches images
 */
function handleSearch() {
  const query = elements.inputData.value.trim();

  // Validation
  if (!query) {
    showError('Please enter an image name to search');
    return;
  }

  // Reset state and UI
  state.page = 1;
  state.query = query;
  clearGallery();
  hideError();

  // Fetch images
  fetchImages();
}

/**
 * Load more images by incrementing page and fetching
 */
function loadMoreImages() {
  state.page++;
  fetchImages();
}

/**
 * Fetch images from Unsplash API
 * @async
 */
async function fetchImages() {
  try {
    // Show loading indicator
    showLoading(true);

    // Build API URL with parameters
    const url = buildApiUrl(state.query, state.page);

    // Fetch data from API
    console.log(`Fetching images: ${state.query} (Page: ${state.page})`);
    const response = await fetch(url);

    // Handle API errors
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Handle empty results
    if (!data.results || data.results.length === 0) {
      if (state.page === 1) {
        showError(`No images found for "${state.query}". Try a different search term.`);
        hideShowMore();
      } else {
        showError('No more images available.');
      }
      showLoading(false);
      return;
    }

    // Store total results for reference
    state.totalResults = data.total;

    // Display images
    displayImages(data.results);

    // Show/hide "Load More" button
    if (data.total > state.page * CONFIG.IMAGES_PER_PAGE) {
      showShowMore();
    } else {
      hideShowMore();
    }

    hideError();
    console.log(`Successfully loaded ${data.results.length} images`);

  } catch (error) {
    console.error('Error fetching images:', error);
    showError(`Error: ${error.message}. Please try again.`);
    hideShowMore();
  } finally {
    showLoading(false);
  }
}

/**
 * Build API URL with query parameters
 * @param {string} query - Search query
 * @param {number} page - Page number
 * @returns {string} Complete API URL
 */
function buildApiUrl(query, page) {
  const params = new URLSearchParams({
    query: query,
    page: page,
    per_page: CONFIG.IMAGES_PER_PAGE,
    client_id: CONFIG.API_KEY,
  });
  return `${CONFIG.API_BASE_URL}?${params.toString()}`;
}

/**
 * Display images in the gallery
 * @param {Array} results - Array of image objects from API
 */
function displayImages(results) {
  results.forEach((image) => {
    // Create image element
    const img = createImageElement(image);

    // Append to gallery
    elements.allPics.appendChild(img);
  });
}

/**
 * Create an image element with attributes and event listeners
 * @param {Object} image - Image object from API
 * @returns {HTMLImageElement} Configured image element
 */
function createImageElement(image) {
  const img = document.createElement('img');

  // Set image source and attributes
  img.src = image.urls.small;
  img.alt = image.alt_description || 'Search result image';
  img.title = image.description || 'Image';
  img.loading = 'lazy'; // Lazy loading for performance
  img.setAttribute('data-image-id', image.id);

  // Add click event for image preview (optional enhancement)
  img.addEventListener('click', () => {
    openImagePreview(image);
  });

  return img;
}

/**
 * Open image preview (can be enhanced with modal)
 * @param {Object} image - Image object from API
 */
function openImagePreview(image) {
  console.log('Image clicked:', image);
  // This can be enhanced to open a modal or lightbox
  // For now, just log the action
}

/**
 * Clear gallery content
 */
function clearGallery() {
  elements.allPics.innerHTML = '';
  console.log('Gallery cleared');
}

/* ============================================
   UI Helper Functions
   ============================================ */

/**
 * Show/hide loading indicator
 * @param {boolean} isVisible - Visibility state
 */
function showLoading(isVisible) {
  state.isLoading = isVisible;
  if (isVisible) {
    elements.loading.classList.add('show');
  } else {
    elements.loading.classList.remove('show');
  }
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
  elements.errorMessage.textContent = message;
  elements.errorMessage.classList.add('show');
  console.warn('Error displayed:', message);
}

/**
 * Hide error message
 */
function hideError() {
  elements.errorMessage.classList.remove('show');
  elements.errorMessage.textContent = '';
}

/**
 * Show "Load More" button
 */
function showShowMore() {
  elements.showMore.classList.add('show');
}

/**
 * Hide "Load More" button
 */
function hideShowMore() {
  elements.showMore.classList.remove('show');
}

/* ============================================
   Utility Functions
   ============================================ */

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Log application information on load
 */
function logAppInfo() {
  console.log(
    '%cfindPicture v1.0',
    'color: #ff9800; font-size: 16px; font-weight: bold;'
  );
  console.log('Image search powered by Unsplash API');
  console.log('GitHub: https://github.com/Kunal-mob/findPicture');
}

/* ============================================
   Initialization
   ============================================ */

/**
 * Initialize the application
 */
function init() {
  logAppInfo();
  console.log('Application initialized');
  hideShowMore();
  hideError();
  showLoading(false);
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
