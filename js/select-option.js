"use strict";
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