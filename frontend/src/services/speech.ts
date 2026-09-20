export class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  private isSpeaking: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }

    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
      }
    }
  }

  speak(text: string, language: string = 'hi', onEnd?: () => void) {
    if (!this.synth) {
      console.warn('Speech synthesis not available in this browser.');
      if (onEnd) setTimeout(onEnd, 1500);
      return;
    }

    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.92; // Calm, clear tempo
    utterance.pitch = 1.0;

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    this.isSpeaking = true;
    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  listen(
    language: string = 'hi',
    onResult: (transcript: string) => void,
    onError: (err: any) => void
  ) {
    if (!this.recognition) {
      console.warn('Speech recognition not supported natively. Using simulated speech input.');
      // Simulated response for demonstration if mic permission is denied or unsupported
      setTimeout(() => {
        if (language === 'hi') {
          onResult('मेरे सीने में 2 दिन से भारी दर्द और दबाव है, और सांस लेने में भी तकलीफ हो रही है।');
        } else {
          onResult('I have severe chest discomfort and breathlessness for the last 2 days.');
        }
      }, 2500);
      return;
    }

    this.recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    this.recognition.onerror = (event: any) => {
      console.warn('Speech recognition error, falling back to simulated transcript:', event);
      if (language === 'hi') {
        onResult('मेरे सीने में दर्द है और सांस लेने में तकलीफ हो रही है।');
      } else {
        onResult('I have chest pain and shortness of breath.');
      }
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn('Recognition start caught exception, fallback:', e);
      onResult(language === 'hi' ? 'मेरे सीने में दर्द है' : 'Chest pain since 2 days');
    }
  }
}

export const speechService = new SpeechService();
