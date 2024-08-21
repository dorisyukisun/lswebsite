/*
* ----------------------------------------------------------------------------------------
Author        : Rama Hardian
Template Name : Rex - Creative Personal Multipurpose Portfolio
Version       : 1.0
* ----------------------------------------------------------------------------------------
*/
"use strict";
var head = $('#rexheader-wrap');
/* add random image on refresh page 
   if you want only one static image give only one index array
   example:
   var images = ['image/hero/8.jpg'];
   the code will run on the document ready function 
   if you don't want random images when refreshing the page 
   you can give Single line comments start with //
   example:
   //$('.image-hero-wrap').css({'background-image': 'url('+ images[Math.floor(Math.random() * images.length)] + ')'});
*/
var images = ['image/random/background.png'];
var Window = $(window);
var ido = $('#rexido-slide');
var testi = $('#rextesti-slide');
var picuser = $('#rexuserpic-slide');
var Wrapload = $('.loading');

var paralaxone = document.getElementsByClassName('paralax-one');
var slideoutMenu = $('.rexslideout-menu');
var slideoutMenuWidth = $('.rexslideout-menu').width();
//animated headline init ------------------------
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
// what ido slide
ido.owlCarousel({
    loop: true,
    nav: false,
    autoPlay: true,
    touchDrag: true,
    slideSpeed: 1000,
    dots: false,
    mouseDrag: true,
    responsive: {
        0: {
            items: 1
        },
        680: {
            items: 1
        },
        960: {
            items: 2
        },
        1024: {
            items: 2
        },
        1280: {
            items: 3
        }
    }
});
// userpic slide
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
// testimoni slide
testi.owlCarousel({
    items: 1,
    loop: true,
    nav: false,
    autoPlay: true,
    touchDrag: true,
    dots: false,
    mouseDrag: false
});
testi.on('initialized.owl.carousel translate.owl.carousel', function(e) {
    var idx = e.item.index;

    $('.owl-item.bigfade').removeClass('bigfade');
    $('.owl-item.fadeup').removeClass('fadeup');
    $('.owl-item').eq(idx).addClass('bigfade');
    $('.owl-item').eq(idx - 1).addClass('fadeup');
    $('.owl-item').eq(idx + 1).addClass('fadeup');
});
$('.nav-next').click(function() {
    picuser.trigger('next.owl.carousel');
    testi.trigger('next.owl.carousel', [10]);
});
$('.nav-prev').click(function() {
    picuser.trigger('prev.owl.carousel', [300]);
    testi.trigger('prev.owl.carousel', [10]);
});
// scroll spy init ------------------------
var ScrollSpy = function(event) {
    var Id;
    var Menulist = $(".navigation-wraplist");
    var MenuHeight = Menulist.outerHeight() + 200;
    var menuItems = Menulist.find("li > a");
    // Anchors menu items
    var scrollItems = menuItems.map(function() {
        var item = $($(this).attr("href"));
        if (item.length) {
            return item;
        }
    });
    var fromTop = $(window).scrollTop() + MenuHeight;
    // id of current item
    var cur = scrollItems.map(function() {
        if ($(this).offset().top < fromTop)
            return this;
    });
    // id of the element
    cur = cur[cur.length - 1];
    var id = cur && cur.length ? cur[0].id : "";
    if (Id !== id) {
        Id = id;
        // Set/remove active class
        menuItems
            .parent().removeClass("aktip")
            .end().filter("[href=#" + id + "]").parent().addClass("aktip");
    }
};
//Filtering items on portfolio
var portfolioFilter = $('.filter li');
// filter items on button click
$(portfolioFilter).on('click', function() {
    var filterValue = $(this).attr('data-filter');
    $('#rexporfolio-warp').isotope({ filter: filterValue });
});
//Add/remove class on filter list
$(portfolioFilter).on('click', function() {
    $(this).addClass('aktip').siblings().removeClass('aktip');
});
//-------------contact form init
$('#contactform').submit(function(e) {
    e.preventDefault();
}).validate({
    rules: {
        email: {
            required: true,
            email: true
        },
        name: {
            required: true,
            minlength: 5
        },
        message: {
            required: true
        }
    },
    messages: {
        email: {
            required: 'Check your email input '
        },
        name: {
            required: 'Please check your first name input'
        },
        message: {
            required: 'Please write something for us'
        }
    },
    submitHandler: function(form) {
        $.ajax({
            type: "POST",
            url: "https://mailpostexample.herokuapp.com/",
            data: $(form).serialize(),
            beforeSend: function() {
                $('.subbuton').html('SENDDING...');
                $('.flashinfo').hide();
                $('input, textarea').attr('readonly', "readonly");
            },
            success: function(msg) {
                if (msg == 'your message send') {
                    $('#contactform').trigger("reset");
                    $('.subbuton').html('SEND NOW');
                    $('.flashinfo').show();
                    $('input, textarea').removeAttr('readonly');
                    $('.flashinfo').html('<span class="material-icons">info</span>Your message has been sent, I will reply to you shortly');
                } else {
                    $('input, textarea').removeAttr('readonly');
                    $('#contactform').trigger("reset");
                    $('.flashinfo').hide();
                    $('.flashinfo').html('<span class="material-icons">info</span>something unknown error');
                }
            }
        });
        return false;
    }
});
// mobile navigation init ----------------------
$('.navigation-wraplist li a').on("click", function(e) {
    var anchor = $(this);
    $('html, body').stop().animate({
        scrollTop: $(anchor.attr('href')).offset().top - 50
    }, 1500);
    e.preventDefault();
});
// mobile navigation burger toggle switch init ----------------------
$('.menumobile').on('click', function(e) {
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
// mobile navigation init ----------------------
$('#rexmobile-navigation > .list-navigation li a').on("click", function(e) {
    var anchor = $(this);
    slideoutMenu.animate({ right: -slideoutMenuWidth }, 500);
    $('.burger').removeClass('open');
    $('.overlayclose').fadeOut();
    $('.overlayclose').hide(1000);
    slideoutMenu.hide(100);
    $('html, body').stop().animate({
        scrollTop: $(anchor.attr('href')).offset().top - 50
    }, 1500);
    e.preventDefault();
});
// navbar mobile overlay close init ----------------------
$(document).on('click', '.overlayclose', function() {
    slideoutMenu.animate({ right: -slideoutMenuWidth }, 500);
    $(this).fadeOut();
    slideoutMenu.hide(50);
    $('.burger').removeClass('open');
});
// window on scroll
Window.on('scroll', function() {
    ScrollSpy();
    if (Window.scrollTop() > 0) {
        head.addClass('fixid');
    } else {
        head.removeClass('fixid');
    }
});
// magnific portfolio init ----------------------
$('.ajax-porto').magnificPopup({
    type: 'ajax',
    alignTop: true,
    overflowY: 'scroll',
    gallery: {
        enabled: false
    },
    callbacks: {
        open: function() {
            $.magnificPopup.instance.close = function() {
                $.magnificPopup.proto.close.call(this);
            }
        }
    }
});
// magnific image init ----------------------
$('.image-popup').magnificPopup({
    type: 'image',
    gallery: {
        enabled: true
    }
});
if ($('.image-popup').length > 0) {
    $('.image-popup').magnificPopup({
        type: 'image',
        fixedContentPos: true,
        gallery: { enabled: true },
        removalDelay: 300,
        mainClass: 'mfp-fade'
    });
}
//Video Popup init
$('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    fixedContentPos: true
});
//Video Popup init
if ($('.video-popup').length > 0) {
    $('.video-popup').magnificPopup({
        type: "iframe",
        removalDelay: 300,
        mainClass: "mfp-fade",
        overflowY: "hidden",
        iframe: {
            markup: '<div class="mfp-iframe-scaler">' +
                '<div class="mfp-close"></div>' +
                '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +
                '</div>',
            patterns: {
                youtube: {
                    index: 'youtube.com/',
                    id: 'v=',
                    src: '//www.youtube.com/embed/%id%?autoplay=1'
                },
                vimeo: {
                    index: 'vimeo.com/',
                    id: '/',
                    src: '//player.vimeo.com/video/%id%?autoplay=1'
                },
                gmaps: {
                    index: '//maps.google.',
                    src: '%id%&output=embed'
                }
            },
            srcAction: 'iframe_src'
        }
    });
};
// window on load
Window.on('load', function() {
    Wrapload.fadeOut(600);
    setTimeout(function() {
        head.addClass('loadded')
    }, 1200);
});
// documennt ready
$(document).ready(function() {
    //random big image
    $('.image-hero-wrap').css({ 'background-image': 'url(' + images[Math.floor(Math.random() * images.length)] + ')' });
    AOS.init({
        disable: function() {
            var maxWidth = 999;
            return window.innerWidth < maxWidth;
        },
        easing: 'ease-in-out-quad'
    });
    //detect mobile device
    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    //init simpleParallax if not on mobile device
    if (!isMobile.any()) {
        new simpleParallax(paralaxone, {
            delay: .6,
            transition: 'cubic-bezier(0,0,0,1)'
        });
    }
    $('#rexporfolio-warp').isotope({
        resizable: false,
        itemSelector: '.rexmasonry-item',
        layoutMode: 'masonry',
        filter: '*'
    });
});