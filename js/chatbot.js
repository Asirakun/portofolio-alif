// ==========================================
// AI Chatbot with Google Gemini
// ==========================================

const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSend = document.getElementById('chatbot-send');
const chatbotSuggestions = document.getElementById('chatbot-suggestions');
const chatbotBadge = document.querySelector('.chatbot-badge');

// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyBNRAoDCCUc5xjHMO77AAMDRC2cyk1dDGg';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent';

// Portfolio context untuk Gemini
const portfolioContext = `
Kamu adalah asisten virtual AI untuk portfolio website Alif Siky Ridhofa. 
Jawab pertanyaan dengan ramah, informatif, dan dalam Bahasa Indonesia.
Gunakan emoji sesekali untuk membuat percakapan lebih friendly.

INFORMASI TENTANG ALIF SIKY RIDHOFA:

PROFIL:
- Nama: Alif Siky Ridhofa
- Profesi: Full Stack Developer, UI/UX Designer, Mobile Developer
- Deskripsi: Developer yang passionate dan berdedikasi untuk menciptakan solusi digital yang inovatif dan memberikan pengalaman pengguna yang luar biasa.

SKILLS & TEKNOLOGI:
Frontend:
- HTML5, CSS3, JavaScript (Expert)
- React.js, Vue.js (Advanced)
- Tailwind CSS, Bootstrap (Expert)

Backend:
- Node.js, Express.js (Advanced)
- Python, Django (Intermediate)
- PHP, Laravel (Advanced)
- Database: MySQL, MongoDB, PostgreSQL

Tools & Others:
- Git & GitHub
- Figma, Adobe XD
- VS Code, Docker
- REST API, GraphQL

STATISTIK:
- 3+ tahun pengalaman
- 50+ project selesai
- 20+ klien puas
- 99% tingkat kepuasan

PROJECT PORTFOLIO:
1. E-Commerce Platform - Platform belanja online lengkap dengan payment gateway, cart system, dan admin dashboard. Tech: React, Node.js, MongoDB
2. Task Manager App - Aplikasi manajemen tugas dengan fitur collaboration real-time. Tech: Vue.js, Firebase
3. Finance Dashboard - Dashboard analitik keuangan dengan visualisasi data interaktif. Tech: React, D3.js, Express
4. Health Tracker - Aplikasi monitoring kesehatan dan fitness. Tech: React Native, Node.js
5. Restaurant Website - Website modern untuk bisnis kuliner dengan sistem reservasi. Tech: Next.js, Tailwind
6. Learning Management System - Platform e-learning dengan video streaming dan quiz. Tech: Laravel, Vue.js, MySQL

LAYANAN YANG DITAWARKAN:
- Web Development (Website modern & responsive)
- Mobile App Development (Android & iOS)
- UI/UX Design (Desain interface yang menarik)
- Technical Consulting (Konsultasi solusi digital)
- Maintenance & Support

KONTAK:
- Email: alif@example.com
- GitHub: github.com/Asirakun
- LinkedIn: linkedin.com/in/alif
- Instagram: @alif.siky
- Website: alifporto.netlify.app

INSTRUKSI TAMBAHAN:
- Jika ditanya hal di luar konteks portfolio, tetap jawab dengan sopan tapi arahkan kembali ke topik portfolio
- Jika ditanya harga/biaya, sarankan untuk menghubungi langsung via form contact
- Promosikan skill dan project Alif dengan baik
- Jawab dengan singkat dan jelas, maksimal 2-3 paragraf
`;

// Chat history untuk konteks percakapan
let chatHistory = [];

// Toggle chatbot window
chatbotToggle.addEventListener('click', () => {
    chatbotWindow.classList.toggle('active');
    if (chatbotBadge) {
        chatbotBadge.style.display = 'none';
    }
});

chatbotClose.addEventListener('click', () => {
    chatbotWindow.classList.remove('active');
});

// Send message
async function sendMessage() {
    const message = chatbotInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    chatbotInput.value = '';
    
    // Disable input while processing
    chatbotInput.disabled = true;
    chatbotSend.disabled = true;
    
    // Show typing indicator
    showTyping();
    
    try {
        // Get AI response
        const response = await getGeminiResponse(message);
        removeTyping();
        addMessage(response, 'bot');
    } catch (error) {
        removeTyping();
        console.error('Gemini API Error:', error);
        
        // Check error type
        if (error.message.includes('429')) {
            addMessage('Maaf, chatbot sedang sibuk. Silakan tunggu beberapa detik dan coba lagi. 🙏', 'bot');
        } else {
            addMessage('Maaf, terjadi kesalahan koneksi. Silakan refresh halaman dan coba lagi. 😊', 'bot');
        }
    }
    
    // Re-enable input
    chatbotInput.disabled = false;
    chatbotSend.disabled = false;
    chatbotInput.focus();
}

chatbotSend.addEventListener('click', sendMessage);
chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !chatbotInput.disabled) sendMessage();
});

// Suggestion buttons
chatbotSuggestions.addEventListener('click', (e) => {
    if (e.target.classList.contains('suggestion-btn') && !chatbotInput.disabled) {
        const question = e.target.dataset.question;
        chatbotInput.value = question;
        sendMessage();
    }
});

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    // Convert markdown-like syntax to HTML
    let formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>')
        .replace(/• /g, '&bull; ')
        .replace(/- /g, '&bull; ');
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${formattedText}</p>
        </div>
    `;
    
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    
    // Add to history
    chatHistory.push({
        role: sender === 'user' ? 'user' : 'model',
        parts: [{ text: text }]
    });
    
    // Keep only last 10 messages for context
    if (chatHistory.length > 10) {
        chatHistory = chatHistory.slice(-10);
    }
}

// Show typing indicator
function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot typing';
    typingDiv.innerHTML = `
        <div class="message-content">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Remove typing indicator
function removeTyping() {
    const typing = chatbotMessages.querySelector('.typing');
    if (typing) typing.remove();
}

// Get response from Gemini API
async function getGeminiResponse(userMessage) {
    // Gabungkan context dengan user message
    const fullPrompt = `${portfolioContext}\n\nPertanyaan user: ${userMessage}`;
    
    const requestBody = {
        contents: [
            {
                parts: [{ text: fullPrompt }]
            }
        ],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
        }
    };
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Details:', errorData);
        throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
    } else {
        console.error('Response data:', data);
        throw new Error('Invalid response format');
    }
}
