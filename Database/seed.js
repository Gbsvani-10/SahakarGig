const db = require('../Backend/db');
const bcrypt = require('bcryptjs');

async function seed() {
    try {
        console.log('Starting Database Seeding...');

        // 1. Clean existing records (Optional: run in order to respect foreign key constraints)
        await db.query('TRUNCATE ratings, invoices, bookings, workers, users, cooperatives CASCADE');

        // 2. Create Cooperative
        const coopRes = await db.query(
            `INSERT INTO cooperatives (name, region) 
             VALUES ($1, $2) 
             RETURNING id`,
            ['Hyderabad Labour Cooperative', 'Telangana']
        );
        const coopId = coopRes.rows[0].id;

        // 3. Create Demo Users (Admin & Customer)
        const hash = await bcrypt.hash('Demo@123', 10);
        const userRes = await db.query(
            `INSERT INTO users (name, email, password_hash, phone, role) VALUES 
             ('Coop Admin', 'demo.admin@sahakargig.local', $1, '9998887770', 'coop_admin'),
             ('John Customer', 'demo.customer@sahakargig.local', $1, '9998887771', 'customer')
             RETURNING id, role`,
            [hash]
        );

        const customerId = userRes.rows.find(u => u.role === 'customer').id;

        // 4. Create Sample Workers using Parameterized Queries
        const workerValues = [
            [coopId, 'Ravi Kumar', '9876543210', 'plumbing', true, true, 4.80, 17.3850, 78.4867],
            [coopId, 'Suresh Reddy', '9876543211', 'electrical', true, true, 4.60, 17.3900, 78.4900],
            [coopId, 'Anil Kumar', '9876543212', 'carpentry', true, true, 4.70, 17.3750, 78.4820],
            [coopId, 'Lakshmi Devi', '9876543213', 'cleaning', true, true, 4.90, 17.3800, 78.4800]
        ];

        const insertedWorkers = [];
        for (const worker of workerValues) {
            const res = await db.query(
                `INSERT INTO workers (cooperative_id, name, phone, skill, is_verified, is_available, rating, latitude, longitude)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                 RETURNING id`,
                worker
            );
            insertedWorkers.push(res.rows[0].id);
        }

        // 5. Create Mock Bookings (Gives immediate visual state to frontend dashboards)
        await db.query(
            `INSERT INTO bookings (customer_id, worker_id, service_type, is_emergency, status, latitude, longitude, amount)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [customerId, insertedWorkers[0], 'plumbing', false, 'completed', 17.3850, 78.4867, 450.00]
        );

        console.log('Database seeded successfully with sample cooperatives, workers, users, and bookings!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
}

seed();