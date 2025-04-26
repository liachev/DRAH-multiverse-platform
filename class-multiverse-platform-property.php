<?php
/**
 * Class for registering and managing the Property post type
 *
 * @package Multiverse_Platform
 */

if (!defined('WPINC')) {
    die;
}

class Multiverse_Platform_Property {

    /**
     * Post type name
     */
    private $post_type = 'mp_property';

    /**
     * Initialize the class
     */
    public function init() {
        // Register post type
        $this->register_post_type();
        
        // Register taxonomies
        $this->register_taxonomies();
        
        // Register meta boxes
        add_action('add_meta_boxes', array($this, 'add_meta_boxes'));
        
        // Save post meta
        add_action('save_post', array($this, 'save_meta_box_data'));
        
        // Add property data to REST API
        add_action('rest_api_init', array($this, 'register_rest_fields'));
        
        // Add property columns
        add_filter('manage_' . $this->post_type . '_posts_columns', array($this, 'set_custom_columns'));
        add_action('manage_' . $this->post_type . '_posts_custom_column', array($this, 'custom_column_content'), 10, 2);
        
        // Add property filters
        add_action('restrict_manage_posts', array($this, 'add_admin_filters'));
        add_filter('parse_query', array($this, 'filter_properties_by_taxonomy'));
    }

    /**
     * Register the property post type
     */
    public function register_post_type() {
        $labels = array(
            'name'                  => _x('Properties', 'Post type general name', 'multiverse-platform'),
            'singular_name'         => _x('Property', 'Post type singular name', 'multiverse-platform'),
            'menu_name'             => _x('Properties', 'Admin Menu text', 'multiverse-platform'),
            'name_admin_bar'        => _x('Property', 'Add New on Toolbar', 'multiverse-platform'),
            'add_new'               => __('Add New', 'multiverse-platform'),
            'add_new_item'          => __('Add New Property', 'multiverse-platform'),
            'new_item'              => __('New Property', 'multiverse-platform'),
            'edit_item'             => __('Edit Property', 'multiverse-platform'),
            'view_item'             => __('View Property', 'multiverse-platform'),
            'all_items'             => __('All Properties', 'multiverse-platform'),
            'search_items'          => __('Search Properties', 'multiverse-platform'),
            'parent_item_colon'     => __('Parent Properties:', 'multiverse-platform'),
            'not_found'             => __('No properties found.', 'multiverse-platform'),
            'not_found_in_trash'    => __('No properties found in Trash.', 'multiverse-platform'),
            'featured_image'        => _x('Property Image', 'Overrides the "Featured Image" phrase', 'multiverse-platform'),
            'set_featured_image'    => _x('Set property image', 'Overrides the "Set featured image" phrase', 'multiverse-platform'),
            'remove_featured_image' => _x('Remove property image', 'Overrides the "Remove featured image" phrase', 'multiverse-platform'),
            'use_featured_image'    => _x('Use as property image', 'Overrides the "Use as featured image" phrase', 'multiverse-platform'),
            'archives'              => _x('Property archives', 'The post type archive label used in nav menus', 'multiverse-platform'),
            'insert_into_item'      => _x('Insert into property', 'Overrides the "Insert into post" phrase', 'multiverse-platform'),
            'uploaded_to_this_item' => _x('Uploaded to this property', 'Overrides the "Uploaded to this post" phrase', 'multiverse-platform'),
            'filter_items_list'     => _x('Filter properties list', 'Screen reader text for the filter links heading on the post type listing screen', 'multiverse-platform'),
            'items_list_navigation' => _x('Properties list navigation', 'Screen reader text for the pagination heading on the post type listing screen', 'multiverse-platform'),
            'items_list'            => _x('Properties list', 'Screen reader text for the items list heading on the post type listing screen', 'multiverse-platform'),
        );

        $args = array(
            'labels'             => $labels,
            'public'             => true,
            'publicly_queryable' => true,
            'show_ui'            => true,
            'show_in_menu'       => true,
            'query_var'          => true,
            'rewrite'            => array('slug' => 'property'),
            'capability_type'    => 'post',
            'has_archive'        => true,
            'hierarchical'       => false,
            'menu_position'      => null,
            'menu_icon'          => 'dashicons-admin-home',
            'supports'           => array('title', 'editor', 'author', 'thumbnail', 'excerpt', 'comments'),
            'show_in_rest'       => true,
            'rest_base'          => 'properties',
        );

        register_post_type($this->post_type, $args);
    }

    /**
     * Register taxonomies for the property post type
     */
    public function register_taxonomies() {
        // Property Type Taxonomy
        $labels = array(
            'name'              => _x('Property Types', 'taxonomy general name', 'multiverse-platform'),
            'singular_name'     => _x('Property Type', 'taxonomy singular name', 'multiverse-platform'),
            'search_items'      => __('Search Property Types', 'multiverse-platform'),
            'all_items'         => __('All Property Types', 'multiverse-platform'),
            'parent_item'       => __('Parent Property Type', 'multiverse-platform'),
            'parent_item_colon' => __('Parent Property Type:', 'multiverse-platform'),
            'edit_item'         => __('Edit Property Type', 'multiverse-platform'),
            'update_item'       => __('Update Property Type', 'multiverse-platform'),
            'add_new_item'      => __('Add New Property Type', 'multiverse-platform'),
            'new_item_name'     => __('New Property Type Name', 'multiverse-platform'),
            'menu_name'         => __('Property Types', 'multiverse-platform'),
        );

        $args = array(
            'hierarchical'      => true,
            'labels'            => $labels,
            'show_ui'           => true,
            'show_admin_column' => true,
            'query_var'         => true,
            'rewrite'           => array('slug' => 'property-type'),
            'show_in_rest'      => true,
        );

        register_taxonomy('property_type', array($this->post_type), $args);

        // Property Features Taxonomy
        $labels = array(
            'name'              => _x('Property Features', 'taxonomy general name', 'multiverse-platform'),
            'singular_name'     => _x('Property Feature', 'taxonomy singular name', 'multiverse-platform'),
            'search_items'      => __('Search Property Features', 'multiverse-platform'),
            'all_items'         => __('All Property Features', 'multiverse-platform'),
            'parent_item'       => __('Parent Property Feature', 'multiverse-platform'),
            'parent_item_colon' => __('Parent Property Feature:', 'multiverse-platform'),
            'edit_item'         => __('Edit Property Feature', 'multiverse-platform'),
            'update_item'       => __('Update Property Feature', 'multiverse-platform'),
            'add_new_item'      => __('Add New Property Feature', 'multiverse-platform'),
            'new_item_name'     => __('New Property Feature Name', 'multiverse-platform'),
            'menu_name'         => __('Property Features', 'multiverse-platform'),
        );

        $args = array(
            'hierarchical'      => false,
            'labels'            => $labels,
            'show_ui'           => true,
            'show_admin_column' => true,
            'query_var'         => true,
            'rewrite'           => array('slug' => 'property-feature'),
            'show_in_rest'      => true,
        );

        register_taxonomy('property_feature', array($this->post_type), $args);

        // Property Location Taxonomy
        $labels = array(
            'name'              => _x('Locations', 'taxonomy general name', 'multiverse-platform'),
            'singular_name'     => _x('Location', 'taxonomy singular name', 'multiverse-platform'),
            'search_items'      => __('Search Locations', 'multiverse-platform'),
            'all_items'         => __('All Locations', 'multiverse-platform'),
            'parent_item'       => __('Parent Location', 'multiverse-platform'),
            'parent_item_colon' => __('Parent Location:', 'multiverse-platform'),
            'edit_item'         => __('Edit Location', 'multiverse-platform'),
            'update_item'       => __('Update Location', 'multiverse-platform'),
            'add_new_item'      => __('Add New Location', 'multiverse-platform'),
            'new_item_name'     => __('New Location Name', 'multiverse-platform'),
            'menu_name'         => __('Locations', 'multiverse-platform'),
        );

        $args = array(
            'hierarchical'      => true,
            'labels'            => $labels,
            'show_ui'           => true,
            'show_admin_column' => true,
            'query_var'         => true,
            'rewrite'           => array('slug' => 'property-location'),
            'show_in_rest'      => true,
        );

        register_taxonomy('property_location', array($this->post_type), $args);

        // DRAH Status Taxonomy
        $labels = array(
            'name'              => _x('DRAH Status', 'taxonomy general name', 'multiverse-platform'),
            'singular_name'     => _x('DRAH Status', 'taxonomy singular name', 'multiverse-platform'),
            'search_items'      => __('Search DRAH Statuses', 'multiverse-platform'),
            'all_items'         => __('All DRAH Statuses', 'multiverse-platform'),
            'parent_item'       => __('Parent DRAH Status', 'multiverse-platform'),
            'parent_item_colon' => __('Parent DRAH Status:', 'multiverse-platform'),
            'edit_item'         => __('Edit DRAH Status', 'multiverse-platform'),
            'update_item'       => __('Update DRAH Status', 'multiverse-platform'),
            'add_new_item'      => __('Add New DRAH Status', 'multiverse-platform'),
            'new_item_name'     => __('New DRAH Status Name', 'multiverse-platform'),
            'menu_name'         => __('DRAH Status', 'multiverse-platform'),
        );

        $args = array(
            'hierarchical'      => true,
            'labels'            => $labels,
            'show_ui'           => true,
            'show_admin_column' => true,
            'query_var'         => true,
            'rewrite'           => array('slug' => 'drah-status'),
            'show_in_rest'      => true,
        );

        register_taxonomy('drah_status', array($this->post_type), $args);
    }

    /**
     * Add meta boxes for the property post type
     */
    public function add_meta_boxes() {
        add_meta_box(
            'property_details',
            __('Property Details', 'multiverse-platform'),
            array($this, 'render_property_details_meta_box'),
            $this->post_type,
            'normal',
            'high'
        );

        add_meta_box(
            'property_location',
            __('Property Location', 'multiverse-platform'),
            array($this, 'render_property_location_meta_box'),
            $this->post_type,
            'normal',
            'high'
        );

        add_meta_box(
            'property_pricing',
            __('Property Pricing', 'multiverse-platform'),
            array($this, 'render_property_pricing_meta_box'),
            $this->post_type,
            'normal',
            'high'
        );

        add_meta_box(
            'property_gallery',
            __('Property Gallery', 'multiverse-platform'),
            array($this, 'render_property_gallery_meta_box'),
            $this->post_type,
            'normal',
            'high'
        );

        add_meta_box(
            'property_drah',
            __('DRAH Information', 'multiverse-platform'),
            array($this, 'render_property_drah_meta_box'),
            $this->post_type,
            'normal',
            'high'
        );
    }

    /**
     * Render the property details meta box
     */
    public function render_property_details_meta_box($post) {
        // Add nonce for security
        wp_nonce_field('property_details_meta_box', 'property_details_meta_box_nonce');

        // Get current values
        $bedrooms = get_post_meta($post->ID, '_property_bedrooms', true);
        $bathrooms = get_post_meta($post->ID, '_property_bathrooms', true);
        $square_feet = get_post_meta($post->ID, '_property_square_feet', true);
        $lot_size = get_post_meta($post->ID, '_property_lot_size', true);
        $year_built = get_post_meta($post->ID, '_property_year_built', true);

        // Output fields
        ?>
        <div class="property-details-fields">
            <p>
                <label for="property_bedrooms"><?php _e('Bedrooms:', 'multiverse-platform'); ?></label>
                <input type="number" id="property_bedrooms" name="property_bedrooms" value="<?php echo esc_attr($bedrooms); ?>" min="0" step="1" />
            </p>
            <p>
                <label for="property_bathrooms"><?php _e('Bathrooms:', 'multiverse-platform'); ?></label>
                <input type="number" id="property_bathrooms" name="property_bathrooms" value="<?php echo esc_attr($bathrooms); ?>" min="0" step="0.5" />
            </p>
            <p>
                <label for="property_square_feet"><?php _e('Square Feet:', 'multiverse-platform'); ?></label>
                <input type="number" id="property_square_feet" name="property_square_feet" value="<?php echo esc_attr($square_feet); ?>" min="0" step="1" />
            </p>
            <p>
                <label for="property_lot_size"><?php _e('Lot Size (sq ft):', 'multiverse-platform'); ?></label>
                <input type="number" id="property_lot_size" name="property_lot_size" value="<?php echo esc_attr($lot_size); ?>" min="0" step="1" />
            </p>
            <p>
                <label for="property_year_built"><?php _e('Year Built:', 'multiverse-platform'); ?></label>
                <input type="number" id="property_year_built" name="property_year_built" value="<?php echo esc_attr($year_built); ?>" min="1800" max="<?php echo date('Y'); ?>" step="1" />
            </p>
        </div>
        <?php
    }

    /**
     * Render the property location meta box
     */
    public function render_property_location_meta_box($post) {
        // Add nonce for security
        wp_nonce_field('property_location_meta_box', 'property_location_meta_box_nonce');

        // Get current values
        $address = get_post_meta($post->ID, '_property_address', true);
        $city = get_post_meta($post->ID, '_property_city', true);
        $state = get_post_meta($post->ID, '_property_state', true);
        $zip_code = get_post_meta($post->ID, '_property_zip_code', true);
        $latitude = get_post_meta($post->ID, '_property_latitude', true);
        $longitude = get_post_meta($post->ID, '_property_longitude', true);

        // Output fields
        ?>
        <div class="property-location-fields">
            <p>
                <label for="property_address"><?php _e('Address:', 'multiverse-platform'); ?></label>
                <input type="text" id="property_address" name="property_address" value="<?php echo esc_attr($address); ?>" class="widefat" />
            </p>
            <p>
                <label for="property_city"><?php _e('City:', 'multiverse-platform'); ?></label>
                <input type="text" id="property_city" name="property_city" value="<?php echo esc_attr($city); ?>" />
            </p>
            <p>
                <label for="property_state"><?php _e('State:', 'multiverse-platform'); ?></label>
                <input type="text" id="property_state" name="property_state" value="<?php echo esc_attr($state); ?>" />
            </p>
            <p>
                <label for="property_zip_code"><?php _e('ZIP Code:', 'multiverse-platform'); ?></label>
                <input type="text" id="property_zip_code" name="property_zip_code" value="<?php echo esc_attr($zip_code); ?>" />
            </p>
            <p>
                <label for="property_latitude"><?php _e('Latitude:', 'multiverse-platform'); ?></label>
                <input type="text" id="property_latitude" name="property_latitude" value="<?php echo esc_attr($latitude); ?>" />
            </p>
            <p>
                <label for="property_longitude"><?php _e('Longitude:', 'multiverse-platform'); ?></label>
                <input type="text" id="property_longitude" name="property_longitude" value="<?php echo esc_attr($longitude); ?>" />
            </p>
            <div id="property_map" style="height: 300px; margin-top: 10px;"></div>
            <p class="description"><?php _e('Click on the map to set the property location.', 'multiverse-platform'); ?></p>
        </div>
        <?php
    }

    /**
     * Render the property pricing meta box
     */
    public function render_property_pricing_meta_box($post) {
        // Add nonce for security
        wp_nonce_field('property_pricing_meta_box', 'property_pricing_meta_box_nonce');

        // Get current values
        $price = get_post_meta($post->ID, '_property_price', true);
        $price_per_sqft = get_post_meta($post->ID, '_property_price_per_sqft', true);
        $status = get_post_meta($post->ID, '_property_status', true);

        // Output fields
        ?>
        <div class="property-pricing-fields">
            <p>
                <label for="property_price"><?php _e('Price ($):', 'multiverse-platform'); ?></label>
                <input type="number" id="property_price" name="property_price" value="<?php echo esc_attr($price); ?>" min="0" step="1" />
            </p>
            <p>
                <label for="property_price_per_sqft"><?php _e('Price per sq ft ($):', 'multiverse-platform'); ?></label>
                <input type="number" id="property_price_per_sqft" name="property_price_per_sqft" value="<?php echo esc_attr($price_per_sqft); ?>" min="0" step="0.01" />
            </p>
            <p>
                <label for="property_status"><?php _e('Status:', 'multiverse-platform'); ?></label>
                <select id="property_status" name="property_status">
                    <option value="available" <?php selected($status, 'available'); ?>><?php _e('Available', 'multiverse-platform'); ?></option>
                    <option value="auction" <?php selected($status, 'auction'); ?>><?php _e('Auction', 'multiverse-platform'); ?></option>
                    <option value="pending" <?php selected($status, 'pending'); ?>><?php _e('Pending', 'multiverse-platform'); ?></option>
                    <option value="sold" <?php selected($status, 'sold'); ?>><?php _e('Sold', 'multiverse-platform'); ?></option>
                </select>
            </p>
        </div>
        <?php
    }

    /**
     * Render the property gallery meta box
     */
    public function render_property_gallery_meta_box($post) {
        // Add nonce for security
        wp_nonce_field('property_gallery_meta_box', 'property_gallery_meta_box_nonce');

        // Get current values
        $gallery = get_post_meta($post->ID, '_property_gallery', true);
        $gallery_ids = !empty($gallery) ? explode(',', $gallery) : array();

        // Output fields
        ?>
        <div class="property-gallery-fields">
            <div class="property-gallery-container">
                <ul class="property-gallery-images">
                    <?php
                    if (!empty($gallery_ids)) {
                        foreach ($gallery_ids as $attachment_id) {
                            $attachment = wp_get_attachment_image($attachment_id, 'thumbnail');
                            if (!empty($attachment)) {
                                echo '<li class="image" data-attachment_id="' . esc_attr($attachment_id) . '">';
                                echo $attachment;
                                echo '<ul class="actions"><li><a href="#" class="delete" title="' . esc_attr__('Delete image', 'multiverse-platform') . '">' . esc_html__('Delete', 'multiverse-platform') . '</a></li></ul>';
                                echo '</li>';
                            }
                        }
                    }
                    ?>
                </ul>
                <input type="hidden" id="property_gallery" name="property_gallery" value="<?php echo esc_attr($gallery); ?>" />
            </div>
            <p class="add-property-images">
                <a href="#" class="button"><?php _e('Add Images', 'multiverse-platform'); ?></a>
            </p>
        </div>
        <?php
    }

    /**
     * Render the property DRAH meta box
     */
    public function render_property_drah_meta_box($post) {
        // Add nonce for security
        wp_nonce_field('property_drah_meta_box', 'property_drah_meta_box_nonce');

        // Get current values
        $is_drah = get_post_meta($post->ID, '_property_is_drah', true);
        $drah_type = get_post_meta($post->ID, '_property_drah_type', true);
        $city_assessor_link = get_post_meta($post->ID, '_property_city_assessor_link', true);
        $tax_department_link = get_post_meta($post->ID, '_property_tax_department_link', true);
        $building_permit_link = get_post_meta($post->ID, '_property_building_permit_link', true);
        $gis_map_link = get_post_meta($post->ID, '_property_gis_map_link', true);

        // Output fields
        ?>
        <div class="property-drah-fields">
            <p>
                <label for="property_is_drah">
                    <input type="checkbox" id="property_is_drah" name="property_is_drah" value="1" <?php checked($is_drah, '1'); ?> />
                    <?php _e('This is a DRAH property', 'multiverse-platform'); ?>
                </label>
            </p>
            <div class="drah-fields" style="<?php echo empty($is_drah) ? 'display:none;' : ''; ?>">
                <p>
                    <label for="property_drah_type"><?php _e('DRAH Type:', 'multiverse-platform'); ?></label>
                    <select id="property_drah_type" name="property_drah_type">
                        <option value="disaster_recovery" <?php selected($drah_type, 'disaster_recovery'); ?>><?php _e('Disaster Recovery', 'multiverse-platform'); ?></option>
                        <option value="affordable_housing" <?php selected($drah_type, 'affordable_housing'); ?>><?php _e('Affordable Housing', 'multiverse-platform'); ?></option>
                    </select>
                </p>
                <p>
                    <label for="property_city_assessor_link"><?php _e('City Assessor Link:', 'multiverse-platform'); ?></label>
                    <input type="url" id="property_city_assessor_link" name="property_city_assessor_link" value="<?php echo esc_attr($city_assessor_link); ?>" class="widefat" />
                </p>
                <p>
                    <label for="property_tax_department_link"><?php _e('Tax Department Link:', 'multiverse-platform'); ?></label>
                    <input type="url" id="property_tax_department_link" name="property_tax_department_link" value="<?php echo esc_attr($tax_department_link); ?>" class="widefat" />
                </p>
                <p>
                    <label for="property_building_permit_link"><?php _e('Building Permit Link:', 'multiverse-platform'); ?></label>
                    <input type="url" id="property_building_permit_link" name="property_building_permit_link" value="<?php echo esc_attr($building_permit_link); ?>" class="widefat" />
                </p>
                <p>
                    <label for="property_gis_map_link"><?php _e('GIS Map Link:', 'multiverse-platform'); ?></label>
                    <input type="url" id="property_gis_map_link" name="property_gis_map_link" value="<?php echo esc_attr($gis_map_link); ?>" class="widefat" />
                </p>
            </div>
        </div>
        <script>
            jQuery(document).ready(function($) {
                $('#property_is_drah').change(function() {
                    if ($(this).is(':checked')) {
                        $('.drah-fields').show();
                    } else {
                        $('.drah-fields').hide();
                    }
                });
            });
        </script>
        <?php
    }

    /**
     * Save meta box data
     */
    public function save_meta_box_data($post_id) {
        // Check if our nonce is set
        if (!isset($_POST['property_details_meta_box_nonce']) ||
            !isset($_POST['property_location_meta_box_nonce']) ||
            !isset($_POST['property_pricing_meta_box_nonce']) ||
            !isset($_POST['property_gallery_meta_box_nonce']) ||
            !isset($_POST['property_drah_meta_box_nonce'])) {
            return;
        }

        // Verify the nonces
        if (!wp_verify_nonce($_POST['property_details_meta_box_nonce'], 'property_details_meta_box') ||
            !wp_verify_nonce($_POST['property_location_meta_box_nonce'], 'property_location_meta_box') ||
            !wp_verify_nonce($_POST['property_pricing_meta_box_nonce'], 'property_pricing_meta_box') ||
            !wp_verify_nonce($_POST['property_gallery_meta_box_nonce'], 'property_gallery_meta_box') ||
            !wp_verify_nonce($_POST['property_drah_meta_box_nonce'], 'property_drah_meta_box')) {
            return;
        }

        // If this is an autosave, our form has not been submitted, so we don't want to do anything
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        // Check the user's permissions
        if (isset($_POST['post_type']) && $this->post_type == $_POST['post_type']) {
            if (!current_user_can('edit_post', $post_id)) {
                return;
            }
        }

        // Save property details
        if (isset($_POST['property_bedrooms'])) {
            update_post_meta($post_id, '_property_bedrooms', sanitize_text_field($_POST['property_bedrooms']));
        }
        if (isset($_POST['property_bathrooms'])) {
            update_post_meta($post_id, '_property_bathrooms', sanitize_text_field($_POST['property_bathrooms']));
        }
        if (isset($_POST['property_square_feet'])) {
            update_post_meta($post_id, '_property_square_feet', sanitize_text_field($_POST['property_square_feet']));
        }
        if (isset($_POST['property_lot_size'])) {
            update_post_meta($post_id, '_property_lot_size', sanitize_text_field($_POST['property_lot_size']));
        }
        if (isset($_POST['property_year_built'])) {
            update_post_meta($post_id, '_property_year_built', sanitize_text_field($_POST['property_year_built']));
        }

        // Save property location
        if (isset($_POST['property_address'])) {
            update_post_meta($post_id, '_property_address', sanitize_text_field($_POST['property_address']));
        }
        if (isset($_POST['property_city'])) {
            update_post_meta($post_id, '_property_city', sanitize_text_field($_POST['property_city']));
        }
        if (isset($_POST['property_state'])) {
            update_post_meta($post_id, '_property_state', sanitize_text_field($_POST['property_state']));
        }
        if (isset($_POST['property_zip_code'])) {
            update_post_meta($post_id, '_property_zip_code', sanitize_text_field($_POST['property_zip_code']));
        }
        if (isset($_POST['property_latitude'])) {
            update_post_meta($post_id, '_property_latitude', sanitize_text_field($_POST['property_latitude']));
        }
        if (isset($_POST['property_longitude'])) {
            update_post_meta($post_id, '_property_longitude', sanitize_text_field($_POST['property_longitude']));
        }

        // Save property pricing
        if (isset($_POST['property_price'])) {
            update_post_meta($post_id, '_property_price', sanitize_text_field($_POST['property_price']));
        }
        if (isset($_POST['property_price_per_sqft'])) {
            update_post_meta($post_id, '_property_price_per_sqft', sanitize_text_field($_POST['property_price_per_sqft']));
        }
        if (isset($_POST['property_status'])) {
            update_post_meta($post_id, '_property_status', sanitize_text_field($_POST['property_status']));
        }

        // Save property gallery
        if (isset($_POST['property_gallery'])) {
            update_post_meta($post_id, '_property_gallery', sanitize_text_field($_POST['property_gallery']));
        }

        // Save property DRAH information
        $is_drah = isset($_POST['property_is_drah']) ? '1' : '0';
        update_post_meta($post_id, '_property_is_drah', $is_drah);
        
        if (isset($_POST['property_drah_type'])) {
            update_post_meta($post_id, '_property_drah_type', sanitize_text_field($_POST['property_drah_type']));
        }
        if (isset($_POST['property_city_assessor_link'])) {
            update_post_meta($post_id, '_property_city_assessor_link', esc_url_raw($_POST['property_city_assessor_link']));
        }
        if (isset($_POST['property_tax_department_link'])) {
            update_post_meta($post_id, '_property_tax_department_link', esc_url_raw($_POST['property_tax_department_link']));
        }
        if (isset($_POST['property_building_permit_link'])) {
            update_post_meta($post_id, '_property_building_permit_link', esc_url_raw($_POST['property_building_permit_link']));
        }
        if (isset($_POST['property_gis_map_link'])) {
            update_post_meta($post_id, '_property_gis_map_link', esc_url_raw($_POST['property_gis_map_link']));
        }

        // Update property data in custom table
        $this->update_property_meta_table($post_id);
    }

    /**
     * Update property data in custom table
     */
    private function update_property_meta_table($post_id) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'multiverse_property_meta';
        
        $property_data = array(
            'property_id' => $post_id,
            'latitude' => get_post_meta($post_id, '_property_latitude', true),
            'longitude' => get_post_meta($post_id, '_property_longitude', true),
            'price' => get_post_meta($post_id, '_property_price', true),
            'bedrooms' => get_post_meta($post_id, '_property_bedrooms', true),
            'bathrooms' => get_post_meta($post_id, '_property_bathrooms', true),
            'square_feet' => get_post_meta($post_id, '_property_square_feet', true),
            'lot_size' => get_post_meta($post_id, '_property_lot_size', true),
            'year_built' => get_post_meta($post_id, '_property_year_built', true),
            'property_type' => $this->get_primary_term($post_id, 'property_type'),
            'is_drah' => get_post_meta($post_id, '_property_is_drah', true),
            'zip_code' => get_post_meta($post_id, '_property_zip_code', true),
            'city' => get_post_meta($post_id, '_property_city', true),
            'state' => get_post_meta($post_id, '_property_state', true),
        );
        
        // Check if record exists
        $existing = $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM $table_name WHERE property_id = %d",
            $post_id
        ));
        
        if ($existing) {
            // Update existing record
            $wpdb->update(
                $table_name,
                $property_data,
                array('property_id' => $post_id)
            );
        } else {
            // Insert new record
            $wpdb->insert(
                $table_name,
                $property_data
            );
        }
    }

    /**
     * Get primary term for a taxonomy
     */
    private function get_primary_term($post_id, $taxonomy) {
        $terms = get_the_terms($post_id, $taxonomy);
        if (!empty($terms) && !is_wp_error($terms)) {
            return $terms[0]->slug;
        }
        return '';
    }

    /**
     * Register REST API fields
     */
    public function register_rest_fields() {
        register_rest_field($this->post_type, 'property_details', array(
            'get_callback' => array($this, 'get_property_details_for_api'),
            'schema' => null,
        ));
    }

    /**
     * Get property details for REST API
     */
    public function get_property_details_for_api($object) {
        $post_id = $object['id'];
        
        return array(
            'bedrooms' => get_post_meta($post_id, '_property_bedrooms', true),
            'bathrooms' => get_post_meta($post_id, '_property_bathrooms', true),
            'square_feet' => get_post_meta($post_id, '_property_square_feet', true),
            'lot_size' => get_post_meta($post_id, '_property_lot_size', true),
            'year_built' => get_post_meta($post_id, '_property_year_built', true),
            'address' => get_post_meta($post_id, '_property_address', true),
            'city' => get_post_meta($post_id, '_property_city', true),
            'state' => get_post_meta($post_id, '_property_state', true),
            'zip_code' => get_post_meta($post_id, '_property_zip_code', true),
            'latitude' => get_post_meta($post_id, '_property_latitude', true),
            'longitude' => get_post_meta($post_id, '_property_longitude', true),
            'price' => get_post_meta($post_id, '_property_price', true),
            'price_per_sqft' => get_post_meta($post_id, '_property_price_per_sqft', true),
            'status' => get_post_meta($post_id, '_property_status', true),
            'gallery' => $this->get_gallery_images($post_id),
            'is_drah' => get_post_meta($post_id, '_property_is_drah', true),
            'drah_type' => get_post_meta($post_id, '_property_drah_type', true),
            'city_assessor_link' => get_post_meta($post_id, '_property_city_assessor_link', true),
            'tax_department_link' => get_post_meta($post_id, '_property_tax_department_link', true),
            'building_permit_link' => get_post_meta($post_id, '_property_building_permit_link', true),
            'gis_map_link' => get_post_meta($post_id, '_property_gis_map_link', true),
            'property_type' => $this->get_taxonomy_terms($post_id, 'property_type'),
            'property_features' => $this->get_taxonomy_terms($post_id, 'property_feature'),
            'property_location' => $this->get_taxonomy_terms($post_id, 'property_location'),
            'drah_status' => $this->get_taxonomy_terms($post_id, 'drah_status'),
        );
    }

    /**
     * Get gallery images
     */
    private function get_gallery_images($post_id) {
        $gallery = get_post_meta($post_id, '_property_gallery', true);
        $gallery_ids = !empty($gallery) ? explode(',', $gallery) : array();
        $images = array();
        
        if (!empty($gallery_ids)) {
            foreach ($gallery_ids as $attachment_id) {
                $attachment = wp_get_attachment_image_src($attachment_id, 'full');
                if (!empty($attachment)) {
                    $images[] = array(
                        'id' => $attachment_id,
                        'url' => $attachment[0],
                        'width' => $attachment[1],
                        'height' => $attachment[2],
                        'thumbnail' => wp_get_attachment_image_src($attachment_id, 'thumbnail')[0],
                    );
                }
            }
        }
        
        return $images;
    }

    /**
     * Get taxonomy terms
     */
    private function get_taxonomy_terms($post_id, $taxonomy) {
        $terms = get_the_terms($post_id, $taxonomy);
        $term_list = array();
        
        if (!empty($terms) && !is_wp_error($terms)) {
            foreach ($terms as $term) {
                $term_list[] = array(
                    'id' => $term->term_id,
                    'name' => $term->name,
                    'slug' => $term->slug,
                );
            }
        }
        
        return $term_list;
    }

    /**
     * Set custom columns for property post type
     */
    public function set_custom_columns($columns) {
        $new_columns = array();
        
        // Add checkbox and title at the beginning
        if (isset($columns['cb'])) {
            $new_columns['cb'] = $columns['cb'];
        }
        if (isset($columns['title'])) {
            $new_columns['title'] = $columns['title'];
        }
        
        // Add custom columns
        $new_columns['thumbnail'] = __('Image', 'multiverse-platform');
        $new_columns['price'] = __('Price', 'multiverse-platform');
        $new_columns['location'] = __('Location', 'multiverse-platform');
        $new_columns['property_type'] = __('Type', 'multiverse-platform');
        $new_columns['status'] = __('Status', 'multiverse-platform');
        $new_columns['is_drah'] = __('DRAH', 'multiverse-platform');
        
        // Add remaining columns
        foreach ($columns as $key => $value) {
            if (!isset($new_columns[$key])) {
                $new_columns[$key] = $value;
            }
        }
        
        return $new_columns;
    }

    /**
     * Display custom column content
     */
    public function custom_column_content($column, $post_id) {
        switch ($column) {
            case 'thumbnail':
                if (has_post_thumbnail($post_id)) {
                    echo get_the_post_thumbnail($post_id, array(50, 50));
                } else {
                    echo '<img src="' . MULTIVERSE_PLATFORM_PLUGIN_URL . 'assets/images/placeholder.png" width="50" height="50" />';
                }
                break;
                
            case 'price':
                $price = get_post_meta($post_id, '_property_price', true);
                echo !empty($price) ? '$' . number_format($price) : '-';
                break;
                
            case 'location':
                $city = get_post_meta($post_id, '_property_city', true);
                $state = get_post_meta($post_id, '_property_state', true);
                echo !empty($city) && !empty($state) ? $city . ', ' . $state : '-';
                break;
                
            case 'property_type':
                $terms = get_the_terms($post_id, 'property_type');
                if (!empty($terms) && !is_wp_error($terms)) {
                    $term_names = array();
                    foreach ($terms as $term) {
                        $term_names[] = $term->name;
                    }
                    echo implode(', ', $term_names);
                } else {
                    echo '-';
                }
                break;
                
            case 'status':
                $status = get_post_meta($post_id, '_property_status', true);
                $status_labels = array(
                    'available' => __('Available', 'multiverse-platform'),
                    'auction' => __('Auction', 'multiverse-platform'),
                    'pending' => __('Pending', 'multiverse-platform'),
                    'sold' => __('Sold', 'multiverse-platform'),
                );
                echo isset($status_labels[$status]) ? $status_labels[$status] : '-';
                break;
                
            case 'is_drah':
                $is_drah = get_post_meta($post_id, '_property_is_drah', true);
                echo !empty($is_drah) ? '✓' : '-';
                break;
        }
    }

    /**
     * Add admin filters
     */
    public function add_admin_filters() {
        global $typenow;
        
        if ($typenow == $this->post_type) {
            // Property Type filter
            $this->output_taxonomy_filter('property_type', __('Filter by Property Type', 'multiverse-platform'));
            
            // Location filter
            $this->output_taxonomy_filter('property_location', __('Filter by Location', 'multiverse-platform'));
            
            // DRAH Status filter
            $this->output_taxonomy_filter('drah_status', __('Filter by DRAH Status', 'multiverse-platform'));
            
            // Status filter
            $status = isset($_GET['property_status']) ? $_GET['property_status'] : '';
            ?>
            <select name="property_status">
                <option value=""><?php _e('Filter by Status', 'multiverse-platform'); ?></option>
                <option value="available" <?php selected($status, 'available'); ?>><?php _e('Available', 'multiverse-platform'); ?></option>
                <option value="auction" <?php selected($status, 'auction'); ?>><?php _e('Auction', 'multiverse-platform'); ?></option>
                <option value="pending" <?php selected($status, 'pending'); ?>><?php _e('Pending', 'multiverse-platform'); ?></option>
                <option value="sold" <?php selected($status, 'sold'); ?>><?php _e('Sold', 'multiverse-platform'); ?></option>
            </select>
            <?php
            
            // DRAH filter
            $is_drah = isset($_GET['is_drah']) ? $_GET['is_drah'] : '';
            ?>
            <select name="is_drah">
                <option value=""><?php _e('DRAH Properties', 'multiverse-platform'); ?></option>
                <option value="1" <?php selected($is_drah, '1'); ?>><?php _e('DRAH Only', 'multiverse-platform'); ?></option>
                <option value="0" <?php selected($is_drah, '0'); ?>><?php _e('Non-DRAH Only', 'multiverse-platform'); ?></option>
            </select>
            <?php
        }
    }

    /**
     * Output taxonomy filter
     */
    private function output_taxonomy_filter($taxonomy, $label) {
        $terms = get_terms(array(
            'taxonomy' => $taxonomy,
            'hide_empty' => false,
        ));
        
        if (!empty($terms) && !is_wp_error($terms)) {
            $selected = isset($_GET[$taxonomy]) ? $_GET[$taxonomy] : '';
            ?>
            <select name="<?php echo $taxonomy; ?>">
                <option value=""><?php echo $label; ?></option>
                <?php foreach ($terms as $term) : ?>
                    <option value="<?php echo $term->slug; ?>" <?php selected($selected, $term->slug); ?>><?php echo $term->name; ?></option>
                <?php endforeach; ?>
            </select>
            <?php
        }
    }

    /**
     * Filter properties by taxonomy
     */
    public function filter_properties_by_taxonomy($query) {
        global $pagenow, $typenow;
        
        if ($pagenow == 'edit.php' && $typenow == $this->post_type) {
            // Filter by taxonomy
            $taxonomies = array('property_type', 'property_location', 'drah_status');
            
            foreach ($taxonomies as $taxonomy) {
                if (isset($_GET[$taxonomy]) && !empty($_GET[$taxonomy])) {
                    $query->query_vars['tax_query'][] = array(
                        'taxonomy' => $taxonomy,
                        'field' => 'slug',
                        'terms' => $_GET[$taxonomy],
                    );
                }
            }
            
            // Filter by status
            if (isset($_GET['property_status']) && !empty($_GET['property_status'])) {
                $query->query_vars['meta_query'][] = array(
                    'key' => '_property_status',
                    'value' => $_GET['property_status'],
                    'compare' => '=',
                );
            }
            
            // Filter by DRAH
            if (isset($_GET['is_drah']) && $_GET['is_drah'] !== '') {
                $query->query_vars['meta_query'][] = array(
                    'key' => '_property_is_drah',
                    'value' => $_GET['is_drah'],
                    'compare' => '=',
                );
            }
        }
        
        return $query;
    }
}
