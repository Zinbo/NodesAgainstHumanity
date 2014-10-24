$( document ).ready( function()
{	
	$( document.body ).on( 'click', '.dropdown-menu li', function( event ) {
 
		var $target = $( event.currentTarget );

		$target.closest( '.btn-group' )
		  .find( '[data-bind="label"]' ).text( $target.text() )
			 .end()
		  .children( '.dropdown-toggle' ).dropdown( 'toggle' );
		  
		  
		//Get rid of an option which was active before
		$(".expansion_option").each(function(){
			$( this ).attr('active', false);
		});
		
		//Set the selected one to true so we know which one is selected later
		$target.attr('active', true);

		return false;
	});
	
});