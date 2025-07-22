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

        // シンプルなテスト用プロンプト（長すぎるプロンプトが原因かテスト）
        const analysisPrompt = `
あなたはプロの恋愛コーチです。以下のメッセージを分析してください。

メッセージ: "${text}"

以下のJSON形式で回答してください：

{
  "overall_score": 50,
  "category_scores": {
    "impression": 10,
    "naturalness": 15,
    "discomfort_risk": 12,
    "continuity": 13
  },
  "detailed_feedback": {
    "impression": "印象についてのフィードバック",
    "naturalness": "自然さについてのフィードバック", 
    "discomfort_risk": "リスク回避についてのフィードバック",
    "continuity": "継続性についてのフィードバック"
  },
  "detected_issues": [
    "検出された問題点"
  ],
  "improvement_suggestions": [
    "改善提案1",
    "改善提案2"
  ],
  "pro_tips": [
    "プロからのアドバイス"
  ],
  "grade": "C",
  "summary": "評価の要約"
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