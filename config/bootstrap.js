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
    { eventName: 'Speaking for Confidence', eventDate: '2021-12-25', shortDesc: 'Speak to confidence', startTime: '15:00', longDesc: 'Long description for speak for confidence', endTime: '17:00', venue: 'AAB609', imageURL: 'https://event.hkbu.edu.hk/files/1630905147_f.jpg', quota: 10, organizer: 'Department of Computer Science', isHighlight: 'on' },
    { eventName: 'Watch Great Movies', eventDate: '2021-12-27', shortDesc: 'Watch a great movie', startTime: '13:30', longDesc: 'Long description for watch great movie', endTime: '16:30', venue: 'OEE1017', imageURL: 'https://event.hkbu.edu.hk/files/1630309381_f.jpg', quota: 20, organizer: 'Music Society', isHighlight: 'on' },
    { eventName: 'Language Conversation', eventDate: '2021-12-29', shortDesc: 'A language conversation', startTime: '14:30', longDesc: 'Long description for language conversation', endTime: '16:30', venue: 'LT3', imageURL: 'https://event.hkbu.edu.hk/files/1632186222_f.jpg', quota: 15, organizer: 'Student Union', isHighlight: 'off' },
    { eventName: 'AI Technology', eventDate: '2022-01-03', shortDesc: 'A AI Technology show', startTime: '09:30', longDesc: 'Long description for AI technology show', endTime: '11:30', venue: 'AAB609', imageURL: 'https://event.hkbu.edu.hk/files/1632966980_f.jpg', quota: 30, organizer: 'Dance Society', isHighlight: 'on' },
    { eventName: 'YouTube Creator Academy', eventDate: '2022-01-05', shortDesc: 'A YouTube creator academy', startTime: '13:30', longDesc: 'Long description for YouTube creator academy', endTime: '14:30', venue: 'DLB702', imageURL: 'https://event.hkbu.edu.hk/files/1631587348_f.jpg', quota: 20, organizer: 'Band Society', isHighlight: 'off' },
    { eventName: 'NLP trainings on job', eventDate: '2022-01-10', shortDesc: 'A NLP trainings on job', startTime: '18:30', longDesc: 'Long description for NLP trainings on job', endTime: '20:30', venue: 'FSC901', imageURL: 'https://event.hkbu.edu.hk/files/1630657819_f.jpg', quota: 10, organizer: 'Student Union', isHighlight: 'on' },
    { eventName: 'Research Labs', eventDate: '2022-01-12', shortDesc: 'A Research Labs', startTime: '16:30', longDesc: 'Long description for A Research Labs', endTime: '18:30', venue: 'FSC901', imageURL: 'https://www.hkbu.edu.hk/eng/main/images/20200703_227x148_labs-01.jpg', quota: 15, organizer: 'Department of Computer Science', isHighlight: 'on' },
    { eventName: 'Make a Gift', eventDate: '2022-01-13', shortDesc: 'Go make a Gift', startTime: '12:30', longDesc: 'Long description for Make a Gift', endTime: '15:30', venue: 'LT3', imageURL: 'https://www.hkbu.edu.hk/eng/main/images/donation.png', quota: 20, organizer: 'Student Union', isHighlight: 'off' },
  ]);

  return generateUsers();

  async function generateUsers() {
    if (await User.count() > 0) {
      return;
    }

    var hashedAdminPw = await sails.helpers.passwords.hashPassword('123456');
    var hashedStudentPw = await sails.helpers.passwords.hashPassword('123');

    await User.createEach([
      { username: 'Kenny', password: hashedAdminPw, role: 'admin' },
      { username: 'Martin', password: hashedAdminPw, role: 'admin' },
      { username: 'Tom', password: hashedStudentPw, role: 'student' },
      { username: 'Tim', password: hashedStudentPw, role: 'student' },
      { username: 'Sam', password: hashedStudentPw, role: 'student' },
      { username: 'Amy', password: hashedStudentPw, role: 'student' },
    ]);

    const sc = await Events.findOne({ eventName: 'Speaking for Confidence' });
    const wgm = await Events.findOne({ eventName: 'Watch Great Movies' });
    const lc = await Events.findOne({ eventName: 'Language Conversation' });
    const at = await Events.findOne({ eventName: 'AI Technology' });
    const yca = await Events.findOne({ eventName: 'YouTube Creator Academy' });
    const nlp = await Events.findOne({ eventName: 'NLP trainings on job' });
    const rl = await Events.findOne({ eventName: 'Research Labs' });
    const mg = await Events.findOne({ eventName: 'Make a Gift' });

    const tom = await User.findOne({ username: 'Tom' });
    const tim = await User.findOne({ username: 'Tim' });
    const sam = await User.findOne({ username: 'Sam' });
    const amy = await User.findOne({ username: 'Amy' });

    await User.addToCollection(tom.id, 'event').members([sc.id, mg.id]);
    await User.addToCollection(tim.id, 'event').members([sc.id, wgm.id, mg.id]);
    await User.addToCollection(sam.id, 'event').members([wgm.id, lc.id, yca.id, nlp.id]);
    await User.addToCollection(amy.id, 'event').members([at.id, nlp.id, rl.id]);
  }
};
