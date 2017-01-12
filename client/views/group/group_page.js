Template.groupPage.helpers({
  ownGroup:function(){
    return this.userId === Meteor.userId();
  },
  partGroup:function(){
    var res=0;
    if(this.userId === Meteor.userId()){
      res=1;
    }
    else{
      for(i=0;i<this.members.length;i++){
        if(this.members[i]===Meteor.user().emails[0].address){
          res=1;
          i=this.members.length;
        }
      }
    }
    return res;
  }
});

Template.groupPage.events({

  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Delete this group?")) {
      var currentGroupId = this._id;
      Groups.remove(currentGroupId);
      Router.go('groups');

    }
  },
  'click .quit': function(e) {
    e.preventDefault();

    if (confirm("Do you want to leave this group?")) {
      var currentGroupId = this._id;
      var member=Meteor.user().emails[0].address;
      Groups.update(currentGroupId,{$pull : {members : member}} );
      Router.go('groups');

    }
  },
  'click #min-input': function (e) {


    e.preventDefault();

    if (confirm("Do you want to kik " +this +" ?")) {
      var parentId=Template.parentData(1)._id;
      var target=""+this;
    //  console.log("taille parent : "+Template.parentData(1).members.length);


      console.log(target);
      Groups.update({_id:parentId},{$pull : {members : target}} );
    //alert("member removed!");
    }

  },
  'click #add-member': function(e) {
    e.preventDefault();
    //Récupération des éléments DOM des champs de saisie
    var currentGroupId = this._id;

    var AddedMember = document.querySelector('[name=AddedMember]');

    Groups.update(currentGroupId,{$push : {members : AddedMember.value}} );

    AddedMember.value="";
  },
  'click #open': function(e){
      Router.go('create', this);
  }
});
