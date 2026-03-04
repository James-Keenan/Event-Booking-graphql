const DataLoader = require("dataloader");

const Event = require("../../models/event");
const User = require("../../models/user");

const { dateToString } = require("../../helpers/date");

const eventLoader = new DataLoader((eventIds) => {
  return events(eventIds);
});

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } }).then((users) => {
    return userIds.map((userId) => {
      return (
        users.find((user) => user._id.toString() === userId.toString()) || null
      );
    });
  });
});

const events = async (eventIds) => {
  try {
    const fetchedEvents = await Event.find({ _id: { $in: eventIds } });
    fetchedEvents.sort((a, b) => {
      return (
        eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
      );
    });
    return eventIds.map((id) => {
      const event = fetchedEvents.find(
        (e) => e._id.toString() === id.toString(),
      );
      if (!event) return null;
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async (eventId) => {
  try {
    return await eventLoader.load(eventId.toString());
  } catch (err) {
    throw err;
  }
};

const user = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());
    if (!user) {
      return null;
    }
    return {
      ...user._doc,
      password: null,
      _id: user.id,
      createdEvents: eventLoader.loadMany(
        user._doc.createdEvents.map((id) => id.toString()),
      ),
    };
  } catch (err) {
    throw err;
  }
};

const transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event._doc.creator),
  };
};

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
