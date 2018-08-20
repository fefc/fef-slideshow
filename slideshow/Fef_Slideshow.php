<?php
namespace FefSlideshow;

class Fef_Slideshow {
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
		add_shortcode( $this->shortcode_tag, array( $this, 'render_slideshow' ) );
		add_action( 'wp_enqueue_scripts', array( $this , 'enqueue_scripts' ));
	}
	
	function render_slideshow( $atts ) {	
		$attributes = shortcode_atts( array(
					'ids' => '',
					'sty' => '',
					'tpl' => '0',
					'rat_d' => '16',
					'rat_r' => '9',
					'per' => '0',
					), $atts, 'fef_slideshow' );

		// Check if ids has a value before we continue to eliminate bugs
		if ( !$attributes['ids'] )   {
			return '';
		}
		
		/* Insert scrpit and style */
		wp_enqueue_style('fef_slideshow_style');
		wp_enqueue_script('fef_slideshow_script');
				
		/* Let's setup the slideshow content */
		$output = '<div id="' . uniqid('fef-slideshow-') . '"';		
		if ( $attributes['sty'] !== '' ) {
			$output .= ' style="' . $attributes['sty'] . '"';
		}
		
		$output .= ' period="' .  $attributes['per'] . '">';
				
		switch ($attributes['tpl']) {
			case '0':
				$output .= $this->render_classic($attributes);
				break;
			
			case '1':
				$output .= $this->render_fancy($attributes);
				break;
			
			default:
				$output .= $this->render_classic($attributes);
		}
		
		$output .= '</div>';
		
		return $output;
	}
	
	function render_classic( array $attributes ) {
		// Create our array of values
		// First, sanitize the data and remove white spaces
		$no_whitespaces_ids = preg_replace( '/\s*,\s*/', ',', filter_var( $attributes['ids'], FILTER_SANITIZE_STRING ) ); 
		$ids_array = explode( ',', $no_whitespaces_ids );
		
		$ratio = number_format(((int)$attributes['rat_r'] / (int)$attributes['rat_d']) * 100, 2, '.', '');
		
		$output = '<div class="scale" style="padding-top:' . $ratio . '%;"><div class="main"><div class="slides"><div class="center-vertical"><div class="center-horizontal">';
		$navigation_output = '';
		
		foreach ( $ids_array as $id ) { 
			$image = get_post($id);
		
			$caption = $image->post_excerpt;
			$url = wp_get_attachment_url($id);
		
			$output .= '<img class="slide" style="display:none;" src="' . $url . '" caption="' . $caption . '" />';
			$navigation_output .= '<div class="dot"></div>';
		}
		
		$output .= '</div></div></div></div>';
			
		$output .= '<div class="number"></div>';
		$output .= '<a class="previous">&#10094;</a>';
		$output .= '<a class="next">&#10095;</a>';
		$output .= '<div class="caption"></div></div>';
					
		$output .= '<div class="navigation"><div class="center-navigation">';
		$output .= $navigation_output;
		$output .= '</div></div>';
		
		return $output;
	}
	
	function render_fancy( array $attributes ) {
		// Create our array of values
		// First, sanitize the data and remove white spaces
		$no_whitespaces_ids = preg_replace( '/\s*,\s*/', ',', filter_var( $attributes['ids'], FILTER_SANITIZE_STRING ) ); 
		$ids_array = explode( ',', $no_whitespaces_ids );
		
		$ratio = number_format(((int)$attributes['rat_r'] / (int)$attributes['rat_d']) * 100, 2, '.', '');
		
		$output = '<div class="scale" style="padding-top:' . $ratio . '%;"><div class="main"><div class="slides"><div class="center-vertical"><div class="center-horizontal">';
		$navigation_output = '';
		
		foreach ( $ids_array as $id ) { 
			$image = get_post($id);
		
			$caption = $image->post_excerpt;
			$url = wp_get_attachment_url($id);
		
			$output .= '<img class="slide" style="display:none;" src="' . $url . '" caption="' . $caption . '" />';
			$navigation_output .= '<div class="square"></div>';
		}
		
		$output .= '</div></div></div></div>';
			
		$output .= '<div class="number"></div>';
		$output .= '<a class="previous">&#10094;</a>';
		$output .= '<a class="next">&#10095;</a>';
		$output .= '<div class="caption"></div></div>';
					
		$output .= '<div class="navigation"><div class="center-navigation">';
		$output .= $navigation_output;
		$output .= '</div></div>';
		
		return $output;
	}
	
	/**
	 * enqueue_scripts 
	 * Used to enqueue custom styles
	 * @return void
	 */
	function enqueue_scripts(){
		wp_register_style('fef_slideshow_style', plugins_url('css/style.css', __FILE__));
		wp_register_script('fef_slideshow_script', plugins_url( 'js/slideshow.js', __FILE__ ), array('jquery'), '1.0', true );
	}
}
