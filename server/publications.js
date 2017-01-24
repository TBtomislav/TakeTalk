Meteor.publish('groups', function() {
  return Groups.find();
});

Meteor.publish('meetings' , function(){
  return Meetings.find();
});

Meteor.publish('meetingUsers', function(){
  return MeetingUsers.find();
});
