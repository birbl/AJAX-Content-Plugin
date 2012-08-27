(function($) {
  $.fn.ajax_content = function(options) { // start plugin function
		return this.each(function() { // start selector function
			var us = this;
			var $us = $(this);

			var opts = {
				// either of these must be set
				url: 						 '', // the URL to retrieve content from on a remote server through ajax
				source_element:  '', // the existing element on the page to retrieve content from.  If source and url are set, source takes precedence
				
				child_element:   '', // the element to retrieve from the content indicated above.  If blank, takes the entire content
				target_element:  '', // the element on the page to put the content into.  If this is empty, use the modal window
				
				trigger_event:	 'click', // the event that triggers the content load for this element.  Valid options are those defined by jQuery
																	// http://api.jquery.com/category/events/,
																	
				anchor:  {
					element :  '', // the element to which the source_element or child_element should be anchored, should the target_element be a non-modal
					position : '', // the placement of the source_element in relation to the anchor element you've defined above. Accepted values are top, bottom, left, right
				}
					
			};
			
			$.extend(true, opts, options);

			// If url has not been set then take the href from the a link, otherwise use the hardcoded url 
			if (!opts.url && !opts.source_element) {
				// try to intelligently set the source of our content
				// in absence of user supplied config
				if ($(this).is('a')) {
					// use the href for <a> tags
					opts.url = $(this).attr('href');
				}
				else {
					// for anything else, just use the element's content
					opts.source_element = $(this);
				}
			}

			/**
			 * Test for the presence of the colorbox script
			 *
			 * @return
			 * true if it's found
			 */
			us.has_colorbox = function() {
				return false;
			};
		
			/**
			 * Test for the presence of the modal script
			 *
			 * @return
			 * true if it's found
			 */
			us.has_modal_script = function() {
				return false;
			};
			
				/**
			 * Show the modal window
			 */
			us.show_modal = function() {
				us.create_modal();
		
				$('#ajax-content-modal-content').html($us.data('ajax-content-html'));
				$('#ajax-content-overlay').fadeIn();
				$('#ajax-content-modal').fadeIn();
				$('#ajax-content-modal-close').fadeIn();
			};
			
			/**
			 * Assign the non_modal position if anchor has been set
			 */
			us.position_non_modal = function() {						
				
				if (opts.anchor && opts.anchor.element && opts.anchor.position) {
					
					$(opts.anchor.element)
						.css({position: 'relative'})
						.append($(opts.target_element)
						.css({position : 'absolute'}));
				
					var width = $(opts.target_element).width();
					var height = $(opts.target_element).height();
										
					switch(opts.anchor.position) {
						case 'right':
							$(opts.target_element).css({right : '-' + width + 'px', top : '0px'});
							break;
						case 'left':
							$(opts.target_element).css({left : '-' + width + 'px', top : '0px'});
							break;
						case 'top':
							$(opts.target_element).css({top : '-' + height + 'px'});
							break;
						case 'bottom':
							$(opts.target_element).css({bottom : '-' + height + 'px'});
							break;
						default:
							alert('There was an error positioning your element. You must declare a position for your anchor element in the ajax content configuration for this element.');
					}
				}
			};
			
				/**
			 * Show content which is already on the page
			 */
			us.show_non_modal = function() {
				$(opts.target_element).html($us.data('ajax-content-html'));
				us.position_non_modal();
			};
			
			us.show_content = function() {
				if (opts.target_element) { //if (opts.target_element || opts.anchor && opts.anchor.element) = possible alternative
					us.show_non_modal();
				}
				else if (this.has_colorbox()) {
					// use colorbox
				}
				else if (this.has_modal_script()) {
					// use modal thing
				}
				else {
					// use our modal window
					us.show_modal();
				}				
			};

			/**
			 * Close the modal with the X button
			 */
			us.modal_close = function() {
				$('#ajax-content-overlay').fadeOut();
				$('#ajax-content-modal').fadeOut();
				$('#ajax-content-modal-close').fadeOut();
			};
			
			us.position_modal_spinner = function() {
				var ajax_content_spinner = $('.ajax-content-spinner-modal');
				var ajax_content_modal = $('#ajax-content-modal');
				
				var modal_width = ajax_content_modal.width();
				var modal_height = ajax_content_modal.height();
				
				var spinner_width = ajax_content_spinner.width();
				var spinner_height = ajax_content_spinner.height();
				
				var spinner_margin_left = (modal_width - spinner_width)/2;
				var spinner_margin_top = (modal_height - spinner_height)/2;
				
				ajax_content_spinner.css({marginLeft : spinner_margin_left + 'px', marginTop : spinner_margin_top + 'px'});
				
			};
			
			/**
			 * Create the modal window the first time this function is called.
			 * Successive calls have no effect.
			 */
			us.create_modal = function() {
				if ($('#ajax-content-modal').length > 0) {
					// already on the page
					return;
			  }
				
				$('body').append(
					
					'<div id="ajax-content-overlay"></div>' +
					'<span id="ajax-content-modal-close">X</span>' +
					'<div id="ajax-content-modal" class="ajax-content-modal-hidden">' +						
						'<div class="ajax-content-spinner-modal ajax-content-spinner"></div>' +
						'<div id="ajax-content-modal-content-wrapper">' +
							'<div id="ajax-content-modal-content"></div>' +
						'</div>' +
					'</div>');
				
				$("#ajax-content-modal-close").bind('click', function() {
					us.modal_close();
				});
				
				modal_width = $('#ajax-content-modal').width();
				modal_height = $('#ajax-content-modal').height();
				
				window_width = $(window).width();
				window_height = $(window).height();
				
				var margin_left = (window_width - modal_width)/2;
				var margin_top = (window_height - modal_height)/2;
		
				$('#ajax-content-modal').css({left : margin_left + 'px', top : margin_top + 'px'});
				$('#ajax-content-modal-close').css({left : (margin_left - 10) + 'px', top : (margin_top - 10) + 'px'});
				
				us.position_modal_spinner();
				
			};
				
			/**
			 * Retrieve content from a local element on this page and set the instance html variable
			 */
			us.get_local_content = function() {
				$us.data('ajax-content-html', $(opts.source_element).html());
				us.show_content();		
			};
			
			/**
			 * Create the position and animation for the spinner for the non_modal spinner
			 */
			us.non_modal_spinner = function() {
				if (!opts.target_element) {
					return;
				}
				
				var width =  $(opts.anchor.element).width();
				var height = $(opts.anchor.element).height();
					
				$(opts.anchor.element).append('<div id="ajax-content-spinner-wrapper">' + '<div class="ajax-content-spinner-non-modal ajax-content-spinner"></div>' + '</div>');
				
				var $spinner = $('.ajax-content-spinner-non-modal');
					
				$spinner.css({position : 'absolute'})
				
				var spinner_w =  $spinner.width();
				var spinner_h =  $spinner.height();
				
				switch(opts.anchor.position) {
					case 'right':
						$spinner.css({right : '-' + (spinner_w + width) + 'px', top : (height - spinner_h)/2 + 'px'});
						break;
					case 'left':
						$spinner.css({left : '-' + spinner_w + 'px', top : (height - spinner_h)/2 + 'px'});
						break;
					case 'top':
						$spinner.css({top : '-' + spinner_h + 'px', left : (width - spinner_w)/2 + 'px'});
						break;
					case 'bottom':
						$spinner.css({bottom : '-' + (spinner_h + height) + 'px', left : (width - spinner_w)/2 + 'px'});
						break;
					default:
						alert('There was an error positioning your spinner.');
				}
				
				$spinner.show();
			};
			
			us.modal_spinner = function () {
				$('.ajax-content-spinner').show();
				$('#ajax-content-modal-content').hide();
			};
			
			
			/**
			 * Retrieve content from a remote server
			 *
			 * @return
			 * A DOM object
			 */			
			us.get_remote_content = function() {
				// If the content is to be placed in a modal, show the modal with spinner	
				if (!opts.target_element) {
						us.show_content()
						$.ajax({
							url : opts.url,
							statusCode: {
								404: function() {
								alert("page not found");
								}
							},
							ajaxStart : us.modal_spinner(),
							dataType: 'html',
							success :   function(data) {
								$('.ajax-content-spinner').hide();
								$segment = $(opts.child_element, data);
								html = $segment.html();
								$('#ajax-content-modal-content').html(html).show();
							}
						})						
					} else {
						// if the content is to be placed in a non-modal, show spinner beside relevant targets
						$.ajax({
							url : opts.url,
							statusCode: {
								404: function() {
								alert("page not found");
								}
							},
							ajaxStart : us.non_modal_spinner(),
							ajaxStop :  $('.ajax-content-spinner').remove(),
							dataType: 'html',
							success :   function(data) {
								$('.ajax-content-spinner-non-modal').hide();
								$segment = $(opts.child_element, data);
								html = $segment.html();
								$(opts.target_element).html(html);
								us.show_content();
							}
						})	
					} 			
				};
					
			/**
			 * Retrieve content to display on the page.
			 *
			 * @return
			 * A DOM object
			 */
			us.get_content = function() {
				if (opts.source_element) {
					us.get_local_content();
				}
				else {
					us.get_remote_content();
				}
			};
			
			/**
			 * The initial action to be taken as defined by trigger_event
			 */
			$us.bind(opts.trigger_event, function() {
				us.get_content();
				return false;
			});
			
			/**
			 * Get the element to display.  If this instance declares a child_element, use that, otherwise just use the
			 * passed element.
			 *
			 * @param
			 * An HTML DOM element, or HTML snippet
			 *
			 * @returns
			 * A jQuery element
			 */
			us.get_child_content = function(el) {
				var j_el = $(el);
				return (opts.child_element)? j_el.find(opts.child_element) : j_el;
			};
		});	
  }    
})(jQuery);
