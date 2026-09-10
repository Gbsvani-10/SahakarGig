import { Language } from './types';

export interface TranslationDictionary {
  // Navigation & Brand
  brandName: string;
  tagline: string;
  backToDashboard: string;
  payments: string;
  dashboard: string;

  // Header
  makePayment: string;
  makePaymentSub: string;

  // Worker details
  workerDetailsTitle: string;
  workerNameLabel: string;
  serviceLabel: string;
  bookingIdLabel: string;
  scheduledDateLabel: string;
  scheduledTimeLabel: string;

  // Payment Breakdown
  paymentBreakdownTitle: string;
  serviceAmountLabel: string;
  gstLabel: string;
  adminChargeLabel: string;
  amountPayableToWorker: string;
  grandTotalLabel: string;
  amountToBePaidToWorker: string;

  // Notices & Status
  preCompletionNotice: string;
  paymentStatusLabel: string;
  statusPending: string;
  statusPaid: string;
  statusVerifying: string;

  // Pay Worker UPI
  payWorkerTitle: string;
  upiIdLabel: string;
  copyUpiBtn: string;
  upiCopiedFeedback: string;
  chooseUpiApp: string;

  // Easy Payment
  easyPaymentTitle: string;
  easyPaymentSubtext: string;
  openPaymentLinkBtn: string;
  scanAndPayTitle: string;
  scanQrInstructions: string;
  demoQrNotice: string;

  // Verification & Feedback
  verifyPaymentBtn: string;
  verifyingText: string;
  demoSimulateSuccess: string;
  demoSimulateFailure: string;
  demoReset: string;

  // Errors & Alerts
  appNotInstalledMsg: string;
  paymentCancelledMsg: string;
  paymentFailedMsg: string;
  paymentPendingMsg: string;

  // Receipt
  paymentSuccessfulTitle: string;
  receiptSubtitle: string;
  amountPaidLabel: string;
  paymentIdLabel: string;
  dateLabel: string;
  viewReceiptBtn: string;
  downloadReceiptBtn: string;
  closeReceiptBtn: string;
  paymentMethodLabel: string;
  cooperativeInvoice: string;
  cooperativeNote: string;

  // Active App Payment Session & Redirects
  redirectingToApp: string;
  paymentInProgressTitle: string;
  paymentInProgressDesc: string;
  confirmPaymentDoneBtn: string;
  cancelPaymentSession: string;
  scanConfirmBtn: string;
  awaitingBankConfirmation: string;
  reopenApp: string;
  paymentInitiatedVia: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    brandName: 'SahakarGig',
    tagline: 'Cooperative Gig-Services Platform',
    backToDashboard: '← Back to Dashboard',
    payments: 'Payments',
    dashboard: 'Dashboard',

    makePayment: 'Make Payment',
    makePaymentSub: 'Complete your payment securely before the service is completed.',

    workerDetailsTitle: 'Worker Details',
    workerNameLabel: 'Worker Name',
    serviceLabel: 'Service',
    bookingIdLabel: 'Booking ID',
    scheduledDateLabel: 'Scheduled Date',
    scheduledTimeLabel: 'Scheduled Time',

    paymentBreakdownTitle: 'Payment Breakdown',
    serviceAmountLabel: 'Service Amount',
    gstLabel: 'GST (18%)',
    adminChargeLabel: 'Admin / Platform Charge',
    amountPayableToWorker: 'Amount Payable to Worker',
    grandTotalLabel: 'GRAND TOTAL',
    amountToBePaidToWorker: 'Amount to be paid to the worker',

    preCompletionNotice: 'You can pay the amount before completion of the service.',
    paymentStatusLabel: 'Payment Status',
    statusPending: 'Pending',
    statusPaid: 'Paid',
    statusVerifying: 'Verifying...',

    payWorkerTitle: 'Pay Worker',
    upiIdLabel: 'UPI ID',
    copyUpiBtn: 'Copy UPI ID',
    upiCopiedFeedback: 'UPI ID copied!',
    chooseUpiApp: 'Choose your UPI App:',

    easyPaymentTitle: 'Easy Payment',
    easyPaymentSubtext: 'For users who need an easier payment method',
    openPaymentLinkBtn: '🔗 Open Payment Link',
    scanAndPayTitle: 'Scan & Pay',
    scanQrInstructions: 'Scan this QR code using any UPI app (PhonePe, GPay, Paytm, BHIM) on your mobile phone.',
    demoQrNotice: 'Demo QR: Encoded with verified UPI payment intent for this booking.',

    verifyPaymentBtn: 'I Have Paid • Verify Status',
    verifyingText: 'Verifying payment with cooperative gateway...',
    demoSimulateSuccess: 'Simulate Bank Success',
    demoSimulateFailure: 'Simulate Failure',
    demoReset: 'Reset to Pending',

    appNotInstalledMsg: 'This payment app is not available on your device. Please use another UPI option or the payment link below.',
    paymentCancelledMsg: 'Payment cancelled. You can try again.',
    paymentFailedMsg: 'Payment failed. Please choose another payment method.',
    paymentPendingMsg: 'Payment verification is pending. Please complete payment in your UPI app first.',

    paymentSuccessfulTitle: 'Payment Successful ✓',
    receiptSubtitle: 'Your payment has been secured in the cooperative escrow.',
    amountPaidLabel: 'Amount Paid',
    paymentIdLabel: 'Payment ID',
    dateLabel: 'Date',
    viewReceiptBtn: 'View Receipt',
    downloadReceiptBtn: 'Download Receipt',
    closeReceiptBtn: 'Close Receipt',
    paymentMethodLabel: 'Payment Method',
    cooperativeInvoice: 'SahakarGig Cooperative Receipt',
    cooperativeNote: 'Payment held securely under SahakarGig cooperative fair-work assurance until service satisfaction.',

    redirectingToApp: 'Redirecting to {app}...',
    paymentInProgressTitle: 'Payment in Progress',
    paymentInProgressDesc: 'Complete the payment in your UPI app or using the QR scanner, then confirm below.',
    confirmPaymentDoneBtn: 'I Have Paid in App • Confirm Payment',
    cancelPaymentSession: 'Cancel / Choose Another Method',
    scanConfirmBtn: 'I Have Paid using Scanner • Verify Status',
    awaitingBankConfirmation: 'Waiting for bank / UPI authorization...',
    reopenApp: 'Open App Again',
    paymentInitiatedVia: 'Payment initiated via {app}'
  },

  te: {
    brandName: 'సహకార్ గిగ్',
    tagline: 'సహకార సేవల వేదిక',
    backToDashboard: '← డాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి',
    payments: 'చెల్లింపులు',
    dashboard: 'డాష్‌బోర్డ్',

    makePayment: 'చెల్లింపు చేయండి',
    makePaymentSub: 'సేవ పూర్తి కావడానికి ముందే మీ చెల్లింపును సురక్షితంగా పూర్తి చేయండి.',

    workerDetailsTitle: 'కార్మికుడి వివరాలు',
    workerNameLabel: 'కార్మికుడి పేరు',
    serviceLabel: 'సేవ',
    bookingIdLabel: 'బుకింగ్ ఐడీ',
    scheduledDateLabel: 'నిర్ణయించిన తేదీ',
    scheduledTimeLabel: 'నిర్ణయించిన సమయం',

    paymentBreakdownTitle: 'చెల్లింపు విభజన',
    serviceAmountLabel: 'సేవా మొత్తం',
    gstLabel: 'జీఎస్టీ (18%)',
    adminChargeLabel: 'అడ్మిన్ / ప్లాట్‌ఫారమ్ ఛార్జ్',
    amountPayableToWorker: 'కార్మికుడికి చెల్లించాల్సిన మొత్తం',
    grandTotalLabel: 'మొత్తం చెల్లింపు (GRAND TOTAL)',
    amountToBePaidToWorker: 'కార్మికుడికి చెల్లించాల్సిన మొత్తం',

    preCompletionNotice: 'సేవ పూర్తి కావడానికి ముందే మీరు మొత్తాన్ని చెల్లించవచ్చు.',
    paymentStatusLabel: 'చెల్లింపు స్థితి',
    statusPending: 'పెండింగ్‌లో ఉంది',
    statusPaid: 'చెల్లించబడింది',
    statusVerifying: 'ధృవీకరిస్తోంది...',

    payWorkerTitle: 'కార్మికుడికి చెల్లించండి',
    upiIdLabel: 'యూపీఐ ఐడీ (UPI ID)',
    copyUpiBtn: 'యూపీఐ ఐడీని కాపీ చేయండి',
    upiCopiedFeedback: 'యూపీఐ ఐడీ కాపీ చేయబడింది!',
    chooseUpiApp: 'మీ యూపీఐ యాప్‌ని ఎంచుకోండి:',

    easyPaymentTitle: 'సులభమైన చెల్లింపు',
    easyPaymentSubtext: 'సులభమైన చెల్లింపు పద్ధతి అవసరమైన వారి కోసం',
    openPaymentLinkBtn: '🔗 చెల్లింపు లింక్ తెరవండి',
    scanAndPayTitle: 'స్కాన్ చేసి చెల్లించండి',
    scanQrInstructions: 'మీ మొబైల్‌లోని ఏదైనా యూపీఐ యాప్ (PhonePe, GPay, Paytm, BHIM) ద్వారా ఈ క్యూఆర్ కోడ్‌ను స్కాన్ చేయండి.',
    demoQrNotice: 'డెమో క్యూఆర్: ఈ బుకింగ్ కోసం యూపీఐ చెల్లింపు కోడ్‌తో రూపొందించబడింది.',

    verifyPaymentBtn: 'నేను చెల్లించాను • స్థితిని ధృవీకరించండి',
    verifyingText: 'చెల్లింపును ధృవీకరిస్తోంది...',
    demoSimulateSuccess: 'విజయవంతమైన చెల్లింపును పరీక్షించండి',
    demoSimulateFailure: 'వైఫల్యాన్ని పరీక్షించండి',
    demoReset: 'తిరిగి పెండింగ్‌కు మార్చండి',

    appNotInstalledMsg: 'ఈ చెల్లింపు యాప్ మీ పరికరంలో అందుబాటులో లేదు. దయచేసి మరొక యూపీఐ ఎంపికను లేదా క్రింది చెల్లింపు లింక్‌ను ఉపయోగించండి.',
    paymentCancelledMsg: 'చెల్లింపు రద్దు చేయబడింది. మీరు మళ్ళీ ప్రయత్నించవచ్చు.',
    paymentFailedMsg: 'చెల్లింపు విఫలమైంది. దయచేసి మరొక చెల్లింపు పద్ధతిని ఎంచుకోండి.',
    paymentPendingMsg: 'చెల్లింపు ధృవీకరణ పెండింగ్‌లో ఉంది. దయచేసి ముందుగా మీ యూపీఐ యాప్‌లో చెల్లింపును పూర్తి చేయండి.',

    paymentSuccessfulTitle: 'చెల్లింపు విజయవంతమైంది ✓',
    receiptSubtitle: 'మీ చెల్లింపు సహకార రక్షణలో భద్రపరచబడింది.',
    amountPaidLabel: 'చెల్లించిన మొత్తం',
    paymentIdLabel: 'చెల్లింపు ఐడీ',
    dateLabel: 'తేదీ',
    viewReceiptBtn: 'రశీదు చూడండి',
    downloadReceiptBtn: 'రశీదును డౌన్‌లోడ్ చేయండి',
    closeReceiptBtn: 'రశీదు మూసివేయండి',
    paymentMethodLabel: 'చెల్లింపు పద్ధతి',
    cooperativeInvoice: 'సహకార్ గిగ్ సహకార రశీదు',
    cooperativeNote: 'సేవ పూర్తయ్యే వరకు సహకార్ గిగ్ సహకార నిబంధనల ప్రకారం చెల్లింపు భద్రంగా ఉంచబడుతుంది.',

    redirectingToApp: '{app} యాప్‌కి రీడైరెక్ట్ అవుతోంది...',
    paymentInProgressTitle: 'చెల్లింపు ప్రక్రియలో ఉంది',
    paymentInProgressDesc: 'మీ యూపీఐ యాప్‌లో లేదా క్యూఆర్ కోడ్ స్కాన్ చేసి చెల్లింపును పూర్తి చేసి, క్రింద ధృవీకరించండి.',
    confirmPaymentDoneBtn: 'యాప్‌లో చెల్లించాను • చెల్లింపు ధృవీకరించండి',
    cancelPaymentSession: 'రద్దు చేయండి / వేరే పద్ధతి ఎంచుకోండి',
    scanConfirmBtn: 'స్కానర్ ద్వారా చెల్లించాను • ధృవీకరించండి',
    awaitingBankConfirmation: 'బ్యాంక్ లేదా యూపీఐ ఆమోదం కోసం వేచి చూస్తోంది...',
    reopenApp: 'యాప్‌ను మళ్ళీ తెరవండి',
    paymentInitiatedVia: '{app} ద్వారా చెల్లింపు ప్రారంభించబడింది'
  },

  hi: {
    brandName: 'सहकारगिग',
    tagline: 'सहकारी गिग-सेवा मंच',
    backToDashboard: '← डैशबोर्ड पर वापस जाएं',
    payments: 'भुगतान',
    dashboard: 'डैशबोर्ड',

    makePayment: 'भुगतान करें',
    makePaymentSub: 'सेवा पूरी होने से पहले अपना भुगतान सुरक्षित रूप से पूरा करें।',

    workerDetailsTitle: 'कार्यकर्ता विवरण',
    workerNameLabel: 'कार्यकर्ता का नाम',
    serviceLabel: 'सेवा',
    bookingIdLabel: 'बुकिंग आईडी',
    scheduledDateLabel: 'निर्धारित तिथि',
    scheduledTimeLabel: 'निर्धारित समय',

    paymentBreakdownTitle: 'भुगतान विवरण',
    serviceAmountLabel: 'सेवा राशि',
    gstLabel: 'जीएसटी (18%)',
    adminChargeLabel: 'एडमिन / प्लेटफॉर्म शुल्क',
    amountPayableToWorker: 'कार्यकर्ता को देय राशि',
    grandTotalLabel: 'कुल राशि (GRAND TOTAL)',
    amountToBePaidToWorker: 'कार्यकर्ता को भुगतान की जाने वाली राशि',

    preCompletionNotice: 'आप सेवा पूरी होने से पहले राशि का भुगतान कर सकते हैं।',
    paymentStatusLabel: 'भुगतान स्थिति',
    statusPending: 'लंबित',
    statusPaid: 'भुगतान सफल',
    statusVerifying: 'सत्यापित हो रहा है...',

    payWorkerTitle: 'कार्यकर्ता को भुगतान करें',
    upiIdLabel: 'यूपीआई आईडी (UPI ID)',
    copyUpiBtn: 'यूपीआई आईडी कॉपी करें',
    upiCopiedFeedback: 'यूपीआई आईडी कॉपी हो गई!',
    chooseUpiApp: 'अपना यूपीआई ऐप चुनें:',

    easyPaymentTitle: 'आसान भुगतान',
    easyPaymentSubtext: 'उन उपयोगकर्ताओं के लिए जिन्हें आसान भुगतान विधि की आवश्यकता है',
    openPaymentLinkBtn: '🔗 भुगतान लिंक खोलें',
    scanAndPayTitle: 'स्कैन करके भुगतान करें',
    scanQrInstructions: 'अपने मोबाइल पर किसी भी यूपीआई ऐप (PhonePe, GPay, Paytm, BHIM) से इस क्यूआर कोड को स्कैन करें।',
    demoQrNotice: 'डेमो क्यूआर: इस बुकिंग के लिए सत्यापित यूपीआई इंटेंट के साथ तैयार किया गया।',

    verifyPaymentBtn: 'मैंने भुगतान कर दिया है • स्थिति जांचें',
    verifyingText: 'सहकारी गेटवे से भुगतान सत्यापित हो रहा है...',
    demoSimulateSuccess: 'सफल भुगतान का परीक्षण करें',
    demoSimulateFailure: 'विफल भुगतान का परीक्षण करें',
    demoReset: 'वापस लंबित करें',

    appNotInstalledMsg: 'यह भुगतान ऐप आपके डिवाइस पर उपलब्ध नहीं है। कृपया किसी अन्य यूपीआई विकल्प या नीचे दिए गए भुगतान लिंक का उपयोग करें।',
    paymentCancelledMsg: 'भुगतान रद्द कर दिया गया। आप पुनः प्रयास कर सकते हैं।',
    paymentFailedMsg: 'भुगतान विफल रहा। कृपया कोई अन्य भुगतान विधि चुनें।',
    paymentPendingMsg: 'भुगतान सत्यापन लंबित है। कृपया पहले अपने यूपीआई ऐप में भुगतान पूरा करें।',

    paymentSuccessfulTitle: 'भुगतान सफल ✓',
    receiptSubtitle: 'आपका भुगतान सहकारी सुरक्षा में सुरक्षित रखा गया है।',
    amountPaidLabel: 'भुगतान की गई राशि',
    paymentIdLabel: 'भुगतान आईडी',
    dateLabel: 'दिनांक',
    viewReceiptBtn: 'रसीद देखें',
    downloadReceiptBtn: 'रसीद डाउनलोड करें',
    closeReceiptBtn: 'रसीद बंद करें',
    paymentMethodLabel: 'भुगतान विधि',
    cooperativeInvoice: 'सहकारगिग सहकारी रसीद',
    cooperativeNote: 'सेवा संतोषजनक रूप से पूर्ण होने तक भुगतान सहकारगिग सहकारी गारंटी के तहत सुरक्षित रहेगा।',

    redirectingToApp: '{app} ऐप पर पुनर्निर्देशित किया जा रहा है...',
    paymentInProgressTitle: 'भुगतान प्रगति पर है',
    paymentInProgressDesc: 'अपने यूपीआई ऐप में या क्यूआर कोड स्कैन करके भुगतान पूरा करें, फिर नीचे पुष्टि करें।',
    confirmPaymentDoneBtn: 'मैंने ऐप में भुगतान कर दिया • पुष्टि करें',
    cancelPaymentSession: 'रद्द करें / दूसरा तरीका चुनें',
    scanConfirmBtn: 'मैंने स्कैनर से भुगतान किया • सत्यापित करें',
    awaitingBankConfirmation: 'बैंक / यूपीआई पुष्टि की प्रतीक्षा की जा रही है...',
    reopenApp: 'ऐप फिर से खोलें',
    paymentInitiatedVia: '{app} के माध्यम से भुगतान शुरू किया गया'
  }
};
