(function() {
	tinymce.PluginManager.add('fef_slideshow', function( editor, url ) {
		var sh_tag = 'fef_slideshow';
		var mce_css_class = 'fef-mce-slideshow';
		
		/* Get shortcode attributes */
		function getShAttr(s, n) {
			n = new RegExp(n + '=\"([^\"]+)\"', 'g').exec(s);
			return n ?  window.decodeURIComponent(n[1]) : '';
		};

		function html(data) {
			var return_value = '';
			var data_wired = data.replace(new RegExp('%', 'g'), '%25'); /* for some wired reason need to re-encode % */
		
			/* We need to make an AJAX request to get the thumbnails from the ids */
			var ajax_data = {
				'action': 'get_thumbnails',
				'security': 'ajax_fef_mce_object.ajax_nonce',
				'ids': getShAttr(data_wired,'ids').split(',').map(Number),
			};
		
			jQuery.ajax({
				type: 'POST',
				url: ajax_fef_mce_object.ajax_url,
				data: ajax_data,
				async:false,
				success: function(response) {	
					// now we can fill the html with thumbnails					
					return_value = ids_to_html(JSON.parse(response), data);
				},
				error: function() {
					return_value = '';
				}
			});
			return return_value;
		}
				
		function ids_to_html(ids_url, data) {
			var temp_container = $('<div>', {class: ''});
			var container = $('<div>', {class: 'mceItem ' + mce_css_class});
			var ul = $('<ul>', {class: 'gallery'});
			
			container.append(ul);
			
			container.attr('data-sh-attr', window.encodeURIComponent(data));
			container.attr('data-mce-resize', false);
			container.attr('data-mce-placeholder', 1);
			container.attr('contenteditable', true); /* set to true, otherwise content is not selected in edit mode and slideshow is duplicated instead of being replaced */
			
			if ( ids_url.length > 0 ) {
				ids_url.map( function(attachment) {						
						var attachment_img  = $('<img>', {class: 'img-thumbnail'});
						attachment_img.attr('contenteditable', false);
						attachment_img.attr('src', attachment.url);
						attachment_img.attr('draggable', false);
						
						var attachment_centered = $('<div>', {class: 'centered'});
						var attachment_thumbnail = $('<div>', {class: 'thumbnail'});
						var attachment_preview = $('<div>', {class: 'attachment-preview'});
						var attachment_container = $('<li>', {class: 'attachment'});
						attachment_container.data('id', attachment.id);

						attachment_centered.append(attachment_img);
						attachment_thumbnail.append(attachment_centered);
						attachment_preview.append(attachment_thumbnail);
						attachment_container.append(attachment_preview);
						
						ul.append(attachment_container);
				});
			
				temp_container.append(container);
			
				return temp_container.html();
			}
			return '';
		}
		
		function replaceShortcodes( content ) {
			return content.replace( /\[fef_slideshow([^\]]*)\]/g, function(match, attr) {
				console.log('replaceShortcodes html ' + attr);
				return html(attr);
			});
		}
				
		function restoreShortcodes( content ) {
			return content.replace(/(?:(<div.*?fef-mce-slideshow(?:[^>]+)?>)<ul(?:[^>]+)?>).*?(?:<\/ul><\/div>)/g, function( match, image ) {
				var data = getShAttr( image, 'data-sh-attr' );
				if ( data ) {
					return '[' + sh_tag + data + ']';
				}
				return match;
			});
		}

		//replace from shortcode to an image placeholder
		editor.on('BeforeSetcontent', function(event){ 
			event.content = replaceShortcodes( event.content );
		});

		//replace from image placeholder to shortcode
		editor.on('GetContent', function(event){
			event.content = restoreShortcodes(event.content);
		});

		//open popup on placeholder double click
		editor.on('DblClick',function(e) {								
			if ( e.target.nodeName == 'DIV' && e.target.className.indexOf(mce_css_class) > -1 ) {
				var title = e.target.attributes['data-sh-attr'].value;
				
				title = window.decodeURIComponent(title);		
				title = title.replace(new RegExp('%', 'g'), '%25'); /* for some wired reason need to re-encode % */
								
				fef_edit_slideshow(getShAttr(title,'ids').split(",").map(Number), getShAttr(title,'sty'), getShAttr(title,'tpl'), getShAttr(title,'rat_d'), getShAttr(title,'rat_r'), getShAttr(title,'per'));
			}
		});
	});
})();