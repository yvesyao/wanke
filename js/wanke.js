var scrollVals = {
	slideTop: 0,
	maxTop: $('section.slide').length - 1,
	curPage: 0
};
window.$ && $(function() {

	$('a[href=#]').click(function(event) {
		event.preventDefault();
	});

/*	$(window).resize(function() {
		$("#main").css('margin-top', scrollVals.slideTop * $(window).height() + 'px');
	});*/

	/*test*/
	/*PC端事件*/
	$("section.slide").each(function(index, el) {
		$(this).css({
			'background': 'url(imgs/' + ((index < 10) ? '0' : '') + Number(index + (index % 2 == 0 ? 1 : 0)) + '-bg.jpg) top left no-repeat',
			'background-size': '100% 100%'
		});
	});

	HTMLAudioElement.prototype.stop = function() {
		this.pause();
		this.currentTime = 0.0;
	}

	$('.player-button').click(function(e) { //播放按钮
		e.preventDefault();
		var player = $(this).children('audio')[0];
		if ($(this).hasClass('player-button-stop')) {
			$(this).removeClass('player-button-stop');
			player.play();
		} else {
			$(this).addClass('player-button-stop');
			player.stop();
		}
	});


	/*移动端事件*/
	if (navigator.userAgent.match(/mobile/i)) {
		var startY;
		var y;
		document.addEventListener('touchstart', function(event) {
			if (!event.touches.length || event.touches.length > 1 || $("#main").is(':animated')) { //超过一根手指或者正在翻页
				event.preventDefault();
				return;
			}
			var touch = event.touches[0];
			startY = touch.pageY;
		});
		document.addEventListener('touchmove', function(event) {
			event.preventDefault();
			/*alert(event.touches.length);*/
			var touch = event.touches[0];
			y = touch.pageY - startY;
			if ($('.slide.active').length <= 0) {
				var _next = scrollVals.curPage-y/Math.abs(y);
				if (_next < 0 ) return;
				if (_next > scrollVals.maxTop) {_next = 0};
				scrollStart(_next, y < 0);
			}
			$(".slide.active").css('top', -$(window).height()*y/Math.abs(y) + y + 'px');
		});
		document.addEventListener('touchend', function(event) {
			startY = 0;
			if (typeof(y) == "undefined" || y == 0) return;
			if (Math.abs(y) < 30)
				scrollToPage(scrollVals.slideTop);
			else
				scrollToPage(scrollVals.slideTop + y / Math.abs(y));
			y = 0;
		});
		return;
	}

	/*PC端事件*/
	$("section.slide").each(function(index, el) {
		$('#progress-nav ul').append('<li><a href="#" data-page="' + index + '"><span class="dot"></span><span class="hover-text">' + $(this).attr('data-title') + '</span></a></li>');
	});
	$('#progress-nav a').click(function(event) {
		/* Act on the event */
		event.preventDefault();
		scrollToPage(-Number($(this).attr('data-page')));
	});
	$('#progress-nav').css('margin-top', -(scrollVals.maxTop + 1) * 1.5 / 2 + 'em');
	$('#progress-nav ul li:eq(0)').addClass('active');
	$('section.slide').bind('mousewheel', function(event, delta) {
		/* Act on the event */
		event.preventDefault();
		scrollToPage(scrollVals.slideTop + delta);
		event.stopPropagation();
	});


});

function scrollStart(nextPage, isNext){
	var _next = $('.slide').eq(nextPage);
	_next.removeClass('hide').addClass('active').css('top', isNext ? "100%" : "-100%");
}

function scrollToPage(pageNum) {
	if (!$(".slide.active").is(':animated')) {
		if (pageNum > 0) {return};
		scrollVals.slideTop = pageNum;
		if (scrollVals.slideTop < -scrollVals.maxTop) scrollVals.slideTop = 0;
		//if ($('.slide.cur-fixed').length <= 0) $('.slide').eq(scrollVals.curPage).addClass('cur-fixed').after('<section class="slide fake"></section>');
		if ($('.slide.active').length <= 0) 
			scrollStart(-scrollVals.slideTop, -pageNum > scrollVals.curPage);

		$(".slide.active").animate({
			'top': '0px'
		}, '1s', function() {
			$('.slide.show').removeClass('show').children('.no-hide').addClass('hide').removeClass('no-hide');
			$(this).addClass('show').removeClass('active');
			$(this).children('.hide').addClass('no-hide').removeClass('hide');
			$('.slide').not('.show').addClass('hide');
		});
		$('#progress-nav ul li').removeClass('active').eq(-scrollVals.slideTop).addClass('active');
		scrollVals.curPage = -scrollVals.slideTop;
	}
}