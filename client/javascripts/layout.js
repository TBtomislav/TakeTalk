Template.i18n_buttons.events({
  'click .tap-i18n-buttons button' : function(e){
    //console.log($(e.currentTarget.innerHTML));

    console.log(this.tag);
    accountsUIBootstrap3.setLanguage(this.tag);

  }

});
