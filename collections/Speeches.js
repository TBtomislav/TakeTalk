/** The collection that contains the speeches */
Speeches = new Mongo.Collection("speeches");

Speeches.allow({
  update: function() { return true/*return ownsDocument(userId, group);*/ },
  remove: function() { return true },
  insert: function() {
    return true;
  }
 });


 Meteor.methods({
     speechesInsert: function(speechesAttributes) {

         check(speechesAttributes, {
             meetingID: String/*,
             speakers: [String]
             */
         });



         var speechesId = Speeches.insert(speechesAttributes);


         return {
             _id: speechesId
         };
     }
 });
