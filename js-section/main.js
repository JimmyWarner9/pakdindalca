/* ═══════════════════════════════════════════
   main.js — Pak Din Nasi Dalcha
   Shared scripts for all pages
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    document.documentElement.classList.add('site-loading');
    const loadingScreen = document.querySelector('.boot-screen') || document.createElement('div');
    loadingScreen.classList.add('site-loading-screen');
    if (!loadingScreen.parentNode) {
        loadingScreen.className = 'site-loading-screen';
        loadingScreen.setAttribute('role', 'status');
        loadingScreen.setAttribute('aria-label', 'Loading Pak Din Nasi Dalcha');
        loadingScreen.innerHTML = '<img src="/image/food-section/logo-section/pakdin_pwa_icon.png" alt="Pak Din Nasi Dalcha"><span>Preparing Pak Din…</span>';
        document.body.appendChild(loadingScreen);
    }
    const finishLoading = () => { document.documentElement.classList.remove('site-loading'); loadingScreen.classList.add('is-hidden'); document.querySelectorAll('.boot-screen').forEach(screen => { screen.classList.add('is-hidden'); setTimeout(() => screen.remove(), 450); }); setTimeout(() => loadingScreen.remove(), 450); };
    window.addEventListener('load', finishLoading, { once: true });
    // Do not make visitors wait for videos, fonts, or analytics; the layout can be used while those finish.
    setTimeout(finishLoading, 1200);

    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/service-worker.js').catch(() => {});

    /* Install prompt for Android Chrome and iPhone Safari */
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile && !isStandalone && !sessionStorage.getItem('pakdin-install-dismissed')) {
        const banner = document.createElement('aside');
        banner.className = 'pwa-install-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Install Pak Din app');
        banner.innerHTML = '<div><strong>Install Pak Din app</strong><span>Order pickup faster from your home screen.</span></div><button class="pwa-install-button" type="button">Install</button><button class="pwa-install-close" type="button" aria-label="Dismiss">×</button>';
        document.body.appendChild(banner);
        const installButton = banner.querySelector('.pwa-install-button');
        const closeBanner = () => { sessionStorage.setItem('pakdin-install-dismissed', '1'); banner.remove(); };
        banner.querySelector('.pwa-install-close').addEventListener('click', closeBanner);
        let installEvent;
        window.addEventListener('beforeinstallprompt', event => {
            event.preventDefault(); installEvent = event;
        }, { once: true });
        installButton.addEventListener('click', async () => {
            if (installEvent) { installEvent.prompt(); await installEvent.userChoice; closeBanner(); }
            else { installButton.textContent = /iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'Safari: Share → Add to Home Screen' : 'Use browser menu → Add to Home screen'; }
        });
    }

    const menuGrid = document.querySelector('.menu-grid');
    if (menuGrid && window.supabase && window.PAKDIN_SUPABASE_URL) {
        const menuDb = supabase.createClient(window.PAKDIN_SUPABASE_URL, window.PAKDIN_SUPABASE_ANON_KEY);
        menuDb.from('menu_items').select('*').eq('available', true).order('created_at').then(({data}) => {
            if (!data || !data.length) return;
            menuGrid.innerHTML = data.map(item => `<article class="menu-card reveal"><img class="menu-card-photo" src="${item.photo_url || '../image/food-section/Nasi Dalcha Ayam.webp'}" alt="${item.name}"><div class="menu-card-body"><div class="menu-card-tag">Available</div><h3>${item.name}</h3><p>${item.description || ''}</p><div class="menu-card-footer"><strong>RM ${Number(item.price).toFixed(2)}</strong><span class="availability"><i></i> Available</span><a href="order.html" class="btn-primary">Add to Order</a></div></div></article>`).join('');
        });
    }

    document.querySelectorAll('img').forEach(img => {
        const isAboveFold = img.classList.contains('hero-bg-img') || img.closest('.navbar') || img.closest('.hero-bg');
        if (!img.hasAttribute('loading')) img.loading = isAboveFold ? 'eager' : 'lazy';
        img.decoding = 'async';
        if (isAboveFold) img.fetchPriority = 'high';
        img.classList.add('image-ready');
    });
    document.querySelectorAll('video').forEach(video => {
        if (!video.hasAttribute('preload')) video.preload = 'metadata';
        if (!video.hasAttribute('title')) video.setAttribute('title', 'Pak Din Nasi Dalcha video');
    });
    if (!document.querySelector('.mobile-bottom-nav') && !document.querySelector('.admin-shell')) {
        const nav = document.createElement('nav'); nav.className='mobile-bottom-nav'; nav.setAttribute('aria-label','Mobile navigation'); nav.innerHTML='<a href="index.html" aria-label="Home"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z"/></svg><span>Home</span></a><a href="menu.html" aria-label="Menu"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v7M4 3v4a3 3 0 0 0 6 0V3M7 10v11M17 3v18M14 3v6h6"/></svg><span>Menu</span></a><a class="mobile-order" href="order.html" aria-label="Order now"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l1 12H5L6 8Zm3 0V6a3 3 0 0 1 6 0v2"/><path d="M9 12h.01M15 12h.01"/></svg><span>Order</span></a><a href="contact.html" aria-label="Contact"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 4v-4.2a2.5 2.5 0 0 1-2.5-2.3Z"/><path d="M8 8h8M8 11h5"/></svg><span>Contact</span></a>'; document.body.appendChild(nav);
        const currentPage = location.pathname.split('/').pop() || 'index.html';
        nav.querySelectorAll('a').forEach(link => { if (link.getAttribute('href') === currentPage) { link.classList.add('is-active'); link.setAttribute('aria-current', 'page'); } });
    }

    /* Premium gallery lightbox and smooth back-to-top control */
    const galleryImages = document.querySelectorAll('[data-lightbox]');
    if (galleryImages.length && !document.querySelector('.image-lightbox')) {
        const lightbox = document.createElement('dialog');
        lightbox.className = 'image-lightbox';
        lightbox.innerHTML = '<button class="lightbox-close" type="button" aria-label="Close image">×</button><img alt="">';
        document.body.appendChild(lightbox);
        const preview = lightbox.querySelector('img');
        galleryImages.forEach(image => image.addEventListener('click', () => {
            preview.src = image.currentSrc || image.src;
            preview.alt = image.alt;
            lightbox.showModal();
        }));
        lightbox.addEventListener('click', event => {
            if (event.target === lightbox || event.target.closest('.lightbox-close')) lightbox.close();
        });
    }

    if (!document.querySelector('.back-to-top')) {
        const backTop = document.createElement('button');
        backTop.className = 'back-to-top';
        backTop.type = 'button';
        backTop.setAttribute('aria-label', 'Back to top');
        backTop.innerHTML = '↑';
        document.body.appendChild(backTop);
        const updateBackTop = () => backTop.classList.toggle('is-visible', window.scrollY > 520);
        window.addEventListener('scroll', updateBackTop, { passive: true });
        backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        updateBackTop();
    }

    /* ── Three-language switcher: English / Bahasa Melayu / Chinese ── */
    const translations = {
        en: { HOME:'Home', ABOUT:'About', 'ABOUT US':'About Us', MENU:'Menu', CATERING:'Catering', CONTACT:'Contact', ORDER:'Order', 'VIEW OUR MENU':'View Our Menu', 'ORDER PICKUP':'Order Pickup', 'CATERING ENQUIRY':'Catering Enquiry', 'OUR SIGNATURE DISHES':'Our Signature Dishes', 'WHAT WE SERVE':'What We Serve', 'SEND US A MESSAGE':'Send Us a Message', 'ADD TO ORDER':'Add to Order', 'SUBSCRIBE NOW':'Subscribe Now', 'FOLLOW US':'Follow Us', 'DOWNLOAD ORDER SUMMARY':'Download Order Summary', 'CUSTOMER FAVOURITES':'Customer Favourites', 'SEE FULL MENU ↗':'See full menu ↗', 'FRESH DALCHA, READY FOR PICKUP.':'Fresh dalcha, ready for pickup.', 'READ FULL STORY':'Read full story', 'SHARE YOUR FEEDBACK':'Share your feedback', 'A PENANG TRADITION,':'A Penang tradition,', 'SERVED WITH HEART':'served with heart', 'SINCE 1998, PAK DIN HAS SHARED AUTHENTIC NASI DALCHA MADE WITH PATIENCE, HERITAGE SPICES, AND THE WARMTH OF A FAMILY KITCHEN. THE RECIPE REMAINS TRUE — SLOW-COOKED, FRESHLY SERVED, AND MADE FOR PENANG.':'Since 1998, Pak Din has shared authentic Nasi Dalcha made with patience, heritage spices, and the warmth of a family kitchen. The recipe remains true — slow-cooked, freshly served, and made for Penang.', 'FRESHLY COOKED EVERY MORNING':'Freshly cooked every morning', 'AUTHENTIC HALAL INGREDIENTS':'Authentic halal ingredients', 'HERITAGE SPICES AND SLOW COOKING':'Heritage spices and slow cooking', 'THE SAME FAMILY SPIRIT SINCE 1998':'The same family spirit since 1998' },
        bm: { HOME:'Laman Utama', ABOUT:'Tentang', 'ABOUT US':'Tentang Kami', MENU:'Menu', CATERING:'Katering', CONTACT:'Hubungi', ORDER:'Pesanan', 'VIEW OUR MENU':'Lihat Menu', 'ORDER PICKUP':'Pesanan Ambil Sendiri', 'CATERING ENQUIRY':'Pertanyaan Katering', 'OUR SIGNATURE DISHES':'Hidangan Istimewa Kami', 'WHAT WE SERVE':'Apa Yang Kami Hidangkan', 'SEND US A MESSAGE':'Hantar Mesej', 'ADD TO ORDER':'Tambah Pesanan', 'SUBSCRIBE NOW':'Langgan Sekarang', 'FOLLOW US':'Ikuti Kami', 'DOWNLOAD ORDER SUMMARY':'Muat Turun Ringkasan Pesanan', 'CUSTOMER FAVOURITES':'Kegemaran Pelanggan', 'SEE FULL MENU ↗':'Lihat menu penuh ↗', 'FRESH DALCHA, READY FOR PICKUP.':'Dalcha segar, sedia untuk diambil.', 'READ FULL STORY':'Baca kisah penuh', 'SHARE YOUR FEEDBACK':'Kongsi maklum balas' },
        zh: { HOME:'首页', ABOUT:'关于我们', 'ABOUT US':'关于我们', MENU:'菜单', CATERING:'餐饮服务', CONTACT:'联系我们', ORDER:'订购', 'VIEW OUR MENU':'查看菜单', 'ORDER PICKUP':'预订自取', 'CATERING ENQUIRY':'餐饮咨询', 'OUR SIGNATURE DISHES':'我们的招牌菜', 'WHAT WE SERVE':'我们提供', 'SEND US A MESSAGE':'发送消息', 'ADD TO ORDER':'加入订单', 'SUBSCRIBE NOW':'立即订阅', 'FOLLOW US':'关注我们', 'DOWNLOAD ORDER SUMMARY':'下载订单摘要', 'CUSTOMER FAVOURITES':'顾客最爱', 'SEE FULL MENU ↗':'查看完整菜单 ↗', 'FRESH DALCHA, READY FOR PICKUP.':'新鲜 Dalcha，准备自取。', 'READ FULL STORY':'阅读完整故事', 'SHARE YOUR FEEDBACK':'分享您的意见' }
    };
    Object.assign(translations.bm, {
        'OUR STORY':'Kisah Kami', 'A RECIPE PASSED DOWN, NEVER COMPROMISED':'Resipi Diwarisi, Tidak Pernah Berubah', 'CUSTOMER FAVOURITE':'Kegemaran Pelanggan', 'MADE FRESH TODAY':'Dimasak Segar Hari Ini', 'VISIT PAK DIN':'KUNJUNGI PAK DIN', 'EST. YEAR':'DITUBUHKAN', 'YEARS OF LEGACY':'TAHUN WARISAN', 'HALAL CERTIFIED':'DISAHKAN HALAL', 'GENERATIONS':'GENERASI', 'NEWSLETTER':'BERITA TERKINI', 'NAVIGATE':'NAVIGASI', 'CONTACT':'HUBUNGI', 'HOURS':'WAKTU OPERASI', 'PRIVACY POLICY':'Dasar Privasi', 'TERMS':'Terma', 'AVAILABLE':'Tersedia', 'AVAILABLE TODAY':'Tersedia Hari Ini', 'ADD TO ORDER':'Tambah Pesanan', 'SEND ORDER TO PAK DIN (WHATSAPP)':'HANTAR PESANAN KEPADA PAK DIN (WHATSAPP)', 'PAY BOOKING FEE WITH TNG':'BAYAR YURAN TEMPAHAN DENGAN TNG', 'CONFIRM YOUR ORDER':'Sahkan Pesanan Anda', 'BACK TO ORDER':'Kembali ke Pesanan', 'ALMOST THERE':'HAMPIR SELESAI', 'PICKUP ONLY':'AMBIL SENDIRI SAHAJA', 'CASH ONLY':'TUNAI SAHAJA', 'OUTDOOR SEATING':'TEMPAT DUDUK LUAR', 'NEED HELP WITH YOUR ORDER?':'PERLUKAN BANTUAN DENGAN PESANAN?', 'CHAT WITH PAK DIN DIRECTLY':'CHAT TERUS DENGAN PAK DIN', 'VIEW MAP ↗':'LIHAT PETA ↗', 'CHECKING TODAY’S HOURS…':'MENYEMAK WAKTU HARI INI…', 'PAYMENT STATUS':'STATUS BAYARAN', 'PENDING CONFIRMATION':'MENUNGGU PENGESAHAN'
    });
    Object.assign(translations.bm, {
        'EVERY FLAVOUR TELLS A':'Setiap rasa ada',
        'STORY':'cerita',
        'A PENANG TRADITION,':'Tradisi Pulau Pinang,',
        'SERVED WITH HEART':'Dihidang dengan ikhlas',
        'SINCE 1998, PAK DIN HAS SHARED AUTHENTIC NASI DALCHA MADE WITH PATIENCE, HERITAGE SPICES, AND THE WARMTH OF A FAMILY KITCHEN. THE RECIPE REMAINS TRUE — SLOW-COOKED, FRESHLY SERVED, AND MADE FOR PENANG.':'Sejak 1998, Pak Din menyajikan Nasi Dalcha asli dengan penuh kesabaran, rempah warisan, dan kehangatan dapur keluarga. Resipi ini kekal sama — dimasak perlahan, dihidang segar, dan untuk warga Pulau Pinang.',
        'FRESHLY COOKED EVERY MORNING':'Dimasak segar setiap pagi',
        'AUTHENTIC HALAL INGREDIENTS':'Bahan halal asli',
        'HERITAGE SPICES AND SLOW COOKING':'Rempah warisan dan masakan perlahan',
        'THE SAME FAMILY SPIRIT SINCE 1998':'Semangat keluarga yang sama sejak 1998'
    });
    Object.assign(translations.zh, {
        'OUR STORY':'我们的故事', 'A RECIPE PASSED DOWN, NEVER COMPROMISED':'传承的食谱，从未改变', 'CUSTOMER FAVOURITE':'顾客最爱', 'MADE FRESH TODAY':'今日新鲜制作', 'VISIT PAK DIN':'访问 Pak Din', 'EST. YEAR':'成立年份', 'YEARS OF LEGACY':'传承多年', 'HALAL CERTIFIED':'清真认证', 'GENERATIONS':'代传承', 'NEWSLETTER':'最新消息', 'NAVIGATE':'导航', 'HOURS':'营业时间', 'PRIVACY POLICY':'隐私政策', 'TERMS':'条款', 'AVAILABLE':'有货', 'AVAILABLE TODAY':'今日供应', 'SEND ORDER TO PAK DIN (WHATSAPP)':'通过 WhatsApp 发送订单', 'PAY BOOKING FEE WITH TNG':'使用 TNG 支付预订费', 'CONFIRM YOUR ORDER':'确认您的订单', 'BACK TO ORDER':'返回订单', 'ALMOST THERE':'即将完成', 'PICKUP ONLY':'仅限自取', 'CASH ONLY':'仅收现金', 'OUTDOOR SEATING':'户外座位', 'NEED HELP WITH YOUR ORDER?':'需要订单帮助？', 'CHAT WITH PAK DIN DIRECTLY':'直接联系 Pak Din', 'VIEW MAP ↗':'查看地图 ↗', 'CHECKING TODAY’S HOURS…':'正在检查营业时间…', 'PAYMENT STATUS':'付款状态', 'PENDING CONFIRMATION':'等待确认'
    });
    Object.assign(translations.bm, {
        'SLOW-COOKED WITH HERITAGE SPICES, SERVED FRESH EVERY MORNING — A FAMILY RECIPE THAT HAS FED PENANG FOR OVER TWO DECADES.':'Dimasak perlahan dengan rempah warisan, dihidang segar setiap pagi — resipi keluarga yang telah menyajikan Penang selama lebih dua dekad.',
        'FLUFFY BASMATI RICE SERVED WITH OUR LEGENDARY MUTTON DALCHA GRAVY, SLOW-COOKED WITH CARDAMOM, CINNAMON AND GHEE.':'Nasi basmati lembut dengan kuah dalcha kambing istimewa, dimasak perlahan bersama buah pelaga, kayu manis dan minyak sapi.',
        'TENDER FREE-RANGE CHICKEN SIMMERED IN THE SAME HERITAGE DALCHA BASE — A LIGHTER BUT EQUALLY SATISFYING CHOICE.':'Ayam kampung empuk dimasak dalam kuah dalcha warisan yang sama — pilihan lebih ringan tetapi tetap memuaskan.',
        'FRAGRANT TOMATO RICE SERVED WITH TENDER AYAM ROSE IN A RICH, LIGHTLY SPICED SAUCE.':'Nasi tomato beraroma dengan ayam rose yang empuk dalam kuah kaya berempah ringan.',
        'A FAMILY TRADITION SINCE 1998 — SERVING AUTHENTIC, FRESHLY COOKED NASI DALCHA TO THE PEOPLE OF PENANG AND BEYOND.':'Tradisi keluarga sejak 1998 — menyajikan Nasi Dalcha asli yang dimasak segar kepada warga Penang dan sekitarnya.',
        'FIND US AT 613, JALAN JELUTONG, GEORGE TOWN. CASH ONLY · OUTDOOR SEATING.':'Kami di 613, Jalan Jelutong, George Town. Tunai sahaja · Tempat duduk luar.',
        'EVERY PLATE IS BUILT AROUND THE DALCHA — A RICH, SPICED LENTIL-AND-MEAT GRAVY THAT DEFINES OUR KITCHEN.':'Setiap hidangan berasaskan dalcha — kuah lentil dan daging berempah yang menjadi identiti dapur kami.',
        'RECEIVE THE LATEST PAK DIN NEWS DIRECTLY TO YOUR INBOX.':'Terima berita terkini Pak Din terus ke peti masuk anda.',
        'FOOD PAYMENT IS MADE DIRECTLY TO PAK DIN UPON SELF-PICKUP.':'Bayaran makanan dibuat terus kepada Pak Din semasa ambil sendiri.',
        'THE BOOKING FEE COVERS USE OF THE ONLINE ORDERING SERVICE.':'Yuran tempahan meliputi penggunaan perkhidmatan pesanan dalam talian.',
        'FOR CATERING BOOKINGS, FEEDBACK, OR GENERAL ENQUIRIES.':'Untuk tempahan katering, maklum balas atau pertanyaan umum.'
    });
    Object.assign(translations.zh, {
        'SLOW-COOKED WITH HERITAGE SPICES, SERVED FRESH EVERY MORNING — A FAMILY RECIPE THAT HAS FED PENANG FOR OVER TWO DECADES.':'采用传统香料慢炖，每天早晨新鲜供应——传承超过二十年的家庭食谱。',
        'FLUFFY BASMATI RICE SERVED WITH OUR LEGENDARY MUTTON DALCHA GRAVY, SLOW-COOKED WITH CARDAMOM, CINNAMON AND GHEE.':'松软印度香米搭配招牌羊肉 Dalcha 酱汁，以豆蔻、肉桂和酥油慢炖而成。',
        'TENDER FREE-RANGE CHICKEN SIMMERED IN THE SAME HERITAGE DALCHA BASE — A LIGHTER BUT EQUALLY SATISFYING CHOICE.':'嫩滑走地鸡以传承 Dalcha 酱汁炖煮，清爽又满足。',
        'FRAGRANT TOMATO RICE SERVED WITH TENDER AYAM ROSE IN A RICH, LIGHTLY SPICED SAUCE.':'香浓番茄饭搭配嫩滑 Ayam Rose 和微辣浓郁酱汁。',
        'A FAMILY TRADITION SINCE 1998 — SERVING AUTHENTIC, FRESHLY COOKED NASI DALCHA TO THE PEOPLE OF PENANG AND BEYOND.':'自 1998 年以来的家庭传统，为槟城及各地顾客供应正宗新鲜 Nasi Dalcha。',
        'FIND US AT 613, JALAN JELUTONG, GEORGE TOWN. CASH ONLY · OUTDOOR SEATING.':'地址：613, Jalan Jelutong, George Town。仅收现金 · 提供户外座位。',
        'EVERY PLATE IS BUILT AROUND THE DALCHA — A RICH, SPICED LENTIL-AND-MEAT GRAVY THAT DEFINES OUR KITCHEN.':'每道菜都以 Dalcha 为核心——浓郁的香料扁豆肉汁，定义了我们的厨房。',
        'RECEIVE THE LATEST PAK DIN NEWS DIRECTLY TO YOUR INBOX.':'将 Pak Din 的最新消息直接发送到您的邮箱。',
        'FOOD PAYMENT IS MADE DIRECTLY TO PAK DIN UPON SELF-PICKUP.':'取餐时直接向 Pak Din 支付餐费。',
        'THE BOOKING FEE COVERS USE OF THE ONLINE ORDERING SERVICE.':'预订费涵盖在线点餐服务。',
        'FOR CATERING BOOKINGS, FEEDBACK, OR GENERAL ENQUIRIES.':'适用于餐饮预订、反馈或一般咨询。'
    });
    const contactTranslations = {
        bm: { 'GET IN TOUCH':'HUBUNGI KAMI', 'LET’S PLAN SOMETHING SPECIAL.':'Mari merancang sesuatu yang istimewa.', 'FOR TABLE BOOKINGS, CATERING EVENTS, AND QUESTIONS ABOUT PAK DIN, WE ARE HAPPY TO HELP.':'Untuk tempahan meja, acara katering dan pertanyaan tentang Pak Din, kami sedia membantu.', 'SEND AN ENQUIRY':'Hantar Pertanyaan', 'WHATSAPP US':'Hubungi WhatsApp', 'VISIT US':'Kunjungi Kami', 'CALL OR WHATSAPP':'Telefon atau WhatsApp', 'EMAIL US':'E-mel Kami', 'OPENING HOURS':'Waktu Operasi', 'SEND MESSAGE':'Hantar Mesej', 'TELL US HOW WE CAN HELP.':'Beritahu kami bagaimana kami boleh membantu.', 'FIND US':'Cari Kami', 'COME VISIT PAK DIN.':'Kunjungi Pak Din.', 'FREQUENTLY ASKED QUESTIONS':'Soalan Lazim', 'NEED HELP?':'Perlukan bantuan?', 'WE LOOK FORWARD TO SERVING YOU':'Kami menanti untuk melayani anda', 'RESERVE A TABLE OR PLAN YOUR CATERING.':'Tempah meja atau rancangkan katering anda.', 'BOOK A TABLE':'Tempah Meja', 'PLAN CATERING':'Rancang Katering' },
        zh: { 'GET IN TOUCH':'联系我们', 'LET’S PLAN SOMETHING SPECIAL.':'让我们计划一场特别的活动。', 'FOR TABLE BOOKINGS, CATERING EVENTS, AND QUESTIONS ABOUT PAK DIN, WE ARE HAPPY TO HELP.':'无论是预订餐桌、餐饮活动还是 Pak Din 的相关问题，我们都很乐意帮助您。', 'SEND AN ENQUIRY':'发送咨询', 'WHATSAPP US':'联系 WhatsApp', 'VISIT US':'访问我们', 'CALL OR WHATSAPP':'电话或 WhatsApp', 'EMAIL US':'发送邮件', 'OPENING HOURS':'营业时间', 'SEND MESSAGE':'发送消息', 'TELL US HOW WE CAN HELP.':'告诉我们如何帮助您。', 'FIND US':'查找我们', 'COME VISIT PAK DIN.':'欢迎到访 Pak Din。', 'FREQUENTLY ASKED QUESTIONS':'常见问题', 'NEED HELP?':'需要帮助吗？', 'WE LOOK FORWARD TO SERVING YOU':'期待为您服务', 'RESERVE A TABLE OR PLAN YOUR CATERING.':'预订餐桌或计划餐饮服务。', 'BOOK A TABLE':'预订餐桌', 'PLAN CATERING':'计划餐饮' }
    };
    Object.assign(translations.bm, contactTranslations.bm);
    Object.assign(translations.zh, contactTranslations.zh);
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
        let previousScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            navbar.classList.toggle('scrolled', currentScrollY > 60);
            navbar.classList.toggle('nav-hidden', currentScrollY > 140 && currentScrollY > previousScrollY);
            if (currentScrollY < 80) navbar.classList.remove('nav-hidden');
            previousScrollY = currentScrollY;
        });
    }

    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        const updateScrollProgress = () => {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
            scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        };
        updateScrollProgress();
        window.addEventListener('scroll', updateScrollProgress, { passive: true });
        window.addEventListener('resize', updateScrollProgress);
    }

    const heroSlides = document.querySelectorAll('.hero-bg-img');
    if (heroSlides.length) {
        requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add('hero-ready')));
    }
    if (heroSlides.length > 1) {
        let heroIndex = 0;
        const heroContent = document.querySelector('.hero-content');
        const showHeroSlide = nextIndex => {
            heroSlides[heroIndex].classList.remove('is-active');
            heroIndex = (nextIndex + heroSlides.length) % heroSlides.length;
            heroSlides[heroIndex].classList.add('is-active');
            if (heroContent) {
                heroContent.classList.remove('hero-slide-in');
                void heroContent.offsetWidth;
                heroContent.classList.add('hero-slide-in');
            }
        };
        window.setInterval(() => {
            showHeroSlide(heroIndex + 1);
        }, 6500);
    }

    /* Newsletter signup — stores email in Supabase */
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        const newsletterDb = window.supabase && window.PAKDIN_SUPABASE_URL ? supabase.createClient(window.PAKDIN_SUPABASE_URL, window.PAKDIN_SUPABASE_ANON_KEY) : null;
        newsletterForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('newsletterEmail').value.trim().toLowerCase();
            const button = document.getElementById('newsletterSubmit');
            const status = document.getElementById('newsletterMessage');
            if (!email || !/^\S+@\S+\.\S+$/.test(email)) { status.textContent = 'Please enter a valid email address.'; status.className = 'newsletter-message error'; return; }
            button.disabled = true;
            button.textContent = 'Saving…';
            let error = null;
            if (newsletterDb) {
                ({ error } = await newsletterDb.from('newsletter_subscribers').insert({ email }));
            } else {
                try {
                    const response = await fetch(window.PAKDIN_SUPABASE_URL + '/rest/v1/newsletter_subscribers', { method: 'POST', headers: { apikey: window.PAKDIN_SUPABASE_ANON_KEY, Authorization: 'Bearer ' + window.PAKDIN_SUPABASE_ANON_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify({ email }) });
                    if (!response.ok) error = { message: 'Subscription request failed.' };
                } catch (requestError) { error = requestError; }
            }
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

    const cateringForm = document.getElementById('cateringEnquiryForm');
    if (cateringForm) {
        cateringForm.addEventListener('submit', async event => {
            event.preventDefault();
            const formData = new FormData(cateringForm);
            const details = Object.fromEntries(formData.entries());
            const status = document.getElementById('cateringEnquiryStatus');
            const message = [
                'Catering enquiry — Pak Din Nasi Dalcha',
                `Name: ${details.name}`,
                `Phone: ${details.phone}`,
                `Event: ${details.eventType}`,
                `Date: ${details.date}`,
                `Guests: ${details.guests}`,
                `Venue: ${details.venue}`,
                `Notes: ${details.notes || 'None'}`
            ].join('\n');
            if (window.supabase && window.PAKDIN_SUPABASE_URL) {
                try {
                    const db = supabase.createClient(window.PAKDIN_SUPABASE_URL, window.PAKDIN_SUPABASE_ANON_KEY);
                    await db.from('catering_enquiries').insert({ customer_name: details.name, phone: details.phone, event_type: details.eventType, event_date: details.date, guests: Number(details.guests), venue: details.venue, notes: details.notes || '' });
                } catch (_) {}
            }
            status.textContent = 'Opening WhatsApp with your enquiry…';
            window.open('https://wa.me/60125033639?text=' + encodeURIComponent(message), '_blank', 'noopener');
            cateringForm.reset();
        });
    }

    /* ── Hamburger menu toggle ─────────────── */
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            hamburger.classList.toggle('is-open', navMenu.classList.contains('open'));
            hamburger.setAttribute('aria-expanded', navMenu.classList.contains('open') ? 'true' : 'false');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                hamburger.classList.remove('is-open');
                hamburger.setAttribute('aria-expanded', 'false');
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
