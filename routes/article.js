// GET     /          ->  index
// GET     /new       ->  new
// POST    /          ->  create
// GET     /:id       ->  show
// GET     /:id/edit  ->  edit
// PUT     /:id       ->  update
// DELETE  /:id       ->  destroy

exports = module.exports = function($ctrlers) {
    return {
        index: function(req, res, next) {
            $ctrlers.article.page(1, 10, {}, function(err, articles) {
                res.json({
                    articles: articles
                });
            });
        },
        new: function(req, res, next) {
            if (res.locals.user) {
                res.render('article/new');
            } else {
                res.redirect('/signin');
            }
        },
        create: function(req, res, next) {
            if (res.locals.user) {
                var baby = req.body.article;
                if (baby) {
                    baby.author.push(res.locals.user._id);
                    $ctrlers.article.create(baby, function(err, b) {
                        console.log(b);
                        res.json({
                            stat: !err ? 'ok' : 'error',
                            article: !err ? b : null
                        });
                    });
                } else {
                    next(new Error('params required'))
                }
            } else {
                next(new Error('signin required'))
            }
        },
        show: function(req, res, next) {
            var url = req.params.article;
            if (url) {
                $ctrlers.article.findOne({
                    url: url
                }, function(err, article) {
                    if (!err) {
                        res.render('article/single', {
                            article: article
                        });
                    } else {
                        next(err);
                    }
                });
            } else {
                next(new Error('404'));
            }
        },
        edit: function(req, res, next) {
            if (res.locals.user) {
                $ctrlers.article.checkAuthor(res.locals.user, req.params.article, function(err, stat, article) {
                    if (!err) {
                        if (stat) {
                            res.render('article/edit', {
                                article: article
                            });
                        } else {
                            next(new Error('authed users required'))
                        }
                    } else {
                        next(err);
                    }
                });
            } else {
                next(new Error('authed users required'))
            }
        },
        update: function(req, res, next) {
            if (res.locals.user) {
                $ctrlers.article.checkAuthor(res.locals.user, req.params.article, function(err, stat, article) {
                    if (!err) {
                        if (stat) {
                            $ctrlers.article.update(req.params.article, req.body.article, function(err) {
                                res.json({
                                    stat: !err ? 'ok' : 'error'
                                })
                            })
                        } else {
                            next(new Error('authed users required'))
                        }
                    } else {
                        next(err);
                    }
                });
            } else {
                next(new Error('authed users required'))
            }
        },
        destroy: function(req, res, next) {
            if (res.locals.user) {
                $ctrlers.article.checkAuthor(res.locals.user, req.params.article, function(err, stat, article) {
                    if (!err) {
                        if (stat) {
                            $ctrlers.article.remove(req.params.article, function(err) {
                                res.json({
                                    stat: !err ? 'ok' : 'error'
                                });
                            });
                        } else {
                            next(new Error('authed users required'))
                        }
                    } else {
                        next(err);
                    }
                });
            } else {
                next(new Error('authed users required'))
            }
        }
    }
}