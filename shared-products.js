// *** SHARED PRODUCTS SYSTEM v1.0 - 2025-01-23 ***
console.log('🛍️ SHARED-PRODUCTS.JS VERSION 1.0 LOADED - Universal Product Display System');

// Ensure we have access to the product data (loaded from app.js)
// This file assumes PRODUCT_DATABASE and categories are already loaded from app.js

/**
 * Universal Product Display System
 * All pages can use this system for consistent product display
 */
class SharedProductsSystem {
    constructor() {
        this.currentCategoryIndex = {};
        this.carouselIntervals = {};
        this.isHovered = {};
    }

    /**
     * Initialize product display on any page
     * @param {string} containerId - ID of the container element
     */
    initializeProductDisplay(containerId) {
        console.log(`🚀 Initializing shared product display for container: ${containerId}`);
        
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`❌ Container ${containerId} not found`);
            return;
        }

        this.displayAllCategories(container);
    }

    /**
     * Display all product categories with carousel system
     */
    displayAllCategories(container) {
        container.innerHTML = '';
        
        categories.forEach((category, index) => {
            if (category.products && category.products.length > 0) {
                const categoryElement = this.createCategorySection(category, index);
                container.appendChild(categoryElement);
                
                // Initialize carousel for this category
                this.initializeCategoryCarousel(category.key);
            }
        });
    }

    /**
     * Create category section with carousel
     */
    createCategorySection(category, index) {
        const section = document.createElement('div');
        section.className = 'product-category-section';
        section.innerHTML = `
            <h4 class="category-title">${category.title}</h4>
            <div class="product-carousel-container" data-category="${category.key}">
                <div class="carousel-nav-area carousel-nav-left" data-direction="prev">
                    <span class="carousel-nav-arrow">＜</span>
                </div>
                <div class="product-carousel" id="carousel-${category.key}">
                    ${this.createProductCarousel(category.products)}
                </div>
                <div class="carousel-nav-area carousel-nav-right" data-direction="next">
                    <span class="carousel-nav-arrow">＞</span>
                </div>
                <div class="carousel-indicators" id="indicators-${category.key}">
                    ${this.createCarouselIndicators(category.products)}
                </div>
            </div>
        `;
        return section;
    }

    /**
     * Create product carousel HTML
     */
    createProductCarousel(products) {
        const productsPerSlide = 3;
        const slides = [];
        
        for (let i = 0; i < products.length; i += productsPerSlide) {
            const slideProducts = products.slice(i, i + productsPerSlide);
            const slideHtml = `
                <div class="carousel-slide">
                    ${slideProducts.map(product => this.createProductCard(product)).join('')}
                </div>
            `;
            slides.push(slideHtml);
        }
        
        return slides.join('');
    }

    /**
     * Create individual product card
     */
    createProductCard(product) {
        return `
            <div class="product-card" onclick="openAmazonLink('${product.amazonUrl}')">
                <div class="product-image-container">
                    <img src="${product.imageUrl}" alt="${product.title}" class="product-image" loading="lazy">
                </div>
                <div class="product-info">
                    <h5 class="product-title">${product.title}</h5>
                    <div class="product-details">
                        ${product.rating ? `<span class="product-rating">⭐ ${product.rating}</span>` : ''}
                        <span class="product-price">${product.price}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Create carousel indicators
     */
    createCarouselIndicators(products) {
        const productsPerSlide = 3;
        const slideCount = Math.ceil(products.length / productsPerSlide);
        return Array.from({ length: slideCount }, (_, i) => 
            `<span class="carousel-indicator ${i === 0 ? 'active' : ''}" data-slide="${i}"></span>`
        ).join('');
    }

    /**
     * Initialize carousel functionality for a category
     */
    initializeCategoryCarousel(categoryKey) {
        const container = document.querySelector(`[data-category="${categoryKey}"]`);
        if (!container) return;

        this.currentCategoryIndex[categoryKey] = 0;
        this.isHovered[categoryKey] = false;

        // Navigation click events
        const prevBtn = container.querySelector('.carousel-nav-left');
        const nextBtn = container.querySelector('.carousel-nav-right');
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => this.navigateCarousel(categoryKey, 'prev'));
            nextBtn.addEventListener('click', () => this.navigateCarousel(categoryKey, 'next'));
        }

        // Hover events
        container.addEventListener('mouseenter', () => {
            this.isHovered[categoryKey] = true;
            this.stopAutoSlide(categoryKey);
        });
        
        container.addEventListener('mouseleave', () => {
            this.isHovered[categoryKey] = false;
            this.startAutoSlide(categoryKey);
        });

        // Indicator click events
        const indicators = container.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(categoryKey, index);
            });
        });

        // Start auto-slide
        this.startAutoSlide(categoryKey);
    }

    /**
     * Navigate carousel (prev/next)
     */
    navigateCarousel(categoryKey, direction) {
        const carousel = document.getElementById(`carousel-${categoryKey}`);
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.carousel-slide');
        const totalSlides = slides.length;
        
        if (direction === 'next') {
            this.currentCategoryIndex[categoryKey] = (this.currentCategoryIndex[categoryKey] + 1) % totalSlides;
        } else {
            this.currentCategoryIndex[categoryKey] = (this.currentCategoryIndex[categoryKey] - 1 + totalSlides) % totalSlides;
        }

        this.updateCarouselDisplay(categoryKey);
    }

    /**
     * Go to specific slide
     */
    goToSlide(categoryKey, slideIndex) {
        this.currentCategoryIndex[categoryKey] = slideIndex;
        this.updateCarouselDisplay(categoryKey);
    }

    /**
     * Update carousel display
     */
    updateCarouselDisplay(categoryKey) {
        const carousel = document.getElementById(`carousel-${categoryKey}`);
        const indicators = document.getElementById(`indicators-${categoryKey}`);
        
        if (!carousel || !indicators) return;

        const currentIndex = this.currentCategoryIndex[categoryKey];
        const translateX = -currentIndex * 100;
        
        carousel.style.transform = `translateX(${translateX}%)`;
        
        // Update indicators
        indicators.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    /**
     * Start auto-slide for category
     */
    startAutoSlide(categoryKey) {
        this.stopAutoSlide(categoryKey); // Clear existing interval
        
        this.carouselIntervals[categoryKey] = setInterval(() => {
            if (!this.isHovered[categoryKey]) {
                this.navigateCarousel(categoryKey, 'next');
            }
        }, 8000); // 8 seconds interval
    }

    /**
     * Stop auto-slide for category
     */
    stopAutoSlide(categoryKey) {
        if (this.carouselIntervals[categoryKey]) {
            clearInterval(this.carouselIntervals[categoryKey]);
            delete this.carouselIntervals[categoryKey];
        }
    }

    /**
     * Cleanup all intervals when page unloads
     */
    cleanup() {
        Object.keys(this.carouselIntervals).forEach(categoryKey => {
            this.stopAutoSlide(categoryKey);
        });
    }
}

// Global instance
const sharedProductsSystem = new SharedProductsSystem();

// Global function for opening Amazon links
function openAmazonLink(amazonUrl) {
    try {
        window.open(amazonUrl, '_blank', 'noopener,noreferrer');
        console.log('🔗 Opening Amazon link:', amazonUrl);
    } catch (error) {
        console.error('❌ Failed to open Amazon link:', error);
        // Fallback: try location.href
        window.location.href = amazonUrl;
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    sharedProductsSystem.cleanup();
});

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', () => {
    // Try common container IDs
    const commonContainerIds = ['sidebarProducts', 'productContainer', 'recommendedProducts'];
    
    for (const containerId of commonContainerIds) {
        const container = document.getElementById(containerId);
        if (container) {
            console.log(`✅ Auto-initializing shared products for: ${containerId}`);
            sharedProductsSystem.initializeProductDisplay(containerId);
            break;
        }
    }
});

console.log('✅ Shared Products System ready for universal usage');