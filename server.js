var serve_dir = __dirname + '/static';
var faux_serve_dirs = [__dirname + '/platforms/browser/www'];



        var use_logs =  function (app) {
                            app .use (require ('morgan') ('combined'));
                            app .all ('*', function (req, res, next) {
                                console .log ('new request');
                                next ();
                            });
                        };
        var use_cookies =   function (app) {
                                app .use (require ('cookie-parser') ());
                            };
        var use_body =  function (app) {
                            app .use (require ('body-parser') .json () );
                            app .use (require ('body-parser') .urlencoded ({extended: true}));
                        };
                            
        var serve_files =   function (app) {
                                app .use (require ('express') .static (serve_dir));
                                for (var dir of faux_serve_dirs)
                                    app .use (require ('express') .static (dir));
                            };
        var serve_unhandled =   function (app) {
                                    app .all ('*', function (req, res, next) {
                                        res .status (404) .end ();
                                    });
                                };


var server = (function () {
    var express = require ('express');
    var app = express ();
    
    use_cookies (app);
    use_body (app);
    use_logs (app);
    
    app .use ('/', (function () {
        var app = express ();
        
        serve_files (app);
        serve_unhandled (app);
        
        return app;
    }) ());
    
    var server = app .listen (process .env .PORT, function () {
        var host = server .address () .address;
        var port = server .address () .port;
        console .log ('Listening at http://%s:%s', host, port);
    });
    
    return server;
}) ();
module .exports = server;