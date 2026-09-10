const db = require('../db');

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function getWorkerId(req) {
  return req.user?.workerId || req.user?.worker_id || null;
}

async function findWorker(req) {
  const userId = req.user?.id;

  if (!userId) {
    return null;
  }

  const result = await db.query(
    `
      SELECT
        id,
        user_id,
        name,
        phone,
        email,
        expected_daily_wage,
        skills,
        insurance_active,
        policy_number,
        insurance_valid_until,
        welfare_scheme_name
      FROM workers
      WHERE user_id = $1
      LIMIT 1
    `,
    [userId]
  );

  return result.rows[0] || null;
}

function getTier(amount) {
  const contribution = Number(amount);

  if (contribution === 10) {
    return 'Basic Protection';
  }

  if (contribution === 20) {
    return 'Standard Protection';
  }

  if (contribution === 30) {
    return 'Enhanced Protection';
  }

  return null;
}

function createReference() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random()
    .toString(36)
    .substring(2, 7)
    .toUpperCase();

  return `SG-INS-${timestamp}-${random}`;
}

function createPolicyNumber() {
  const timestamp = Date.now().toString().slice(-8);

  return `SGPOL-${timestamp}`;
}

function mapInsuranceRecord(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    status: row.status,
    selectedContribution:
      row.selected_contribution !== null
        ? Number(row.selected_contribution)
        : null,
    tier: row.tier,
    reference: row.reference,
    referenceCode: row.reference,
    policy: row.policy,
    enrolledAt: row.enrolled_at,
    consent: row.consent,
    coverageDetails:
      row.coverage_details || {},
  };
}

/*
|--------------------------------------------------------------------------
| GET /api/insurance/worker
|--------------------------------------------------------------------------
*/

exports.getWorkerProfile = async (req, res) => {
  try {
    const worker = await findWorker(req);

    if (!worker) {
      return res.status(404).json({
        error: 'Worker profile not found.',
      });
    }

    const dailyEarnings = Number(
      worker.expected_daily_wage || 0
    );

    return res.json({
      id: worker.id,
      userId: worker.user_id,
      name: worker.name,
      fullName: worker.name,
      dailyEarnings,
      expectedDailyWage: dailyEarnings,
      phone: worker.phone,
      email: worker.email,
      skills: worker.skills || [],
    });
  } catch (error) {
    console.error(
      '[Insurance] Worker profile error:',
      error
    );

    return res.status(500).json({
      error: 'Unable to load worker insurance profile.',
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET /api/insurance/record
|--------------------------------------------------------------------------
*/

exports.getInsuranceRecord = async (req, res) => {
  try {
    const worker = await findWorker(req);

    if (!worker) {
      return res.status(404).json({
        error: 'Worker profile not found.',
      });
    }

    const result = await db.query(
      `
        SELECT
          id,
          status,
          selected_contribution,
          tier,
          reference,
          policy,
          enrolled_at,
          consent,
          coverage_details
        FROM insurance_records
        WHERE worker_id = $1
        LIMIT 1
      `,
      [worker.id]
    );

    if (result.rows.length === 0) {
      return res.json(null);
    }

    return res.json(
      mapInsuranceRecord(result.rows[0])
    );
  } catch (error) {
    console.error(
      '[Insurance] Record error:',
      error
    );

    return res.status(500).json({
      error: 'Unable to load insurance record.',
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET /api/insurance/contributions
|--------------------------------------------------------------------------
*/

exports.getContributionHistory = async (req, res) => {
  try {
    const worker = await findWorker(req);

    if (!worker) {
      return res.status(404).json({
        error: 'Worker profile not found.',
      });
    }

    const result = await db.query(
      `
        SELECT
          id,
          amount,
          status,
          contribution_date
        FROM insurance_contributions
        WHERE worker_id = $1
        ORDER BY contribution_date DESC
      `,
      [worker.id]
    );

    const history = result.rows.map((row) => ({
      id: row.id,
      amount: Number(row.amount || 0),
      contributionAmount: Number(
        row.amount || 0
      ),
      date: row.contribution_date,
      status: row.status,
    }));

    return res.json(history);
  } catch (error) {
    console.error(
      '[Insurance] Contribution history error:',
      error
    );

    return res.status(500).json({
      error: 'Unable to load contribution history.',
    });
  }
};

/*
|--------------------------------------------------------------------------
| POST /api/insurance/enroll
|--------------------------------------------------------------------------
*/

exports.enrollInsurance = async (req, res) => {
  try {
    const worker = await findWorker(req);

    if (!worker) {
      return res.status(404).json({
        error: 'Worker profile not found.',
      });
    }

    const selectedContribution = Number(
      req.body?.selectedContribution
    );

    const consent = req.body?.consent === true;

    if (![10, 20, 30].includes(selectedContribution)) {
      return res.status(400).json({
        error:
          'Selected contribution must be ₹10, ₹20, or ₹30 per day.',
      });
    }

    if (!consent) {
      return res.status(400).json({
        error:
          'Consent is required before enrolling in insurance.',
      });
    }

    /*
     * Check whether worker already has an insurance record.
     */

    const existing = await db.query(
      `
        SELECT
          id,
          status,
          selected_contribution,
          tier,
          reference,
          policy,
          enrolled_at,
          consent,
          coverage_details
        FROM insurance_records
        WHERE worker_id = $1
        LIMIT 1
      `,
      [worker.id]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        error:
          'Insurance is already enrolled for this worker.',
        record: mapInsuranceRecord(
          existing.rows[0]
        ),
      });
    }

    const tier = getTier(
      selectedContribution
    );

    const reference = createReference();
    const policy = createPolicyNumber();

    const coverageDetails = {
      dailyContribution: selectedContribution,
      tier,
      emergencySupport: true,
      accidentProtection: true,
      incomeProtection: true,
      platform: 'SahakarGig',
    };

    /*
     * Create insurance record.
     */

    const insuranceResult = await db.query(
      `
        INSERT INTO insurance_records (
          worker_id,
          status,
          selected_contribution,
          tier,
          reference,
          policy,
          enrolled_at,
          consent,
          coverage_details
        )
        VALUES (
          $1,
          'ACTIVE',
          $2,
          $3,
          $4,
          $5,
          CURRENT_TIMESTAMP,
          $6,
          $7::jsonb
        )
        RETURNING
          id,
          status,
          selected_contribution,
          tier,
          reference,
          policy,
          enrolled_at,
          consent,
          coverage_details
      `,
      [
        worker.id,
        selectedContribution,
        tier,
        reference,
        policy,
        consent,
        JSON.stringify(
          coverageDetails
        ),
      ]
    );

    const record =
      insuranceResult.rows[0];

    /*
     * Store the first contribution.
     */

    await db.query(
      `
        INSERT INTO insurance_contributions (
          worker_id,
          insurance_record_id,
          amount,
          status,
          contribution_date
        )
        VALUES (
          $1,
          $2,
          $3,
          'PAID',
          CURRENT_TIMESTAMP
        )
      `,
      [
        worker.id,
        record.id,
        selectedContribution,
      ]
    );

    /*
     * Update worker insurance status.
     */

    await db.query(
      `
        UPDATE workers
        SET
          insurance_active = TRUE,
          policy_number = $2,
          insurance_valid_until =
            CURRENT_DATE + INTERVAL '1 year',
          welfare_scheme_name = $3,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `,
      [
        worker.id,
        policy,
        'SahakarGig Micro-Insurance',
      ]
    );

    return res.status(201).json(
      mapInsuranceRecord(record)
    );
  } catch (error) {
    console.error(
      '[Insurance] Enrollment error:',
      error
    );

    /*
     * PostgreSQL duplicate constraint.
     */

    if (error.code === '23505') {
      return res.status(409).json({
        error:
          'Insurance enrollment already exists for this worker.',
      });
    }

    return res.status(500).json({
      error: 'Unable to enroll worker in insurance.',
    });
  }
};

/*
|--------------------------------------------------------------------------
| POST /api/insurance/adjust
|--------------------------------------------------------------------------
*/

exports.adjustContribution = async (req, res) => {
  try {
    const worker = await findWorker(req);

    if (!worker) {
      return res.status(404).json({
        error: 'Worker profile not found.',
      });
    }

    const selectedContribution = Number(
      req.body?.selectedContribution
    );

    if (![10, 20, 30].includes(selectedContribution)) {
      return res.status(400).json({
        error:
          'Selected contribution must be ₹10, ₹20, or ₹30 per day.',
      });
    }

    const existing = await db.query(
      `
        SELECT
          id,
          status,
          selected_contribution,
          tier,
          reference,
          policy,
          enrolled_at,
          consent,
          coverage_details
        FROM insurance_records
        WHERE worker_id = $1
        LIMIT 1
      `,
      [worker.id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        error:
          'Insurance record not found. Enroll first.',
      });
    }

    const record = existing.rows[0];

    if (record.status !== 'ACTIVE') {
      return res.status(400).json({
        error:
          'Only active insurance plans can be adjusted.',
      });
    }

    const tier = getTier(
      selectedContribution
    );

    const updatedCoverageDetails = {
      ...(record.coverage_details || {}),
      dailyContribution: selectedContribution,
      tier,
    };

    const result = await db.query(
      `
        UPDATE insurance_records
        SET
          selected_contribution = $2,
          tier = $3,
          coverage_details = $4::jsonb,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING
          id,
          status,
          selected_contribution,
          tier,
          reference,
          policy,
          enrolled_at,
          consent,
          coverage_details
      `,
      [
        record.id,
        selectedContribution,
        tier,
        JSON.stringify(
          updatedCoverageDetails
        ),
      ]
    );

    /*
     * Record the new contribution.
     */

    await db.query(
      `
        INSERT INTO insurance_contributions (
          worker_id,
          insurance_record_id,
          amount,
          status,
          contribution_date
        )
        VALUES (
          $1,
          $2,
          $3,
          'PAID',
          CURRENT_TIMESTAMP
        )
      `,
      [
        worker.id,
        record.id,
        selectedContribution,
      ]
    );

    return res.json(
      mapInsuranceRecord(
        result.rows[0]
      )
    );
  } catch (error) {
    console.error(
      '[Insurance] Contribution adjustment error:',
      error
    );

    return res.status(500).json({
      error:
        'Unable to update insurance contribution.',
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET /api/insurance/claims
|--------------------------------------------------------------------------
*/

exports.getClaims = async (req, res) => {
  try {
    const worker = await findWorker(req);

    if (!worker) {
      return res.status(404).json({
        error: 'Worker profile not found.',
      });
    }

    const result = await db.query(
      `
        SELECT
          id,
          claim_type,
          description,
          amount,
          status,
          created_at
        FROM insurance_claims
        WHERE worker_id = $1
        ORDER BY created_at DESC
      `,
      [worker.id]
    );

    const claims = result.rows.map((row) => ({
      id: row.id,
      claimType: row.claim_type,
      description: row.description,
      amount:
        row.amount !== null
          ? Number(row.amount)
          : null,
      status: row.status,
      createdAt: row.created_at,
    }));

    return res.json(claims);
  } catch (error) {
    console.error(
      '[Insurance] Claims error:',
      error
    );

    return res.status(500).json({
      error: 'Unable to load insurance claims.',
    });
  }
};

/*
|--------------------------------------------------------------------------
| POST /api/insurance/claims
|--------------------------------------------------------------------------
*/

exports.createClaim = async (req, res) => {
  try {
    const worker = await findWorker(req);

    if (!worker) {
      return res.status(404).json({
        error: 'Worker profile not found.',
      });
    }

    const {
      claimType,
      description,
      amount,
    } = req.body || {};

    if (!claimType || !description) {
      return res.status(400).json({
        error:
          'Claim type and description are required.',
      });
    }

    const insuranceResult = await db.query(
      `
        SELECT
          id,
          status
        FROM insurance_records
        WHERE worker_id = $1
        LIMIT 1
      `,
      [worker.id]
    );

    if (
      insuranceResult.rows.length === 0
    ) {
      return res.status(400).json({
        error:
          'You must enroll in insurance before submitting a claim.',
      });
    }

    const insuranceRecord =
      insuranceResult.rows[0];

    if (
      insuranceRecord.status !== 'ACTIVE'
    ) {
      return res.status(400).json({
        error:
          'Your insurance plan is not currently active.',
      });
    }

    const numericAmount =
      amount === undefined ||
      amount === null ||
      amount === ''
        ? null
        : Number(amount);

    if (
      numericAmount !== null &&
      (!Number.isFinite(numericAmount) ||
        numericAmount < 0)
    ) {
      return res.status(400).json({
        error:
          'Claim amount must be a valid positive number.',
      });
    }

    const result = await db.query(
      `
        INSERT INTO insurance_claims (
          worker_id,
          insurance_record_id,
          claim_type,
          description,
          amount,
          status,
          created_at
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          'SUBMITTED',
          CURRENT_TIMESTAMP
        )
        RETURNING
          id,
          claim_type,
          description,
          amount,
          status,
          created_at
      `,
      [
        worker.id,
        insuranceRecord.id,
        String(claimType).trim(),
        String(description).trim(),
        numericAmount,
      ]
    );

    const claim =
      result.rows[0];

    return res.status(201).json({
      id: claim.id,
      claimType: claim.claim_type,
      description: claim.description,
      amount:
        claim.amount !== null
          ? Number(claim.amount)
          : null,
      status: claim.status,
      createdAt: claim.created_at,
    });
  } catch (error) {
    console.error(
      '[Insurance] Create claim error:',
      error
    );

    return res.status(500).json({
      error: 'Unable to submit insurance claim.',
    });
  }
};
