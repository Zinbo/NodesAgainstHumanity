$( document ).ready( function()
{
	setCardWidths();
});

function setCardWidths()
{
	$( ".black-card" ).each(function(){
		$( this ).height($( this ).innerWidth());
	});
	
	$( ".white-card" ).each(function(){
		$( this ).height($( this ).innerWidth());
	});
}