Template.i18n_buttons.events({
  'click .tap-i18n-buttons button' : function(e){
    //console.log($(e.currentTarget.innerHTML));

    console.log(this.tag);
    accountsUIBootstrap3.setLanguage(this.tag);

  }

});

Template._loginButtonsLoggedOutPasswordService.events({
  'click #login-buttons-password' : function(e){

  //  console.log("petit test "+ Meteor.user().emails[0].address);


  }
});


Template._loginButtonsLoggedInDropdownActions.events({
  'click #login-buttons-logout' : function(e){
    //console.log($(e.currentTarget.innerHTML));


  }
});
/*
Template._loginButtonsLoggedOutPasswordDropDown.events({
  'click #login-dropdown-list' : function(e){
    //console.log($(e.currentTarget.innerHTML));

    console.log("petit test 2");


  }
});
*/
