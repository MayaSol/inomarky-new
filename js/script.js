$(document).ready(function() {

    /*Выпадашка с городами*/
    getAllCities();
    setCity();

    var cityItems = document.querySelectorAll('.city-select__item');
    for (i=0; i<cityItems.length; i++) {
        cityItems[i].addEventListener('click', function(event) {
            event.preventDefault();
            if (this.dataset && this.dataset.city && this.dataset.city != "") {
                changeCity(this.dataset.city);
            }
        })
    }

    /*Выбор марки и модели*/
    const selectMark = document.getElementById('form-select--mark');
    changeMark(selectMark);
    selectMark.addEventListener('change',function(event) {
        changeMark(this);
    });

});


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
    var cityOpts = document.querySelector('.city-select').querySelectorAll('.city-select__item');
    for (i=0; i<cityOpts.length; i++) {
        ALL_CITIES[cityOpts[i].dataset.city] = cityOpts[i].innerText;
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
            setCookie('city',cityActive);
        }
    }

    for (var i=0; i<citySwitchers.length; i++) {

        cityEl = citySwitchers[i].querySelector('span[data-city]');
        cityEl.textContent = ALL_CITIES[cityActive];

        var items = citySwitchers[i].querySelectorAll('.city-select__item');
        for (var j=0; j<items.length; j++) {
            if (items[j].dataset.city === cityActive) {
                phoneActive = items[j].dataset.phone;
                if (!items[j].classList.contains('city-select__item--active')) {
                    items[j].classList.add('city-select__item--active')
                }
            }
            else {
                items[j].classList.remove('city-select__item--active');
            }
        }

        citySwitchers[i].querySelector('.city-call-phone').textContent = phoneActive;

    }
}

function changeCity(code) {
    setCookie('city',code);
    setCity();
}

/*Выбор марки и модели*/
const modelOpts = document.querySelectorAll('#form-select--model option');
const selectModel = document.getElementById('form-select--model');

function changeMark(markEl) {
        if (markEl.value === "$") {
            selectModel.setAttribute('disabled','true');
            return;
        }
        else {
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
                }
                else {
                    option.classList.remove('hidden');
                }
            }
        }
    };

