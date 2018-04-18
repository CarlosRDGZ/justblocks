//Rutas modulares para usuarios que ya iniciaron sesión
var express = require('express');
var router = express.Router();

router.get("/", function(req, res) {
	res.render("app/home");
})

 router.route("/logout").get(function(req, res){
    req.session.destroy();
    res.redirect("/");
});	
module.exports = router;
