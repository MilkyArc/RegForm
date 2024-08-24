document.addEventListener('DOMContentLoaded', loadCaptcha);

async function loadCaptcha() {
    try {
        const response = await fetch('http://localhost:3000/captcha');
        if (!response.ok) {
            throw new Error('Failed to load CAPTCHA');
        }
        const result = await response.json();
        const captchaQuestionElement = document.getElementById('captchaQuestion');
        captchaQuestionElement.innerText = result.question;
        captchaQuestionElement.style.userSelect = "none"; 
    } catch (error) {
        console.error('Error loading CAPTCHA:', error);
        document.getElementById('captchaQuestion').innerText = 'Failed to load CAPTCHA';
    }
}
