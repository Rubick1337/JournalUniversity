const { message } = require('../error/ApiError');

const router = require('express').Router();


router.get('/',(req,res) => {
    res.status(200).json({message: 'homepage'})
})

function initializeRoute(route, routeName) {
    const newRouter = require(`./${route}`);
    router.use(`/${routeName}`, newRouter);
}


initializeRoute('person', 'person');
// initializeRoute('user', 'user');
// initializeRoute('projectStatus', 'projectStatus');
// initializeRoute('information', 'information');
// initializeRoute('project', 'project');

module.exports = router;