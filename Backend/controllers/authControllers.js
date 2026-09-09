const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/*
|--------------------------------------------------------------------------
| JWT
|--------------------------------------------------------------------------
*/

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      'JWT_SECRET must be configured and contain at least 32 characters.'
    );
  }

  return secret;
};

/*
|--------------------------------------------------------------------------
| Role helpers
|--------------------------------------------------------------------------
*/

const normalizeRole = (role) => ({
  worker: 'worker',
  customer: 'customer',
  admin: 'coop_admin',
  coop_admin: 'coop_admin',
}[String(role || '').toLowerCase()] || null);

/*
|--------------------------------------------------------------------------
| Public user
|--------------------------------------------------------------------------
*/

const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  role: u.role,
  created_at: u.created_at,
});

/*
|--------------------------------------------------------------------------
| JWT token
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Mask identity document number
|--------------------------------------------------------------------------
*/

const maskId = (value) => {
  const raw = String(value || '').replace(/\s+/g, '');

  if (!raw) {
    return '';
  }

  if (raw.length <= 4) {
    return raw;
  }

  return `XXXX-XXXX-${raw.slice(-4)}`;
};

/*
|--------------------------------------------------------------------------
| Convert values into arrays
|--------------------------------------------------------------------------
*/

const toArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
};

/*
|--------------------------------------------------------------------------
| Worker profile mapper
|--------------------------------------------------------------------------
*/

function workerProfileFromRow(worker) {
  if (!worker) {
    return null;
  }

  return {
    id: worker.id,

    userId: worker.user_id,

    fullName: worker.name,

    mobile: worker.phone,

    email: worker.email || '',

    address: worker.address || '',

    pincode: worker.pincode || '',

    preferredArea:
      worker.preferred_area || '',

    jobType:
      worker.skill || '',

    experienceYears: Number(
      worker.experience_years || 0
    ),

    skills: toArray(
      worker.skills
    ),

    preferredWorkType:
      worker.preferred_work_type ||
      'Flexible / Gig',

    expectedDailyWage: Number(
      worker.expected_daily_wage || 0
    ),

    availability:
      worker.availability ||
      'AVAILABLE',

    certifications: toArray(
      worker.certifications
    ),

    identityVerification: {
      idType:
        worker.identity_doc_type ||
        'Aadhaar',

      maskedNumber:
        worker.identity_doc_number_masked ||
        '',

      verified:
        Boolean(worker.is_verified),

      submittedAt:
        worker.created_at ||
        new Date().toISOString(),
    },

    emergencyContact: {
      name:
        worker.emergency_name || '',

      phone:
        worker.emergency_phone || '',

      relation:
        worker.emergency_relation || '',
    },

    preferredRadiusKm: Number(
      worker.preferred_radius_km || 15
    ),

    languages: toArray(
      worker.languages
    ),

    bio: worker.bio || '',

    workExperienceSummary:
      worker.work_experience_summary || '',

    profileCompleteness: Number(
      worker.profile_completeness || 0
    ),

    badges: {
      identityVerified:
        Boolean(worker.is_verified),

      skillVerified: false,

      certificateVerified: false,
    },

    rating: Number(
      worker.rating || 0
    ),

    ratingCount: Number(
      worker.review_count || 0
    ),

    totalJobsCompleted: Number(
      worker.completed_jobs_count || 0
    ),

    trustScore: Number(
      worker.trust_score || 0
    ),

    schedule: worker.schedule || [],

    emergencyAvailable:
      worker.emergency_available !== false,

    hourlyRate: Number(
      worker.hourly_rate || 0
    ),

    priceRange:
      worker.price_range || '',

    insuranceActive:
      Boolean(worker.insurance_active),

    policyNumber:
      worker.policy_number || '',

    insuranceValidUntil:
      worker.insurance_valid_until || null,

    welfareSchemeName:
      worker.welfare_scheme_name || '',

    isVerified:
      Boolean(worker.is_verified),

    isAvailable:
      Boolean(worker.is_available),

    createdAt:
      worker.created_at,

    updatedAt:
      worker.updated_at ||
      worker.created_at,
  };
}

/*
|--------------------------------------------------------------------------
| Customer profile mapper
|--------------------------------------------------------------------------
*/

function customerProfileFromRow(customer) {
  if (!customer) {
    return null;
  }

  return {
    id: customer.id,

    userId: customer.user_id,

    fullName:
      customer.full_name,

    contactNumber:
      customer.contact_number,

    email:
      customer.email,

    address:
      customer.address,

    pincode:
      customer.pincode,

    preferredServiceArea:
      customer.preferred_service_area ||
      '',

    commonServicesRequired:
      toArray(
        customer.common_services_required
      ),

    savedWorkers: [],

    createdAt:
      customer.created_at,

    updatedAt:
      customer.updated_at ||
      customer.created_at,
  };
}

/*
|--------------------------------------------------------------------------
| Insert user
|--------------------------------------------------------------------------
*/

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
        (
          name,
          email,
          password_hash,
          phone,
          role
        )
      VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5
        )
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

      String(email)
        .trim()
        .toLowerCase(),

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

    return res.status(
      error.code === '23505'
        ? 409
        : 500
    ).json({
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

    let profileRow;

    if (db.isPostgresConnected()) {
      profileRow = (
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
            (
              $1,
              $2,
              $3,
              $4,
              $5,
              $6,
              $7,
              $8
            )
            RETURNING *
          `,
          [
            user.id,

            String(fullName).trim(),

            String(contactNumber).trim(),

            String(email)
              .trim()
              .toLowerCase(),

            String(address).trim(),

            String(pincode).trim(),

            String(
              preferredServiceArea || ''
            ).trim(),

            /*
             * PostgreSQL TEXT[] column.
             * pg accepts a JavaScript array directly.
             */
            toArray(
              commonServicesRequired
            ),
          ]
        )
      ).rows[0];
    } else {
      profileRow = {
        id: `customer-${Date.now()}`,

        user_id: user.id,

        full_name:
          String(fullName).trim(),

        contact_number:
          String(contactNumber).trim(),

        email:
          String(email)
            .trim()
            .toLowerCase(),

        address:
          String(address).trim(),

        pincode:
          String(pincode).trim(),

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

        updated_at:
          new Date().toISOString(),
      };

      db.getStore()
        .customer_profiles
        .push(profileRow);
    }

    return res.status(201).json({
      token: signToken(user),

      user: publicUser(user),

      customerProfile:
        customerProfileFromRow(
          profileRow
        ),
    });
  } catch (error) {
    console.error(
      'Customer registration error:',
      error
    );

    return res.status(
      error.code === '23505'
        ? 409
        : 500
    ).json({
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
    | Validate required fields
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
    | Normalize worker arrays
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

    const completedFields =
      completenessFields.filter(
        Boolean
      ).length;

    const completeness = Math.min(
      100,
      Math.round(
        (completedFields /
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
    | Prepare worker data
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    | workers.id is UUID.
    | So we DO NOT generate worker-${Date.now()} here.
    | PostgreSQL generates the UUID automatically.
    |--------------------------------------------------------------------------
    */

    const workerData = {
      user_id: user.id,

      name:
        String(fullName).trim(),

      phone:
        String(mobile).trim(),

      email:
        String(email)
          .trim()
          .toLowerCase(),

      address:
        String(address).trim(),

      pincode:
        String(pincode).trim(),

      preferred_area:
        String(
          preferredArea ||
            address
        ).trim(),

      skill:
        String(jobType).trim(),

      skills:
        workerSkills,

      experience_years:
        Number(
          experienceYears || 0
        ),

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
        String(identityDocType).trim(),

      identity_doc_number_masked:
        maskId(identityDocNumber),

      identity_doc_filename:
        identityProofFileName || '',

      identity_doc_data:
        identityProofData || '',

      emergency_name:
        emergencyContact?.name || '',

      emergency_phone:
        emergencyContact?.phone || '',

      emergency_relation:
        emergencyContact?.relation || '',

      preferred_radius_km:
        Number(
          preferredRadiusKm || 15
        ),

      languages:
        workerLanguages,

      bio:
        String(bio || '').trim(),

      work_experience_summary:
        String(
          workExperienceSummary || ''
        ).trim(),

      profile_completeness:
        completeness,

      rating: 0,

      review_count: 0,

      completed_jobs_count: 0,

      trust_score: 0,

      schedule: [],

      emergency_available: true,

      hourly_rate: 0,

      price_range: '',

      insurance_active: false,

      policy_number: '',

      insurance_valid_until: null,

      welfare_scheme_name: '',

      is_verified: false,

      is_available:
        availability !==
        'NOT_AVAILABLE',
    };

    /*
    |--------------------------------------------------------------------------
    | Save worker to PostgreSQL
    |--------------------------------------------------------------------------
    */

    let workerRow;

    if (db.isPostgresConnected()) {
      workerRow = (
        await db.query(
          `
            INSERT INTO workers
            (
              user_id,
              name,
              phone,
              email,

              address,
              pincode,
              preferred_area,

              skill,
              skills,

              experience_years,

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

              trust_score,

              schedule,

              emergency_available,

              hourly_rate,

              price_range,

              insurance_active,

              policy_number,

              insurance_valid_until,

              welfare_scheme_name,

              is_verified,

              is_available
            )
            VALUES
            (
              $1,
              $2,
              $3,
              $4,

              $5,
              $6,
              $7,

              $8,
              $9,

              $10,

              $11,

              $12,

              $13,

              $14,

              $15,
              $16,
              $17,
              $18,

              $19,
              $20,
              $21,

              $22,

              $23,

              $24,

              $25,

              $26,

              $27,
              $28,

              $29,

              $30,

              $31,

              $32,

              $33,

              $34,

              $35,

              $36,

              $37,

              $38,

              $39,

              $40
            )
            RETURNING *
          `,
          [
            /*
             * $1 - $4
             */
            workerData.user_id,
            workerData.name,
            workerData.phone,
            workerData.email,

            /*
             * $5 - $7
             */
            workerData.address,
            workerData.pincode,
            workerData.preferred_area,

            /*
             * $8 - $9
             */
            workerData.skill,

            /*
             * TEXT[] column.
             * Pass JavaScript array directly.
             */
            workerData.skills,

            /*
             * $10
             */
            workerData.experience_years,

            /*
             * $11
             */
            workerData.preferred_work_type,

            /*
             * $12
             */
            workerData.expected_daily_wage,

            /*
             * $13
             */
            workerData.availability,

            /*
             * $14
             * JSONB column.
             */
            JSON.stringify(
              workerData.certifications
            ),

            /*
             * $15 - $18
             */
            workerData.identity_doc_type,

            workerData.identity_doc_number_masked,

            workerData.identity_doc_filename,

            workerData.identity_doc_data,

            /*
             * $19 - $21
             */
            workerData.emergency_name,

            workerData.emergency_phone,

            workerData.emergency_relation,

            /*
             * $22
             */
            workerData.preferred_radius_km,

            /*
             * $23
             * TEXT[] column.
             */
            workerData.languages,

            /*
             * $24 - $26
             */
            workerData.bio,

            workerData.work_experience_summary,

            workerData.profile_completeness,

            /*
             * $27 - $30
             */
            workerData.rating,

            workerData.review_count,

            workerData.completed_jobs_count,

            workerData.trust_score,

            /*
             * $31
             * JSONB
             */
            JSON.stringify(
              workerData.schedule
            ),

            /*
             * $32
             */
            workerData.emergency_available,

            /*
             * $33
             */
            workerData.hourly_rate,

            /*
             * $34
             */
            workerData.price_range,

            /*
             * $35
             */
            workerData.insurance_active,

            /*
             * $36
             */
            workerData.policy_number,

            /*
             * $37
             */
            workerData.insurance_valid_until,

            /*
             * $38
             */
            workerData.welfare_scheme_name,

            /*
             * $39 - $40
             */
            workerData.is_verified,

            workerData.is_available,
          ]
        )
      ).rows[0];
    } else {
      /*
       * Development-only fallback.
       */

      workerRow = {
        id: `worker-${Date.now()}`,

        ...workerData,

        created_at:
          new Date().toISOString(),

        updated_at:
          new Date().toISOString(),
      };

      db.getStore()
        .workers
        .push(workerRow);
    }

    /*
    |--------------------------------------------------------------------------
    | Registration successful
    |--------------------------------------------------------------------------
    */

    return res.status(201).json({
      token: signToken(user),

      user: publicUser(user),

      workerProfile:
        workerProfileFromRow({
          ...workerRow,

          email: user.email,
        }),
    });
  } catch (error) {
    console.error(
      'Worker registration error:',
      error
    );

    return res.status(
      error.code === '23505'
        ? 409
        : 500
    ).json({
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

    /*
    |--------------------------------------------------------------------------
    | Find user
    |--------------------------------------------------------------------------
    */

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
          (item) =>
            (
              item.email &&
              item.email.toLowerCase() ===
                loginId.toLowerCase()
            ) ||
            String(item.phone) ===
              loginId
        );
    }

    if (!user) {
      return res.status(404).json({
        error:
          'Account not found.',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Verify selected role
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Verify password
    |--------------------------------------------------------------------------
    */

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
      let workerRow;

      if (db.isPostgresConnected()) {
        workerRow = (
          await db.query(
            `
              SELECT
                w.*,
                u.email
              FROM workers w
              JOIN users u
                ON u.id = w.user_id
              WHERE w.user_id = $1
              LIMIT 1
            `,
            [user.id]
          )
        ).rows[0];
      } else {
        workerRow = db
          .getStore()
          .workers
          .find(
            (worker) =>
              String(
                worker.user_id
              ) ===
              String(user.id)
          );
      }

      if (workerRow) {
        profile =
          workerProfileFromRow({
            ...workerRow,
            email: user.email,
          });
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Customer profile
    |--------------------------------------------------------------------------
    */

    if (user.role === 'customer') {
      let customerRow;

      if (db.isPostgresConnected()) {
        customerRow = (
          await db.query(
            `
              SELECT *
              FROM customer_profiles
              WHERE user_id = $1
              LIMIT 1
            `,
            [user.id]
          )
        ).rows[0];
      } else {
        customerRow = db
          .getStore()
          .customer_profiles
          .find(
            (customer) =>
              String(
                customer.user_id
              ) ===
              String(user.id)
          );
      }

      if (customerRow) {
        profile =
          customerProfileFromRow(
            customerRow
          );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Load user
    |--------------------------------------------------------------------------
    */

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
            LIMIT 1
          `,
          [req.user.id]
        )
      ).rows[0];
    } else {
      user = db
        .getStore()
        .users
        .find(
          (item) =>
            String(item.id) ===
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

    /*
    |--------------------------------------------------------------------------
    | Worker
    |--------------------------------------------------------------------------
    */

    if (user.role === 'worker') {
      let workerRow;

      if (db.isPostgresConnected()) {
        workerRow = (
          await db.query(
            `
              SELECT
                w.*,
                u.email
              FROM workers w
              JOIN users u
                ON u.id = w.user_id
              WHERE w.user_id = $1
              LIMIT 1
            `,
            [user.id]
          )
        ).rows[0];
      } else {
        workerRow = db
          .getStore()
          .workers
          .find(
            (worker) =>
              String(
                worker.user_id
              ) ===
              String(user.id)
          );
      }

      if (workerRow) {
        profile =
          workerProfileFromRow({
            ...workerRow,
            email: user.email,
          });
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Customer
    |--------------------------------------------------------------------------
    */

    if (user.role === 'customer') {
      let customerRow;

      if (db.isPostgresConnected()) {
        customerRow = (
          await db.query(
            `
              SELECT *
              FROM customer_profiles
              WHERE user_id = $1
              LIMIT 1
            `,
            [user.id]
          )
        ).rows[0];
      } else {
        customerRow = db
          .getStore()
          .customer_profiles
          .find(
            (customer) =>
              String(
                customer.user_id
              ) ===
              String(user.id)
          );
      }

      if (customerRow) {
        profile =
          customerProfileFromRow(
            customerRow
          );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

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
