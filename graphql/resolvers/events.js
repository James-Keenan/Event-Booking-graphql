const Event = require("../../models/event");
const User = require("../../models/user");
const { dateToString } = require("../../helpers/date");

const { transformEvent } = require("./merge");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },

  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: req.userId,
    });
    try {
      let createEvent;
      const result = await event.save();
      createEvent = transformEvent(result);
      const userDoc = await User.findById(req.userId);
      if (!userDoc) {
        throw new Error("User not found.");
      }
      userDoc.createdEvents.push(event);
      await userDoc.save();

      return createEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
