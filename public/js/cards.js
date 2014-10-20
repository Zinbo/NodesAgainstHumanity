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
	
	$('#create-card-button').click(function() {
		//Need to do self-validation as I can't figure out how to tell if a form is valid or not
		//from javascript, and I only want the modal to go away if the form is valid
		var formIsValid = true;
		$(".card-validation-needed").each(function(){
			if($( this ).val() == "") {
				formIsValid = false;
				//Why the fuck does return not return you out of the method, GOD JAVASCRIPT
				return false;
			}
		});
		
		if(formIsValid)
		{
			$('#cardModal').modal('hide');
		}
	});	
});