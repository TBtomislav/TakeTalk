Template.groupItem.helpers({
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
