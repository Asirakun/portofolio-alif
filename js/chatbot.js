// ==========================================
// AI Chatbot with Google Gemini
// ==========================================

const chatbotContainer = document.getElementById('chatbot');
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSend = document.getElementById('chatbot-send');
const chatbotSuggestions = document.getElementById('chatbot-suggestions');
const chatbotBadge = document.querySelector('.chatbot-badge');

// ==========================================
// Smooth Flying + Draggable + Blinking
// ==========================================
let isFlying = true;
let isDragging = false;
let isResting = false; // Robot is resting at a spot
let posX = 50;
let posY = window.innerHeight - 150;
let targetX = 200;
let targetY = 300;
let dragOffsetX = 0;
let dragOffsetY = 0;

// Set initial position
chatbotContainer.style.left = posX + 'px';
chatbotContainer.style.top = posY + 'px';
chatbotContainer.style.bottom = 'auto';
chatbotContainer.style.right = 'auto';

function updateTarget() {
    // Random new target within screen bounds
    const padding = 100;
    targetX = padding + Math.random() * (window.innerWidth - padding * 2 - 65);
    targetY = padding + Math.random() * (window.innerHeight - padding * 2 - 65);
}

function moveToTarget() {
    if (!isFlying || isDragging || isResting) return;
    
    const dx = targetX - posX;
    const dy = targetY - posY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // If arrived at target, rest for a while
    if (distance < 5) {
        isResting = true;
        chatbotToggle.classList.add('resting');
        
        // Rest for 4-8 seconds before moving again
        const restTime = 4000 + Math.random() * 4000;
        setTimeout(() => {
            if (isFlying && !isDragging) {
                isResting = false;
                chatbotToggle.classList.remove('resting');
                updateTarget();
                moveToTarget();
            }
        }, restTime);
        return;
    }
    
    // Very slow, smooth movement
    const speed = 0.5;
    const moveX = (dx / distance) * speed;
    const moveY = (dy / distance) * speed;
    
    posX += moveX;
    posY += moveY;
    
    // Keep within screen bounds
    const minX = 20;
    const maxX = window.innerWidth - 85;
    const minY = 80;
    const maxY = window.innerHeight - 85;
    
    posX = Math.max(minX, Math.min(maxX, posX));
    posY = Math.max(minY, Math.min(maxY, posY));
    
    // Apply position
    chatbotContainer.style.left = posX + 'px';
    chatbotContainer.style.top = posY + 'px';
    
    requestAnimationFrame(moveToTarget);
}

// ==========================================
// Draggable functionality
// ==========================================
chatbotToggle.addEventListener('mousedown', (e) => {
    isDragging = true;
    isResting = false;
    dragOffsetX = e.clientX - posX;
    dragOffsetY = e.clientY - posY;
    chatbotToggle.style.cursor = 'grabbing';
    chatbotToggle.classList.remove('resting');
    chatbotToggle.classList.add('dragging'); // Surprised face!
    e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    posX = e.clientX - dragOffsetX;
    posY = e.clientY - dragOffsetY;
    
    // Keep within bounds while dragging
    const minX = 20;
    const maxX = window.innerWidth - 85;
    const minY = 80;
    const maxY = window.innerHeight - 85;
    
    posX = Math.max(minX, Math.min(maxX, posX));
    posY = Math.max(minY, Math.min(maxY, posY));
    
    chatbotContainer.style.left = posX + 'px';
    chatbotContainer.style.top = posY + 'px';
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        chatbotToggle.style.cursor = 'grab';
        chatbotToggle.classList.remove('dragging'); // Back to normal
        
        // After drag, rest then move
        isResting = true;
        chatbotToggle.classList.add('resting');
        
        setTimeout(() => {
            if (isFlying) {
                isResting = false;
                chatbotToggle.classList.remove('resting');
                updateTarget();
                moveToTarget();
            }
        }, 3000);
    }
});

// Touch support for mobile
chatbotToggle.addEventListener('touchstart', (e) => {
    isDragging = true;
    isResting = false;
    const touch = e.touches[0];
    dragOffsetX = touch.clientX - posX;
    dragOffsetY = touch.clientY - posY;
    chatbotToggle.classList.remove('resting');
    chatbotToggle.classList.add('dragging'); // Surprised face!
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    posX = touch.clientX - dragOffsetX;
    posY = touch.clientY - dragOffsetY;
    
    const minX = 20;
    const maxX = window.innerWidth - 85;
    const minY = 80;
    const maxY = window.innerHeight - 85;
    
    posX = Math.max(minX, Math.min(maxX, posX));
    posY = Math.max(minY, Math.min(maxY, posY));
    
    chatbotContainer.style.left = posX + 'px';
    chatbotContainer.style.top = posY + 'px';
}, { passive: false });

document.addEventListener('touchend', () => {
    if (isDragging) {
        isDragging = false;
        chatbotToggle.classList.remove('dragging'); // Back to normal
        isResting = true;
        chatbotToggle.classList.add('resting');
        
        setTimeout(() => {
            if (isFlying) {
                isResting = false;
                chatbotToggle.classList.remove('resting');
                updateTarget();
                moveToTarget();
            }
        }, 3000);
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    const maxX = window.innerWidth - 85;
    const maxY = window.innerHeight - 85;
    if (posX > maxX) posX = maxX;
    if (posY > maxY) posY = maxY;
    chatbotContainer.style.left = posX + 'px';
    chatbotContainer.style.top = posY + 'px';
});

// Start movement after initial rest
setTimeout(() => {
    updateTarget();
    moveToTarget();
}, 2000);

// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyAPPR1EZLbvMKxcGnT0Va52HwOqXPaXbHE';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

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
- Email: alifsikyridhofa11@gmail.com
- GitHub: github.com/Asirakun
- LinkedIn: linkedin.com/in/alif
- Instagram: @alff_skyy
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
    
    // Stop flying when chat is open
    if (chatbotWindow.classList.contains('active')) {
        isFlying = false;
    } else {
        isFlying = true;
        flyAnimation();
    }
    
    if (chatbotBadge) {
        chatbotBadge.style.display = 'none';
    }
});

chatbotClose.addEventListener('click', () => {
    chatbotWindow.classList.remove('active');
    // Resume flying when chat is closed
    isFlying = true;
    flyAnimation();
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
        console.error('Error message:', error.message);
        
        // Check error type
        if (error.message.includes('429')) {
            addMessage('Maaf, chatbot sedang sibuk. Silakan tunggu beberapa detik dan coba lagi. 🙏', 'bot');
        } else if (error.message.includes('403')) {
            addMessage('Maaf, API key tidak valid atau sudah expired. 😅', 'bot');
        } else if (error.message.includes('404')) {
            addMessage('Maaf, model AI tidak ditemukan. Sedang diperbaiki. 🔧', 'bot');
        } else {
            addMessage(`Maaf, terjadi kesalahan: ${error.message}. Silakan coba lagi. 😊`, 'bot');
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
