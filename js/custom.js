"use strict";

function scrollToggle(e) { const { selectData: t, toggleData: c, scrollDigit: l } = e;
    window.addEventListener("scroll", (function() { const e = document.querySelector(t);
        window.pageYOffset > l ? e ? .classList.add(c) : e ? .classList.remove(c) })) }

function clickToggle(e) { const { selectData: t, toggleData: c } = e, l = document.querySelectorAll(t); for (let e = 0; e < l.length; e++) l[e].addEventListener("click", (function() { l[e].className.includes(c) ? l[e].classList.remove(c) : l[e].classList.add(c) })) }

function sidebarLayout() { const e = document.querySelector(".sidebar-part"),
        t = document.querySelector(".sidebar-open"),
        c = document.querySelector(".sidebar-close"),
        l = document.querySelector(".backdrop"),
        n = document.querySelector("body");
    t.addEventListener("click", (function() { e.classList.add("open"), l.classList.add("active"), n.style.overflowY = "hidden" })), c.addEventListener("click", (function() { e.classList.remove("open"), l.classList.remove("active"), n.style.overflowY = "scroll" })), l.addEventListener("click", (function() { e.classList.remove("open"), l.classList.remove("active"), n.style.overflowY = "scroll" })) }

function dotsAction(e) { 
	const t = document.querySelectorAll(e); 
	for (let e = 0; e < t.length; e++) t[e].addEventListener("click", (function() { const c = t[e].firstElementChild,
            l = t[e].nextElementSibling; "close" == c.textContent ? (t[e].classList.remove("active"), l.classList.remove("show"), c.innerText = "more_vert") : (t[e].classList.add("active"), l.classList.add("show"), c.innerText = "close") })) }

function selection(e) { 
	let t = document.querySelectorAll(e); 
	for (let e = 0; e < t.length; e++) t[e].addEventListener("click", (() => { t.forEach((e => e.classList.remove("active"))), t[e].classList.add("active") })) }

function cancelValue() { 
	document.querySelectorAll(".file-cancel").forEach(
		(e => { e.parentElement.querySelector(".file-input").addEventListener("change", (function(t) { e.parentElement.querySelector(".file-cancel").style.display = "block" })), e.addEventListener("click", (function(e) { e.target.parentElement.querySelector(".file-input").value = "", e.target.parentElement.querySelector(".file-cancel").style.display = "none" })) })) 
}

function slickSliderDotsString() { 
	const e = document.querySelectorAll(".slick-dots li");
    Array.from(e).map(((e, t) => { const c = t + 1;
        e.children[0].textContent = "0" + c })) } 

scrollToggle({ selectData: ".header-part", toggleData: "sticky", scrollDigit: "0" }), scrollToggle({ selectData: ".product-single-scrollspy-btns", toggleData: "fixed", scrollDigit: "1150" }), sidebarLayout(), dotsAction(".comment-action-btn"), dotsAction(".review-action-btn"), document.querySelector(".header-search").lastElementChild.addEventListener("click", (e => { "tune" !== e.target.textContent ? (e.target.offsetParent.classList.remove("active"), e.target.textContent = "tune") : (e.target.offsetParent.classList.add("active"), e.target.textContent = "close") })), document.querySelector(".responsive-srch").addEventListener("click", (e => { const t = document.querySelector(".header-form"); "search" !== e.target.textContent ? (t.style.display = "none", e.target.textContent = "search") : (t.style.display = "block", e.target.textContent = "close") })), selection(".create-price-card"), selection(".create-pay-card"), cancelValue(), slickSliderDotsString();
