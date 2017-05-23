//constants
var R = require ('ramda');
var compiler = require ('riot-compiler');
var scss = require ('node-sass');
var path = require ('path');
var tags_src = path .join (__dirname, '/../src/app');
var tags_dist = path .join (__dirname, '/../src/scripts/app.js');
var styles_src = path .join (__dirname, '/../src/metastyles');
var styles_cache = path .join (__dirname, '/../src/styles/cache');
var styles_copy = path .join (__dirname, '/../src/styles/copy');
var styles_dist = path .join (__dirname, '/../src/styles/styles.css');

//utils
var fs = require ('fs-extra');
var files =	function (extension) {
				return	function (dir) {
							var results = [];
							var list = fs .readdirSync (dir);
							list .forEach (function (file) {
								file = dir + '/' + file;
								var stat = fs .statSync (file);
								if (stat && stat .isDirectory ())
									results = results .concat (files (extension) (file));
								else if (file .endsWith (extension))
									results .push (file);
							});
							return results;
						}
			};
var file =	function (path) {
				return fs .readFileSync (path) .toString ();
			};
var write =	function (path) {
				return	function (string) {		
							fs .outputFileSync (path, string);
						}
			};
var time =	function (name, what) {
				var start = new Date ();
				try {
					var x = what ();
					console .log (name, 'took', (new Date () - start) / 1000, 's');
				}
				catch (e) {
					console .log (name, 'failed', (new Date () - start) / 1000, 's', e);
					throw e;
				}
				return x;
			};

//styles renderer
var styles =	(function () {
					var css = require ('css');
	
					
					scss .compile =	function (metastyles) {
										return	(scss .renderSync ({
													data: metastyles || '/**/'/*,
													omitSourceMapUrl: true,
													sourceMap: false,
													sourceMapContents: false,
													sourceMapEmbed: false,
													sourceMapRoot: false*/
												})) .css .toString ();
									};
					/* Use self */
					var use_self =	function (tag) {
										return	function (tag_metastyles) {
													/*return	tag + ',[data-is="' + tag + '"] {' + '\n' +*/
													return	tag + ' {' + '\n' +
																tag_metastyles + '\n' +
															'}';
												};
									};
					var stringify =	function (node_array) {
										return	css .stringify ({
													type: 'stylesheet',
													stylesheet:	{
																	rules: node_array,
																	parsingErrors: []
																}
												});
									};
					/*var diff =	function (base_styles, styles) {
									var css_semdiff = require ('css-semdiff');
					
									return	stringify (
												css_semdiff .default .ast (
													css .parse (base_styles),
													css .parse (styles)
												) .extra
											);
								}; */
					var placeholderify_selectors =	function (metastyles) {
														var placeholder_metastyles = '';
														while (metastyles !== placeholder_metastyles) {
															placeholder_metastyles = metastyles;
															metastyles = metastyles .replace (/((?:\}|\{|^)[^{}]+?)\.([^{};]+?\{)/g, '$1%$2');
														}
														return metastyles;
													};
					var placeholderify_extends =	function (metastyles) {
														var placeholder_metastyles = '';
														while (metastyles !== placeholder_metastyles) {
															placeholder_metastyles = metastyles;
															metastyles = metastyles .replace (/(@extend[^.;{}]+)\.([^;{}]+;)/g, '$1%$2');
														}
														return metastyles;
													};
					var union =	function (styles_set) {
									/*if (styles_set .length === 1)
										return styles_set [0];*/
						
									var NodeSet = require ('css-semdiff/dist/css_utils') .NodeSet;
									var uniformNode = require ('css-semdiff/dist/css_utils') .uniformNode;
									var flatMap = require ('css-semdiff/dist/collection_utils') .flatMap;
									
									return	stringify (
												styles_set .map (function (styles) {
													var rules = css .parse (styles) .stylesheet .rules;
													var uniformed_nodes = flatMap (rules, uniformNode);
													return new NodeSet (uniformed_nodes);
												}) .reduce (function (union_set, node_set) {
													for (var node of node_set .nodes) {
														union_set .add (node);
													}
													return union_set;
												}) .toArray ()
											);
								};
					var extend =	function (base_styles, metastyles) {
										var faux_base_styles;
										var faux_metastyles;
										//time ('placeholderify', function () {
											faux_base_styles = placeholderify_selectors (base_styles);
											faux_metastyles = placeholderify_extends (metastyles);	
										//});
										//write (styles_base) (faux_base_styles + '\n' + faux_metastyles);
										return scss .compile (faux_base_styles + faux_metastyles);
									};

					var bottom_depth = 0;
					var treeify =	function (filename) {
										var style_path = filename .slice (styles_src .length + 1);
										var depth =	style_path .split ('/') .length - 1
										
										console .log ('treeifying ' + style_path);
										
										if (depth > bottom_depth)
											bottom_depth = depth;
										return	{
													depth: depth,
													metastyles: file (filename),
													path: style_path
												};
									};
					var grow_tree =	function (root_styles, metastyles_tree, depth) {
										if (! metastyles_tree .length)
											return root_styles;
											
										depth = depth || 0;
										
										var level_extensions =	metastyles_tree .filter (function (node) {
																	return node .depth === depth;
																}) .map (function (node) {
																	var metastyles = node .metastyles;
																	return	time ('cached extend ' + node .path, () =>
																				cache_at (node .path, root_styles + node .metastyles, () =>
																					extend (root_styles, metastyles)));
																});
										
										var union_path = new Array (depth + 1) .join ('leaves/') + 'union.css';
										
										var level_union =	time ('cached union depth ' + depth, () =>
																cache_at (union_path, root_styles + level_extensions, () =>
																	union ([root_styles] .concat (level_extensions))));
										
										return	grow_tree (level_union, metastyles_tree .filter (function (node) {
													return node .depth !== depth;
												}), depth + 1)
									};
									
					var invalidate_cache =	function () {
												invalidate (styles_cache)
												invalidate (styles_copy)
											}
					var invalidate =	function (dir) {
											fs .readdirSync (dir) .forEach (function (file) {
												const file_path = path .resolve (dir, file);
												const file_info = fs .statSync (file_path);
												
												if (file_info .isDirectory ()) {
													invalidate (file_path)
												}
												else {
													if (file_path .endsWith ('.cache')) {
														fs .renameSync (file_path, file_path .replace (/\.cache$/, '.cache.active'))
													}
												}
											})
										};
									
					var cache_at =	function (path, copy_source, cache_source) {
										var copy_path = (styles_copy + '/' + path) .replace (/\.css$|\.scss$/, '.cache.active')
										var cache_path = (styles_cache + '/' + path) .replace (/\.css$|\.scss$/, '.cache.active')
										if (fs .existsSync (copy_path) && file (copy_path) === copy_source) {
											var cache = file (cache_path)
											
											var new_copy_path = copy_path .replace (/\.cache.active$/, '.cache.new')
											var new_cache_path = cache_path .replace (/\.cache.active$/, '.cache.new')
											fs .renameSync (copy_path, new_copy_path)
											fs .renameSync (cache_path, new_cache_path)
											
											return cache;
										}
										else {
											var cache = cache_source ();
											
											var new_copy_path = (styles_copy + '/' + path) .replace (/\.css$|\.scss$/, '.cache.new')
											var new_cache_path = (styles_cache + '/' + path) .replace (/\.css$|\.scss$/, '.cache.new')
											write (new_copy_path) (copy_source);
											write (new_cache_path) (cache);
											
											return cache;
										}
									};
									
					var refresh_cache =	function () {
											refresh (styles_cache)
											refresh (styles_copy)
										};
					var refresh =	function (dir) {
										fs .readdirSync (dir) .forEach (function (file) {
											const file_path = path .resolve (dir, file);
											const file_info = fs .statSync (file_path);
											
											if (file_info .isDirectory ()) {
												refresh (file_path)
											}
											else {
												if (file_path .endsWith ('.cache') || file_path .endsWith ('.cache.active')) {
													fs .unlinkSync (file_path)
												}
												if (file_path .endsWith ('.cache.new')) {
													fs .renameSync (file_path, file_path .replace (/\.cache\.new$/, '.cache'))
												}
											}
										})
									};

					
					var base_tree =	files ('.css') (styles_src) .map (treeify) .concat (
										files ('.scss') (styles_src) .map (treeify));
					
					
					//add faux source map
					//use placeholders
					//base_metastyles = scss .renderSync ({ data: base_metastyles }) .css .toString ();
					/*base_metastyles =	base_metastyles .replace (/(\}|\{|^)([^{}]+?)\{/g, '$1$2{\nrule:"$2";\n') .replace (/\nrule:"([^{}]*?)";\n/g, function (sourcemap, rule) { 
											var selector = rule .replace (/\/\*[^]*?\*\//g, '') .replace (/\/\*|\*\//g, '') .replace (/\n|\r/g, '') .trim ();
											if (selector .indexOf ('@') === -1)
												return '\nrule:"' + selector + '";\n';
											else
												return '';
										});*/
									
																				
					return	{
								extend:	function (tag, tag_metastyles) {
											try {
												console .log ('extracting styles in ' + tag);
												
												base_tree .push ({
													depth: bottom_depth + 1,
													metastyles: use_self (tag) (tag_metastyles),
													path: (new Array (bottom_depth + 1)) .fill ('leaves') .join ('/') + '/' + tag + '.css'
												});

												return '/* ' + tag + ' included */';
											}
											catch (error) {
												console .error ('failed!');
												throw error;
											}
										},
								grow:	function () {
											fs .ensureDirSync (styles_copy)
											fs .ensureDirSync (styles_cache)
									
											invalidate_cache ()
											var answer = grow_tree ('', base_tree);
											refresh_cache ();
											return answer;
										}
							};
				}) ();

var indent =	function (string) {
					return '\t' + string .split ('\n') .join ('\n\t');
				};
//tag renderer			
var render =	function (tag_name, tag_src, parent_name) {
	
					var subcomponents = [];
					var expressions = [];
					var scripts = [];
	
					return	R. pipe (
								/* Extract subcomponents */
								function (def) {
									return def .replace (/^(?:(?:(?!<\/component>)[^])*)<component(?:| [^>]*)>([^]*)<\/component>(?:(?:(?!<\/component>)[^])*)$/g, function (match, subcomponent_src) {
										subcomponents .push (render (tag_name + '-sub-' + (subcomponents .length + 1), subcomponent_src, tag_name));
										return '';
									})
								},
								/* Extract styles */
								function (def) {
									return def .replace (/<style>((?:(?!<\/)[^])*)<\/style>/g, function (match, metastyles) {
										styles .extend (tag_name, metastyles, parent_name);
										return '';
									})
								},
								/* Extract scripts  */
								function (def) {
									return def .replace (/<script>((?:(?!<\/)[^])*)<\/script>/g, function (match, metascript) {
										scripts .push (metascript);
										return '<script-stub n=' + scripts .length + ' />';
									})
								},
								/* Inject sciprts  */
								function (def) {
									return def .replace (/<script-stub n=(\d+) \/>/g, function (match, n) {
										return '<script>\n(function (self, args, my) {\n' + scripts [n - 1] + '\n}) (this, this .args, this .my);\n</script>';
									})
								},
								/* Inject subcomponents  */
								function (def) {
									return	[def] .concat (subcomponents)
												.reduce (function (sum, next) { return sum + next; }, ''); 
								}
							) (
								'<' + tag_name + '>' + '\n' +
									indent (tag_src) + '\n' +
								'</' + tag_name + '>'
							) + '\n'
				};

			//var pages = files ('.ejs') (tags_src) .map (function (path) { return path .slice (tags_src .length + 1) .split ('/') .join ('-') .split ('.') [0] }) .filter (function (x) { return x .startsWith ('page') });
			
			
/*
var ejs = require ('ejs');
var escape_string =	function (the_function) {
						var function_source = the_function .toString ();
						return function_source .match (/[^]*\/\*([^]*)\*\/\}$/) [1];
					};
var escape_function =	function (the_function) {
							var function_source = the_function .toString ();
							var function_arguments = /^[^(]*\(([^)]*)\)/ .exec (function_source) [1] .replace (/\s/g, '') .split (',');
							var function_body = /^[^{]*{([^]*)}[^}]*$/ .exec (function_source) [1];
							return 'new Function (' + function_arguments .concat ([function_body]) .map (JSON .stringify) .join (',') + ')';
						};*/


//build
time ('build', function () {
	write (tags_dist)
		(compiler .compile (
			files ('.ejs') (tags_src)
				.map (function (tag_path) {
					var tag_relative_path = tag_path .slice (tags_src .length + 1);
					var tag_name =	tag_relative_path
										.split ('/') .join ('-')
										.split ('.') [0];
										
					var tag_dir_path =	tag_relative_path
											.split ('.')
												.slice (0, -1)
											.join ('.');
					/*var tag_resource =	function (resource_name) {
											return	file (tag_dir_path + '/' + resource_name);
										};
										
					ejs .render (file (tag_full_path), {
						tag: tag_name,
						//file: tag_resource,
						//pages: pages,
						$__: escape_string,
						__: escape_function
					})*/
								
					try {
						console .log ('rendering ' + tag_name);
						
						return render (tag_name, file (tag_path));
					}
					catch (error) {
						console .error ('failed!');
						throw error;
					}
				})
				.reduce (function (sum, next) { return sum + next; }, '')
		)
	);
	write (styles_dist) (styles .grow ());
});