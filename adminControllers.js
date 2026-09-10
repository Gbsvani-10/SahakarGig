const db = require('../db');

exports.getCooperativeMetrics = async (req, res) => {
  try {
    const [workers, jobs, ratings, partners] = await Promise.all([
      db.query(`SELECT COUNT(*) total_workers, COUNT(*) FILTER (WHERE is_available AND is_verified) active_workers, COUNT(*) FILTER (WHERE NOT is_verified) pending_verifications FROM workers`),
      db.query(`SELECT COUNT(*) FILTER (WHERE DATE(created_at)=CURRENT_DATE) jobs_today, COUNT(*) FILTER (WHERE status='completed') completed_jobs_total, COUNT(*) FILTER (WHERE status='requested') pending_jobs, COALESCE(SUM(amount) FILTER (WHERE status='completed'),0) gross_value, COALESCE(SUM(amount*0.07) FILTER (WHERE status='completed'),0) welfare_value FROM bookings`),
      db.query(`SELECT COALESCE(AVG(rating_score),0) average_rating FROM ratings`),
      db.query(`SELECT COUNT(*) total FROM cooperatives`)
    ]);
    const w=workers.rows[0],j=jobs.rows[0],r=ratings.rows[0],p=partners.rows[0];
    const data={totalWorkers:Number(w.total_workers),activeWorkers:Number(w.active_workers),pendingVerifications:Number(w.pending_verifications),jobsToday:Number(j.jobs_today),completedJobsTotal:Number(j.completed_jobs_total),pendingJobs:Number(j.pending_jobs),averageRating:Number(Number(r.average_rating).toFixed(2)),grossTransactionValue:Number(j.gross_value),workerWelfareDisbursed:Number(j.welfare_value),cooperativePartnersCount:Number(p.total)};
    res.json({success:true,data,timestamp:new Date().toISOString()});
  } catch(err){ console.error('Admin metrics error:',err); res.status(500).json({error:'Failed to fetch dashboard metrics'}); }
};
