/*
	Forty by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {

    skel.breakpoints({
        xlarge: '(max-width: 1680px)',
        large: '(max-width: 1280px)',
        medium: '(max-width: 980px)',
        small: '(max-width: 736px)',
        xsmall: '(max-width: 480px)',
        xxsmall: '(max-width: 360px)'
    });

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
    $.fn._parallax = (skel.vars.browser == 'ie' || skel.vars.browser == 'edge' || skel.vars.mobile) ? function () { return $(this) } : function (intensity) {

        var $window = $(window),
            $this = $(this);

        if (this.length == 0 || intensity === 0)
            return $this;

        if (this.length > 1) {

            for (var i = 0; i < this.length; i++)
                $(this[i])._parallax(intensity);

            return $this;

        }

        if (!intensity)
            intensity = 0.25;

        $this.each(function () {

            var $t = $(this),
                on, off;

            on = function () {

                $t.css('background-position', 'center 100%, center 100%, center 0px');

                $window
                    .on('scroll._parallax', function () {

                        var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

                        $t.css('background-position', 'center ' + (pos * (-1 * intensity)) + 'px');

                    });

            };

            off = function () {

                $t
                    .css('background-position', '');

                $window
                    .off('scroll._parallax');

            };

            skel.on('change', function () {

                if (skel.breakpoint('medium').active)
                    (off)();
                else
					(on)();

            });

        });

        $window
            .off('load._parallax resize._parallax')
            .on('load._parallax resize._parallax', function () {
                $window.trigger('scroll');
            });

        return $(this);

    };

    $(function () {

        var $window = $(window),
            $body = $('body'),
            $wrapper = $('#wrapper'),
            $header = $('#header'),
            $banner = $('#banner');

        // Disable animations/transitions until the page has loaded.
        $body.addClass('is-loading');

        $window.on('load pageshow', function () {
            window.setTimeout(function () {
                $body.removeClass('is-loading');
            }, 100);
        });

        // Clear transitioning state on unload/hide.
        $window.on('unload pagehide', function () {
            window.setTimeout(function () {
                $('.is-transitioning').removeClass('is-transitioning');
            }, 250);
        });

        // Fix: Enable IE-only tweaks.
        if (skel.vars.browser == 'ie' || skel.vars.browser == 'edge')
            $body.addClass('is-ie');

        // Fix: Placeholder polyfill.
        $('form').placeholder();

        // Prioritize "important" elements on medium.
        skel.on('+medium -medium', function () {
            $.prioritize(
                '.important\\28 medium\\29',
                skel.breakpoint('medium').active
            );
        });

        // Scrolly.
        $('.scrolly').scrolly({
            offset: function () {
                return $header.height() - 2;
            }
        });

        // Tiles.
        var $tiles = $('.tiles > article');

        $tiles.each(function () {

            var $this = $(this),
                $image = $this.find('.image'), $img = $image.find('img'),
                $link = $this.find('.link'),
                x;

            // Image.

            // Set image.
            $this.css('background-image', 'url(' + $img.attr('src') + ')');

            // Set position.
            if (x = $img.data('position'))
                $image.css('background-position', x);

            // Hide original.
            $image.hide();

            // Link.
            if ($link.length > 0) {

                $x = $link.clone()
                    .text('')
                    .addClass('primary')
                    .appendTo($this);

                $link = $link.add($x);

                $link.on('click', function (event) {

                    var href = $link.attr('href');

                    // Prevent default.
                    event.stopPropagation();
                    event.preventDefault();

                    // Start transitioning.
                    $this.addClass('is-transitioning');
                    $wrapper.addClass('is-transitioning');

                    // Redirect.
                    window.setTimeout(function () {

                        if ($link.attr('target') == '_blank')
                            window.open(href);
                        else
                            location.href = href;

                    }, 500);

                });

            }

        });

        // Header.
        if (skel.vars.IEVersion < 9)
            $header.removeClass('alt');

        if ($banner.length > 0
            && $header.hasClass('alt')) {

            $window.on('resize', function () {
                $window.trigger('scroll');
            });

            $window.on('load', function () {

                $banner.scrollex({
                    bottom: $header.height() + 10,
                    terminate: function () { $header.removeClass('alt'); },
                    enter: function () { $header.addClass('alt'); },
                    leave: function () { $header.removeClass('alt'); $header.addClass('reveal'); }
                });

                window.setTimeout(function () {
                    $window.triggerHandler('scroll');
                }, 100);

            });

        }

        // Banner.
        $banner.each(function () {

            var $this = $(this),
                $image = $this.find('.image'), $img = $image.find('img');

            // Parallax.
            $this._parallax(0.275);

            // Image.
            if ($image.length > 0) {

                // Set image.
                $this.css('background-image', 'url(' + $img.attr('src') + ')');

                // Hide original.
                $image.hide();

            }

        });

        // Menu.
        var $menu = $('#menu'),
            $menuInner;

        $menu.wrapInner('<div class="inner"></div>');
        $menuInner = $menu.children('.inner');
        $menu._locked = false;

        $menu._lock = function () {

            if ($menu._locked)
                return false;

            $menu._locked = true;

            window.setTimeout(function () {
                $menu._locked = false;
            }, 350);

            return true;

        };

        $menu._show = function () {

            if ($menu._lock())
                $body.addClass('is-menu-visible');

        };

        $menu._hide = function () {

            if ($menu._lock())
                $body.removeClass('is-menu-visible');

        };

        $menu._toggle = function () {

            if ($menu._lock())
                $body.toggleClass('is-menu-visible');

        };

        $menuInner
            .on('click', function (event) {
                event.stopPropagation();
            })
            .on('click', 'a', function (event) {

                var href = $(this).attr('href');

                event.preventDefault();
                event.stopPropagation();

                // Hide.
                $menu._hide();

                // Redirect.
                window.setTimeout(function () {
                    window.location.href = href;
                }, 250);

            });

        $menu
            .appendTo($body)
            .on('click', function (event) {

                event.stopPropagation();
                event.preventDefault();

                $body.removeClass('is-menu-visible');

            })
            .append('<a class="close" href="#menu">Close</a>');

        $body
            .on('click', 'a[href="#menu"]', function (event) {

                event.stopPropagation();
                event.preventDefault();

                // Toggle.
                $menu._toggle();

            })
            .on('click', function (event) {

                // Hide.
                $menu._hide();

            })
            .on('keydown', function (event) {

                // Hide on escape.
                if (event.keyCode == 27)
                    $menu._hide();

            });

        //init emailjs
        emailjs.init("user_qnQIiJ9pFxkXVcolKxSMA");

        var myform = $("form#emailForm");
        myform.submit(function (event) {
            event.preventDefault();

            var params = myform.serializeArray().reduce(function (obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});

            // Change to your service ID, or keep using the default service
            var service_id = "default_service";
            var template_id = "brett_johnson_name";
            var sendMessageButton = $("#sendMessageButton");
            sendMessageButton.text("Sending...");
            emailjs.send(service_id, template_id, params)
                .then(function () {
                    alert("Message Sent!");
                    sendMessageButton.text("Send Message");
                }, function (err) {
                    alert("Send email failed!\r\n Response:\n " + JSON.stringify(err));
                    sendMessageButton.text("Send Message");
                });
            return false;
        });
    });

})(jQuery);







//insert all the imports - saves in document structure
var link = document.querySelector('link[rel="import"]');
var footerTemplate = link.import.getElementById("footerTemplate");
//var headerTemplate = link.import.getElementById("headerTemplate");
var menuTemplate = link.import.getElementById("menuTemplate");
var contactTemplate = link.import.getElementById("contactTemplate");

var footer = document.importNode(footerTemplate.content, true);
//var header = document.importNode(headerTemplate.content, true);
var menu = document.importNode(menuTemplate.content, true);
var contact = document.importNode(contactTemplate.content, true);

var main = document.getElementById("main");
var wrapper = document.getElementById("wrapper");

var wrapperFirstChild = wrapper.firstChild;
//wrapper.insertBefore(header, wrapperFirstChild);
wrapper.insertBefore(menu, wrapperFirstChild);

wrapper.appendChild(contact);
wrapper.appendChild(footer);