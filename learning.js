// *** LEARNING PAGE v1.0 - 2025-01-21 ***
console.log('📚 LEARNING.JS VERSION 1.0 LOADED - Comprehensive Dating Guide');

// 恋愛・会話術コンテンツデータベース
const LEARNING_DATABASE = {
    'first-contact': [
        {
            id: 'first-message-basics',
            title: '初回メッセージの黄金法則',
            category: 'first-contact',
            difficulty: 'beginner',
            tags: ['初回', 'マッチングアプリ', '基本'],
            summary: 'マッチング直後の最初のメッセージで好印象を与える確実な方法',
            content: `
                <h4>🎯 40-50代男性の初回メッセージ戦略</h4>
                <div class="technique-points">
                    <div class="point-item">
                        <h5>1. プロフィールを必ず読んで言及する</h5>
                        <p class="good-example">✅ 良い例：「○○さんも映画がお好きなんですね。最近観た作品で印象的だったものはありますか？」</p>
                        <p class="bad-example">❌ 悪い例：「はじめまして！よろしくお願いします！」</p>
                    </div>
                    <div class="point-item">
                        <h5>2. 共通点を見つけて自然に触れる</h5>
                        <p>年代が近いことで生まれる「あの頃」の共通体験を活用しましょう。</p>
                        <p class="good-example">✅ 「私も同じ世代なので、○○さんの趣味に共感します」</p>
                    </div>
                    <div class="point-item">
                        <h5>3. 質問は1つに絞る</h5>
                        <p>質問攻めは避け、答えやすい質問を1つだけ。相手のペースを大切に。</p>
                    </div>
                </div>
                <div class="pro-advice">
                    <h5>💡 プロのアドバイス</h5>
                    <p>40-50代の魅力は「落ち着き」と「配慮」。焦らず、相手を思いやる姿勢を大切にしましょう。</p>
                </div>
            `
        },
        {
            id: 'profile-mention-techniques',
            title: 'プロフィール言及テクニック',
            category: 'first-contact',
            difficulty: 'intermediate',
            tags: ['プロフィール', '共通点', 'テクニック'],
            summary: '相手のプロフィールから自然に話題を広げる高等テクニック',
            content: `
                <h4>🎯 プロフィール活用の極意</h4>
                <div class="technique-points">
                    <div class="point-item">
                        <h5>1. 趣味から仕事への自然な流れ</h5>
                        <p class="example">「写真を拝見して、カメラがご趣味なんですね。お仕事でも活かされることがあるんでしょうか？」</p>
                    </div>
                    <div class="point-item">
                        <h5>2. 経験の深さを感じさせる質問</h5>
                        <p class="example">「お料理をされるんですね。何年くらい続けてらっしゃるんですか？私も最近始めたんですが、コツがあれば教えていただきたいです。」</p>
                    </div>
                    <div class="point-item">
                        <h5>3. 場所・地域の話題活用</h5>
                        <p class="example">「○○にお住まいなんですね。あの辺りは落ち着いた雰囲気で素敵な場所ですよね。おすすめのお店などありますか？」</p>
                    </div>
                </div>
            `
        }
    ],
    'conversation': [
        {
            id: 'line-continuation-mastery',
            title: 'LINE会話継続の極意',
            category: 'conversation',
            difficulty: 'intermediate',
            tags: ['LINE', '会話継続', '返信'],
            summary: 'LINEでの自然な会話継続と相手を飽きさせない会話術',
            content: `
                <h4>📱 LINEマスタープラン</h4>
                <div class="technique-points">
                    <div class="point-item">
                        <h5>1. 返信タイミングの黄金比</h5>
                        <p><strong>相手の2-3倍の時間</strong>を空けて返信。即レスは避けて「余裕のある大人」を演出。</p>
                        <ul>
                            <li>相手が30分後返信 → あなたは1-2時間後</li>
                            <li>相手が夜遅い → 翌朝または日中に</li>
                            <li>絶対に避ける：即レス、夜中の返信</li>
                        </ul>
                    </div>
                    <div class="point-item">
                        <h5>2. 話題転換の自然な流れ</h5>
                        <p class="example">「そういえば、今日は暖かくて散歩日和でしたね。○○さんはお休みの日はどのように過ごされますか？」</p>
                    </div>
                    <div class="point-item">
                        <h5>3. 写真・画像の効果的活用</h5>
                        <p>食事写真、風景写真で自然に話題提供。ただし自撮りは厳禁。</p>
                    </div>
                </div>
            `
        },
        {
            id: 'conversation-depth-techniques',
            title: '会話を深める質問術',
            category: 'conversation',
            difficulty: 'advanced',
            tags: ['質問術', '深い会話', '心理学'],
            summary: '表面的な会話から一歩踏み込んだ、相手の心に残る会話テクニック',
            content: `
                <h4>🧠 心理学を活用した会話術</h4>
                <div class="technique-points">
                    <div class="point-item">
                        <h5>1. 感情に焦点を当てた質問</h5>
                        <p class="example">❌「どこに行きましたか？」</p>
                        <p class="example">✅「その時どんな気持ちでしたか？」</p>
                    </div>
                    <div class="point-item">
                        <h5>2. 価値観を探る質問</h5>
                        <p class="example">「○○さんにとって、理想的な休日とはどんな感じですか？」</p>
                    </div>
                    <div class="point-item">
                        <h5>3. 共感と理解を示す返答</h5>
                        <p>「そういう考え方、とても素敵ですね。私も似たような経験があります...」</p>
                    </div>
                </div>
            `
        }
    ],
    'date-invitation': [
        {
            id: 'natural-date-invitation',
            title: '自然なデート誘い方の極意',
            category: 'date-invitation',
            difficulty: 'intermediate',
            tags: ['デート誘い', 'タイミング', '成功率'],
            summary: '断られにくい、自然で魅力的なデート誘い方のテクニック集',
            content: `
                <h4>💕 デート誘い成功の法則</h4>
                <div class="technique-points">
                    <div class="point-item">
                        <h5>1. 話題の流れから自然に誘う</h5>
                        <p class="example">「○○のお話、とても興味深いですね。今度お時間があるときに、もっと詳しくお聞かせいただけませんか？美味しいコーヒーでも飲みながら。」</p>
                    </div>
                    <div class="point-item">
                        <h5>2. 具体的すぎない提案</h5>
                        <p class="good-example">✅「今度お食事でもいかがですか？」</p>
                        <p class="bad-example">❌「来週の土曜日19時に○○店で」（プレッシャーが強い）</p>
                    </div>
                    <div class="point-item">
                        <h5>3. 40-50代ならではの誘い方</h5>
                        <p class="example">「お疲れ様です。いつもお忙しそうですが、たまにはゆっくりお食事でもいかがですか？」</p>
                        <p>大人の余裕と思いやりを感じさせる言葉選びが重要。</p>
                    </div>
                </div>
                <div class="pro-advice">
                    <h5>💡 断られた時の対応</h5>
                    <p>「承知いたしました。また機会があればお声かけさせていただきますね。」</p>
                    <p>潔く、紳士的に。これが大人の男性の魅力です。</p>
                </div>
            `
        },
        {
            id: 'timing-psychology',
            title: 'デート誘いのベストタイミング',
            category: 'date-invitation',
            difficulty: 'advanced',
            tags: ['タイミング', '心理学', '成功率'],
            summary: '心理学に基づいた、最も成功率の高いデート誘いのタイミング',
            content: `
                <h4>⏰ タイミング戦略の科学</h4>
                <div class="technique-points">
                    <div class="point-item">
                        <h5>1. やり取り回数の黄金比</h5>
                        <p><strong>7-10回程度</strong>のやり取り後が最適。</p>
                        <ul>
                            <li>早すぎ（1-3回）：軽い人と思われるリスク</li>
                            <li>遅すぎ（20回以上）：友達関係に固定化</li>
                        </ul>
                    </div>
                    <div class="point-item">
                        <h5>2. 曜日・時間帯の戦略</h5>
                        <p><strong>火曜日-木曜日の午後</strong>が統計的に成功率が高い</p>
                        <p>理由：週末の予定を考え始める時期で、前向きな気持ちになりやすい</p>
                    </div>
                    <div class="point-item">
                        <h5>3. 相手の状況を読む</h5>
                        <p>疲れている日や忙しい時期は避ける。相手のペースに合わせる配慮が大切。</p>
                    </div>
                </div>
            `
        }
    ],
    'date-success': [
        {
            id: 'first-date-success',
            title: '初デート成功の完全マニュアル',
            category: 'date-success',
            difficulty: 'intermediate',
            tags: ['初デート', '成功', '準備'],
            summary: '初デートを成功させるための準備から当日まで完全攻略法',
            content: `
                <h4>🍽️ 初デート完全攻略</h4>
                <div class="technique-points">
                    <div class="point-item">
                        <h5>1. 場所選びの黄金ルール</h5>
                        <ul>
                            <li><strong>ホテルのラウンジ・カフェ</strong>：上品で落ち着いた雰囲気</li>
                            <li><strong>老舗の喫茶店</strong>：40-50代の大人な魅力をアピール</li>
                            <li><strong>避けるべき</strong>：ファミレス、騒がしい店、高すぎる店</li>
                        </ul>
                    </div>
                    <div class="point-item">
                        <h5>2. 服装・身だしなみのポイント</h5>
                        <p><strong>清潔感が最重要</strong>。ブランド品より手入れが行き届いているかが勝負。</p>
                        <ul>
                            <li>襟付きシャツ（アイロン必須）</li>
                            <li>きれいな靴（女性はよく見ています）</li>
                            <li>適度な香水（つけすぎ厳禁）</li>
                        </ul>
                    </div>
                    <div class="point-item">
                        <h5>3. 会話の準備</h5>
                        <p>事前に3-4つの話題を準備。相手のプロフィールから関連する質問も用意。</p>
                    </div>
                </div>
                <div class="pro-advice">
                    <h5>💡 支払いのスマートな方法</h5>
                    <p>「ご馳走させてください」と自然に。割り勘提案は避け、大人の男性らしさを見せる。</p>
                </div>
            `
        },
        {
            id: 'conversation-flow-date',
            title: 'デート中の会話術・話題選び',
            category: 'date-success',
            difficulty: 'advanced',
            tags: ['デート会話', '話題', 'コミュニケーション'],
            summary: 'デート中に途切れない自然な会話と、相手を楽しませる話題選び',
            content: `
                <h4>🗣️ デート会話マスタリー</h4>
                <div class="technique-points">
                    <div class="point-item">
                        <h5>1. 40-50代ならではの話題</h5>
                        <ul>
                            <li><strong>人生経験談</strong>：「私が20代の頃は...」（説教臭くならないよう注意）</li>
                            <li><strong>趣味の深い話</strong>：長年続けている趣味の魅力</li>
                            <li><strong>旅行・食事</strong>：大人になって楽しめるようになったもの</li>
                        </ul>
                    </div>
                    <div class="point-item">
                        <h5>2. 避けるべき話題</h5>
                        <ul>
                            <li>❌ 過去の恋愛関係・結婚歴</li>
                            <li>❌ 仕事の愚痴・不満</li>
                            <li>❌ 政治・宗教</li>
                            <li>❌ お金の話（年収自慢など）</li>
                        </ul>
                    </div>
                    <div class="point-item">
                        <h5>3. 沈黙を恐れない</h5>
                        <p>大人の会話では適度な沈黙も魅力。無理に話し続けず、相手のペースを大切に。</p>
                    </div>
                </div>
            `
        }
    ],
    'profile-photo': [
        {
            id: 'profile-writing-mastery',
            title: '魅力的なプロフィール文章術',
            category: 'profile-photo',
            difficulty: 'intermediate',
            tags: ['プロフィール', '自己紹介', 'マッチング率'],
            summary: '40-50代男性の魅力を最大限に引き出すプロフィール作成術',
            content: `
                <h4>📝 プロフィール作成の極意</h4>
                <div class="technique-points">
                    <div class="point-item">
                        <h5>1. 年齢をポジティブに表現</h5>
                        <p class="good-example">✅「人生経験を重ねて、今が一番充実しています」</p>
                        <p class="bad-example">❌「もう若くありませんが...」</p>
                    </div>
                    <div class="point-item">
                        <h5>2. 具体性のある趣味紹介</h5>
                        <p class="example">「週末は美術館巡りを楽しんでいます。特に印象派の絵画が好きで、モネの『睡蓮』シリーズには何度見ても感動します。」</p>
                    </div>
                    <div class="point-item">
                        <h5>3. 相手への配慮を示す</h5>
                        <p class="example">「お互いのペースを大切にしながら、素敵な時間を共有できればと思います。」</p>
                    </div>
                </div>
            `
        },
        {
            id: 'photo-selection-guide',
            title: '写真選びの戦略ガイド',
            category: 'profile-photo',
            difficulty: 'beginner',
            tags: ['写真', 'プロフィール写真', '印象'],
            summary: 'マッチング率を上げる写真選びと撮影のコツ',
            content: `
                <h4>📷 写真戦略の基本</h4>
                <div class="technique-points">
                    <div class="point-item">
                        <h5>1. メイン写真の鉄則</h5>
                        <ul>
                            <li><strong>清潔感のある髪型・服装</strong></li>
                            <li><strong>自然な笑顔</strong>（作り笑いは避ける）</li>
                            <li><strong>適度な距離感</strong>（胸より上が映るように）</li>
                        </ul>
                    </div>
                    <div class="point-item">
                        <h5>2. サブ写真の構成</h5>
                        <p>2枚目：趣味を楽しんでいる様子</p>
                        <p>3枚目：日常の一コマ（食事、散歩など）</p>
                        <p>4枚目：全身が分かる写真</p>
                    </div>
                    <div class="point-item">
                        <h5>3. 避けるべき写真</h5>
                        <ul>
                            <li>❌ 自撮り（40-50代には不自然）</li>
                            <li>❌ 過度に加工された写真</li>
                            <li>❌ 他の人と一緒の写真</li>
                        </ul>
                    </div>
                </div>
            `
        }
    ],
    'psychology': [
        {
            id: 'attraction-psychology',
            title: '恋愛心理学の基礎知識',
            category: 'psychology',
            difficulty: 'advanced',
            tags: ['心理学', '恋愛', 'attraction'],
            summary: '科学的根拠に基づいた恋愛心理学と実践的な応用方法',
            content: `
                <h4>🧠 恋愛心理学の実践応用</h4>
                <div class="technique-points">
                    <div class="point-item">
                        <h5>1. ミラーリング効果</h5>
                        <p>相手の動作や話し方を自然に真似する。親近感が生まれやすくなります。</p>
                        <p class="example">相手がコーヒーを飲んだら、少し後に自分も飲む等</p>
                    </div>
                    <div class="point-item">
                        <h5>2. 希少性の原理</h5>
                        <p>「いつでも会える」より「たまに会える特別な人」の方が価値が高く感じられる。</p>
                        <p>適度な距離感を保つことで、あなたの価値が高まります。</p>
                    </div>
                    <div class="point-item">
                        <h5>3. 認知的不協和</h5>
                        <p>小さな頼みごとを聞いてもらうことで、相手の心理的距離が縮まります。</p>
                        <p class="example">「写真を撮っていただけますか？」→「ありがとうございます」</p>
                    </div>
                </div>
            `
        }
    ]
};

// アプリケーション状態
let currentFilter = 'all';
let searchQuery = '';

// 商品データベース（analysis.jsから流用）
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

const AMAZON_ASSOCIATE_TAG = 'pachisondatin-22';

// DOM要素
let learningGrid;
let searchInput;
let learningModal;
let modalTitle;
let modalBody;
let modalCloseBtn;

// アプリ初期化
document.addEventListener('DOMContentLoaded', () => {
    initializeLearningApp();
});

function initializeLearningApp() {
    console.log('📚 Initializing Learning App');
    
    // DOM要素取得
    learningGrid = document.getElementById('learningGrid');
    searchInput = document.getElementById('learningSearchInput');
    learningModal = document.getElementById('learningModal');
    modalTitle = document.getElementById('modalTitle');
    modalBody = document.getElementById('modalBody');
    modalCloseBtn = document.getElementById('modalCloseBtn');
    
    if (!learningGrid || !searchInput) {
        console.error('❌ Critical DOM elements missing');
        return;
    }
    
    // イベントリスナー設定
    setupEventListeners();
    
    // コンテンツ表示
    displayLearningContent();
    
    // サイドバー商品表示
    displaySidebarProducts();
    
    // 今日のヒント更新
    updateDailyTip();
}

function setupEventListeners() {
    // 検索機能
    searchInput.addEventListener('input', handleSearchInput);
    document.getElementById('searchBtn').addEventListener('click', handleSearchClick);
    
    // カテゴリフィルター
    const categoryBtns = document.querySelectorAll('.category-filter-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            handleCategoryFilter(filter, this);
        });
    });
    
    // クイックカテゴリ
    const quickBtns = document.querySelectorAll('.category-quick-btn');
    quickBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            handleQuickCategory(category);
        });
    });
    
    // モーダル関連
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }
    
    // Escキーでモーダル閉じる
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && learningModal.style.display === 'block') {
            closeModal();
        }
    });
    
    // モーダル背景クリックで閉じる
    if (learningModal) {
        learningModal.addEventListener('click', function(event) {
            if (event.target === learningModal) {
                closeModal();
            }
        });
    }
    
    // サイドバー商品カテゴリ
    setupSidebarCategories();
}

function handleSearchInput() {
    searchQuery = searchInput.value.toLowerCase();
    displayLearningContent();
}

function handleSearchClick() {
    displayLearningContent();
}

function handleCategoryFilter(filter, buttonElement) {
    currentFilter = filter;
    
    // アクティブボタン更新
    document.querySelectorAll('.category-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    buttonElement.classList.add('active');
    
    displayLearningContent();
}

function handleQuickCategory(category) {
    // クイックカテゴリに対応するフィルターを設定
    const categoryMap = {
        'first-message': 'first-contact',
        'date-invitation': 'date-invitation',
        'line-continue': 'conversation',
        'profile-writing': 'profile-photo'
    };
    
    const filter = categoryMap[category] || category;
    const targetBtn = document.querySelector(`[data-filter="${filter}"]`);
    
    if (targetBtn) {
        handleCategoryFilter(filter, targetBtn);
    }
}

function displayLearningContent() {
    if (!learningGrid) return;
    
    learningGrid.innerHTML = '';
    
    // すべてのコンテンツを取得
    let allContent = [];
    Object.keys(LEARNING_DATABASE).forEach(category => {
        LEARNING_DATABASE[category].forEach(item => {
            allContent.push(item);
        });
    });
    
    // フィルタリング
    let filteredContent = allContent;
    
    // カテゴリフィルター適用
    if (currentFilter !== 'all') {
        filteredContent = filteredContent.filter(item => item.category === currentFilter);
    }
    
    // 検索フィルター適用
    if (searchQuery) {
        filteredContent = filteredContent.filter(item => {
            return item.title.toLowerCase().includes(searchQuery) ||
                   item.summary.toLowerCase().includes(searchQuery) ||
                   item.tags.some(tag => tag.toLowerCase().includes(searchQuery));
        });
    }
    
    // コンテンツカード生成・表示
    filteredContent.forEach(item => {
        const card = createLearningCard(item);
        learningGrid.appendChild(card);
    });
    
    // 結果なしの場合
    if (filteredContent.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <div class="no-results-content">
                <h3>📝 該当する学習コンテンツが見つかりませんでした</h3>
                <p>別のキーワードで検索するか、カテゴリを変更してお試しください。</p>
                <button class="reset-btn" onclick="resetFilters()">すべて表示</button>
            </div>
        `;
        learningGrid.appendChild(noResults);
    }
}

function createLearningCard(item) {
    const card = document.createElement('div');
    card.className = 'learning-card';
    
    const difficultyColor = {
        'beginner': '#10b981',
        'intermediate': '#f59e0b', 
        'advanced': '#ef4444'
    };
    
    const difficultyText = {
        'beginner': '初級',
        'intermediate': '中級',
        'advanced': '上級'
    };
    
    card.innerHTML = `
        <div class="learning-card-header">
            <h3 class="learning-title">${item.title}</h3>
            <div class="learning-meta">
                <span class="difficulty-badge" style="background: ${difficultyColor[item.difficulty] || '#6b7280'}">
                    ${difficultyText[item.difficulty] || ''}
                </span>
            </div>
        </div>
        <div class="learning-summary">
            <p>${item.summary}</p>
        </div>
        <div class="learning-tags">
            ${item.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
        </div>
        <div class="learning-actions">
            <div class="expand-indicator">
                <span class="expand-text">📖 詳しく学ぶ</span>
                <span class="expand-icon">▼</span>
            </div>
        </div>
    `;
    
    // カード全体クリックで展開機能を追加
    card.addEventListener('click', (e) => {
        // 展開コンテンツ内のクリックは無視
        if (e.target.closest('.learning-expanded-content')) {
            return;
        }
        toggleLearningExpansion(card, item);
    });
    
    // ホバーエフェクト用のクラス追加
    card.classList.add('clickable-card');
    
    return card;
}

function toggleLearningExpansion(cardElement, item) {
    // 他の展開されているカードを閉じる
    const existingExpanded = document.querySelector('.learning-card.expanded');
    if (existingExpanded && existingExpanded !== cardElement) {
        closeLearningExpansion(existingExpanded);
    }
    
    // 既に展開されている場合は閉じる
    if (cardElement.classList.contains('expanded')) {
        closeLearningExpansion(cardElement);
        return;
    }
    
    // 展開コンテンツを作成
    const expandedContent = document.createElement('div');
    expandedContent.className = 'learning-expanded-content';
    expandedContent.innerHTML = `
        <div class="expanded-body">
            ${item.content}
        </div>
    `;
    
    // カードに展開コンテンツを追加
    cardElement.appendChild(expandedContent);
    cardElement.classList.add('expanded');
    
    // インジケーターテキストとアイコンを変更
    const expandText = cardElement.querySelector('.expand-text');
    const expandIcon = cardElement.querySelector('.expand-icon');
    if (expandText) expandText.textContent = '📖 閉じる';
    if (expandIcon) expandIcon.textContent = '▲';
    
    // スムーズにスクロール
    setTimeout(() => {
        expandedContent.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
    }, 100);
}

function closeLearningExpansion(cardElement) {
    const expandedContent = cardElement.querySelector('.learning-expanded-content');
    if (expandedContent) {
        expandedContent.remove();
    }
    cardElement.classList.remove('expanded');
    
    // インジケーターテキストとアイコンを元に戻す
    const expandText = cardElement.querySelector('.expand-text');
    const expandIcon = cardElement.querySelector('.expand-icon');
    if (expandText) expandText.textContent = '📖 詳しく学ぶ';
    if (expandIcon) expandIcon.textContent = '▼';
}

// 廃止されたモーダル関数（互換性のため残す）
function openLearningModal(itemId) {
    console.log('Modal function is deprecated, using expansion instead');
}

function closeModal() {
    // モーダルが残っていれば閉じる
    if (learningModal && learningModal.style.display === 'block') {
        learningModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function resetFilters() {
    currentFilter = 'all';
    searchQuery = '';
    searchInput.value = '';
    
    // アクティブボタンリセット
    document.querySelectorAll('.category-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('[data-filter="all"]').classList.add('active');
    
    displayLearningContent();
}

// サイドバー商品関連
function displaySidebarProducts() {
    setupSidebarCategories();
    showSidebarProducts('communication');
}

function setupSidebarCategories() {
    const categoryButtons = document.querySelectorAll('.sidebar-category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // アクティブ状態更新
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 商品表示
            showSidebarProducts(category);
        });
    });
}

function showSidebarProducts(category) {
    const productsContainer = document.getElementById('sidebarProducts');
    const categoryTitle = document.getElementById('sidebarCategoryTitle');
    
    if (!productsContainer || !categoryTitle) return;
    
    const categoryTitles = {
        'communication': '📚 コミュニケーション',
        'fashion': '👔 ファッション・身だしなみ', 
        'lifestyle': '🍷 ライフスタイル'
    };
    
    categoryTitle.textContent = categoryTitles[category] || category;
    productsContainer.innerHTML = '';
    
    const products = PRODUCT_DATABASE[category] || [];
    
    products.forEach((product, index) => {
        const productCard = createSidebarProductCard(product);
        productCard.style.opacity = '0';
        productCard.style.transform = 'translateY(10px)';
        
        productsContainer.appendChild(productCard);
        
        // アニメーション
        setTimeout(() => {
            productCard.style.transition = 'all 0.3s ease';
            productCard.style.opacity = '1';
            productCard.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

function createSidebarProductCard(product) {
    const card = document.createElement('div');
    card.className = 'sidebar-product-card';
    
    const amazonUrl = `https://www.amazon.co.jp/dp/${product.asin}?tag=${AMAZON_ASSOCIATE_TAG}`;
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
    
    card.addEventListener('click', () => {
        window.open(amazonUrl, '_blank', 'noopener');
    });
    
    return card;
}

function updateDailyTip() {
    const tips = [
        {
            title: "📍 40代男性の魅力アピール",
            text: "「仕事での経験」や「人生の深み」を自然に話題に。若い男性にはない大人の魅力を活かしましょう。"
        },
        {
            title: "💬 会話の間の取り方",
            text: "焦って話し続けるより、相手の話をじっくり聞く姿勢が40-50代男性には大切。「聞き上手」こそが最強の武器です。"
        },
        {
            title: "📱 LINEの返信タイミング",
            text: "即レスは避けて、相手の2-3倍の時間をかけて返信。「余裕のある大人」を演出することが重要です。"
        },
        {
            title: "🍽️ デート場所の選び方",
            text: "ファミレスより少し良いお店を。価格より「落ち着いて話せる環境」を重視すると、大人の魅力が伝わります。"
        }
    ];
    
    const today = new Date();
    const tipIndex = today.getDate() % tips.length;
    const todaysTip = tips[tipIndex];
    
    const tipElement = document.getElementById('dailyTip');
    if (tipElement) {
        tipElement.innerHTML = `
            <div class="tip-content">
                <p class="tip-title">${todaysTip.title}</p>
                <p class="tip-text">${todaysTip.text}</p>
            </div>
        `;
    }
}

// グローバル関数（HTMLから呼び出し用）
window.openLearningModal = openLearningModal;
window.closeModal = closeModal;
window.resetFilters = resetFilters;