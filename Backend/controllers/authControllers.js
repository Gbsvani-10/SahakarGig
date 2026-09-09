const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      'JWT_SECRET must be configured and contain at least 32 characters.'
    );
  }

  return secret;
};

const normalizeRole = (role) => ({
  worker: 'worker',
  customer: 'customer',
  admin: 'coop_admin',
  coop_admin: 'coop_admin',
}[String(role || '').toLowerCase()] || null);

const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  role: u.role,
  created_at: u.created_at,
});

const signToken = (u) =>
  jwt.sign(
    {
      id: u.id,
      email: u.email,
      role: u.role,
    },
    getJwtSecret(),
    {
      expiresIn: '24h',
    }
  );

const maskId = (value) => {
  const raw = String(value || '').replace(/\s+/g, '');

  return raw.length <= 4
    ? raw
    : `XXXX-XXXX-${raw.slice(-4)}`;
};

const toArray = (value) => {
  if (Array.isArray(value)) return value;

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
};

function workerProfileFromRow(w) {
  if (!w) return null;

  return {
    id: w.id,
    userId: w.user_id,
    fullName: w.name,
    mobile: w.phone,
    email: w.email || '',

    address: w.address || '',
    pincode: w.pincode || '',
    preferredArea: w.preferred_area || '',
    jobType: w.skill || '',

    experienceYears: Number(
      w.experience_years || 0
    ),

    skills: toArray(w.skills),

    preferredWorkType:
      w.preferred_work_type ||
      'Flexible / Gig',

    expectedDailyWage: Number(
      w.expected_daily_wage || 0
    ),

    availability:
      w.availability || 'AVAILABLE',

    certifications: toArray(
      w.certifications
    ),

    identityVerification: {
      idType:
        w.identity_doc_type ||
        'Aadhaar',

      maskedNumber:
        w.identity_doc_number_masked ||
        '',

      verified: Boolean(
        w.is_verified
      ),

      submittedAt:
        w.created_at ||
        new Date().toISOString(),
    },

    emergencyContact: {
      name: w.emergency_name || '',
      phone: w.emergency_phone || '',
      relation:
        w.emergency_relation || '',
    },

    preferredRadiusKm: Number(
      w.preferred_radius_km || 15
    ),

    languages: toArray(
      w.languages
    ),

    bio: w.bio || '',

    workExperienceSummary:
      w.work_experience_summary || '',

    profileCompleteness: Number(
      w.profile_completeness || 0
    ),

    badges: {
      identityVerified: Boolean(
        w.is_verified
      ),
      skillVerified: false,
      certificateVerified: false,
    },

    rating: Number(
      w.rating || 0
    ),

    ratingCount: Number(
      w.review_count || 0
    ),

    totalJobsCompleted: Number(
      w.completed_jobs_count || 0
    ),

    trustScore: Number(
      w.trust_score || 0
    ),

    createdAt: w.created_at,
    updatedAt:
      w.updated_at ||
      w.created_at,
  };
}

function customerProfileFromRow(c) {
  if (!c) return null;

  return {
    id: c.id,
    userId: c.user_id,
    fullName: c.full_name,
    contactNumber: c.contact_number,
    email: c.email,
    address: c.address,
    pincode: c.pincode,

    preferredServiceArea:
      c.preferred_service_area || '',

    commonServicesRequired:
      toArray(
        c.common_services_required
      ),

    savedWorkers: [],

    createdAt: c.created_at,
  };
}

async function insertUser({
  name,
  email,
  phone,
  password,
  role,
}) {
  const hash = await bcrypt.hash(
    String(password),
    10
  );

  const result = await db.query(
    `
      INSERT INTO users
        (name, email, password_hash, phone, role)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING
        id,
        name,
        email,
        phone,
        role,
        created_at
    `,
    [
      String(name).trim(),
      String(email).trim().toLowerCase(),
      hash,
      String(phone).trim(),
      role,
    ]
  );

  return result.rows[0];
}

/*
|--------------------------------------------------------------------------
| Generic registration
|--------------------------------------------------------------------------
*/

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role,
    } = req.body || {};

    const normalizedRole =
      normalizeRole(role);

    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !normalizedRole ||
      normalizedRole === 'coop_admin'
    ) {
      return res.status(400).json({
        error:
          'Name, email, phone, password and a customer/worker role are required.',
      });
    }

    const user = await insertUser({
      name,
      email,
      phone,
      password,
      role: normalizedRole,
    });

    return res.status(201).json({
      token: signToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    console.error(
      'Registration error:',
      error
    );

    return res
      .status(error.code === '23505' ? 409 : 500)
      .json({
        error:
          error.code === '23505'
            ? 'An account with this email or phone already exists.'
            : 'Registration failed.',
      });
  }
};

/*
|--------------------------------------------------------------------------
| Customer registration
|--------------------------------------------------------------------------
*/

exports.registerCustomer = async (
  req,
  res
) => {
  try {
    const {
      fullName,
      contactNumber,
      email,
      password,
      address,
      pincode,
      preferredServiceArea = '',
      commonServicesRequired = [],
    } = req.body || {};

    if (
      !fullName ||
      !contactNumber ||
      !email ||
      !password ||
      !address ||
      !pincode
    ) {
      return res.status(400).json({
        error:
          'Please complete all required customer registration fields.',
      });
    }

    const user = await insertUser({
      name: fullName,
      email,
      phone: contactNumber,
      password,
      role: 'customer',
    });

    let row;

    if (db.isPostgresConnected()) {
      row = (
        await db.query(
          `
            INSERT INTO customer_profiles
              (
                user_id,
                full_name,
                contact_number,
                email,
                address,
                pincode,
                preferred_service_area,
                common_services_required
              )
            VALUES
              ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *
          `,
          [
            user.id,
            fullName.trim(),
            contactNumber.trim(),
            email.trim().toLowerCase(),
            address.trim(),
            String(pincode).trim(),
            String(
              preferredServiceArea || ''
            ).trim(),
            JSON.stringify(
              toArray(
                commonServicesRequired
              )
            ),
          ]
        )
      ).rows[0];
    } else {
      row = {
        id: `customer-${Date.now()}`,
        user_id: user.id,
        full_name: fullName.trim(),
        contact_number:
          contactNumber.trim(),
        email:
          email.trim().toLowerCase(),
        address: address.trim(),
        pincode: String(pincode).trim(),
        preferred_service_area:
          String(
            preferredServiceArea || ''
          ).trim(),
        common_services_required:
          toArray(
            commonServicesRequired
          ),
        created_at:
          new Date().toISOString(),
      };

      db.getStore()
        .customer_profiles
        .push(row);
    }

    return res.status(201).json({
      token: signToken(user),
      user: publicUser(user),
      customerProfile:
        customerProfileFromRow(row),
    });
  } catch (error) {
    console.error(
      'Customer registration error:',
      error
    );

    return res
      .status(
        error.code === '23505'
          ? 409
          : 500
      )
      .json({
        error:
          error.code === '23505'
            ? 'An account with this email or phone already exists.'
            : 'Customer registration failed.',
      });
  }
};

/*
|--------------------------------------------------------------------------
| Worker registration
|--------------------------------------------------------------------------
*/

exports.registerWorker = async (
  req,
  res
) => {
  try {
    const {
      fullName,
      email,
      mobile,
      password,
      address,
      pincode,
      preferredArea,
      jobType,
      experienceYears,
      skills = [],
      preferredWorkType,
      expectedDailyWage,
      availability,
      certifications = [],
      identityDocType,
      identityDocNumber,
      identityProofFileName = '',
      identityProofData = '',
      emergencyContact = {},
      preferredRadiusKm,
      languages = [],
      bio = '',
      workExperienceSummary = '',
    } = req.body || {};

    /*
    |--------------------------------------------------------------------------
    | Required fields validation
    |--------------------------------------------------------------------------
    */

    if (
      !fullName ||
      !email ||
      !mobile ||
      !password ||
      !address ||
      !pincode ||
      !jobType ||
      !identityDocType ||
      !identityDocNumber
    ) {
      return res.status(400).json({
        error:
          'Please complete all required worker onboarding fields and identity verification.',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Normalize arrays
    |--------------------------------------------------------------------------
    */

    const workerSkills =
      toArray(skills);

    const workerCertifications =
      toArray(certifications);

    const workerLanguages =
      toArray(languages);

    /*
    |--------------------------------------------------------------------------
    | Profile completeness
    |--------------------------------------------------------------------------
    */

    const completenessFields = [
      fullName,
      mobile,
      email,
      address,
      pincode,
      workerSkills.length > 0,
      expectedDailyWage,
      identityDocNumber,
      workerCertifications.length > 0,
      preferredArea,
      experienceYears,
      emergencyContact?.name,
      emergencyContact?.phone,
      workerLanguages.length > 0,
      bio,
    ];

    const completeness = Math.min(
      100,
      Math.round(
        (completenessFields.filter(
          Boolean
        ).length /
          completenessFields.length) *
          100
      )
    );

    /*
    |--------------------------------------------------------------------------
    | Create user
    |--------------------------------------------------------------------------
    */

    const user = await insertUser({
      name: fullName,
      email,
      phone: mobile,
      password,
      role: 'worker',
    });

    /*
    |--------------------------------------------------------------------------
    | Worker data
    |--------------------------------------------------------------------------
    */

    const workerId =
      `worker-${Date.now()}`;

    const workerData = {
      id: workerId,
      user_id: user.id,

      name: fullName.trim(),
      phone: mobile.trim(),

      skill: String(
        jobType
      ).trim(),

      is_verified: false,

      is_available:
        availability !==
        'NOT_AVAILABLE',

      address:
        address.trim(),

      pincode:
        String(pincode).trim(),

      preferred_area:
        String(
          preferredArea ||
            address
        ).trim(),

      experience_years:
        Number(
          experienceYears || 0
        ),

      skills:
        workerSkills,

      preferred_work_type:
        preferredWorkType ||
        'Flexible / Gig',

      expected_daily_wage:
        Number(
          expectedDailyWage || 0
        ),

      availability:
        availability ||
        'AVAILABLE',

      certifications:
        workerCertifications,

      identity_doc_type:
        identityDocType,

      identity_doc_number_masked:
        maskId(
          identityDocNumber
        ),

      identity_doc_filename:
        identityProofFileName,

      identity_doc_data:
        identityProofData,

      emergency_name:
        emergencyContact?.name ||
        '',

      emergency_phone:
        emergencyContact?.phone ||
        '',

      emergency_relation:
        emergencyContact?.relation ||
        '',

      preferred_radius_km:
        Number(
          preferredRadiusKm || 15
        ),

      languages:
        workerLanguages,

      bio:
        String(
          bio || ''
        ).trim(),

      work_experience_summary:
        String(
          workExperienceSummary ||
            ''
        ).trim(),

      profile_completeness:
        completeness,

      rating: 0,

      review_count: 0,

      completed_jobs_count: 0,

      trust_score: 0,

      created_at:
        new Date().toISOString(),

      updated_at:
        new Date().toISOString(),
    };

    /*
    |--------------------------------------------------------------------------
    | Save worker in PostgreSQL
    |--------------------------------------------------------------------------
    */

    let row;

    if (db.isPostgresConnected()) {
      row = (
        await db.query(
          `
            INSERT INTO workers
            (
              id,
              user_id,
              name,
              phone,
              skill,
              is_verified,
              is_available,
              address,
              pincode,
              preferred_area,
              experience_years,
              skills,
              preferred_work_type,
              expected_daily_wage,
              availability,
              certifications,
              identity_doc_type,
              identity_doc_number_masked,
              identity_doc_filename,
              identity_doc_data,
              emergency_name,
              emergency_phone,
              emergency_relation,
              preferred_radius_km,
              languages,
              bio,
              work_experience_summary,
              profile_completeness,
              rating,
              review_count,
              completed_jobs_count,
              trust_score
            )
            VALUES
            (
              $1,$2,$3,$4,$5,
              FALSE,$6,$7,$8,$9,$10,
              $11,$12,$13,$14,$15,$16,
              $17,$18,$19,$20,$21,$22,
              $23,$24,$25,$26,$27,$28,
              $29,$30,$31
            )
            RETURNING *
          `,
          [
            workerData.id,
            workerData.user_id,
            workerData.name,
            workerData.phone,
            workerData.skill,
            workerData.is_available,
            workerData.address,
            workerData.pincode,
            workerData.preferred_area,
            workerData.experience_years,

            JSON.stringify(
              workerData.skills
            ),

            workerData.preferred_work_type,
            workerData.expected_daily_wage,
            workerData.availability,

            JSON.stringify(
              workerData.certifications
            ),

            workerData.identity_doc_type,
            workerData.identity_doc_number_masked,
            workerData.identity_doc_filename,
            workerData.identity_doc_data,

            workerData.emergency_name,
            workerData.emergency_phone,
            workerData.emergency_relation,

            workerData.preferred_radius_km,

            JSON.stringify(
              workerData.languages
            ),

            workerData.bio,
            workerData.work_experience_summary,
            workerData.profile_completeness,

            workerData.rating,
            workerData.review_count,
            workerData.completed_jobs_count,
            workerData.trust_score,
          ]
        )
      ).rows[0];
    } else {
      row = {
        ...workerData,
      };

      db.getStore()
        .workers
        .push(row);
    }

    /*
    |--------------------------------------------------------------------------
    | Successful registration response
    |--------------------------------------------------------------------------
    */

    return res.status(201).json({
      token: signToken(user),

      user: publicUser(user),

      workerProfile:
        workerProfileFromRow({
          ...row,
          email: user.email,
        }),
    });
  } catch (error) {
    console.error(
      'Worker registration error:',
      error
    );

    return res
      .status(
        error.code === '23505'
          ? 409
          : 500
      )
      .json({
        error:
          error.code === '23505'
            ? 'An account with this email or phone already exists.'
            : 'Worker registration failed.',
      });
  }
};

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

exports.login = async (
  req,
  res
) => {
  try {
    const {
      identifier,
      email,
      password,
      expectedRole,
    } = req.body || {};

    const loginId = String(
      identifier ||
        email ||
        ''
    ).trim();

    if (!loginId || !password) {
      return res.status(400).json({
        error:
          'Email/mobile and password are required.',
      });
    }

    let user;

    if (db.isPostgresConnected()) {
      user = (
        await db.query(
          `
            SELECT *
            FROM users
            WHERE
              lower(email) = lower($1)
              OR phone = $1
            LIMIT 1
          `,
          [loginId]
        )
      ).rows[0];
    } else {
      user = db
        .getStore()
        .users
        .find(
          (u) =>
            u.email.toLowerCase() ===
              loginId.toLowerCase() ||
            String(u.phone) ===
              loginId
        );
    }

    if (!user) {
      return res.status(404).json({
        error:
          'Account not found.',
      });
    }

    if (
      expectedRole &&
      normalizeRole(
        expectedRole
      ) !== user.role
    ) {
      return res.status(403).json({
        error:
          'This account does not belong to the selected portal.',
      });
    }

    const passwordValid =
      await bcrypt.compare(
        String(password),
        user.password_hash
      );

    if (!passwordValid) {
      return res.status(401).json({
        error:
          'Invalid credentials.',
      });
    }

    let profile = null;

    /*
    |--------------------------------------------------------------------------
    | Worker profile
    |--------------------------------------------------------------------------
    */

    if (user.role === 'worker') {
      const row =
        db.isPostgresConnected()
          ? (
              await db.query(
                `
                  SELECT
                    w.*,
                    u.email
                  FROM workers w
                  JOIN users u
                    ON u.id = w.user_id
                  WHERE w.user_id = $1
                `,
                [user.id]
              )
            ).rows[0]
          : db
              .getStore()
              .workers
              .find(
                (w) =>
                  String(
                    w.user_id
                  ) ===
                  String(user.id)
              );

      profile =
        workerProfileFromRow({
          ...row,
          email: user.email,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Customer profile
    |--------------------------------------------------------------------------
    */

    if (user.role === 'customer') {
      const row =
        db.isPostgresConnected()
          ? (
              await db.query(
                `
                  SELECT *
                  FROM customer_profiles
                  WHERE user_id = $1
                `,
                [user.id]
              )
            ).rows[0]
          : db
              .getStore()
              .customer_profiles
              .find(
                (c) =>
                  String(
                    c.user_id
                  ) ===
                  String(user.id)
              );

      profile =
        customerProfileFromRow(
          row
        );
    }

    return res.json({
      token: signToken(user),
      user: publicUser(user),
      profile,
    });
  } catch (error) {
    console.error(
      'Login error:',
      error
    );

    return res.status(500).json({
      error:
        'Login server error.',
    });
  }
};

/*
|--------------------------------------------------------------------------
| Current logged-in user
|--------------------------------------------------------------------------
*/

exports.me = async (
  req,
  res
) => {
  try {
    let user;

    if (db.isPostgresConnected()) {
      user = (
        await db.query(
          `
            SELECT
              id,
              name,
              email,
              phone,
              role,
              created_at
            FROM users
            WHERE id = $1
          `,
          [req.user.id]
        )
      ).rows[0];
    } else {
      user = db
        .getStore()
        .users
        .find(
          (u) =>
            String(u.id) ===
            String(req.user.id)
        );
    }

    if (!user) {
      return res.status(404).json({
        error:
          'User not found.',
      });
    }

    let profile = null;

    if (user.role === 'worker') {
      const row =
        db.isPostgresConnected()
          ? (
              await db.query(
                `
                  SELECT
                    w.*,
                    u.email
                  FROM workers w
                  JOIN users u
                    ON u.id = w.user_id
                  WHERE w.user_id = $1
                `,
                [user.id]
              )
            ).rows[0]
          : db
              .getStore()
              .workers
              .find(
                (w) =>
                  String(
                    w.user_id
                  ) ===
                  String(user.id)
              );

      profile =
        workerProfileFromRow({
          ...row,
          email: user.email,
        });
    }

    if (user.role === 'customer') {
      const row =
        db.isPostgresConnected()
          ? (
              await db.query(
                `
                  SELECT *
                  FROM customer_profiles
                  WHERE user_id = $1
                `,
                [user.id]
              )
            ).rows[0]
          : db
              .getStore()
              .customer_profiles
              .find(
                (c) =>
                  String(
                    c.user_id
                  ) ===
                  String(user.id)
              );

      profile =
        customerProfileFromRow(
          row
        );
    }

    return res.json({
      user: publicUser(user),
      profile,
    });
  } catch (error) {
    console.error(
      'Load account error:',
      error
    );

    return res.status(500).json({
      error:
        'Failed to load account.',
    });
  }
};
