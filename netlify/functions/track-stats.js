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
            global.siteStats = {
                totalImprovements: 0,
                totalRequests: 0,
                successCount: 0,
                dailyStats: {},
                timeSlots: { morning: 0, afternoon: 0, evening: 0, night: 0 },
                firstUse: new Date().toISOString()
            };
        }

        if (action === 'track') {
            // Track new usage
            const stats = global.siteStats;
            const now = new Date();
            const today = now.toDateString();
            const hour = now.getHours();

            stats.totalRequests += 1;
            if (data.success) {
                stats.successCount += 1;
                stats.totalImprovements += 1;
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