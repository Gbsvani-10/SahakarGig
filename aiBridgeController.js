const axios = require('axios');

exports.getDemandForecast = async (req, res) => {
  const { serviceType, historicalCounts } = req.body || {};
  if (!serviceType || !Array.isArray(historicalCounts) || historicalCounts.length < 3 || historicalCounts.some(n => !Number.isFinite(Number(n)) || Number(n) < 0)) {
    return res.status(400).json({ error: 'serviceType and at least 3 non-negative historical demand values are required.' });
  }
  const aiUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
  try {
    const aiResponse = await axios.post(`${aiUrl.replace(/\/$/, '')}/predict-demand`, { service_type: serviceType, historical_daily_counts: historicalCounts.map(Number) }, { timeout: 10000 });
    res.json({ success: true, data: aiResponse.data, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('AI forecast error:', err.message);
    res.status(503).json({ error: 'AI forecasting service is unavailable. Check AI_SERVICE_URL and the AI service health endpoint.' });
  }
};
