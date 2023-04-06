function getURLVar(key) {
    var value = [];

    var query = String(document.location).split('?');

    if (query[1]) {
        var part = query[1].split('&');

        for (i = 0; i < part.length; i++) {
            var data = part[i].split('=');

            if (data[0] && data[1]) {
                value[data[0]] = data[1];
            }
        }

        if (value[key]) {
            return value[key];
        } else {
            return '';
        }
    }
}

function flyToElement(flyer, flyingTo) {
    var $func = $(this);
    var divider = $(flyer).width() / $(flyingTo).width();
    var flyerClone = $(flyer).clone();
    $(flyerClone).css({ position: 'absolute', top: $(flyer).offset().top + "px", left: $(flyer).offset().left + "px", opacity: 1, 'z-index': 1000 });
    $('body').append($(flyerClone));
    var gotoX = $(flyingTo).offset().left + ($(flyingTo).width() / 2) - ($(flyer).width() / divider) / 2;
    var gotoY = $(flyingTo).offset().top + ($(flyingTo).height() / 2) - ($(flyer).height() / divider) / 2;

    $(flyerClone).animate({
            opacity: 0.4,
            left: gotoX,
            top: gotoY,
            width: $(flyer).width() / divider,
            height: $(flyer).height() / divider
        }, 700,
        function() {
            $(flyingTo).fadeOut('fast', function() {
                $(flyingTo).fadeIn('fast', function() {
                    $(flyerClone).fadeOut('fast', function() {
                        $(flyerClone).remove();
                    });
                });
            });
        });
}

function flyToMenu(cardBtn) {
    var itemImg = $(cardBtn).parents('.product-grid-card').find('.product-grid-image img').eq(0);
    flyToElement($(itemImg), $('.header-widget i'));
}

function toggleBtnAdd(btnElem) {
    if (!$(btnElem).hasClass('active')) {
        flyToMenu(btnElem);
        $(btnElem).addClass('active');
    } else {
        $(btnElem).removeClass('active');
    }

}


//После загрзки DOM
$(document).ready(function() {

    //Отложенная загрузка скриптов
    var scripts = document.querySelectorAll('script[delay]');
    for (script of scripts) {
        script.src = script.getAttribute('delay');
    }
    console.log('scriptloadingtest 1');
    console.log($(".price-slider").slick);

    //После загрзуки скриптов вполняем js
    window.addEventListener('load', function(e) {
	    console.log('scriptloadingtest 2');
    	console.log($(".price-slider").slick);
        // Highlight any found errors
        $('.text-danger').each(function() {
            var element = $(this).parent().parent();

            if (element.hasClass('form-group')) {
                element.addClass('has-error');
            }
        });

        // Currency
        $('#form-currency .currency-select').on('click', function(e) {
            e.preventDefault();

            $('#form-currency input[name=\'code\']').val($(this).attr('name'));

            $('#form-currency').submit();
        });

        // Language
        $('#form-language .language-select').on('click', function(e) {
            e.preventDefault();

            $('#form-language input[name=\'code\']').val($(this).attr('name'));

            $('#form-language').submit();
        });

        /* Search */
        // $('#search input[name=\'search\']').parent().find('button .subm_search_form').on('click', function() {

        $("body").on("click", "#search .subm_search_form", function() {
            var url = $('base').attr('href') + 'index.php?route=product/search';

            var value = $('header #search input[name=\'search\']').val();

            var mark = parseInt($('header #search #form-select--mark').val());
            var model = parseInt($('header #search #form-select--model').val());

            var price_min = parseInt($('header #search input[name=\'bfp_price_min\']').val());
            var price_max = parseInt($('header #search input[name=\'bfp_price_max\']').val());

            var year_min = parseInt($('header #search input[name=\'bfp_year_min\']').val());
            var year_max = parseInt($('header #search input[name=\'bfp_year_max\']').val());

            filtr_val = "";
            if (mark) {
                filtr_val += "m0:" + mark + ";";
            }
            if (model) {
                filtr_val += "a26:" + model + ";";
            }

            if (price_min || price_max) {
                if (!price_min) {
                    price_min = 0;
                }
                if (!price_max) {
                    price_max = 1000000000
                }
                filtr_val += "price:" + price_min + "-" + price_max + ";";
            }

            if (year_min || year_max) {
                if (!year_min) {
                    year_min = 0;
                }
                if (!year_max) {
                    year_max = 1000000000
                }
                filtr_val += "a12:" + year_min + "-" + year_max + ";";
            }

            // alert(filtr_val);



            if (value) {
                url += '&search=' + encodeURIComponent(value);
            }

            if (filtr_val) {
                url += '&bfilter=' + filtr_val;
            }

            // alert(url); 

            location = url;
        });

        // $('#search .subm_search_form_f').on('keydown', function(e) {
        $("body").on("click", "#search .subm_search_form_f", function() {
            $('#search .subm_search_form').trigger('click');
        });

        $('#search input[name=\'search\']').on('keyup', function(e) {
            if (e.keyCode == 13) {
                $('#search .subm_search_form').trigger('click');
            }
        });

        // Menu
        $('#menu .dropdown-menu').each(function() {
            var menu = $('#menu').offset();
            var dropdown = $(this).parent().offset();

            var i = (dropdown.left + $(this).outerWidth()) - (menu.left + $('#menu').outerWidth());

            if (i > 0) {
                $(this).css('margin-left', '-' + (i + 10) + 'px');
            }
        });

        // Product List
        $('#list-view').click(function() {
            $('#content .product-grid > .clearfix').remove();

            $('#content .row > .product-grid').attr('class', 'product-layout product-list col-xs-12');
            $('#grid-view').removeClass('active');
            $('#list-view').addClass('active');

            localStorage.setItem('display', 'list');
        });

        // Product Grid
        $('#grid-view').click(function() {
            // What a shame bootstrap does not take into account dynamically loaded columns
            var cols = $('#column-right, #column-left').length;

            if (cols == 2) {
                $('#content .product-list').attr('class', 'product-layout product-grid col-lg-6 col-md-6 col-sm-12 col-xs-12');
            } else if (cols == 1) {
                $('#content .product-list').attr('class', 'product-layout product-grid col-lg-4 col-md-4 col-sm-6 col-xs-12');
            } else {
                $('#content .product-list').attr('class', 'product-layout product-grid col-lg-3 col-md-3 col-sm-6 col-xs-12');
            }

            $('#list-view').removeClass('active');
            $('#grid-view').addClass('active');

            localStorage.setItem('display', 'grid');
        });

        if (localStorage.getItem('display') == 'list') {
            $('#list-view').trigger('click');
            $('#list-view').addClass('active');
        } else {
            $('#grid-view').trigger('click');
            $('#grid-view').addClass('active');
        }

        // Checkout
        $(document).on('keydown', '#collapse-checkout-option input[name=\'email\'], #collapse-checkout-option input[name=\'password\']', function(e) {
            if (e.keyCode == 13) {
                $('#collapse-checkout-option #button-login').trigger('click');
            }
        });

        // tooltips on hover
        $('[data-toggle=\'tooltip\']').tooltip({ container: 'body' });

        // Makes tooltips work on ajax generated content
        $(document).ajaxStop(function() {
            $('[data-toggle=\'tooltip\']').tooltip({ container: 'body' });
        });


        $('.product-grid-card .compare').click(function() {
            toggleBtnAdd(this);
        })
        $('.product-grid-card .favorite').click(function() {
            toggleBtnAdd(this);
        })

        //initialize slick sliders
        $(".banner-slider").slick({ dots: !0, infinite: !0, autoplay: !0, arrows: !1, fade: !0, speed: 1e3, prevArrow: '<i class="material-icons dandik">chevron_right</i>', nextArrow: '<i class="material-icons bamdik">chevron_left</i>', slidesToShow: 1, slidesToScroll: 1, responsive: [{ breakpoint: 1200, settings: { slidesToShow: 1, slidesToScroll: 1 } }, { breakpoint: 992, settings: { slidesToShow: 1, slidesToScroll: 1 } }, { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1, dots: !1 } }, { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: !1, dots: !1 } }] }), $(".product-feature-slider").slick({ dots: !1, infinite: !0, autoplay: !0, arrows: !0, fade: !1, speed: 1e3, prevArrow: '<i class="material-icons dandik">chevron_right</i>', nextArrow: '<i class="material-icons bamdik">chevron_left</i>', slidesToShow: 3, slidesToScroll: 1, responsive: [{ breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 3 } }, { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 2 } }, { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } }, { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: !1 } }] }), $(".inventory-feature-slider").slick({ dots: !1, infinite: !0, autoplay: !0, arrows: !0, fade: !1, speed: 1e3, prevArrow: '<i class="material-icons dandik">chevron_right</i>', nextArrow: '<i class="material-icons bamdik">chevron_left</i>', slidesToShow: 2, slidesToScroll: 1, responsive: [{ breakpoint: 1200, settings: { slidesToShow: 2, slidesToScroll: 1 } }, { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } }, { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } }, { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: !1 } }] }), $(".review-slider").slick({ dots: !1, infinite: !0, autoplay: !1, arrows: !0, fade: !1, speed: 1e3, prevArrow: '<i class="material-icons dandik">chevron_right</i>', nextArrow: '<i class="material-icons bamdik">chevron_left</i>', slidesToShow: 1, slidesToScroll: 1, responsive: [{ breakpoint: 1200, settings: { slidesToShow: 1, slidesToScroll: 1 } }, { breakpoint: 992, settings: { slidesToShow: 1, slidesToScroll: 1 } }, { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: !1 } }, { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: !1 } }] }), $(".blog-slider").slick({ dots: !1, infinite: !0, autoplay: !1, arrows: !0, fade: !1, speed: 1e3, prevArrow: '<i class="material-icons dandik">chevron_right</i>', nextArrow: '<i class="material-icons bamdik">chevron_left</i>', slidesToShow: 3, slidesToScroll: 1, responsive: [{ breakpoint: 1200, settings: { slidesToShow: 2, slidesToScroll: 2 } }, { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 2 } }, { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } }, { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: !1 } }] }), $(".product-single-slider").slick({ dots: !1, infinite: !0, autoplay: !1, arrows: !0, fade: !1, speed: 1e3, centerMode: !0, centerPadding: "250px", slidesToShow: 1, slidesToScroll: 1, prevArrow: '<i class="material-icons dandik">chevron_right</i>', nextArrow: '<i class="material-icons bamdik">chevron_left</i>', responsive: [{ breakpoint: 1200, settings: { slidesToShow: 1, slidesToScroll: 1, centerPadding: "200px" } }, { breakpoint: 992, settings: { slidesToShow: 1, slidesToScroll: 1, centerPadding: "130px" } }, { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1, centerPadding: "40px" } }, { breakpoint: 576, settings: { arrows: !1, slidesToShow: 1, slidesToScroll: 1, centerPadding: "0px", dots: !0 } }] }), $(".related-slider").slick({ dots: !1, infinite: !0, autoplay: !1, arrows: !0, fade: !1, speed: 1e3, prevArrow: '<i class="material-icons dandik">chevron_right</i>', nextArrow: '<i class="material-icons bamdik">chevron_left</i>', slidesToShow: 4, slidesToScroll: 1, responsive: [{ breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 1 } }, { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 2 } }, { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } }, { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: !1 } }] }),
            $(".price-slider").slick({ dots: !1, infinite: !0, autoplay: !1, arrows: !0, fade: !1, speed: 1e3, prevArrow: '<i class="material-icons dandik">chevron_right</i>', nextArrow: '<i class="material-icons bamdik">chevron_left</i>', slidesToShow: 2, slidesToScroll: 1, responsive: [{ breakpoint: 1200, settings: { slidesToShow: 2, slidesToScroll: 1 } }, { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } }, { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } }, { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } }] }),
            $(".product-single-slider-rtl").slick({ rtl: !0, dots: !1, infinite: !0, autoplay: !1, arrows: !0, fade: !1, speed: 1e3, centerMode: !0, centerPadding: "250px", slidesToShow: 1, slidesToScroll: 1, prevArrow: '<i class="material-icons dandik">chevron_right</i>', nextArrow: '<i class="material-icons bamdik">chevron_left</i>', responsive: [{ breakpoint: 1200, settings: { slidesToShow: 1, slidesToScroll: 1, centerPadding: "200px" } }, { breakpoint: 992, settings: { slidesToShow: 1, slidesToScroll: 1, centerPadding: "130px" } }, { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1, centerPadding: "40px" } }, { breakpoint: 576, settings: { arrows: !1, slidesToShow: 1, slidesToScroll: 1, centerPadding: "0px", dots: !0 } }] });

    }) //window.addEventListener('load',

}); //$(document).ready

// Cart add remove functions
var cart = {
    'add': function(product_id, quantity) {
        $.ajax({
            url: 'index.php?route=checkout/cart/add',
            type: 'post',
            data: 'product_id=' + product_id + '&quantity=' + (typeof(quantity) != 'undefined' ? quantity : 1),
            dataType: 'json',
            beforeSend: function() {
                $('#cart > button').button('loading');
            },
            complete: function() {
                $('#cart > button').button('reset');
            },
            success: function(json) {
                $('.alert-dismissible, .text-danger').remove();

                if (json['redirect']) {
                    location = json['redirect'];
                }

                if (json['success']) {
                    $('#content').parent().before('<div class="alert alert-success alert-dismissible"><i class="fa fa-check-circle"></i> ' + json['success'] + ' <button type="button" class="close" data-dismiss="alert">&times;</button></div>');

                    // Need to set timeout otherwise it wont update the total
                    setTimeout(function() {
                        $('#cart > button').html('<span id="cart-total"><i class="fa fa-shopping-cart"></i> ' + json['total'] + '</span>');
                    }, 100);

                    $('html, body').animate({ scrollTop: 0 }, 'slow');

                    $('#cart > ul').load('index.php?route=common/cart/info ul li');
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
    'update': function(key, quantity) {
        $.ajax({
            url: 'index.php?route=checkout/cart/edit',
            type: 'post',
            data: 'key=' + key + '&quantity=' + (typeof(quantity) != 'undefined' ? quantity : 1),
            dataType: 'json',
            beforeSend: function() {
                $('#cart > button').button('loading');
            },
            complete: function() {
                $('#cart > button').button('reset');
            },
            success: function(json) {
                // Need to set timeout otherwise it wont update the total
                setTimeout(function() {
                    $('#cart > button').html('<span id="cart-total"><i class="fa fa-shopping-cart"></i> ' + json['total'] + '</span>');
                }, 100);

                if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
                    location = 'index.php?route=checkout/cart';
                } else {
                    $('#cart > ul').load('index.php?route=common/cart/info ul li');
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
    'remove': function(key) {
        $.ajax({
            url: 'index.php?route=checkout/cart/remove',
            type: 'post',
            data: 'key=' + key,
            dataType: 'json',
            beforeSend: function() {
                $('#cart > button').button('loading');
            },
            complete: function() {
                $('#cart > button').button('reset');
            },
            success: function(json) {
                // Need to set timeout otherwise it wont update the total
                setTimeout(function() {
                    $('#cart > button').html('<span id="cart-total"><i class="fa fa-shopping-cart"></i> ' + json['total'] + '</span>');
                }, 100);

                if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
                    location = 'index.php?route=checkout/cart';
                } else {
                    $('#cart > ul').load('index.php?route=common/cart/info ul li');
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

var voucher = {
    'add': function() {

    },
    'remove': function(key) {
        $.ajax({
            url: 'index.php?route=checkout/cart/remove',
            type: 'post',
            data: 'key=' + key,
            dataType: 'json',
            beforeSend: function() {
                $('#cart > button').button('loading');
            },
            complete: function() {
                $('#cart > button').button('reset');
            },
            success: function(json) {
                // Need to set timeout otherwise it wont update the total
                setTimeout(function() {
                    $('#cart > button').html('<span id="cart-total"><i class="fa fa-shopping-cart"></i> ' + json['total'] + '</span>');
                }, 100);

                if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
                    location = 'index.php?route=checkout/cart';
                } else {
                    $('#cart > ul').load('index.php?route=common/cart/info ul li');
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

var wishlist = {
    'add': function(product_id) {
        $.ajax({
            url: 'index.php?route=account/wishlist/add',
            type: 'post',
            data: 'product_id=' + product_id,
            dataType: 'json',
            success: function(json) {
                $('.alert-dismissible').remove();

                if (json['redirect']) {
                    location = json['redirect'];
                }

                // if (json['success']) {
                // 	$('#content').parent().before('<div class="alert alert-success alert-dismissible"><i class="fa fa-check-circle"></i> ' + json['success'] + ' <button type="button" class="close" data-dismiss="alert">&times;</button></div>');
                // }

                $('#wishlist-total.nav-count').html(json['total']);
                $('#wishlist-total').attr('title', json['total']);

            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
    'remove': function() {

    }
}

var compare = {
    'add': function(product_id) {
        $.ajax({
            url: 'index.php?route=product/compare/add',
            type: 'post',
            data: 'product_id=' + product_id,
            dataType: 'json',
            success: function(json) {
                $('.alert-dismissible').remove();

                if (json['success']) {
                    // $('#content').parent().before('<div class="alert alert-success alert-dismissible"><i class="fa fa-check-circle"></i> ' + json['success'] + ' <button type="button" class="close" data-dismiss="alert">&times;</button></div>');

                    $('#compare-total.nav-count').html(json['total']);

                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
    'remove': function() {

    }
}

/* Agree to Terms */
$(document).delegate('.agree', 'click', function(e) {
    e.preventDefault();

    $('#modal-agree').remove();

    var element = this;

    $.ajax({
        url: $(element).attr('href'),
        type: 'get',
        dataType: 'html',
        success: function(data) {
            html = '<div id="modal-agree" class="modal">';
            html += '  <div class="modal-dialog">';
            html += '    <div class="modal-content">';
            html += '      <div class="modal-header">';
            html += '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
            html += '        <h4 class="modal-title">' + $(element).text() + '</h4>';
            html += '      </div>';
            html += '      <div class="modal-body">' + data + '</div>';
            html += '    </div>';
            html += '  </div>';
            html += '</div>';

            $('body').append(html);

            $('#modal-agree').modal('show');
        }
    });
});

// Autocomplete */
(function($) {
    $.fn.autocomplete = function(option) {
        return this.each(function() {
            this.timer = null;
            this.items = new Array();

            $.extend(this, option);

            $(this).attr('autocomplete', 'off');

            // Focus
            $(this).on('focus', function() {
                this.request();
            });

            // Blur
            $(this).on('blur', function() {
                setTimeout(function(object) {
                    object.hide();
                }, 200, this);
            });

            // Keydown
            $(this).on('keydown', function(event) {
                switch (event.keyCode) {
                    case 27: // escape
                        this.hide();
                        break;
                    default:
                        this.request();
                        break;
                }
            });

            // Click
            this.click = function(event) {
                event.preventDefault();

                value = $(event.target).parent().attr('data-value');

                if (value && this.items[value]) {
                    this.select(this.items[value]);
                }
            }

            // Show
            this.show = function() {
                var pos = $(this).position();

                $(this).siblings('ul.dropdown-menu').css({
                    top: pos.top + $(this).outerHeight(),
                    left: pos.left
                });

                $(this).siblings('ul.dropdown-menu').show();
            }

            // Hide
            this.hide = function() {
                $(this).siblings('ul.dropdown-menu').hide();
            }

            // Request
            this.request = function() {
                clearTimeout(this.timer);

                this.timer = setTimeout(function(object) {
                    object.source($(object).val(), $.proxy(object.response, object));
                }, 200, this);
            }

            // Response
            this.response = function(json) {
                html = '';

                if (json.length) {
                    for (i = 0; i < json.length; i++) {
                        this.items[json[i]['value']] = json[i];
                    }

                    for (i = 0; i < json.length; i++) {
                        if (!json[i]['category']) {
                            html += '<li data-value="' + json[i]['value'] + '"><a href="#">' + json[i]['label'] + '</a></li>';
                        }
                    }

                    // Get all the ones with a categories
                    var category = new Array();

                    for (i = 0; i < json.length; i++) {
                        if (json[i]['category']) {
                            if (!category[json[i]['category']]) {
                                category[json[i]['category']] = new Array();
                                category[json[i]['category']]['name'] = json[i]['category'];
                                category[json[i]['category']]['item'] = new Array();
                            }

                            category[json[i]['category']]['item'].push(json[i]);
                        }
                    }

                    for (i in category) {
                        html += '<li class="dropdown-header">' + category[i]['name'] + '</li>';

                        for (j = 0; j < category[i]['item'].length; j++) {
                            html += '<li data-value="' + category[i]['item'][j]['value'] + '"><a href="#">&nbsp;&nbsp;&nbsp;' + category[i]['item'][j]['label'] + '</a></li>';
                        }
                    }
                }

                if (html) {
                    this.show();
                } else {
                    this.hide();
                }

                $(this).siblings('ul.dropdown-menu').html(html);
            }

            $(this).after('<ul class="dropdown-menu"></ul>');
            $(this).siblings('ul.dropdown-menu').delegate('a', 'click', $.proxy(this.click, this));

        });
    }
})(window.jQuery);