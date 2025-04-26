<?php
/**
 * Multiverse Platform Simplified functions and definitions
 *
 * @package Multiverse_Platform_Simplified
 */

// Set up theme defaults and registers support for various WordPress features
function multiverse_simplified_setup() {
    // Add default posts and comments RSS feed links to head
    add_theme_support('automatic-feed-links');

    // Let WordPress manage the document title
    add_theme_support('title-tag');

    // Enable support for Post Thumbnails on posts and pages
    add_theme_support('post-thumbnails');

    // Register navigation menus
    register_nav_menus(
        array(
            'primary' => esc_html__('Primary Menu', 'multiverse-platform-simplified'),
            'footer' => esc_html__('Footer Menu', 'multiverse-platform-simplified'),
        )
    );

    // Switch default core markup to output valid HTML5
    add_theme_support(
        'html5',
        array(
            'search-form',
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
        )
    );

    // Add theme support for custom logo
    add_theme_support(
        'custom-logo',
        array(
            'height'      => 250,
            'width'       => 250,
            'flex-width'  => true,
            'flex-height' => true,
        )
    );
}
add_action('after_setup_theme', 'multiverse_simplified_setup');

// Register widget area
function multiverse_simplified_widgets_init() {
    register_sidebar(
        array(
            'name'          => esc_html__('Sidebar', 'multiverse-platform-simplified'),
            'id'            => 'sidebar-1',
            'description'   => esc_html__('Add widgets here.', 'multiverse-platform-simplified'),
            'before_widget' => '<section id="%1$s" class="widget %2$s">',
            'after_widget'  => '</section>',
            'before_title'  => '<h2 class="widget-title">',
            'after_title'   => '</h2>',
        )
    );
}
add_action('widgets_init', 'multiverse_simplified_widgets_init');

// Enqueue scripts and styles
function multiverse_simplified_scripts() {
    wp_enqueue_style('multiverse-simplified-style', get_stylesheet_uri(), array(), '1.0.0');
    wp_enqueue_script('multiverse-simplified-navigation', get_template_directory_uri() . '/assets/js/navigation.js', array(), '1.0.0', true);

    if (is_singular() && comments_open() && get_option('thread_comments')) {
        wp_enqueue_script('comment-reply');
    }
}
add_action('wp_enqueue_scripts', 'multiverse_simplified_scripts');

// Custom template tags for this theme
require get_template_directory() . '/template-parts/template-tags.php';
