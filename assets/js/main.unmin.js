//Reusable non plugin stuff goes in app
(function (win, doc) {
    'use strict';
    var app = app || {
        _isSafari : null,
        _isMobile : null,
        _searchedTag : null
    };

    app.isSafari = function(){
        if(app._isSafari === null){
            var userAgent = navigator.userAgent;
            var chrome = userAgent.indexOf('Chrome');
            var safari = userAgent.indexOf('Safari');

            if(safari != -1 &&  chrome == -1){
                app._isSafari = true;
            }else{
                app._isSafari = false;
            };
        }

        return app._isSafari; 
    }


    app.isMobile = function(){
        if(app._isMobile === null){
            var mobileDevices = /(Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini)/i;
            if(mobileDevices.test(navigator.userAgent)){
                app._isMobile = true;
            }else{
                app._isMobile = false;
            };
        };

        return app._isMobile;
    }

    app.replaceAll = function(str,find,replace){
        return str.replace(new RegExp(find, 'g'), replace);
    }

    app.elemExists = function(elem){
        elem = $(elem);

        if(elem.length > 0){
            return true;
        }else{
            return false;
        };
    }



    app.getTag = function(elem){
        
        if(app._searchedTag === null){
            if(app.elemExists(elem)){
                var url = window.location.href;
                var splitURL = url.split('tag');
                var tag = app.replaceAll(splitURL[1],'/','');
                var tagFirstChar;
                
                tag = app.replaceAll(tag,'-',' ');
                tagFirstChar = tag.charAt(0).toUpperCase();
                tag = tagFirstChar + tag.substring(1,tag.length);

                app._searchedTag = tag;
            };
        };

        return app._searchedTag;
    }


    app.aTagWrap = function(elem,elemClass,exclude){        
        if(app.elemExists(elem)){
            var imgs = $(elem);
            if(imgs.length > 0){
                imgs.each(function(){
                    var $this = $(this);
                    var imgLink = $this.attr('src');
                    
                    if(!$this.hasClass(exclude)){
                        var html = '';
                        html = "<a class='"+elemClass+"' href='"+ imgLink +"'></a>";
                        
                        $this.wrap(html);
                    }
                });

            };
        };
    }


    window.app = app;

})(window, document);



(function($) {
    'use strict';
    var app = window.app;
    var initImagesLoaded = function(container,elem){

        var posts = document.querySelectorAll(elem);

        imagesLoaded( posts, function() {

            var postContainer = $(container);

            //Fitvid
            $('.post').fitVids();

            //Convert images
            app.aTagWrap('.post img','fluid-popup','no-fluid');

            //Fluidbox
            if(app.elemExists('.fluid-popup')){
                $('.fluid-popup').fluidbox();
            }


            postContainer.addClass('show-posts');
            $('.post').addClass('show-posts');
        });   
    }

    var initInfiniteScroll = function(pageNumber,nextPage,nanobar){
        var maxPageNumber = $(pageNumber);
        var nextPageElem = $(nextPage);

            if(maxPageNumber.length > 0 && nextPageElem.length > 0){
                var splitPageNumber = maxPageNumber.html().split('of');
                var getNextPage = nextPageElem.attr('href').slice(-2).replace('/','');

                maxPageNumber = parseInt(splitPageNumber[1]);
                getNextPage = parseInt(getNextPage);

                
                
                $('#post-container').infinitescroll({
                    navSelector  : ".pagination",
                    // selector for the paged navigation (it will be hidden)
                    nextSelector : ".pagination .older-posts",
                    // selector for the NEXT link (to page 2)
                    itemSelector : ".post",
                    loading: {
                                    finishedMsg: "No more posts.",
                                    //http://static.tumblr.com/dbek3sy/pX1lrx8xv/ajax-loader.gif
                                    img: 'http://static.tumblr.com/dbek3sy/gUImt1cjo/ajax-loader.gif',
                                    //msgText:"Loading new posts.."
                                }
                    
                }, function (newElems) {
                    nanobar.go( 40 );    

                    var elem = $(newElems);
                    var elemID = elem.attr('id');

                    nanobar.go( 60 );

                    //update pagination
                    getNextPage = getNextPage + 1;
                    
                    nanobar.go( 80 );                    

                    if(getNextPage > maxPageNumber){
                        $(window).unbind('.infscr');
                        $('.pagination').remove();
                    }else{
                        nextPageElem.attr('href','/page/'+getNextPage+'/'); 
                    }
                        
                    nanobar.go( 100 );   

                    $(newElems).addClass('show-posts');                                     

                });
            }
        }

        function hexc(colorval) {
            var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            delete(parts[0]);
            for (var i = 1; i <= 3; ++i) {
                parts[i] = parseInt(parts[i]).toString(16);
                if (parts[i].length == 1) parts[i] = '0' + parts[i];
            }
            return '#' + parts.join('');
        }

    //Check what page, check if link is in navbar, if true set to active.

    var navBG;

	//Headroom
	if(app.elemExists('.navbar')){
		// grab an element
		var myElement = document.querySelector('.navbar');
		// construct an instance of Headroom, passing the element
		var headroom  = new Headroom(myElement);
		// initialise
		headroom.init(); 

        navBG = $('.navbar').css('backgroundColor');

        navBG = hexc(navBG);
	};

    
	
    //Check if the images are loaded
	if(app.elemExists('.post')){
        initImagesLoaded('#post-container','.post');
	};

    //Get the tag searched for
    if(app.getTag('#tag-search') !== null){
        $('#tag-search').html(app.getTag('#tag-search'));
    };

    //Setup infinite scroll
    if(app.elemExists('.page-number','.older-posts')){
        var options = {
            bg: navBG,

            // leave target blank for global nanobar
            target: '',

            // id for new nanobar
            id: 'mynano'
        };

        var nanobar = new Nanobar( options );
        

        initInfiniteScroll('.page-number','.older-posts',nanobar);
    };


})(jQuery);



