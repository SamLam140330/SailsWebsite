/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  // '/': { view: 'pages/homepage' },

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/
  'GET /': 'EventsController.home',
  'GET /home': 'EventsController.home',
  'GET /events/home': 'EventsController.home',

  'GET /events/create': 'EventsController.create',
  'POST /events/create': 'EventsController.create',

  'GET /events/search': 'EventsController.search',
  'POST /events/search': 'EventsController.search',

  'GET /events/update/:id': 'EventsController.update',
  'POST /events/update/:id': 'EventsController.update',

  'POST /events/delete/:id': 'EventsController.delete',

  'GET /events/admin': 'EventsController.admin',

  'GET /events/detail/:id': 'EventsController.detail',

  'GET /events/registered': 'EventsController.registered',

  'GET /events/:id/student': 'EventsController.student',

  'GET /user/login': 'UserController.login',
  'POST /user/login': 'UserController.login',

  'POST /user/logout': 'UserController.logout',

  'POST /user/event/': 'UserController.add',
  'DELETE /user/event/': 'UserController.remove',
};
