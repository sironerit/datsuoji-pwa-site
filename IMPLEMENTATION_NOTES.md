# 実装ガイドライン - 日付の自動取得

## 📅 日付関連実装のベストプラクティス

### ✅ **推奨実装パターン**

#### 1. **サービス開始日の自動設定**
```javascript
// ❌ 避けるべき（固定日付）
const serviceStartDate = new Date('2025-07-25T00:00:00Z');

// ✅ 推奨（現在日付の自動取得）
const now = new Date();
const serviceStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
```

#### 2. **初回利用日の記録**
```javascript
// 実際のデータが初めて記録された日付を保持
if (!global.siteStats) {
    global.siteStats = {
        firstUse: new Date().toISOString(), // 実際の初回利用時刻
        // ...other stats
    };
}
```

#### 3. **タイムゾーン対応**
```javascript
// 日本時間での日付取得
const japanTime = new Date().toLocaleString("ja-JP", {timeZone: "Asia/Tokyo"});
const today = new Date(japanTime).toDateString();
```

### 🔄 **今後の同様実装で注意すべき点**

#### **統計・分析システム実装時**
1. **日付は必ず動的取得**
   - `new Date()`を使用
   - 固定日付の埋め込みは禁止

2. **初期化タイミング**
   - サーバー起動時 = サービス開始日
   - 初回データ記録時 = 実際の利用開始日

3. **表示フォーマット**
   - 年月表示: `YYYY.MM`
   - 詳細表示: `YYYY年M月D日`

#### **データベース永続化時の考慮事項**
```javascript
// メモリ内データ（デプロイで消失）の場合
if (!global.siteStats) {
    // 毎回初期化 = 実際のサービス開始日が記録される
}

// データベース使用時
// 初回のみ記録、以降は既存データを維持
```

### 📝 **コード例テンプレート**

#### **Netlify Function統計システム**
```javascript
if (!global.siteStats) {
    const serviceStart = new Date();
    global.siteStats = {
        firstUse: serviceStart.toISOString(),
        // 他の統計データ...
    };
}
```

#### **フロントエンド表示**
```javascript
// サービス開始日表示
const startDate = new Date(stats.firstUse);
const yearMonth = startDate.getFullYear() + '.' + 
    String(startDate.getMonth() + 1).padStart(2, '0');
```

### 🎯 **適用プロジェクト**
- 統計・分析システム
- ユーザー登録システム
- データ追跡システム
- レポート生成システム

この方針により、**どのプロジェクトでも実装時の現在日付が自動的にサービス開始日として記録される**ようになります。