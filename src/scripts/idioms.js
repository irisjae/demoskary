var dependent =	function (func/*, from flyds */) {
					var samplers = [] .slice .call (arguments, 1);
									
					return constant (mechanism (func, samplers));
				};
/*var assimilate =	function (parent, self) {
						parent .__parent = self .__parent;
						self .__parent = parent;
						
						return self;
					}

var imitate =	function (sibling, self) {
					self .__dialogues = sibling .__dialogues;
					
					return self;
				}*/

var reframe =	function (parent, self) {
					self .__parent = parent;
				
					return self;
				}
var resettle =	function (paper, self) {
					self .__parent = paper .realize ();
				
					return self;
				}