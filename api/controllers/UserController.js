/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  // action - login
  login: async function (req, res) {
    if (req.method === 'GET') {
      return res.view('user/login');
    }
    if (!req.body.username || !req.body.password) {
      return res.badRequest();
    }

    var user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json('User not found!');
    }

    await sails.helpers.passwords.checkPassword(req.body.password, user.password).tolerate('incorrect', function () {
      req.body.password = false;
    });
    if (!req.body.password) {
      return res.status(401).json('Wrong password!');
    }

    req.session.regenerate(function (err) {
      if (err) {
        return res.serverError(err);
      }
      req.session.username = user.username;
      req.session.userID = user.id;
      req.session.userRole = user.role;
      return res.redirect(301, '/');
    });
  },

  // action - logout
  logout: async function (req, res) {
    req.session.destroy(function (err) {
      if (err) {
        return res.serverError(err);
      }
      return res.ok();
    });
  },

  // action - addUser
  add: async function (req, res) {
    var userID = req.session.userID;
    if (!await User.findOne(userID)) {
      return res.status(404).json('User not found');
    }

    var eventID = req.body.id;
    var thatEvent = await Events.findOne(eventID).populate('student', { id: userID });
    if (!thatEvent) {
      return res.status(404).json('Event not found');
    }
    if (thatEvent.student.length > 0) {
      return res.status(409).json('Already added');
    }

    var eventQuota = await Events.findOne(eventID).populate('student');
    var currentQuota = await Events.findOne(eventID).populate('student');
    if ((eventQuota.quota - currentQuota.student.length) <= 0) {
      return res.status(406).json('This event has been no quota left');
    }

    await User.addToCollection(userID, 'event').members(eventID);
    return res.ok();
  },

  // action - removeUser
  remove: async function (req, res) {
    var userID = req.session.userID;
    if (!await User.findOne(userID)) {
      return res.status(404).json('User not found');
    }

    var eventID = req.body.id;
    var thatEvent = await Events.findOne(eventID).populate('student', { id: userID });
    if (!thatEvent) {
      return res.status(404).json('Event not found');
    }
    if (thatEvent.student.length === 0) {
      return res.status(409).json('Nothing to delete');
    }

    await User.removeFromCollection(userID, 'event').members(eventID);
    return res.ok();
  },
};
