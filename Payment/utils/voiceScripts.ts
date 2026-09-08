import { Language } from '../types/payment.types';

export interface VoiceContent {
  displayText: string; // Shown on screen in native language script
  spokenText: string;  // Sent to TTS engine (native or phonetic fallback)
  lang: Language;
}

export const getStepVoiceContent = (
  step: 1 | 2 | 3 | 4 | 5 | 'processing' | 'success' | 'failed',
  lang: Language,
  merchantName: string = 'Worker',
  amount: number = 0,
  hasNativeVoice: boolean = true
): VoiceContent => {
  const roundedAmount = Math.round(amount);

  if (lang === 'te') {
    switch (step) {
      case 1:
        return {
          displayText: `మొదటి దశ: దయచేసి చెల్లించాల్సిన మొత్తాన్ని సరిచూసుకోండి: ₹${roundedAmount}`,
          spokenText: hasNativeVoice
            ? `మొదటి దశ. దయచేసి చెల్లించాల్సిన మొత్తాన్ని సరిచూసుకోండి: ${roundedAmount} రూపాయలు.`
            : `Modati dasha. Dayachesi chellinchaalsina mothaanni thanikhee chesukondi: ${roundedAmount} roopaayalu.`,
          lang: 'te',
        };
      case 2:
        return {
          displayText: 'రెండవ దశ: మీ ఫోన్‌లోని ఏదైనా UPI యాప్‌తో చెల్లించడానికి బటన్‌ను నొక్కండి',
          spokenText: hasNativeVoice
            ? 'రెండవ దశ. మీ ఫోన్‌లోని ఏదైనా UPI యాప్‌తో చెల్లించడానికి బటన్‌ను నొక్కండి.'
            : 'Rendava dasha. Mee phone loni edhaina UPI app tho chellinchadaaniki batanni nokkandi.',
          lang: 'te',
        };
      case 3:
        return {
          displayText: 'మూడవ దశ: మీ ఫోన్‌లోని బ్యాంక్ UPI యాప్ తెరవబడుతుంది',
          spokenText: hasNativeVoice
            ? 'మూడవ దశ. మీ ఫోన్‌లోని బ్యాంక్ UPI యాప్ తెరవబడుతుంది.'
            : 'Moodava dasha. Mee phone loni bank UPI app theravabaduthundi.',
          lang: 'te',
        };
      case 4:
        return {
          displayText: `నాల్గవ దశ: స్వీకర్త పేరు ${merchantName}, మొత్తం ₹${roundedAmount} సరిచూసుకోండి`,
          spokenText: hasNativeVoice
            ? `నాల్గవ దశ. స్వీకర్త పేరు ${merchantName}, మరియు మొత్తం ${roundedAmount} రూపాయలు అని సరిచూసుకోండి.`
            : `Naalgava dasha. Sweekartha peru ${merchantName}, mariyu motham ${roundedAmount} roopaayalu ani sarichoosukondi.`,
          lang: 'te',
        };
      case 5:
        return {
          displayText: 'ఐదవ దశ: మీ రహస్య UPI పిన్‌ను మీ బ్యాంక్ యాప్‌లో మాత్రమే నమోదు చేయండి',
          spokenText: hasNativeVoice
            ? 'ఐదవ దశ. మీ బ్యాంక్ UPI యాప్‌లోనే సురక్షితంగా చెల్లింపు పూర్తి చేయండి. మీ రహస్య UPI పిన్‌ను బ్యాంక్ యాప్‌లో మాత్రమే నమోదు చేయండి. పిన్ ఎవరికీ చెప్పవద్దు.'
            : 'Aidava dasha. Mee bank UPI app lone surakshithamgaa chellimpu poorthi cheyandi. Mee rahasya UPI pin nu bank app lo maathrame namodu cheyandi. Pin evarikee cheppavaddhu.',
          lang: 'te',
        };
      case 'processing':
        return {
          displayText: 'చెల్లింపు ప్రక్రియ జరుగుతోంది. దయచేసి వేచి ఉండండి...',
          spokenText: hasNativeVoice
            ? 'మీ చెల్లింపు ప్రక్రియ జరుగుతోంది. దయచేసి వేచి ఉండండి, ఈ విండోను మూసివేయవద్దు.'
            : 'Mee chellimpu prakriya jaruguthondi. Dayachesi vechi undandi, ee window nu moosiveyavaddhu.',
          lang: 'te',
        };
      case 'success':
        return {
          displayText: `చెల్లింపు విజయవంతమైంది! ${merchantName} కి ₹${roundedAmount} అందాయి`,
          spokenText: hasNativeVoice
            ? `చెల్లింపు విజయవంతమైంది! ${merchantName} కి ${roundedAmount} రూపాయలు అందాయి. ధన్యవాదాలు.`
            : `Chellimpu vijayavanthamaindi! ${merchantName} ki ${roundedAmount} roopaayalu andaayi. Dhanyavaadhalu.`,
          lang: 'te',
        };
      case 'failed':
        return {
          displayText: 'చెల్లింపు పూర్తి కాలేదు. మీ ఖాతా నుండి డబ్బు కట్ కాలేదు',
          spokenText: hasNativeVoice
            ? 'చెల్లింపు పూర్తి కాలేదు. మీ ఖాతా నుండి డబ్బు కట్ కాలేదు. మీరు మళ్ళీ ప్రయత్నించవచ్చు లేదా QR కోడ్ స్కాన్ చేయవచ్చు.'
            : 'Chellimpu poorthi kaaledu. Mee khaathaa nundi dabbu cut kaaledu. Meeru mallee prayathninchavachu leda QR code scan cheyavachu.',
          lang: 'te',
        };
    }
  }

  if (lang === 'hi') {
    switch (step) {
      case 1:
        return {
          displayText: `पहला चरण: कृपया भुगतान राशि की जांच करें: ₹${roundedAmount}`,
          spokenText: hasNativeVoice
            ? `पहला चरण. कृपया भुगतान राशि की जांच करें: ${roundedAmount} रुपये।`
            : `Pehla charan. Kripya bhugtan rashi ki jaanch karein: ${roundedAmount} rupaye.`,
          lang: 'hi',
        };
      case 2:
        return {
          displayText: 'दूसरा चरण: किसी भी UPI ऐप से भुगतान करने के लिए बटन दबाएं',
          spokenText: hasNativeVoice
            ? 'दूसरा चरण. अपने फोन के किसी भी UPI ऐप से भुगतान करने के लिए बटन दबाएं।'
            : 'Doosra charan. Apne phone ke kisi bhi UPI app se bhugtan karne ke liye button dabayein.',
          lang: 'hi',
        };
      case 3:
        return {
          displayText: 'तीसरा चरण: आपके फोन का बैंक UPI ऐप अब खुल जाएगा',
          spokenText: hasNativeVoice
            ? 'तीसरा चरण. आपके फोन का बैंक UPI ऐप अब खुल जाएगा।'
            : 'Teesra charan. Aapke phone ka bank UPI app ab khul jayega.',
          lang: 'hi',
        };
      case 4:
        return {
          displayText: `चौथा चरण: प्राप्तकर्ता का नाम ${merchantName}, और राशि ₹${roundedAmount} की जांच करें`,
          spokenText: hasNativeVoice
            ? `चौथा चरण. कृपया प्राप्तकर्ता का नाम ${merchantName}, और राशि ${roundedAmount} रुपये की पुष्टि करें।`
            : `Chautha charan. Kripya praaptkarta ka naam ${merchantName}, aur rashi ${roundedAmount} rupaye ki pushti karein.`,
          lang: 'hi',
        };
      case 5:
        return {
          displayText: 'पांचवा चरण: अपना UPI पिन केवल अपने बैंक ऐप में ही दर्ज करें',
          spokenText: hasNativeVoice
            ? 'पांचवा चरण. अपना भुगतान बैंक UPI ऐप में सुरक्षित रूप से पूरा करें। अपना गोपनीय UPI पिन केवल अपने बैंक ऐप में दर्ज करें। पिन किसी को न बताएं।'
            : 'Paanchva charan. Apna bhugtan bank UPI app mein surakshit roop se poora karein. Apna gopneey UPI pin kewal apne bank app mein darj karein. Pin kisi ko na batayein.',
          lang: 'hi',
        };
      case 'processing':
        return {
          displayText: 'भुगतान की प्रक्रिया जारी है. कृपया प्रतीक्षा करें...',
          spokenText: hasNativeVoice
            ? 'भुगतान की प्रक्रिया जारी है। कृपया प्रतीक्षा करें और यह विंडो बंद न करें।'
            : 'Bhugtan ki prakriya jaari hai. Kripya prateeksha karein aur yeh window band na karein.',
          lang: 'hi',
        };
      case 'success':
        return {
          displayText: `भुगतान सफल रहा! ${merchantName} को ₹${roundedAmount} प्राप्त हुए`,
          spokenText: hasNativeVoice
            ? `भुगतान सफल रहा! ${merchantName} को ${roundedAmount} रुपये का भुगतान हो गया है। धन्यवाद।`
            : `Bhugtan safal raha! ${merchantName} ko ${roundedAmount} rupaye ka bhugtan ho gaya hai. Dhanyavaad.`,
          lang: 'hi',
        };
      case 'failed':
        return {
          displayText: 'भुगतान पूरा नहीं हो सका. आपके खाते से कोई पैसा नहीं कटा है',
          spokenText: hasNativeVoice
            ? 'भुगतान पूरा नहीं हो सका। आपके खाते से कोई पैसा नहीं कटा है। आप पुनः प्रयास कर सकते हैं या QR कोड स्कैन कर सकते हैं।'
            : 'Bhugtan poora nahi ho saka. Aapke khaate se koi paisa nahi kata hai. Aap punah prayas kar sakte hain ya QR code scan kar sakte hain.',
          lang: 'hi',
        };
    }
  }

  // Default: English (en)
  switch (step) {
    case 1:
      return {
        displayText: `Step 1: Please check the payment amount: ₹${roundedAmount}`,
        spokenText: `Step 1. Please check the payment amount: ${roundedAmount} Rupees.`,
        lang: 'en',
      };
    case 2:
      return {
        displayText: 'Step 2: Tap the button below to choose your UPI payment app',
        spokenText: 'Step 2. Tap the button below to pay with any UPI app installed on your phone.',
        lang: 'en',
      };
    case 3:
      return {
        displayText: 'Step 3: Your phone will now open your bank UPI application',
        spokenText: 'Step 3. Your phone will now launch your selected bank UPI application.',
        lang: 'en',
      };
    case 4:
      return {
        displayText: `Step 4: Verify the payee name: ${merchantName}, and amount: ₹${roundedAmount}`,
        spokenText: `Step 4. Please verify the payee name: ${merchantName}, and the amount: ${roundedAmount} Rupees before confirming.`,
        lang: 'en',
      };
    case 5:
      return {
        displayText: 'Step 5: Complete payment safely inside your bank app. Never share your PIN',
        spokenText:
          'Step 5. Complete payment safely inside your bank app. Enter your secret UPI PIN only inside your official bank app. Never share your PIN with anyone.',
        lang: 'en',
      };
    case 'processing':
      return {
        displayText: 'Your payment is being processed. Please wait...',
        spokenText: 'Your payment is being securely processed. Please wait and do not close this window.',
        lang: 'en',
      };
    case 'success':
      return {
        displayText: `Payment successful! ₹${roundedAmount} has been paid to ${merchantName}`,
        spokenText: `Payment successful! ${roundedAmount} Rupees has been paid to ${merchantName}. Thank you for supporting the cooperative worker.`,
        lang: 'en',
      };
    case 'failed':
      return {
        displayText: 'Payment was not completed. No money was deducted from your account',
        spokenText:
          'Payment was not completed. No money was deducted from your account. You can try again or scan the QR code.',
        lang: 'en',
      };
  }
};
