// Vercel Serverless Function for Message Analysis
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Android版から移植した分析プロンプト
        const analysisPrompt = `
あなたはプロの恋愛コーチです。以下のメッセージを40-50代男性が送ったものとして詳細分析してください。

【分析対象メッセージ】
"${text}"

【分析項目と採点基準（各25点満点）】
1. 印象・好感度: 相手に与える第一印象の良さ
2. 自然さ・読みやすさ: 文章の自然さと読みやすさ  
3. 不快リスク回避: 相手に不快感を与えないよう適切に配慮できているか（高得点=回避成功）
4. 会話継続性: 会話が続きやすいかどうか

【厳格な減点基準】
- 絵文字3個以上: -10〜15点
- 絵文字5個以上: -20〜25点
- 外見褒め（可愛い、綺麗等）: -10〜15点
- 上から目線表現: -5〜10点
- 決めつけ・推測: -5〜10点
- 質問攻め（3つ以上の質問）: -10点
- おじさん構文特有の表現: -15〜20点

必ず以下のJSON形式で回答してください：

{
  "overall_score": 総合得点（0-100点）,
  "category_scores": {
    "impression": 印象得点（0-25点）,
    "naturalness": 自然さ得点（0-25点）,
    "discomfort_risk": 不快リスク回避得点（0-25点、回避成功=高得点）,
    "continuity": 継続性得点（0-25点）
  },
  "detailed_feedback": {
    "impression": "印象についての具体的フィードバック",
    "naturalness": "自然さについての具体的フィードバック", 
    "discomfort_risk": "不快リスク回避についての具体的フィードバック",
    "continuity": "会話継続性についての具体的フィードバック"
  },
  "detected_issues": [
    "検出された具体的な問題点のリスト"
  ],
  "improvement_suggestions": [
    "具体的な改善提案のリスト（3-5個）"
  ],
  "pro_tips": [
    "プロからのアドバイス（2-3個）"
  ],
  "grade": "評価ランク（S/A/B/C/D）",
  "summary": "全体的な評価の要約"
}
`;

        const result = await model.generateContent(analysisPrompt);
        const response = await result.response;
        let analysisText = response.text();
        
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