exports.halamanIndex = (req, res) => {
    res.render('index', { user: req.user })
}