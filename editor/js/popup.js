jQuery(function($) {
	$(document).ready(function() {
		/* Initialize events and defaults */
		/* Opening of popup for a new slideshow */
		$('#fef-new-slideshow').click(on_open);
		
		/* Opening of popu to edit an exisitng slideshow */
		/* We need one global function which will be called from the mce plugin when double click on an existing slideshow */
		window.fef_edit_slideshow = function(ids, sty, tpl, rat_d, rat_r, per) {
			/* Open the popup will initialize things */
			$('#fef-new-slideshow').trigger('click');

			/* Updates titles of popup and button */
			$('#TB_ajaxWindowTitle').html('Edit Slideshow');
			$('#fef-insert-slideshow').html('Update Slideshow');
			$('#fef-insert-slideshow').removeAttr('disabled');
			$('#fef-medias-tab-empty').css('display', 'none');
						
			if (sty != '') {
				var match = sty.match('^.*?width:([0-9]{1,2}(?:\.{0,1}[0-9]{0,4}))\%');
				if (match !== null) {
					$('#fef-width').val(parseFloat(match[1]));
				}
				
				match = sty.match('^.*?height:([0-9]{1,2}(?:\.{0,1}[0-9]{0,4}))\%');
				if (match !== null) {
					$('#fef-height').val(parseFloat(match[1]));
				}
					
				match = sty.match('^.*?float:(center|left|right)');
				if (match !== null) {
					$('#fef-ali').val(match[1]);
				}					
			}
			
			if (tpl != '')
				$('#fef-tpl').val(tpl);
			
			if (rat_d != '' && rat_r != '') {
				$('#fef-rat-dividend').val(rat_d);
				$('#fef-rat-divisor').val(rat_r);
			}
						
			if (per != '') {
				$('#fef-per').val(per);
			}
		
			/* We need to make an AJAX request to get the thumbnails from the ids */
			var data = {
				'action': 'get_thumbnails',
				'security': 'ajax_fef_popup_object.ajax_nonce',
				'ids': ids,
			};
		
			jQuery.post(ajax_fef_popup_object.ajax_url, data, function(response) {	
				/* now we can fill the html with thumbnails */
				data = JSON.parse(response);
				ids_to_html(data);
			});
		}
		
		/* Tab router */
		$('#fef-editor-slideshow').find('.tab-router').children().each(function() {
			$(this).click(switch_tab);
		});
		
		/* Media Tab */		
		$('#fef-select-medias').click(select_medias);		
		$('#fef-delete-medias').click(delete_medias);
		$('#fef-insert-slideshow').click(insert_slideshow);
		
		$('#fef-medias-tab-gallery').sortable({
			containment: 'parent',
			tolerance: 'pointer'
		});
		
		$('#fef-medias-tab-gallery').disableSelection();
		
		/* Preview Tab */
		$('#fef-preview').click(render_preview);
		
		/* Settings Tab */
	});
	
	/* Init the popup when opening */
	function on_open() {
		/* Updates titles of popup and button */
		$('#fef-insert-slideshow').html('Insert Slideshow');
		$('#fef-insert-slideshow').attr('disabled', 'disabled');
		
		/* Clear any content */
		$('#fef-medias-tab-gallery').empty();
		$('#fef-preview-tab-content').empty();
		
		/* set some default text */
		$('#fef-medias-tab-empty').css('display', 'block');
		
		/* set defaults settings */
		$('#fef-tpl').val(0);
		$('#fef-rat-dividend').val(16);
		$('#fef-rat-divisor').val(9);
		$('#fef-per').val(0);
		$('#fef-ali').val('center');
		$('#fef-width').val(100);
		$('#fef-height').val(0);
				
		$('#fef-medias').trigger('click');
	}
	
	/* Handle switches between tabs */ 	
	function switch_tab() {
		var tab_id = $(this).attr('id');
				
		$('#fef-editor-slideshow').find('.tab-router').children().removeClass('active');
		$('#fef-editor-slideshow').find('.main-content').children().removeClass('active');
		
		$(this).addClass('active');
		$('#'+tab_id+'-tab').addClass('active');
	}
	
	/* Medias Tab functions */
	
	/* Open the WP media window to insert new medias to the slideshow */
	function select_medias() {
		if (this.window === undefined) {
			this.window = wp.media({
					title: 'Select medias',
					library: {type: 'image'},
					multiple: true,
					button: {text: 'Add to slideshow'}
			});

			var self = this; // Needed to retrieve our variable in the anonymous function below
			this.window.on('select', function() {							
				var data = [];
				
				self.window.state().get('selection').map(function(attachment) {
					attachment.toJSON();
					
					console.log(attachment);
					
					var obj = {
						'id': attachment.id,
						'url': '',
					};
					
					if (attachment.attributes.sizes.medium) {
						obj.url = attachment.attributes.sizes.medium.url;
					} else {
						obj.url = attachment.attributes.url;
					}
											
					data.push(obj);
				});
				ids_to_html(data);
			});
		}
		this.window.open();
		return false;
	}
	
	/* Delete selected medias from the slideshow */
	function delete_medias() {
		$('#fef-medias-tab-gallery').find('.selected').remove();
		
		if ($('#fef-medias-tab-gallery').find('.attachment').length == 0){ 
			$('#fef-insert-slideshow').attr('disabled', 'disabled');
			$('#fef-medias-tab-empty').css('display', 'block');
		}
	}
	
	/* Check or uncheck thumbnails to be able to delete the selection */
	function check_thumbnail() {
		var thumbnail_checked = ! $(this).data('checked');
				
		if (thumbnail_checked)
			$(this).addClass('selected');
		else
			$(this).removeClass('selected');
			
		$(this).data('checked', thumbnail_checked);
	}
	
	/* Insert slideshow shortcode into post */
	function insert_slideshow() {	
		wp.media.editor.insert(generate_shortcode());
	}
	
	function ids_to_html( data ) {
		var attachement_ids = new Array();
				
		$('#fef-medias-tab-gallery').children().each(function() {
			attachement_ids.push($(this).data('id'));
		});
				
		if ( data.length > 0 ) {
			data.map( function(attachment) {			
				if (jQuery.inArray(attachment.id, attachement_ids) == -1) {			
					var attachment_img  = $('<img>', {class: 'img-thumbnail'});
					attachment_img.attr('src', attachment.url);
					attachment_img.attr('draggable', false);
					
					var attachment_centered = $('<div>', {class: 'centered'});
					var attachment_thumbnail = $('<div>', {class: 'thumbnail'});
					var attachment_preview = $('<div>', {class: 'attachment-preview'});
					var attachment_container = $('<li>', {role: 'checkbox', class: 'attachment', click: check_thumbnail});
					attachment_container.data('checked', false);
					attachment_container.data('id', attachment.id);

					attachment_centered.append(attachment_img);
					attachment_thumbnail.append(attachment_centered);
					attachment_preview.append(attachment_thumbnail);
					attachment_container.append(attachment_preview);
					
					$('#fef-medias-tab-gallery').append(attachment_container);
				}
			});
		
			$('#fef-insert-slideshow').removeAttr('disabled');
			$('#fef-medias-tab-empty').css('display', 'none');
		}
	}
	
	function generate_shortcode(return_as_array) {
		var attachement_ids = new Array();
		var tpl = $('#fef-tpl').val();
		var rat_dividend = $('#fef-rat-dividend').val();
		var rat_divisor = $('#fef-rat-divisor').val();
		var per = $('#fef-per').val();
		var style = '';
		var ali = $('#fef-ali').val();
		var width = $('#fef-width').val();
		var height = $('#fef-height').val();
		
		var shortcode = '';
				
		$('#fef-medias-tab-gallery').children().each(function() {
			attachement_ids.push($(this).data('id'));
		});
		
		shortcode = '[fef_slideshow ids="' + attachement_ids.join() + '" ';
		
		if (ali != 'center')
			style += 'float:' + ali + ';';
		
		if (width != 100)
			style += 'width:' + width + '%;';
		
		if (height != 0)
			style += 'height:' + height + '%;';
		
		if (style != '')
			shortcode += 'sty="' + style + '" ';
		
		if (tpl != 0)
			shortcode += 'tpl="' + tpl + '" ';

		if (rat_dividend > 0 && rat_divisor > 0) {
			if (rat_dividend != 16 || rat_divisor != 9) {
				shortcode += 'rat_d="' + rat_dividend + '" ';
				shortcode += 'rat_r="' + rat_divisor + '" ';
			}
		}
				
		if (per != 0)
			shortcode += 'per="' + per + '" ';
		
		shortcode = shortcode.trim() + ']';
		
		return shortcode;
	}
	
	/* Preview Tab functions */
	
	/* Update render tab with AJAX */
	function render_preview() {		
		$('#fef-preview-tab-content').empty();

		if ( $('#fef-medias-tab-gallery').children().length > 0 ) {
			
			var shortcode = generate_shortcode();			
			var data = {
				'action': 'get_preview',
				'security': 'ajax_fef_popup_object.ajax_nonce',
				'shortcode': shortcode,
			};
				
			jQuery.post(ajax_fef_popup_object.ajax_url, data, function(response) {	
				$('#fef-preview-tab-content').prepend(response);
				fef_init();
			});
		
		} else {
			$('#fef-preview-tab-content').prepend('<p>There are currently no medias for this slideshow.</p>');
		}
	}
});
