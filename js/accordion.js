"use strict";

function accordion(e, t) { 
	const l = document.querySelectorAll(e); 
	if (t) { 
		const e = l[0].lastElementChild;
        e.style.height = e.scrollHeight + "px" } for (let e = 0; e < l.length; e++) l[e].firstElementChild.addEventListener("click", (() => { const t = l[e].lastElementChild,
            i = l[e].parentElement.children,
            s = Array.from(i).indexOf(l[e]); if (parseInt(t.style.height) !== t.scrollHeight) { for (let e = 0; e < i.length; e++) e !== s && (l[e].classList.remove("active"), l[e].lastElementChild.style.height = "0px");
            l[e].classList.add("active"), t.style.height = t.scrollHeight + "px" } else l[e].classList.remove("active"), t.style.height = "0px" })) } 
        accordion(".accordion-item", !1);