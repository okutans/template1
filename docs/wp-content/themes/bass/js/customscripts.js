var addPanel = function(e){
  e.stopPropagation();
  jQuery('body').addClass('menu-opened');
			var capture = jQuery( ".panels" )
			.attr( "tabindex", "-1" )
			.focus()
			.keydown(
				function handleKeydown( event ) {
						if ( event.key.toLowerCase() !== "tab" ) {
							return;
						}
						var tabbable = jQuery()
							// All form elements can receive focus.
							.add( capture.find( "button, input, select, textarea" ) )
							// Any element that has an HREF can receive focus.
							.add( capture.find( "[href]" ) )
							// Any element that has a non-(-1) tabindex can receive focus.
							.add( capture.find( "[tabindex]:not([tabindex='-1'])" ) )
						;
						var target = jQuery( event.target );

						// Reverse tabbing (Key: Shift+Tab).
						if ( event.shiftKey ) {
							if ( target.is( capture ) || target.is( tabbable.first() ) ) {
								// Force focus to last element in container.
								event.preventDefault();
								tabbable.last().focus();
							}
						// Forward tabbing (Key: Tab).
						} else {
							if ( target.is( tabbable.last() ) ) {
								// Force focus to first element in container.
								event.preventDefault();
								tabbable.first().focus();

							}
						}
		});
};

var removePanel = function(){
  jQuery('body.menu-opened').removeClass('menu-opened');
};

jQuery(document).ready(function() {
  jQuery('.menu-button').on('click',addPanel);
  jQuery('#container').on('click',removePanel);
});

/*  jQuery Nice Select - v1.1.0
    https://github.com/hernansartorio/jquery-nice-select
    Made by HernÃ¡n Sartorio  */

(function(jQuery) {

  jQuery.fn.niceSelect = function(method) {

    // Methods
    if (typeof method == 'string') {
      if (method == 'update') {
        this.each(function() {
          var jQueryselect = jQuery(this);
          var jQuerydropdown = jQuery(this).next('.nice-select');
          var open = jQuerydropdown.hasClass('open');

          if (jQuerydropdown.length) {
            jQuerydropdown.remove();
            create_nice_select(jQueryselect);

            if (open) {
              jQueryselect.next().trigger('click');
            }
          }
        });
      } else if (method == 'destroy') {
        this.each(function() {
          var jQueryselect = jQuery(this);
          var jQuerydropdown = jQuery(this).next('.nice-select');

          if (jQuerydropdown.length) {
            jQuerydropdown.remove();
            jQueryselect.css('display', '');
          }
        });
        if (jQuery('.nice-select').length == 0) {
          jQuery(document).off('.nice_select');
        }
      } else {
        console.log('Method "' + method + '" does not exist.')
      }
      return this;
    }

    // Hide native select
    this.hide();

    // Create custom markup
    this.each(function() {
      var jQueryselect = jQuery(this);

      if (!jQueryselect.next().hasClass('nice-select')) {
        create_nice_select(jQueryselect);
      }
    });

    function create_nice_select(jQueryselect) {
      jQueryselect.after(jQuery('<div></div>')
        .addClass('nice-select')
        .addClass(jQueryselect.attr('class') || '')
        .addClass(jQueryselect.attr('disabled') ? 'disabled' : '')
        .attr('tabindex', jQueryselect.attr('disabled') ? null : '0')
        .html('<span class="current"></span><ul class="list"></ul>')
      );

      var jQuerydropdown = jQueryselect.next();
      var jQueryoptions = jQueryselect.find('option');
      var jQueryselected = jQueryselect.find('option:selected');

      jQuerydropdown.find('.current').html(jQueryselected.data('display') || jQueryselected.text());

      jQueryoptions.each(function(i) {
        var jQueryoption = jQuery(this);
        var display = jQueryoption.data('display');

        jQuerydropdown.find('ul').append(jQuery('<li></li>')
          .attr('data-value', jQueryoption.val())
          .attr('data-display', (display || null))
          .addClass('option' +
            (jQueryoption.is(':selected') ? ' selected' : '') +
            (jQueryoption.is(':disabled') ? ' disabled' : ''))
          .html(jQueryoption.text())
        );
      });
    }

    /* Event listeners */

    // Unbind existing events in case that the plugin has been initialized before
    jQuery(document).off('.nice_select');

    // Open/close
    jQuery(document).on('click.nice_select', '.nice-select', function(event) {
      var jQuerydropdown = jQuery(this);

      jQuery('.nice-select').not(jQuerydropdown).removeClass('open');
      jQuerydropdown.toggleClass('open');

      if (jQuerydropdown.hasClass('open')) {
        jQuerydropdown.find('.option');
        jQuerydropdown.find('.focus').removeClass('focus');
        jQuerydropdown.find('.selected').addClass('focus');
      } else {
        jQuerydropdown.focus();
      }
    });

    // Close when clicking outside
    jQuery(document).on('click.nice_select', function(event) {
      if (jQuery(event.target).closest('.nice-select').length === 0) {
        jQuery('.nice-select').removeClass('open').find('.option');
      }
    });

    // Option click
    jQuery(document).on('click.nice_select', '.nice-select .option:not(.disabled)', function(event) {
      var jQueryoption = jQuery(this);
      var jQuerydropdown = jQueryoption.closest('.nice-select');

      jQuerydropdown.find('.selected').removeClass('selected');
      jQueryoption.addClass('selected');

      var text = jQueryoption.data('display') || jQueryoption.text();
      jQuerydropdown.find('.current').text(text);

      jQuerydropdown.prev('select').val(jQueryoption.data('value')).trigger('change');
    });

    // Keyboard events
    jQuery(document).on('keydown.nice_select', '.nice-select', function(event) {
      var jQuerydropdown = jQuery(this);
      var jQueryfocused_option = jQuery(jQuerydropdown.find('.focus') || jQuerydropdown.find('.list .option.selected'));

      // Space or Enter
      if (event.keyCode == 32 || event.keyCode == 13) {
        if (jQuerydropdown.hasClass('open')) {
          jQueryfocused_option.trigger('click');
        } else {
          jQuerydropdown.trigger('click');
        }
        return false;
      // Down
      } else if (event.keyCode == 40) {
        if (!jQuerydropdown.hasClass('open')) {
          jQuerydropdown.trigger('click');
        } else {
          var jQuerynext = jQueryfocused_option.nextAll('.option:not(.disabled)').first();
          if (jQuerynext.length > 0) {
            jQuerydropdown.find('.focus').removeClass('focus');
            jQuerynext.addClass('focus');
          }
        }
        return false;
      // Up
      } else if (event.keyCode == 38) {
        if (!jQuerydropdown.hasClass('open')) {
          jQuerydropdown.trigger('click');
        } else {
          var jQueryprev = jQueryfocused_option.prevAll('.option:not(.disabled)').first();
          if (jQueryprev.length > 0) {
            jQuerydropdown.find('.focus').removeClass('focus');
            jQueryprev.addClass('focus');
          }
        }
        return false;
      // Esc
      } else if (event.keyCode == 27) {
        if (jQuerydropdown.hasClass('open')) {
          jQuerydropdown.trigger('click');
        }
      // Tab
      } else if (event.keyCode == 9) {
        if (jQuerydropdown.hasClass('open')) {
          return false;
        }
      }
    });

    // Detect CSS pointer-events support, for IE <= 10. From Modernizr.
    var style = document.createElement('a').style;
    style.cssText = 'pointer-events:auto';
    if (style.pointerEvents !== 'auto') {
      jQuery('html').addClass('no-csspointerevents');
    }

    return this;

  };

}(jQuery));

jQuery(document).ready(function() {
  jQuery('select.orderby').niceSelect();
});

function wcqib_refresh_quantity_increments() {
    jQuery("div.quantity:not(.buttons_added), td.quantity:not(.buttons_added)").each(function(a, b) {
        var c = jQuery(b);
        c.addClass("buttons_added"), c.children().first().before('<input type="button" value="-" class="minus" />'), c.children().last().after('<input type="button" value="+" class="plus" />')
    })
}
String.prototype.getDecimals || (String.prototype.getDecimals = function() {
    var a = this,
        b = ("" + a).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    return b ? Math.max(0, (b[1] ? b[1].length : 0) - (b[2] ? +b[2] : 0)) : 0
}), jQuery(document).ready(function() {
    wcqib_refresh_quantity_increments()
}), jQuery(document).on("updated_wc_div", function() {
    wcqib_refresh_quantity_increments()
}), jQuery(document).on("click", ".plus, .minus", function() {
    var a = jQuery(this).closest(".quantity").find(".qty"),
        b = parseFloat(a.val()),
        c = parseFloat(a.attr("max")),
        d = parseFloat(a.attr("min")),
        e = a.attr("step");
    b && "" !== b && "NaN" !== b || (b = 0), "" !== c && "NaN" !== c || (c = ""), "" !== d && "NaN" !== d || (d = 0), "any" !== e && "" !== e && void 0 !== e && "NaN" !== parseFloat(e) || (e = 1), jQuery(this).is(".plus") ? c && b >= c ? a.val(c) : a.val((b + parseFloat(e)).toFixed(e.getDecimals())) : d && b <= d ? a.val(d) : b > 0 && a.val((b - parseFloat(e)).toFixed(e.getDecimals())), a.trigger("change")
});

jQuery(function(){
	jQuery(document).on('click','.slider-arrow.show',function(){
	    jQuery( ".sidepanel" ).show().animate({
          top: "+=0",
          opacity: "1",
          transform: "scale(100%)"
		  }, 100, function() {
            jQuery( ".sidepanel" ).show();
          });
		  jQuery(this).removeClass('show').addClass('hide');
    });

    jQuery(document).on('click','.slider-arrow.hide',function(){
	    jQuery( ".sidepanel" ).animate({
          top: "-=0",
          opacity: "0"
		  }, 100, function() {
          jQuery( ".sidepanel" ).hide();
      });
		  jQuery(this).removeClass('hide').addClass('show');
    });

    jQuery(document).on('click.slider_arrow.hide', function(event) {
      if (jQuery(event.target).closest('.slider-arrow').length === 0) {
        jQuery( ".sidepanel" ).animate({
          top: "-=0",
          opacity: "0"
        }, 100, function() {
          jQuery( ".sidepanel" ).hide();
        });
        jQuery('.slider-arrow').removeClass('hide').addClass('show');
      }
    });
});


if (jQuery('#playAudio').length > 0) {
document.getElementById("playAudio").addEventListener("click", function(){
	var audio = document.getElementById('playMp3');
  if(this.className == 'is-playing'){
    this.className = "not-playing";
    audio.pause();
  }else{
    this.className = "is-playing";
    audio.play();
  }
});
}

function generateBalls() {
  for (var i = 0; i < Math.floor(window.innerWidth/20); i++) {
    jQuery(".gooey-animations").append(`
    <div class="ball"></div>
  `);
    var colors = ['#141414','#cc0033'];
    jQuery(".ball").eq(i).css({"bottom":"0","left":Math.random()*window.innerWidth-100,"animation-delay":Math.random()*5+"s","transform":"translateY("+Math.random()*10+"px)","background-color":colors[i%2]});
  }
}
generateBalls();

window.addEventListener('resize', function(e) {
  jQuery(".gooey-animations .ball").remove();
  generateBalls();
})
