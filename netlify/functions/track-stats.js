exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight request
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
        const { action, data } = JSON.parse(event.body);

        // Simple in-memory storage for demo (in production, use database)
        // This will reset on each deployment
        if (!global.siteStats) {
            // 現在の日付をサービス開始日として自動設定（今後の実装で再利用可能）
            const now = new Date();
            // 日本時間での今日の日付を取得
            const japanNow = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Tokyo"}));
            const serviceStartDate = new Date(japanNow.getFullYear(), japanNow.getMonth(), japanNow.getDate());
            
            global.siteStats = {
                totalImprovements: 0,
                totalAnalyses: 0,  // 分析機能の統計を追加
                totalRequests: 0,
                successCount: 0,
                dailyStats: {},
                timeSlots: { morning: 0, afternoon: 0, evening: 0, night: 0 },
                firstUse: serviceStartDate.toISOString()
            };
        }

        if (action === 'track') {
            // Track new usage
            const stats = global.siteStats;
            // 日本時間を取得
            const now = new Date();
            const japanTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Tokyo"}));
            const today = japanTime.toDateString();
            const hour = japanTime.getHours();
            
            console.log('Time check:', {
                utc: now.toISOString(),
                japan: japanTime.toLocaleString(),
                hour: hour,
                timeSlot: hour >= 6 && hour < 12 ? 'morning' : 
                         hour >= 12 && hour < 18 ? 'afternoon' : 
                         hour >= 18 && hour < 24 ? 'evening' : 'night'
            });

            stats.totalRequests += 1;
            if (data.success) {
                stats.successCount += 1;
                // 機能タイプに応じて統計を分ける
                if (data.type === 'analysis') {
                    stats.totalAnalyses += 1;
                } else {
                    stats.totalImprovements += 1;  // デフォルトは改善機能
                }
            }

            // Daily stats
            if (!stats.dailyStats[today]) {
                stats.dailyStats[today] = 0;
            }
            if (data.success) {
                stats.dailyStats[today] += 1;
            }

            // Time slots
            if (hour >= 6 && hour < 12) stats.timeSlots.morning++;
            else if (hour >= 12 && hour < 18) stats.timeSlots.afternoon++;
            else if (hour >= 18 && hour < 24) stats.timeSlots.evening++;
            else stats.timeSlots.night++;

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, message: 'Stats tracked' })
            };

        } else if (action === 'get') {
            // Return current stats
            const stats = global.siteStats;
            const today = new Date().toDateString();
            const todayCount = stats.dailyStats[today] || 0;
            
            // Calculate success rate
            const successRate = stats.totalRequests > 0 
                ? Math.round((stats.successCount / stats.totalRequests) * 100) 
                : 0;

            // Calculate active days
            const activeDays = Object.keys(stats.dailyStats).length;

            // Time slot percentages
            const totalTimeSlots = stats.timeSlots.morning + stats.timeSlots.afternoon + 
                                  stats.timeSlots.evening + stats.timeSlots.night;
            
            const timeSlotPercents = totalTimeSlots > 0 ? {
                morning: Math.round((stats.timeSlots.morning / totalTimeSlots) * 100),
                afternoon: Math.round((stats.timeSlots.afternoon / totalTimeSlots) * 100),
                evening: Math.round((stats.timeSlots.evening / totalTimeSlots) * 100),
                night: Math.round((stats.timeSlots.night / totalTimeSlots) * 100)
            } : { morning: 0, afternoon: 0, evening: 0, night: 0 };

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    totalImprovements: stats.totalImprovements,
                    totalAnalyses: stats.totalAnalyses,
                    todayCount,
                    successRate,
                    activeDays,
                    timeSlots: stats.timeSlots,
                    timeSlotPercents,
                    totalRequests: stats.totalRequests,
                    firstUse: stats.firstUse
                })
            };
        }

        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Invalid action' })
        };

    } catch (error) {
        console.error('Stats tracking error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};