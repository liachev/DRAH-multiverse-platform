<?php
/**
 * The main template file
 *
 * @package Multiverse_Platform_Simplified
 */

get_header();
?>

<main id="primary" class="site-main">
    <div class="container">
        <?php
        if (have_posts()) :

            if (is_home() && !is_front_page()) :
                ?>
                <header>
                    <h1 class="page-title"><?php single_post_title(); ?></h1>
                </header>
                <?php
            endif;

            /* Start the Loop */
            while (have_posts()) :
                the_post();

                get_template_part('template-parts/content');

            endwhile;

            the_posts_navigation();

        else :

            get_template_part('template-parts/content', 'none');

        endif;
        ?>
    </div>
</main><!-- #main -->

<?php
get_footer();
