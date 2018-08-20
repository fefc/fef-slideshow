<?php
/**
 * Plugin Name: Simple Slideshow
 * Plugin URI:  https://wordpress.org/plugins/fef-slideshow
 * Description: Simple Slideshow allows you to create and edit slideshows quickly direcly in a post or a page without any configuration.
 * Author:      Fef
 * Author URI:  https://github.com/fefc
 * Version:     0.0.1
 * License:     GPLv3
 */

namespace FefSlideshow;

require_once dirname( __FILE__ ) .'/editor/Fef_Editor.php';
require_once dirname( __FILE__ ) .'/slideshow/Fef_Slideshow.php';

new Fef_Editor();
new Fef_Slideshow();