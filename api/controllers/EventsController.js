/**
 * EventsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  // action - home
  home: async function (req, res) {
    var limitEventShow = 4;
    var highlightEvents = await Events.find({
      where: { isHighlight: 'on' },
      limit: limitEventShow,
      sort: 'id DESC'
    });
    return res.view('events/home', { events: highlightEvents });
  },

  // action - create
  create: async function (req, res) {
    if (req.method === 'GET') {
      return res.view('events/create');
    } else {
      await Events.create(req.body).fetch();
      return res.redirect(301, '/');
    }
  },

  // action - search
  search: async function (req, res) {
    var whereClause = {};
    if (req.method === 'POST') {
      if (req.body.eventName) {
        whereClause.eventName = { contains: req.body.eventName };
      }
      if (req.body.organizer) {
        whereClause.organizer = req.body.organizer;
      }
      if (req.body.venue) {
        whereClause.venue = req.body.venue;
      }
      if (req.body.startDate && req.body.endDate) {
        whereClause.eventDate = { '>=': req.body.startDate, '<=': req.body.endDate };
      } else if (req.body.startDate) {
        whereClause.eventDate = { '>=': req.body.startDate };
      } else if (req.body.endDate) {
        whereClause.eventDate = { '<=': req.body.endDate };
      }
    }

    var perPage = Math.max(req.query.perPage, 2) || 2;
    if (perPage > 2) {
      perPage = 2;
    }
    var thoseEvents = await Events.find({
      where: whereClause,
      limit: perPage,
      skip: perPage * (Math.max(req.query.current - 1, 0) || 0)
    });
    var count = await Events.count({
      where: whereClause
    });

    if (req.wantsJSON) {
      if (req.method === 'POST') {
        thoseEvents.push(count);
      }
      return res.json(thoseEvents);
    } else {
      return res.view('events/search', { total: count });
    }
  },

  // action - update
  update: async function (req, res) {
    if (isNaN(req.params.id)) {
      return res.redirect(301, '/');
    } else {
      if (req.method === 'GET') {
        var thatEvent = await Events.findOne(req.params.id);
        if (!thatEvent) {
          return res.notFound();
        }
        return res.view('events/update', { event: thatEvent });
      } else {
        var updatedEvent = await Events.updateOne(req.params.id).set(req.body);
        if (!updatedEvent) {
          return res.notFound();
        }
        return res.redirect(301, '/events/admin');
      }
    }
  },

  // action - delete
  delete: async function (req, res) {
    if (isNaN(req.params.id)) {
      return res.redirect(301, '/');
    } else {
      var deletedEvent = await Events.destroyOne(req.params.id);
      if (!deletedEvent) {
        return res.notFound();
      }
      return res.redirect(301, '/events/admin');
    }
  },

  // action - admin
  admin: async function (req, res) {
    var allEvents = await Events.find();
    return res.view('events/admin', { events: allEvents });
  },

  // action - detail
  detail: async function (req, res) {
    if (isNaN(req.params.id)) {
      return res.redirect(301, '/');
    } else {
      var thatEvent = await Events.findOne(req.params.id);
      if (!thatEvent) {
        return res.notFound();
      }

      var isAdded = false;
      var isLogin = req.session.username;
      if (isLogin) {
        var isEventAdded = await Events.findOne(req.params.id).populate('student', { id: req.session.userID });
        if (isEventAdded.student.length > 0) {
          isAdded = true;
        }
      }
      return res.view('events/detail', { event: thatEvent, eventAdded: isAdded });
    }
  },

  // action - registeredEvent
  registered: async function (req, res) {
    var perPage = Math.max(req.query.perPage, 3) || 3;
    if (perPage > 3) {
      perPage = 3;
      req.query.perPage = 3;
    }

    const user = await User.findOne(req.session.userID).populate('event');
    const userRegistered = [];
    user.event.forEach(function (event) {
      userRegistered.push(event.id);
    });
    var whereClause = {};
    whereClause.id = userRegistered;
    var thoseEvents = await Events.find({
      where: whereClause,
      limit: perPage,
      skip: perPage * (Math.max(req.query.current - 1, 0) || 0)
    });

    if (req.wantsJSON) {
      return res.json(thoseEvents);
    } else {
      var thoseEventsCount = await Events.count({
        where: whereClause
      });
      return res.view('events/registered', { total: thoseEventsCount });
    }
  },

  // action - registeredStudent
  student: async function (req, res) {
    if (isNaN(req.params.id)) {
      return res.redirect(301, '/');
    } else {
      const events = await Events.findOne(req.params.id).populate('student');
      if (!events) {
        return res.notFound();
      }
      const studentList = [];
      events.student.forEach(function (student) {
        studentList.push(student.id);
      });

      var whereClause = {};
      whereClause.id = studentList;
      var thoseStudents = await User.find({
        where: whereClause
      });
      return res.view('events/student', { allStudents: thoseStudents });
    }
  }
};
