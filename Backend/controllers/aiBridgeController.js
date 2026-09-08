// controllers/aiBridgeController.js
const axios = require('axios');

exports.getDemandForecast = async (req, res) => {
    const { serviceType, historicalCounts } = req.body;
    try {
        const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/predict-demand`, {
            service_type: serviceType,
            historical_daily_counts: historicalCounts
        });
        res.status(200).json(aiResponse.data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to communicate with AI forecasting service.' });
    }
};