// ==========================================
// Firebase Configuration
// ==========================================

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCz_akpw66IwiRrbWiMMr2ytJ4yZptpGg4",
    authDomain: "portofolio-alif-57589.firebaseapp.com",
    projectId: "portofolio-alif-57589",
    storageBucket: "portofolio-alif-57589.firebasestorage.app",
    messagingSenderId: "455630984966",
    appId: "1:455630984966:web:7dcf0297091432c6d5b087",
    measurementId: "G-RHRBMLHWM5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Initialize Analytics (optional)
const analytics = firebase.analytics();

console.log('%c🔥 Firebase Connected!', 'font-size: 14px; color: #FFA000;');

// ==========================================
// Contact Form - Save to Firestore
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                read: false
            };
            
            // Get submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            try {
                // Show loading state
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
                submitBtn.disabled = true;
                
                // Save to Firestore
                await db.collection('messages').add(formData);
                
                // Show success message
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Terkirim!';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                
                // Reset form
                contactForm.reset();
                
                // Show success notification
                showNotification('Pesan berhasil dikirim! Terima kasih telah menghubungi saya.', 'success');
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
                
            } catch (error) {
                console.error('Error sending message:', error);
                
                // Show error state
                submitBtn.innerHTML = '<i class="fas fa-times"></i> Gagal Mengirim';
                submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                
                // Show error notification
                showNotification('Gagal mengirim pesan. Silakan coba lagi.', 'error');
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }
});

// ==========================================
// Notification System
// ==========================================
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.firebase-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `firebase-notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}
