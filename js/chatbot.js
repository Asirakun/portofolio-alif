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

// Netlify Function URL (API key aman di server)
const GEMINI_FUNCTION_URL = '/.netlify/functions/gemini';

// Portfolio context untuk Gemini
const portfolioContext = `
Kamu adalah asisten virtual AI bernama "Alif Bot" untuk portfolio website Alif Siky Ridhofa.

Cara menjawab:
- Pakai bahasa Indonesia sehari-hari yang santai dan mudah dimengerti
- Jangan pakai istilah teknis yang rumit, kecuali ditanya soal teknis
- Jawab singkat dan to the point (maksimal 2-3 kalimat per poin)
- Pakai emoji biar lebih friendly 😊
- Kalau ditanya soal project, jelaskan fungsinya dari sisi pengguna, bukan dari sisi teknis
- Jangan pakai format bullet point terlalu banyak, lebih baik pakai kalimat biasa

INFO ALIF SIKY RIDHOFA:

Siapa Alif?
Alif adalah seorang developer (pembuat aplikasi & website) yang sudah punya pengalaman 3+ tahun. Dia bisa bikin website, aplikasi HP, dan desain tampilan yang keren.

Keahlian utama:
- Bikin website (pakai React, Vue.js, HTML, CSS, JavaScript)
- Bikin aplikasi backend/server (Node.js, Python, PHP, Laravel)
- Bikin aplikasi HP (React Native)
- Desain tampilan UI/UX (Figma, Adobe XD)
- Database (MySQL, MongoDB, PostgreSQL)

Pencapaian:
- 50+ project sudah selesai
- 20+ klien puas
- 99% tingkat kepuasan

Project yang pernah dibuat:
1. E-Commerce Platform - Toko online lengkap bisa bayar, keranjang belanja, dan halaman admin
2. Task Manager App - Aplikasi untuk kelola tugas tim secara bareng-bareng
3. Finance Dashboard - Dashboard untuk lihat data keuangan dalam bentuk grafik
4. Health Tracker - Aplikasi untuk pantau kesehatan dan olahraga di HP
5. Restaurant Website - Website restoran yang bisa reservasi meja online
6. Learning Management System - Platform belajar online dengan video dan kuis

Layanan:
- Bikin website modern
- Bikin aplikasi HP (Android & iOS)
- Desain tampilan aplikasi/website
- Konsultasi teknologi
- Maintenance & perbaikan

Kontak:
- Email: alifsikyridhofa11@gmail.com
- GitHub: github.com/Asirakun
- LinkedIn: linkedin.com/in/alif
- Instagram: @alff_skyy
- Website: alifporto.netlify.app

Aturan:
- Kalau ditanya di luar topik portfolio, jawab sopan tapi arahkan balik ke portfolio
- Kalau ditanya harga, suruh hubungi langsung lewat form kontak atau email
- Promosikan Alif dengan cara yang natural dan tidak berlebihan
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
        console.error('Chatbot Error:', error);

        // Gunakan fallback response jika API gagal
        const fallback = getFallbackResponse(message);
        addMessage(fallback, 'bot');
    }

    // Re-enable input
    chatbotInput.disabled = false;
    chatbotSend.disabled = false;
    chatbotInput.focus();
}

// Fallback responses saat API tidak tersedia
function getFallbackResponse(message) {
    const msg = message.toLowerCase();

    // Salam & sapaan
    if (msg.match(/^(halo|hai|hello|hi|hey|selamat|assalam|apa kabar)/)) {
        return 'Halo! 👋 Selamat datang di portfolio Alif Siky Ridhofa! Saya Alif Bot, asisten virtual di sini. Ada yang bisa saya bantu? Kamu bisa tanya soal skill, project, atau layanan Alif! 😊';
    }

    // Siapa Alif
    if (msg.match(/(siapa|tentang|about|profil|profile)/) && msg.match(/(alif|kamu|lo|lu|dia)/)) {
        return 'Alif Siky Ridhofa adalah seorang Full Stack Developer & UI/UX Designer dengan pengalaman 3+ tahun. 🚀 Dia sudah menyelesaikan 50+ project dengan 20+ klien yang puas. Alif bisa bikin website, aplikasi HP, dan desain tampilan yang keren! 😎';
    }

    // Skills & keahlian
    if (msg.match(/(skill|keahlian|bisa apa|kemampuan|teknologi|tech|bahasa pemrograman|programming)/)) {
        return 'Alif punya banyak keahlian nih! 💪\n\n🌐 **Website**: React.js, Vue.js, HTML, CSS, JavaScript, Tailwind\n⚙️ **Backend**: Node.js, Python, PHP, Laravel\n📱 **Mobile**: React Native\n🎨 **Design**: Figma, Adobe XD\n🗄️ **Database**: MySQL, MongoDB, PostgreSQL\n\nLengkap kan? 😄';
    }

    // Project
    if (msg.match(/(project|proyek|portfolio|karya|hasil kerja|apa aja|apa saja)/)) {
        return 'Berikut beberapa project keren yang pernah Alif buat! 🎯\n\n🛒 **E-Commerce Platform** — Toko online lengkap\n📋 **Task Manager** — Aplikasi kelola tugas tim\n📊 **Finance Dashboard** — Dashboard data keuangan\n💪 **Health Tracker** — Aplikasi pantau kesehatan\n🍽️ **Restaurant Website** — Website restoran + reservasi\n📚 **Learning Management System** — Platform belajar online\n\nKamu bisa lihat detailnya di halaman project ya! 😊';
    }

    // Kontak
    if (msg.match(/(kontak|contact|hubung|email|whatsapp|ig|instagram|github|linkedin)/)) {
        return 'Kamu bisa hubungi Alif lewat: 📬\n\n📧 Email: alifsikyridhofa11@gmail.com\n🐙 GitHub: github.com/Asirakun\n💼 LinkedIn: linkedin.com/in/alif\n📸 Instagram: @alff_skyy\n\nAtau langsung isi form kontak di bawah halaman ini! 😊';
    }

    // Layanan & jasa
    if (msg.match(/(layanan|jasa|service|bisa bantu|bikin|buat|order|pesan)/)) {
        return 'Alif menyediakan beberapa layanan: 🛠️\n\n🌐 Bikin website modern & responsive\n📱 Bikin aplikasi HP (Android & iOS)\n🎨 Desain tampilan UI/UX\n💡 Konsultasi teknologi\n🔧 Maintenance & perbaikan\n\nKalau tertarik, langsung hubungi lewat form kontak atau email ya! 😊';
    }

    // Harga
    if (msg.match(/(harga|biaya|cost|price|tarif|bayar|murah|mahal|berapa)/)) {
        return 'Untuk harga tergantung dari jenis dan kompleksitas projectnya ya. 💰 Lebih baik langsung hubungi Alif lewat email (alifsikyridhofa11@gmail.com) atau isi form kontak di website ini supaya bisa diskusi lebih detail! 😊';
    }

    // Pengalaman
    if (msg.match(/(pengalaman|experience|lama|tahun|berapa lama)/)) {
        return 'Alif sudah punya pengalaman 3+ tahun di dunia development! 📅 Selama itu, dia sudah menyelesaikan 50+ project dengan 20+ klien dan tingkat kepuasan 99%. Keren kan? 🔥';
    }

    // Terima kasih
    if (msg.match(/(terima kasih|makasih|thanks|thank you|thx)/)) {
        return 'Sama-sama! 🙏😊 Senang bisa membantu. Kalau ada pertanyaan lain tentang portfolio Alif, jangan ragu untuk tanya ya!';
    }

    // Default response
    return 'Terima kasih sudah bertanya! 😊 Saya bisa bantu kamu tentang:\n\n👤 **Profil Alif** — Siapa Alif Siky Ridhofa\n💻 **Skills** — Keahlian & teknologi\n🎯 **Project** — Portfolio & karya\n📬 **Kontak** — Cara menghubungi\n🛠️ **Layanan** — Jasa yang ditawarkan\n\nCoba tanya salah satu topik di atas ya!';
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

// Get response via Netlify Function (API key aman di server)
async function getGeminiResponse(userMessage) {
    const response = await fetch(GEMINI_FUNCTION_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: userMessage,
            context: portfolioContext
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Function Error:', errorData);
        throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    if (data.reply) {
        return data.reply;
    } else {
        throw new Error('Tidak ada respon dari AI');
    }
}
