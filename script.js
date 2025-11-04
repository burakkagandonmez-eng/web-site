// Eczane Asistan Demo JavaScript
class EczaneAsistanDemo {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.isSupported = this.checkBrowserSupport();
        
        this.initializeElements();
        this.setupEventListeners();
        
        if (this.isSupported) {
            this.initializeSpeechRecognition();
        } else {
            this.showBrowserSupportMessage();
        }
        
        this.loadPharmacyResponses();
    }
    
    // Check browser support for Web Speech API
    checkBrowserSupport() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        return !!(SpeechRecognition && this.synthesis);
    }
    
    // Initialize DOM elements
    initializeElements() {
        this.voiceButton = document.getElementById('voiceButton');
        this.buttonText = document.getElementById('buttonText');
        this.resetButton = document.getElementById('resetButton');
        this.chatMessages = document.getElementById('chatMessages');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.statusText = document.getElementById('statusText');
        this.exampleCard = document.getElementById('exampleCard');
        this.closeCard = document.getElementById('closeCard');
        this.exampleItems = document.querySelectorAll('.example-item');
    }
    
    // Setup event listeners
    setupEventListeners() {
        this.voiceButton.addEventListener('click', () => this.toggleListening());
        this.resetButton.addEventListener('click', () => this.resetChat());
        this.closeCard.addEventListener('click', () => this.hideExampleCard());
        
        this.exampleItems.forEach(item => {
            item.addEventListener('click', () => this.useExamplePrompt(item));
        });
        
        // Hide example card on scroll for mobile
        window.addEventListener('scroll', () => {
            if (window.innerWidth <= 768) {
                this.hideExampleCard();
            }
        });
    }
    
    // Initialize speech recognition
    initializeSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'tr-TR'; // Turkish language
        
        this.recognition.onstart = () => {
            this.setListeningState(true);
            this.updateStatus('Dinleniyor...');
        };
        
        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.processUserInput(transcript);
        };
        
        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.handleRecognitionError(event.error);
        };
        
        this.recognition.onend = () => {
            this.setListeningState(false);
            this.updateStatus('Hazır');
        };
    }
    
    // Toggle listening state
    toggleListening() {
        if (!this.isSupported) return;
        
        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }
    
    // Set listening state UI
    setListeningState(listening) {
        this.isListening = listening;
        
        if (listening) {
            this.voiceButton.classList.add('listening');
            this.buttonText.textContent = 'Dinleniyor';
        } else {
            this.voiceButton.classList.remove('listening');
            this.buttonText.textContent = 'Dinle';
        }
    }
    
    // Update status indicator
    updateStatus(text) {
        this.statusText.textContent = text;
    }
    
    // Process user input
    processUserInput(transcript) {
        this.addMessage('user', transcript);
        
        // Simulate processing delay
        setTimeout(() => {
            const response = this.generateResponse(transcript);
            this.addMessage('assistant', response);
            this.speakResponse(response);
        }, 1000);
    }
    
    // Generate pharmacy-specific response
    generateResponse(input) {
        const lowerInput = input.toLowerCase();
        
        // Greeting responses
        if (lowerInput.includes('merhaba') || lowerInput.includes('selam') || lowerInput.includes('hello')) {
            return 'Merhaba! Size nasıl yardımcı olabilirim? Eczane ile ilgili herhangi bir sorunuz var mı?';
        }
        
        // Painkiller responses
        else if (lowerInput.includes('ağrı') && (lowerInput.includes('kesici') || lowerInput.includes('ilaç'))) {
            const responses = [
                'Tabii ki! Ağrı kesici olarak parasetamol ve ibuprofen yaygın olarak kullanılır. Paracetamol 500mg günde 3-4 kez, ibuprofen 400mg günde 3 kez alınabilir. Hangisini tercih edersiniz?',
                'Ağrı kesici önerim: Paracetamol güvenli bir seçenektir ve çoğu hasta için uygundur. Günde 3-4 kez 500mg alabilirsiniz. Başka bir sorunuz var mı?',
                'Ağrı kesici konusunda: Her iki ilaç da etkilidir. Paracetamol mideye daha naziktir, ibuprofen ise antiinflamatuvar özelliği vardır. Doktorunuzla görüşmeyi unutmayın.'
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Fever reducer responses
        else if (lowerInput.includes('ateş') && (lowerInput.includes('düşürücü') || lowerInput.includes('ilac'))) {
            const responses = [
                'Ateş düşürücü olarak parasetamol çok etkilidir. 500mg günde 4 kez alabilirsiniz. Çocuklar için doz farklıdır. Yaşınızı belirtebilir misiniz?',
                'Ateş düşürmek için paracetamol ve ibuprofen kullanabilirsiniz. Paracetamol daha güvenli seçenektir. Bol sıvı tüketmeyi de unutmayın.',
                'Ateş düşürücü önerim: Paracetamol 500mg, çocuklar için ise şurup formu var. Yüksek ateş devam ederse doktora başvurun.'
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Antibiotic responses
        else if (lowerInput.includes('antibiyotik')) {
            const responses = [
                'Antibiyotik kullanımı konusunda dikkatli olmalısınız. Reçetesiz antibiyotik satışı yasal değildir. Şikayetinizi doktorunuzla paylaşın, gerekli görürse reçete yazacaktır.',
                'Antibiyotik mutlaka doktor kontrolünde kullanılmalıdır. Yanlış kullanım direnç gelişimine neden olabilir. Hangi şikayet için antibiyotik arıyorsunuz?',
                'Antibiyotikler sadece doktor reçetesiyle satılır. Bakteriyel enfeksiyon şüpheniz varsa aile hekiminize başvurun.'
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Cold/flu responses
        else if (lowerInput.includes('grip') || lowerInput.includes('soğuk algınlığı') || lowerInput.includes('nezle')) {
            const responses = [
                'Grip için antihistaminik ve parasetamol içeren kombinasyon ilaçları mevcuttur. Ancak semptomlarınıza göre en uygununu önerebilirim. Hangi şikayetleriniz var?',
                'Grip tedavisinde bol sıvı, dinlenme çok önemli. Ayrıca semptom giderici ilaçlar kullanabilirsiniz. Bu kış mevsimi için C vitamini de önerilir.',
                'Soğuk algınlığı için burun spreyleri, öksürük şurupları ve ateş gidericiler faydalıdır. Ancak uzun süren şikayetlerde doktora başvurun.'
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Allergy responses
        else if (lowerInput.includes('alerji') || lowerInput.includes('kaşıntı') || lowerInput.includes('kızarıklık')) {
            const responses = [
                'Alerji için antihistaminik ilaçlar faydalıdır. Loratadin ve setirizin günlük 1 kez alınır. Kaşıntı için topikal kremler de kullanabilirsiniz.',
                'Alerjik reaksiyonlar için antihistaminik öneririm. Şiddetli durumlarda mutlaka doktora başvurun. Etiler, kedi, koku gibi tetikleyici faktörlerden kaçının.',
                'Alerji semptomları için setirizin 10mg günde 1 kez kullanabilirsiniz. Cilt kızarıklıkları için aloe vera jeli de rahatlatıcıdır.'
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Vitamin responses
        else if (lowerInput.includes('vitamin') || lowerInput.includes('vit')) {
            const responses = [
                'Vitamin desteği için özellikle C vitamini kış aylarında faydalıdır. D vitamini de eksikliği yaygın olan bir vitamindir. Hangi vitamin hakkında bilgi istiyorsunuz?',
                'Vitamin takviyeleri dengeli beslenmenin yerini tutmaz. C vitamini günlük 500mg, D vitamini ise doktor kontrolünde kullanılır.',
                'Vitamin desteği almadan önce kan tahlili yaptırmanızı öneririm. Böylece gerçek eksikliğinizi tespit edebiliriz.'
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Side effects
        else if (lowerInput.includes('yan etki') || lowerInput.includes('zarar')) {
            return 'İlaçların yan etkileri kişiden kişiye değişebilir. Her ilacın prospektüsünü mutlaka okuyun. Ciddi yan etki görürseniz ilacı kesip doktora başvurun. Hangi ilaç için endişeniz var?';
        }
        
        // Dosage questions
        else if (lowerInput.includes('doz') || lowerInput.includes('nasıl') && lowerInput.includes('alınır')) {
            return 'İlaç dozları kişinin yaş, kilo ve sağlık durumuna göre değişir. Mutlaka doktor veya eczacınıza danışın. Genel doz bilgileri verilebilir ama kişisel öneriler doktor tarafından yapılmalı.';
        }
        
        // Generic pharmacy questions
        else if (lowerInput.includes('eczane') || lowerInput.includes('ilaç')) {
            return 'Size eczane konusunda yardımcı olmaktan mutluluk duyarım. Hangi konuda bilgi istiyorsunuz? İlaç etkileşimleri, dozaj, yan etkiler veya semptomlar hakkında sorabilirsiniz.';
        }
        
        // Thank you responses
        else if (lowerInput.includes('teşekkür') || lowerInput.includes('sağol')) {
            return 'Rica ederim! Size yardımcı olabildiğim için mutluyum. Başka sorunuz varsa çekinmeden sorun.';
        }
        
        // Default response
        else {
            const defaultResponses = [
                'Bu konuda detaylı bilgi için doktorunuza danışmanızı öneririm. Size başka nasıl yardımcı olabilirim?',
                'Bu soruyu daha iyi yanıtlayabilmem için daha detaylı bilgi verebilir misiniz?',
                'Merak ettiğiniz konuyu daha spesifik olarak sorabilir misiniz? Size yardımcı olmaktan memnuniyet duyarım.',
                'Bu konuda eczacınıza veya doktorunuza danışmanız en doğru olacaktır. Başka bir sorunuz var mı?'
            ];
            return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }
    }
    
    // Add message to chat
    addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const avatar = type === 'assistant' ? '🤖' : '👤';
        const messageContent = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <p>${content}</p>
            </div>
        `;
        
        messageDiv.innerHTML = messageContent;
        this.chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    // Speak response using speech synthesis
    speakResponse(text) {
        if (!this.synthesis) return;
        
        // Cancel any ongoing speech
        this.synthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'tr-TR';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        // Try to use a Turkish voice if available
        const voices = this.synthesis.getVoices();
        const turkishVoice = voices.find(voice => 
            voice.lang.includes('tr') || voice.name.includes('Turkish')
        );
        
        if (turkishVoice) {
            utterance.voice = turkishVoice;
        }
        
        utterance.onstart = () => {
            this.updateStatus('Konuşuyor...');
        };
        
        utterance.onend = () => {
            this.updateStatus('Hazır');
        };
        
        this.synthesis.speak(utterance);
    }
    
    // Reset chat
    resetChat() {
        this.chatMessages.innerHTML = `
            <div class="message assistant-message">
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <p>Merhaba! Ben Eczane Asistan'ın demo versiyonuyum. Size eczane konularında yardımcı olmaktan mutluluk duyarım. Mikrofon butonuna tıklayarak sorularınızı sorabilirsiniz.</p>
                </div>
            </div>
        `;
        
        // Cancel any ongoing speech
        if (this.synthesis) {
            this.synthesis.cancel();
        }
        
        this.updateStatus('Hazır');
    }
    
    // Handle example prompt
    useExamplePrompt(element) {
        const exampleText = element.getAttribute('data-example');
        this.addMessage('user', exampleText);
        
        setTimeout(() => {
            const response = this.generateResponse(exampleText);
            this.addMessage('assistant', response);
            this.speakResponse(response);
        }, 1000);
        
        // Hide example card on mobile after use
        if (window.innerWidth <= 768) {
            this.hideExampleCard();
        }
    }
    
    // Hide example card
    hideExampleCard() {
        this.exampleCard.style.display = 'none';
    }
    
    // Handle recognition errors
    handleRecognitionError(error) {
        let errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';
        
        switch (error) {
            case 'network':
                errorMessage = 'Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.';
                break;
            case 'not-allowed':
                errorMessage = 'Mikrofon izni reddedildi. Tarayıcı ayarlarından mikrofon iznini etkinleştirin.';
                break;
            case 'no-speech':
                errorMessage = 'Ses algılanamadı. Lütfen daha net konuşun.';
                break;
            case 'audio-capture':
                errorMessage = 'Mikrofon bulunamadı. Mikrofonunuzun bağlı olduğundan emin olun.';
                break;
        }
        
        this.addMessage('assistant', errorMessage);
        this.updateStatus('Hata oluştu');
        
        // Reset button state after error
        setTimeout(() => {
            this.setListeningState(false);
            this.updateStatus('Hazır');
        }, 3000);
    }
    
    // Show browser support message
    showBrowserSupportMessage() {
        this.addMessage('assistant', 'Üzgünüm, tarayıcınız ses tanıma özelliğini desteklemiyor. Lütfen Google Chrome veya Safari gibi modern bir tarayıcı kullanın.');
        
        // Disable voice button
        this.voiceButton.disabled = true;
        this.voiceButton.style.opacity = '0.5';
        this.voiceButton.style.cursor = 'not-allowed';
        
        this.updateStatus('Desteklenmiyor');
    }
    
    // Load pharmacy responses database
    loadPharmacyResponses() {
        // This could be expanded to load from a JSON file
        // For now, responses are handled in the generateResponse method
    }
}

// Initialize the demo when page loads
document.addEventListener('DOMContentLoaded', () => {
    const demo = new EczaneAsistanDemo();
    
    // Preload voices for speech synthesis
    if (demo.synthesis) {
        demo.synthesis.onvoiceschanged = () => {
            // Voices are loaded and ready
        };
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, stop any ongoing speech
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    }
});

// Export for potential use in other scripts
window.EczaneAsistanDemo = EczaneAsistanDemo;