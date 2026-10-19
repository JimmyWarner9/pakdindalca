/* ═══════════════════════════════════════════
   main.js — Pak Din Nasi Dalcha
   Shared scripts for all pages
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Three-language switcher: English / Bahasa Melayu / Tamil ── */
    const translations = {
        en: { HOME:'Home', ABOUT:'About', 'ABOUT US':'About Us', MENU:'Menu', CATERING:'Catering', CONTACT:'Contact', ORDER:'Order', 'VIEW OUR MENU':'View Our Menu', 'ORDER PICKUP':'Order Pickup', 'CATERING ENQUIRY':'Catering Enquiry', 'OUR SIGNATURE DISHES':'Our Signature Dishes', 'WHAT WE SERVE':'What We Serve', 'SEND US A MESSAGE':'Send Us a Message', 'ADD TO ORDER':'Add to Order', 'SUBSCRIBE NOW':'Subscribe Now' },
        bm: { HOME:'Laman Utama', ABOUT:'Tentang', 'ABOUT US':'Tentang Kami', MENU:'Menu', CATERING:'Katering', CONTACT:'Hubungi', ORDER:'Pesanan', 'VIEW OUR MENU':'Lihat Menu', 'ORDER PICKUP':'Pesanan Ambil Sendiri', 'CATERING ENQUIRY':'Pertanyaan Katering', 'OUR SIGNATURE DISHES':'Hidangan Istimewa Kami', 'WHAT WE SERVE':'Apa Yang Kami Hidangkan', 'SEND US A MESSAGE':'Hantar Mesej', 'ADD TO ORDER':'Tambah Pesanan', 'SUBSCRIBE NOW':'Langgan Sekarang' },
        ta: { HOME:'முகப்பு', ABOUT:'எங்களைப் பற்றி', 'ABOUT US':'எங்களைப் பற்றி', MENU:'மெனு', CATERING:'கேட்டரிங்', CONTACT:'தொடர்பு', ORDER:'ஆர்டர்', 'VIEW OUR MENU':'மெனுவைப் பார்க்க', 'ORDER PICKUP':'சுயமாக எடுத்துச் செல்ல ஆர்டர்', 'CATERING ENQUIRY':'கேட்டரிங் விசாரணை', 'OUR SIGNATURE DISHES':'எங்கள் சிறப்பு உணவுகள்', 'WHAT WE SERVE':'நாங்கள் வழங்குவது', 'SEND US A MESSAGE':'செய்தி அனுப்பவும்', 'ADD TO ORDER':'ஆர்டரில் சேர்க்கவும்', 'SUBSCRIBE NOW':'இப்போது சந்தா பெறவும்' }
    };
    const nav = document.querySelector('.navbar');
    if (nav && !document.getElementById('languageSwitcher')) {
        const select = document.createElement('select'); select.id='languageSwitcher'; select.className='language-switcher'; select.setAttribute('aria-label','Language');
        select.innerHTML='<option value="en">EN</option><option value="bm">BM</option><option value="ta">தமிழ்</option>';
        nav.appendChild(select);
        const applyLanguage = lang => { const map=translations[lang]||translations.en; document.querySelectorAll('a,button,.section-label,.menu-card-tag,.newsletter-heading,.section-title').forEach(el=>{ const key=el.textContent.trim().replace(/\s+/g,' ').toUpperCase(); if(map[key]) el.textContent=map[key]; }); select.value=lang; localStorage.setItem('pakdin-language',lang); };
        select.addEventListener('change',()=>applyLanguage(select.value));
        applyLanguage(localStorage.getItem('pakdin-language')||'en');
    }

    /* ── Navbar scroll effect ──────────────── */
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        });
    }

    /* Newsletter signup — stores email in Supabase */
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm && window.supabase && window.PAKDIN_SUPABASE_URL) {
        const newsletterDb = supabase.createClient(window.PAKDIN_SUPABASE_URL, window.PAKDIN_SUPABASE_ANON_KEY);
        newsletterForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('newsletterEmail').value.trim().toLowerCase();
            const button = document.getElementById('newsletterSubmit');
            const status = document.getElementById('newsletterMessage');
            button.disabled = true;
            button.textContent = 'Saving…';
            const { error } = await newsletterDb.from('newsletter_subscribers').insert({ email });
            if (error && error.code !== '23505') {
                status.textContent = 'We could not save your email. Please try again.';
                status.className = 'newsletter-message error';
            } else {
                status.textContent = 'Thank you — you are subscribed to Pak Din news.';
                status.className = 'newsletter-message success';
                newsletterForm.reset();
            }
            button.disabled = false;
            button.textContent = 'Subscribe Now';
        });
    }

    /* ── Hamburger menu toggle ─────────────── */
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
            });
        });
    }

    /* ── Background video crossfade (plays each video to its full length) ── */
    const bgVideos = document.querySelectorAll('.site-bg-video');

    if (bgVideos.length > 1) {
        let bgIndex = 0;

        function switchToNextBg() {
            bgVideos[bgIndex].classList.remove('active');

            bgIndex = (bgIndex + 1) % bgVideos.length;

            bgVideos[bgIndex].classList.add('active');
            bgVideos[bgIndex].currentTime = 0;
            bgVideos[bgIndex].play().catch(() => {});
        }

        bgVideos.forEach(video => {
            video.addEventListener('ended', switchToNextBg);
        });

        bgVideos.forEach((video, i) => {
            if (i === bgIndex) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                bgVideos[bgIndex].play().catch(() => {});
            }
        });
    }


    /* ── About section video ───────────────── */
    const aboutMedia   = document.getElementById('aboutMedia');
    const aboutVideo   = document.getElementById('aboutVideo');
    const aboutPlayBtn = document.getElementById('aboutPlayBtn');

    if (aboutMedia && aboutVideo && aboutPlayBtn) {

        const iconPlay  = aboutPlayBtn.querySelector('.icon-play');
        const iconPause = aboutPlayBtn.querySelector('.icon-pause');


        /* ── Play / Pause button ───────────── */
        aboutPlayBtn.addEventListener('click', () => {

            if (aboutVideo.paused) {

                aboutVideo.play()
                    .then(() => {
                        aboutMedia.classList.add('playing');

                        if (iconPlay) {
                            iconPlay.style.display = 'none';
                        }

                        if (iconPause) {
                            iconPause.style.display = 'block';
                        }
                    })
                    .catch(err => {
                        console.warn('Video play failed:', err);
                    });

            } else {

                aboutVideo.pause();
            }
        });


        /* ── Video starts playing ───────────── */
        aboutVideo.addEventListener('play', () => {

            aboutMedia.classList.add('playing');

            if (iconPlay) {
                iconPlay.style.display = 'none';
            }

            if (iconPause) {
                iconPause.style.display = 'block';
            }
        });


        /* ── Video paused ───────────────────── */
        aboutVideo.addEventListener('pause', () => {

            aboutMedia.classList.remove('playing');

            if (iconPlay) {
                iconPlay.style.display = 'block';
            }

            if (iconPause) {
                iconPause.style.display = 'none';
            }
        });


        /* ── Video ended ────────────────────── */
        aboutVideo.addEventListener('ended', () => {

            aboutMedia.classList.remove('playing');

            if (iconPlay) {
                iconPlay.style.display = 'block';
            }

            if (iconPause) {
                iconPause.style.display = 'none';
            }
        });


        /* ── START AUTOPLAY ─────────────────── */
        /* Event listeners are ready BEFORE play() */
        aboutVideo.play()
            .then(() => {
                aboutMedia.classList.add('playing');

                if (iconPlay) {
                    iconPlay.style.display = 'none';
                }

                if (iconPause) {
                    iconPause.style.display = 'block';
                }
            })
            .catch(err => {
                console.warn('Autoplay blocked:', err);
            });

    }

/* =========================================
   PORTRAIT VIDEO FULLSCREEN
========================================= */

const video = document.querySelector(".about-story-video");

if (video) {

    video.addEventListener("fullscreenchange", async () => {

        if (document.fullscreenElement) {

            // Try to keep screen in portrait
            try {
                if (screen.orientation && screen.orientation.lock) {
                    await screen.orientation.lock("portrait");
                }
            } catch (error) {
                console.log("Portrait lock not supported:", error);
            }

        } else {

            // Return screen orientation
            try {
                if (screen.orientation && screen.orientation.unlock) {
                    screen.orientation.unlock();
                }
            } catch (error) {
                console.log("Orientation unlock not supported");
            }
        }

    });

}
    /* ── About section video — mute/unmute toggle ── */
    const aboutMuteBtn = document.getElementById('aboutMuteBtn');

    if (aboutVideo && aboutMuteBtn) {

        const iconMuted   = aboutMuteBtn.querySelector('.icon-muted');
        const iconUnmuted = aboutMuteBtn.querySelector('.icon-unmuted');

        aboutMuteBtn.addEventListener('click', () => {

            aboutVideo.muted = !aboutVideo.muted;

            if (iconMuted) {
                iconMuted.style.display =
                    aboutVideo.muted ? 'block' : 'none';
            }

            if (iconUnmuted) {
                iconUnmuted.style.display =
                    aboutVideo.muted ? 'none' : 'block';
            }
        });
    }


    /* ── About section video — fullscreen toggle ── */
    const aboutFullscreenBtn =
        document.getElementById('aboutFullscreenBtn');

    if (aboutMedia && aboutFullscreenBtn) {

        const iconExpand =
            aboutFullscreenBtn.querySelector('.icon-expand');

        const iconCompress =
            aboutFullscreenBtn.querySelector('.icon-compress');


        aboutFullscreenBtn.addEventListener('click', () => {

            if (!document.fullscreenElement) {

                /* Fullscreen the whole media wrapper
                   so custom buttons stay usable. */

                const req =
                    aboutMedia.requestFullscreen ||
                    aboutMedia.webkitRequestFullscreen ||
                    aboutMedia.msRequestFullscreen;

                req?.call(aboutMedia);

            } else {

                const exit =
                    document.exitFullscreen ||
                    document.webkitExitFullscreen ||
                    document.msExitFullscreen;

                exit?.call(document);
            }
        });


        document.addEventListener('fullscreenchange', () => {

            const isFull = !!document.fullscreenElement;

            aboutMedia.classList.toggle(
                'is-fullscreen',
                isFull
            );

            if (iconExpand) {
                iconExpand.style.display =
                    isFull ? 'none' : 'block';
            }

            if (iconCompress) {
                iconCompress.style.display =
                    isFull ? 'block' : 'none';
            }
        });
    }


    /* ── Scroll reveal ─────────────────────── */
    const revealEls = document.querySelectorAll('.reveal');

    if (revealEls.length) {

        const observer = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add('visible');

                    observer.unobserve(entry.target);
                }
            });

        }, {
            threshold: 0.1
        });

        revealEls.forEach(el => observer.observe(el));


        /* Safety net: force everything visible if the observer
           ever misses an element */

        setTimeout(() => {

            revealEls.forEach(el => {
                el.classList.add('visible');
            });

        }, 1500);
    }


    /* ── Scroll-to-top button ──────────────── */
    document
        .getElementById('scrollTopBtn')
        ?.addEventListener('click', () => {

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });


    /* ── Active nav link on scroll ─────────── */
    const sections =
        document.querySelectorAll('section[id], div[id]');

    const navLinks =
        document.querySelectorAll('#navMenu a');

    if (sections.length && navLinks.length) {

        window.addEventListener('scroll', () => {

            let currentSection = '';

            sections.forEach(s => {

                if (
                    window.scrollY >=
                    s.offsetTop - 120
                ) {
                    currentSection = s.id;
                }
            });


            navLinks.forEach(a => {

                const href =
                    a.getAttribute('href');

                a.classList.toggle(
                    'active',
                    href === '#' + currentSection ||
                    (
                        currentSection === '' &&
                        href === '#'
                    )
                );
            });
        });
    }

});
