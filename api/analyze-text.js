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

        // 簡潔化されたプロンプト（高速処理用）
        const analysisPrompt = `
40-50代男性向けメッセージ分析。性的内容（パンツ、下着等）は全カテゴリ0-3点。

メッセージ: "${text}"

JSON形式で回答:
{
  "overall_score": 合計点,
  "category_scores": {
    "impression": 印象得点(0-25),
    "naturalness": 自然さ得点(0-25),
    "discomfort_risk": 不快リスク回避得点(0-25),
    "continuity": 継続性得点(0-25)
  },
  "detailed_feedback": {
    "impression": "印象フィードバック",
    "naturalness": "自然さフィードバック",
    "discomfort_risk": "不快リスクフィードバック", 
    "continuity": "継続性フィードバック"
  },
  "detected_issues": ["問題点"],
  "improvement_suggestions": ["改善案"],
  "pro_tips": ["アドバイス"],
  "grade": "S/A/B/C/D/F",
  "summary": "要約"
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