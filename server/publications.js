Meteor.publish('groups', function() {
  return Groups.find();
});


Meteor.publish('meetings', function() {
  return Meetings.find();
});
Meteor.publish('speeches', function() {
  return Speeches.find();
});

Meteor.publish('presences', function() {
//  return Presences.find({}, { userId: true });
 return Presences.find({},{ userId: true}/*,{state: {currentRoomId: Session.get('currentRoomId')} }*/);
});

Meteor.publish("users", function () {
  return Meteor.users.find({}, {fields: {"profile.peerId": true, "emails.address": true} });
});
