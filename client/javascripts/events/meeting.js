//import { Template } from 'meteor/templating';
//import { ReactiveVar } from 'meteor/reactive-var';

var sortableList;
var meeting;

//Template.meeting.isTrue = true;
//console.log(Template.meeting.isTrue);

Presence.state = function() {
  return {
    online:true,
    currentRoomId: Session.get('currentRoomId')
  };
};


Template.meeting.helpers({


  users: function () {
        // exclude the currentUser
        var userIds = Presences.find().map(function(presence) {return presence.userId;});
        var userPres = Presences.find().map(function(presence) {
          if(presence.state.currentRoomId===Session.get('currentRoomId'))
            return presence.userId;
        });
        /*
        console.log("je suis connecté  " +userIds);
        console.log("je suis ici  " + userPres);*/
        return Meteor.users.find({_id: {$in: userPres, $ne: Meteor.userId()}});
      },

  getSpeaker: function(){
    meeting=Session.get("meeting");
      var speaker = Meetings.findOne({_id:meeting._id}).speaker;
      Session.set("speaker",speaker);

  },

  isSpeaker: function(){
      meeting=Session.get("meeting");
      speaker=Session.get("speaker");
      var mail;
      if(this.animatorMail)
        mail=this.animatorMail;
      else
        mail=""+this;
      return Meetings.findOne({_id:meeting._id}).speaker === mail;
  },


isAsking: function(){
    meeting=Session.get("meeting");
    var mail;
    if(this.animatorMail)
      mail=this.animatorMail;
    else
      mail=""+this;
    return Speeches.find({myMeetingId:meeting._id,speakers:mail}).count();
},


/*
  onLoad:function(){
    var meeting = this;
    Session.set("meeting",this);
    Session.set('currentRoomId',this._id);
    var idMeeting=this._id;
    var meetingParticipant= this.participantsEmails;
    var meetingParticipantActivity = this.participantActivity;

  },
*/
  ownMeeting:function(){
    meeting=Session.get("meeting");
    return meeting.animatorMail === Meteor.user().emails[0].address;
  },
  partMeeting:function(){
    var res=0;
    if(this.animatorMail === Meteor.user().emails[0].address){
      res=1;
    }
    else{
      var mail=""+this;
      if(mail===Meteor.user().emails[0].address)
        res=1;

      meeting=Session.get("meeting");

/*
      for(i=0;i<meeting.participantsEmails.length;i++){
        if(meeting.participantsEmails[i]===Meteor.user().emails[0].address){

          Meetings.update(idMeeting,{$set: {"meetingParticipantActivity[i]": true}});

          i=this.participantsEmails.length;
        }
      }
*/
    }

    return res;
  }
});


Template.meeting.events({
  'click #speakControl' : function(e){
    meeting=Session.get("meeting");
    speeches=Speeches.findOne({myMeetingId:meeting._id});
    if(this.animatorMail){
      Meetings.update(meeting._id, {$set: {speaker: this.animatorMail}});
    }
    else {
      var mail=""+this;
      Meetings.update(meeting._id, {$set: {speaker: mail}});
        Speeches.update(speeches._id , {$pull: {speakers: mail }} );
    }

  },

'click #speakAsk' : function(e){
  meeting=Session.get("meeting");
  speeches=Speeches.findOne({myMeetingId:meeting._id});



    var mail=""+this;
    Speeches.update(speeches._id , {$push: {speakers: mail }} );
},

'click #inviteSubmit' : function(e){
  meeting=Session.get("meeting");
  //speeches=Speeches.findOne({myMeetingId:meeting._id});

  var newParticipant=document.querySelectorAll('#newParticipant')[0].value;
  Meetings.update(meeting._id , {$push: {participantsEmails: newParticipant }} );
},



  'click #talkCancel' : function(e){
    console.log("I click on Talk");
    //à modifier
      var userId = Meteor.user().username;
      var meetingId = Meteor.user().meeting;
      var rank = 1;
      console.log("userId = " + userId);
      console.log("meeting = " + meetingId);


      // //Recherche du speech ayant le plus haut rang
      // speeches = Speeches.find({meeting: Session.get("meetingId")}, {sort: {rank: -1}}).fetch();
      // if (speeches.length > 0) {
      //     rank = speeches[0].rank+1;
      // }
      // Speeches.insert({
      //     user: userId,
      //     timeLeft: 0,
      //     status: "pending",
      //     meeting: Session.get("meetingId"),
      //     rank: rank
      // });
  },


  /** A click on waitProceed starts or stops the timer */
  'click #waitProceed': function(e) {
    //Arret du timer
    if(e.target.value == "Wait") {
      Meteor.clearInterval(timerId);
      Speeches.update(
        Speeches.findOne({meeting: Session.get("meetingId"), status: "ongoing"})._id,
        {$set: {status: "pending"}}
      );
    } else {
      Speeches.update(
        Speeches.findOne({meeting: Session.get("meetingId"), status: "pending"}, {sort: {rank: 1}})._id,
        {$set: {status: "ongoing"}}
      );

      //Lancement du timer
      timerId = Meteor.setInterval(function() {
        var currentSpeech = Speeches.findOne({meeting: Session.get("meetingId"), status: "ongoing"});
        var user = Users.findOne({_id:currentSpeech.user});
        var paroles = [];
        var time = 1;

        //Incrémentation du compteur associé a l'ordre du speech
        if (user.paroles === undefined) {
          paroles.push({"order": currentSpeech.orderChoose, "time": 1});
        } else {
          var paroleFound = false;
          paroles = user.paroles;
          paroles.forEach(function (el) {
            if (el['order'] == currentSpeech.orderChoose) {
              paroleFound = true;
              el['time'] = parseInt(el['time'])+1;
            }
          });
          if (!paroleFound) {
            paroles.push({"order": currentSpeech.orderChoose, "time": 1});
          }
        }

        Users.update(user._id,  {$set: {paroles: paroles}});

        //Update du temps restant du speech
        Speeches.update(
          currentSpeech._id,
          {$set: {timeLeft: Speeches.findOne({meeting: Session.get("meetingId"), status: "ongoing"}).timeLeft + 1}}
        );
        //Update du statut du speech si celui ci est terminé
        if(Speeches.findOne({meeting: Session.get("meetingId"), status: "ongoing"}).timeLeft == Speeches.findOne({meeting: Session.get("meetingId"), status: "ongoing"}).time){
          Speeches.update(
            Speeches.findOne({meeting: Session.get("meetingId"), status: "ongoing"})._id,
            {$set: {status: "done"}}
          );
          Meteor.clearInterval(timerId);
        }
      } , 1000);
    }
    //Rafraichi la fonction de drag'n'drop
    //Utile pour empêcher le déplacement du premier meeting quand on clique sur 'proceed'
    //trouver une autre solution (la méthode "refresh" semble inefficace)
      setTimeout(function () {
      sortableList.sortable("destroy");
      computeSortable(sortableList);
    }, 100)
    ;
  },

});

/*
Template.meeting.onRendered(function () {
$(document).ready(function(){
  $('#textareaRich').summernote({
    height: 300,
  });
});
});
*/

  Template.meeting.onCreated(function () {
    Meteor.subscribe("presences");
    Meteor.subscribe("users");

  //   meeting = this.data;
    Session.set("meeting",this.data);
    Session.set('currentRoomId',this._id);

});

/*
  Template.meeting.onLoad(function(){
    var meeting = this;
    Session.set("meeting",this);
    Session.set('currentRoomId',this._id);
    var idMeeting=this._id;
    var meetingParticipant= this.participantsEmails;
    var meetingParticipantActivity = this.participantActivity;
});
*/
Template.meeting.onDestroyed(function(){
    var filter={ userId: {$exists:true}};
    Session.set('currentRoomId','pas la');
    //console.log(te);
  });


Template.meeting.events({
  'click #saveReport' :function(e) {
    // increment the counter when button is clicked
    console.log("I click on Talk");
    var title = $(' #TitleReport').val();
    var data = $('#textareaRich').summernote('code');
    //$('.click2edit').summernote('destroy');
    console.log("title :" + title + " data = " + data);
    var doc = new jsPDF();
    doc.text(10,10,data);
    doc.save(title);
    //Fonctionne mais enregistre en .txt
    //var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
    //saveAs(blob, title+".txt");
  }
});
