document.addEventListener('DOMContentLoaded', () => {

    /* 1. Обновление года в футере */
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    /* 2. Мобильное меню (Burger) */
    const burger = document.querySelector('.header__burger');
    const menu = document.querySelector('.header__menu');
    const menuLinks = document.querySelectorAll('.header__menu a');
    const body = document.body;

    function toggleMenu() {
        if (!burger || !menu) return;
        burger.classList.toggle('active');
        menu.classList.toggle('active');
        body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    }

    if (burger) {
        burger.addEventListener('click', toggleMenu);
    }

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menu && menu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    /* 3. Фиксированная шапка при скролле */
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (!header) return;
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* 4. Плавный скролл до якорей */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = header ? header.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* 5. Анимация появления элементов при скролле (Intersection Observer) */
    const animateElements = document.querySelectorAll('[data-animate]');
    if (animateElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Анимация воспроизводится один раз
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animateElements.forEach(el => observer.observe(el));
    }

    /* 6. Аккордеон FAQ */
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const headerBtn = item.querySelector('.accordion-header');
        if (!headerBtn) return;
        
        headerBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Закрываем все остальные (опционально)
            accordionItems.forEach(acc => {
                acc.classList.remove('active');
                const accBody = acc.querySelector('.accordion-body');
                if (accBody) accBody.style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                const body = item.querySelector('.accordion-body');
                if (body) {
                    body.style.maxHeight = body.scrollHeight + "px";
                }
            }
        });
    });

    /* 7. Валидация и отправка формы */
    const form = document.getElementById('bookingForm');
    const successMessage = document.getElementById('successMessage');
    const resetFormBtn = document.getElementById('resetForm');

    // Простая проверка телефона (минимум 10 цифр)
    function validatePhone(phone) {
        const re = /^[\d\+\-\(\) ]{10,20}$/;
        return Boolean(phone.match(re) && phone.replace(/\D/g, '').length >= 10);
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            // Очищаем предыдущие статусы
            form.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error', 'success');
            });

            // Проверка имени
            const nameInput = document.getElementById('name');
            if (nameInput) {
                if (!nameInput.value.trim()) {
                    nameInput.closest('.form-group').classList.add('error');
                    isValid = false;
                } else {
                    nameInput.closest('.form-group').classList.add('success');
                }
            }

            // Проверка телефона
            const phoneInput = document.getElementById('phone');
            if (phoneInput) {
                if (!validatePhone(phoneInput.value)) {
                    phoneInput.closest('.form-group').classList.add('error');
                    isValid = false;
                } else {
                    phoneInput.closest('.form-group').classList.add('success');
                }
            }

            // Проверка вида питомца
            const petTypeSelect = document.getElementById('petType');
            if (petTypeSelect) {
                if (!petTypeSelect.value) {
                    petTypeSelect.closest('.form-group').classList.add('error');
                    isValid = false;
                } else {
                    petTypeSelect.closest('.form-group').classList.add('success');
                }
            }

            if (isValid) {
                // Имитация успешной отправки формы на сервер (AJAX)
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Отправка...';
                submitBtn.disabled = true;

                // Задержка 1 секунда для имитации сети
                setTimeout(() => {
                    // Подсказка для разработчика: здесь можно вызвать пиксели বা метрики
                    // if (typeof ym !== 'undefined') { ym(12345678, 'reachGoal', 'lead_form'); }
                    
                    form.reset();
                    form.querySelectorAll('.form-group').forEach(group => {
                        group.classList.remove('success');
                    });
                    
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    
                    if (successMessage) {
                        successMessage.classList.remove('hidden');
                    }
                }, 1000); 
            }
        });
    }

    // Закрытие сообщения об успехе
    if (resetFormBtn && successMessage) {
        resetFormBtn.addEventListener('click', (e) => {
            e.preventDefault();
            successMessage.classList.add('hidden');
        });
    }

    /* 8. ВЕБ-АНАЛИТИКА (Учебное задание) */
    
    // Событие 1: Клик по кнопкам "Записаться" на карточках услуг
    const serviceButtons = document.querySelectorAll('.service-card .btn');
    serviceButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.service-card');
            const serviceName = card ? card.querySelector('.service-card__title').textContent : 'Неизвестная услуга';
            
            console.log(`[Analytics] Событие: click_service_booking, Услуга: ${serviceName}`);
            // if (typeof ym !== 'undefined') { ym(XXXXXX, 'reachGoal', 'click_service_booking', { service: serviceName }); }
            // if (typeof gtag !== 'undefined') { gtag('event', 'click_service_booking', { service_name: serviceName }); }
        });
    });

    // Событие 2: Клик по номеру телефона
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    // Если номера телефона текстом, без ссылок (как в текущей верстки), то вешаем слушатель на блок контактов
    const contactBlocks = document.querySelectorAll('.footer__contacts p, .booking__contacts-list li');
    contactBlocks.forEach(block => {
        if (block.textContent.includes('📞') || block.textContent.includes('+7')) {
            block.style.cursor = 'pointer'; // Делаем кликабельным визуально
            block.addEventListener('click', () => {
                console.log(`[Analytics] Событие: click_phone_number`);
                // if (typeof ym !== 'undefined') { ym(XXXXXX, 'reachGoal', 'click_phone_number'); }
                // if (typeof gtag !== 'undefined') { gtag('event', 'click_phone_number'); }
            });
        }
    });

    // Событие 3: Разворачивание вопросов в FAQ (дополняем существующий аккордеон)
    accordionItems.forEach(item => {
        const headerBtn = item.querySelector('.accordion-header');
        if (!headerBtn) return;
        
        headerBtn.addEventListener('click', () => {
            // Если он открывается (у него нет класса active ДО клика, значит он сейчас откроется)
            // ПРИМЕЧАНИЕ: из-за логики выше, класс active переключается позже, проверим текущее состояние:
            const willBeActive = !item.classList.contains('active'); 
            // так как этот обработчик повешен ПОСЛЕ основного, мы можем просто проверить наличие класса active, 
            // но для надёжности проверим сам заголовок
            if (item.classList.contains('active')) {
                const questionText = headerBtn.textContent.replace('+', '').trim();
                console.log(`[Analytics] Событие: faq_expand, Вопрос: ${questionText}`);
                // if (typeof ym !== 'undefined') { ym(XXXXXX, 'reachGoal', 'faq_expand', { question: questionText }); }
                // if (typeof gtag !== 'undefined') { gtag('event', 'faq_expand', { faq_question: questionText }); }
            }
        });
    });

});
