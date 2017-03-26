/** The collection that contains the meetings */
Meetings = new Mongo.Collection("meetings");

Meetings.allow({
  update: function() { return true/*return ownsDocument(userId, group);*/ },
  remove: function() { return true },
  insert: function() {
    return true;
  }
 });


 Meteor.methods({
     meetingInsert: function(meetingAttributes) {

         check(meetingAttributes, {
             name: String,
             duration: String,
             animatorName: String,
             animatorMail:String,
             participantsEmails: [String],
             participantActivity: [Boolean],
             status: String,
             ordres: [String],
             ordreTimes: [Number],
             speaker:String/*,
             pwd : "" */
         });

         var meeting = _.extend(meetingAttributes, {
             submitted: new Date()
         });
         var meetingId = Meetings.insert(meeting);


         return {
             _id: meetingId
         };
     }
 });

/*
 Exemple :

 name: 'test',
 status: "ongoing",
 ordres: ['ordre1', 'ordre2', 'ordre3'],
 ordreTimes: [90, 130, 268],
 _id: id
 pwd : ""
 */
