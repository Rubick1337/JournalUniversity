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
initializeRoute('subgroup', 'subgroup');


module.exports = router;