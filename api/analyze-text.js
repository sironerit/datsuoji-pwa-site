// Vercel Serverless Function for Message Analysis

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { text } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ 
                error: 'メッセージテキストが必要です' 
            });
        }

        if (text.length > 500) {
            return res.status(400).json({ 
                error: 'メッセージは500文字以内で入力してください' 
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('Gemini API key not configured');
        }

        // 改善APIと同じ方法を使用（直接fetch）
        const analysisPrompt = `
あなたはプロの恋愛コーチです。以下のメッセージを厳格に分析してください。

メッセージ: "${text}"

【重要】不快リスク回避の採点基準：
- 25点: 完全に適切で不快感を与えない内容
- 20-24点: 軽微な問題があるが概ね問題ない
- 15-19点: 中程度の問題があり注意が必要
- 10-14点: 深刻な問題があり大幅修正が必要
- 5-9点: 非常に不適切で強い不快感を与える
- 0-4点: 完全にアウト・セクハラ・即ブロック級

【厳格な減点基準】
- 性的内容・下着言及: 不快リスク回避0-3点
- セクハラ的表現: 不快リスク回避0-5点
- 外見褒め過度: 不快リスク回避5-10点
- 馴れ馴れしすぎ: 不快リスク回避10-15点

以下のJSON形式で厳格に採点してください：

{
  "overall_score": 実際の品質に応じた点数,
  "category_scores": {
    "impression": 印象得点（0-25点）,
    "naturalness": 自然さ得点（0-25点）,
    "discomfort_risk": 不快リスク回避得点（0-25点、上記基準で厳格採点）,
    "continuity": 継続性得点（0-25点）
  },
  "detailed_feedback": {
    "impression": "印象についての具体的フィードバック",
    "naturalness": "自然さについての具体的フィードバック", 
    "discomfort_risk": "不快リスク回避についての具体的フィードバック",
    "continuity": "継続性についての具体的フィードバック"
  },
  "detected_issues": [
    "検出された具体的問題点"
  ],
  "improvement_suggestions": [
    "具体的改善提案1",
    "具体的改善提案2"
  ],
  "pro_tips": [
    "プロアドバイス"
  ],
  "grade": "評価ランク（S/A/B/C/D）",
  "summary": "評価要約"
}
`;

        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: analysisPrompt
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
            console.error('Error Body:', errorText);
            console.error('================================');
            throw new Error(`Gemini API Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        let analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'テストレスポンス';
        
        console.log('Gemini API raw response:', analysisText);

        // JSON部分を抽出
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('有効なJSON形式の分析結果が取得できませんでした');
        }

        let analysisResult;
        try {
            analysisResult = JSON.parse(jsonMatch[0]);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.error('Raw JSON string:', jsonMatch[0]);
            throw new Error('分析結果のJSONパースに失敗しました');
        }

        // データ検証
        if (!analysisResult.overall_score || !analysisResult.category_scores) {
            throw new Error('分析結果の形式が不正です');
        }

        // スコアの正規化（0-100の範囲に調整）
        analysisResult.overall_score = Math.max(0, Math.min(100, analysisResult.overall_score));
        
        Object.keys(analysisResult.category_scores).forEach(key => {
            analysisResult.category_scores[key] = Math.max(0, Math.min(25, analysisResult.category_scores[key]));
        });

        // 成功レスポンス
        res.status(200).json({
            success: true,
            analysis: analysisResult,
            input_text: text
        });

    } catch (error) {
        console.error('=== ANALYSIS API ERROR DETAILS ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('API Key exists:', !!process.env.GEMINI_API_KEY);
        console.error('API Key length:', process.env.GEMINI_API_KEY?.length);
        console.error('=====================================');
        
        // エラーの詳細をログに記録
        if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('403')) {
            console.error('🚨 Gemini API Key is invalid or expired');
        } else if (error.message?.includes('QUOTA_EXCEEDED') || error.message?.includes('429')) {
            console.error('🚨 Gemini API quota exceeded or rate limited');
        } else if (error.message?.includes('Network')) {
            console.error('🚨 Network connection error');
        }

        res.status(500).json({ 
            success: false,
            error: 'メッセージ分析中にエラーが発生しました。もう一度お試しください。',
            details: error.message,
            errorType: error.message?.includes('403') ? 'API_KEY_ERROR' : 
                      error.message?.includes('429') ? 'QUOTA_ERROR' : 'UNKNOWN_ERROR'
        });
    }
}