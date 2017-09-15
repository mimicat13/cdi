		/*
		<input type="checkbox" id="c0" class="option option-0"  data-id="0" /><label for="c0"></label>
			<input type="checkbox" id="c1" class="subOption-0" data-id="0" /><label for="c1"></label>
			<input type="checkbox" id="c2" class="subOption-0" data-id="0" /><label for="c2"></label>
		*/

		var l					= $('.option').size();
		for(var i = 0; i < l; i++){
			$('.subOption-'+i).click(function(){
				var iter		= $(this).data('id');
				var checkedCount	= 0;
				var subs		= $('.subOption-' + iter).size();
				$('.subOption-' + iter).each(function(i, dom){
					if( $(dom).prop('checked') ){
						checkedCount++;
					}
				});
				
				if(checkedCount > 0){
					$('.option-' + iter).prop('checked', true);
				}
				
				//$('.option-' + iter).prop('checked', checkedCount > 0);
				//$('.option-' + iter).prop('indeterminate', checkedCount > 0 && checkedCount < subs);
			});
			$('.option-' + i).click(function(){
				var iter		= $(this).data('id');
				var l			= $('subOption-'+iter).size();
				var that		= $(this);
				$('.subOption-'+iter).each(function(i, dom){
					if(!that.prop('checked')){
						$(dom).prop('checked', that.prop('checked'));
						
						// CLOSE DROPPER
						//...
					} else {
						$(dom).prop('checked', that.prop('checked'));
						
						// OPEN DROPPER
						//...
					}
				});
			});
		}