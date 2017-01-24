var meetingId=0;
if (Meetings.find().count() === 0){
    meetingId = Meetings.insert({
    name: "Workshop Essilor",
    status: "ongoing",
    password: "pass",
    _id: "test",
  });
}


if (MeetingUsers.find().count() === 0){
  var userId = MeetingUsers.insert({
    name: "Franck",
    email: 'franck.foret@test.com',
    type: "animator",
    status: "online",
    meeting: meetingId,
    _id: "franck",
  });
}
