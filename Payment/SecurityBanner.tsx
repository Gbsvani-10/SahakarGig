import { Language } from '../types/payment.types';

export interface TranslationSchema {
  // App & Header
  appTitle: string;
  appSubtitle: string;
  easyModeToggle: string;
  standardMode: string;
  demoModeBadge: string;
  demoModeLabel: string;
  demoNotice: string;
  
  // Security
  securityTitle: string;
  securityMessage: string;
  neverAskPinTitle: string;
  neverAskPinDesc: string;
  safeRedirectNotice: string;

  // Order & Merchant details
  merchantLabel: string;
  amountLabel: string;
  purposeLabel: string;
  orderIdLabel: string;
  cooperativeWorker: string;
  verifiedWorkerBadge: string;

  // Primary Action
  payWithAnyUpi: string;
  payWithAnyUpiDesc: string;
  orPayWithApp: string;
  otherPaymentOptions: string;
  popularApps: string;

  // Alternative Actions
  showQrCode: string;
  hideQrCode: string;
  scanQrPrompt: string;
  copyUpiId: string;
  copiedUpiId: string;
  sharePaymentLink: string;
  sharedLinkSuccess: string;

  // Easy Payment Mode Steps
  easyModeTitle: string;
  easyModeSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;
  step5Title: string;
  step5Desc: string;
  continueButton: string;
  readAloud: string;
  stopAudio: string;

  // Payment Status Screen
  processingTitle: string;
  processingDesc: string;
  successTitle: string;
  successDesc: string;
  failedTitle: string;
  failedDesc: string;
  cancelledTitle: string;
  cancelledDesc: string;
  unconfirmedTitle: string;
  unconfirmedDesc: string;
  transactionIdLabel: string;
  paidAtLabel: string;
  payeeLabel: string;
  referenceLabel: string;
  doneButton: string;
  tryAgainButton: string;
  tryQrCodeButton: string;
  checkStatusButton: string;

  // Error States
  errNoUpiApp: string;
  errLaunchFailed: string;
  errCancelled: string;
  errTimeout: string;
  errInvalidAmount: string;
  errInvalidUpiId: string;
  errNetwork: string;
  errDuplicatePayment: string;
  errUnknown: string;

  // Voice Guidance Scripts
  voiceStep1: string;
  voiceStep2: string;
  voiceStep3: string;
  voiceStep4: string;
  voiceStep5: string;
  voiceProcessing: string;
  voiceSuccess: string;
  voiceFailed: string;
}

export const translations: Record<Language, TranslationSchema> = {
  en: {
    appTitle: 'SahakarGig Payment',
    appSubtitle: 'Cooperative Gig Worker UPI Gateway',
    easyModeToggle: 'Easy Payment Mode (Large Text & Voice)',
    standardMode: 'Standard Mode',
    demoModeBadge: 'SIH Prototype Demo',
    demoModeLabel: 'Judge Test Controls',
    demoNotice: 'Simulation Mode Active: Real money is not deducted. Transactions run in prototype mode.',
    
    securityTitle: '100% Safe UPI Payment',
    securityMessage: 'We NEVER ask for your UPI PIN. Your authentication happens directly inside your bank app.',
    neverAskPinTitle: 'Zero PIN Storage',
    neverAskPinDesc: 'Neither SahakarGig nor this website will ever prompt you for your UPI PIN, banking passwords, or OTP.',
    safeRedirectNotice: 'When you tap Pay, your installed UPI app opens automatically.',

    merchantLabel: 'Gig Worker / Payee',
    amountLabel: 'Total Payable Amount',
    purposeLabel: 'Work Purpose / Service',
    orderIdLabel: 'Booking Ref ID',
    cooperativeWorker: 'Verified Cooperative Member',
    verifiedWorkerBadge: 'Verified UPI',

    payWithAnyUpi: 'PAY WITH ANY UPI APP',
    payWithAnyUpiDesc: 'Opens Google Pay, PhonePe, Paytm, BHIM, or any installed UPI app on your phone',
    orPayWithApp: 'Or choose a specific installed app',
    otherPaymentOptions: 'Other UPI Apps',
    popularApps: 'Popular Apps on Device',

    showQrCode: 'Show QR Code',
    hideQrCode: 'Hide QR Code',
    scanQrPrompt: 'Scan this QR code with any UPI app on any smartphone',
    copyUpiId: 'Copy UPI ID',
    copiedUpiId: 'UPI ID Copied to Clipboard!',
    sharePaymentLink: 'Share Payment Link',
    sharedLinkSuccess: 'Payment link copied to clipboard!',

    easyModeTitle: 'Simple Payment (Easy Mode)',
    easyModeSubtitle: 'Follow these 5 clear steps. Press the speaker icon to listen.',
    step1Title: 'STEP 1: Check the amount',
    step1Desc: 'Please confirm the amount you are paying to the gig worker.',
    step2Title: 'STEP 2: Choose your payment app',
    step2Desc: 'Tap the big green button below to select your UPI app.',
    step3Title: 'STEP 3: Your UPI app will open',
    step3Desc: 'Your phone will automatically switch to your chosen bank application.',
    step4Title: 'STEP 4: Check payee name & amount',
    step4Desc: 'Look at the worker name and amount on your phone screen carefully.',
    step5Title: 'STEP 5: Complete payment inside UPI app',
    step5Desc: 'Enter your UPI PIN safely inside your bank app. NEVER tell anyone your PIN.',
    continueButton: 'Continue to UPI App',
    readAloud: 'Read Aloud (Voice)',
    stopAudio: 'Stop Voice',

    processingTitle: 'Processing payment...',
    processingDesc: 'Waiting for confirmation from your UPI app. Please do not close this window.',
    successTitle: 'Payment Successful',
    successDesc: 'Payment has been received by the cooperative worker. Thank you!',
    failedTitle: 'Payment Failed',
    failedDesc: 'The payment could not be processed. No money was deducted.',
    cancelledTitle: 'Payment Cancelled',
    cancelledDesc: 'You cancelled the payment request in your UPI application.',
    unconfirmedTitle: 'Payment Status Unconfirmed',
    unconfirmedDesc: 'We could not verify the instant status. If money was debited from your account, it will reflect within 2 hours.',
    transactionIdLabel: 'Transaction ID',
    paidAtLabel: 'Timestamp',
    payeeLabel: 'Payee Name',
    referenceLabel: 'Bank UTR / Reference',
    doneButton: 'Back to Service',
    tryAgainButton: 'Try Payment Again',
    tryQrCodeButton: 'Pay via QR Code',
    checkStatusButton: 'Check Status Again',

    errNoUpiApp: 'No UPI app was detected on this device.',
    errLaunchFailed: 'Could not open UPI app automatically. Please try the QR code or copy the UPI ID.',
    errCancelled: 'Payment was cancelled by the user.',
    errTimeout: 'Payment verification timed out. Please check your bank app for confirmation.',
    errInvalidAmount: 'Invalid amount. Amount must be between ₹1 and ₹1,00,000.',
    errInvalidUpiId: 'Invalid UPI ID format. Must be in format user@bank.',
    errNetwork: 'Network connection issue. Please check your internet connection.',
    errDuplicatePayment: 'Payment request is already being processed. Please wait to prevent duplicate payment.',
    errUnknown: 'An unexpected error occurred. Please try again.',

    voiceStep1: 'Step 1. Please check the amount on screen.',
    voiceStep2: 'Step 2. Now press the Pay With Any UPI App button.',
    voiceStep3: 'Step 3. Your phone will now open your bank UPI application.',
    voiceStep4: 'Step 4. Please verify the payee name and amount before paying.',
    voiceStep5: 'Step 5. Complete payment safely inside your UPI app. Never share your UPI PIN.',
    voiceProcessing: 'Processing your payment. Please wait.',
    voiceSuccess: 'Payment successful. Thank you for supporting your cooperative gig worker.',
    voiceFailed: 'Payment could not be completed. You can try again or scan the QR code.',
  },

  te: {
    appTitle: 'సహకార్‌గిగ్ చెల్లింపు',
    appSubtitle: 'సహకార కార్మికుల సులభమైన UPI గేట్‌వే',
    easyModeToggle: 'సులభమైన చెల్లింపు విధానం (పెద్ద అక్షరాలు & వాయిస్)',
    standardMode: 'సాధారణ విధానం',
    demoModeBadge: 'SIH డెమో ప్రోటోటైప్',
    demoModeLabel: 'న్యాయ నిర్ణేతల నియంత్రణలు',
    demoNotice: 'డెమో మోడ్ యాక్టివ్‌గా ఉంది: అసలు డబ్బు కట్ అవ్వదు. ఇది పరీక్ష కోసం మాత్రమే.',

    securityTitle: '100% సురక్షితమైన UPI చెల్లింపు',
    securityMessage: 'మేము మీ UPI పిన్ (PIN) ఎప్పుడూ అడగము. మీ పిన్ మీ బ్యాంక్ యాప్‌లోనే నమోదు చేయాలి.',
    neverAskPinTitle: 'పిన్ భద్రత హామీ',
    neverAskPinDesc: 'సహకార్‌గిగ్ ఎప్పుడూ మీ UPI పిన్, బ్యాంకింగ్ పాస్‌వర్డ్ లేదా OTPని అడగదు.',
    safeRedirectNotice: 'చెల్లించు బటన్ నొక్కగానే మీ ఫోన్‌లోని UPI యాప్ ఓపెన్ అవుతుంది.',

    merchantLabel: 'కార్మికుడు / సేవకుడు',
    amountLabel: 'చెల్లించాల్సిన మొత్తం',
    purposeLabel: 'పని వివరాలు / సేవ',
    orderIdLabel: 'బుకింగ్ నంబర్',
    cooperativeWorker: 'ధృవీకరించబడిన సహకార సభ్యుడు',
    verifiedWorkerBadge: 'ధృవీకరించబడిన UPI',

    payWithAnyUpi: 'ఏదైనా UPI యాప్‌తో చెల్లించండి',
    payWithAnyUpiDesc: 'ఫోన్‌పే, గూగుల్ పే, పేటీఎం లేదా ఏదైనా UPI యాప్ ద్వారా సులభంగా చెల్లించవచ్చు',
    orPayWithApp: 'లేదా మీ ఫోన్‌లోని యాప్‌ను ఎంచుకోండి',
    otherPaymentOptions: 'ఇతర UPI యాప్‌లు',
    popularApps: 'ఫోన్‌లోని ముఖ్యమైన యాప్‌లు',

    showQrCode: 'QR కోడ్ చూపించు',
    hideQrCode: 'QR కోడ్ దాచు',
    scanQrPrompt: 'ఏదైనా స్మార్ట్‌ఫోన్ UPI యాప్‌తో ఈ QR కోడ్‌ని స్కాన్ చేసి చెల్లించండి',
    copyUpiId: 'UPI ID కాపీ చేయండి',
    copiedUpiId: 'UPI ID కాపీ చేయబడింది!',
    sharePaymentLink: 'లింక్ షేర్ చేయండి',
    sharedLinkSuccess: 'చెల్లింపు లింక్ కాపీ చేయబడింది!',

    easyModeTitle: 'సులభమైన చెల్లింపు (Easy Mode)',
    easyModeSubtitle: 'ఈ 5 సులభమైన దశలను అనుసరించండి. మాటలు వినడానికి స్పీకర్ గుర్తు నొక్కండి.',
    step1Title: 'దశ 1: డబ్బు మొత్తం తనిఖీ చేయండి',
    step1Desc: 'మీరు కార్మికుడికి చెల్లిస్తున్న మొత్తం సరిగ్గా ఉందో లేదో చూడండి.',
    step2Title: 'దశ 2: చెల్లింపు యాప్‌ను ఎంచుకోండి',
    step2Desc: 'క్రింద ఉన్న పెద్ద ఆకుపచ్చ బటన్‌ను నొక్కండి.',
    step3Title: 'దశ 3: మీ UPI యాప్ తెరవబడుతుంది',
    step3Desc: 'మీ ఫోన్ స్వయంచాలకంగా మీ బ్యాంక్ యాప్‌కు మారుతుంది.',
    step4Title: 'దశ 4: పేరు మరియు మొత్తాన్ని తనిఖీ చేయండి',
    step4Desc: 'మీ ఫోన్ తెరపై కార్మికుడి పేరు మరియు మొత్తాన్ని జాగ్రత్తగా చూడండి.',
    step5Title: 'దశ 5: UPI యాప్‌లో చెల్లింపు పూర్తి చేయండి',
    step5Desc: 'మీ బ్యాంక్ యాప్‌లో మీ UPI పిన్‌ను సురక్షితంగా ఎంటర్ చేయండి. మీ పిన్‌ను ఎవరికీ చెప్పవద్దు.',
    continueButton: 'UPI యాప్‌కు కొనసాగండి',
    readAloud: 'వాయిస్ వినండి (చదవండి)',
    stopAudio: 'వాయిస్ ఆపండి',

    processingTitle: 'చెల్లింపు ప్రక్రియ జరుగుతోంది...',
    processingDesc: 'మీ UPI యాప్ నుండి సమాచారం కోసం వేచి చూస్తున్నాము. దయచేసి ఈ పేజీని మూసివేయవద్దు.',
    successTitle: 'చెల్లింపు విజయవంతమైంది',
    successDesc: 'సహకార కార్మికుడికి డబ్బు అందింది. ధన్యవాదాలు!',
    failedTitle: 'చెల్లింపు విఫలమైంది',
    failedDesc: 'చెల్లింపు పూర్తి కాలేదు. మీ ఖాతా నుండి డబ్బు కట్ అవ్వలేదు.',
    cancelledTitle: 'చెల్లింపు రద్దు చేయబడింది',
    cancelledDesc: 'మీరు మీ UPI యాప్‌లో చెల్లింపును రద్దు చేశారు.',
    unconfirmedTitle: 'స్థితి నిర్ధారణ కాలేదు',
    unconfirmedDesc: 'చెల్లింపు వివరాలు తక్షణమే అందలేదు. మీ ఖాతా నుండి డబ్బు కట్ అయితే, 2 గంటల్లో జమ అవుతుంది.',
    transactionIdLabel: 'లావాదేవీ నంబర్ (Txn ID)',
    paidAtLabel: 'సమయం',
    payeeLabel: 'స్వీకర్త పేరు',
    referenceLabel: 'బ్యాంక్ రిఫరెన్స్',
    doneButton: 'సేవకు తిరిగి వెళ్లండి',
    tryAgainButton: 'మళ్ళీ ప్రయత్నించండి',
    tryQrCodeButton: 'QR కోడ్ ద్వారా చెల్లించండి',
    checkStatusButton: 'మరోసారి తనిఖీ చేయండి',

    errNoUpiApp: 'ఈ ఫోన్‌లో UPI యాప్ ఏదీ కనిపించలేదు.',
    errLaunchFailed: 'UPI యాప్ స్వయంచాలకంగా తెరవబడలేదు. దయచేసి QR కోడ్ లేదా UPI ID ని ఉపయోగించండి.',
    errCancelled: 'చెల్లింపు రద్దు చేయబడింది.',
    errTimeout: 'సమయం ముగిసింది. దయచేసి మీ బ్యాంక్ యాప్ ఖాతా వివరాలను తనిఖీ చేయండి.',
    errInvalidAmount: 'చెల్లించాల్సిన మొత్తం సరిగ్గా లేదు. ₹1 నుండి ₹1,00,000 మధ్య ఉండాలి.',
    errInvalidUpiId: 'సరైన UPI ID ఇవ్వండి.',
    errNetwork: 'ఇంటర్నెట్ కనెక్షన్ సమస్య ఉంది. దయచేసి తనిఖీ చేయండి.',
    errDuplicatePayment: 'ఈ చెల్లింపు ఇప్పటికే పరిశీలనలో ఉంది. డూప్లికేట్ చెల్లింపు జరగకుండా కొద్దిసేపు ఆగండి.',
    errUnknown: 'ఊహించని లోపం జరిగింది. దయచేసి మళ్ళీ ప్రయత్నించండి.',

    voiceStep1: 'మొదటి దశ. తెరపై ఉన్న డబ్బు మొత్తాన్ని సరిచూసుకోండి.',
    voiceStep2: 'రెండవ దశ. క్రింద ఉన్న బటన్‌ను నొక్కి మీ చెల్లింపు యాప్‌ని ఎంచుకోండి.',
    voiceStep3: 'మూడవ దశ. మీ ఫోన్‌లోని బ్యాంక్ UPI యాప్ తెరవబడుతుంది.',
    voiceStep4: 'నాల్గవ దశ. కార్మికుడి పేరు మరియు మొత్తాన్ని ఒకసారి సరిచూసుకోండి.',
    voiceStep5: 'ఐదవ దశ. మీ UPI పిన్‌ని మీ బ్యాంక్ యాప్‌లో మాత్రమే ఎంటర్ చేయండి. పిన్ ఎవరికీ చెప్పవద్దు.',
    voiceProcessing: 'మీ చెల్లింపు ప్రక్రియ జరుగుతోంది. దయచేసి వేచి ఉండండి.',
    voiceSuccess: 'చెల్లింపు విజయవంతమైంది. సహకార కార్మికుడికి మద్దతు ఇచ్చినందుకు ధన్యవాదాలు.',
    voiceFailed: 'చెల్లింపు పూర్తి కాలేదు. మీరు మళ్ళీ ప్రయత్నించవచ్చు లేదా QR కోడ్ స్కాన్ చేయవచ్చు.',
  },

  hi: {
    appTitle: 'सहकारगिग भुगतान',
    appSubtitle: 'सहकारी कामगारों के लिए सरल UPI गेटवे',
    easyModeToggle: 'आसान भुगतान मोड (बड़े अक्षर और आवाज़)',
    standardMode: 'सामान्य मोड',
    demoModeBadge: 'SIH प्रोटोटाइप डेमो',
    demoModeLabel: 'जज टेस्ट नियंत्रण',
    demoNotice: 'डेमो मोड सक्रिय है: बैंक से असली पैसे नहीं कटेंगे। यह केवल परीक्षण के लिए है।',

    securityTitle: '100% सुरक्षित UPI भुगतान',
    securityMessage: 'हम कभी भी आपका UPI पिन (PIN) नहीं पूछते। आपका पिन केवल आपके बैंक ऐप में दर्ज होता है।',
    neverAskPinTitle: 'शून्य पिन संग्रह',
    neverAskPinDesc: 'सहकारगिग कभी भी आपसे UPI पिन, पासवर्ड या OTP नहीं मांगेगा।',
    safeRedirectNotice: 'पे बटन दबाते ही आपका UPI ऐप अपने आप खुल जाएगा।',

    merchantLabel: 'कामगार / सेवा प्रदाता',
    amountLabel: 'कुल देय राशि',
    purposeLabel: 'कार्य विवरण / सेवा',
    orderIdLabel: 'बुकिंग संदर्भ संख्या',
    cooperativeWorker: 'सत्यापित सहकारी सदस्य',
    verifiedWorkerBadge: 'सत्यापित UPI',

    payWithAnyUpi: 'किसी भी UPI ऐप से भुगतान करें',
    payWithAnyUpiDesc: 'Google Pay, PhonePe, Paytm, BHIM या किसी भी अन्य UPI ऐप से भुगतान करें',
    orPayWithApp: 'या अपने फोन का पसंदीदा ऐप चुनें',
    otherPaymentOptions: 'अन्य UPI ऐप',
    popularApps: 'फोन में मौजूद लोकप्रिय ऐप',

    showQrCode: 'QR कोड दिखाएं',
    hideQrCode: 'QR कोड छिपाएं',
    scanQrPrompt: 'किसी भी स्मार्टफोन के UPI ऐप से यह QR कोड स्कैन करें',
    copyUpiId: 'UPI ID कॉपी करें',
    copiedUpiId: 'UPI ID कॉपी हो गई!',
    sharePaymentLink: 'भुगतान लिंक शेयर करें',
    sharedLinkSuccess: 'भुगतान लिंक कॉपी हो गया!',

    easyModeTitle: 'आसान भुगतान (Easy Mode)',
    easyModeSubtitle: 'इन 5 आसान चरणों का पालन करें। निर्देश सुनने के लिए स्पीकर आइकन दबाएं।',
    step1Title: 'चरण 1: भुगतान राशि जांचें',
    step1Desc: 'कृपया पुष्टि करें कि आप कामगार को कितनी राशि दे रहे हैं।',
    step2Title: 'चरण 2: भुगतान ऐप चुनें',
    step2Desc: 'नीचे दिए गए बड़े हरे बटन को दबाएं।',
    step3Title: 'चरण 3: आपका UPI ऐप खुलेगा',
    step3Desc: 'आपका फोन अपने आप आपके चुने हुए बैंक ऐप पर चला जाएगा।',
    step4Title: 'चरण 4: नाम और राशि जांचें',
    step4Desc: 'फोन स्क्रीन पर कामगार का नाम और राशि ध्यान से देखें।',
    step5Title: 'चरण 5: UPI ऐप में भुगतान पूरा करें',
    step5Desc: 'अपने बैंक ऐप में सुरक्षित रूप से UPI पिन दर्ज करें। अपना पिन किसी को न बताएं।',
    continueButton: 'UPI ऐप पर जाएं',
    readAloud: 'आवाज़ में सुनें',
    stopAudio: 'आवाज़ बंद करें',

    processingTitle: 'भुगतान प्रक्रिया में है...',
    processingDesc: 'आपके UPI ऐप से पुष्टि की प्रतीक्षा की जा रही है। कृपया यह स्क्रीन बंद न करें।',
    successTitle: 'भुगतान सफल रहा',
    successDesc: 'सहकारी कामगार को राशि प्राप्त हो गई है। धन्यवाद!',
    failedTitle: 'भुगतान विफल रहा',
    failedDesc: 'भुगतान पूरा नहीं हो सका। आपके खाते से पैसे नहीं कटे हैं।',
    cancelledTitle: 'भुगतान रद्द किया गया',
    cancelledDesc: 'आपने अपने UPI ऐप में भुगतान रद्द कर दिया।',
    unconfirmedTitle: 'स्थिति की पुष्टि नहीं हुई',
    unconfirmedDesc: 'तुरंत पुष्टि नहीं मिल सकी। यदि पैसे कट गए हैं, तो 2 घंटे के भीतर खाते में दिखाई देंगे।',
    transactionIdLabel: 'लेन-देन संख्या (Txn ID)',
    paidAtLabel: 'समय',
    payeeLabel: 'प्राप्तकर्ता का नाम',
    referenceLabel: 'बैंक संदर्भ (UTR)',
    doneButton: 'वापस जाएं',
    tryAgainButton: 'पुनः प्रयास करें',
    tryQrCodeButton: 'QR कोड से भुगतान करें',
    checkStatusButton: 'स्थिति दोबारा जांचें',

    errNoUpiApp: 'इस फोन पर कोई UPI ऐप नहीं मिला।',
    errLaunchFailed: 'UPI ऐप अपने आप नहीं खुल सका। कृपया QR कोड या UPI ID का उपयोग करें।',
    errCancelled: 'उपयोगकर्ता द्वारा भुगतान रद्द कर दिया गया।',
    errTimeout: 'समय समाप्त हो गया। कृपया अपने बैंक ऐप में स्थिति जांचें।',
    errInvalidAmount: 'अमान्य राशि। राशि ₹1 से ₹1,00,000 के बीच होनी चाहिए।',
    errInvalidUpiId: 'अमान्य UPI ID।',
    errNetwork: 'नेटवर्क समस्या। कृपया इंटरनेट कनेक्शन जांचें।',
    errDuplicatePayment: 'यह भुगतान पहले से प्रक्रिया में है। कृपया दोबारा भुगतान से बचने के लिए प्रतीक्षा करें।',
    errUnknown: 'कोई अप्रत्याशित समस्या हुई। कृपया पुनः प्रयास करें।',

    voiceStep1: 'पहला चरण। कृपया स्क्रीन पर दी गई राशि की जांच करें।',
    voiceStep2: 'दूसरा चरण। अब किसी भी UPI ऐप से भुगतान करें बटन दबाएं।',
    voiceStep3: 'तीसरा चरण। आपका फोन अब आपके बैंक के UPI ऐप को खोलेगा।',
    voiceStep4: 'चौथा चरण। भुगतान से पहले कामगार का नाम और राशि अवश्य जांचें।',
    voiceStep5: 'पांचवा चरण। अपना भुगतान बैंक ऐप के अंदर पूरा करें। अपना UPI पिन कभी किसी को न बताएं।',
    voiceProcessing: 'भुगतान की प्रक्रिया जारी है। कृपया प्रतीक्षा करें।',
    voiceSuccess: 'भुगतान सफल रहा। सहकारी कामगार का समर्थन करने के लिए धन्यवाद।',
    voiceFailed: 'भुगतान पूरा नहीं हो सका। आप पुनः प्रयास कर सकते हैं या QR कोड स्कैन कर सकते हैं।',
  },
};
S
