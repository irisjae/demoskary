var ref_diff =	function (name, ref_diffs) {
					return	ref_diffs
								.thru (spread)
								.thru (filter, function (diff) {
									return diff .type === 'add' && diff .ref === name;
								})
								.thru (map, function (diff) {
									return diff .node;
								});
				};
var ref_set_diff =	function (name, ref_diffs) {//TODO: add hashmap from node id (is there such a thing?) to index, so becomes O(1)
						var refs = [];
						return	ref_diffs
									.thru (tap, function (diffs) {
										diffs .forEach (function (diff) {
											if (diff .type === 'add')
												refs .push (diff .node);
											if (diff .type === 'remove')
												refs .splice (refs .indexOf (diff .node), 1);
										})
									})
									.thru (map, function () {
										return refs .slice ();
									});
					};	
var diff_refs =	function (refs) {
					var last_refs = {};
					return	refs
								.map (function (current) {
									var prev_refs = last_refs;
									last_refs = current;
								    return diff_ref (prev_refs, current);
								})
				}
				
var yield_refs =	function (refs) {
						var _refs = {};
						for (var yield_name in refs) {
							if (yield_name .startsWith ('yield:'))
								_refs [yield_name .slice ('yield:' .length)] = refs [yield_name]
						}
						return _refs;
					}
var self_refs =	function (refs) {
					var _refs = {};
					for (var yield_name in refs) {
						if (yield_name .startsWith ('self:'))
							_refs [yield_name .slice ('self:' .length)] = refs [yield_name]
					}
					return _refs;
				}
var diff_ref =	function (last_refs, now_refs) {
			    var diff = [];
			    for (var ref in now_refs) {
			    	for (var node of now_refs [ref]) {
			    		var node_index;
			    		if (last_refs [ref] && (node_index = last_refs [ref] .indexOf (node)) !== -1) {
			    			last_refs [ref] .splice (node_index, 1);
			    		}
			    		else {
			    			diff .unshift ({ ref: ref, type: 'add', node: node });
			    		}
			    	}
			    } 
			    for (var ref in last_refs) {
			    	for (var node of last_refs [ref]) {
			    		diff .unshift ({ ref: ref, type: 'remove', node: node });
			    	}
			    } 
			    return diff;
			};
							
var consistentfy =	function (original_refs) {
						var shallow_refs = {};
						for (var ref in original_refs) {
							shallow_refs [ref] = original_refs [ref]
							if (! shallow_refs [ref] .length)
								shallow_refs [ref] = [shallow_refs [ref]];
							else
								shallow_refs [ref] = shallow_refs [ref] .slice ();
						}
						return shallow_refs;
					};
