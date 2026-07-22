// ===== Header Scroll Effect =====
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('header--scrolled');
    } else {
        header.classList.remove('header--scrolled');
    }
});

// ===== Mobile Menu =====
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Form Handling =====
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const consentCheckbox = document.getElementById('consent');

consentCheckbox.addEventListener('change', () => {
    submitBtn.disabled = !consentCheckbox.checked;
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const name = formData.get('name');
    const contact = formData.get('contact');
    const task = formData.get('task');
    
    // Simple validation
    if (!name.trim() || !contact.trim()) {
        alert('Пожалуйста, заполните имя и контакт для связи.');
        return;
    }
    
    // Format message for Telegram (if user has Telegram bot) or show success
    const message = `Новая заявка с сайта ЛТВ Студия:%0A%0AИмя: ${name}%0AКонтакт: ${contact}%0AЗадача: ${task || 'Не указана'}`;
    
    // Show success message
    form.innerHTML = `
        <div style="text-align: center; padding: 40px 0;">
            <div style="font-size: 3rem; margin-bottom: 16px;">&#10003;</div>
            <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 8px; color: #f1f5f9;">Заявка отправлена!</h3>
            <p style="color: #94a3b8; margin-bottom: 24px;">Мы ответим вам в течение дня</p>
            <button onclick="resetForm()" class="btn btn--outline" style="margin: 0 auto;">Отправить ещё</button>
        </div>
    `;
});

function resetForm() {
    form.innerHTML = `
        <div class="form__group">
            <label class="form__label" for="name">Ваше имя</label>
            <input class="form__input" type="text" id="name" name="name" placeholder="Как вас зовут?" required>
        </div>
        <div class="form__group">
            <label class="form__label" for="contact">Адрес электронной почты или номер телефона</label>
            <input class="form__input" type="text" id="contact" name="contact" placeholder="email@example.com или +7 999 123-45-67" required>
        </div>
        <div class="form__group">
            <label class="form__label" for="task">Опишите задачу</label>
            <textarea class="form__textarea" id="task" name="task" placeholder="Какое видео нужно? Для какой площадки? Какой бюджет?" rows="4"></textarea>
        </div>
        <div class="form__group">
            <label class="form__checkbox">
                <input class="form__checkbox-input" type="checkbox" id="consent" name="consent" required>
                <span class="form__checkbox-custom"></span>
                <span class="form__checkbox-text">Нажимая кнопку «Отправить», я даю свое согласие на обработку моих персональных данных, в соответствии с Федеральным законом от 27.07.2006 года №152-ФЗ «О персональных данных», на условиях и для целей, определенных в Согласии на обработку персональных данных <span class="form__checkbox-star" id="openConsent">*</span></span>
            </label>
        </div>
        <button class="btn btn--primary btn--full" type="submit" id="submitBtn" disabled>Отправить заявку</button>
    `;
    
    // Re-attach event listeners
    const newConsent = document.getElementById('consent');
    const newSubmitBtn = document.getElementById('submitBtn');
    const newOpenConsent = document.getElementById('openConsent');
    newConsent.addEventListener('change', () => {
        newSubmitBtn.disabled = !newConsent.checked;
    });
    newOpenConsent.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openModal();
    });
    form.addEventListener('submit', arguments.callee);
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation styles and observe elements
document.querySelectorAll('.advantage, .service-card, .process__step, .portfolio__item, .tool').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===== Video Autoplay on Hover (Portfolio) =====
document.querySelectorAll('.portfolio__video').forEach(video => {
    const item = video.closest('.portfolio__item');
    
    item.addEventListener('mouseenter', () => {
        video.play();
    });
    
    item.addEventListener('mouseleave', () => {
        video.pause();
    });
});

// ===== Stats Counter Animation =====
function animateValue(element, start, end, duration, suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.innerHTML = Math.floor(progress * (end - start) + start) + suffix;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// ===== Consent Modal =====
const consentModal = document.getElementById('consentModal');
const openConsentBtn = document.getElementById('openConsent');
const closeConsentModal = document.getElementById('closeConsentModal');
const closeConsentModalBtn = document.getElementById('closeConsentModalBtn');
const consentAccept = document.getElementById('consentAccept');
const consentDecline = document.getElementById('consentDecline');

function openModal() {
    consentModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    consentModal.classList.remove('active');
    document.body.style.overflow = '';
}

openConsentBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openModal();
});

closeConsentModal.addEventListener('click', closeModal);
closeConsentModalBtn.addEventListener('click', closeModal);

consentAccept.addEventListener('click', () => {
    document.getElementById('consent').checked = true;
    submitBtn.disabled = false;
    closeModal();
});

consentDecline.addEventListener('click', () => {
    document.getElementById('consent').checked = false;
    submitBtn.disabled = true;
    closeModal();
});

consentModal.addEventListener('click', (e) => {
    if (e.target === consentModal) closeModal();
});
