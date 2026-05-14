/*
* ----------------------------------------------------------------------------------------
Author        :
Template Name :
Version       :
* ----------------------------------------------------------------------------------------
*/
"use strict";

var head = $('#slhheader-wrap');
var Window = $(window);
var ido = $('#slhido-slide');
var testi = $('#slhtesti-slide');
var picuser = $('#slhuserpic-slide');
var teachingCarousel = $('#teaching-carousel');
var Wrapload = $('.loading');
var paralaxone = document.getElementsByClassName('paralax-one');
var slideoutMenu = $('.slhslideout-menu');
var slideoutMenuWidth = $('.slhslideout-menu').width();
var currentMenuId = "";

var siteConfig = window.SLH_SITE_CONFIG || {};
var apiBaseUrl = siteConfig.apiBaseUrl || "http://localhost:8080/api/public";
var siteLang = siteConfig.lang || "en";
var apiOrigin = apiBaseUrl.replace(/\/api\/public\/?$/, "");

var zhLabels = {
    aboutHeading: "經歷與學歷",
    experienceHeading: "經歷",
    educationHeading: "學歷",
    preprintHeading: "Preprints",
    moreProject: "More Project",
    emptyPublications: "目前尚無資料",
    emptyPresentations: "目前尚無資料",
    emptyTeaching: "目前尚無資料",
    emptyPortfolio: "目前尚無資料",
    categoryAll: "所有",
    contactEmailPrefix: "電子郵件:",
    contactPhonePrefix: "辦公室聯絡電話:",
    defaultHeroIntro: "中央大學統計研究所教授",
    fallbackTitle: "Professor"
};

var enLabels = {
    aboutHeading: "BIOGRAPHY",
    experienceHeading: "Experience",
    educationHeading: "Education",
    preprintHeading: "Preprints",
    moreProject: "More Project",
    emptyPublications: "No data available yet.",
    emptyPresentations: "No data available yet.",
    emptyTeaching: "No data available yet.",
    emptyPortfolio: "No data available yet.",
    categoryAll: "All",
    contactEmailPrefix: "Mail Address ",
    contactPhonePrefix: "Office Phone ",
    defaultHeroIntro: "Professor, National Central University",
    fallbackTitle: "Professor"
};

function labels() {
    return siteLang === "en" ? enLabels : zhLabels;
}

function scrollOffset() {
    return head.outerHeight() + 20;
}

function smoothScrollTo(targetSelector) {
    var target = $(targetSelector);
    if (!target.length) {
        return;
    }
    $('html, body').stop().animate({
        scrollTop: Math.max(target.offset().top - scrollOffset(), 0)
    }, 1500);
}

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function renderInlineLinks(text) {
    var source = String(text || '');
    var pattern = /\[([^\]|]+)\|([^\]]+)\]/g;
    var html = '';
    var lastIndex = 0;
    var match;

    while ((match = pattern.exec(source)) !== null) {
        html += escapeHtml(source.slice(lastIndex, match.index));
        html += '<a href="' + escapeHtml(match[2].trim()) + '" target="_blank" rel="noreferrer">[' + escapeHtml(match[1].trim()) + ']</a>';
        lastIndex = pattern.lastIndex;
    }

    html += escapeHtml(source.slice(lastIndex));
    return html;
}

function resolveAssetUrl(url) {
    if (!url) {
        return "";
    }
    if (/^https?:\/\//i.test(url) || url.indexOf("data:") === 0) {
        return url;
    }
    if (url.charAt(0) === "/") {
        return apiOrigin + url;
    }
    return url;
}

function normalizeWhitespace(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
}

function safeHeroTitle(rawTitle, rawIntro, fallbackTitle) {
    var title = normalizeWhitespace(rawTitle);
    var intro = normalizeWhitespace(rawIntro);

    if (!title) {
        return fallbackTitle;
    }

    if (title.length > 24 || /,/.test(title)) {
        var firstSegment = title.split(',')[0].trim();
        if (firstSegment && firstSegment.length <= 24) {
            return firstSegment;
        }
        if (intro) {
            var introSegment = intro.split(',')[0].trim();
            if (introSegment && introSegment.length <= 24) {
                return introSegment;
            }
        }
        return fallbackTitle;
    }

    return title;
}

function safeHeroIntro(rawIntro, profile) {
    var intro = normalizeWhitespace(rawIntro);
    if (intro) {
        return intro;
    }

    return siteLang === "en"
        ? normalizeWhitespace(profile && profile.instituteEn)
        : normalizeWhitespace(profile && profile.instituteZh);
}

function renderHeroName(name) {
    var normalizedName = normalizeWhitespace(name);
    if (!normalizedName) {
        return "";
    }

    if (siteLang === "zh") {
        return escapeHtml(normalizedName);
    }

    var parts = normalizedName.split(/\s+/);
    if (parts.length <= 1) {
        return escapeHtml(normalizedName);
    }

    return '<span>' + escapeHtml(parts[0]) + '</span>' + escapeHtml(parts.slice(1).join(' '));
}

function splitLines(value) {
    return String(value || "")
        .split(/\r?\n/)
        .map(function(item) {
            return item.trim();
        })
        .filter(function(item) {
            return item.length > 0;
        });
}

function categoryLabel(category) {
    if (!category) {
        return labels().categoryAll;
    }
    if (siteLang === "zh") {
        if (category === "brand") return "的";
        if (category === "web") return "上山";
        if (category === "uiux") return "下海";
    }
    return category.replace(/[-_]/g, " ");
}

function presentationImages(siteSetting) {
    var uploadedImages = [
        resolveAssetUrl(siteSetting && siteSetting.presentationImagePrimaryUrl),
        resolveAssetUrl(siteSetting && siteSetting.presentationImageSecondaryUrl)
    ].filter(function(url) {
        return !!url;
    });

    if (uploadedImages.length === 1) {
        uploadedImages.push(uploadedImages[0]);
    }

    if (uploadedImages.length) {
        return uploadedImages;
    }

    return [
        "image/user/01.jpg",
        "image/user/02.jpg"
    ];
}

function renderHero(profile, siteSetting) {
    var text = labels();
    var bannerUrl = resolveAssetUrl((profile && profile.heroBannerUrl) || (siteSetting && siteSetting.frontBannerUrl));
    var heroTitle = siteLang === "en"
        ? ((profile && profile.heroTitleEn) || text.fallbackTitle)
        : ((profile && profile.heroTitleZh) || text.fallbackTitle);
    var heroName = siteLang === "en"
        ? ((profile && profile.heroNameEn) || "Sun Li-Hsien")
        : ((profile && profile.heroNameZh) || "孫立憲");
    var heroIntro = siteLang === "en"
        ? ((siteSetting && siteSetting.homeIntroEn) || text.defaultHeroIntro)
        : ((siteSetting && siteSetting.homeIntroZh) || text.defaultHeroIntro);
    var displayTitle = safeHeroTitle(heroTitle, heroIntro, text.fallbackTitle);
    var displayIntro = safeHeroIntro(heroIntro, profile);

    if (bannerUrl) {
        $('#heroBanner').css({ 'background-image': 'url(' + bannerUrl + ')' });
    }
    $('#heroTitle').html('<span></span>' + escapeHtml(displayTitle));
    $('#heroName').html(renderHeroName(heroName));
    $('#heroIntro').text(displayIntro);
}

function renderAbout(profile) {
    var text = labels();
    var experience = splitLines(siteLang === "en" ? profile.enExperience : profile.zhExperience);
    var education = splitLines(siteLang === "en" ? profile.enEducation : profile.zhEducation);
    var profileImageUrl = resolveAssetUrl(profile.profileImageUrl);

    $('#aboutHeading').text(text.aboutHeading);
    $('#experienceHeading').text(text.experienceHeading);
    $('#educationHeading').text(text.educationHeading);
    $('#experienceList').html(experience.map(function(item) {
        return '<li>' + escapeHtml(item) + '</li>';
    }).join(''));
    $('#educationList').html(education.map(function(item) {
        return '<li>' + escapeHtml(item) + '</li>';
    }).join(''));

    if (profile.cvUrl) {
        $('#cvLink').attr('href', profile.cvUrl);
    }
    if (profileImageUrl) {
        $('#profileImage').css({
            'background': 'url(' + profileImageUrl + ') no-repeat center',
            'background-position': 'center',
            'background-size': 'cover'
        });
    }
}

function renderPublicationLinks(links) {
    if (!(links || []).length) {
        return '';
    }
    return ' ' + links.filter(function(link) {
        return link && link.label && link.url;
    }).map(function(link) {
        return '<a href="' + escapeHtml(link.url) + '" target="_blank" rel="noreferrer">[' + escapeHtml(link.label) + ']</a>';
    }).join(' ');
}

function renderPublications(publications) {
    var text = labels();
    var publicationItems = [];
    var preprintItems = [];

    (publications || []).forEach(function(item) {
        var html = '<li>' + escapeHtml(item.citation) + renderPublicationLinks(item.links) + '</li>';
        if ((item.category || '').toLowerCase() === 'preprint') {
            preprintItems.push(html);
        } else {
            publicationItems.push(html);
        }
    });

    $('#publicationList').html(publicationItems.length ? publicationItems.join('') : '<li>' + escapeHtml(text.emptyPublications) + '</li>');
    $('#preprintHeading').text(text.preprintHeading);
    $('#preprintList').html(preprintItems.join(''));
}

function renderPresentations(presentations, siteSetting) {
    var text = labels();
    var items = presentations || [];
    var images = presentationImages(siteSetting);
    var slideHtml = '';
    var imageHtml = '';

    if (!items.length) {
        slideHtml = '<div class="slhtesti-wrap"><div class="slh-innertesti"><h3 class="nameuser">' + escapeHtml(text.emptyPresentations) + '</h3></div></div>';
        imageHtml = '<div class="slh-userpic" style="background-image: url(' + escapeHtml(images[0]) + ');"></div>';
    } else {
        items.forEach(function(item, index) {
            var detailItems = splitLines(item.items);
            slideHtml += '<div class="slhtesti-wrap"><div class="slh-innertesti"><h3 class="nameuser">' +
                escapeHtml(item.sectionTitle || ('Presentation ' + item.presentationYear)) +
                '</h3><ul>' +
                detailItems.map(function(line) {
                    return '<li>' + escapeHtml(line) + '</li>';
                }).join('') +
                '</ul></div></div>';
            imageHtml += '<div class="slh-userpic" style="background-image: url(' + escapeHtml(images[index % images.length]) + ');"></div>';
        });
    }

    testi.html(slideHtml);
    picuser.html(imageHtml);
}

function renderTeaching(teachingSections) {
    var text = labels();
    var container = $('#teaching-carousel');
    if (!container.length) {
        return;
    }

    var items = teachingSections || [];
    var html = '';

    if (!items.length) {
        html = '<div class="slhteachti-wrap teaching-card-wrap"><div class="slh-innertesti"><h3 class="nameuser">' +
            escapeHtml(text.emptyTeaching) +
            '</h3></div></div>';
    } else {
        items.forEach(function(item) {
            var title = siteLang === 'en' ? (item.enTitle || item.zhTitle) : (item.zhTitle || item.enTitle);
            var lines = splitLines(siteLang === 'en' ? (item.enItems || item.zhItems) : (item.zhItems || item.enItems));
            html += '<div class="slhteachti-wrap teaching-card-wrap"><div class="slh-innertesti"><h3 class="nameuser">' +
                escapeHtml(title) +
                '</h3>' +
                (lines.length ? '<ul>' + lines.map(function(line) { return '<li>' + renderInlineLinks(line) + '</li>'; }).join('') + '</ul>' : '') +
                '</div></div>';
        });
    }

    container.html(html);
}

function renderLogos(logos) {
    var html = '';
    (logos || []).forEach(function(item) {
        var imageUrl = resolveAssetUrl(item.imageUrl);
        var openTag = item.targetUrl ? '<a href="' + escapeHtml(item.targetUrl) + '" target="_blank" rel="noreferrer">' : '';
        var closeTag = item.targetUrl ? '</a>' : '';
        html += '<div class="slhido-wrap" data-aos="fade-in" data-aos-delay="100"><div class="slh-innertitle">' +
            openTag +
            '<img src="' + escapeHtml(imageUrl) + '" alt="partner-logo">' +
            closeTag +
            '</div></div>';
    });
    if (html) {
        ido.html(html);
    }
}

function portfolioLinkClass(linkUrl) {
    var url = String(linkUrl || "").toLowerCase();
    if (url.indexOf('youtube.com') >= 0 || url.indexOf('youtu.be') >= 0 || url.indexOf('facebook.com') >= 0 || url.indexOf('vimeo.com') >= 0) {
        return 'video-popup';
    }
    if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url)) {
        return 'image-popup';
    }
    return 'ajax-porto';
}

function renderPortfolio(items) {
    var text = labels();
    var categories = [];
    var html = '';

    (items || []).forEach(function(item) {
        if (categories.indexOf(item.category) === -1) {
            categories.push(item.category);
        }
        html += '<div class="slhmasonry-item ' + escapeHtml(item.category || '') + '">' +
            '<a class="' + portfolioLinkClass(item.linkUrl) + ' gallery-link" href="' + escapeHtml(item.linkUrl || '#') + '">' +
            '<i class="material-icons">add_circle_outline</i>' +
            '<div class="content-porto" style="background: url(' + escapeHtml(resolveAssetUrl(item.coverImageUrl)) + ') no-repeat center; background-position: center; background-size: cover;"></div>' +
            '</a></div>';
    });

    if (html) {
        $('#slhporfolio-warp').html(html);
    } else {
        $('#slhporfolio-warp').html('<div class="slhmasonry-item"><div class="content-porto" style="display:flex;align-items:center;justify-content:center;min-height:220px;">' + escapeHtml(text.emptyPortfolio) + '</div></div>');
    }

    var filterHtml = '<li data-filter="*" class="aktip">' + escapeHtml(text.categoryAll) + '</li>';
    categories.forEach(function(category) {
        filterHtml += '<li data-filter=".' + escapeHtml(category) + '">' + escapeHtml(categoryLabel(category)) + '</li>';
    });
    $('#portfolioFilters').html(filterHtml);
    $('.pro-link').text(text.moreProject);
}

function renderContact(profile, siteSetting) {
    var text = labels();
    var address = siteLang === "en"
        ? ((siteSetting && siteSetting.contactAddressEn) || (profile && profile.instituteEn) || "")
        : ((siteSetting && siteSetting.contactAddressZh) || (profile && profile.instituteZh) || "");
    var phone = (siteSetting && siteSetting.contactPhone) || (profile && profile.officePhone) || "";
    var emailText = [profile && profile.emailPrimary, profile && profile.emailSecondary, siteSetting && siteSetting.contactEmail]
        .filter(function(item, index, arr) {
            return item && arr.indexOf(item) === index;
        })
        .join(' / ');

    $('#contactAddress').text(address);
    $('#contactPhone').text(text.contactPhonePrefix + phone);
    $('#contactEmail').text(emailText);
    $('#contactEmail').attr('href', emailText ? 'mailto:' + emailText.split(' / ')[0] : '#');
}

function renderFooter(siteSetting) {
    if (siteSetting && siteSetting.footerText) {
        $('#footerText').text(siteSetting.footerText);
    }
}

function renderHomepage(data) {
    if (!data) {
        return;
    }
    renderHero(data.profile || {}, data.siteSetting || {});
    renderAbout(data.profile || {});
    renderPublications(data.publications || []);
    renderPresentations(data.presentations || [], data.siteSetting || {});
    renderTeaching(data.teachingSections || []);
    renderLogos(data.partnerLogos || []);
    renderPortfolio(data.portfolioItems || []);
    renderContact(data.profile || {}, data.siteSetting || {});
    renderFooter(data.siteSetting || {});
}

function fetchHomepage() {
    return fetch(apiBaseUrl + '/homepage?lang=' + encodeURIComponent(siteLang))
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Failed to fetch homepage');
            }
            return response.json();
        })
        .then(function(result) {
            return result && result.data ? result.data : null;
        });
}

function initAnimatedHeadline() {
    if ($('.titlenya').find('.ah-headline').length) {
        $('.titlenya').animatedHeadline({
            animationType: "clip",
            animationDelay: 2500,
            barAnimationDelay: 3800,
            barWaiting: 800,
            lettersDelay: 50,
            typeLettersDelay: 150,
            selectionDuration: 500,
            typeAnimationDelay: 1300,
            revealDuration: 600,
            revealAnimationDelay: 1500
        });
    }
}

function initCarousels() {
    ido.owlCarousel({
        loop: true,
        nav: false,
        autoPlay: true,
        autoplay: true,
        autoplayTimeout: 4200,
        autoplayHoverPause: true,
        touchDrag: true,
        slideSpeed: 800,
        margin: 18,
        dots: true,
        mouseDrag: true,
        responsive: {
            0: { items: 1 },
            576: { items: 2 },
            992: { items: 4 },
            1280: { items: 4 }
        }
    });

    picuser.owlCarousel({
        items: 1,
        loop: true,
        nav: false,
        margin: 30,
        autoPlay: true,
        touchDrag: true,
        slideSpeed: 1000,
        dots: false,
        mouseDrag: false
    });

    testi.owlCarousel({
        items: 1,
        loop: true,
        nav: false,
        autoPlay: true,
        touchDrag: true,
        dots: false,
        mouseDrag: false
    });

    if (teachingCarousel.length) {
        teachingCarousel.owlCarousel({
            loop: true,
            nav: true,
            navText: ['<i class="material-icons">navigate_before</i>', '<i class="material-icons">navigate_next</i>'],
            margin: 34,
            autoPlay: true,
            autoplay: true,
            autoplayTimeout: 4200,
            autoplayHoverPause: true,
            slideSpeed: 700,
            touchDrag: true,
            dots: true,
            mouseDrag: true,
            responsive: {
                0: { items: 1 },
                992: { items: 2 }
            }
        });
    }

    testi.on('initialized.owl.carousel translate.owl.carousel', function(e) {
        var idx = e.item.index;
        $('.owl-item.bigfade').removeClass('bigfade');
        $('.owl-item.fadeup').removeClass('fadeup');
        $('.owl-item').eq(idx).addClass('bigfade');
        $('.owl-item').eq(idx - 1).addClass('fadeup');
        $('.owl-item').eq(idx + 1).addClass('fadeup');
    });
}

function initPortfolio() {
    $('#slhporfolio-warp').isotope({
        resizable: false,
        itemSelector: '.slhmasonry-item',
        layoutMode: 'masonry',
        filter: '*'
    });
}

function initPopup() {
    $('.ajax-porto').magnificPopup({
        type: 'ajax',
        alignTop: true,
        overflowY: 'scroll',
        gallery: { enabled: false },
        callbacks: {
            open: function() {
                $.magnificPopup.instance.close = function() {
                    $.magnificPopup.proto.close.call(this);
                };
            }
        }
    });

    $('.image-popup').magnificPopup({
        type: 'image',
        gallery: { enabled: true }
    });

    $('.popup-youtube, .popup-vimeo, .popup-gmaps, .video-popup').magnificPopup({
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: true
    });
}

function initAosAndParallax() {
    AOS.init({
        disable: function() {
            return window.innerWidth < 999;
        },
        easing: 'ease-in-out-quad'
    });

    var isMobile = {
        Android: function() { return navigator.userAgent.match(/Android/i); },
        BlackBerry: function() { return navigator.userAgent.match(/BlackBerry/i); },
        iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
        Opera: function() { return navigator.userAgent.match(/Opera Mini/i); },
        Windows: function() { return navigator.userAgent.match(/IEMobile/i); },
        any: function() {
            return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
        }
    };

    if (!isMobile.any()) {
        new simpleParallax(paralaxone, {
            delay: .6,
            transition: 'cubic-bezier(0,0,0,1)'
        });
    }
}

function bindEvents() {
    $('.nav-next').click(function() {
        picuser.trigger('next.owl.carousel');
        testi.trigger('next.owl.carousel', [10]);
    });

    $('.nav-prev').click(function() {
        picuser.trigger('prev.owl.carousel', [300]);
        testi.trigger('prev.owl.carousel', [10]);
    });

    $(document).on('click', '#portfolioFilters li', function() {
        var filterValue = $(this).attr('data-filter');
        $('#slhporfolio-warp').isotope({ filter: filterValue });
        $(this).addClass('aktip').siblings().removeClass('aktip');
    });

    $('.navigation-wraplist li a').on("click", function(e) {
        smoothScrollTo($(this).attr('href'));
        e.preventDefault();
    });

    $('.menumobile').on('click', function() {
        $('.burger').addClass('open');
        slideoutMenu.toggleClass("openmenu");
        if (slideoutMenu.hasClass("openmenu")) {
            slideoutMenu.show(50);
            slideoutMenu.animate({ right: "0px" }, 500);
            $('.overlayclose').fadeIn(500);
        } else {
            slideoutMenu.animate({ right: -slideoutMenuWidth }, 500);
            $('.burger').removeClass('open');
            $('.overlayclose').fadeOut();
            $('.overlayclose').hide(1000);
            slideoutMenu.hide(100);
        }
    });

    $('#slhmobile-navigation > .list-navigation li a').on("click", function(e) {
        slideoutMenu.animate({ right: -slideoutMenuWidth }, 500);
        $('.burger').removeClass('open');
        $('.overlayclose').fadeOut();
        $('.overlayclose').hide(1000);
        slideoutMenu.hide(100);
        smoothScrollTo($(this).attr('href'));
        e.preventDefault();
    });

    $(document).on('click', '.overlayclose', function() {
        slideoutMenu.animate({ right: -slideoutMenuWidth }, 500);
        $(this).fadeOut();
        slideoutMenu.hide(50);
        $('.burger').removeClass('open');
    });

    Window.on('scroll', function() {
        ScrollSpy();
        if (Window.scrollTop() > 0) {
            head.addClass('fixid');
        } else {
            head.removeClass('fixid');
        }
    });

    if ($('#contactform').length) {
        $('#contactform').submit(function(e) {
            e.preventDefault();
        }).validate({
            rules: {
                email: { required: true, email: true },
                name: { required: true, minlength: 5 },
                message: { required: true }
            },
            messages: {
                email: { required: 'Check your email input ' },
                name: { required: 'Please check your first name input' },
                message: { required: 'Please write something for us' }
            }
        });
    }
}

function ScrollSpy() {
    var menuList = $(".navigation-wraplist");
    var menuHeight = menuList.outerHeight() + 200;
    var menuItems = menuList.find("li > a");
    var scrollItems = menuItems.map(function() {
        var item = $($(this).attr("href"));
        if (item.length) {
            return item;
        }
    });
    var fromTop = $(window).scrollTop() + menuHeight;
    var cur = scrollItems.map(function() {
        if ($(this).offset().top < fromTop) {
            return this;
        }
    });
    cur = cur[cur.length - 1];
    var id = cur && cur.length ? cur[0].id : "";
    if (currentMenuId !== id) {
        currentMenuId = id;
        menuItems.parent().removeClass("aktip");
        menuItems.filter("[href='#" + id + "']").parent().addClass("aktip");
    }
}

Window.on('load', function() {
    Wrapload.fadeOut(600);
    setTimeout(function() {
        head.addClass('loadded');
    }, 1200);
});

$(document).ready(function() {
    fetchHomepage()
        .then(function(data) {
            renderHomepage(data);
        })
        .catch(function(error) {
            console.warn('Homepage API unavailable, using static fallback.', error);
        })
        .finally(function() {
            initAnimatedHeadline();
            initAosAndParallax();
            initCarousels();
            initPortfolio();
            initPopup();
            bindEvents();
            ScrollSpy();
        });
});
