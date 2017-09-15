/*
			<div class="elegant-faq micellar">
				<div class="faq-column">
				< ?
				$i		= 0;
				$nSecond	= round( count($faq) * 0.5 );
				$firstOpened	= 'ac'; // or ''
				foreach($faq as $item){
					if($i == $nSecond){
				?>
				</div>
				<div class="faq-column">
					< ? } ?>
					<div class="faq-item< ?=$i==0?' '.$firstOpened:''?>">
						<div class="el-question" data-id='< ?=$i+1;?>'>
							<p>< ?=$item->sz_title?></p>
						</div>
						<div class="answer" < ?=$i==0?' style="display:block;"':''?> >
							< ?=$item->sz_desc?>
							<a class="close" href="javascript:;" style="background:url(< ?=URL::base()?>assets/media/actbbc/close_atbildes.png) center no-repeat;"></a>
						</div>
					</div>
				< ?
					$i++;
				}
				?>
				</div>
			</div>

			<script>
				$(function(){
					$('.el-question').click(function(){
						var ac = $(this).closest('.elegant-faq').find('.faq-item.ac');
						var target = $(this).parent();
						if(!$(target).hasClass('ac')){
							$(target).addClass('ac');
							$(target).find('.answer').slideDown(500);
							$(ac).find('.answer').slideUp(500);
							$(ac).removeClass('ac');
							//ga('send', 'event', 'sleeping_questions', 'question', 'question nr.'+$(this).data('id'));
						}else{
							$(target).removeClass('ac');
							$(target).find('.answer').slideUp(500);
						}
					});
					$('.elegant-faq').find('.close').click(function(){
						var ac = $(this).closest('.elegant-faq').find('.faq-item.ac');
						if($(ac).hasClass('ac')){
							$(ac).removeClass('ac');
							$(ac).find('.answer').slideUp(500);
						}
					});
				});
				
				$('.tooltip').tooltipster(
					//{trigger:'click'}
				);
			</script>
*/

