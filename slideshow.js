/* Initializes js by searching for all slideshows on the current page, and setting active silde to 0 */
jQuery(function($) {
    $(document).ready(function($) {

		console.log('ready');
	
		window.fef_init = function() {
			$('[id^="fef-slideshow-"]').each(function() {
				$(this).data('current-slide', 0);
				$(this).data('current-period', 0);
								
				gotToSlide($(this), 0);
				
				$(this).find('.previous').each(function() {
					$(this).click(previous);
				});
				
				$(this).find('.next').each(function() {
					$(this).click(next);
				});
				
				$(this).find('.center-navigation').children().each(function(i) {
					$(this).data('slide', i);
					$(this).click(moveToSlide);
				});
			});
		}
		
		fef_init();
		
		setInterval(autoSlide, 1000);
    });

	function autoSlide() {
		$('[id^="fef-slideshow-"]').each(function() {
			if ($(this).attr('period')) {
				
				var period = Number($(this).attr('period'));
				
				if ( period !== 0) {
					var current_period = $(this).data('current-period');
					
					if (current_period > period) {
						$(this).find('.next').click();
						$(this).data('current-period', 0);
					} else {
						$(this).data('current-period', current_period + 1);
					}		
				}		
			}
		});
	}
	
    function next() {
		console.log('next');
        gotToSlide($(this).parent().parent(), $(this).parent().parent().data('current-slide') + 1);
    }

    function previous() {
        gotToSlide($(this).parent().parent(), $(this).parent().parent().data('current-slide') - 1);
    }
	
	function moveToSlide() {
		gotToSlide($(this).parent().parent().parent(), $(this).data('slide'));
	}

    function gotToSlide(slideshow, n) {
        var slides = slideshow.find('.slide');
        var dots = slideshow.find('.center-navigation').children();
        var captions = slideshow.find('.caption');
        var numbers = slideshow.find('.number');

        var current_caption = '';
        
	    if (n >= slides.length)
	        n = 0;  
	
	    if (n < 0)
	        n = slides.length - 1;

        slides.each(function(i) {
            if ( i == n ) {
                $(this).css('display', 'block');
                current_caption = $(this).attr('caption');
            }
            else
                $(this).css('display', 'none');
        });

        dots.each(function(i) {
            if ( i == n )
                $(this).addClass('active');
            else
                $(this).removeClass('active');
        });

        captions.each(function(i) {
                $(this).html(current_caption);

                if (current_caption == '')
                    $(this).css('display', 'none');
                else
                    $(this).css('display', 'block');                    
        });

        numbers.each(function(i) {
            $(this).html((n + 1) + '/' + slides.length);
        });

        slideshow.data('current-slide', n);
    }
});
