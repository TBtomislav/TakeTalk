/** The configuration for the main layout */
Router.configure({
  layoutTemplate: 'layout',
  waitOn: function(){
    return [
      Meteor.subscribe('groups'),
      Meteor.subscribe('meetings')
    ]}/*
    return Meteor.subscribe('groups'); },
  waitOn: function(){return Meteor.subscribe('meetings'); }
  */
});

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

//TOM
/** The route to the group page **/
Router.route('/groups', {name:'groups'});
Router.route('/groupSubmit', {name:'groupSubmit'});
Router.route('/groups/:_id', {
  name: 'groupPage',
  data: function() {
    return Groups.findOne(this.params._id); }
});

//TOM FIN


/** The route to the create page
Router.route('/create', function () {
  this.render('create');
});*/

/** The route to the meeting page */
Router.route('/meeting/:_meetingId', {
  name: 'meeting',
  data: function() {
      // Ajout d'un meeting pour les tests accessible via /meeting/test
      // !!! A commenter en prod !!!


  // Recherche du meeting dont l'id est passé en paramètre
  // Redirection vers une page d'erreur "404 not found" lorsqu'aucun meeting n'est trouvé
    var meeting = Meetings.findOne({_id: this.params._meetingId, status: "ongoing"});

  //  console.log(meeting);
    if(meeting === undefined){
      //  console.log('undefined meeting...');
        Router.configure({layoutTemplate: 'layout', notFoundTemplate: '404'});
    }
    else
      return  Meetings.findOne({_id: this.params._meetingId, status: "ongoing"});

  }
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
