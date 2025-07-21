# 脱おじ構文AI - PWA Website

おじさん構文を品格ある文章に改善するAIツールのPWA（Progressive Web App）版です。

## 🌟 特徴

- **💻 PWA対応**: インストール可能でオフラインでも基本機能が利用可能
- **📱 レスポンシブデザイン**: スマートフォン・タブレット・PC対応
- **🤖 AI改善エンジン**: 不適切な表現を品格ある文章に変換
- **🔒 プライバシー重視**: 入力データは安全に処理され保存されません
- **⚡ 高速動作**: Service Workerによるキャッシュで高速レスポンス

## 🚀 機能

### メイン機能
- **文章改善**: おじさん構文や不適切な表現を適切な文章に改善
- **複数候補表示**: 4つの異なる改善案を同時表示
- **ワンクリックコピー**: 改善されたテキストを簡単にコピー
- **文字数制限**: 500文字以内での入力制限

### PWA機能
- **ホーム画面追加**: スマートフォンのホーム画面にアプリとして追加可能
- **オフライン対応**: 基本UIはオフラインでも表示（改善機能はネット必須）
- **プッシュ通知**: 将来的な通知機能への対応
- **バックグラウンド同期**: オフライン時のデータ同期機能

## 📁 ファイル構成

```
datsuoji-pwa-site/
├── index.html          # メインHTML
├── styles.css          # スタイルシート
├── app.js             # JavaScript（メインロジック）
├── manifest.json      # PWAマニフェスト
├── service-worker.js  # Service Worker
├── README.md          # このファイル
└── icons/             # PWA用アイコン（要作成）
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png
    ├── icon-180x180.png
    ├── icon-192x192.png
    ├── icon-384x384.png
    └── icon-512x512.png
```

## 🔧 セットアップ

### 1. 必要なファイル準備

#### アイコンファイル作成
PWA用のアイコンファイルを`icons/`フォルダに配置してください：

```bash
mkdir icons
# 各サイズのアイコン画像を配置
# 推奨: 白背景に青色のロゴまたは「脱」の文字
```

#### 追加ページ（オプション）
```bash
# プライバシーポリシーなど
touch privacy.html terms.html contact.html
```

### 2. Webサーバーでの配信

#### 開発環境（Python）
```bash
# Python 3の場合
python -m http.server 8000

# Python 2の場合
python -m SimpleHTTPServer 8000
```

#### 本番環境（Nginx）
```nginx
server {
    listen 80;
    server_name datsuoji.app;
    
    location / {
        root /path/to/datsuoji-pwa-site;
        try_files $uri $uri/ /index.html;
    }
    
    # PWA関連ファイルのキャッシュ設定
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location /manifest.json {
        add_header Content-Type application/manifest+json;
    }
}
```

### 3. HTTPS設定（必須）
PWAはHTTPS環境でのみ動作します。Let's Encryptなどで SSL証明書を設定してください。

## 🔌 API統合

### Gemini API統合
`app.js`の`callImprovementAPI`関数を実装してください：

```javascript
async function callImprovementAPI(text) {
    const response = await fetch('/api/improve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: JSON.stringify({ 
            text: text,
            options: {
                maxSuggestions: 4,
                tone: 'polite'
            }
        })
    });
    
    if (!response.ok) {
        throw new Error('API request failed');
    }
    
    const data = await response.json();
    return data.improvements;
}
```

### バックエンドAPI例（Node.js）
```javascript
// server.js
app.post('/api/improve', async (req, res) => {
    try {
        const { text } = req.body;
        
        // Gemini API呼び出し
        const improvements = await callGeminiAPI(text);
        
        res.json({ improvements });
    } catch (error) {
        res.status(500).json({ error: 'Improvement failed' });
    }
});
```

## 📊 分析・モニタリング

### Google Analytics
```html
<!-- index.htmlに追加 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### パフォーマンス監視
```javascript
// app.jsに追加
function reportWebVitals() {
    // Core Web Vitals monitoring
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
    });
}
```

## 🚀 デプロイ

### 1. ドメイン取得
`datsuoji.app`ドメインを取得（お名前.comやGoogle Domainsなど）

### 2. ホスティング選択肢

#### Vercel（推奨）
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

#### GitHub Pages（カスタムドメイン）
```bash
# GitHubリポジトリ作成後
git add .
git commit -m "Initial PWA deployment"
git push origin main
```

#### 自前サーバー（VPS）
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx
sudo certbot --nginx -d datsuoji.app
```

## 🔧 カスタマイズ

### カラーテーマ変更
`styles.css`の以下の値を変更：
```css
:root {
    --primary-color: #2563eb;
    --success-color: #10b981;
    --background-color: #f8fafc;
}
```

### メッセージ・文言変更
`index.html`と`app.js`内の日本語テキストを調整

### 機能追加
- ユーザー登録・ログイン機能
- 履歴保存機能
- お気に入り機能
- ダークモード

## 📝 ライセンス

MIT License - 詳細は開発者にお問い合わせください

## 🤝 サポート

- 技術的な問題: GitHub Issues
- 一般的な質問: contact@datsuoji.app
- フィードバック: feedback@datsuoji.app

---

**開発者**: Claude Code Assistant
**最終更新**: 2025年1月21日