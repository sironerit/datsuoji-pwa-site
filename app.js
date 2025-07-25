// *** VERSION DEBUG v1.2 - 2025-01-21 ***
console.log('🔥 APP.JS VERSION 1.2 LOADED - With Amazon product recommendations');

// Amazon Associates configuration
const AMAZON_ASSOCIATE_TAG = 'pachisondatin-22';

// Android版統合カテゴリ（8カテゴリ、30+商品） - フィットネス優先表示
// Global categories for shared product system
const categories = [
    { key: 'fitness', title: '💪 フィットネス', products: null }, // Will be populated after PRODUCT_DATABASE is loaded
    { key: 'skincare', title: '🧴 スキンケア', products: null },  
    { key: 'fragrance', title: '🌸 香水・フレグランス', products: null },
    { key: 'accessories', title: '⌚ アクセサリー', products: null },
    { key: 'grooming', title: '✂️ 身だしなみ', products: null },
    { key: 'gadget', title: '📱 ガジェット', products: null },
    { key: 'hobby', title: '📚 趣味・教養', products: null },
    { key: 'fashion', title: '👔 ファッション', products: null }
];

// Product database for recommendations - Real Android app products with working ASINs
// Android版MoteGoodsSampleDataから統合した高品質商品データベース
const PRODUCT_DATABASE = {
    // 👔 ファッション
    fashion: [
        {
            title: "HMT スラックス メンズ ズボン 夏服 冷感パンツ",
            description: "接触冷感でビジネスシーンも快適。ストレッチ素材で動きやすく、ウォッシャブルで手入れも簡単",
            price: "¥2,980",
            rating: 4.1,
            reviews: 234,
            image: "https://m.media-amazon.com/images/I/41LgnJTvhjL._AC_SX569_.jpg",
            asin: "B0F12TRMW7",
            category: "パンツ",
            amazonUrl: "https://www.amazon.co.jp/dp/B0F12TRMW7/ref=nosim?tag=pachisondatin-22"
        },
        {
            title: "ビジネスシューズ 本革 メンズ ドレスシューズ",
            description: "足元で差がつく本革ビジネスシューズ。上質な革と洗練されたデザインで大人の品格を演出",
            price: "¥8,800",
            rating: 4.2,
            reviews: 1567,
            image: "https://m.media-amazon.com/images/I/71LG+fqr4FL._AC_SX695_.jpg",
            asin: "B01N9GNS6T",
            category: "シューズ",
            amazonUrl: "https://www.amazon.co.jp/dp/B01N9GNS6T/ref=nosim?tag=pachisondatin-22"
        },
        {
            title: "CHAOREN クリックベルト 革ベルト オートロック",
            description: "本革使用の高品質ベルト。オートロック機能で装着簡単、105-150cmの大きいサイズまで対応",
            price: "¥2,480",
            rating: 4.3,
            reviews: 1567,
            image: "https://m.media-amazon.com/images/I/817zRHPKC2L._AC_SY606_.jpg",
            asin: "40pqzUr",
            category: "ベルト",
            amazonUrl: "https://amzn.to/40pqzUr"
        }
    ],
    
    // 🧴 スキンケア  
    skincare: [
        {
            title: "マニフィーク オールインワンジェル メンズ スキンケア",
            description: "化粧水・乳液・美容液がこれ1本。忙しい男性の時短スキンケアに最適な230mL大容量",
            price: "¥2,750",
            rating: 4.2,
            reviews: 567,
            image: "https://m.media-amazon.com/images/I/51xiOsgCYDL._AC_SY450_.jpg",
            asin: "B08D3MRSRC",
            category: "オールインワン",
            amazonUrl: "https://www.amazon.co.jp/dp/B08D3MRSRC/ref=nosim?tag=pachisondatin-22"
        },
        {
            title: "NILE ホワイトローション アルファ α",
            description: "高保湿化粧水でメンズ・レディース両用。ヒアルロン酸配合で肌に潤いを与える",
            price: "¥2,480",
            rating: 4.3,
            reviews: 892,
            image: "https://m.media-amazon.com/images/I/619JoyXHn3L.__AC_SX300_SY300_QL70_ML2_.jpg",
            asin: "B08D8V8HH9",
            category: "化粧水",
            amazonUrl: "https://www.amazon.co.jp/dp/B08D8V8HH9/ref=nosim?tag=pachisondatin-22"
        },
        {
            title: "無印良品 敏感肌用オールインワン美容液ジェル",
            description: "敏感肌にやさしいオールインワンジェル。1本で化粧水・乳液・美容液の役割を果たし、忙しい男性の時短スキンケアに最適",
            price: "¥1,890",
            rating: 4.2,
            reviews: 856,
            image: "https://m.media-amazon.com/images/I/517rBm7-PnL._AC_SY450_.jpg",
            asin: "B087CG8YXH",
            category: "オールインワン",
            amazonUrl: "https://www.amazon.co.jp/dp/B087CG8YXH/ref=nosim?tag=pachisondatin-22"
        },
        {
            title: "NILE 濃密泡洗顔 メンズ",
            description: "濃密な泡で優しく洗浄。男性の肌を清潔に保ち、好印象を与える洗顔フォーム",
            price: "¥2,280",
            rating: 4.3,
            reviews: 1678,
            image: "https://m.media-amazon.com/images/I/61PVl8iD6CL._AC_SY879_.jpg",
            asin: "B0F3N3TLBZ",
            category: "洗顔",
            amazonUrl: "https://www.amazon.co.jp/dp/B0F3N3TLBZ/ref=nosim?tag=pachisondatin-22"
        }
    ],
    
    // 🌸 香水・フレグランス
    fragrance: [
        {
            title: "ブルガリ プールオム オードトワレ 100ml",
            description: "洗練された大人の男性のための上質な香り。シトラスとスパイシーノートが絶妙に調和",
            price: "¥14,230",
            rating: 4.4,
            reviews: 892,
            image: "https://m.media-amazon.com/images/I/61vM9p2C3uL.__AC_SY300_SX300_QL70_ML2_.jpg",
            asin: "4eZUZm3",
            category: "香水",
            amazonUrl: "https://amzn.to/4eZUZm3"
        },
        {
            title: "カルバンクライン CK-ONE オードトワレ 100ml",
            description: "ユニセックスで使える爽やかな香り。シトラス系の清潔感あふれる定番フレグランス",
            price: "¥3,602",
            rating: 4.3,
            reviews: 1567,
            image: "https://m.media-amazon.com/images/I/51GHAOF+vFL._AC_SX679_.jpg",
            asin: "4lAZKF7",
            category: "香水",
            amazonUrl: "https://amzn.to/4lAZKF7"
        },
        {
            title: "トムフォード ブラックオーキッド オードパルファム",
            description: "最高級の大人の魅力を演出する究極のフレグランス。洗練された男性の象徴",
            price: "¥25,850",
            rating: 4.5,
            reviews: 892,
            image: "https://m.media-amazon.com/images/I/51nQHHC3NeL._AC_SY879_.jpg",
            asin: "46meGT6",
            category: "香水",
            amazonUrl: "https://amzn.to/46meGT6"
        }
    ],
    
    // ⌚ アクセサリー
    accessories: [
        {
            title: "【JIS認証】UVカット100%遮光遮熱 折り畳み傘",
            description: "皮膚科医監修の高性能折り畳み傘。UVカット100%、自動開閉、超軽量で紳士の身だしなみに最適",
            price: "¥3,999",
            rating: 4.5,
            reviews: 892,
            image: "https://m.media-amazon.com/images/I/61nb4klZA4L._AC_SX569_.jpg",
            asin: "46lbebk",
            category: "傘",
            amazonUrl: "https://amzn.to/46lbebk"
        },
        {
            title: "セイコー ソーラー腕時計 メンズ ビジネス",
            description: "ソーラー充電で電池交換不要。ビジネスシーンで信頼感を演出する大人の必需品",
            price: "¥12,100",
            rating: 4.3,
            reviews: 1234,
            image: "https://m.media-amazon.com/images/I/611juWDOc-L._AC_SX679_.jpg",
            asin: "4o07uCa",
            category: "腕時計",
            amazonUrl: "https://amzn.to/4o07uCa"
        },
        {
            title: "カシオ G-SHOCK デジタル腕時計 メンズ",
            description: "タフネス・アクティブさを演出するアイコニックウォッチ。男らしさの象徴",
            price: "¥11,450",
            rating: 4.4,
            reviews: 2156,
            image: "https://m.media-amazon.com/images/I/61BudVOKqeL._AC_SX679_.jpg",
            asin: "B08D92LG93",
            category: "腕時計",
            amazonUrl: "https://www.amazon.co.jp/dp/B08D92LG93/ref=nosim?tag=pachisondatin-22"
        },
        {
            title: "ＡＴＩＡＮＮＩ 財布 メンズ 長財布",
            description: "一流の財布職人が作る本革長財布。YKKファスナー、スキミング防止機能付きで安心・安全",
            price: "¥4,980",
            rating: 4.4,
            reviews: 456,
            image: "https://m.media-amazon.com/images/I/71smAZPqxUL._AC_SX679_.jpg",
            asin: "B0C7Q5QP6R",
            category: "財布",
            amazonUrl: "https://www.amazon.co.jp/dp/B0C7Q5QP6R/ref=nosim?tag=pachisondatin-22"
        }
    ],
    
    // ✂️ 身だしなみ
    grooming: [
        {
            title: "ヘインズ ボクサーパンツ 5枚組",
            description: "抗菌防臭機能付きで清潔をキープ。前開き仕様で使いやすく、5枚セットでお得",
            price: "¥2,530",
            rating: 4.3,
            reviews: 2567,
            image: "https://m.media-amazon.com/images/I/61Dmanr+e7L._AC_SX569_.jpg",
            asin: "B0897Y2HQ4",
            category: "下着",
            amazonUrl: "https://www.amazon.co.jp/dp/B0897Y2HQ4/ref=nosim?tag=pachisondatin-22"
        },
        {
            title: "フィリップス 電気シェーバー 5000シリーズ",
            description: "快適な深剃りを実現する回転式シェーバー。肌にやさしく、毎日の身だしなみを格上げ",
            price: "¥13,200",
            rating: 4.2,
            reviews: 1456,
            image: "https://m.media-amazon.com/images/I/7106+xeoWqL._AC_SX679_.jpg",
            asin: "B09TPSTJLV",
            category: "シェーバー",
            amazonUrl: "https://www.amazon.co.jp/dp/B09TPSTJLV/ref=nosim?tag=pachisondatin-22"
        },
        {
            title: "パナソニック エチケットカッター 鼻毛カッター",
            description: "見えない部分のケアも完璧に。コンパクトで持ち運びしやすく、清潔感のある大人の必需品",
            price: "¥1,480",
            rating: 4.1,
            reviews: 892,
            image: "https://m.media-amazon.com/images/I/6165mmE3gJL._AC_SX679_.jpg",
            asin: "B0CY3QC19Q",
            category: "エチケット",
            amazonUrl: "https://www.amazon.co.jp/dp/B0CY3QC19Q/ref=nosim?tag=pachisondatin-22"
        }
    ],
    
    // 💪 フィットネス
    fitness: [
        {
            title: "青汁 大麦若葉 国産野菜 44包",
            description: "国産大麦若葉使用の健康青汁。野菜不足を手軽に解消し、健康意識の高い大人の印象をアップ",
            price: "¥1,126",
            rating: 4.2,
            reviews: 1456,
            image: "https://m.media-amazon.com/images/I/81QFwMaWVVL._AC_SX679_PIbundle-44,TopRight,0,0_SH20_.jpg",
            asin: "B088CC1H15",
            category: "健康食品",
            amazonUrl: "https://www.amazon.co.jp/dp/B088CC1H15/ref=nosim?tag=pachisondatin-22"
        },
        {
            title: "マルチビタミン&ミネラル サプリメント",
            description: "忙しいビジネスマンの栄養バランスをサポート。疲労回復・免疫力向上で体調管理を完璧に",
            price: "¥778",
            rating: 4.3,
            reviews: 967,
            image: "https://m.media-amazon.com/images/I/81Pun0gDirL._AC_SY879_.jpg",
            asin: "B088RN1K1Q",
            category: "サプリメント",
            amazonUrl: "https://www.amazon.co.jp/dp/B088RN1K1Q/ref=nosim?tag=pachisondatin-22"
        },
        {
            title: "亜鉛サプリメント 男性向け 90粒",
            description: "男性の活力をサポートする亜鉛サプリ。精力維持・疲労回復で40-50代の体調管理に最適",
            price: "¥1,922",
            rating: 4.1,
            reviews: 743,
            image: "https://m.media-amazon.com/images/I/51h8vpalxAL._AC_SX679_.jpg",
            asin: "B00516RUX8",
            category: "サプリメント",
            amazonUrl: "https://www.amazon.co.jp/dp/B00516RUX8/ref=nosim?tag=pachisondatin-22"
        },
        {
            title: "DHA EPA オメガ3 フィッシュオイル",
            description: "血液サラサラ・脳の健康をサポート。生活習慣病予防で長期的な健康維持を目指す大人のサプリ",
            price: "¥904",
            rating: 4.4,
            reviews: 1234,
            image: "https://m.media-amazon.com/images/I/71GhF6wMUmL._AC_SY879_.jpg",
            asin: "B0015ESYC6",
            category: "サプリメント",
            amazonUrl: "https://www.amazon.co.jp/dp/B0015ESYC6/ref=nosim?tag=pachisondatin-22"
        },
        {
            title: "マッサージガン 筋膜リリース 静音",
            description: "疲労回復・肩こり解消に最適なマッサージガン。40-50代の体メンテナンスで若々しい体調をキープ",
            price: "¥6,999",
            rating: 4.4,
            reviews: 1892,
            image: "https://m.media-amazon.com/images/I/71w44xx-lNL._AC_SY450_.jpg",
            asin: "B093B4TSPM",
            category: "フィットネス器具",
            amazonUrl: "https://www.amazon.co.jp/dp/B093B4TSPM/ref=nosim?tag=pachisondatin-22"
        }
    ],
    
    // 📚 趣味・教養
    hobby: [
        {
            title: "全自動エスプレッソマシン デロンギ",
            description: "本格イタリアンエスプレッソを自宅で。最高級の大人の嗜みで、究極のライフスタイルを演出",
            price: "¥69,800",
            rating: 4.5,
            reviews: 234,
            image: "https://m.media-amazon.com/images/I/518ApUrwkqL._AC_SY879_.jpg",
            asin: "B088HJCVDX",
            category: "コーヒー",
            amazonUrl: "https://www.amazon.co.jp/dp/B088HJCVDX/ref=nosim?tag=pachisondatin-22"
        }
    ],
    
    // 📱 ガジェット
    gadget: [
        {
            title: "スマートウォッチ メンズ 多機能",
            description: "最新テクノロジーで先進性をアピール。健康管理・通知機能で知的な男性を演出",
            price: "¥6,580",
            rating: 4.3,
            reviews: 1892,
            image: "https://m.media-amazon.com/images/I/61gMFKB+KNL._AC_SX679_.jpg",
            asin: "B0CVX92HMN",
            category: "スマートウォッチ",
            amazonUrl: "https://www.amazon.co.jp/dp/B0CVX92HMN/ref=nosim?tag=pachisondatin-22"
        },
        {
            title: "ワイヤレスイヤホン ノイズキャンセリング",
            description: "高音質とノイズキャンセリング機能で集中力UP。通勤・テレワークに最適な現代必須アイテム",
            price: "¥6,890",
            rating: 4.4,
            reviews: 2134,
            image: "https://m.media-amazon.com/images/I/41KRe-YdH1L._AC_SX679_.jpg",
            asin: "B09GK8FS94",
            category: "イヤホン",
            amazonUrl: "https://www.amazon.co.jp/dp/B09GK8FS94/ref=nosim?tag=pachisondatin-22"
        },
        {
            title: "NANAMIワイヤレス急速充電器 20W出力",
            description: "Android端末対応のワイヤレス急速充電器。置くだけで充電できる先進性で、デスク周りをスマートに演出。PSE認証済みで安全性も確保",
            price: "¥2,990",
            rating: 4.5,
            reviews: 2456,
            image: "https://m.media-amazon.com/images/I/61OnmgIgitL._AC_SY450_.jpg",
            asin: "B07S2WT1ZP",
            category: "充電器",
            amazonUrl: "https://www.amazon.co.jp/dp/B07S2WT1ZP/ref=nosim?tag=pachisondatin-22"
        }
    ]
};

// Populate categories with product data
function initializeCategories() {
    categories[0].products = PRODUCT_DATABASE.fitness;
    categories[1].products = PRODUCT_DATABASE.skincare;
    categories[2].products = PRODUCT_DATABASE.fragrance;
    categories[3].products = PRODUCT_DATABASE.accessories;
    categories[4].products = PRODUCT_DATABASE.grooming;
    categories[5].products = PRODUCT_DATABASE.gadget;
    categories[6].products = PRODUCT_DATABASE.hobby;
    categories[7].products = PRODUCT_DATABASE.fashion;
    
    console.log('✅ Categories initialized with product data');
}

// Initialize categories immediately
initializeCategories();

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

    // Set up event listeners
    setupEventListeners();
    
    // Update character count (only on main page)
    if (inputText && charCount) {
        updateCharCount();
    }
    
    // Display recommended products immediately on page load (permanent section)
    displayPermanentRecommendedProducts();
}

function setupEventListeners() {
    // Input text area events (only on main page)
    if (inputText) {
        inputText.addEventListener('input', handleInputChange);
        inputText.addEventListener('paste', handlePaste);
    }
    
    // Improve button click (only on main page)
    if (improveBtn) {
        console.log('🔧 Setting up improve button listener');
        improveBtn.addEventListener('click', function(event) {
            console.log('🖱️ Improve button clicked!', event);
            handleImproveClick();
        });
    }
    
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
    if (!inputText || !charCount) return;
    
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
        
        // 統計データを記録 (改善機能)
        trackUsageStats(text, improvements, true, 'improvement');
        
        // Don't display additional recommendations after improvement - use permanent sidebar
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Improvement failed:', error);
        
        // エラーも統計データに記録 (改善機能)
        trackUsageStats(text, [], false, 'improvement');
        
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
        
        const response = await fetch('/.netlify/functions/improve-text', {
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
    // Wait for DOM to be fully ready
    setTimeout(() => {
        console.log('🎯 Setting up sidebar...');
        
        // Display all products directly (no categories)
        showAllSidebarProducts();
    }, 100);
}

// New function to show category-based carousels
function showAllSidebarProducts() {
    console.log('🛍️ Loading category carousels...');
    
    const productsContainer = document.getElementById('sidebarProducts');
    
    if (!productsContainer) {
        console.error('❌ Products container not found!');
        return;
    }

    // Clear existing content
    productsContainer.innerHTML = '';
    
    // Use global categories (already initialized with product data)
    
    categories.forEach((category, categoryIndex) => {
        if (category.products.length > 0) {
            const carouselSection = createCategoryCarousel(category, categoryIndex);
            productsContainer.appendChild(carouselSection);
        }
    });
}

// Create category carousel section
function createCategoryCarousel(category, categoryIndex) {
    const section = document.createElement('div');
    section.className = 'category-carousel-section';
    section.setAttribute('data-category', category.key);
    
    section.innerHTML = `
        <div class="category-carousel-header">
            <h4 class="category-title">${category.title}</h4>
        </div>
        <div class="category-carousel-container">
            <div class="category-carousel-track" data-category="${category.key}">
                <!-- Products will be added here -->
            </div>
            <div class="carousel-nav-area carousel-nav-left" data-category="${category.key}" data-direction="prev">
                <div class="carousel-nav-icon">‹</div>
            </div>
            <div class="carousel-nav-area carousel-nav-right" data-category="${category.key}" data-direction="next">
                <div class="carousel-nav-icon">›</div>
            </div>
        </div>
        <div class="carousel-indicators" data-category="${category.key}">
            <!-- Indicators will be added here -->
        </div>
    `;
    
    // Add products to carousel
    const track = section.querySelector('.category-carousel-track');
    const indicators = section.querySelector('.carousel-indicators');
    
    category.products.forEach((product, index) => {
        // Create product card
        const productCard = createCompactCarouselCard(product);
        productCard.style.display = index === 0 ? 'block' : 'none';
        track.appendChild(productCard);
        
        // Create indicator
        const indicator = document.createElement('span');
        indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
        indicator.setAttribute('data-index', index);
        indicator.setAttribute('data-category', category.key);
        indicators.appendChild(indicator);
    });
    
    // Initialize carousel functionality
    setTimeout(() => {
        initializeCarousel(category.key, category.products.length);
    }, 100);
    
    return section;
}

// Create compact carousel product card  
function createCompactCarouselCard(product) {
    const card = document.createElement('div');
    card.className = 'carousel-product-card';
    
    // Use pre-configured Amazon URLs from Android app data (with proper associate tag)
    const amazonUrl = product.amazonUrl || `https://www.amazon.co.jp/dp/${product.asin}?tag=${AMAZON_ASSOCIATE_TAG}`;
    const stars = '★'.repeat(Math.floor(product.rating));
    const emptyStars = '☆'.repeat(5 - Math.floor(product.rating));
    
    card.innerHTML = `
        <div class="carousel-product-image">
            <img src="${product.image}" alt="${product.title}" loading="lazy">
            <div class="category-badge">${product.category}</div>
        </div>
        <div class="carousel-product-info">
            <div class="carousel-product-title">${product.title}</div>
            <div class="carousel-product-description">${product.description}</div>
            <div class="carousel-product-footer">
                <div class="carousel-product-rating">
                    <span class="stars">${stars}${emptyStars}</span>
                    <span class="rating-number">${product.rating}</span>
                    <span class="review-count">(${product.reviews})</span>
                </div>
                <div class="carousel-product-price">${product.price}</div>
            </div>
        </div>
    `;
    
    // Add click event to the entire card
    card.addEventListener('click', () => {
        window.open(amazonUrl, '_blank', 'noopener');
    });
    
    return card;
}

// Carousel management
const carouselStates = {};

// Initialize carousel functionality
function initializeCarousel(categoryKey, productCount) {
    if (productCount <= 1) return; // No need for carousel with single product
    
    // Initialize state
    carouselStates[categoryKey] = {
        currentIndex: 0,
        productCount: productCount,
        autoSlideInterval: null,
        isHovered: false
    };
    
    // Set up event listeners
    setupCarouselEventListeners(categoryKey);
    
    // Start auto-slide
    startAutoSlide(categoryKey);
}

// Set up carousel event listeners
function setupCarouselEventListeners(categoryKey) {
    const section = document.querySelector(`.category-carousel-section[data-category="${categoryKey}"]`);
    if (!section) return;
    
    // Large navigation areas
    const navAreas = section.querySelectorAll('.carousel-nav-area');
    navAreas.forEach(navArea => {
        const direction = navArea.getAttribute('data-direction');
        
        navArea.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click
            navigateCarousel(categoryKey, direction);
        });
    });
    
    // Indicator clicks
    const indicators = section.querySelectorAll('.carousel-indicator');
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            navigateCarousel(categoryKey, index);
        });
    });
    
    // Hover to pause auto-slide (only on product content, not nav areas)
    const track = section.querySelector('.category-carousel-track');
    track.addEventListener('mouseenter', () => {
        carouselStates[categoryKey].isHovered = true;
        stopAutoSlide(categoryKey);
    });
    
    track.addEventListener('mouseleave', () => {
        carouselStates[categoryKey].isHovered = false;
        startAutoSlide(categoryKey);
    });
}

// Navigate carousel
function navigateCarousel(categoryKey, direction) {
    const state = carouselStates[categoryKey];
    if (!state) return;
    
    let newIndex;
    
    if (direction === 'prev') {
        newIndex = state.currentIndex === 0 ? state.productCount - 1 : state.currentIndex - 1;
    } else if (direction === 'next') {
        newIndex = state.currentIndex === state.productCount - 1 ? 0 : state.currentIndex + 1;
    } else {
        newIndex = direction; // Direct index
    }
    
    showCarouselSlide(categoryKey, newIndex);
}

// Show specific carousel slide
function showCarouselSlide(categoryKey, index) {
    const state = carouselStates[categoryKey];
    if (!state || index === state.currentIndex) return;
    
    const section = document.querySelector(`.category-carousel-section[data-category="${categoryKey}"]`);
    if (!section) return;
    
    const track = section.querySelector('.category-carousel-track');
    const indicators = section.querySelectorAll('.carousel-indicator');
    const cards = track.querySelectorAll('.carousel-product-card');
    
    // Hide current card
    if (cards[state.currentIndex]) {
        cards[state.currentIndex].style.display = 'none';
    }
    
    // Show new card with fade effect
    if (cards[index]) {
        cards[index].style.display = 'block';
        cards[index].style.opacity = '0';
        cards[index].style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            cards[index].style.transition = 'all 0.3s ease';
            cards[index].style.opacity = '1';
            cards[index].style.transform = 'translateX(0)';
        }, 10);
    }
    
    // Update indicators
    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });
    
    // Update state
    state.currentIndex = index;
}

// Start auto-slide
function startAutoSlide(categoryKey) {
    const state = carouselStates[categoryKey];
    if (!state || state.isHovered || state.productCount <= 1) return;
    
    stopAutoSlide(categoryKey); // Clear any existing interval
    
    state.autoSlideInterval = setInterval(() => {
        if (!state.isHovered) {
            navigateCarousel(categoryKey, 'next');
        }
    }, 8000); // 8 seconds
}

// Stop auto-slide
function stopAutoSlide(categoryKey) {
    const state = carouselStates[categoryKey];
    if (state && state.autoSlideInterval) {
        clearInterval(state.autoSlideInterval);
        state.autoSlideInterval = null;
    }
}

// Enhanced product card creation function
function createEnhancedProductCard(product) {
    const card = document.createElement('div');
    card.className = 'enhanced-product-card';
    
    const amazonUrl = `https://www.amazon.co.jp/dp/${product.asin}?tag=${AMAZON_ASSOCIATE_TAG}`;
    const stars = '★'.repeat(Math.floor(product.rating));
    const emptyStars = '☆'.repeat(5 - Math.floor(product.rating));
    
    card.innerHTML = `
        <div class="enhanced-product-image">
            <img src="${product.image}" alt="${product.title}" loading="lazy">
            <div class="category-badge">${product.category}</div>
        </div>
        <div class="enhanced-product-info">
            <div class="enhanced-product-title">${product.title}</div>
            <div class="enhanced-product-description">${product.description}</div>
            <div class="enhanced-product-footer">
                <div class="enhanced-product-rating">
                    <span class="stars">${stars}${emptyStars}</span>
                    <span class="rating-number">${product.rating}</span>
                    <span class="review-count">(${product.reviews})</span>
                </div>
                <div class="enhanced-product-price">${product.price}</div>
            </div>
        </div>
    `;
    
    // Add click event to the entire card
    card.addEventListener('click', () => {
        window.open(amazonUrl, '_blank', 'noopener');
    });
    
    return card;
}

function showSidebarProducts(category) {
    console.log('🛍️ Loading products for category:', category);
    
    const productsContainer = document.getElementById('sidebarProducts');
    const categoryTitle = document.getElementById('sidebarCategoryTitle');
    
    console.log('📦 Containers found:', {
        productsContainer: !!productsContainer,
        categoryTitle: !!categoryTitle
    });
    
    if (!productsContainer || !categoryTitle) {
        console.error('❌ Required containers not found!');
        return;
    }
    
    // Update category title (Android版統合カテゴリに対応) - フィットネス優先
    const categoryTitles = {
        'fitness': '💪 フィットネス',
        'skincare': '🧴 スキンケア',
        'fragrance': '🌸 香水・フレグランス', 
        'accessories': '⌚ アクセサリー',
        'grooming': '✂️ 身だしなみ',
        'gadget': '📱ガジェット',  
        'hobby': '📚 趣味・教養',
        'fashion': '👔 ファッション'
    };
    
    categoryTitle.textContent = categoryTitles[category] || category;
    
    // Clear container
    productsContainer.innerHTML = '';
    
    // Get products for category
    const products = PRODUCT_DATABASE[category] || [];
    console.log('🏪 Products found for', category, ':', products.length);
    
    if (products.length === 0) {
        console.error('❌ No products found for category:', category);
        return;
    }
    
    // Add products with animation
    products.forEach((product, index) => {
        console.log('📱 Creating card for:', product.title);
        const productCard = createSidebarProductCard(product);
        productCard.style.opacity = '0';
        productCard.style.transform = 'translateY(10px)';
        
        productsContainer.appendChild(productCard);
        
        // Animate in
        setTimeout(() => {
            productCard.style.transition = 'all 0.3s ease';
            productCard.style.opacity = '1';
            productCard.style.transform = 'translateY(0)';
        }, index * 150);
    });
    
    console.log('✅ Products loaded successfully');
}

function createSidebarProductCard(product) {
    const card = document.createElement('div');
    card.className = 'sidebar-product-card';
    
    // Use pre-configured Amazon URLs from Android app data (with proper associate tag)
    const amazonUrl = product.amazonUrl || `https://www.amazon.co.jp/dp/${product.asin}?tag=${AMAZON_ASSOCIATE_TAG}`;
    const stars = '★'.repeat(Math.floor(product.rating));
    
    card.innerHTML = `
        <div class="sidebar-product-image">
            <img src="${product.image}" alt="${product.title}" loading="lazy">
        </div>
        <div class="sidebar-product-info">
            <div class="sidebar-product-title">${product.title}</div>
            <div class="sidebar-product-price">${product.price}</div>
            <div class="sidebar-product-rating">
                <span class="stars">${stars}</span>
                <span>${product.rating}</span>
            </div>
        </div>
    `;
    
    // Add click handler to open Amazon link
    card.addEventListener('click', () => {
        window.open(amazonUrl, '_blank', 'noopener');
    });
    
    return card;
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
    
    // Update category title (Android版統合カテゴリに対応) - フィットネス優先
    const categoryTitles = {
        'fitness': '💪 フィットネス',
        'skincare': '🧴 スキンケア',
        'fragrance': '🌸 香水・フレグランス', 
        'accessories': '⌚ アクセサリー',
        'grooming': '✂️ 身だしなみ',
        'gadget': '📱 ガジェット',
        'hobby': '📚 趣味・教養',
        'fashion': '👔 ファッション'
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
    // Select 3 products from different categories (Android統合版から) - フィットネス優先
    const availableCategories = ['fitness', 'skincare', 'fragrance', 'accessories', 'grooming', 'gadget', 'hobby', 'fashion'];
    const selectedProducts = [];
    
    // ランダムに3つの異なるカテゴリから商品を選択
    const shuffledCategories = availableCategories.sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < Math.min(3, shuffledCategories.length); i++) {
        const category = shuffledCategories[i];
        const categoryProducts = PRODUCT_DATABASE[category];
        if (categoryProducts && categoryProducts.length > 0) {
            const randomProduct = categoryProducts[Math.floor(Math.random() * categoryProducts.length)];
            selectedProducts.push(randomProduct);
        }
    }
    
    return selectedProducts;
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Use pre-configured Amazon URLs from Android app data (with proper associate tag)
    const amazonUrl = product.amazonUrl || `https://www.amazon.co.jp/dp/${product.asin}?tag=${AMAZON_ASSOCIATE_TAG}`;
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
    
    // Use pre-configured Amazon URLs from Android app data (with proper associate tag)
    const amazonUrl = product.amazonUrl || `https://www.amazon.co.jp/dp/${product.asin}?tag=${AMAZON_ASSOCIATE_TAG}`;
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

// 全体統計データ追跡システム
async function trackUsageStats(inputText, improvements, success, type = 'improvement') {
    try {
        // サーバーに統計データを送信
        const response = await fetch('/.netlify/functions/track-stats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'track',
                data: {
                    success: success,
                    type: type,
                    improvementCount: improvements.length,
                    timestamp: new Date().toISOString()
                }
            })
        });

        if (response.ok) {
            console.log('📊 全体統計データ記録完了');
        } else {
            console.error('統計データ送信失敗:', response.status);
        }
        
    } catch (error) {
        console.error('統計データ記録エラー:', error);
        // エラーが発生してもメイン機能は継続
    }
}

// PWA Update notification
