
function Products(productList) {
    this.productList = productList;
    this.productAreaSelector = '.main';
    this.template = '<div class="work"><div class="picture"><img src="{img}"></div><p class="mainCity">{city}</p>' +
        '<div class="description"><h4>{description}</h4><p class="mainCategories">{categories}</p>' +
        '<p id="price" class="mainPrice">{price}</p></div></div>';

    this.onShow = function () {
        var area = $(this.productAreaSelector)[0];
        area.innerHTML = '';

        for (var i = 0; i < this.productList.length; i++) {
            if (!this.productList[i].isVisible) {
                continue;
            }
            area.innerHTML += this.generateHtml(this.productList[i]);
        }
    };

    this.generateHtml = function (product) {
        var result = this.template;

        for (var key in product) {
            result = replaceAll(result, '{' + key + '}', product[key]);
        }
        return result;
    };

    this.onFilter = function (filterData) {
        for (var i = 0; i < productList.length; i++) {
            productList[i].isVisible = this.isEqual(productList[i], filterData) && this.isInArray(productList[i], filterData) && this.isBetween(productList[i], filterData);
        }
    };

    this.isEqual = function (product, filterData) {
        if (filterData.city === undefined) {
            return true;
        }
        return product.city == filterData.city;
    };

    this.isInArray = function (product, filterData) {
        if (!filterData.categories.length) {
            return true;
        }
        return (filterData.categories.indexOf(product.categories)) !== -1;
    };

    this.isBetween = function (product, filterData) {
        return product.price >= filterData.price.min && product.price <= filterData.price.max;
    };
}

function Filter(products, data) {
    this.products = products;
    this.data = data;
    this.currentData = {};

    this.selectors = {
        city: '#city',
        category: 'input.categories',
        minPrice: '#left_count',
        maxPrice: '#right_count',
        submitButton: '#submit',
        filterArea: '.filter'
    };

    this.filter = function () {
        this.loadCurrentData();
        this.onShow();
        this.setEvents();

        this.products.onFilter(this.currentData);
        this.products.onShow();
    };

    this.loadCurrentData = function () {
        this.currentData = {
            city: undefined,
            categories: [],
            price: {
                min: 1,
                max: 200
            }
        };
    };

    this.saveCurrentData = function () {
    };

    this.setEvents = function () {
        $(this.selectors.submitButton).on('click', this.onSubmitFilter.bind(this));
    };

    this.onSubmitFilter = function () {
        this.parseFilterData();
        this.saveCurrentData();

        this.products.onFilter(this.currentData);
        this.products.onShow();
    };

    this.parseFilterData = function () {
        this.currentData = {
            city: $(this.selectors.city).val(),
            price: {
                min: parseInt($(this.selectors.minPrice)[0].innerText),
                max: parseInt($(this.selectors.maxPrice)[0].innerText)
            },
            categories: []
        };

        var elements = $(this.selectors.category);
        for (var i = 0; i < elements.length; i++) {
            if (!elements[i].checked) {
                continue;
            }
            this.currentData.categories.push(elements[i].value);
        }
    };

    this.generateSelect = function (key) {
        var template = '<div class="city"><h3>CITY</h3><select class="select" name="city" id="{key}">{options}</select></div>';
        var optionsTemplate = '<option class="option" value="{value}"{selected}>{value}</option>';

        var result = '';
        for (var i = 0; i < this.data[key].data.length; i++) {
            var optionHtml = replaceAll(optionsTemplate, '{value}', this.data[key].data[i]);
            optionHtml = optionHtml.replace('{selected}', this.data[key].data[i] == this.currentData[key] ? ' selected' : '');

            result += optionHtml;
        }

        result = replaceAll(template, '{options}', result);

        return replaceAll(result, '{key}', key);
    };

    this.generateCheck = function (key) {
        var template = '<div class="categories"><h3>CATEGORIES</h3>{list}</div>';
        var listItemTemplate = '<label><input class="checkbox categories" type="checkbox" name="checkbox" value="{value}" checked>' +
            '<span class="checkbox-custom"></span><span class="label">{value}</span></label><br>';

        var result = '';
        for (var i = 0; i < this.data[key].data.length; i++) {
            var optionHtml = replaceAll(listItemTemplate, '{value}', this.data[key].data[i]);
            optionHtml = optionHtml.replace('{checked}', this.currentData[key].indexOf(this.data[key].data[i]) !== -1 ? ' checked' : '');

            result += optionHtml;
        }

        result = replaceAll(template, '{list}', result);

        return replaceAll(result, '{key}', key);
    };

    this.generateBetween = function (key) {
        var template = '</div><div class="pr"><h3>PRICE</h3><div class="slider"></div>' +
            '<p align="center" id="price">$ <span id="left_count">{currentMin}</span> - $ <span id="right_count">{currentMax}</span></p> ' +
            '<button id="submit">FILTER</button></div>';

        var result = template.replace('{key}', key);
        result = replaceAll(result, '{minPersent}', 0);
        result = replaceAll(result, '{maxPersent}', 100);
        result = result.replace('{currentMin}', this.currentData[key].min);

        return result.replace('{currentMax}', this.currentData[key].max);
    };

    this.onShow = function () {
        var area = $(this.selectors.filterArea)[0];
        area.innerHTML = '';

        for (var key in this.data) {
            switch (this.data[key].type) {
                case 'select':
                    area.innerHTML += this.generateSelect(key);

                    break;
                case 'check':
                    area.innerHTML += this.generateCheck(key);

                    break;
                case 'between':
                    area.innerHTML += this.generateBetween(key);

                    break;
            }
        }
    };

    this.filter();
}

$(document).ready(function () {
    products = new Products(productList);
    filter = new Filter(products, filterData);
});

function replaceAll(text, search, replace)
{
    return text.split(search).join(replace);
}
