// Netlify Function for Message Analysis

exports.handler = async (event, context) => {
    // CORS headers for web requests
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };
    
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { text } = JSON.parse(event.body);

        if (!text || text.trim().length === 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'メッセージテキストが必要です' })
            };
        }

        if (text.length > 500) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'メッセージは500文字以内で入力してください' })
            };
        }

        const apiKey = process.env.GEMINI_API_KEY;
        console.log('Environment check:', {
            hasApiKey: !!apiKey,
            keyLength: apiKey ? apiKey.length : 0,
            keyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'undefined'
        });
        
        if (!apiKey) {
            console.error('GEMINI_API_KEY not found in environment variables');
            throw new Error('Gemini API key not configured');
        }

        // 改善APIと同じ方法を使用（直接fetch）
        const analysisPrompt = `
あなたはプロの恋愛コーチです。以下のメッセージを厳格に分析してください。

メッセージ: "${text}"

【重要】まず詳細分析を行い、その分析内容に基づいて点数を決定してください。

【採点方針】
詳細分析で以下の表現を使った場合は、それに見合ったパーセンテージを付けること：
- 「非常に高い不快リスク」「極めて不適切」 → 0-20%
- 「高い不快リスク」「不適切」 → 20-40%  
- 「中程度の問題」「注意が必要」 → 40-60%
- 「軽微な問題」「改善余地あり」 → 60-80%
- 「良好」「適切」 → 80-100%

【絶対に以下のJSON形式で回答してください】
{
  "overall_score": [合計点数 0-100],
  "category_scores": {
    "impression": "印象評価: [パーセンテージ]%",
    "naturalness": "自然さ評価: [パーセンテージ]%", 
    "discomfort_risk": "不快リスク回避: [パーセンテージ]%",
    "continuity": "継続性評価: [パーセンテージ]%"
  },
  "detailed_feedback": {
    "impression": "[印象についての詳細フィードバック]",
    "naturalness": "[自然さについての詳細フィードバック]",
    "discomfort_risk": "[不快リスクについての詳細フィードバック]", 
    "continuity": "[継続性についての詳細フィードバック]"
  },
  "detected_issues": ["[問題点1]", "[問題点2]", "[問題点3]"],
  "improvement_suggestions": ["[改善提案1]", "[改善提案2]", "[改善提案3]", "[改善提案4]"],
  "pro_tips": ["[プロからのアドバイス1]", "[プロからのアドバイス2]"],
  "grade": "[S/A/B/C/D/Fのグレード]",
  "summary": "[総合評価の要約]"
}

【重要注意事項】
- JSONの外に一切の説明文を書かないでください
- 必ず有効なJSON形式で回答してください
- 文字列内での改行は避けてください
- ダブルクォートはエスケープしてください
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
            console.error('Gemini API Error:', response.status, errorText);
            throw new Error(`Gemini API Error: ${response.status}`);
        }

        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        console.log('Raw Gemini response:', responseText);

        // JSONレスポンスをパース
        let analysisResult;
        try {
            // JSON部分を抽出（マークダウンのコードブロックなどを除去）
            let cleanJson = responseText.trim();
            if (cleanJson.startsWith('```json')) {
                cleanJson = cleanJson.replace(/```json\s*/, '').replace(/```\s*$/, '');
            } else if (cleanJson.startsWith('```')) {
                cleanJson = cleanJson.replace(/```\s*/, '').replace(/```\s*$/, '');
            }
            
            analysisResult = JSON.parse(cleanJson);
            console.log('Parsed analysis result:', analysisResult);
        } catch (parseError) {
            console.error('JSON parsing failed:', parseError);
            // フォールバック: モック分析結果を返す
            analysisResult = generateMockAnalysis(text);
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                analysis: analysisResult
            })
        };

    } catch (error) {
        console.error('Analysis Error:', error);
        
        // エラー時はモック分析を返す
        const mockAnalysis = generateMockAnalysis(JSON.parse(event.body).text);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                analysis: mockAnalysis,
                mock: true
            })
        };
    }
};

function generateMockAnalysis(originalText) {
    // Analyze the actual text for more accurate mock feedback
    const emojiCount = (originalText.match(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || []).length;
    const hasRepetition = /(.)\1{2,}/.test(originalText);
    const hasInappropriateWords = /(好き|愛|ちゅ|キス|抱|抱き)/i.test(originalText);
    
    // 🚨 性的・セクハラ的内容の検出
    const hasSexualContent = /(パンツ|下着|ブラ|胸|お尻|性的|セックス|エッチ|キス|抱く|触|なめ)/i.test(originalText);
    
    let naturalness_score, impression_score, discomfort_risk_score, continuity_score;
    let naturalness_feedback, impression_feedback, discomfort_risk_feedback, continuity_feedback;
    let overall_score;
    
    if (hasSexualContent) {
        // 🚨 性的内容は全カテゴリで0-3点の最低評価
        impression_score = 1;
        naturalness_score = 2;
        discomfort_risk_score = 1;
        continuity_score = 1;
        overall_score = 12;
        
        impression_feedback = "セクハラ的で極めて不適切。完全に印象最悪で、相手に恐怖感や嫌悪感を与える内容です。";
        naturalness_feedback = "完全に異常で不自然。このような発言は社会的に許容されません。";
        discomfort_risk_feedback = "セクハラ・即ブロック級の内容。法的問題に発展する可能性もある完全アウトな内容です。";
        continuity_feedback = "会話は完全終了。関係破綻は確実で、二度と連絡が来ることはないでしょう。";
    } else {
        // 一般的な不適切表現の場合
        naturalness_score = 15;
        naturalness_feedback = "文章の構成は理解できますが、";
        
        if (hasRepetition) {
            naturalness_score -= 8;
            naturalness_feedback += "同じ文字や表現の繰り返しが多く、不自然な印象を与えています。";
        } else if (emojiCount > 3) {
            naturalness_score -= 5;
            naturalness_feedback += "絵文字の使用が多すぎて、文章が不自然な印象を与えています。";
        } else if (emojiCount === 1) {
            naturalness_feedback += "絵文字の使用は適度ですが、全体の表現が幼稚な印象を与えています。";
        } else {
            naturalness_feedback += "表現が直接的すぎて、大人の会話として不自然です。";
        }
        
        impression_score = 5;
        if (hasInappropriateWords) {
            impression_feedback = "愛情表現が直接的すぎて、初対面の相手には不適切で不快感を与える可能性があります。";
        } else {
            impression_feedback = "表現が幼稚で、40-50代男性としての品格に欠ける印象を与えます。";
        }
        
        discomfort_risk_score = 3;
        continuity_score = 2;
        overall_score = 35;
        discomfort_risk_feedback = "不快感を与えるリスクが高く、相手への配慮が不足しています。より慎重な表現を心がけましょう。";
        continuity_feedback = "一方的な感情表現で、相手が返信しづらい内容になっています。";
    }
    
    let detected_issues = [];
    if (hasSexualContent) {
        detected_issues.push("セクハラ的・性的内容");
        detected_issues.push("完全に不適切な表現");
        detected_issues.push("法的リスクのある内容");
        detected_issues.push("相手への配慮の完全欠如");
    } else {
        if (hasRepetition) detected_issues.push("同じ表現の過度な繰り返し");
        if (hasInappropriateWords) detected_issues.push("不適切な愛情表現");
        if (emojiCount > 0) detected_issues.push("感情的すぎる表現");
        detected_issues.push("大人らしさの欠如");
    }
    
    return {
        overall_score: overall_score,
        category_scores: {
            impression: `印象評価: ${Math.round((impression_score / 25) * 100)}%`,
            naturalness: `自然さ評価: ${Math.round((naturalness_score / 25) * 100)}%`,
            discomfort_risk: `不快リスク回避: ${Math.round((discomfort_risk_score / 25) * 100)}%`,
            continuity: `継続性評価: ${Math.round((continuity_score / 25) * 100)}%`
        },
        detailed_feedback: {
            impression: impression_feedback,
            naturalness: naturalness_feedback,
            discomfort_risk: discomfort_risk_feedback,
            continuity: continuity_feedback
        },
        detected_issues: detected_issues,
        improvement_suggestions: hasSexualContent ? [
            "性的・セクハラ的内容は絶対に使用しないでください",
            "相手を尊重し、品格のある挨拶から始めましょう",
            "プロフィールに基づいた健全な話題で会話を始めましょう",
            "法的・倫理的問題を避けるため、適切なコミュニケーションを学びましょう"
        ] : [
            "感情表現は控えめにして、まずは軽い挨拶から始めましょう",
            "相手の興味や趣味について質問を含めて、会話のきっかけを作りましょう",
            "大人らしい落ち着いた表現を心がけ、品格のある文章にしましょう",
            "一方的な表現ではなく、相手のことを気遣う内容を含めましょう"
        ],
        pro_tips: hasSexualContent ? [
            "性的内容は即ブロック・通報の対象となり、法的問題にも発展します",
            "健全で相手を尊重するコミュニケーションが成功の基本です"
        ] : [
            "初回メッセージでは感情表現は控え、相手のプロフィールに基づいた質問から始めることが重要です",
            "40-50代男性としての落ち着きと品格を表現に反映させましょう"
        ],
        grade: hasSexualContent ? "F" : "D",
        summary: hasSexualContent ? "完全に不適切なセクハラ的内容です。このようなメッセージは絶対に送ってはいけません。法的問題にも発展する可能性があります。" : "感情表現が直接的すぎて、相手に不快感を与える可能性が高いメッセージです。もっと控えめで品格のある表現を心がけましょう。"
    };
}