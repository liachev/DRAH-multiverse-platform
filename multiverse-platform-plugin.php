<?php
/**
 * Plugin Name: Multiverse Platform Portal Exchange
 * Plugin URI: https://drah.tech
 * Description: A comprehensive platform that combines metaverse and real-world functionalities with a focus on real estate and business solutions.
 * Version: 1.0.0
 * Author: DRAH
 * Author URI: https://drah.tech
 * Text Domain: multiverse-platform
 * Domain Path: /languages
 * License: GPL v2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

// Define plugin constants
define('MULTIVERSE_PLATFORM_VERSION', '1.0.0');
define('MULTIVERSE_PLATFORM_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('MULTIVERSE_PLATFORM_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * The core plugin class
 */
class Multiverse_Platform {

    /**
     * The single instance of the class
     */
    protected static $_instance = null;

    /**
     * Main Plugin Instance
     */
    public static function instance() {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /**
     * Constructor
     */
    public function __construct() {
        $this->includes();
        $this->init_hooks();
    }

    /**
     * Include required files
     */
    private function includes() {
        // Core files
        require_once MULTIVERSE_PLATFORM_PLUGIN_DIR . 'includes/class-multiverse-platform-loader.php';
        require_once MULTIVERSE_PLATFORM_PLUGIN_DIR . 'includes/class-multiverse-platform-i18n.php';
        
        // Admin files
        require_once MULTIVERSE_PLATFORM_PLUGIN_DIR . 'admin/class-multiverse-platform-admin.php';
        
        // Public files
        require_once MULTIVERSE_PLATFORM_PLUGIN_DIR . 'public/class-multiverse-platform-public.php';
        
        // API Integration
        require_once MULTIVERSE_PLATFORM_PLUGIN_DIR . 'includes/api/class-multiverse-platform-api.php';
        
        // Post Types
        require_once MULTIVERSE_PLATFORM_PLUGIN_DIR . 'includes/post-types/class-multiverse-platform-property.php';
        require_once MULTIVERSE_PLATFORM_PLUGIN_DIR . 'includes/post-types/class-multiverse-platform-auction.php';
        require_once MULTIVERSE_PLATFORM_PLUGIN_DIR . 'includes/post-types/class-multiverse-platform-business-model.php';
        
        // Widgets
        require_once MULTIVERSE_PLATFORM_PLUGIN_DIR . 'includes/widgets/class-multiverse-platform-property-search-widget.php';
        require_once MULTIVERSE_PLATFORM_PLUGIN_DIR . 'includes/widgets/class-multiverse-platform-finance-calculator-widget.php';
        
        // Shortcodes
        require_once MULTIVERSE_PLATFORM_PLUGIN_DIR . 'includes/shortcodes/class-multiverse-platform-shortcodes.php';
    }

    /**
     * Initialize hooks
     */
    private function init_hooks() {
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
        
        add_action('plugins_loaded', array($this, 'load_plugin_textdomain'));
        add_action('init', array($this, 'init'), 0);
    }

    /**
     * Plugin activation
     */
    public function activate() {
        // Create necessary database tables
        $this->create_tables();
        
        // Register post types
        require_once MULTIVERSE_PLATFORM_PLUGIN_DIR . 'includes/post-types/class-multiverse-platform-property.php';
        $property_post_type = new Multiverse_Platform_Property();
        $property_post_type->register_post_type();
        
        require_once MULTIVERSE_PLATFORM_PLUGIN_DIR . 'includes/post-types/class-multiverse-platform-auction.php';
        $auction_post_type = new Multiverse_Platform_Auction();
        $auction_post_type->register_post_type();
        
        require_once MULTIVERSE_PLATFORM_PLUGIN_DIR . 'includes/post-types/class-multiverse-platform-business-model.php';
        $business_model_post_type = new Multiverse_Platform_Business_Model();
        $business_model_post_type->register_post_type();
        
        // Flush rewrite rules
        flush_rewrite_rules();
    }

    /**
     * Plugin deactivation
     */
    public function deactivate() {
        // Flush rewrite rules
        flush_rewrite_rules();
    }

    /**
     * Load plugin textdomain
     */
    public function load_plugin_textdomain() {
        load_plugin_textdomain(
            'multiverse-platform',
            false,
            dirname(plugin_basename(__FILE__)) . '/languages/'
        );
    }

    /**
     * Initialize plugin
     */
    public function init() {
        // Initialize post types
        $property = new Multiverse_Platform_Property();
        $property->init();
        
        $auction = new Multiverse_Platform_Auction();
        $auction->init();
        
        $business_model = new Multiverse_Platform_Business_Model();
        $business_model->init();
        
        // Initialize shortcodes
        $shortcodes = new Multiverse_Platform_Shortcodes();
        $shortcodes->init();
        
        // Register widgets
        add_action('widgets_init', array($this, 'register_widgets'));
    }

    /**
     * Register widgets
     */
    public function register_widgets() {
        register_widget('Multiverse_Platform_Property_Search_Widget');
        register_widget('Multiverse_Platform_Finance_Calculator_Widget');
    }

    /**
     * Create database tables
     */
    private function create_tables() {
        global $wpdb;
        
        $charset_collate = $wpdb->get_charset_collate();
        
        // Property metadata table
        $table_name = $wpdb->prefix . 'multiverse_property_meta';
        $sql = "CREATE TABLE $table_name (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            property_id bigint(20) NOT NULL,
            latitude decimal(10,8) DEFAULT NULL,
            longitude decimal(11,8) DEFAULT NULL,
            price decimal(15,2) DEFAULT NULL,
            bedrooms int(11) DEFAULT NULL,
            bathrooms decimal(4,1) DEFAULT NULL,
            square_feet int(11) DEFAULT NULL,
            lot_size int(11) DEFAULT NULL,
            year_built int(4) DEFAULT NULL,
            property_type varchar(50) DEFAULT NULL,
            is_drah tinyint(1) DEFAULT 0,
            zip_code varchar(20) DEFAULT NULL,
            city varchar(100) DEFAULT NULL,
            state varchar(100) DEFAULT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY property_id (property_id)
        ) $charset_collate;";
        
        // Auction table
        $table_name = $wpdb->prefix . 'multiverse_auctions';
        $sql .= "CREATE TABLE $table_name (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            property_id bigint(20) NOT NULL,
            start_date datetime DEFAULT NULL,
            end_date datetime DEFAULT NULL,
            starting_bid decimal(15,2) DEFAULT NULL,
            current_bid decimal(15,2) DEFAULT NULL,
            deposit_amount decimal(15,2) DEFAULT NULL,
            status varchar(50) DEFAULT 'pending',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY property_id (property_id)
        ) $charset_collate;";
        
        // Bids table
        $table_name = $wpdb->prefix . 'multiverse_bids';
        $sql .= "CREATE TABLE $table_name (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            auction_id bigint(20) NOT NULL,
            user_id bigint(20) NOT NULL,
            amount decimal(15,2) NOT NULL,
            status varchar(50) DEFAULT 'active',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY auction_id (auction_id),
            KEY user_id (user_id)
        ) $charset_collate;";
        
        // DRAH Finance applications table
        $table_name = $wpdb->prefix . 'multiverse_finance_applications';
        $sql .= "CREATE TABLE $table_name (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            user_id bigint(20) NOT NULL,
            property_id bigint(20) DEFAULT NULL,
            fico_score int(11) DEFAULT NULL,
            loan_amount decimal(15,2) DEFAULT NULL,
            loan_term int(11) DEFAULT NULL,
            interest_rate decimal(5,2) DEFAULT NULL,
            monthly_payment decimal(15,2) DEFAULT NULL,
            application_status varchar(50) DEFAULT 'pre_qualification',
            application_date datetime DEFAULT CURRENT_TIMESTAMP,
            approval_date datetime DEFAULT NULL,
            closing_date datetime DEFAULT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY user_id (user_id),
            KEY property_id (property_id)
        ) $charset_collate;";
        
        // AEC DRAH construction services table
        $table_name = $wpdb->prefix . 'multiverse_construction_services';
        $sql .= "CREATE TABLE $table_name (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            user_id bigint(20) NOT NULL,
            property_id bigint(20) NOT NULL,
            service_type varchar(50) DEFAULT NULL,
            square_footage int(11) DEFAULT NULL,
            bedrooms int(11) DEFAULT NULL,
            bathrooms decimal(4,1) DEFAULT NULL,
            estimated_cost decimal(15,2) DEFAULT NULL,
            discounted_cost decimal(15,2) DEFAULT NULL,
            status varchar(50) DEFAULT 'quote',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY user_id (user_id),
            KEY property_id (property_id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
}

/**
 * Returns the main instance of Multiverse_Platform
 */
function Multiverse_Platform() {
    return Multiverse_Platform::instance();
}

// Global for backwards compatibility
$GLOBALS['multiverse_platform'] = Multiverse_Platform();
