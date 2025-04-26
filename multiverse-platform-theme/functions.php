<?php
/**
 * Multiverse Platform Theme functions and definitions
 *
 * @package Multiverse_Platform
 */

if (!defined('MULTIVERSE_THEME_VERSION')) {
    // Replace the version number with the theme version when updating
    define('MULTIVERSE_THEME_VERSION', '1.0.0');
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 */
function multiverse_platform_setup() {
    // Add default posts and comments RSS feed links to head
    add_theme_support('automatic-feed-links');

    // Let WordPress manage the document title
    add_theme_support('title-tag');

    // Enable support for Post Thumbnails on posts and pages
    add_theme_support('post-thumbnails');

    // Register navigation menus
    register_nav_menus(
        array(
            'primary' => esc_html__('Primary Menu', 'multiverse-platform'),
            'footer' => esc_html__('Footer Menu', 'multiverse-platform'),
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
            'style',
            'script',
        )
    );

    // Set up the WordPress core custom background feature
    add_theme_support(
        'custom-background',
        apply_filters(
            'multiverse_platform_custom_background_args',
            array(
                'default-color' => 'ffffff',
                'default-image' => '',
            )
        )
    );

    // Add theme support for selective refresh for widgets
    add_theme_support('customize-selective-refresh-widgets');

    // Add support for custom logo
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
add_action('after_setup_theme', 'multiverse_platform_setup');

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 */
function multiverse_platform_content_width() {
    $GLOBALS['content_width'] = apply_filters('multiverse_platform_content_width', 1200);
}
add_action('after_setup_theme', 'multiverse_platform_content_width', 0);

/**
 * Register widget area.
 */
function multiverse_platform_widgets_init() {
    register_sidebar(
        array(
            'name'          => esc_html__('Sidebar', 'multiverse-platform'),
            'id'            => 'sidebar-1',
            'description'   => esc_html__('Add widgets here.', 'multiverse-platform'),
            'before_widget' => '<section id="%1$s" class="widget %2$s">',
            'after_widget'  => '</section>',
            'before_title'  => '<h2 class="widget-title">',
            'after_title'   => '</h2>',
        )
    );

    register_sidebar(
        array(
            'name'          => esc_html__('Footer 1', 'multiverse-platform'),
            'id'            => 'footer-1',
            'description'   => esc_html__('Add footer widgets here.', 'multiverse-platform'),
            'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
            'after_widget'  => '</div>',
            'before_title'  => '<h4 class="footer-widget-title">',
            'after_title'   => '</h4>',
        )
    );

    register_sidebar(
        array(
            'name'          => esc_html__('Footer 2', 'multiverse-platform'),
            'id'            => 'footer-2',
            'description'   => esc_html__('Add footer widgets here.', 'multiverse-platform'),
            'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
            'after_widget'  => '</div>',
            'before_title'  => '<h4 class="footer-widget-title">',
            'after_title'   => '</h4>',
        )
    );

    register_sidebar(
        array(
            'name'          => esc_html__('Footer 3', 'multiverse-platform'),
            'id'            => 'footer-3',
            'description'   => esc_html__('Add footer widgets here.', 'multiverse-platform'),
            'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
            'after_widget'  => '</div>',
            'before_title'  => '<h4 class="footer-widget-title">',
            'after_title'   => '</h4>',
        )
    );

    register_sidebar(
        array(
            'name'          => esc_html__('Footer 4', 'multiverse-platform'),
            'id'            => 'footer-4',
            'description'   => esc_html__('Add footer widgets here.', 'multiverse-platform'),
            'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
            'after_widget'  => '</div>',
            'before_title'  => '<h4 class="footer-widget-title">',
            'after_title'   => '</h4>',
        )
    );
}
add_action('widgets_init', 'multiverse_platform_widgets_init');

/**
 * Enqueue scripts and styles.
 */
function multiverse_platform_scripts() {
    // Enqueue Google Fonts
    wp_enqueue_style('multiverse-platform-fonts', 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap', array(), null);

    // Enqueue main stylesheet
    wp_enqueue_style('multiverse-platform-style', get_stylesheet_uri(), array(), MULTIVERSE_THEME_VERSION);

    // Enqueue custom CSS
    wp_enqueue_style('multiverse-platform-custom', get_template_directory_uri() . '/assets/css/custom.css', array(), MULTIVERSE_THEME_VERSION);

    // Enqueue main JavaScript file
    wp_enqueue_script('multiverse-platform-main', get_template_directory_uri() . '/assets/js/main.js', array('jquery'), MULTIVERSE_THEME_VERSION, true);

    // Enqueue property scripts
    if (is_singular('property') || is_post_type_archive('property') || is_tax('property_type') || is_tax('property_location')) {
        wp_enqueue_script('multiverse-platform-property', get_template_directory_uri() . '/assets/js/property.js', array('jquery'), MULTIVERSE_THEME_VERSION, true);
    }

    // Enqueue auction scripts
    if (is_singular('auction') || is_post_type_archive('auction')) {
        wp_enqueue_script('multiverse-platform-auction', get_template_directory_uri() . '/assets/js/auction.js', array('jquery'), MULTIVERSE_THEME_VERSION, true);
    }

    // Enqueue finance calculator scripts
    if (is_page_template('templates/finance-calculator.php') || is_singular('property')) {
        wp_enqueue_script('multiverse-platform-finance', get_template_directory_uri() . '/assets/js/finance-calculator.js', array('jquery'), MULTIVERSE_THEME_VERSION, true);
    }

    if (is_singular() && comments_open() && get_option('thread_comments')) {
        wp_enqueue_script('comment-reply');
    }
}
add_action('wp_enqueue_scripts', 'multiverse_platform_scripts');

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Custom Post Types
 */
require get_template_directory() . '/inc/post-types/property.php';
require get_template_directory() . '/inc/post-types/auction.php';
require get_template_directory() . '/inc/post-types/business-model.php';

/**
 * Custom Widgets
 */
require get_template_directory() . '/inc/widgets/property-search-widget.php';
require get_template_directory() . '/inc/widgets/finance-calculator-widget.php';
require get_template_directory() . '/inc/widgets/recent-properties-widget.php';

/**
 * Custom Shortcodes
 */
require get_template_directory() . '/inc/shortcodes.php';

/**
 * DRAH Finance Integration
 */
require get_template_directory() . '/inc/drah-finance.php';

/**
 * AEC DRAH Construction Services
 */
require get_template_directory() . '/inc/aec-drah-services.php';

/**
 * Property Listing Scraper
 */
require get_template_directory() . '/inc/property-scraper.php';

/**
 * Register Custom Navigation Walker
 */
if (!file_exists(get_template_directory() . '/inc/class-wp-bootstrap-navwalker.php')) {
    // File does not exist, create a simple placeholder
    function multiverse_platform_register_navwalker() {
        class Multiverse_Platform_Navwalker extends Walker_Nav_Menu {
            // Basic navigation walker
        }
    }
    add_action('after_setup_theme', 'multiverse_platform_register_navwalker');
} else {
    // File exists, require it
    require_once get_template_directory() . '/inc/class-wp-bootstrap-navwalker.php';
}

/**
 * Custom excerpt length
 */
function multiverse_platform_excerpt_length($length) {
    return 20;
}
add_filter('excerpt_length', 'multiverse_platform_excerpt_length');

/**
 * Custom excerpt more
 */
function multiverse_platform_excerpt_more($more) {
    return '...';
}
add_filter('excerpt_more', 'multiverse_platform_excerpt_more');

/**
 * Add custom image sizes
 */
add_image_size('property-thumbnail', 350, 250, true);
add_image_size('property-gallery', 800, 600, true);
add_image_size('property-featured', 1200, 800, true);

/**
 * Add body classes
 */
function multiverse_platform_body_classes($classes) {
    // Add a class if we're on the property archive
    if (is_post_type_archive('property') || is_tax('property_type') || is_tax('property_location')) {
        $classes[] = 'property-archive';
    }

    // Add a class if we're on the auction archive
    if (is_post_type_archive('auction')) {
        $classes[] = 'auction-archive';
    }

    // Add a class if we're on the business model archive
    if (is_post_type_archive('business_model')) {
        $classes[] = 'business-model-archive';
    }

    // Add a class if we're on a DRAH property
    if (is_singular('property')) {
        $is_drah = get_post_meta(get_the_ID(), '_property_is_drah', true);
        if ($is_drah) {
            $classes[] = 'drah-property';
        }
    }

    return $classes;
}
add_filter('body_class', 'multiverse_platform_body_classes');

/**
 * Add custom query vars
 */
function multiverse_platform_query_vars($vars) {
    $vars[] = 'property_type';
    $vars[] = 'property_location';
    $vars[] = 'price_min';
    $vars[] = 'price_max';
    $vars[] = 'bedrooms';
    $vars[] = 'bathrooms';
    $vars[] = 'is_drah';
    return $vars;
}
add_filter('query_vars', 'multiverse_platform_query_vars');

/**
 * Modify property query
 */
function multiverse_platform_pre_get_posts($query) {
    if (!is_admin() && $query->is_main_query() && (is_post_type_archive('property') || is_tax('property_type') || is_tax('property_location'))) {
        // Set posts per page
        $query->set('posts_per_page', 12);

        // Filter by price
        $price_min = get_query_var('price_min');
        $price_max = get_query_var('price_max');

        if (!empty($price_min) || !empty($price_max)) {
            $meta_query = array('relation' => 'AND');

            if (!empty($price_min)) {
                $meta_query[] = array(
                    'key' => '_property_price',
                    'value' => $price_min,
                    'compare' => '>=',
                    'type' => 'NUMERIC',
                );
            }

            if (!empty($price_max)) {
                $meta_query[] = array(
                    'key' => '_property_price',
                    'value' => $price_max,
                    'compare' => '<=',
                    'type' => 'NUMERIC',
                );
            }

            $query->set('meta_query', $meta_query);
        }

        // Filter by bedrooms
        $bedrooms = get_query_var('bedrooms');
        if (!empty($bedrooms)) {
            $query->set('meta_key', '_property_bedrooms');
            $query->set('meta_value', $bedrooms);
            $query->set('meta_compare', '>=');
        }

        // Filter by bathrooms
        $bathrooms = get_query_var('bathrooms');
        if (!empty($bathrooms)) {
            $query->set('meta_key', '_property_bathrooms');
            $query->set('meta_value', $bathrooms);
            $query->set('meta_compare', '>=');
        }

        // Filter by DRAH status
        $is_drah = get_query_var('is_drah');
        if (!empty($is_drah)) {
            $query->set('meta_key', '_property_is_drah');
            $query->set('meta_value', '1');
        }
    }

    return $query;
}
add_action('pre_get_posts', 'multiverse_platform_pre_get_posts');

/**
 * Format price
 */
function multiverse_platform_format_price($price) {
    return '$' . number_format($price);
}

/**
 * Get property meta
 */
function multiverse_platform_get_property_meta($post_id, $key, $default = '') {
    $value = get_post_meta($post_id, '_property_' . $key, true);
    return !empty($value) ? $value : $default;
}

/**
 * Get property status label
 */
function multiverse_platform_get_property_status_label($status) {
    $status_labels = array(
        'available' => __('Available', 'multiverse-platform'),
        'auction' => __('Auction', 'multiverse-platform'),
        'pending' => __('Pending', 'multiverse-platform'),
        'sold' => __('Sold', 'multiverse-platform'),
    );

    return isset($status_labels[$status]) ? $status_labels[$status] : $status;
}

/**
 * Get property status class
 */
function multiverse_platform_get_property_status_class($status) {
    $status_classes = array(
        'available' => 'status-available',
        'auction' => 'status-auction',
        'pending' => 'status-pending',
        'sold' => 'status-sold',
    );

    return isset($status_classes[$status]) ? $status_classes[$status] : '';
}

/**
 * Get property gallery
 */
function multiverse_platform_get_property_gallery($post_id) {
    $gallery = get_post_meta($post_id, '_property_gallery', true);
    $gallery_ids = !empty($gallery) ? explode(',', $gallery) : array();
    $images = array();

    if (!empty($gallery_ids)) {
        foreach ($gallery_ids as $attachment_id) {
            $attachment = wp_get_attachment_image_src($attachment_id, 'property-gallery');
            $thumbnail = wp_get_attachment_image_src($attachment_id, 'property-thumbnail');
            
            if (!empty($attachment)) {
                $images[] = array(
                    'id' => $attachment_id,
                    'url' => $attachment[0],
                    'width' => $attachment[1],
                    'height' => $attachment[2],
                    'thumbnail' => $thumbnail[0],
                );
            }
        }
    }

    return $images;
}

/**
 * Get similar properties
 */
function multiverse_platform_get_similar_properties($post_id, $limit = 3) {
    $property_type_terms = wp_get_post_terms($post_id, 'property_type', array('fields' => 'ids'));
    $property_location_terms = wp_get_post_terms($post_id, 'property_location', array('fields' => 'ids'));

    $args = array(
        'post_type' => 'property',
        'post_status' => 'publish',
        'posts_per_page' => $limit,
        'post__not_in' => array($post_id),
        'tax_query' => array(
            'relation' => 'OR',
        ),
    );

    if (!empty($property_type_terms)) {
        $args['tax_query'][] = array(
            'taxonomy' => 'property_type',
            'field' => 'term_id',
            'terms' => $property_type_terms,
        );
    }

    if (!empty($property_location_terms)) {
        $args['tax_query'][] = array(
            'taxonomy' => 'property_location',
            'field' => 'term_id',
            'terms' => $property_location_terms,
        );
    }

    return new WP_Query($args);
}

/**
 * Get DRAH properties by zip code
 */
function multiverse_platform_get_drah_properties_by_zip($zip_code, $limit = 10) {
    $args = array(
        'post_type' => 'property',
        'post_status' => 'publish',
        'posts_per_page' => $limit,
        'meta_query' => array(
            'relation' => 'AND',
            array(
                'key' => '_property_is_drah',
                'value' => '1',
                'compare' => '=',
            ),
            array(
                'key' => '_property_zip_code',
                'value' => $zip_code,
                'compare' => '=',
            ),
        ),
    );

    return new WP_Query($args);
}

/**
 * Get DRAH properties by city
 */
function multiverse_platform_get_drah_properties_by_city($city, $limit = 10) {
    $args = array(
        'post_type' => 'property',
        'post_status' => 'publish',
        'posts_per_page' => $limit,
        'meta_query' => array(
            'relation' => 'AND',
            array(
                'key' => '_property_is_drah',
                'value' => '1',
                'compare' => '=',
            ),
            array(
                'key' => '_property_city',
                'value' => $city,
                'compare' => 'LIKE',
            ),
        ),
    );

    return new WP_Query($args);
}

/**
 * Calculate mortgage payment
 */
function multiverse_platform_calculate_mortgage_payment($loan_amount, $interest_rate, $loan_term) {
    $monthly_interest_rate = ($interest_rate / 100) / 12;
    $number_of_payments = $loan_term * 12;
    
    $payment = $loan_amount * ($monthly_interest_rate * pow(1 + $monthly_interest_rate, $number_of_payments)) / (pow(1 + $monthly_interest_rate, $number_of_payments) - 1);
    
    return round($payment, 2);
}

/**
 * Check DRAH finance eligibility
 */
function multiverse_platform_check_drah_finance_eligibility($fico_score) {
    // DRAH Finance requires a minimum FICO score of 500
    return $fico_score >= 500;
}

/**
 * Calculate AEC DRAH construction cost
 */
function multiverse_platform_calculate_construction_cost($square_feet, $package_type) {
    $cost_per_sqft = 0;
    
    switch ($package_type) {
        case 'standard':
            $cost_per_sqft = 175; // $150-200 per sq ft, using middle value
            break;
        case 'premium':
            $cost_per_sqft = 225; // $200-250 per sq ft, using middle value
            break;
        case 'custom':
            $cost_per_sqft = 275; // $250+ per sq ft, using base value
            break;
        default:
            $cost_per_sqft = 175;
            break;
    }
    
    $total_cost = $square_feet * $cost_per_sqft;
    $discounted_cost = $total_cost * 0.9; // 10% discount
    
    return array(
        'total_cost' => $total_cost,
        'discounted_cost' => $discounted_cost,
        'savings' => $total_cost - $discounted_cost,
    );
}
