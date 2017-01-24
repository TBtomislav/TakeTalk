/** The configuration for the main layout */

Router.configure({layoutTemplate: 'layout', notFoundTemplate: 'notFound'});

/** The route to the home page */
Router.route('/', {name:'home'});

/** The route to the tutorial page*/
Router.route('/tutorial', {name: 'tutorial'});

//Router.route('/create', {name: 'create'});

Router.route('/create/:_id?', {
  name: 'create',
  data: function() { return Groups.findOne(this.params._id); }
});


/** The route to the downloads page */
Router.route('/downloads', {name: 'downloads'});




/** The route to the group page **/
Router.route('/groups', {name:'groups'});
Router.route('/groupSubmit', {name:'groupSubmit'});
Router.route('/groups/:_id', {
  name: 'groupPage',
  data: function() { return Groups.findOne(this.params._id); }
});


/** The route to the create page
Router.route('/create', function () {
this.render('create');
});*/

/** The route to the meeting page */
Router.route('/meeting/:_meetingId',
function(){
  this.render('Meeting', {
    data: function() {

      var meeting = Meetings.findOne({_id: this.params._meetingId, status: "ongoing"});
      if(meeting === undefined){
        console.log('undefined meeting...');
        this.render('notFound');
      }
      else
      {

        //Alimentation du tableau users avec les utilisateur présent au meeting
        var users = [];
        MeetingUsers.find({meeting: this.params._meetingId}).forEach(function(user) {
          var paroles = [];
          if(user.paroles !== undefined) {
            paroles = user.paroles;
          }
          users.push({name: user.name, paroles: paroles});
        });

        //Alimentation du tableau speeches avec les demandes de parole du meeting
        var speeches = [];
        Speeches.find({meeting: this.params._meetingId, status: {$in: ["ongoing", "pending"]}}, {sort: {rank: 1}}).forEach(function(speech) {
          var minutesLeft = Math.floor(speech.timeLeft / 60);
          var secondsLeft = speech.timeLeft % 60;
          var minutes = Math.floor(speech.time / 60);
          var seconds = speech.time % 60;

          if(secondsLeft < 10) {
            secondsLeft = "0" + secondsLeft;
          }
          if(seconds < 10) {
            seconds = "0" + seconds;
          }
          speeches.push({
            user: MeetingUsers.findOne({_id: speech.user}).name,
            timeLeft: minutesLeft + ":" + secondsLeft,
            timeString: speech.timeString,
            time: minutes + ":" + seconds,
            //orderChoose: speech.orderChoose,
            subject: speech.subject,
            status: speech.status == "ongoing",
            _id: speech._id,
            rank : speech.rank
          });
        });

        // Alimentation de la variable user avec l'utilisateur actuel
        var user = MeetingUsers.findOne({_id: Session.get("userId")});
        var isAnimator = false;
        if(user !== undefined){
          if(user.type == "animator") isAnimator = true;
        }

        var talk = "Talk";

        //Variable definissant le statut du bouton permettant de lancer le décompte d'un speech ou de l'arrêter
        var proceed = "Wait";
        if(Speeches.findOne({meeting: this.params._meetingId, status: "ongoing"}) == undefined) {
          proceed = "Proceed";
        }

        //Variable de statut des bouton 'proceed/wait' et 'next'
        var disabled = "";
        if(Speeches.findOne({meeting: this.params._meetingId, status: {$in: ["ongoing", "pending"]}}) == undefined) {
          disabled = "disabled";
        }

        Speeches.find({user: Session.get("userId")}).observe({
          removed: function(speech) {
            if (!isAnimator) {
              $("#speech-delete-modal").modal("show");
            }
          }
        });

        return {
          meeting:    meeting.name,
          users:      users,
          speeches:   speeches,
          isAnimator: isAnimator,
          talk:       talk,
          proceed:    proceed,
          disabled:   disabled
        };
      }
    }
  });
},
{
  name: 'meeting'
});

/** The route to the join page */
Router.route('/join/:_meetingId/:_userId', {
  name: 'join',
  data: function() {

    // Recherche du meeting dont l'id est passé en paramètre
    // Redirection vers une page d'erreur "404 not found" lorsqu'aucun meeting n'est trouvé
    var meeting = Meetings.findOne({_id: this.params._meetingId});
    if(meeting === undefined){
      console.log('meeting undefined');
      Router.configure({layoutTemplate: 'layout', notFoundTemplate: '404'});
    }

    //Recherche de l'utilisateur
    //Redirection vers une page d'erreur "404 not found" lorsqu'aucun utilisateur n'est trouvé
    //Ne permet qu'aux utilisateurs invités de rejoindre un meeting
    var user = MeetingUsers.findOne({_id: this.params._userId});
    if(user === undefined){
      console.log('user undefined');
      Router.configure({layoutTemplate: 'layout', notFoundTemplate: '404'});
    }

    Session.set("meetingId", this.params._meetingId);
    Session.set("userId", this.params._userId);

    return {};
  }
});

/** The route to the lineup page */
Router.route('/meeting/:_meetingId/lineup', function () {
  this.render('lineup');
});

/** The route to the end page */
Router.route('/end', function () {
  this.render('end');
});
