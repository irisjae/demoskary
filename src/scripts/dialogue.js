var dialogue =	function (thought) {
					var mentions = stream ();
					var impressions = (thought || id) (mentions);
					
					var _dialogue =	function (x) {
											if (arguments .length) {
												mentions (x)
												return _dialogue;
											}
											else {
												return impressions ();
											}
										}
					_dialogue .mention =	function (x) {
												mentions (x)
											};
					_dialogue .impressions = impressions;
					_dialogue .impression =	function () {
												return impressions ();
											}
					
					return _dialogue;
				};
var is_dialogue =	function (x) {
						return (typeof (x) === 'function' && x .impressions) ? true : false;
					}