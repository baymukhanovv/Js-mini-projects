let activeTabId = 'products';
let productsInCart = [];
let subTotalCounter = 0;

const initialTab = getActiveTab();
initialTab.classList.add('active');

renderTabContentById(activeTabId);

const tabWithCounter = document.querySelector('[data-cart-count="0"]');

const tabs = document.querySelectorAll('a[data-tab-id]');
addEventListeners(tabs, clickHandler);

function clickHandler(event) {
    activeId = getActiveTab();
    activeId.classList.remove('active');
    event.target.classList.add('active');

    activeTabId = event.target.dataset.tabId;

    removeActiveTabContent();
    renderTabContentById(activeTabId)
} 

function addInCartHandler(product) {
    return () => {
        let hasProduct = false;
        let index = null;
        count = 1;

        for (let i = 0; i < productsInCart.length; i++){
            const productInCart = productsInCart[i]

            if (product.id === productInCart.id) { 
                hasProduct = true 
                index = i 
                count = productInCart.count 
            }
        }

        if (hasProduct) {
            productsInCart[index].count = count + 1
        }
        else { 
            const productWithCount = product;  
            productWithCount.count = count 
            productsInCart.push(productWithCount)
        }
        
        let fullSize = 0;

        for (let i = 0; i < productsInCart.length; i++){
            const productInCart = productsInCart[i]
            fullSize += productInCart.count
        }
    
        tabWithCounter.dataset.cartCount = fullSize;
    }
}

function removeInCartHandler(productId) {
    return () => {
        const newGoodsInCart = [];

        for (let i = 0; i < productsInCart.length; i++){
            const product = productsInCart[i]

            if(productId === product.id) { 
                if(product.count > 1) {
                    newGoodsInCart.push({
                        ...product,
                        count: product.count - 1,
                    }) 
                }
                updateCartItem(product.id, product.count)
            }
            else {
                newGoodsInCart.push(product)
            }
        }

        productsInCart = newGoodsInCart;

        let fullSize = 0;

        for (let i = 0; i < productsInCart.length; i++){
            const productInCart = productsInCart[i]
            fullSize += productInCart.count
        }
    
        tabWithCounter.dataset.cartCount = fullSize; 
    }
}

function addEventListeners(elements, callback) { 
    for(let i = 0; i < elements.length; i++) {
        element = elements[i];
        element.addEventListener('click', callback)
    }
}

function createProduct(product) {
    return {
        id: product.id,
        name: product.name ? product.name : "Имя неизвестно",
        price: product.price ? product.price : null,
        imgSrc: product.imgSrc,
        count: product.count,
    }
}

function getActiveTab() {
    return document.querySelector(`[data-tab-id="${activeTabId}"]`);
}

function removeActiveTabContent() {
    const activeContent = document.querySelector(`[data-active-tab-content="true"]`);
    activeContent.remove()
}

function renderTabContentById(tabId) {
    const tabsContainer = document.querySelector('.header')
    let html = null;
    if(tabId === 'products'){
        html = renderProducts();
    } else {
        html = renderCart();
    }

    if(html !== null) {
        tabsContainer.after(html);
    }
}

function renderProducts() {
    const products = document.createElement('main');
    products.dataset.activeTabContent = 'true';
    products.className = 'products';
    const container = document.createElement('div');
    container.className = 'container';
    const productSection = document.createElement('div');
    productSection.className = 'products-section';

    for(let i = 0; i < PRODUCTS.length; i++){
        const product = createProduct(PRODUCTS[i]);

        const price = product.price === null 
            ? '<div class="product-price">Товар закончился</div>'
            : `<div class="product-price">$${product.price}</div>`;

        const productAction = document.createElement('div');
        productAction.className = 'product-action';
        const productButton = document.createElement('button');
        productButton.className = 'product-button';
        productButton.textContent = 'Add to Cart';
        productButton.addEventListener('click', addInCartHandler(product))
        productButton.addEventListener('click', calcTotalSum( product.id))

        const productCard = document.createElement('div')
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img class='product-image' src="${product.imgSrc}">
            <div class='product-info'>
                <p class="product-name-info">${product.name}</p>
                ${price}
                <img class="product-rating" src="images/icons/rating.png" alt="">
            </div>
        `;

        productCard.append(productButton);
        productSection.append(productCard);
    }

    container.append(productSection);
    products.append(container);
    return products
}

function renderCart() {
    const cart = document.createElement('div');
    cart.dataset.activeTabContent = 'true';
    cart.className = 'cart';

    const container = document.createElement('div');
    container.className = 'container';

    const cartSection = document.createElement('div'),
          cartTotalSum = document.createElement('div');
    cartSection.className = 'cart-section';
    cartTotalSum.className = 'cart-total-sum';

    for(let i = 0; i < productsInCart.length; i++) {
        const product = productsInCart[i];

        const cartProduct = document.createElement('div');
        cartProduct.dataset.elementId = product.id;
        cartProduct.className = 'cart-product';

        const productName = document.createElement('div');
        productName.className = 'product-name';
        productName.innerHTML = `
            <img src="${product.imgSrc}" width="100" height="100" alt="">
            <span>${product.name}</span>
        `;
        
        const productPrice = document.createElement('div');
        productPrice.className = 'product-price';
        productPrice.textContent = `$${product.price}`;

        const productQuanity = document.createElement('div');
        productQuanity.className = 'product-quanity';
        productQuanity.textContent = `${product.count}шт`;


        const productDeleteButton = document.createElement('button');
        productDeleteButton.className = 'product-delete';
        productDeleteButton.addEventListener('click', removeInCartHandler(product.id))
        productDeleteButton.addEventListener('click', calcTotalSum( product.id))

        cartProduct.append(productName, productPrice, productQuanity, productDeleteButton);
        cartSection.append(cartProduct);
    }

    const cartTotalWrapper = document.createElement('div');
    cartTotalWrapper.className = 'cart-total-wrapper';

    const cartTotalTitle = document.createElement('h3');
    cartTotalTitle.className = 'cart-total-title';
    cartTotalTitle.textContent = 'Cart total';

    const cartTotalSubtotal = document.createElement('div');
    cartTotalSubtotal.className = 'cart-total-subtotal';
    cartTotalSubtotal.innerHTML = `
        <div>Subtotal:</div>
        <span class='totalCounter'>$${subTotalCounter}</span>
    `;

    const cartTotalShipping = document.createElement('div');
    cartTotalShipping.className = 'cart-total-shipping';
    cartTotalShipping.innerHTML = `
        <div>Shipping:</div>
        <span>Free</span>
    `

    const cartTotalTotal = document.createElement('div');
    cartTotalTotal.className = 'cart-total-total';
    cartTotalTotal.innerHTML = `
    <div>Total:</div>
    <span class='totalCounter'>$${subTotalCounter}</span>
    `
    const cartTotalButton = document.createElement('button');
    cartTotalButton.className = 'cart-total-button';
    cartTotalButton.textContent = 'Proceed to checkout';

    cartTotalWrapper.append(cartTotalTitle,cartTotalSubtotal, cartTotalShipping, cartTotalTotal, cartTotalButton)
    cartTotalSum.append(cartTotalWrapper)

    container.append(cartSection, cartTotalSum)
    cart.append(container);
    return cart
}

function deleteButton(cartId) {
    return () => {
        const cartItem = document.querySelector(`[data-element-id="${cartId}"]`)
        cartItem.remove()
    }
}

function updateCartItem(id, count) {
    const cartItem = document.querySelector(`[data-element-id="${id}"]`) 

    if (count > 1) { 
        const countElement = cartItem.querySelector('.product-quanity'); 
        countElement.textContent = `${count - 1}шт`
    }
    else { 
        cartItem.remove()
    }
}

function calcTotalSum(cartId) {
    return () => {
        subTotalCounter = productsInCart.reduce((acc, product) => {
            return acc + (product.price * product.count);
        }, 0)
        // for (let i = 0; i < productsInCart.length; i++) {
        //     newProductsTotalInCart.push(productsInCart[i])
        // }
        console.log(subTotalCounter)
        const sumCounters = document.querySelectorAll('.totalCounter');
        for(let i = 0; i < sumCounters.length; i++) {
            const sumCounter = sumCounters[i];
            sumCounter.textContent = `$${subTotalCounter}`
        } 
    }
}