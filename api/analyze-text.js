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

【🚨超重要🚨】性的・セクハラ的内容の完全排除基準：
性的内容（パンツ、下着、体の部位、性的示唆）が含まれる場合は、問答無用で以下の点数：
- 印象・好感度: 0-3点（完全に印象最悪）
- 自然さ: 0-3点（極めて不自然・異常）
- 不快リスク回避: 0-3点（セクハラ・即ブロック級）
- 会話継続性: 0-3点（会話終了・関係破綻）

【全カテゴリ採点基準】
各カテゴリ0-25点で採点：
- 25点: 完璧・理想的
- 20-24点: 良好・軽微な問題のみ
- 15-19点: 平均的・中程度の問題
- 10-14点: 問題あり・要改善
- 5-9点: 深刻な問題・大幅修正必要
- 0-4点: 完全にアウト・使用不可

【セクハラ・性的内容は全カテゴリ0-3点】
パンツ、下着、性的部位、性的行為の示唆等が含まれる場合は、全カテゴリで0-3点の最低評価とする

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