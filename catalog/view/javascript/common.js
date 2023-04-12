$(document).ready(function() {

	var scriptUtils = document.querySelector('#utils');

    if (scriptUtils) {
        var body= document.getElementsByTagName('body')[0];
        var script= document.createElement('script');
        script.type= 'text/javascript';
        script.src = scriptUtils.getAttribute('delay');

        script.addEventListener('load',function(e) {
            initDocument();
        });

       body.appendChild(script);
    }
    else {
        initDocument();
    }


    //Отложенная загрузка скриптов
    console.log($(".price-slider").slick);

	scrollToggle({ selectData: ".header-part", toggleData: "sticky", scrollDigit: "0" }), scrollToggle({ selectData: ".product-single-scrollspy-btns", toggleData: "fixed", scrollDigit: "1150" }), sidebarLayout(), dotsAction(".comment-action-btn"), dotsAction(".review-action-btn"), document.querySelector(".header-search").lastElementChild.addEventListener("click", (e => { "tune" !== e.target.textContent ? (e.target.offsetParent.classList.remove("active"), e.target.textContent = "tune") : (e.target.offsetParent.classList.add("active"), e.target.textContent = "close") })), document.querySelector(".responsive-srch").addEventListener("click", (e => { const t = document.querySelector(".header-form"); "search" !== e.target.textContent ? (t.style.display = "none", e.target.textContent = "search") : (t.style.display = "block", e.target.textContent = "close") })), selection(".create-price-card"), selection(".create-pay-card"), cancelValue(), slickSliderDotsString();
	accordion(".accordion-item", !1);


	/*Выпадашка с городами*/
	var ALL_CITIES = {};

    try {
        getAllCities();
        setCity();

        var cityItems = document.querySelectorAll('.city-select__item');
        for (i = 0; i < cityItems.length; i++) {
            cityItems[i].addEventListener('click', function(event) {
                event.preventDefault();
                if (this.dataset && this.dataset.city && this.dataset.city != "") {
                    changeCity(this.dataset.city);
                }
            })
        }
    } catch (e) {
        console.log('Ошибка (выбор города): ' + e.name + ":" + e.message + "\n" + e.stack);
    }

	function getAllCities() {
	    var citySelect = document.querySelector('.city-select');
	    if (citySelect) {
	        var cityOpts = citySelect.querySelectorAll('.city-select__item');
	        for (i = 0; i < cityOpts.length; i++) {
	            ALL_CITIES[cityOpts[i].dataset.city] = cityOpts[i].innerText;
	        }
	    }
	}

	function setCity() {
	    var citySwitchers = document.querySelectorAll('.city-switcher-wrapper');
	    var cityEl;
	    var phoneActive;

	    if (citySwitchers.length > 0) {
	        var cityActive = getCookie('city');

	        if ((typeof cityActive === 'undefined') || (cityActive == "") || (cityActive == "undefined")) {
	            cityActive = Object.keys(ALL_CITIES)[0];
	            setCookie('city', cityActive);
	        }
	    }

	    for (var i = 0; i < citySwitchers.length; i++) {

	        cityEl = citySwitchers[i].querySelector('div[data-city]');
	        cityEl.textContent = ALL_CITIES[cityActive];

	        var items = citySwitchers[i].querySelectorAll('.city-select__item');
	        for (var j = 0; j < items.length; j++) {
	            if (items[j].dataset.city === cityActive) {
	                phoneActive = items[j].dataset.phone;
	                if (!items[j].classList.contains('city-select__item--active')) {
	                    items[j].classList.add('city-select__item--active')
	                }
	            } else {
	                items[j].classList.remove('city-select__item--active');
	            }
	        }

	        citySwitchers[i].querySelector('.city-call-phone').textContent = phoneActive;

	    }
	}

	function changeCity(code) {
	    setCookie('city', code);
	    setCity();
	}

    //  Слайдер
    if (document.documentElement.clientWidth <= 768) {
        var slider = document.querySelector('.breadcrumb');
        console.log('breadcrumb slider: ');
        console.log(slider);
        console.log(slider.offsetLeft);
        if (slider) {
            let lastElement = slider.querySelector('li:last-child');
            let sliderWidth = lastElement.offsetLeft + lastElement.offsetWidth;
            slider.style.width = sliderWidth + "px";
            let minTransform = document.documentElement.clientWidth - sliderWidth - 20;
            let isDown = false;
            let startX;
            let scrollLeft;
            let sliderShift = 0;
            let translateX = 0;

            slider.addEventListener('mousedown', (e) => {
                Down(e);
            });
            slider.addEventListener('mouseleave', () => {
              // isDown = false;
              // slider.classList.remove('active');
            });
            document.addEventListener('mouseup', (e) => {
                Up(e);
            });
            document.addEventListener('mousemove', (e) => {
                Move(e);
            });


            slider.addEventListener('touchstart', (e) => {
                Down(e);
            })
            slider.addEventListener('touchend', (e) => {
                Up(e);
            })
            slider.addEventListener('touchmove', (e) => {
                Move(e);
            })

            slider.addEventListener('transitionend',function(e) {
                e.target.style.transition = '';
            });

            let linkTouchStatus = 0;
            // 1 - target - клик был по элемену с тегом 'A', перетаскивания не было
            // 0 - target - клик был по элменту с тегом отличным от 'A' или после клика по тегу 'A' было перетаскивания
            let touchTarget;
            //  Если было нажатие на тег 'a', сохраняет элемент
            let moveSum = 0;
            // 

            function Down(e) {
                console.log('Down: ' + e.target.tagName);
                if (e.target.tagName == 'A') {
                    linkTouchStatus = 1;
                    touchTarget = e.target;
                }
                else {
                    linkTouchStatus = 0;
                }
                console.log('linkTouchStatus = ' + linkTouchStatus);
                e.preventDefault();
                isDown = true;
                slider.classList.add('active');
                // console.log('mousedown: ' + e.pageX);
                // console.log('slider.offsetLeft: ' + slider.offsetLeft);
                startX = e.pageX ? e.pageX : e.targetTouches[0].pageX; //точка клика относительно начала блока, transform не влияет на offsetLeft
                // console.log('startX = ' + startX);
            }


            function Up(e) {
                console.log('Up: linkTouchStatus = ' + linkTouchStatus);
              isDown = false;
              slider.classList.remove('active');
              e.preventDefault();
              console.log('UP 1: moveSum = ' + moveSum);
              moveSum = (moveSum < 0) ? -moveSum : moveSum;
              console.log('UP 2: moveSum = ' + moveSum);
              console.log(linkTouchStatus == 1 && moveSum < 5);
              if (linkTouchStatus == 1 && moveSum < 5) {
                linkTouchStatus = 0;
                window.location.href = touchTarget.href;
              }
              console.log('Up: moveSum = ' + moveSum);
              moveSum = 0;
              if (translateX > 0) {
                slider.style.transition = 'transform 1s ease';
                translateX = 0;
                slider.style.transform = 'translateX(' + translateX + 'px)'; 
                // console.log('slider.style: ' + JSON.stringify(slider.style));
                // console.log('slider.style.transition' + JSON.stringify(slider.style.transition));
              }
              if (translateX < minTransform) {
                slider.style.transition = 'transform 1s ease';
                translateX = minTransform;
                slider.style.transform = 'translateX(' + translateX + 'px)'; 
              }
              sliderShift = translateX;
            }


            function Move(e) {
                console.log('Move: linkTouchStatus = ' + linkTouchStatus);
              console.log(e);
              if(!isDown) return;
              // if (linkTouchStatus == 1) {
              //   linkTouchStatus = 0;
              // }
              e.preventDefault();
              moveStatus = 2;
              let x = e.pageX ? e.pageX : e.targetTouches[0].pageX; //текущая точка относительно начала блока
              let walk = (x - startX); // относительное смещение если вправо +, влево -
              translateX = sliderShift + walk;
              moveSum = moveSum + e.movementX;
              // console.log('walk: ' + walk);
              // console.log('sliderShift: ' + sliderShift);
              // console.log('translateX: ' + translateX);
              slider.style.transform = 'translateX(' + translateX + 'px)'; 
              console.log('Move: e.movementX = ' + e.movementX);
              console.log('Move: moveSum = ' + moveSum);
            }
        }
    }

	/*Выбор марки и модели*/
	const modelOpts = document.querySelectorAll('#form-select--model option');
	const selectModel = document.getElementById('form-select--model');

    try {
        const selectMark = document.getElementById('form-select--mark');
        if (selectMark) {
            changeMark(selectMark);
            selectMark.addEventListener('change', function(event) {
                changeMark(this);
            });
        }
    } catch (e) {
        console.log('Ошибка (Выбор марки и модели): ' + e.name + ":" + e.message + "\n" + e.stack);
    }

	function changeMark(markEl) {
	    if (markEl.value === "$") {
	        selectModel.setAttribute('disabled', 'true');
	        return;
	    } else {
	        selectModel.removeAttribute('disabled');
	    }
	    var regexp = new RegExp(`,+${markEl.value || '.?'},+`);
	    for (option of modelOpts) {
	        var data = option.dataset;
	        if (!(typeof data === 'undefined') && !(typeof data.mark === 'undefined') && data.mark) {
	            if (!regexp.test(`,${data.mark},`)) {
	                if (!option.classList.contains('hidden')) {
	                    option.classList.add('hidden');
	                }
	            } else {
	                option.classList.remove('hidden');
	            }
	        }
	    }
	};

	/*Фильтры марки и модели*/
	function toggleModels(brand, modelBoxSelector, show = true) {
	    $(modelBoxSelector + ' [data-brand="'+brand+'"]').each(function(index) {
	        if (show) {
	            $(this).addClass('active');
	        }
	        else {
	            $(this).removeClass('active');
	            $(this).find('input:checked').prop('checked',false);
	        }
	    })
	    anyBrandChecked('#filterBrands','#filterModels');
	}

	function anyBrandChecked(parentBrands, parentModels) {
	    let checked = $(parentBrands + ' input:checked');
	    if (checked.length > 0) {
	        $(parentModels).removeClass('inactive');
	    }
	    else {
	        $(parentModels).addClass('inactive');
	    }

	}

    /*Ленивая загрузка изобраений слайдера banner-slider*/
    // var bannerSlideFirst = document.querySelector('.banner-slider > div:first-child');
    // console.log(bannerSlideFirst);
        // bannerSlideFirst.style.backgroundImage = 'url(' + bannerSlideFirst.getAttribute('data-bg') + ')';
    $('.banner-slider').on('afterChange', function(event, slick, currentSlide){
        console.log('afterChange');
        console.log(slick['$slides'][currentSlide].style.backgroundImage);
        if (!slick['$slides'][currentSlide].style.backgroundImage.length > 0) {
            slick['$slides'][currentSlide].style.backgroundImage = 'url(' + slick['$slides'][currentSlide].getAttribute('data-bg') + ')';
        }
     });
    // for (slide of bannerSlides) {
    //     slide.addEventListener('lazybeforeunveil', function(e){
    //         console.log('lazybeforeunveil');
    //         console.log(e.target);
    //         var bg = e.target.getAttribute('data-bg');
    //         if(bg){
    //             e.target.style.backgroundImage = 'url(' + bg + ')';
    //         }
    //     });
    // }


	/*Кнопки скрытия-раскрытия текста*/
	const ATR_OPEN_BTN = 'data-open-text';

	function hideOpenBtns() {
	    var btns = document.querySelectorAll('*[' + ATR_OPEN_BTN + ']');
	    for (btn of btns) {
	        btn.addEventListener('click', function(event) {
	            event.preventDefault();
	            var openBtn = this;
	            var data = openBtn.dataset;
	            var targetId = data && data.openText;
	            var targetEl = targetId && document.querySelector(targetId);
	            if (targetEl) {
	                targetEl.style.cssText = "position: static;"
	                var closeBtnId = data && data.closeBtn;
	                var closeBtnEl = closeBtnId && document.querySelector(closeBtnId);
	                if (closeBtnEl) {
	                    openBtn.style.cssText="display:none";
	                    closeBtnEl.style.cssText="display:block";
	                    closeBtnEl.addEventListener('click', function(event) {
	                        targetEl.style.cssText = "position: absolute;"
	                        this.style.cssText = "display:none";
	                        openBtn.style.cssText = "display:block";
	                    })
	                }
	            }
	        });
	    }
	}

    /*Кнопки скрытия-раскрытия текста*/
    hideOpenBtns();

    /*Карта*/
    try {
        buildMap();
    }
    catch(e) {
        console.log('Ошибка (Карта): ' + e.name + ":" + e.message);
        console.log(e.stack);
    }

    /*Фильтры марки и модели*/
    try {
        anyBrandChecked('#filterBrands','#filterModels');
        $('#filterBrands input[type="checkbox"').each(function() {
            toggleModels($(this).attr('id'),'#filterModels', this.checked);
        })
        $('#filterBrands input[type="checkbox"').click(function(event) {
            toggleModels($(this).attr('id'),'#filterModels', this.checked);
        })
    }
    catch(e) {
        console.log('Ошибка (Фильтр марки и модели): ' + e.name + ":" + e.message + "\n" + e.stack);
    }


    $('[data-open="#inventoryAside"]').on('click', function(event) {
        var collapseSelector = $(this).data('open');
        var collapseElement = $(collapseSelector);
        var collpaseInstance = bootstrap.Collapse.getOrCreateInstance(collapseElement);

        if (!collapseElement.hasClass('show')) {
            collpaseInstance.show();
        }
        else {
            collpaseInstance.hide();
        }
    });

}); //$(document).ready


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

function scrollToggle(e){const{selectData:t,toggleData:c,scrollDigit:l}=e;window.addEventListener("scroll",(function(){const e=document.querySelector(t);window.pageYOffset>l?e?.classList.add(c):e?.classList.remove(c)}))}function clickToggle(e){const{selectData:t,toggleData:c}=e,l=document.querySelectorAll(t);for(let e=0;e<l.length;e++)l[e].addEventListener("click",(function(){l[e].className.includes(c)?l[e].classList.remove(c):l[e].classList.add(c)}))}function sidebarLayout(){const e=document.querySelector(".sidebar-part"),t=document.querySelector(".sidebar-open"),c=document.querySelector(".sidebar-close"),l=document.querySelector(".backdrop"),n=document.querySelector("body");t.addEventListener("click",(function(){e.classList.add("open"),l.classList.add("active"),n.style.overflowY="hidden"})),c.addEventListener("click",(function(){e.classList.remove("open"),l.classList.remove("active"),n.style.overflowY="scroll"})),l.addEventListener("click",(function(){e.classList.remove("open"),l.classList.remove("active"),n.style.overflowY="scroll"}))}function dotsAction(e){const t=document.querySelectorAll(e);for(let e=0;e<t.length;e++)t[e].addEventListener("click",(function(){const c=t[e].firstElementChild,l=t[e].nextElementSibling;"close"==c.textContent?(t[e].classList.remove("active"),l.classList.remove("show"),c.innerText="more_vert"):(t[e].classList.add("active"),l.classList.add("show"),c.innerText="close")}))}function selection(e){let t=document.querySelectorAll(e);for(let e=0;e<t.length;e++)t[e].addEventListener("click",(()=>{t.forEach((e=>e.classList.remove("active"))),t[e].classList.add("active")}))}function cancelValue(){document.querySelectorAll(".file-cancel").forEach((e=>{e.parentElement.querySelector(".file-input").addEventListener("change",(function(t){e.parentElement.querySelector(".file-cancel").style.display="block"})),e.addEventListener("click",(function(e){e.target.parentElement.querySelector(".file-input").value="",e.target.parentElement.querySelector(".file-cancel").style.display="none"}))}))}function slickSliderDotsString(){const e=document.querySelectorAll(".slick-dots li");Array.from(e).map(((e,t)=>{const c=t+1;e.children[0].textContent="0"+c}))}

function accordion(e, t) { 
	const l = document.querySelectorAll(e); 
	if (t) { 
		const e = l[0].lastElementChild;
        e.style.height = e.scrollHeight + "px" } for (let e = 0; e < l.length; e++) l[e].firstElementChild.addEventListener("click", (() => { const t = l[e].lastElementChild,
            i = l[e].parentElement.children,
            s = Array.from(i).indexOf(l[e]); if (parseInt(t.style.height) !== t.scrollHeight) { for (let e = 0; e < i.length; e++) e !== s && (l[e].classList.remove("active"), l[e].lastElementChild.style.height = "0px");
            l[e].classList.add("active"), t.style.height = t.scrollHeight + "px" } else l[e].classList.remove("active"), t.style.height = "0px" })) 
} 


function flyToElement(flyer, flyingTo) {
    console.log('flyToElement; flyer: ' + flyer);
    var $func = $(this);
    var divider = $(flyer).width() / $(flyingTo).width();
    var flyerClone = $(flyer).clone();
    console.log($(flyer));
    console.log($(flyer).offset());
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



/*Работа с cookies*/
function setCookie(name, value, options) {
    if (typeof options === 'undefined') {
        options = {};
    }

    var options = {
        ...options,
        path: '/',
    };


    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);


    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue + ';';
        }
    }

    document.cookie = updatedCookie;
}


function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    var result;
    if (matches) {
        result = decodeURIComponent(matches[1]);
    }
    return result;
}


function buildMap() {
    var maps = document.getElementsByClassName('map');
    if (maps.length == 0) {
        return;
    }
    var myMaps = [];
    ymaps.ready(function() {
        for (var i = 0; i < maps.length; i++) {
            var center = maps[i].dataset.center.split(',');
            if (!center) {
                return;
            }
            myMaps[i] = new ymaps.Map(maps[i], {
                    center: [center[0], center[1]],
                    zoom: 10
                }, {
                    searchControlProvider: 'yandex#search'
                }),

                // Создаём макет содержимого.
                MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
                    '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
                ),


                myPlacemark = new ymaps.Placemark(myMaps[i].getCenter(), {
                    // hintContent: 'Собственный значок метки',
                    // balloonContent: 'Это красивая метка'
                }, {
                    // Опции.
                    // Необходимо указать данный тип макета.
                    iconLayout: 'default#image',
                    // Своё изображение иконки метки.
                    iconImageHref: 'images/myIcon.gif',
                    // Размеры метки.
                    iconImageSize: [30, 42],
                    // Смещение левого верхнего угла иконки относительно
                    // её "ножки" (точки привязки).
                    iconImageOffset: [-5, -38]
                })


            myMaps[i].geoObjects
                .add(myPlacemark);
        }

    });

}

//После загрзуки скриптов вполняем js
function initDocument()  {
	console.log('initDocument');
    console.log('scriptloadingtest 2');
    console.log($(".price-slider").slick);
    // Highlight any found errors


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

        // alert(value);

        var mark = parseInt($('header #search #form-select--mark').val());
        var model = $('header #search #form-select--model').val();

        var price_min = parseInt($('header #search input[name=\'bfp_price_min\']').val());
        var price_max = parseInt($('header #search input[name=\'bfp_price_max\']').val());

        var year_min = parseInt($('header #search input[name=\'bfp_year_min\']').val());
        var year_max = parseInt($('header #search input[name=\'bfp_year_max\']').val());

        // alert(model);

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

	//dropdown menu
	let navItem = document.getElementsByClassName("nav-item"),
	    navLink = document.getElementsByClassName("nav-link"),
	    dropList = document.getElementsByClassName("drop-list");
	const openDwopDown = () => { for (let e = 0; e < navItem.length; e++)
	            if (null != navItem[e].querySelector("ul")) { let t = navItem[e].querySelector("ul");
	                navItem[e].addEventListener("click", (() => { let l = parseInt(t.style.height),
	                        s = t.scrollHeight;
	                    closeAllDropDown(), removeAllActiveClass(), l != s ? (t.style.height = t.scrollHeight + "px", navItem[e].classList.add("dropdown")) : (t.style.height = "0px", navItem[e].classList.remove("dropdown")) })) } },
	    removeAllActiveClass = () => { for (let e = 0; e < navItem.length; e++) navItem[e].classList.remove("dropdown") },
	    closeAllDropDown = () => { for (let e = 0; e < dropList.length; e++) dropList[e].style.height = "0px" };
	openDwopDown();

	//select-data
	document.querySelectorAll(".select-data").forEach((e => { 
	e.addEventListener("click", (function() { 
		let t = document.querySelector(".option-list"),
            l = parseInt(t.style.height),
            n = t.scrollHeight;
        l != n ? (this.nextElementSibling.style.height = n + "px", e.parentElement.classList.add("selected")) : (this.nextElementSibling.style.height = "0px", e.parentElement.classList.remove("selected")) })) })), 
	document.querySelectorAll(".option-item").forEach((e => { 
		e.addEventListener("click", (function() { 
			let t = document.querySelector(".select-image"),
	            l = document.querySelector(".select-text"),
	            n = e.firstElementChild.children[0].getAttribute("src"),
	            i = e.firstElementChild.children[1].textContent,
	            c = t.getAttribute("src") !== n,
	            r = l.textContent !== i;
	        c && r && (t.setAttribute("src", n), l.textContent = i) })) }));


} //initDocument



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