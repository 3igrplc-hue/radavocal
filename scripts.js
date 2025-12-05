/* ============================================
   RADA VOCAL — scripts.js
   Enhanced with rotation, parallax, particles
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    /* ========== БУРГЕР МЕНЮ ========== */
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileNav = document.getElementById('mobileNav');
    
    if (burgerBtn && mobileNav) {
        burgerBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
            burgerBtn.classList.toggle('open');
            document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
        });
        
        // Закрытие при клике на ссылку
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                burgerBtn.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
        
        // Закрытие при клике вне меню
        document.addEventListener('click', (e) => {
            if (!burgerBtn.contains(e.target) && !mobileNav.contains(e.target)) {
                mobileNav.classList.remove('open');
                burgerBtn.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }
    
    /* ========== ПЛАВНЫЙ СКРОЛЛ ========== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || !href.startsWith('#')) return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                // Закрытие мобильного меню
                if (mobileNav && mobileNav.classList.contains('open')) {
                    mobileNav.classList.remove('open');
                    burgerBtn.classList.remove('open');
                    document.body.style.overflow = '';
                }
                
                const headerHeight = 70;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    /* ========== ВРАЩЕНИЕ ЛОГОТИПА ========== */
    const rotatingLogo = document.querySelector('.rotating-logo');
    let rotationSpeed = 1; // 1=normal, 2=fast, 3=faster
    
    if (rotatingLogo) {
        // Клик для изменения скорости
        rotatingLogo.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Удаляем предыдущие классы скорости
            rotatingLogo.classList.remove('fast', 'faster');
            
            // Циклическое переключение скоростей
            if (rotationSpeed === 1) {
                rotatingLogo.classList.add('fast');
                rotationSpeed = 2;
                showNotification('Скорость вращения: Быстро');
            } else if (rotationSpeed === 2) {
                rotatingLogo.classList.add('faster');
                rotationSpeed = 3;
                showNotification('Скорость вращения: Максимум');
            } else {
                rotationSpeed = 1;
                showNotification('Скорость вращения: Нормальная');
            }
            
            // Визуальная обратная связь
            rotatingLogo.style.transform = `translateX(-50%) scale(1.1)`;
            setTimeout(() => {
                rotatingLogo.style.transform = `translateX(-50%) scale(1)`;
            }, 300);
        });
        
        // Параллакс при движении мыши
        document.addEventListener('mousemove', (e) => {
            if (window.innerWidth > 768) {
                const mouseX = e.clientX / window.innerWidth;
                const mouseY = e.clientY / window.innerHeight;
                
                const moveX = (mouseX - 0.5) * 25;
                const moveY = (mouseY - 0.5) * 15;
                
                rotatingLogo.style.transform = `translateX(-50%) translate3d(${moveX}px, ${moveY}px, 0)`;
            }
        });
        
        // Возврат в исходное положение
        document.addEventListener('mouseleave', () => {
            rotatingLogo.style.transform = `translateX(-50%)`;
        });
    }
    
    /* ========== ПАРАЛЛАКС ДЛЯ ФОТО ПЕВИЦЫ ========== */
    const singerContainer = document.querySelector('.singer-container');
    const singerImg = document.querySelector('.hero-singer');
    
    if (singerContainer && singerImg && window.innerWidth > 768) {
        // Параллакс при движении мыши
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            const moveX = (mouseX - 0.5) * 20;
            const moveY = (mouseY - 0.5) * 15;
            
            singerImg.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
            
            // Слегка поворачиваем контейнер
            const rotateY = (mouseX - 0.5) * 10;
            const rotateX = -(mouseY - 0.5) * 8;
            singerContainer.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        });
        
        // Возврат в исходное положение
        document.addEventListener('mouseleave', () => {
            singerImg.style.transform = `translate3d(0, 0, 0)`;
            singerContainer.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
        });
        
        // Эффект при наведении
        singerContainer.addEventListener('mouseenter', () => {
            singerContainer.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
        
        singerContainer.addEventListener('mouseleave', () => {
            singerContainer.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
    }
    
    /* ========== ЧАСТИЦЫ ЗОЛОТА (улучшенные) ========== */
    const canvas = document.getElementById('goldParticles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId = null;
        
        // Настройки частиц
        const settings = {
            particleCount: 80,
            maxParticleCount: 150,
            particleSize: { min: 1, max: 4 },
            speed: { min: 0.1, max: 0.3 },
            opacity: { min: 0.05, max: 0.4 },
            color: { r: 212, g: 166, b: 103 }
        };
        
        // Изменение размера канваса
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }
        
        // Класс частицы
        class Particle {
            constructor() {
                this.reset();
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * (settings.particleSize.max - settings.particleSize.min) + settings.particleSize.min;
                this.speedX = (Math.random() - 0.5) * (Math.random() * settings.speed.max + settings.speed.min);
                this.speedY = (Math.random() - 0.5) * (Math.random() * settings.speed.max + settings.speed.min);
                this.opacity = Math.random() * (settings.opacity.max - settings.opacity.min) + settings.opacity.min;
                this.wobble = Math.random() * 0.05;
                this.wobbleSpeed = Math.random() * 0.02 + 0.01;
                this.angle = Math.random() * Math.PI * 2;
                this.wave = Math.random() * Math.PI * 2;
                this.waveSpeed = Math.random() * 0.01 + 0.005;
                this.pulseSpeed = Math.random() * 0.02 + 0.01;
                this.pulse = Math.random() * 0.5 + 0.5;
            }
            
            update() {
                // Основное движение
                this.x += this.speedX + Math.sin(this.angle) * this.wobble;
                this.y += this.speedY + Math.cos(this.angle) * this.wobble;
                
                // Волновое движение
                this.x += Math.sin(this.wave) * 0.3;
                this.wave += this.waveSpeed;
                
                // Пульсация прозрачности
                this.pulse += this.pulseSpeed;
                this.opacity = (settings.opacity.min + settings.opacity.max) / 2 + 
                             Math.sin(this.pulse) * (settings.opacity.max - settings.opacity.min) / 2;
                
                // Вращение
                this.angle += this.wobbleSpeed;
                
                // Перерождение частицы
                if (this.x < -100 || this.x > canvas.width + 100 || 
                    this.y < -100 || this.y > canvas.height + 100) {
                    this.reset();
                    
                    // Появление с края экрана
                    if (Math.random() > 0.5) {
                        this.x = Math.random() > 0.5 ? -50 : canvas.width + 50;
                        this.y = Math.random() * canvas.height;
                    } else {
                        this.x = Math.random() * canvas.width;
                        this.y = Math.random() > 0.5 ? -50 : canvas.height + 50;
                    }
                }
            }
            
            draw() {
                // Основная частица
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${settings.color.r}, ${settings.color.g}, ${settings.color.b}, ${this.opacity})`;
                ctx.fill();
                
                // Внешнее свечение
                const glowSize = this.size * 3;
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, glowSize
                );
                gradient.addColorStop(0, `rgba(${settings.color.r}, ${settings.color.g}, ${settings.color.b}, ${this.opacity * 0.6})`);
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
                
                // Внутреннее свечение
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 240, 200, ${this.opacity * 0.8})`;
                ctx.fill();
            }
        }
        
        // Инициализация частиц
        function initParticles() {
            particles = [];
            const count = Math.min(
                settings.maxParticleCount,
                Math.floor((canvas.width * canvas.height) / 8000)
            );
            
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }
        
        // Анимация
        function animateParticles() {
            // Полупрозрачный фон для эффекта шлейфа
            ctx.fillStyle = 'rgba(11, 7, 6, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Обновление и отрисовка частиц
            particles.forEach(particle => {
                particle.update();
                particle.draw();
                
                // Соединение частиц линиями
                particles.forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${settings.color.r}, ${settings.color.g}, ${settings.color.b}, ${0.1 * (1 - distance/100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.stroke();
                    }
                });
            });
            
            animationId = requestAnimationFrame(animateParticles);
        }
        
        // Запуск
        resizeCanvas();
        animateParticles();
        
        // Обработка изменения размера окна
        window.addEventListener('resize', () => {
            resizeCanvas();
        });
        
        // Очистка при размонтировании
        window.addEventListener('beforeunload', () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        });
    }
    
    /* ========== FAQ АККОРДЕОН ========== */
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                
                // Закрываем все другие элементы
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('open');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = '0';
                        }
                    }
                });
                
                // Открываем/закрываем текущий
                if (!isOpen) {
                    item.classList.add('open');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    item.classList.remove('open');
                    answer.style.maxHeight = '0';
                }
            });
        }
    });
    
    /* ========== АНИМАЦИЯ ПРИ СКРОЛЛЕ ========== */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами
    document.querySelectorAll('.feature-card, .course-card, .game-card, .faq-item').forEach(el => {
        observer.observe(el);
    });
    
    // Добавляем CSS для анимации
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        .animate-in {
            animation: fadeUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            opacity: 0;
        }
        
        @keyframes fadeUp {
            from {
                opacity: 0;
                transform: translateY(40px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Анимация для фона */
        @keyframes backgroundShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `;
    document.head.appendChild(animationStyle);
    
    /* ========== КНОПКИ ЗАПИСИ ========== */
    const kaspiButtons = document.querySelectorAll('.kaspi-button, .cta-button');
    
    kaspiButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Эффект нажатия
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Симуляция записи (в реальном проекте здесь будет форма)
            showNotification('Скоро с вами свяжутся для подтверждения записи!');
            
            // Плавный скролл к форме (если она есть)
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const headerHeight = 70;
                const targetPosition = contactSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    /* ========== УВЕДОМЛЕНИЯ ========== */
    function showNotification(message) {
        // Удаляем предыдущие уведомления
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Создаем новое уведомление
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Стили для уведомления
        const notificationStyle = document.createElement('style');
        notificationStyle.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(90deg, var(--gold-1), var(--gold-2));
                color: #120b05;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 1000;
                transform: translateX(150%);
                animation: slideIn 0.5s forwards, fadeOut 0.5s forwards 2.5s;
                font-weight: 600;
                max-width: 350px;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .notification i {
                font-size: 20px;
            }
            
            @keyframes slideIn {
                to { transform: translateX(0); }
            }
            
            @keyframes fadeOut {
                to { opacity: 0; transform: translateX(150%); }
            }
        `;
        
        document.head.appendChild(notificationStyle);
        document.body.appendChild(notification);
        
        // Удаляем уведомление через 3 секунды
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
    
    /* ========== ПАРАЛЛАКС ПРИ СКРОЛЛЕ ========== */
    let lastScrollY = window.scrollY;
    
    function updateParallax() {
        const scrollY = window.scrollY;
        const delta = scrollY - lastScrollY;
        
        // Параллакс для элементов при скролле
        if (rotatingLogo) {
            const logoY = scrollY * 0.05;
            rotatingLogo.style.transform = `translateX(-50%) translateY(${logoY}px)`;
        }
        
        if (singerImg) {
            const singerY = scrollY * 0.1;
            singerImg.style.transform = `translateY(${singerY}px)`;
        }
        
        lastScrollY = scrollY;
    }
    
    // Оптимизированный обработчик скролла
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = requestAnimationFrame(updateParallax);
    }, { passive: true });
    
    /* ========== КОНТРОЛЬ ПЕРЕПОЛНЕНИЯ ========== */
    function checkOverflow() {
        // Проверяем, не выходит ли контент за пределы экрана
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.left < 0 || rect.right > window.innerWidth) {
                console.warn('Элемент выходит за пределы экрана:', el);
            }
        });
    }
    
    // Проверяем при загрузке и изменении размера
    window.addEventListener('load', checkOverflow);
    window.addEventListener('resize', checkOverflow);
    
    /* ========== ИНИЦИАЛИЗАЦИЯ ========== */
    console.log('Rada Vocal — сайт успешно загружен!');
    
    // Активация плавающей анимации для фото
    if (singerImg) {
        setTimeout(() => {
            singerImg.style.animationPlayState = 'running';
        }, 1000);
    }
});