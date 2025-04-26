<?php
/**
 * The template for displaying the footer
 *
 * @package Multiverse_Platform_Simplified
 */
?>

	</div><!-- #content -->

	<footer id="colophon" class="site-footer">
		<div class="container">
			<div class="site-info">
				<?php
				/* translators: %s: CMS name, i.e. WordPress. */
				printf( esc_html__( 'Proudly powered by %s', 'multiverse-platform-simplified' ), 'WordPress' );
				?>
				<span class="sep"> | </span>
				<?php
				/* translators: 1: Theme name, 2: Theme author. */
				printf( esc_html__( 'Theme: %1$s by %2$s.', 'multiverse-platform-simplified' ), 'Multiverse Platform Simplified', '<a href="https://drah.tech">DRAH</a>' );
				?>
			</div><!-- .site-info -->
		</div>
	</footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
