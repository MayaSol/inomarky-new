"use strict";
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