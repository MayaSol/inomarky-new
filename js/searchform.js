class RangeSlider {
    // методы класса
    constructor(element, config) {
        if (!element) {
            return;
        }
        this._config = config;
        this._element = element;
        this._sliderEl = element;
        this._instance = this._init();
        this._inputAddListeners(this._elementFrom);
        this._inputAddListeners(this._elementTo);
    }

    _init() {
        var sliderInstance = noUiSlider.create(this._sliderEl, this._config);

        this._elementFrom = $(this._element).closest('.product-widget').find('.range-input--from')[0];
        this._elementTo = $(this._element).closest('.product-widget').find('.range-input--to')[0];
        this._inputFrom = this._elementFrom.querySelector('input');
        this._inputTo = this._elementTo.querySelector('input');


        //Добавить блоки для отформатированных значений
        function addFormatted(element) {
            var formatted = document.createElement('div');
            formatted.classList.add('formatted-value');
            formatted.innerText = 'TEST';
            element.append(formatted);
            return formatted;
        }

        this._elementFromFormatted = addFormatted(this._elementFrom);
        this._elementToFormatted = addFormatted(this._elementTo);

        sliderInstance.on('update', (values, handle, unencoded, tap, positions, noUiSlider) => { this._onUpdateSlider(values, handle) });

        return sliderInstance;
    } //_init

    _inputAddListeners(element) {
        var max = this._config.range.max;
        var min = this._config.range.min;
        var updateFormattedValue = () => { this._updateFormattedValue };
        var instance = this._instance;
        var input = element.querySelector('input');
        var formattedEl;
        if (element.classList.contains(this._config.selectorFrom)) {
            formattedEl = this._elementFromFormatted;
        } else {
            formattedEl = this._elementToFormatted;
        }
        input.addEventListener('click', function() {
            event.preventDefault();
            element.classList.add('focused');
            this.focus();
        })
        input.addEventListener('blur', function(event) {
            element.classList.remove('focused');
        })
        input.addEventListener('change', function(event) {
            if (max && +this.value > max) {
                this.value = max;
            }
            if (min && +this.value < min) {
                this.value = min;
            }
            if (this.classList.contains('bf-range-min')) {
                instance.set([this.value, null]);
            } else {
                instance.set([null, this.value]);
            }
            updateFormattedValue(formattedEl, this);
        })
        input.addEventListener('input', function(event) {})
        input.addEventListener('keyup', function(event) {
            const regExp = new RegExp('^[0-9]*$', 'gi');
            const result = regExp.test(this.value);
            if (!result) {
                this.value = this.value.slice(0, this.value.length - 1);
            }
        })
    }


    _updateFormattedValue(formattedEl, inputEl) {
        if (this._config.placeholder && +inputEl.value == this._config.range.min) {
            formattedEl.textContent = this._config.placeholder.min;
            return;
        }
        if (this._config.placeholder && +inputEl.value == this._config.range.max) {
            formattedEl.textContent = this._config.placeholder.max;
            return;
        }
        if (this._config.noFormat) {
            formattedEl.textContent = parseInt(inputEl.value);
        } else {
            formattedEl.textContent = new Intl.NumberFormat('ru-RU').format(parseInt(inputEl.value));
        }
    }

    _onUpdateSlider(values, handle) {
        var input;
        var formattedEl;
        if (handle == 0) {
            input = this._inputFrom;
            formattedEl = this._elementFromFormatted;
        } else {
            input = this._inputTo;
            formattedEl = this._elementToFormatted;
        }
        var value = values[handle];
        input.value = parseInt(value).toString();
        this._updateFormattedValue(formattedEl, input);
    }
}


$(document).ready(function() {

    var brandsSelected = [];

    var inputs = document.querySelectorAll('[data-options]');
    for (input of inputs) {
        input.addEventListener('click', function(e) {
            if (e.target.tagName == 'INPUT' && e.target.type != "checkbox") {
                e.preventDefault();
                var optionsName = this.dataset && this.dataset.options;
                if (optionsName) {
                    var optionsListsAll = document.querySelectorAll('[data-options-list]');
                    for (list of optionsListsAll) {
                        $(list).hide();
                    }
                    var optionsList = document.querySelector(`[data-options-list=${optionsName}]`);
                    $(optionsList).show();
                }
            }
        })
    }

    document.addEventListener('click', function(e) {
        var lists = document.querySelectorAll('[data-options-list]');
        var parent = $(e.target).closest('[data-options]');
        if (parent.length > 0) return;
        parent = $(e.target).closest('[data-options-list]')
        if (parent.length > 0) return;

        if (e.target.dataset && (e.target.dataset.options || e.target.dataset.optionsList)) {
            return;
        }
        $(lists).hide();
    })


    var widgetBrand = document.querySelector('.search-auto-form .form-group--brand');
    var brandsChecked = document.querySelectorAll('.form-group--brand input[type=checkbox]:checked');
    for (brand of brandsChecked) {
        var item = {};
        item.id = brand.id;
        var lbl = document.querySelector('label[for=' + brand.id + ']');
        item.name = lbl.innerText;
        brandsSelected.push(item);
    }

    var brandItemTemplate = document.getElementById('brandsSelectedItem');
    var brandItemList = document.querySelector('.brands-selected');

    if (brandsSelected.length > 0) {
        for (brand of brandsSelected) {
            brandsListAdd(brand);
        }
    }

    setLegend();

    function brandsListAdd(brand) {
        if (!brandItemTemplate || !brandItemList) return;
        var itemHtml = brandItemTemplate.content.cloneNode(true);
        itemHtml.children[0].dataset.id = brand.id;
        itemHtml.querySelector('.brands-selected__name').innerText = brand.name;
        brandItemList.appendChild(itemHtml);
        setLegend();
    }

    function brandsListRemove(id) {
        if (!brandItemList) return;
        var el = brandItemList.querySelector('li[data-id=' + id + ']');
        if (el) {
            el.remove();
        }
        var checkbox = document.getElementById(id);
        checkbox.checked = false;
        checkbox.dispatchEvent(new Event('click',{ bubbles: true }));
        setLegend();
    }

    function setLegend() {
        var brandsChecked = document.querySelectorAll('.form-group--brand input[type=checkbox]:checked');
        var legend = document.querySelector('.product-widget-legend');
        if (brandsChecked.length > 0) {
            var legendVal = legend.querySelector('.product-widget-legend__value');
            legendVal.innerText = brandsChecked.length;
            $(legend).show();
        }
        else {
            $(legend).hide();
        }
    }

    widgetBrand.addEventListener('change', function(e) {
        if (e.target.type == 'checkbox') {
            var lbl = document.querySelector('label[for=' + e.target.id + ']');
            if (e.target.checked) {
                var brand = {};
                brand.id = e.target.id;
                brand.name = lbl.innerText;
                brandsSelected.push(brand);
                brandsListAdd(brand);
            }
            else {
                var id = brandsSelected.findIndex(brand => brand.id == e.target.id);
                var deleted = brandsSelected.splice(id,1);
                brandsListRemove(deleted[0].id);
            }
        }
    })

    if (brandItemList) {
        brandItemList.addEventListener('click', function(e) {
            if (e.target.classList.contains('brands-selected__delete')) {
                e.preventDefault();
                var parent = $(e.target).closest('.brands-selected__item');
                if (parent.length > 0 && parent[0].dataset && parent[0].dataset.id) {
                    brandsListRemove(parent[0].dataset.id);
                }
            }
        })
    }


    function refresh(e) {
        e.preventDefault();
        var brandsChecked = document.querySelectorAll('.form-group--brand input[type=checkbox]:checked');
        for (brand of brandsChecked) {
            brandsListRemove(brand.id);
        }
    }

    var refreshBtn = document.querySelector('.search-auto-form__refresh');
    var legendBtn = document.querySelector('.product-widget-legend__delete');
    

    refreshBtn.addEventListener('click', (e) => refresh(e));
    legendBtn.addEventListener('click', (e) => refresh(e))



    var sliderPriceEl = document.getElementById('slider-price');
    var sliderPrice = new RangeSlider(sliderPriceEl, {
        start: [+sliderPriceEl.dataset.min, +sliderPriceEl.dataset.max],
        connect: true,
        step: 10000,
        range: {
            'min': +sliderPriceEl.dataset.min,
            'max': +sliderPriceEl.dataset.max
        },
        placeholder: {
            'min': 'Цена от',
            'max': 'Цена до'
        }
    });

    var sliderYearEl = document.getElementById('slider-year');
    var sliderYear = new RangeSlider(sliderYearEl, {
        start: [+sliderYearEl.dataset.min, +sliderYearEl.dataset.max],
        connect: true,
        step: 1,
        range: {
            'min': +sliderYearEl.dataset.min,
            'max': +sliderYearEl.dataset.max
        },
        placeholder: {
            'min': 'Год от',
            'max': 'Год до'
        },
        noFormat: true
    });

    var sliderMileEl = document.getElementById('slider-mileage');
    var sliderMile = new RangeSlider(sliderMileEl, {
        start: [+sliderMileEl.dataset.min, +sliderMileEl.dataset.max],
        connect: true,
        step: 1000,
        range: {
            'min': +sliderMileEl.dataset.min,
            'max': +sliderMileEl.dataset.max
        },
        placeholder: {
            'min': 'Пробег от',
            'max': 'Пробег до'
        },
    });

});