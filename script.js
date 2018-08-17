//jQuery.noConflict();
jQuery(document).ready(function () {

   jQuery("#telNumber").mask("+38 (999) 999-99-99");

    var p = jQuery('.window_wrap');
    jQuery('.telButton').click(function () {
        p.css({'display': 'block'}).hide().fadeIn(1000);
    });


    p.click(function (event) {
        if (event.target == this) {
            jQuery(this).css({'display': 'none'});
        }
    });

    jQuery('.window_close').click(function () {
        p.css({'display': 'none'});
    });


    jQuery('#telButton').click(function () {
		var abonent_name = jQuery('#abonentName').val();
		var phone_number = jQuery('#telNumber').val();
		
		if (abonent_name.length <= 2) {
            alert("Введіть, будь ласка, Ваше Ім’я");
            return false;
        }
		
		if (abonent_name.length > 30) {
            alert("В полі Ім’я можна ввести не більше 30-ти символів");
            return false;
        }
		
		//console.log(phone_number.length);
		if (phone_number.length == 0) {
            alert("Введіть, будь ласка, номер телефону");
            return false;
        }
		
        jQuery('#backPhone').fadeOut(500, function () {
            jQuery('<p>Надсилання!</p>').appendTo(jQuery('.window')).hide().fadeIn(300, function () {
                jQuery.ajax({
                    type: 'POST',
                    url: '/call-me.php',
                    data: {
						phone_number: phone_number,
						abonent_name: abonent_name
					},
                    dataType: 'json',
                    success: function (data) {
                        if (data.error) {
                            jQuery('.window p').last().remove();
                            jQuery('#backPhone').fadeIn(300, function () {
                                alert(data.error);
                            });
                        } else {
                            jQuery('.window p').last().fadeOut(300, function () {
                                jQuery(this).text(data.success).fadeIn(300, function () {
                                    jQuery('.window_wrap').delay(1500).fadeOut(300);
                                });
                            });
                        }
                    },
                    error: function () {
                        alert('Error send!!!');
                    }
                });
            });
        });
        return false;
    });

    jQuery('.telButton .telButton_background').hover(
        function () {
            var v = jQuery('.telButton_hover');
            if (!v.hasClass('fHovered')) {
                v.stop().css('display', 'block').animate({'opacity': 1}, 1000).addClass('fHovered');
            }
        },
        function () {
            var v = jQuery('.telButton_hover');
            if (v.hasClass('fHovered')) {
                v.stop().animate({'opacity': 0}, 1000, function () {
                    jQuery(this).css('display', 'none');
                }).removeClass('fHovered');
            }
        }

    );


    jQuery('.telButton.anim').css({'position': 'absolute', 'top': '-100px', 'right': '50px', 'transition': "top 0.9s cubic-bezier(.65, 1.95, .03, .32) 0.5s"});


    telButtonReturn();

    jQuery(window).scroll(function () {
        telButtonReturn();
    });

    jQuery(window).resize(function () {
        telButtonReturn();
    });


    function telButtonReturn() {
        var wHeight = getWindowHeight();
        var sHeight = jQuery(window).scrollTop();
        var result = wHeight + sHeight - 100;
        jQuery('.telButton.anim').css({'position': 'absolute', 'top': result + 'px', 'right': '50px'});
    }


    function getWindowHeight() {
        var windowHeight;
        windowHeight = jQuery(window).height();
        return windowHeight;
    }
});