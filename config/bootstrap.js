/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function () {
  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```
  if (await Events.count() > 0) {
    return generateUsers();
  }

  await Events.createEach([
    { eventName: 'Speaking for Confidence', eventDate: '2022-07-02', shortDesc: 'Speak to the confidence', startTime: '15:00', longDesc: 'Long description for the speak for confidence', endTime: '17:00', venue: 'AAB609', imageURL: 'https://event.hkbu.edu.hk/files/1630905147_f.jpg', quota: 10, organizer: 'Department of Computer Science', isHighlight: 'on' },
    { eventName: 'Watch Great Movies', eventDate: '2022-07-15', shortDesc: 'Watch a great movie', startTime: '13:30', longDesc: 'Long description for the watch great movie', endTime: '16:30', venue: 'OEE1017', imageURL: 'https://event.hkbu.edu.hk/files/1630309381_f.jpg', quota: 20, organizer: 'Music Society', isHighlight: 'on' },
    { eventName: 'Language Conversation', eventDate: '2022-08-10', shortDesc: 'A language conversation', startTime: '14:30', longDesc: 'Long description for the language conversation', endTime: '16:30', venue: 'LT3', imageURL: 'https://event.hkbu.edu.hk/files/1632186222_f.jpg', quota: 15, organizer: 'Student Union', isHighlight: 'off' },
    { eventName: 'AI Technology', eventDate: '2022-08-11', shortDesc: 'A AI Technology show', startTime: '09:30', longDesc: 'Long description for AI technology show', endTime: '11:30', venue: 'AAB609', imageURL: 'https://event.hkbu.edu.hk/files/1632966980_f.jpg', quota: 30, organizer: 'Dance Society', isHighlight: 'on' },
    { eventName: 'YouTube Creator Academy', eventDate: '2022-08-30', shortDesc: 'A YouTube creator academy', startTime: '13:30', longDesc: 'Long description for the YouTube creator academy', endTime: '14:30', venue: 'DLB702', imageURL: 'https://event.hkbu.edu.hk/files/1631587348_f.jpg', quota: 20, organizer: 'Band Society', isHighlight: 'off' },
    { eventName: 'NLP trainings on job', eventDate: '2022-09-05', shortDesc: 'A NLP trainings on job', startTime: '18:30', longDesc: 'Long description for the NLP trainings on job', endTime: '20:30', venue: 'FSC901', imageURL: 'https://event.hkbu.edu.hk/files/1630657819_f.jpg', quota: 10, organizer: 'Student Union', isHighlight: 'on' },
    { eventName: 'CAPE Counselling service', eventDate: '2022-09-15', shortDesc: 'The CAPE Counselling service', startTime: '16:30', longDesc: 'Long description for the CAPE Counselling service', endTime: '18:30', venue: 'FSC901', imageURL: 'https://event.hkbu.edu.hk/files/1653367085_f.jpg', quota: 15, organizer: 'Department of Computer Science', isHighlight: 'on' },
    { eventName: 'New Horizons Workshop', eventDate: '2022-09-25', shortDesc: 'A New Horizons Workshop', startTime: '12:30', longDesc: 'Long description for the New Horizons Workshop', endTime: '15:30', venue: 'LT3', imageURL: 'https://event.hkbu.edu.hk/files/1655891651_f.jpg', quota: 20, organizer: 'Student Union', isHighlight: 'off' }
  ]);

  return generateUsers();

  async function generateUsers() {
    if (await User.count() > 0) {
      return;
    }

    var hashedAdminPw = await sails.helpers.passwords.hashPassword('asd135');
    var hashedStudentPw = await sails.helpers.passwords.hashPassword('asd123');

    await User.createEach([
      { username: 'Kenny', password: hashedAdminPw, role: 'admin' },
      { username: 'Martin', password: hashedAdminPw, role: 'admin' },
      { username: 'Tom', password: hashedStudentPw, role: 'student' },
      { username: 'Tim', password: hashedStudentPw, role: 'student' },
      { username: 'Sam', password: hashedStudentPw, role: 'student' },
      { username: 'Amy', password: hashedStudentPw, role: 'student' }
    ]);

    const sc = await Events.findOne({ eventName: 'Speaking for Confidence' });
    const wgm = await Events.findOne({ eventName: 'Watch Great Movies' });
    const lc = await Events.findOne({ eventName: 'Language Conversation' });
    const at = await Events.findOne({ eventName: 'AI Technology' });
    const yca = await Events.findOne({ eventName: 'YouTube Creator Academy' });
    const nlp = await Events.findOne({ eventName: 'NLP trainings on job' });
    const ccs = await Events.findOne({ eventName: 'CAPE Counselling service' });
    const nhw = await Events.findOne({ eventName: 'New Horizons Workshop' });

    const tom = await User.findOne({ username: 'Tom' });
    const tim = await User.findOne({ username: 'Tim' });
    const sam = await User.findOne({ username: 'Sam' });
    const amy = await User.findOne({ username: 'Amy' });

    await User.addToCollection(tom.id, 'event').members([sc.id, nhw.id]);
    await User.addToCollection(tim.id, 'event').members([sc.id, wgm.id, nhw.id]);
    await User.addToCollection(sam.id, 'event').members([wgm.id, lc.id, yca.id, nlp.id]);
    await User.addToCollection(amy.id, 'event').members([at.id, nlp.id, ccs.id]);
  }
};
