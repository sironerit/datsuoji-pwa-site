// Vercel Serverless Function for Gemini API integration
export default async function handler(req, res) {
    // CORS headers for web requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
        return res.status(400).json({ error: 'テキストが入力されていません' });
    }
    
    if (text.length > 500) {
        return res.status(400).json({ error: 'テキストが長すぎます（500文字以内）' });
    }
    
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('Gemini API key not configured');
        }
        
        const prompt = createMultipleImprovementPrompt(text);
        
        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ]
        };
        
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            }
        );
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('=== GEMINI API ERROR DETAILS ===');
            console.error('Status:', response.status);
            console.error('Status Text:', response.statusText);
            console.error('Response Headers:', [...response.headers.entries()]);
            console.error('Error Body:', errorText);
            console.error('API Key exists:', !!apiKey);
            console.error('API Key length:', apiKey?.length);
            console.error('================================');
            
            // より具体的なエラーメッセージ
            if (response.status === 403) {
                throw new Error(`API Key無効またはQuota制限: ${errorText}`);
            } else if (response.status === 429) {
                throw new Error(`Rate Limit到達: ${errorText}`);
            } else {
                throw new Error(`Gemini API Error ${response.status}: ${errorText}`);
            }
        }
        
        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '改善に失敗しました';
        
        console.log('=== Gemini API Response ===');
        console.log(responseText);
        console.log('=== End Response ===');
        
        const improvedTexts = parseMultipleImprovements(responseText);
        
        return res.status(200).json({
            success: true,
            improvedTexts: improvedTexts
        });
        
    } catch (error) {
        console.error('API Error:', error);
        
        // APIエラー時でもモックデータで安定動作
        const mockImprovements = [
            "プロフィールを拝見させていただきました。とても興味深い方だなと感じています。お話しできたら嬉しいです。",
            "はじめまして。プロフィールから、きっと素敵な方なんだろうなと思いました。よろしければお話ししませんか。", 
            "こんにちは。共通の趣味がありそうですね。お時間のあるときにでも、いろいろ教えていただけませんか。",
            "プロフィールを読ませていただきました。お話ししてみたいなと思ったのですが、いかがでしょうか。"
        ];
        
        return res.status(200).json({
            success: true,
            improvedTexts: mockImprovements,
            originalText: text,
            mock: true // モックデータであることを示すフラグ
        });
    }
}

function createMultipleImprovementPrompt(originalText) {
    return `【テキスト改善タスク】
以下の元のメッセージ「${originalText}」の文章自体を、40-50代男性らしい魅力的な表現に改善してください。

【重要】返信や応答を考えるのではなく、元の文章そのものをより良い表現に変更してください。

【🚨絶対禁止🚨】上から目線な評価表現は絶対に使用しないでください：
「好印象です」「気に入りました」「いいと思います」「なかなかいいですね」「好感が持てます」

【最重要】すべての改善案で以下の4つの要素を必ず反映してください：
1. 品格ある表現 - 上品で落ち着いた大人の男性らしい言葉遣い
2. 親しみやすさ - 堅すぎず、相手が話しかけやすい温かみのある雰囲気
3. 適度な自信 - へりくだりすぎず、自然な男性らしい自信と余裕
4. 自然な表現 - 不自然でなく、普通の会話として成り立つ流れ

【改善の方針】
- 元の文章の意図・内容は保持する
- 表現方法のみを改善する
- 完全に別の内容に変えない
- 言い回しや語調を品格ある表現に調整する

【重要】必ず以下の形式で4つの異なる改善案を番号付きで出力してください：

1. [1つ目の改善されたメッセージ]
2. [2つ目の改善されたメッセージ]
3. [3つ目の改善されたメッセージ]
4. [4つ目の改善されたメッセージ]

【親しみやすく大人な清潔感ある表現】
× 機械的定型文：「もしよかったら、お話を聞かせていただけませんか？」
× ボット的敬語：「もしよろしければ○○していただけませんでしょうか？」
× 硬すぎる敬語：「恐れ入りますが」「恐縮ですが」「お時間を頂戴して」
× ビジネスメール調：「お話しさせて頂けたら幸いです」「ご連絡いただければ幸いです」
× へりくだりすぎ：「お話しさせていただけませんか」「お時間よろしければ」
× チャラい表現：「めっちゃ」「すごく」「マジで」「やばい」
× 攻撃的表現：「嫌い」「うざい」「ムカつく」などの直接的否定語
○ 自然な親しみやすさ：「お話しできたら嬉しいです」「いろいろ聞かせてください」
○ 大人の適度な自信：「お話ししましょう」「お話しできればと思います」
○ 品格ある落ち着き：「教えていただけますか」「どんなことをされているんですか」
○ 清潔感ある表現：「興味があります」「お聞かせください」「機会があれば」
○ 建設的表現：否定的感情も品格ある表現に変換する

【出力形式の重要な注意】
- 改善されたメッセージのみを出力してください
- 括弧書きでの説明や注釈は一切含めないでください
- 修正理由の説明も不要です
- プレースホルダーや変数（○○、××など）を使わず、具体的な完成メッセージのみ出力
- 元の文章の基本的な意図は保持しつつ、表現を改善する
- ユーザーが直接コピーして使える完成されたメッセージのみを出力してください

注釈・説明一切なしで、完成されたメッセージのみを番号付きリストで出力してください：`;
}

function parseMultipleImprovements(responseText) {
    console.log('Parsing response:', responseText);
    
    // 番号付きリストを解析して改善案を抽出
    const lines = responseText.split('\n');
    const improvements = [];
    
    for (const line of lines) {
        const trimmed = line.trim();
        
        // "1. ", "2. ", "3. ", "4. " で始まる行を検出
        if (trimmed.match(/^[1-4]\. .+/)) {
            const improvement = trimmed.substring(trimmed.indexOf('.') + 1).trim();
            if (improvement.length > 0) {
                improvements.push(improvement);
                console.log('✅ Found numbered item:', improvement);
            }
        }
    }
    
    // フォールバック: 改行で分割して空行以外を取得
    if (improvements.length === 0) {
        console.log('No numbered items found, using fallback');
        
        const fallbackList = responseText.split('\n')
            .map(line => line.trim())
            .filter(line => 
                line.length > 0 && 
                !line.startsWith('【') && 
                !line.startsWith('元のメッセージ') && 
                !line.startsWith('改善案') &&
                !line.startsWith('上記メッセージ') &&
                !line.includes('[') &&
                !line.includes('番号付き')
            )
            .slice(0, 4);
        
        return fallbackList.length > 0 ? fallbackList : ['改善に失敗しました'];
    }
    
    return improvements.slice(0, 4); // 最大4つ
}