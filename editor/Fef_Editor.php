<?php

namespace FefSlideshow;

class Fef_Editor {
	/**
	 * $shortcode_tag 
	 * holds the name of the shortcode tag
	 * @var string
	 */
	public $shortcode_tag = 'fef_slideshow';

	/**
	 * __construct 
	 * class constructor will set the needed filter and action hooks
	 * 
	 * @param array $args 
	 */
	function __construct( $args = array() ) {								
		if ( is_admin() ){
			// This function is called when preview tab is openend in admin, this allows the server to render the slideshow and give it back to the client
			add_action( 'wp_ajax_get_thumbnails',  array( $this , 'get_thumbnails' ) );
			add_action( 'wp_ajax_get_preview',  array( $this , 'get_preview' ) );
			
			add_action('admin_head', array( $this, 'admin_head') );
			add_action( 'admin_enqueue_scripts', array($this , 'admin_enqueue_scripts' ) );
		}
	}

	/**
	 * admin_head
	 * calls your functions into the correct filters
	 * @return void
	 */
	function admin_head() {
		// check user permissions
		if ( !current_user_can( 'edit_posts' ) && !current_user_can( 'edit_pages' ) ) {
			return;
		}
				
		// add the insert slideshow button
		add_filter( 'media_buttons', array( $this , 'add_editor' ) );
		
		// check if WYSIWYG is enabled
		if ( 'true' == get_user_option( 'rich_editing' ) ) {
			
			add_filter( 'mce_css', array( $this , 'mce_css' ) );
			add_filter( 'mce_external_plugins', array( $this ,'mce_external_plugins' ) );

			// AJAX for mce
			?>
			<!-- TinyMCE Shortcode Plugin -->
			<script type='text/javascript'>
				var ajax_fef_mce_object = {
					'ajax_url': '<?php echo admin_url( 'admin-ajax.php')?>',
					'ajax_nonce': '<?php echo wp_create_nonce( '_nonce_fef_mce' ); ?>' 
				};
			</script>
			<!-- TinyMCE Shortcode Plugin -->
			<?php
		}
	}
		
	/**
	 * add_editor
	 * Adds the "Insert Slideshow" to wordpress post editor and loads the code for the popup
	 * @return void
	 */
	function add_editor() {
			$file = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'Fef_Popup.php';
			include  $file;
	}
	
	/**
	 * mce_css
	 * Add style sheet for tiny mce
	 * @return string
	 */
	function mce_css( $mce_css ) {
		$mce_css .= ', ' . plugins_url( 'css/mce-style.css', __FILE__ );
		return $mce_css;
	}
		
	/**
	 * mce_external_plugins 
	 * Adds our tinymce plugin which will allow us to render/edit the slideshows that are already in the post
	 * @param  array $plugin_array 
	 * @return array
	 */
	function mce_external_plugins( $plugin_array ) {
		$plugin_array[$this->shortcode_tag] = plugins_url( 'js/mce.js' , __FILE__ );
		return $plugin_array;
	}

	/**
	 * get_thumbnails
	 * returns the thumbnails for the given media ids
	 * @return string
	 */
	function get_thumbnails() {
		$array_ids = $_POST['ids'];
		
		$output = array();
		
		foreach ( $array_ids as $index => $id ) { 	
			$output[] = array( 'id' => (int) $id,
							   'url' => wp_get_attachment_image_src($id, 'medium')[0],
							 );
	    }
		
		echo json_encode($output);
		wp_die();
	}
	
	/**
	 * get_preview
	 * returns the preview of the shlideshow by executing the shortcode on serverside trought AJAX
	 * @return string
	 */
	function get_preview() {
		$shortcode = stripslashes($_POST['shortcode']);
		echo do_shortcode($shortcode);
		wp_die();
	}
		
	/**
	 * admin_enqueue_scripts 
	 * Used to enqueue custom styles
	 * @return void
	 */
	function admin_enqueue_scripts( $hook_suffix ){	
		if( in_array($hook_suffix, array('post.php', 'post-new.php') ) ){
			// load editor style and script
			wp_enqueue_style('fef_editor_style', plugins_url( 'css/popup-style.css', __FILE__) );	
			wp_enqueue_script('fef_editor_script', plugins_url( 'js/popup.js', __FILE__ ), array('jquery'), '1.0', true );

			// For preview we also need slideshow side
			wp_enqueue_style('fef_slideshow_style', plugin_dir_url( __DIR__ ) . 'slideshow/css/style.css');
			wp_enqueue_script('fef_slideshow_script', plugin_dir_url( __DIR__ ) . 'slideshow/js/slideshow.js', array('jquery'), '1.0', true);
					
			// AJAX
			wp_localize_script( 'fef_editor_script', 'ajax_fef_popup_object', array( 'ajax_url' => admin_url( 'admin-ajax.php' ), 'ajax_nonce' => wp_create_nonce( '_nonce_fef_popup' ) ) );
		}
	}
}
