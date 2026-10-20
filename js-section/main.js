/* ═══════════════════════════════════════════
   main.js — Pak Din Nasi Dalcha
   Shared scripts for all pages
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('img').forEach(img => { if (!img.hasAttribute('loading')) img.loading = 'lazy'; img.classList.add('image-ready'); });
    if (!document.querySelector('.mobile-bottom-nav') && !document.querySelector('.admin-shell')) {
        const nav = document.createElement('nav'); nav.className='mobile-bottom-nav'; nav.setAttribute('aria-label','Mobile navigation'); nav.innerHTML='<a href="index.html">⌂<span>Home</span></a><a href="menu.html">▦<span>Menu</span></a><a class="mobile-order" href="order.html">＋<span>Order</span></a><a href="contact.html">⌖<span>Contact</span></a>'; document.body.appendChild(nav);
        const button=document.createElement('a'); button.className='whatsapp-float'; button.href='https://wa.me/60164594948'; button.target='_blank'; button.rel='noopener'; button.setAttribute('aria-label','Chat with Pak Din on WhatsApp'); button.innerHTML='◔<span>WhatsApp</span>'; document.body.appendChild(button);
    }

    /* ── Three-language switcher: English / Bahasa Melayu / Chinese ── */
    const translations = {
        en: { HOME:'Home', ABOUT:'About', 'ABOUT US':'About Us', MENU:'Menu', CATERING:'Catering', CONTACT:'Contact', ORDER:'Order', 'VIEW OUR MENU':'View Our Menu', 'ORDER PICKUP':'Order Pickup', 'CATERING ENQUIRY':'Catering Enquiry', 'OUR SIGNATURE DISHES':'Our Signature Dishes', 'WHAT WE SERVE':'What We Serve', 'SEND US A MESSAGE':'Send Us a Message', 'ADD TO ORDER':'Add to Order', 'SUBSCRIBE NOW':'Subscribe Now', 'FOLLOW US':'Follow Us', 'DOWNLOAD ORDER SUMMARY':'Download Order Summary', 'CUSTOMER FAVOURITES':'Customer Favourites', 'SEE FULL MENU ↗':'See full menu ↗', 'FRESH DALCHA, READY FOR PICKUP.':'Fresh dalcha, ready for pickup.', 'READ FULL STORY':'Read full story', 'SHARE YOUR FEEDBACK':'Share your feedback' },
        bm: { HOME:'Laman Utama', ABOUT:'Tentang', 'ABOUT US':'Tentang Kami', MENU:'Menu', CATERING:'Katering', CONTACT:'Hubungi', ORDER:'Pesanan', 'VIEW OUR MENU':'Lihat Menu', 'ORDER PICKUP':'Pesanan Ambil Sendiri', 'CATERING ENQUIRY':'Pertanyaan Katering', 'OUR SIGNATURE DISHES':'Hidangan Istimewa Kami', 'WHAT WE SERVE':'Apa Yang Kami Hidangkan', 'SEND US A MESSAGE':'Hantar Mesej', 'ADD TO ORDER':'Tambah Pesanan', 'SUBSCRIBE NOW':'Langgan Sekarang', 'FOLLOW US':'Ikuti Kami', 'DOWNLOAD ORDER SUMMARY':'Muat Turun Ringkasan Pesanan', 'CUSTOMER FAVOURITES':'Kegemaran Pelanggan', 'SEE FULL MENU ↗':'Lihat menu penuh ↗', 'FRESH DALCHA, READY FOR PICKUP.':'Dalcha segar, sedia untuk diambil.', 'READ FULL STORY':'Baca kisah penuh', 'SHARE YOUR FEEDBACK':'Kongsi maklum balas' },
        zh: { HOME:'首页', ABOUT:'关于我们', 'ABOUT US':'关于我们', MENU:'菜单', CATERING:'餐饮服务', CONTACT:'联系我们', ORDER:'订购', 'VIEW OUR MENU':'查看菜单', 'ORDER PICKUP':'预订自取', 'CATERING ENQUIRY':'餐饮咨询', 'OUR SIGNATURE DISHES':'我们的招牌菜', 'WHAT WE SERVE':'我们提供', 'SEND US A MESSAGE':'发送消息', 'ADD TO ORDER':'加入订单', 'SUBSCRIBE NOW':'立即订阅', 'FOLLOW US':'关注我们', 'DOWNLOAD ORDER SUMMARY':'下载订单摘要', 'CUSTOMER FAVOURITES':'顾客最爱', 'SEE FULL MENU ↗':'查看完整菜单 ↗', 'FRESH DALCHA, READY FOR PICKUP.':'新鲜 Dalcha，准备自取。', 'READ FULL STORY':'阅读完整故事', 'SHARE YOUR FEEDBACK':'分享您的意见' }
    };
    const nav = document.querySelector('.navbar');
    if (nav && !document.getElementById('languageSwitcher')) {
        const select = document.createElement('select'); select.id='languageSwitcher'; select.className='language-switcher'; select.setAttribute('aria-label','Language');
        select.innerHTML='<option value="en">EN</option><option value="bm">BM</option><option value="zh">中文</option>';
        nav.appendChild(select);
        const applyLanguage = lang => { const map=translations[lang]||translations.en; document.querySelectorAll('body *').forEach(el=>{ if(el.children.length) return; const original=el.dataset.i18n||el.textContent.trim().replace(/\s+/g,' '); if(!original) return; el.dataset.i18n=original; const key=original.toUpperCase(); el.textContent=map[key]||original; }); select.value=lang; localStorage.setItem('pakdin-language',lang); };
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
