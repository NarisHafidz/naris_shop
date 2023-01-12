jQuery(document).ready(function($){
  var slidesWrapper = $('.cd-hero-slider');

  
  if ( slidesWrapper.length > 0 ) {
    var primaryNav = $('.cd-primary-nav'),
      sliderNav = $('.cd-slider-nav'),
      navigationMarker = $('.cd-marker'),
      slidesNumber = slidesWrapper.children('li').length,
      visibleSlidePosition = 0,
      autoPlayId,
      autoPlayDelay = 5000;

    
    uploadVideo(slidesWrapper);
    setAutoplay(slidesWrapper, slidesNumber, autoPlayDelay);
    primaryNav.on('click', function(event){
      if($(event.target).is('.cd-primary-nav')) $(this).children('ul').toggleClass('is-visible');
    });
    sliderNav.on('click', 'li', function(event){
      event.preventDefault();
      var selectedItem = $(this);
      if(!selectedItem.hasClass('selected')) {
        var selectedPosition = selectedItem.index(),
          activePosition = slidesWrapper.find('li.selected').index();
        
        if( activePosition < selectedPosition) {
          nextSlide(slidesWrapper.find('.selected'), slidesWrapper, sliderNav, selectedPosition);
        } else {
          prevSlide(slidesWrapper.find('.selected'), slidesWrapper, sliderNav, selectedPosition);
        }

        
        visibleSlidePosition = selectedPosition;

        updateSliderNavigation(sliderNav, selectedPosition);
        updateNavigationMarker(navigationMarker, selectedPosition+1);
        
        setAutoplay(slidesWrapper, slidesNumber, autoPlayDelay);
      }
    });
  }

  function nextSlide(visibleSlide, container, pagination, n){
    visibleSlide.removeClass('selected from-left from-right').addClass('is-moving').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
      visibleSlide.removeClass('is-moving');
    });

    container.children('li').eq(n).addClass('selected from-right').prevAll().addClass('move-left');
    checkVideo(visibleSlide, container, n);
  }

  function prevSlide(visibleSlide, container, pagination, n){
    visibleSlide.removeClass('selected from-left from-right').addClass('is-moving').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
      visibleSlide.removeClass('is-moving');
    });

    container.children('li').eq(n).addClass('selected from-left').removeClass('move-left').nextAll().removeClass('move-left');
    checkVideo(visibleSlide, container, n);
  }

  function updateSliderNavigation(pagination, n) {
    var navigationDot = pagination.find('.selected');
    navigationDot.removeClass('selected');
    pagination.find('li').eq(n).addClass('selected');
  }

  function setAutoplay(wrapper, length, delay) {
    if(wrapper.hasClass('autoplay')) {
      clearInterval(autoPlayId);
      autoPlayId = window.setInterval(function(){autoplaySlider(length)}, delay);
    }
  }

  function autoplaySlider(length) {
    if( visibleSlidePosition < length - 1) {
      nextSlide(slidesWrapper.find('.selected'), slidesWrapper, sliderNav, visibleSlidePosition + 1);
      visibleSlidePosition +=1;
    } else {
      prevSlide(slidesWrapper.find('.selected'), slidesWrapper, sliderNav, 0);
      visibleSlidePosition = 0;
    }
    updateNavigationMarker(navigationMarker, visibleSlidePosition+1);
    updateSliderNavigation(sliderNav, visibleSlidePosition);
  }

  function uploadVideo(container) {
    container.find('.cd-bg-video-wrapper').each(function(){
      var videoWrapper = $(this);
      if( videoWrapper.is(':visible') ) {
         
        var videoUrl = videoWrapper.data('video'),
          video = $('<video loop><source src="'+videoUrl+'.mp4" type="video/mp4" /><source src="'+videoUrl+'.webm" type="video/webm" /></video>');
        video.appendTo(videoWrapper);
        
        if(videoWrapper.parent('.cd-bg-video.selected').length > 0) video.get(0).play();
      }
    });
  }

  function checkVideo(hiddenSlide, container, n) {
    
    var hiddenVideo = hiddenSlide.find('video');
    if( hiddenVideo.length > 0 ) hiddenVideo.get(0).pause();

    
    var visibleVideo = container.children('li').eq(n).find('video');
    if( visibleVideo.length > 0 ) visibleVideo.get(0).play();
  }

  function updateNavigationMarker(marker, n) {
    marker.removeClassPrefix('item').addClass('item-'+n);
  }

  $.fn.removeClassPrefix = function(prefix) {
    
      this.each(function(i, el) {
          var classes = el.className.split(" ").filter(function(c) {
              return c.lastIndexOf(prefix, 0) !== 0;
          });
          el.className = $.trim(classes.join(" "));
      });
      return this;
  };
});
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        
        root.lightbox = factory(root.jQuery);
    }
}(this, function ($) {

  function Lightbox(options) {
    this.album = [];
    this.currentImageIndex = void 0;
    this.init();

    
    this.options = $.extend({}, this.constructor.defaults);
    this.option(options);
  }

  Lightbox.defaults = {
    albumLabel: 'Image %1 of %2',
    alwaysShowNavOnTouchDevices: false,
    fadeDuration: 600,
    fitImagesInViewport: true,
    imageFadeDuration: 600,
    // maxWidth: 800,
    // maxHeight: 600,
    positionFromTop: 50,
    resizeDuration: 700,
    showImageNumberLabel: true,
    wrapAround: false,
    disableScrolling: false,
    sanitizeTitle: false
  };

  Lightbox.prototype.option = function(options) {
    $.extend(this.options, options);
  };

  Lightbox.prototype.imageCountLabel = function(currentImageNum, totalImages) {
    return this.options.albumLabel.replace(/%1/g, currentImageNum).replace(/%2/g, totalImages);
  };

  Lightbox.prototype.init = function() {
    var self = this;
    
    $(document).ready(function() {
      self.enable();
      self.build();
    });
  };

  Lightbox.prototype.enable = function() {
    var self = this;
    $('body').on('click', 'a[rel^=lightbox], area[rel^=lightbox], a[data-lightbox], area[data-lightbox]', function(event) {
      self.start($(event.currentTarget));
      return false;
    });
  };
  Lightbox.prototype.build = function() {
    var self = this;
    $('<div id="lightboxOverlay" class="lightboxOverlay"></div><div id="lightbox" class="lightbox"><div class="lb-outerContainer"><div class="lb-container"><img class="lb-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" /><div class="lb-nav"><a class="lb-prev" href="" ></a><a class="lb-next" href="" ></a></div><div class="lb-loader"><a class="lb-cancel"></a></div></div></div><div class="lb-dataContainer"><div class="lb-data"><div class="lb-details"><span class="lb-caption"></span><span class="lb-number"></span></div><div class="lb-closeContainer"><a class="lb-close"></a></div></div></div></div>').appendTo($('body'));

    this.$lightbox       = $('#lightbox');
    this.$overlay        = $('#lightboxOverlay');
    this.$outerContainer = this.$lightbox.find('.lb-outerContainer');
    this.$container      = this.$lightbox.find('.lb-container');
    this.$image          = this.$lightbox.find('.lb-image');
    this.$nav            = this.$lightbox.find('.lb-nav');

    this.containerPadding = {
      top: parseInt(this.$container.css('padding-top'), 10),
      right: parseInt(this.$container.css('padding-right'), 10),
      bottom: parseInt(this.$container.css('padding-bottom'), 10),
      left: parseInt(this.$container.css('padding-left'), 10)
    };

    this.imageBorderWidth = {
      top: parseInt(this.$image.css('border-top-width'), 10),
      right: parseInt(this.$image.css('border-right-width'), 10),
      bottom: parseInt(this.$image.css('border-bottom-width'), 10),
      left: parseInt(this.$image.css('border-left-width'), 10)
    };

    this.$overlay.hide().on('click', function() {
      self.end();
      return false;
    });

    this.$lightbox.hide().on('click', function(event) {
      if ($(event.target).attr('id') === 'lightbox') {
        self.end();
      }
      return false;
    });

    this.$outerContainer.on('click', function(event) {
      if ($(event.target).attr('id') === 'lightbox') {
        self.end();
      }
      return false;
    });

    this.$lightbox.find('.lb-prev').on('click', function() {
      if (self.currentImageIndex === 0) {
        self.changeImage(self.album.length - 1);
      } else {
        self.changeImage(self.currentImageIndex - 1);
      }
      return false;
    });

    this.$lightbox.find('.lb-next').on('click', function() {
      if (self.currentImageIndex === self.album.length - 1) {
        self.changeImage(0);
      } else {
        self.changeImage(self.currentImageIndex + 1);
      }
      return false;
    });

    this.$nav.on('mousedown', function(event) {
      if (event.which === 3) {
        self.$nav.css('pointer-events', 'none');

        self.$lightbox.one('contextmenu', function() {
          setTimeout(function() {
              this.$nav.css('pointer-events', 'auto');
          }.bind(self), 0);
        });
      }
    });


    this.$lightbox.find('.lb-loader, .lb-close').on('click', function() {
      self.end();
      return false;
    });
  };

  
  Lightbox.prototype.start = function($link) {
    var self    = this;
    var $window = $(window);

    $window.on('resize', $.proxy(this.sizeOverlay, this));

    $('select, object, embed').css({
      visibility: 'hidden'
    });

    this.sizeOverlay();

    this.album = [];
    var imageNumber = 0;

    function addToAlbum($link) {
      self.album.push({
        link: $link.attr('href'),
        title: $link.attr('data-title') || $link.attr('title')
      });
    }

    
    var dataLightboxValue = $link.attr('data-lightbox');
    var $links;

    if (dataLightboxValue) {
      $links = $($link.prop('tagName') + '[data-lightbox="' + dataLightboxValue + '"]');
      for (var i = 0; i < $links.length; i = ++i) {
        addToAlbum($($links[i]));
        if ($links[i] === $link[0]) {
          imageNumber = i;
        }
      }
    } else {
      if ($link.attr('rel') === 'lightbox') {
        
        addToAlbum($link);
      } else {
        
        $links = $($link.prop('tagName') + '[rel="' + $link.attr('rel') + '"]');
        for (var j = 0; j < $links.length; j = ++j) {
          addToAlbum($($links[j]));
          if ($links[j] === $link[0]) {
            imageNumber = j;
          }
        }
      }
    }

    
    var top  = $window.scrollTop() + this.options.positionFromTop;
    var left = $window.scrollLeft();
    this.$lightbox.css({
      top: top + 'px',
      left: left + 'px'
    }).fadeIn(this.options.fadeDuration);

    
    if (this.options.disableScrolling) {
      $('body').addClass('lb-disable-scrolling');
    }

    this.changeImage(imageNumber);
  };

  
  Lightbox.prototype.changeImage = function(imageNumber) {
    var self = this;

    this.disableKeyboardNav();
    var $image = this.$lightbox.find('.lb-image');

    this.$overlay.fadeIn(this.options.fadeDuration);

    $('.lb-loader').fadeIn('slow');
    this.$lightbox.find('.lb-image, .lb-nav, .lb-prev, .lb-next, .lb-dataContainer, .lb-numbers, .lb-caption').hide();

    this.$outerContainer.addClass('animating');

    
    var preloader = new Image();
    preloader.onload = function() {
      var $preloader;
      var imageHeight;
      var imageWidth;
      var maxImageHeight;
      var maxImageWidth;
      var windowHeight;
      var windowWidth;

      $image.attr('src', self.album[imageNumber].link);

      $preloader = $(preloader);

      $image.width(preloader.width);
      $image.height(preloader.height);

      if (self.options.fitImagesInViewport) {
        windowWidth    = $(window).width();
        windowHeight   = $(window).height();
        maxImageWidth  = windowWidth - self.containerPadding.left - self.containerPadding.right - self.imageBorderWidth.left - self.imageBorderWidth.right - 20;
        maxImageHeight = windowHeight - self.containerPadding.top - self.containerPadding.bottom - self.imageBorderWidth.top - self.imageBorderWidth.bottom - 120;

        
        if (self.options.maxWidth && self.options.maxWidth < maxImageWidth) {
          maxImageWidth = self.options.maxWidth;
        }
        if (self.options.maxHeight && self.options.maxHeight < maxImageWidth) {
          maxImageHeight = self.options.maxHeight;
        }

        
        if ((preloader.width > maxImageWidth) || (preloader.height > maxImageHeight)) {
          if ((preloader.width / maxImageWidth) > (preloader.height / maxImageHeight)) {
            imageWidth  = maxImageWidth;
            imageHeight = parseInt(preloader.height / (preloader.width / imageWidth), 10);
            $image.width(imageWidth);
            $image.height(imageHeight);
          } else {
            imageHeight = maxImageHeight;
            imageWidth = parseInt(preloader.width / (preloader.height / imageHeight), 10);
            $image.width(imageWidth);
            $image.height(imageHeight);
          }
        }
      }
      self.sizeContainer($image.width(), $image.height());
    };

    preloader.src          = this.album[imageNumber].link;
    this.currentImageIndex = imageNumber;
  };

  
  Lightbox.prototype.sizeOverlay = function() {
    this.$overlay
      .width($(document).width())
      .height($(document).height());
  };

  
  Lightbox.prototype.sizeContainer = function(imageWidth, imageHeight) {
    var self = this;

    var oldWidth  = this.$outerContainer.outerWidth();
    var oldHeight = this.$outerContainer.outerHeight();
    var newWidth  = imageWidth + this.containerPadding.left + this.containerPadding.right + this.imageBorderWidth.left + this.imageBorderWidth.right;
    var newHeight = imageHeight + this.containerPadding.top + this.containerPadding.bottom + this.imageBorderWidth.top + this.imageBorderWidth.bottom;

    function postResize() {
      self.$lightbox.find('.lb-dataContainer').width(newWidth);
      self.$lightbox.find('.lb-prevLink').height(newHeight);
      self.$lightbox.find('.lb-nextLink').height(newHeight);
      self.showImage();
    }

    if (oldWidth !== newWidth || oldHeight !== newHeight) {
      this.$outerContainer.animate({
        width: newWidth,
        height: newHeight
      }, this.options.resizeDuration, 'swing', function() {
        postResize();
      });
    } else {
      postResize();
    }
  };

  
  Lightbox.prototype.showImage = function() {
    this.$lightbox.find('.lb-loader').stop(true).hide();
    this.$lightbox.find('.lb-image').fadeIn(this.options.imageFadeDuration);

    this.updateNav();
    this.updateDetails();
    this.preloadNeighboringImages();
    this.enableKeyboardNav();
  };

  
  Lightbox.prototype.updateNav = function() {
    var alwaysShowNav = false;
    try {
      document.createEvent('TouchEvent');
      alwaysShowNav = (this.options.alwaysShowNavOnTouchDevices) ? true : false;
    } catch (e) {}

    this.$lightbox.find('.lb-nav').show();

    if (this.album.length > 1) {
      if (this.options.wrapAround) {
        if (alwaysShowNav) {
          this.$lightbox.find('.lb-prev, .lb-next').css('opacity', '1');
        }
        this.$lightbox.find('.lb-prev, .lb-next').show();
      } else {
        if (this.currentImageIndex > 0) {
          this.$lightbox.find('.lb-prev').show();
          if (alwaysShowNav) {
            this.$lightbox.find('.lb-prev').css('opacity', '1');
          }
        }
        if (this.currentImageIndex < this.album.length - 1) {
          this.$lightbox.find('.lb-next').show();
          if (alwaysShowNav) {
            this.$lightbox.find('.lb-next').css('opacity', '1');
          }
        }
      }
    }
  };

  
  Lightbox.prototype.updateDetails = function() {
    var self = this;

    if (typeof this.album[this.currentImageIndex].title !== 'undefined' &&
      this.album[this.currentImageIndex].title !== '') {
      var $caption = this.$lightbox.find('.lb-caption');
      if (this.options.sanitizeTitle) {
        $caption.text(this.album[this.currentImageIndex].title);
      } else {
        $caption.html(this.album[this.currentImageIndex].title);
      }
      $caption.fadeIn('fast')
        .find('a').on('click', function(event) {
          if ($(this).attr('target') !== undefined) {
            window.open($(this).attr('href'), $(this).attr('target'));
          } else {
            location.href = $(this).attr('href');
          }
        });
    }

    if (this.album.length > 1 && this.options.showImageNumberLabel) {
      var labelText = this.imageCountLabel(this.currentImageIndex + 1, this.album.length);
      this.$lightbox.find('.lb-number').text(labelText).fadeIn('fast');
    } else {
      this.$lightbox.find('.lb-number').hide();
    }

    this.$outerContainer.removeClass('animating');

    this.$lightbox.find('.lb-dataContainer').fadeIn(this.options.resizeDuration, function() {
      return self.sizeOverlay();
    });
  };

  
  Lightbox.prototype.preloadNeighboringImages = function() {
    if (this.album.length > this.currentImageIndex + 1) {
      var preloadNext = new Image();
      preloadNext.src = this.album[this.currentImageIndex + 1].link;
    }
    if (this.currentImageIndex > 0) {
      var preloadPrev = new Image();
      preloadPrev.src = this.album[this.currentImageIndex - 1].link;
    }
  };

  Lightbox.prototype.enableKeyboardNav = function() {
    $(document).on('keyup.keyboard', $.proxy(this.keyboardAction, this));
  };

  Lightbox.prototype.disableKeyboardNav = function() {
    $(document).off('.keyboard');
  };

  Lightbox.prototype.keyboardAction = function(event) {
    var KEYCODE_ESC        = 27;
    var KEYCODE_LEFTARROW  = 37;
    var KEYCODE_RIGHTARROW = 39;

    var keycode = event.keyCode;
    var key     = String.fromCharCode(keycode).toLowerCase();
    if (keycode === KEYCODE_ESC || key.match(/x|o|c/)) {
      this.end();
    } else if (key === 'p' || keycode === KEYCODE_LEFTARROW) {
      if (this.currentImageIndex !== 0) {
        this.changeImage(this.currentImageIndex - 1);
      } else if (this.options.wrapAround && this.album.length > 1) {
        this.changeImage(this.album.length - 1);
      }
    } else if (key === 'n' || keycode === KEYCODE_RIGHTARROW) {
      if (this.currentImageIndex !== this.album.length - 1) {
        this.changeImage(this.currentImageIndex + 1);
      } else if (this.options.wrapAround && this.album.length > 1) {
        this.changeImage(0);
      }
    }
  };

  // Closing time. :-(
  Lightbox.prototype.end = function() {
    this.disableKeyboardNav();
    $(window).off('resize', this.sizeOverlay);
    this.$lightbox.fadeOut(this.options.fadeDuration);
    this.$overlay.fadeOut(this.options.fadeDuration);
    $('select, object, embed').css({
      visibility: 'visible'
    });
    if (this.options.disableScrolling) {
      $('body').removeClass('lb-disable-scrolling');
    }
  };

  return new Lightbox();
}));

(function($){
    
     
    var methods = {

        
    
        init: function(settings){

            return this.each(function(){
                
                var browser = window.navigator.appVersion.match(/Chrome\/(\d+)\./),
                    ver = browser ? parseInt(browser[1], 10) : false,
                    chromeFix = function(id){
                        var grid = document.getElementById(id),
                            parent = grid.parentElement,
                            placeholder = document.createElement('div'),
                            frag = document.createDocumentFragment();

                        parent.insertBefore(placeholder, grid);  
                        frag.appendChild(grid);
                        parent.replaceChild(grid, placeholder);
                        frag = null;
                        placeholder = null;
                    };
                
                if(ver && ver == 31 || ver == 32){
                    chromeFix(this.id);
                };
                
                

                var config = {
                    
                    
                    
                    targetSelector : '.mix',
                    filterSelector : '.filter',
                    sortSelector : '.sort',
                    buttonEvent: 'click',
                    effects : ['fade', 'scale'],
                    listEffects : null,
                    easing : 'smooth',
                    layoutMode: 'grid',
                    targetDisplayGrid : 'inline-block',
                    targetDisplayList: 'block',
                    listClass : '',
                    gridClass : '',
                    transitionSpeed : 600,
                    showOnLoad : 'all',
                    sortOnLoad : false,
                    multiFilter : false,
                    filterLogic : 'or',
                    resizeContainer : true,
                    minHeight : 0,
                    failClass : 'fail',
                    perspectiveDistance : '3000',
                    perspectiveOrigin : '50% 50%',
                    animateGridList : true,
                    onMixLoad: null,
                    onMixStart : null,
                    onMixEnd : null,

                    // MISC

                    container : null,
                    origOrder : [],
                    startOrder : [],
                    newOrder : [],
                    origSort: [],
                    checkSort: [],
                    filter : '',
                    mixing : false,
                    origDisplay : '',
                    origLayout: '',
                    origHeight : 0, 
                    newHeight : 0,
                    isTouch : false,
                    resetDelay : 0,
                    failsafe : null,

                    // CSS
                    
                    prefix : '',
                    easingFallback : 'ease-in-out',
                    transition : {}, 
                    perspective : {}, 
                    clean : {},
                    fade : '1',
                    scale : '',
                    rotateX : '',
                    rotateY : '',
                    rotateZ : '',
                    blur : '',
                    grayscale : ''
                };
                
                if(settings){
                    $.extend(config, settings);
                };

                
                
                this.config = config;
                
                
                
                $.support.touch = 'ontouchend' in document;

                if ($.support.touch) {
                    config.isTouch = true;
                    config.resetDelay = 350;
                };
                
                
    
                config.container = $(this);
                var $cont = config.container;
                
                
                
                config.prefix = prefix($cont[0]);
                config.prefix = config.prefix ? '-'+config.prefix.toLowerCase()+'-' : '';
                
                
            
                $cont.find(config.targetSelector).each(function(){
                    config.origOrder.push($(this));
                });
                
                 
                
                if(config.sortOnLoad){
                    var sortby, order;
                    if($.isArray(config.sortOnLoad)){
                        sortby = config.sortOnLoad[0], order = config.sortOnLoad[1];
                        $(config.sortSelector+'[data-sort='+config.sortOnLoad[0]+'][data-order='+config.sortOnLoad[1]+']').addClass('active');
                    } else {
                        $(config.sortSelector+'[data-sort='+config.sortOnLoad+']').addClass('active');
                        sortby = config.sortOnLoad, config.sortOnLoad = 'desc';
                    };
                    sort(sortby, order, $cont, config);
                };
                
                
                
                for(var i = 0; i<2; i++){
                    var a = i==0 ? a = config.prefix : '';
                    config.transition[a+'transition'] = 'all '+config.transitionSpeed+'ms ease-in-out';
                    config.perspective[a+'perspective'] = config.perspectiveDistance+'px';
                    config.perspective[a+'perspective-origin'] = config.perspectiveOrigin;
                };
                
                
                
                for(var i = 0; i<2; i++){
                    var a = i==0 ? a = config.prefix : '';
                    config.clean[a+'transition'] = 'none';
                };
    
                
    
                if(config.layoutMode == 'list'){
                    $cont.addClass(config.listClass);
                    config.origDisplay = config.targetDisplayList;
                } else {
                    $cont.addClass(config.gridClass);
                    config.origDisplay = config.targetDisplayGrid;
                };
                config.origLayout = config.layoutMode;
                
                
                
                var showOnLoadArray = config.showOnLoad.split(' ');
                
                
                
                $.each(showOnLoadArray, function(){
                    $(config.filterSelector+'[data-filter="'+this+'"]').addClass('active');
                });
                
                
    
                $cont.find(config.targetSelector).addClass('mix_all');
                if(showOnLoadArray[0]  == 'all'){
                    showOnLoadArray[0] = 'mix_all',
                    config.showOnLoad = 'mix_all';
                };
                
                
                
                var $showOnLoad = $();
                $.each(showOnLoadArray, function(){
                    $showOnLoad = $showOnLoad.add($('.'+this))
                });
                
                $showOnLoad.each(function(){
                    var $t = $(this);
                    if(config.layoutMode == 'list'){
                        $t.css('display',config.targetDisplayList);
                    } else {
                        $t.css('display',config.targetDisplayGrid);
                    };
                    $t.css(config.transition);
                });
                
                
                
                var delay = setTimeout(function(){
                    
                    config.mixing = true;
                    
                    $showOnLoad.css('opacity','1');
                    
                    
                    
                    var reset = setTimeout(function(){
                        if(config.layoutMode == 'list'){
                            $showOnLoad.removeStyle(config.prefix+'transition, transition').css({
                                display: config.targetDisplayList,
                                opacity: 1
                            });
                        } else {
                            $showOnLoad.removeStyle(config.prefix+'transition, transition').css({
                                display: config.targetDisplayGrid,
                                opacity: 1
                            });
                        };
                        
                        
                        
                        config.mixing = false;

                        if(typeof config.onMixLoad == 'function') {
                            var output = config.onMixLoad.call(this, config);

                            

                            config = output ? output : config;
                        };
                        
                    },config.transitionSpeed);
                },10);
                
                
                
                config.filter = config.showOnLoad;
            
                            
                $(config.sortSelector).bind(config.buttonEvent,function(){
                    
                    if(!config.mixing){
                        
                        
                        
                        var $t = $(this),
                        sortby = $t.attr('data-sort'),
                        order = $t.attr('data-order');
                        
                        if(!$t.hasClass('active')){
                            $(config.sortSelector).removeClass('active');
                            $t.addClass('active');
                        } else {
                            if(sortby != 'random')return false;
                        };
                        
                        $cont.find(config.targetSelector).each(function(){
                            config.startOrder.push($(this));
                        });
                
                        goMix(config.filter,sortby,order,$cont, config);
                
                    };
                
                });

                

                $(config.filterSelector).bind(config.buttonEvent,function(){
                
                    if(!config.mixing){
                        
                        var $t = $(this);
                        
                        
        
                        if(config.multiFilter == false){
                            
                            
                            
                            $(config.filterSelector).removeClass('active');
                            $t.addClass('active');
                        
                            config.filter = $t.attr('data-filter');
                        
                            $(config.filterSelector+'[data-filter="'+config.filter+'"]').addClass('active');

                        } else {
                        
                            
                            
                            var thisFilter = $t.attr('data-filter'); 
                        
                            if($t.hasClass('active')){
                                $t.removeClass('active');
                                
                                
                                
                                var re = new RegExp('(\\s|^)'+thisFilter);
                                config.filter = config.filter.replace(re,'');
                            } else {
                                
                                
                                
                                $t.addClass('active');
                                config.filter = config.filter+' '+thisFilter;
                                
                            };
                        };
                        
                        
                        
                        goMix(config.filter, null, null, $cont, config);

                    };
                
                });
                    
            });
        },
    
        
    
        toGrid: function(){
            return this.each(function(){
                var config = this.config;
                if(config.layoutMode != 'grid'){
                    config.layoutMode = 'grid';
                    goMix(config.filter, null, null, $(this), config);
                };
            });
        },
    
        
    
        toList: function(){
            return this.each(function(){
                var config = this.config;
                if(config.layoutMode != 'list'){
                    config.layoutMode = 'list';
                    goMix(config.filter, null, null, $(this), config);
                };
            });
        },
    
        
    
        filter: function(arg){
            return this.each(function(){
                var config = this.config;
                if(!config.mixing){ 
                    $(config.filterSelector).removeClass('active');
                    $(config.filterSelector+'[data-filter="'+arg+'"]').addClass('active');
                    goMix(arg, null, null, $(this), config);
                };
            }); 
        },
    
        
    
        sort: function(args){
            return this.each(function(){
                var config = this.config,
                    $t = $(this);
                if(!config.mixing){
                    $(config.sortSelector).removeClass('active');
                    if($.isArray(args)){
                        var sortby = args[0], order = args[1];
                        $(config.sortSelector+'[data-sort="'+args[0]+'"][data-order="'+args[1]+'"]').addClass('active');
                    } else {
                        $(config.sortSelector+'[data-sort="'+args+'"]').addClass('active');
                        var sortby = args, order = 'desc';
                    };
                    $t.find(config.targetSelector).each(function(){
                        config.startOrder.push($(this));
                    });
                    
                    goMix(config.filter,sortby,order, $t, config);
                
                };
            });
        },
        
        
        
        multimix: function(args){
            return this.each(function(){
                var config = this.config,
                    $t = $(this);
                    multiOut = {
                        filter: config.filter,
                        sort: null,
                        order: 'desc',
                        layoutMode: config.layoutMode
                    };
                $.extend(multiOut, args);
                if(!config.mixing){
                    $(config.filterSelector).add(config.sortSelector).removeClass('active');
                    $(config.filterSelector+'[data-filter="'+multiOut.filter+'"]').addClass('active');
                    if(typeof multiOut.sort !== 'undefined'){
                        $(config.sortSelector+'[data-sort="'+multiOut.sort+'"][data-order="'+multiOut.order+'"]').addClass('active');
                        $t.find(config.targetSelector).each(function(){
                            config.startOrder.push($(this));
                        });
                    };
                    config.layoutMode = multiOut.layoutMode;
                    goMix(multiOut.filter,multiOut.sort,multiOut.order, $t, config);
                };
            });
        },
        
        

        remix: function(arg){
            return this.each(function(){
                var config = this.config,
                    $t = $(this);   
                config.origOrder = [];
                $t.find(config.targetSelector).each(function(){
                    var $th = $(this);
                    $th.addClass('mix_all'); 
                    config.origOrder.push($th);
                });
                if(!config.mixing && typeof arg !== 'undefined'){
                    $(config.filterSelector).removeClass('active');
                    $(config.filterSelector+'[data-filter="'+arg+'"]').addClass('active');
                    goMix(arg, null, null, $t, config);
                };
            });
        }
    };
    
    

    $.fn.mixitup = function(method, arg){
        if (methods[method]) {
            return methods[method].apply( this, Array.prototype.slice.call(arguments,1));
        } else if (typeof method === 'object' || ! method){
            return methods.init.apply( this, arguments );
        };
    };
    
    
    
    function goMix(filter, sortby, order, $cont, config){
        
        

        clearInterval(config.failsafe);
        config.mixing = true;   
        
        
        
        config.filter = filter;
        
        
        
        if(typeof config.onMixStart == 'function') {
            var output = config.onMixStart.call(this, config);
            
            
            
            config = output ? output : config;
        };
        
          
        var speed = config.transitionSpeed;
        
        
        
        for(var i = 0; i<2; i++){
            var a = i==0 ? a = config.prefix : '';
            config.transition[a+'transition'] = 'all '+speed+'ms linear';
            config.transition[a+'transform'] = a+'translate3d(0,0,0)';
            config.perspective[a+'perspective'] = config.perspectiveDistance+'px';
            config.perspective[a+'perspective-origin'] = config.perspectiveOrigin;
        };
        
        
        
        var mixSelector = config.targetSelector,
        $targets = $cont.find(mixSelector);
        
        
        
        $targets.each(function(){
            this.data = {};
        });
        
         
        
        var $par = $targets.parent();
    
         
        
        $par.css(config.perspective);
        
        
        config.easingFallback = 'ease-in-out';
        if(config.easing == 'smooth')config.easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        if(config.easing == 'snap')config.easing = 'cubic-bezier(0.77, 0, 0.175, 1)';
        if(config.easing == 'windback'){
            config.easing = 'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
            config.easingFallback = 'cubic-bezier(0.175, 0.885, 0.320, 1)'; // Fall-back for old webkit, with no values > 1 or < 1
        };
        if(config.easing == 'windup'){
            config.easing = 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
            config.easingFallback = 'cubic-bezier(0.6, 0.28, 0.735, 0.045)';
        };
        
        
        
        var effectsOut = config.layoutMode == 'list' && config.listEffects != null ? config.listEffects : config.effects;
    
        
    
        if (Array.prototype.indexOf){
            config.fade = effectsOut.indexOf('fade') > -1 ? '0' : '';
            config.scale = effectsOut.indexOf('scale') > -1 ? 'scale(.01)' : '';
            config.rotateZ = effectsOut.indexOf('rotateZ') > -1 ? 'rotate(180deg)' : '';
            config.rotateY = effectsOut.indexOf('rotateY') > -1 ? 'rotateY(90deg)' : '';
            config.rotateX = effectsOut.indexOf('rotateX') > -1 ? 'rotateX(90deg)' : '';
            config.blur = effectsOut.indexOf('blur') > -1 ? 'blur(8px)' : '';
            config.grayscale = effectsOut.indexOf('grayscale') > -1 ? 'grayscale(100%)' : '';
        };
        
        
        
        var $show = $(), 
        $hide = $(),
        filterArray = [],
        multiDimensional = false;
        
                
        if(typeof filter === 'string'){
            
            
            
            filterArray = buildFilterArray(filter);
            
        } else {
            
            
            
            multiDimensional = true;
            
            $.each(filter,function(i){
                filterArray[i] = buildFilterArray(this);
            });
        };

        
        
        if(config.filterLogic == 'or'){
            
            if(filterArray[0] == '') filterArray.shift(); 
            
            
        
            if(filterArray.length < 1){
                
                $hide = $hide.add($cont.find(mixSelector+':visible'));
                
            } else {

            
            
                $targets.each(function(){
                    var $t = $(this);
                    if(!multiDimensional){
                        
                        if($t.is('.'+filterArray.join(', .'))){
                            $show = $show.add($t);
                        
                        } else {
                            $hide = $hide.add($t);
                        };
                    } else {
                        
                        var pass = 0;
                        
                        
                        $.each(filterArray,function(i){
                            if(this.length){
                                if($t.is('.'+this.join(', .'))){
                                    pass++
                                };
                            } else if(pass > 0){
                                pass++;
                            };
                        });
                        
                        if(pass == filterArray.length){
                            $show = $show.add($t);
                        
                        } else {
                            $hide = $hide.add($t);
                        };
                    };
                });
            
            };
    
        } else {
            
            $show = $show.add($par.find(mixSelector+'.'+filterArray.join('.')));
            
            
            
            $hide = $hide.add($par.find(mixSelector+':not(.'+filterArray.join('.')+'):visible'));
        };
        
        
        
        var total = $show.length;
        
        

        var $tohide = $(),
        $toshow = $(),
        $pre = $();
        
        
        $hide.each(function(){
            var $t = $(this);
            if($t.css('display') != 'none'){
                $tohide = $tohide.add($t);
                $pre = $pre.add($t);
            };
        });
        
        
        
        if($show.filter(':visible').length == total && !$tohide.length && !sortby){
            
            if(config.origLayout == config.layoutMode){
                
                

                resetFilter();
                return false;
            } else {
                
                
            
                if($show.length == 1){ 
                    
                    if(config.layoutMode == 'list'){ 
                        $cont.addClass(config.listClass);
                        $cont.removeClass(config.gridClass);
                        $pre.css('display',config.targetDisplayList);
                    } else {
                        $cont.addClass(config.gridClass);
                        $cont.removeClass(config.listClass);
                        $pre.css('display',config.targetDisplayGrid);
                    };
                    
                    

                    resetFilter();
                    return false;
                }
            };
        };
        
        

        config.origHeight = $par.height();
        
        

        if($show.length){
            
                        
            $cont.removeClass(config.failClass);
            
            
            
            

            $show.each(function(){ 
                var $t = $(this);
                if($t.css('display') == 'none'){
                    $toshow = $toshow.add($t)
                } else {
                    $pre = $pre.add($t);
                };
            });
    
            
        
            if((config.origLayout != config.layoutMode) && config.animateGridList == false){ 
            
                
                
                if(config.layoutMode == 'list'){ 
                    $cont.addClass(config.listClass);
                    $cont.removeClass(config.gridClass);
                    $pre.css('display',config.targetDisplayList);
                } else {
                    $cont.addClass(config.gridClass);
                    $cont.removeClass(config.listClass);
                    $pre.css('display',config.targetDisplayGrid);
                };
                
                resetFilter();
                return false;
            };
            
            
        
            if(!window.atob){
                resetFilter();
                return false;
            };
            
            
            
            $targets.css(config.clean);
            
            
            
            $pre.each(function(){
                this.data.origPos = $(this).offset();
            });
    
            
            
    
            if(config.layoutMode == 'list'){
                $cont.addClass(config.listClass);
                $cont.removeClass(config.gridClass);
                $toshow.css('display',config.targetDisplayList);
            } else {
                $cont.addClass(config.gridClass);
                $cont.removeClass(config.listClass);
                $toshow.css('display',config.targetDisplayGrid);
            };
            
            
    
            $toshow.each(function(){
                this.data.showInterPos = $(this).offset();
            });
            
            
            

            $tohide.each(function(){
                this.data.hideInterPos = $(this).offset();
            });
            
            
    
            $pre.each(function(){
                this.data.preInterPos = $(this).offset();
            });
            
            
    
            if(config.layoutMode == 'list'){
                $pre.css('display',config.targetDisplayList);
            } else {
                $pre.css('display',config.targetDisplayGrid);
            };
            
                        
            if(sortby){
                sort(sortby, order, $cont, config); 
            };
            
                    
            if(sortby && compareArr(config.origSort, config.checkSort)){
                
                
                resetFilter();
                return false;
            };
            
            
            $tohide.hide();
            
             
                        
            $toshow.each(function(i){
                this.data.finalPos = $(this).offset();
            });
            
            
            
    
            $pre.each(function(){
                this.data.finalPrePos = $(this).offset();
            });
            
            
    
            config.newHeight = $par.height();
            
            
            
            if(sortby){
                sort('reset', null, $cont, config);
            };
            
            
            
            $toshow.hide();
            
             
            
            
            $pre.css('display',config.origDisplay);
            
                
            if(config.origDisplay == 'block'){
                $cont.addClass(config.listClass);
                $toshow.css('display', config.targetDisplayList);
            } else {
                $cont.removeClass(config.listClass);
                $toshow.css('display', config.targetDisplayGrid);
            };
            
            
        
            if(config.resizeContainer)$par.css('height', config.origHeight+'px');
    
            
            
            var toShowCSS = {};
            
            for(var i = 0; i<2; i++){
                var a = i==0 ? a = config.prefix : '';
                toShowCSS[a+'transform'] = config.scale+' '+config.rotateX+' '+config.rotateY+' '+config.rotateZ;
                toShowCSS[a+'filter'] = config.blur+' '+config.grayscale;
            };
            
            $toshow.css(toShowCSS);
    
            
            
    
            $pre.each(function(){
                var data = this.data,
                $t = $(this);
                
                if ($t.hasClass('mix_tohide')){
                    data.preTX = data.origPos.left - data.hideInterPos.left;
                    data.preTY = data.origPos.top - data.hideInterPos.top;
                } else {
                    data.preTX = data.origPos.left - data.preInterPos.left;
                    data.preTY = data.origPos.top - data.preInterPos.top;
                };
                var preCSS = {};
                for(var i = 0; i<2; i++){
                    var a = i==0 ? a = config.prefix : '';
                    preCSS[a+'transform'] = 'translate('+data.preTX+'px,'+data.preTY+'px)';
                };
                
                $t.css(preCSS); 
            });
            
            
    
            if(config.layoutMode == 'list'){
                $cont.addClass(config.listClass);
                $cont.removeClass(config.gridClass);
            } else {
                $cont.addClass(config.gridClass);
                $cont.removeClass(config.listClass);
            };
            
            
            
            var delay = setTimeout(function(){
        
                
                
                if(config.resizeContainer){
                    var containerCSS = {};
                    for(var i = 0; i<2; i++){
                        var a = i==0 ? a = config.prefix : '';
                        containerCSS[a+'transition'] = 'all '+speed+'ms ease-in-out';
                        containerCSS['height'] = config.newHeight+'px';
                    };
                    $par.css(containerCSS);
                };
    
                
                $tohide.css('opacity',config.fade);
                $toshow.css('opacity',1);
    
                
                $toshow.each(function(){
                    var data = this.data;
                    data.tX = data.finalPos.left - data.showInterPos.left;
                    data.tY = data.finalPos.top - data.showInterPos.top;
                    
                    var toShowCSS = {};
                    for(var i = 0; i<2; i++){
                        var a = i==0 ? a = config.prefix : '';
                        toShowCSS[a+'transition-property'] = a+'transform, '+a+'filter, opacity';
                        toShowCSS[a+'transition-timing-function'] = config.easing+', linear, linear';
                        toShowCSS[a+'transition-duration'] = speed+'ms';
                        toShowCSS[a+'transition-delay'] = '0';
                        toShowCSS[a+'transform'] = 'translate('+data.tX+'px,'+data.tY+'px)';
                        toShowCSS[a+'filter'] = 'none';
                    };
                    
                    $(this).css('-webkit-transition', 'all '+speed+'ms '+config.easingFallback).css(toShowCSS);
                });
                
                $pre.each(function(){
                    var data = this.data
                    data.tX = data.finalPrePos.left != 0 ? data.finalPrePos.left - data.preInterPos.left : 0;
                    data.tY = data.finalPrePos.left != 0 ? data.finalPrePos.top - data.preInterPos.top : 0;
                    
                    var preCSS = {};
                    for(var i = 0; i<2; i++){
                        var a = i==0 ? a = config.prefix : '';
                        preCSS[a+'transition'] = 'all '+speed+'ms '+config.easing;
                        preCSS[a+'transform'] = 'translate('+data.tX+'px,'+data.tY+'px)';
                    };
                    
                    $(this).css('-webkit-transition', 'all '+speed+'ms '+config.easingFallback).css(preCSS);
                });
        
                                
                var toHideCSS = {};
                for(var i = 0; i<2; i++){
                    var a = i==0 ? a = config.prefix : '';
                    toHideCSS[a+'transition'] = 'all '+speed+'ms '+config.easing+', '+a+'filter '+speed+'ms linear, opacity '+speed+'ms linear';
                    toHideCSS[a+'transform'] = config.scale+' '+config.rotateX+' '+config.rotateY+' '+config.rotateZ;
                    toHideCSS[a+'filter'] = config.blur+' '+config.grayscale;
                    toHideCSS['opacity'] = config.fade;
                };
                
                $tohide.css(toHideCSS);
                
                
                
                $par.bind('webkitTransitionEnd transitionend otransitionend oTransitionEnd',function(e){
                    
                    if (e.originalEvent.propertyName.indexOf('transform') > -1 || e.originalEvent.propertyName.indexOf('opacity') > -1){
                        
                        if(mixSelector.indexOf('.') > -1){
                        
                        
                        
                            if($(e.target).hasClass(mixSelector.replace('.',''))){
                                resetFilter();
                            };
                        
                        } else {
                            
                        
                        
                            if($(e.target).is(mixSelector)){
                                resetFilter();
                            };
                            
                        };
                        
                    };
                }); 
    
            },10);
            
                       
            config.failsafe = setTimeout(function(){
                if(config.mixing){
                    resetFilter();
                };
            }, speed + 400);
    
        } else {
            
        
        
            
    
            if(config.resizeContainer)$par.css('height', config.origHeight+'px');
            
                      
            if(!window.atob){
                resetFilter();
                return false;
            };
            
                        
            $tohide = $hide;
            
            
    
            var delay = setTimeout(function(){
                
                
    
                $par.css(config.perspective);
                
                
        
                if(config.resizeContainer){
                    var containerCSS = {};
                    for(var i = 0; i<2; i++){
                        var a = i==0 ? a = config.prefix : '';
                        containerCSS[a+'transition'] = 'height '+speed+'ms ease-in-out';
                        containerCSS['height'] = config.minHeight+'px';
                    };
                    $par.css(containerCSS);
                };
    
                
                
                $targets.css(config.transition);
                
                  
                var totalHide = $hide.length;
                
                
    
                if(totalHide){
                    
                    
                    var toHideCSS = {};
                    for(var i = 0; i<2; i++){
                        var a = i==0 ? a = config.prefix : '';
                        toHideCSS[a+'transform'] = config.scale+' '+config.rotateX+' '+config.rotateY+' '+config.rotateZ;
                        toHideCSS[a+'filter'] = config.blur+' '+config.grayscale;
                        toHideCSS['opacity'] = config.fade;
                    };

                    $tohide.css(toHideCSS);
                    
                    

                    $par.bind('webkitTransitionEnd transitionend otransitionend oTransitionEnd',function(e){
                        if (e.originalEvent.propertyName.indexOf('transform') > -1 || e.originalEvent.propertyName.indexOf('opacity') > -1){
                            $cont.addClass(config.failClass);
                            resetFilter();
                        };
                    });
        
                } else {
                    
                
                    
                    config.mixing = false;
                };
    
            }, 10);
        }; 
        
        

        function resetFilter(){
            
            
            
            $par.unbind('webkitTransitionEnd transitionend otransitionend oTransitionEnd');
            
            
            
            if(sortby){
                sort(sortby, order, $cont, config);
            };
            
                    
            config.startOrder = [], config.newOrder = [], config.origSort = [], config.checkSort = [];
        
            
            
            $targets.removeStyle(
                config.prefix+'filter, filter, '+config.prefix+'transform, transform, opacity, display'
            ).css(config.clean).removeAttr('data-checksum');
            
            
            
            if(!window.atob){
                $targets.css({
                    display: 'none',
                    opacity: '0'
                });
            };
            
                      
            var remH = config.resizeContainer ? 'height' : '';
            
            
        
            $par.removeStyle(
                config.prefix+'transition, transition, '+config.prefix+'perspective, perspective, '+config.prefix+'perspective-origin, perspective-origin, '+remH
            );
            
            if(config.layoutMode == 'list'){
                $show.css({display:config.targetDisplayList, opacity:'1'});
                config.origDisplay = config.targetDisplayList;
            } else {
                $show.css({display:config.targetDisplayGrid, opacity:'1'});
                config.origDisplay = config.targetDisplayGrid;
            };
            config.origLayout = config.layoutMode;
                
            var wait = setTimeout(function(){
                
                
                
                $targets.removeStyle(config.prefix+'transition, transition');
            
                
            
                config.mixing = false;
            
                
            
                if(typeof config.onMixEnd == 'function') {
                    var output = config.onMixEnd.call(this, config);
                
                    
                
                    config = output ? output : config;
                };
            });
        };
    };
    
       
    function sort(sortby, order, $cont, config){

        

        function compare(a,b) {
            var sortAttrA = isNaN(a.attr(sortby) * 1) ? a.attr(sortby).toLowerCase() : a.attr(sortby) * 1,
                sortAttrB = isNaN(b.attr(sortby) * 1) ? b.attr(sortby).toLowerCase() : b.attr(sortby) * 1;
            if (sortAttrA < sortAttrB)
                return -1;
            if (sortAttrA > sortAttrB)
                return 1;
            return 0;
        };
        
        
        function rebuild(element){
            if(order == 'asc'){
                $sortWrapper.prepend(element).prepend(' ');
            } else {
                $sortWrapper.append(element).append(' ');
            };
        };
        
        

        function arrayShuffle(oldArray){
            var newArray = oldArray.slice();
            var len = newArray.length;
            var i = len;
            while (i--){
                var p = parseInt(Math.random()*len);
                var t = newArray[i];
                newArray[i] = newArray[p];
                newArray[p] = t;
            };
            return newArray; 
        };
        
        
        
        $cont.find(config.targetSelector).wrapAll('<div class="mix_sorter"/>');
        
        var $sortWrapper = $cont.find('.mix_sorter');
        
        if(!config.origSort.length){
            $sortWrapper.find(config.targetSelector+':visible').each(function(){
                $(this).wrap('<s/>');
                config.origSort.push($(this).parent().html().replace(/\s+/g, ''));
                $(this).unwrap();
            });
        };
        
        
        
        $sortWrapper.empty();
        
        if(sortby == 'reset'){
            $.each(config.startOrder,function(){
                $sortWrapper.append(this).append(' ');
            });
        } else if(sortby == 'default'){
            $.each(config.origOrder,function(){
                rebuild(this);
            });
        } else if(sortby == 'random'){
            if(!config.newOrder.length){
                config.newOrder = arrayShuffle(config.startOrder);
            };
            $.each(config.newOrder,function(){
                $sortWrapper.append(this).append(' ');
            }); 
        } else if(sortby == 'custom'){
            $.each(order, function(){
                rebuild(this);
            });
        } else { 
            
            
            if(typeof config.origOrder[0].attr(sortby) === 'undefined'){
                console.log('No such attribute found. Terminating');
                return false;
            };
            
            if(!config.newOrder.length){
                $.each(config.origOrder,function(){
                    config.newOrder.push($(this));
                });
                config.newOrder.sort(compare);
            };
            $.each(config.newOrder,function(){
                rebuild(this);
            });
            
        };
        config.checkSort = [];
        $sortWrapper.find(config.targetSelector+':visible').each(function(i){
            var $t = $(this);
            if(i == 0){
                
                
                
                $t.attr('data-checksum','1');
            };
            $t.wrap('<s/>');
            config.checkSort.push($t.parent().html().replace(/\s+/g, ''));
            $t.unwrap();
        });
        
        $cont.find(config.targetSelector).unwrap();
    };
    
    

    function prefix(el) {
        var prefixes = ["Webkit", "Moz", "O", "ms"];
        for (var i = 0; i < prefixes.length; i++){
            if (prefixes[i] + "Transition" in el.style){
                return prefixes[i];
            };
        };
        return "transition" in el.style ? "" : false;
    };
    
    
    
    $.fn.removeStyle = function(style){
        return this.each(function(){
            var obj = $(this);
            style = style.replace(/\s+/g, '');
            var styles = style.split(',');
            $.each(styles,function(){
                
                var search = new RegExp(this.toString() + '[^;]+;?', 'g');
                obj.attr('style', function(i, style){
                    if(style) return style.replace(search, '');
                });
            });
        });
    };

     
    
    function compareArr(a,b){
        if (a.length != b.length) return false;
        for (var i = 0; i < b.length; i++){
            if (a[i].compare) { 
                if (!a[i].compare(b[i])) return false;
            };
            if (a[i] !== b[i]) return false;
        };
        return true;
    };
    
    
    
    function buildFilterArray(str){
        
        str = str.replace(/\s{2,}/g, ' ');
        
        var arr = str.split(' ');
        
        $.each(arr,function(i){
            if(this == 'all')arr[i] = 'mix_all';
        });
        if(arr[0] == "")arr.shift(); 
        return arr;
    };

    
})(jQuery);
