// *** ANALYSIS PAGE v1.0 - 2025-01-21 ***
console.log('🔍 ANALYSIS.JS VERSION 1.0 LOADED - Message Analysis with Pro Coach AI');

// Import product database from main app.js
// We'll reuse the same product system
const AMAZON_ASSOCIATE_TAG = 'pachisondatin-22';

// DOM Elements
const analysisInputText = document.getElementById('analysisInputText');
const analysisCharCount = document.getElementById('analysisCharCount');
const analyzeBtn = document.getElementById('analyzeBtn');
const analysisResultsSection = document.getElementById('analysisResultsSection');
const analysisLoadingModal = document.getElementById('analysisLoadingModal');

// Results elements
const overallScore = document.getElementById('overallScore');
const scoreGrade = document.getElementById('scoreGrade');
const scoreBar = document.getElementById('scoreBar');
const scoreProgress = document.getElementById('scoreProgress');

// Category score elements
const impressionScore = document.getElementById('impressionScore');
const naturalScore = document.getElementById('naturalScore');
const riskScore = document.getElementById('riskScore');
const continuityScore = document.getElementById('continuityScore');

// Feedback elements
const impressionFeedback = document.getElementById('impressionFeedback');
const naturalFeedback = document.getElementById('naturalFeedback');
const riskFeedback = document.getElementById('riskFeedback');
const continuityFeedback = document.getElementById('continuityFeedback');

// Lists elements
const detectedIssues = document.getElementById('detectedIssues');
const improvementList = document.getElementById('improvementList');
const proTips = document.getElementById('proTips');

// App State
let isAnalyzing = false;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeAnalysisApp();
});

function initializeAnalysisApp() {
    console.log('🚀 Initializing Analysis App');
    
    // Check if DOM elements exist
    console.log('DOM elements check:', {
        analysisInputText: !!analysisInputText,
        analysisCharCount: !!analysisCharCount,
        analyzeBtn: !!analyzeBtn,
        analysisResultsSection: !!analysisResultsSection
    });
    
    if (!analysisInputText || !analyzeBtn) {
        console.error('❌ Critical DOM elements missing!');
        return;
    }
    

    // Set up event listeners
    setupAnalysisEventListeners();
    
    // Update character count
    updateAnalysisCharCount();
    
    // Display recommended products immediately on page load
    displayPermanentRecommendedProducts();
}

function setupAnalysisEventListeners() {
    // Input text area events
    analysisInputText.addEventListener('input', handleAnalysisInputChange);
    analysisInputText.addEventListener('paste', handleAnalysisPaste);
    
    // Analyze button click
    analyzeBtn.addEventListener('click', function(event) {
        console.log('🔍 Analyze button clicked!', event);
        handleAnalyzeClick();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

function handleAnalysisInputChange() {
    updateAnalysisCharCount();
    updateAnalyzeButton();
}

function handleAnalysisPaste(event) {
    // Allow paste, then update after a brief delay
    setTimeout(() => {
        updateAnalysisCharCount();
        updateAnalyzeButton();
    }, 10);
}

function updateAnalysisCharCount() {
    const text = analysisInputText.value;
    const count = text.length;
    analysisCharCount.textContent = count;
    
    // Update styling based on character limit
    if (count > 450) {
        analysisCharCount.style.color = '#dc2626';
    } else if (count > 400) {
        analysisCharCount.style.color = '#f59e0b';
    } else {
        analysisCharCount.style.color = '#6b7280';
    }
}

function updateAnalyzeButton() {
    const text = analysisInputText.value.trim();
    const isValid = text.length > 0 && text.length <= 500;
    
    // Debug logging
    console.log('🔍 updateAnalyzeButton:', {
        textLength: text.length,
        isValid: isValid,
        isAnalyzing: isAnalyzing,
        disabled: !isValid || isAnalyzing
    });
    
    analyzeBtn.disabled = !isValid || isAnalyzing;
    
    if (text.length === 0) {
        analyzeBtn.textContent = '🔍 プロ分析を開始';
    } else if (text.length > 500) {
        analyzeBtn.textContent = '⚠️ 文字数制限を超えています';
    } else {
        analyzeBtn.textContent = '🔍 プロ分析を開始';
    }
}

async function handleAnalyzeClick() {
    if (isAnalyzing) return;
    
    const text = analysisInputText.value.trim();
    if (!text) return;
    
    console.log('🔍 handleAnalyzeClick started with text:', text);
    
    try {
        isAnalyzing = true;
        showAnalysisLoadingModal();
        updateAnalyzeButton();
        
        console.log('📞 About to call analysis API...');
        // Call analysis API
        const analysisResult = await callAnalysisAPI(text);
        
        console.log('✅ Got analysis result:', analysisResult);
        displayAnalysisResults(analysisResult);
        
        // Show results section
        analysisResultsSection.style.display = 'block';
        analysisResultsSection.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Analysis failed:', error);
        showErrorMessage('分析処理中にエラーが発生しました。もう一度お試しください。');
    } finally {
        isAnalyzing = false;
        hideAnalysisLoadingModal();
        updateAnalyzeButton();
    }
}

async function callAnalysisAPI(text) {
    try {
        console.log('Calling analysis API with text:', text);
        
        const response = await fetch('/api/analyze-text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API request failed: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Analysis API Response:', data);
        
        if (!data.success || !data.analysis) {
            throw new Error('Invalid API response format');
        }
        
        return data.analysis;
        
    } catch (error) {
        console.error('Analysis API call failed:', error);
        console.error('Error details:', error.message);
        
        // Show user-friendly error and fallback to mock
        showErrorMessage(`AI分析に失敗しました: ${error.message}\\nモック版を表示しています。`);
        
        // Fallback to mock analysis for demonstration
        return generateMockAnalysis(text);
    }
}

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
        overall_score = 5;
        
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
        overall_score = 25;
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
            impression: impression_score,
            naturalness: naturalness_score,
            discomfort_risk: discomfort_risk_score,
            continuity: continuity_score
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

function displayAnalysisResults(analysis) {
    console.log('📊 Displaying analysis results:', analysis);
    
    // Display overall score with animation
    displayOverallScore(analysis.overall_score, analysis.grade);
    
    // Display category scores
    displayCategoryScores(analysis.category_scores, analysis.detailed_feedback);
    
    // Display issues
    displayDetectedIssues(analysis.detected_issues || []);
    
    // Display improvement suggestions
    displayImprovementSuggestions(analysis.improvement_suggestions || []);
    
    // Display pro tips
    displayProTips(analysis.pro_tips || []);
}

function displayOverallScore(score, grade) {
    // Animate score counting up
    animateScoreCounter(overallScore, 0, score, 1000);
    
    // Set grade text
    scoreGrade.textContent = getGradeText(grade, score);
    
    // Animate compact progress bar
    setTimeout(() => {
        const compactProgress = document.getElementById('scoreProgress');
        if (compactProgress) {
            compactProgress.style.width = `${score}%`;
        }
    }, 500);
}

function displayCategoryScores(scores, feedback) {
    // Display scores with animation
    setTimeout(() => animateScoreCounter(impressionScore, 0, scores.impression || 0, 800), 200);
    setTimeout(() => animateScoreCounter(naturalScore, 0, scores.naturalness || 0, 800), 400);
    setTimeout(() => animateScoreCounter(riskScore, 0, scores.discomfort_risk || 0, 800), 600);
    setTimeout(() => animateScoreCounter(continuityScore, 0, scores.continuity || 0, 800), 800);
    
    // Animate progress bars
    setTimeout(() => animateProgressBar('impressionProgress', scores.impression || 0, 25), 300);
    setTimeout(() => animateProgressBar('naturalProgress', scores.naturalness || 0, 25), 500);
    setTimeout(() => animateProgressBar('riskProgress', scores.discomfort_risk || 0, 25), 700);
    setTimeout(() => animateProgressBar('continuityProgress', scores.continuity || 0, 25), 900);
    
    // Display feedback
    impressionFeedback.textContent = feedback.impression || '';
    naturalFeedback.textContent = feedback.naturalness || '';
    riskFeedback.textContent = feedback.discomfort_risk || '';
    continuityFeedback.textContent = feedback.continuity || '';
    
    // Draw radar chart
    setTimeout(() => drawRadarChart(scores), 1000);
}

function displayDetectedIssues(issues) {
    detectedIssues.innerHTML = '';
    
    issues.forEach((issue, index) => {
        const issueElement = document.createElement('div');
        issueElement.className = 'issue-item';
        issueElement.textContent = `❌ ${issue}`;
        issueElement.style.opacity = '0';
        issueElement.style.transform = 'translateY(10px)';
        
        detectedIssues.appendChild(issueElement);
        
        // Animate in
        setTimeout(() => {
            issueElement.style.transition = 'all 0.3s ease';
            issueElement.style.opacity = '1';
            issueElement.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

function displayImprovementSuggestions(suggestions) {
    improvementList.innerHTML = '';
    
    suggestions.forEach((suggestion, index) => {
        const suggestionElement = document.createElement('div');
        suggestionElement.className = 'improvement-item';
        suggestionElement.textContent = `💡 ${suggestion}`;
        suggestionElement.style.opacity = '0';
        suggestionElement.style.transform = 'translateY(10px)';
        
        improvementList.appendChild(suggestionElement);
        
        // Animate in
        setTimeout(() => {
            suggestionElement.style.transition = 'all 0.3s ease';
            suggestionElement.style.opacity = '1';
            suggestionElement.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

function displayProTips(tips) {
    proTips.innerHTML = '';
    
    tips.forEach((tip, index) => {
        const tipElement = document.createElement('div');
        tipElement.className = 'pro-tip-item';
        tipElement.textContent = `🎯 ${tip}`;
        tipElement.style.opacity = '0';
        tipElement.style.transform = 'translateY(10px)';
        
        proTips.appendChild(tipElement);
        
        // Animate in
        setTimeout(() => {
            tipElement.style.transition = 'all 0.3s ease';
            tipElement.style.opacity = '1';
            tipElement.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

function animateScoreCounter(element, start, end, duration) {
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(start + (end - start) * easeOutCubic);
        
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function getGradeText(grade, score) {
    const gradeTexts = {
        'S': ' 素晴らしい！',
        'A': '良好です',
        'B': 'まずまず',
        'C': '要改善',
        'D': '大幅改善が必要'
    };
    
    return gradeTexts[grade] || `${score}点`;
}

// 🎯 Enhanced Visualization Functions

function animateProgressBar(elementId, value, maxValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const percentage = (value / maxValue) * 100;
    
    // Set initial state
    element.style.width = '0%';
    element.style.transition = 'width 1s ease-out';
    
    // Animate to target width
    setTimeout(() => {
        element.style.width = `${percentage}%`;
        
        // Set color based on score
        if (percentage >= 80) {
            element.style.background = '#10b981'; // Green
        } else if (percentage >= 60) {
            element.style.background = '#f59e0b'; // Yellow
        } else {
            element.style.background = '#ef4444'; // Red
        }
    }, 100);
}

function drawRadarChart(scores) {
    const canvas = document.getElementById('radarChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 90; // 右側配置用にさらに小さく
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Data preparation - 4軸配置
    const categories = [
        { label: '印象・好感度', value: scores.impression || 0, angle: -Math.PI / 2 }, // Top
        { label: '自然さ', value: scores.naturalness || 0, angle: 0 }, // Right
        { label: '不快リスク回避', value: scores.discomfort_risk || 0, angle: Math.PI / 2 }, // Bottom
        { label: '会話継続性', value: scores.continuity || 0, angle: Math.PI } // Left
    ];
    
    // Draw background grid
    drawRadarGrid(ctx, centerX, centerY, radius);
    
    // Draw data polygon
    drawRadarPolygon(ctx, centerX, centerY, radius, categories);
    
    // Draw category labels
    drawRadarLabels(ctx, centerX, centerY, radius + 25, categories);
    
    // 中心点は削除（不要）
}

function drawRadarGrid(ctx, centerX, centerY, radius) {
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Draw concentric circles (grid lines)
    for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI);
        ctx.stroke();
    }
    
    // Draw axes
    for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

function drawRadarPolygon(ctx, centerX, centerY, radius, categories) {
    // Create gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(37, 99, 235, 0.3)');
    gradient.addColorStop(1, 'rgba(37, 99, 235, 0.1)');
    
    ctx.beginPath();
    categories.forEach((category, index) => {
        const normalizedValue = category.value / 25; // Normalize to 0-1
        const x = centerX + Math.cos(category.angle - Math.PI / 2) * radius * normalizedValue;
        const y = centerY + Math.sin(category.angle - Math.PI / 2) * radius * normalizedValue;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        // Draw data points
        ctx.save();
        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    });
    
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawRadarLabels(ctx, centerX, centerY, labelRadius, categories) {
    ctx.fillStyle = '#1e293b';
    ctx.font = '13px system-ui, -apple-system, sans-serif';
    
    categories.forEach(category => {
        const x = centerX + Math.cos(category.angle) * labelRadius;
        const y = centerY + Math.sin(category.angle) * labelRadius;
        
        // Position labels to avoid overlaps and fit canvas
        let labelX = x;
        let labelY = y;
        let scoreX = x;
        let scoreY = y;
        
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (category.angle === -Math.PI / 2) { // Top
            labelY = y - 12;
            scoreY = y + 8;
        } else if (category.angle === Math.PI / 2) { // Bottom  
            labelY = y + 12;
            scoreY = y - 8;
        } else if (category.angle === 0) { // Right
            labelX = x + 5;
            labelY = y - 8;
            scoreX = x + 5;
            scoreY = y + 8;
        } else { // Left
            labelX = x - 5;
            labelY = y - 8;
            scoreX = x - 5;
            scoreY = y + 8;
        }
        
        // Draw label
        ctx.fillText(category.label, labelX, labelY);
        
        // Draw score with larger font
        ctx.save();
        ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#2563eb';
        ctx.fillText(`${category.value}pt`, scoreX, scoreY);
        ctx.restore();
    });
}

// Utility functions (copied from main app.js)
function showAnalysisLoadingModal() {
    analysisLoadingModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function hideAnalysisLoadingModal() {
    analysisLoadingModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showErrorMessage(message) {
    // Create error notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fef2f2;
        color: #dc2626;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        border: 1px solid #fecaca;
        z-index: 1001;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + Enter to analyze text
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        if (!analyzeBtn.disabled) {
            handleAnalyzeClick();
        }
    }
    
    // Escape to close modal
    if (event.key === 'Escape') {
        if (analysisLoadingModal.style.display === 'block') {
            // Don't allow closing loading modal with Escape
            return;
        }
    }
}

// Product recommendation system (reuse from main app.js)
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
        },
        {
            title: "人を動かす",
            description: "デール・カーネギーの名著。人間関係の基本を学ぶ",
            price: "¥715",
            rating: 4.4,
            reviews: 2847,
            image: "https://m.media-amazon.com/images/I/51CDG+mjXVL._SL500_.jpg",
            asin: "B071DC7ZTN",
            category: "自己啓発"
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

// Product display functions (copied from main app.js)
function displayPermanentRecommendedProducts() {
    setTimeout(() => {
        console.log('🎯 Setting up sidebar...');
        setupPageSidebarCategories();
        showSidebarProducts('communication');
    }, 100);
}

function setupPageSidebarCategories() {
    const categoryButtons = document.querySelectorAll('.sidebar-category-btn');
    console.log('🔧 Found category buttons:', categoryButtons.length);
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            console.log('🖱️ Category clicked:', category);
            
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show products for selected category
            showSidebarProducts(category);
        });
    });
}

function showSidebarProducts(category) {
    console.log('🛍️ Loading products for category:', category);
    
    const productsContainer = document.getElementById('sidebarProducts');
    const categoryTitle = document.getElementById('sidebarCategoryTitle');
    
    if (!productsContainer || !categoryTitle) {
        console.error('❌ Required containers not found!');
        return;
    }
    
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

