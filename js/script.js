$(document).ready(function() {

    /*Выпадашка с городами*/
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

    /*Выбор марки и модели*/
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
            // $([document.documentElement, document.body]).animate(
            // {
            //     scrollTop: $(collapseSelector).offset().top - $('.header-part').outerHeight() - 50,
            // },200,
            // function() {
            //     collpaseInstance.hide();
            // });
        }
    });

}); //$(document).ready


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

/*Выпадашка с городами*/
var ALL_CITIES = {};

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

/*Выбор марки и модели*/
const modelOpts = document.querySelectorAll('#form-select--model option');
const selectModel = document.getElementById('form-select--model');

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