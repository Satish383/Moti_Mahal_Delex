/* ============================================================
   MOTI MAHAL DELUX – Premium Restaurant Website
   File: js/script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* ---------- AOS Initialization ---------- */
    AOS.init({
        duration: 900,
        easing: 'ease-out-cubic',
        once: true,
        offset: 80
    });

    /* ---------- Sticky Navbar ---------- */
    const mainNav = document.getElementById('mainNav');
    const backToTop = document.getElementById('backToTop');

    function handleScroll() {
        if (window.scrollY > 60) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }

        if (window.scrollY > 400) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    /* ---------- Back to Top ---------- */
    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ---------- Close Mobile Nav on Link Click ---------- */
    const navMenu = document.getElementById('navMenu');
    document.querySelectorAll('#navMenu .nav-link, #navMenu .btn-gold').forEach(function (link) {
        link.addEventListener('click', function () {
            if (navMenu.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navMenu) || new bootstrap.Collapse(navMenu, { toggle: false });
                bsCollapse.hide();
            }
        });
    });

    /* ---------- Active Nav Link on Scroll ---------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#mainNav .nav-link');

    function setActiveLink() {
        const scrollPos = window.scrollY + 120;
        sections.forEach(function (section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector('#mainNav .nav-link[href="#' + id + '"]');
            if (!link) return;
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function (l) { l.classList.remove('active'); });
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveLink, { passive: true });
    setActiveLink();

    /* ---------- Menu Category Filter ---------- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('#menuGrid .menu-item');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            menuItems.forEach(function (item) {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hide');
                    item.style.display = '';
                } else {
                    item.classList.add('hide');
                    item.style.display = 'none';
                }
            });
        });
    });

    /* ---------- Gallery Lightbox ---------- */
    const galleryItems = document.querySelectorAll('#galleryGrid .gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    const galleryImages = Array.from(galleryItems).map(function (item) {
        return item.getAttribute('data-img');
    });

    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        lightboxImg.src = galleryImages[currentIndex];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        lightboxImg.src = galleryImages[currentIndex];
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        lightboxImg.src = galleryImages[currentIndex];
    }

    galleryItems.forEach(function (item, index) {
        item.addEventListener('click', function () { openLightbox(index); });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', function (e) { e.stopPropagation(); showPrev(); });
    lightboxNext.addEventListener('click', function (e) { e.stopPropagation(); showNext(); });

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    /* ---------- Testimonials Swiper ---------- */
    new Swiper('.reviewsSwiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        pagination: {
            el: '.reviewsSwiper .swiper-pagination',
            clickable: true
        },
        breakpoints: {
            768: { slidesPerView: 2 },
            1200: { slidesPerView: 3 }
        }
    });

    /* ---------- Reservation Form Validation + WhatsApp ---------- */
    const reservationForm = document.getElementById('reservationForm');
    const successAlert = document.getElementById('reservationSuccess');
    const RESTAURANT_WHATSAPP = '919296918819';

    function setInvalid(input, invalid) {
        if (invalid) {
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
        return !invalid;
    }

    function validateForm() {
        let valid = true;

        const fullName = document.getElementById('fullName');
        valid = setInvalid(fullName, fullName.value.trim().length < 2) && valid;

        const mobile = document.getElementById('mobile');
        const mobileDigits = mobile.value.replace(/\D/g, '');
        valid = setInvalid(mobile, !/^[6-9]\d{9}$/.test(mobileDigits)) && valid;

        const email = document.getElementById('email');
        const emailValue = email.value.trim();
        const emailValid = emailValue === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
        valid = setInvalid(email, !emailValid) && valid;

        const guests = document.getElementById('guests');
        const guestsNum = parseInt(guests.value, 10);
        valid = setInvalid(guests, isNaN(guestsNum) || guestsNum < 1 || guestsNum > 50) && valid;

        const resDate = document.getElementById('resDate');
        valid = setInvalid(resDate, resDate.value === '') && valid;

        const resTime = document.getElementById('resTime');
        valid = setInvalid(resTime, resTime.value === '') && valid;

        return valid;
    }

    // Real-time clearing of invalid states
    reservationForm.querySelectorAll('.form-control').forEach(function (input) {
        input.addEventListener('input', function () {
            input.classList.remove('is-invalid');
        });
    });

    reservationForm.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!validateForm()) {
            successAlert.classList.add('d-none');
            const firstInvalid = reservationForm.querySelector('.is-invalid');
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        const fullName = document.getElementById('fullName').value.trim();
        const mobile = document.getElementById('mobile').value.trim();
        const email = document.getElementById('email').value.trim();
        const guests = document.getElementById('guests').value;
        const resDate = document.getElementById('resDate').value;
        const resTime = document.getElementById('resTime').value;
        const specialReq = document.getElementById('specialReq').value.trim();

        const messageLines = [
            'Hello Moti Mahal Delux, I would like to request a table reservation.',
            '',
            'Name: ' + fullName,
            'Mobile: ' + mobile
        ];

        if (email) messageLines.push('Email: ' + email);
        messageLines.push('Guests: ' + guests);
        messageLines.push('Date: ' + resDate);
        messageLines.push('Time: ' + resTime);
        if (specialReq) messageLines.push('Special Requests: ' + specialReq);
        messageLines.push('');
        messageLines.push('Please confirm my reservation. Thank you!');

        const whatsappURL = 'https://wa.me/' + RESTAURANT_WHATSAPP + '?text=' + encodeURIComponent(messageLines.join('\n'));

        successAlert.classList.remove('d-none');
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });

        window.open(whatsappURL, '_blank', 'noopener');

        reservationForm.reset();
    });

    /* ---------- Set min date for reservation to today ---------- */
    const resDateInput = document.getElementById('resDate');
    if (resDateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        resDateInput.min = yyyy + '-' + mm + '-' + dd;
    }

    /* ---------- Smooth Scroll Fallback for Older Browsers ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length < 2) return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

});