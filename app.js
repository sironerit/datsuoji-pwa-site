// *** VERSION DEBUG v1.2 - 2025-01-21 ***
console.log('🔥 APP.JS VERSION 1.2 LOADED - With Amazon product recommendations');

// Amazon Associates configuration
const AMAZON_ASSOCIATE_TAG = 'pachisondatin-22';

// Product database for recommendations
const PRODUCT_DATABASE = {
    communication: [
        {
            title: "大人の話し方大全",
            description: "品格のある大人の会話術を身につける実践ガイド",
            price: "¥1,540",
            rating: 4.3,
            reviews: 186,
            image: "https://m.media-amazon.com/images/I/51xQ2BdVhJL._SL500_.jpg",
            asin: "B08XYQZQ7M",
            category: "コミュニケーション"
        },
        {
            title: "恋愛心理学 大全",
            description: "心理学に基づいた恋愛テクニックと人間関係の秘訣",
            price: "¥1,650",
            rating: 4.1,
            reviews: 94,
            image: "https://m.media-amazon.com/images/I/51CDG+mjXVL._SL500_.jpg",
            asin: "B09XVYQL2P",
            category: "恋愛心理学"
        },
        {
            title: "人を動かす",
            description: "デール・カーネギーの名著。人間関係の基本を学ぶ",
            price: "¥715",
            rating: 4.4,
            reviews: 2847,
            image: "https://m.media-amazon.com/images/I/51CDG+mjXVL._SL500_.jpg",
            asin: "B071DC7ZTN",
            category: "自己啓発"
        }
    ],
    fashion: [
        {
            title: "カルバン クライン 香水 エタニティ",
            description: "大人の男性に人気の上品で洗練された香り",
            price: "¥3,280",
            rating: 4.2,
            reviews: 451,
            image: "https://m.media-amazon.com/images/I/61z+vQqD+VL._SL500_.jpg",
            asin: "B000C20F0I",
            category: "フレグランス"
        },
        {
            title: "無印良品 エイジングケア 化粧水",
            description: "大人の肌をケアする高保湿化粧水",
            price: "¥1,590",
            rating: 4.1,
            reviews: 328,
            image: "https://m.media-amazon.com/images/I/61z+vQqD+VL._SL500_.jpg",
            asin: "B08QR1T4FQ",
            category: "スキンケア"
        },
        {
            title: "ユニクロ メンズ 洗えるスラックス",
            description: "清潔感のあるビジネスカジュアルパンツ",
            price: "¥2,990",
            rating: 4.0,
            reviews: 156,
            image: "https://m.media-amazon.com/images/I/71rH2qZvLwL._SL500_.jpg",
            asin: "B09TQR5GVH",
            category: "ファッション"
        }
    ],
    lifestyle: [
        {
            title: "おしゃれなワイングラス セット",
            description: "デートやお食事に使える上品なグラス",
            price: "¥2,480",
            rating: 4.3,
            reviews: 89,
            image: "https://m.media-amazon.com/images/I/71rH2qZvLwL._SL500_.jpg",
            asin: "B0B2L7M9XR",
            category: "インテリア"
        }
    ]
};

// DOM Elements
const inputText = document.getElementById('inputText');
const charCount = document.getElementById('charCount');
const improveBtn = document.getElementById('improveBtn');
const resultsSection = document.getElementById('resultsSection');
const resultsGrid = document.getElementById('resultsGrid');
const loadingModal = document.getElementById('loadingModal');

// App State
let isProcessing = false;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered successfully');
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }

    // Set up event listeners
    setupEventListeners();
    
    // Update character count
    updateCharCount();
    
    // Display recommended products immediately on page load (permanent section)
    displayPermanentRecommendedProducts();
}

function setupEventListeners() {
    // Input text area events
    inputText.addEventListener('input', handleInputChange);
    inputText.addEventListener('paste', handlePaste);
    
    // Improve button click
    console.log('🔧 Setting up improve button listener');
    improveBtn.addEventListener('click', function(event) {
        console.log('🖱️ Improve button clicked!', event);
        handleImproveClick();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

function handleInputChange() {
    updateCharCount();
    updateImproveButton();
}

function handlePaste(event) {
    // Allow paste, then update after a brief delay
    setTimeout(() => {
        updateCharCount();
        updateImproveButton();
    }, 10);
}

function updateCharCount() {
    const text = inputText.value;
    const count = text.length;
    charCount.textContent = count;
    
    // Update styling based on character limit
    if (count > 450) {
        charCount.style.color = '#dc2626';
    } else if (count > 400) {
        charCount.style.color = '#f59e0b';
    } else {
        charCount.style.color = '#6b7280';
    }
}

function updateImproveButton() {
    const text = inputText.value.trim();
    const isValid = text.length > 0 && text.length <= 500;
    
    improveBtn.disabled = !isValid || isProcessing;
    
    if (text.length === 0) {
        improveBtn.textContent = '✨ AIで改善する';
    } else if (text.length > 500) {
        improveBtn.textContent = '⚠️ 文字数制限を超えています';
    } else {
        improveBtn.textContent = '✨ AIで改善する';
    }
}

async function handleImproveClick() {
    if (isProcessing) return;
    
    const text = inputText.value.trim();
    if (!text) return;
    
    console.log('🚀 handleImproveClick started with text:', text);
    
    try {
        isProcessing = true;
        showLoadingModal();
        updateImproveButton();
        
        console.log('📞 About to call callImprovementAPI...');
        // Call improvement API (placeholder for now)
        const improvements = await callImprovementAPI(text);
        
        console.log('✅ Got improvements:', improvements);
        displayResults(improvements);
        // Don't display additional recommendations after improvement - use permanent sidebar
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Improvement failed:', error);
        showErrorMessage('改善処理中にエラーが発生しました。もう一度お試しください。');
    } finally {
        isProcessing = false;
        hideLoadingModal();
        updateImproveButton();
    }
}

async function callImprovementAPI(text) {
    try {
        console.log('Calling improvement API with text:', text);
        
        const response = await fetch('/api/improve-text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API request failed: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        if (!data.success || !data.improvedTexts || !Array.isArray(data.improvedTexts)) {
            throw new Error('Invalid API response format');
        }
        
        // Convert simple strings to improvement objects for compatibility with existing UI
        const improvements = data.improvedTexts.map((text, index) => ({
            text: text,
            tone: index === 0 ? "丁寧・謙虚" : 
                  index === 1 ? "自然・親しみやすい" :
                  index === 2 ? "フレンドリー" : "シンプル・誠実"
        }));
        
        // Track successful improvement
        trackImprovement(text.length, improvements.length);
        
        return improvements;
        
    } catch (error) {
        console.error('API call failed:', error);
        console.error('Error details:', error.message);
        console.error('Stack trace:', error.stack);
        
        // Show user-friendly error and fallback to mock for demonstration
        showErrorMessage(`AI改善に失敗しました: ${error.message}\nモック版を表示しています。`);
        
        // Fallback to mock improvements for demonstration
        return generateMockImprovements(text);
    }
}

function generateMockImprovements(originalText) {
    // Mock improvement logic for demonstration purposes
    const improvements = [
        {
            text: "プロフィールを拝見しました。とても素敵な方だなと感じています。もしよろしければ、お話しできればと思います。",
            tone: "丁寧・謙虚"
        },
        {
            text: "はじめまして。プロフィールから、きっと魅力的な方なんだろうなと思いました。お時間のある時にでも、お話しできたら嬉しいです。",
            tone: "自然・親しみやすい"
        },
        {
            text: "こんにちは。プロフィールを見て、共通の趣味がありそうだなと思いました。良かったらメッセージを交換していただけませんか？",
            tone: "フレンドリー"
        },
        {
            text: "プロフィールを読ませていただきました。お話ししてみたいなと思ったのですが、いかがでしょうか。",
            tone: "シンプル・誠実"
        }
    ];
    
    return improvements;
}

function displayResults(improvements) {
    resultsGrid.innerHTML = '';
    
    improvements.forEach((improvement, index) => {
        const resultCard = createResultCard(improvement, index + 1);
        
        // Add staggered animation
        resultCard.style.opacity = '0';
        resultCard.style.transform = 'translateY(20px)';
        
        resultsGrid.appendChild(resultCard);
        
        // Trigger animation with delay
        setTimeout(() => {
            resultCard.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            resultCard.style.opacity = '1';
            resultCard.style.transform = 'translateY(0)';
        }, index * 150); // Staggered delay
    });
}

function createResultCard(improvement, number) {
    const card = document.createElement('div');
    card.className = 'result-card';
    
    card.innerHTML = `
        <div class="result-header">
            <div class="result-number">${number}</div>
            <button class="copy-btn" data-text="${improvement.text.replace(/"/g, '&quot;')}">
                📋 コピー
            </button>
        </div>
        <div class="result-text">${improvement.text}</div>
        ${improvement.tone ? `<div class="result-tone">💭 ${improvement.tone}</div>` : ''}
    `;
    
    // Add event listener for copy button (CSP-safe)
    const copyBtn = card.querySelector('.copy-btn');
    copyBtn.addEventListener('click', function() {
        const text = this.getAttribute('data-text');
        copyToClipboard(this, text);
    });
    
    return card;
}

function displayRecommendedProducts() {
    // Check if recommendations section already exists (for after-improvement display)
    let recommendationsSection = document.getElementById('recommendationsSection');
    
    if (!recommendationsSection) {
        // Create recommendations section
        recommendationsSection = document.createElement('div');
        recommendationsSection.id = 'recommendationsSection';
        recommendationsSection.className = 'recommendations-section';
        
        recommendationsSection.innerHTML = `
            <h2>💍 魅力アップ商品</h2>
            <p class="recommendations-subtitle">40-50代男性の魅力を高める厳選アイテム</p>
            <div id="categoriesContainer" class="categories-container"></div>
        `;
        
        // Insert after results section
        resultsSection.appendChild(recommendationsSection);
    }
    
    // Create category-based product sections
    createCategorySection('📚 コミュニケーション', 'communication', 4);
    createCategorySection('👔 ファッション・身だしなみ', 'fashion', 5);
    createCategorySection('🍷 ライフスタイル', 'lifestyle', 6);
}

function displayPermanentRecommendedProducts() {
    // Display products in the permanent section (always visible)
    const permanentCategoriesContainer = document.getElementById('permanentCategoriesContainer');
    
    if (permanentCategoriesContainer) {
        // Clear existing content
        permanentCategoriesContainer.innerHTML = '';
        
        // Create category-based product sections for permanent display
        createPermanentCategorySection('📚 コミュニケーション', 'communication', 1);
        createPermanentCategorySection('👔 ファッション・身だしなみ', 'fashion', 2);
        createPermanentCategorySection('🍷 ライフスタイル', 'lifestyle', 3);
    }
}

function setupCategorySwitching() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Display products for selected category
            displayCategoryProducts(category);
        });
    });
}

function displayCategoryProducts(category) {
    const categoryProducts = PRODUCT_DATABASE[category] || [];
    const productsContainer = document.getElementById('selectedCategoryProducts');
    const categoryTitle = document.getElementById('selectedCategoryTitle');
    
    if (!productsContainer || !categoryTitle) return;
    
    // Update category title
    const categoryTitles = {
        'communication': '📚 コミュニケーション',
        'fashion': '👔 ファッション・身だしなみ',
        'lifestyle': '🍷 ライフスタイル'
    };
    categoryTitle.textContent = categoryTitles[category] || 'カテゴリ';
    
    // Clear existing products
    productsContainer.innerHTML = '';
    
    // Add products to container with animation
    categoryProducts.forEach((product, index) => {
        const productCard = createHorizontalProductCard(product);
        productCard.style.opacity = '0';
        productCard.style.transform = 'translateX(20px)';
        
        productsContainer.appendChild(productCard);
        
        // Animate product cards
        setTimeout(() => {
            productCard.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            productCard.style.opacity = '1';
            productCard.style.transform = 'translateX(0)';
        }, index * 100);
    });
}

function createCategorySection(title, category, animationDelay) {
    const categoriesContainer = document.getElementById('categoriesContainer');
    
    // Create category section
    const categorySection = document.createElement('div');
    categorySection.className = 'category-section';
    categorySection.style.opacity = '0';
    categorySection.style.transform = 'translateY(20px)';
    
    categorySection.innerHTML = `
        <h3 class="category-title">${title}</h3>
        <div class="products-horizontal-scroll" data-category="${category}">
            <div class="products-horizontal-container"></div>
        </div>
    `;
    
    categoriesContainer.appendChild(categorySection);
    
    // Get products for this category
    const categoryProducts = PRODUCT_DATABASE[category] || [];
    const horizontalContainer = categorySection.querySelector('.products-horizontal-container');
    
    // Add products to horizontal container
    categoryProducts.forEach((product, index) => {
        const productCard = createHorizontalProductCard(product);
        horizontalContainer.appendChild(productCard);
    });
    
    // Animate category section
    setTimeout(() => {
        categorySection.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        categorySection.style.opacity = '1';
        categorySection.style.transform = 'translateY(0)';
    }, animationDelay * 150);
}

function createPermanentCategorySection(title, category, animationDelay) {
    const permanentCategoriesContainer = document.getElementById('permanentCategoriesContainer');
    
    if (!permanentCategoriesContainer) return;
    
    // Create category section
    const categorySection = document.createElement('div');
    categorySection.className = 'category-section';
    categorySection.style.opacity = '0';
    categorySection.style.transform = 'translateY(20px)';
    
    categorySection.innerHTML = `
        <h3 class="category-title">${title}</h3>
        <div class="products-horizontal-scroll" data-category="${category}">
            <div class="products-horizontal-container"></div>
        </div>
    `;
    
    permanentCategoriesContainer.appendChild(categorySection);
    
    // Get products for this category
    const categoryProducts = PRODUCT_DATABASE[category] || [];
    const horizontalContainer = categorySection.querySelector('.products-horizontal-container');
    
    // Add products to horizontal container
    categoryProducts.forEach((product, index) => {
        const productCard = createHorizontalProductCard(product);
        horizontalContainer.appendChild(productCard);
    });
    
    // Animate category section
    setTimeout(() => {
        categorySection.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        categorySection.style.opacity = '1';
        categorySection.style.transform = 'translateY(0)';
    }, animationDelay * 200);
}

function getRecommendedProducts() {
    // Select 3 products from different categories
    const communication = PRODUCT_DATABASE.communication[Math.floor(Math.random() * PRODUCT_DATABASE.communication.length)];
    const fashion = PRODUCT_DATABASE.fashion[Math.floor(Math.random() * PRODUCT_DATABASE.fashion.length)];
    const lifestyle = PRODUCT_DATABASE.lifestyle[Math.floor(Math.random() * PRODUCT_DATABASE.lifestyle.length)];
    
    return [communication, fashion, lifestyle];
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const amazonUrl = `https://www.amazon.co.jp/dp/${product.asin}?tag=${AMAZON_ASSOCIATE_TAG}`;
    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.title}" loading="lazy">
            <div class="product-category">${product.category}</div>
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-rating">
                <span class="stars">${stars}</span>
                <span class="rating-text">${product.rating} (${product.reviews})</span>
            </div>
            <div class="product-footer">
                <span class="product-price">${product.price}</span>
                <a href="${amazonUrl}" target="_blank" rel="noopener" class="product-btn">
                    🛒 Amazonで見る
                </a>
            </div>
        </div>
    `;
    
    return card;
}

function createHorizontalProductCard(product) {
    const card = document.createElement('div');
    card.className = 'horizontal-product-card';
    
    const amazonUrl = `https://www.amazon.co.jp/dp/${product.asin}?tag=${AMAZON_ASSOCIATE_TAG}`;
    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    
    card.innerHTML = `
        <div class="horizontal-product-image">
            <img src="${product.image}" alt="${product.title}" loading="lazy">
            <div class="horizontal-product-category">${product.category}</div>
        </div>
        <div class="horizontal-product-info">
            <h4 class="horizontal-product-title">${product.title}</h4>
            <div class="horizontal-product-rating">
                <span class="stars">${stars}</span>
                <span class="rating-number">${product.rating}</span>
            </div>
            <div class="horizontal-product-price">${product.price}</div>
            <a href="${amazonUrl}" target="_blank" rel="noopener" class="horizontal-product-btn">
                🛒 Amazon
            </a>
        </div>
    `;
    
    return card;
}

async function copyToClipboard(button, text) {
    try {
        await navigator.clipboard.writeText(text);
        
        const originalText = button.textContent;
        button.textContent = '✅ コピー完了';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
        
    } catch (error) {
        console.error('Copy failed:', error);
        
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        button.textContent = '✅ コピー完了';
        setTimeout(() => {
            button.textContent = '📋 コピー';
        }, 2000);
    }
}

function showLoadingModal() {
    loadingModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function hideLoadingModal() {
    loadingModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showErrorMessage(message) {
    // Create error notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fef2f2;
        color: #dc2626;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        border: 1px solid #fecaca;
        z-index: 1001;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + Enter to improve text
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        if (!improveBtn.disabled) {
            handleImproveClick();
        }
    }
    
    // Escape to close modal
    if (event.key === 'Escape') {
        if (loadingModal.style.display === 'block') {
            // Don't allow closing loading modal with Escape
            // as it might interrupt the API call
            return;
        }
    }
}

// PWA Installation prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    
    // Show install button (you can customize this UI)
    showInstallPrompt();
});

function showInstallPrompt() {
    // Create install prompt
    const installBanner = document.createElement('div');
    installBanner.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        background: #2563eb;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `;
    
    installBanner.innerHTML = `
        <span>📱 アプリとしてインストールできます</span>
        <div>
            <button id="installBtn" style="background: white; color: #2563eb; border: none; padding: 8px 16px; border-radius: 4px; margin-right: 8px; cursor: pointer;">インストール</button>
            <button id="dismissBtn" style="background: transparent; color: white; border: 1px solid white; padding: 8px 16px; border-radius: 4px; cursor: pointer;">後で</button>
        </div>
    `;
    
    document.body.appendChild(installBanner);
    
    // Install button click
    document.getElementById('installBtn').addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log('Install prompt outcome:', outcome);
            deferredPrompt = null;
        }
        installBanner.remove();
    });
    
    // Dismiss button click
    document.getElementById('dismissBtn').addEventListener('click', () => {
        installBanner.remove();
    });
    
    // Auto-dismiss after 10 seconds
    setTimeout(() => {
        if (installBanner.parentNode) {
            installBanner.remove();
        }
    }, 10000);
}

// Analytics placeholder
function trackEvent(eventName, parameters = {}) {
    // TODO: Add analytics tracking (Google Analytics, etc.)
    console.log('Analytics Event:', eventName, parameters);
}

// Track usage
document.addEventListener('DOMContentLoaded', () => {
    trackEvent('app_loaded');
});

// Track improvements
function trackImprovement(originalLength, resultCount) {
    trackEvent('text_improved', {
        original_length: originalLength,
        result_count: resultCount
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Error handling for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

// Network status handling
window.addEventListener('online', () => {
    console.log('Network connection restored');
});

window.addEventListener('offline', () => {
    console.log('Network connection lost');
    showErrorMessage('インターネット接続が切断されました。オフライン機能は限定的です。');
});