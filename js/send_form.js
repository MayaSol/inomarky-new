$("body").on("click", ".submit_form", function() {
      
    $(".empty-message").css("opacity", "0");
    $(".empty-message").css("display", "none");
    form = $(this).parents("form");
    mass_send = [];
    error = 0;
    ind = 0;

    ya_goal = '';

    title = $(this).parents("form:first-child").text();

    form.find("input[type = \"text\"]").each(function(i) { 
        name_t = $(this).attr("data-title");
        req = $(this).attr("data-req");
        val = $(this).val();
        //            alert(name_t+" "+val);
        if (name_t !== undefined) {
            mass_send[ind] = { name: name_t, value: val };
            if ((req == 1) && ((val == "") || (val == "0;0") || (val == "1985;1985"))) {
                $(this).parents("form").find(".empty-message").css("opacity", "1");
                $(this).parents("form").find(".empty-message").css("display", "block");
                error = error + 1;
            } else {
                dop_check = $(this).attr("data-check");
                if ((dop_check != "") && (dop_check !== undefined)) {
                    show_err = 0;

                    $.ajax({
                        url: "/index.php?route=common/cart/check_form",
                        method: "POST",
                        data: { type_check: dop_check, value: val },
                        async: false
                    }).done(function(data) {
                        if (data == "0") {
                            error = error + 1;
                            show_err = 1;
                        }
                    });
                    if (show_err == 1) {
                        $(this).parents("form").find(".empty-message").css("opacity", "1");
                        $(this).parents("form").find(".empty-message").css("display", "block");
                    }
                }
            }
            ind = ind + 1;
        }
    });

    form.find("input[type = \"datetime-local\"]").each(function(i) { 
        name_t = $(this).attr("data-title");
        req = $(this).attr("data-req");
        val = $(this).val();
        //            alert(name_t+" "+val);
        if (name_t !== undefined) {
            mass_send[ind] = { name: name_t, value: val };
            if ((req == 1) && ((val == "") || (val == "0;0") || (val == "1985;1985"))) {
                $(this).parents("form").find(".empty-message").css("opacity", "1");
                $(this).parents("form").find(".empty-message").css("display", "block");
                error = error + 1;
            } else {
                dop_check = $(this).attr("data-check");
                if ((dop_check != "") && (dop_check !== undefined)) {
                    show_err = 0;

                    $.ajax({
                        url: "/index.php?route=common/cart/check_form",
                        method: "POST",
                        data: { type_check: dop_check, value: val },
                        async: false
                    }).done(function(data) {
                        if (data == "0") {
                            error = error + 1;
                            show_err = 1;
                        }
                    });
                    if (show_err == 1) {
                        $(this).parents("form").find(".empty-message").css("opacity", "1");
                        $(this).parents("form").find(".empty-message").css("display", "block");
                    }
                }
            }
            ind = ind + 1;
        }
    });

    form.find("input[type = \"radio\"]").each(function(i) {
        name_t = $(this).attr("data-title");
        val = $(this).val();
        if (name_t !== undefined) {
            if ($(this).is(":checked")) {
                //                    alert (name_t+" - "+val);
                mass_send[ind] = { name: name_t, value: val };
                ind = ind + 1;
            }
        }
    });

    var mass_chb = {};
    form.find("input[type = \"checkbox\"]").each(function(i) {
        var name_t = $(this).attr("data-title");
        val = $(this).val();
        if (name_t !== undefined) {
            if ($(this).is(":checked")) {
                //                    alert (name_t+" - "+val);
                if (mass_chb[name_t] !== undefined) {
                    mass_chb[name_t] += ", " + val;
                } else {
                    mass_chb[name_t] = val;
                }
            }
        }
    });
    $.each(mass_chb, function(index_cnb, value_cnb) {
        mass_send[ind] = { name: index_cnb, value: value_cnb };
        ind = ind + 1;
    });

    form.find("select").each(function(i) {
        name_t = $(this).attr("data-title");
        req = $(this).attr("data-req");
        val = $(this).val();
        if (name_t !== undefined) {
            mass_send[ind] = { name: name_t, value: val };
            if ((req == 1) && (val == "")) {
                $(this).parents("form").find(".empty-message").css("opacity", "1");
                $(this).parents("form").find(".empty-message").css("display", "block"); 
                // $(this).parents(".sel_div_req").find(".empty-message").css("opacity", "1");
                // $(this).parents(".sel_div_req").find(".empty-message").css("display", "block");
                error = error + 1;
            }
            ind = ind + 1;
        }
    });

    form.find("textarea").each(function(i) {
        name_t = $(this).attr("data-title");
        req = $(this).attr("data-req");
        val = $(this).val();
        if (name_t !== undefined) {
            mass_send[ind] = { name: name_t, value: val };
            if ((req == 1) && (val == "")) {
                $(this).parents("form").find(".empty-message").css("opacity", "1");
                $(this).parents("form").find(".empty-message").css("display", "block");
                error = error + 1;
            }
            ind = ind + 1;
        }
    });

    form.find("input[type = \"hidden\"]").each(function(i) {
        name_t = $(this).attr("data-title");
        req = $(this).attr("data-req");
        val = $(this).val();
        if (name_t !== undefined) {
            if (name_t == "ya_goal") {
                ya_goal = val;
            } else {
                mass_send[ind] = { name: name_t, value: val };
                ind = ind + 1;
            }
        }
    });


    form_data = JSON.stringify(mass_send);

    if (error == 0) {
        ya_goal = '';

        if (ya_goal != '') {
            ga('send', 'event', 'submit', ya_goal);
            yaCounter26150808.reachGoal(ya_goal);
        }

        $.post("/index.php?route=common/cart/send_form", { form_data: form_data }, function(data) {
            if (data != "") {
                form.append("<div class=\"success-message\">Р’Р°С€Р° Р·Р°СЏРІРєР° РїСЂРёРЅСЏС‚Р°, РјС‹ СЃРІСЏР¶РµРјСЃСЏ СЃ Р’Р°РјРё РІ Р±Р»РёР¶Р°Р№С€РµРµ РІСЂРµРјСЏ.</div>");
            }

            form.find('input').css("display", "none");
            form.find('textarea').css("display", "none");
            form.find('select').css("display", "none");
            form.find('label').css("display", "none");
            form.find('a').css("display", "none");
            form.find('div').css("display", "none");
            form.find('p').css("display", "none");


            form.find(".success-message").css("opacity", "1");
            form.find(".success-message").css("display", "block");
        });

    }

    event.preventDefault();

});