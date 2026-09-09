const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) throw new Error('JWT_SECRET must be configured and contain at least 32 characters.');
  return secret;
};
const normalizeRole = (role) => ({ worker: 'worker', customer: 'customer', admin: 'coop_admin', coop_admin: 'coop_admin' }[String(role || '').toLowerCase()] || null);
const publicUser = (u) => ({ id:u.id, name:u.name, email:u.email, phone:u.phone, role:u.role, created_at:u.created_at });
const signToken = (u) => jwt.sign({ id:u.id, email:u.email, role:u.role }, getJwtSecret(), { expiresIn:'24h' });
const maskId = (v) => { const raw=String(v||'').replace(/\s+/g,''); return raw.length<=4?raw:`XXXX-XXXX-${raw.slice(-4)}`; };

function workerProfileFromRow(w) {
  if (!w) return null;
  return {
    id:w.id,userId:w.user_id,fullName:w.name,mobile:w.phone,email:w.email||'',address:w.address||'',pincode:w.pincode||'',preferredArea:w.preferred_area||'',jobType:w.skill||'',experienceYears:Number(w.experience_years||0),
    skills:Array.isArray(w.skills)?w.skills:[],preferredWorkType:w.preferred_work_type||'Flexible / Gig',expectedDailyWage:Number(w.expected_daily_wage||0),availability:w.availability||'AVAILABLE',
    certifications:Array.isArray(w.certifications)?w.certifications:[],identityVerification:{idType:w.identity_doc_type||'Aadhaar',maskedNumber:w.identity_doc_number_masked||'',verified:Boolean(w.is_verified),submittedAt:w.created_at||new Date().toISOString()},
    emergencyContact:{name:w.emergency_name||'',phone:w.emergency_phone||'',relation:w.emergency_relation||''},preferredRadiusKm:Number(w.preferred_radius_km||15),languages:Array.isArray(w.languages)?w.languages:[],bio:w.bio||'',workExperienceSummary:w.work_experience_summary||'',profileCompleteness:Number(w.profile_completeness||0),
    badges:{identityVerified:Boolean(w.is_verified),skillVerified:false,certificateVerified:false},rating:Number(w.rating||0),ratingCount:0,totalJobsCompleted:0,trustScore:0,createdAt:w.created_at,updatedAt:w.updated_at||w.created_at
  };
}
function customerProfileFromRow(c) {
  if (!c) return null;
  return { id:c.id,userId:c.user_id,fullName:c.full_name,contactNumber:c.contact_number,email:c.email,address:c.address,pincode:c.pincode,preferredServiceArea:c.preferred_service_area||'',commonServicesRequired:Array.isArray(c.common_services_required)?c.common_services_required:[],savedWorkers:[],createdAt:c.created_at };
}
async function insertUser({name,email,phone,password,role}) {
  const hash=await bcrypt.hash(password,10);
  return (await db.query(`INSERT INTO users (name,email,password_hash,phone,role) VALUES ($1,$2,$3,$4,$5) RETURNING id,name,email,phone,role,created_at`,[name,email.toLowerCase(),hash,phone,role])).rows[0];
}

exports.register = async (req,res) => {
  try {
    const {name,email,password,phone,role}=req.body||{}; const r=normalizeRole(role);
    if(!name||!email||!password||!phone||!r||r==='coop_admin') return res.status(400).json({error:'Name, email, phone, password and a customer/worker role are required.'});
    const user=await insertUser({name:String(name).trim(),email:String(email).trim(),phone:String(phone).trim(),password:String(password),role:r});
    res.status(201).json({token:signToken(user),user:publicUser(user)});
  } catch(e){ console.error(e.message); res.status(e.code==='23505'?409:500).json({error:e.code==='23505'?'An account with this email already exists.':'Registration failed.'}); }
};

exports.registerCustomer = async (req,res) => {
  try {
    const {fullName,contactNumber,email,password,address,pincode,preferredServiceArea='',commonServicesRequired=[]}=req.body||{};
    if(!fullName||!contactNumber||!email||!password||!address||!pincode) return res.status(400).json({error:'Please complete all required customer registration fields.'});
    const user=await insertUser({name:fullName.trim(),email:email.trim(),phone:contactNumber.trim(),password,role:'customer'});
    let row;
    if(db.isPostgresConnected()) row=(await db.query(`INSERT INTO customer_profiles (user_id,full_name,contact_number,email,address,pincode,preferred_service_area,common_services_required) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,[user.id,fullName.trim(),contactNumber.trim(),email.trim().toLowerCase(),address.trim(),String(pincode).trim(),preferredServiceArea.trim(),commonServicesRequired||[]])).rows[0];
    else { row={id:`customer-${Date.now()}`,user_id:user.id,full_name:fullName.trim(),contact_number:contactNumber.trim(),email:email.trim().toLowerCase(),address:address.trim(),pincode:String(pincode).trim(),preferred_service_area:preferredServiceArea.trim(),common_services_required:commonServicesRequired||[],created_at:new Date().toISOString()}; db.getStore().customer_profiles.push(row); }
    res.status(201).json({token:signToken(user),user:publicUser(user),customerProfile:customerProfileFromRow(row)});
  } catch(e){ console.error(e.message); res.status(e.code==='23505'?409:500).json({error:e.code==='23505'?'An account with this email or phone already exists.':'Customer registration failed.'}); }
};

exports.registerWorker = async (req,res) => {
  try {
    const {fullName,email,mobile,password,address,pincode,preferredArea,jobType,experienceYears,skills=[],preferredWorkType,expectedDailyWage,availability,certifications=[],identityDocType,identityDocNumber,identityProofFileName='',identityProofData='',emergencyContact={},preferredRadiusKm,languages=[],bio='',workExperienceSummary=''}=req.body||{};
    if(!fullName||!email||!mobile||!password||!address||!pincode||!jobType||!identityDocType||!identityDocNumber) return res.status(400).json({error:'Please complete all required worker onboarding fields and identity verification.'});
    const user=await insertUser({name:fullName.trim(),email:email.trim(),phone:mobile.trim(),password,role:'worker'});
    const completeness=Math.min(100,[fullName,mobile,email,address,pincode,skills.length,expectedDailyWage,identityDocNumber,certifications.length].filter(Boolean).length*10);
    const payload={id:`worker-${Date.now()}`,user_id:user.id,name:fullName.trim(),phone:mobile.trim(),skill:String(jobType),is_verified:false,is_available:availability!=='NOT_AVAILABLE',address:address.trim(),pincode:String(pincode).trim(),preferred_area:String(preferredArea||address).trim(),experience_years:Number(experienceYears||0),skills,preferred_work_type:preferredWorkType||'Flexible / Gig',expected_daily_wage:Number(expectedDailyWage||0),availability:availability||'AVAILABLE',certifications,identity_doc_type:identityDocType,identity_doc_number_masked:maskId(identityDocNumber),identity_doc_filename:identityProofFileName,identity_doc_data:identityProofData,emergency_name:emergencyContact.name||'',emergency_phone:emergencyContact.phone||'',emergency_relation:emergencyContact.relation||'',preferred_radius_km:Number(preferredRadiusKm||15),languages,bio,work_experience_summary:workExperienceSummary,profile_completeness:completeness,created_at:new Date().toISOString(),updated_at:new Date().toISOString(),rating:0};
    let row;
    if(db.isPostgresConnected()) row=(await db.query(`INSERT INTO workers (user_id,name,phone,skill,is_verified,is_available,address,pincode,preferred_area,experience_years,skills,preferred_work_type,expected_daily_wage,availability,certifications,identity_doc_type,identity_doc_number_masked,identity_doc_filename,identity_doc_data,emergency_name,emergency_phone,emergency_relation,preferred_radius_km,languages,bio,work_experience_summary,profile_completeness) VALUES ($1,$2,$3,$4,FALSE,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26) RETURNING *`,[user.id,fullName.trim(),mobile.trim(),String(jobType),availability!=='NOT_AVAILABLE',address.trim(),String(pincode).trim(),String(preferredArea||address).trim(),Number(experienceYears||0),skills,preferredWorkType||'Flexible / Gig',Number(expectedDailyWage||0),availability||'AVAILABLE',JSON.stringify(certifications||[]),identityDocType,maskId(identityDocNumber),identityProofFileName,identityProofData,emergencyContact.name||'',emergencyContact.phone||'',emergencyContact.relation||'',Number(preferredRadiusKm||15),languages,bio,workExperienceSummary,completeness])).rows[0];
    else { row=payload; db.getStore().workers.push(row); }
    res.status(201).json({token:signToken(user),user:publicUser(user),workerProfile:workerProfileFromRow({...row,email:user.email})});
  } catch(e){ console.error(e.message); res.status(e.code==='23505'?409:500).json({error:e.code==='23505'?'An account with this email or phone already exists.':'Worker registration failed.'}); }
};

exports.login = async (req,res) => {
  try {
    const {identifier,email,password,expectedRole}=req.body||{}; const loginId=String(identifier||email||'').trim();
    if(!loginId||!password) return res.status(400).json({error:'Email/mobile and password are required.'});
    let user;
    if(db.isPostgresConnected()) user=(await db.query(`SELECT * FROM users WHERE lower(email)=lower($1) OR phone=$1 LIMIT 1`,[loginId])).rows[0];
    else user=db.getStore().users.find(u=>u.email.toLowerCase()===loginId.toLowerCase()||String(u.phone)===loginId);
    if(!user) return res.status(404).json({error:'Account not found.'});
    if(expectedRole&&normalizeRole(expectedRole)!==user.role) return res.status(403).json({error:'This account does not belong to the selected portal.'});
    if(!(await bcrypt.compare(String(password),user.password_hash))) return res.status(401).json({error:'Invalid credentials.'});
    let profile=null;
    if(user.role==='worker') {
      const row=db.isPostgresConnected()?(await db.query(`SELECT w.*,u.email FROM workers w JOIN users u ON u.id=w.user_id WHERE w.user_id=$1`,[user.id])).rows[0]:db.getStore().workers.find(w=>w.user_id===user.id);
      profile=workerProfileFromRow({...row,email:user.email});
    } else if(user.role==='customer') {
      const row=db.isPostgresConnected()?(await db.query(`SELECT * FROM customer_profiles WHERE user_id=$1`,[user.id])).rows[0]:db.getStore().customer_profiles.find(c=>c.user_id===user.id);
      profile=customerProfileFromRow(row);
    }
    res.json({token:signToken(user),user:publicUser(user),profile});
  } catch(e){ console.error(e.message); res.status(500).json({error:'Login server error.'}); }
};

exports.me = async (req,res) => {
  try {
    const user=db.isPostgresConnected()?(await db.query(`SELECT id,name,email,phone,role,created_at FROM users WHERE id=$1`,[req.user.id])).rows[0]:db.getStore().users.find(u=>String(u.id)===String(req.user.id));
    if(!user) return res.status(404).json({error:'User not found.'});
    let profile=null;
    if(user.role==='worker') { const row=db.isPostgresConnected()?(await db.query(`SELECT w.*,u.email FROM workers w JOIN users u ON u.id=w.user_id WHERE w.user_id=$1`,[user.id])).rows[0]:db.getStore().workers.find(w=>w.user_id===user.id); profile=workerProfileFromRow({...row,email:user.email}); }
    else if(user.role==='customer') { const row=db.isPostgresConnected()?(await db.query(`SELECT * FROM customer_profiles WHERE user_id=$1`,[user.id])).rows[0]:db.getStore().customer_profiles.find(c=>c.user_id===user.id); profile=customerProfileFromRow(row); }
    res.json({user:publicUser(user),profile});
  } catch(e){ console.error(e.message); res.status(500).json({error:'Failed to load account.'}); }
};
