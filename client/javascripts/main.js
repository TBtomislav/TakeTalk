Meteor.subscribe('groups');
//accountsUIBootstrap3.setLanguage('fr');

getUserLanguage = function () {
  // Put here the logic for determining the user language

  accountsUIBootstrap3.setLanguage('fr');
  return "fr";
};



  TAPi18n._afterUILanguageChange(getUserLanguage(
    function () {
    }
  ));

if (Meteor.isClient) {
  Meteor.startup(function () {
    Session.set("showLoadingIndicator", true);
/*
    TAPi18n.setLanguage(language).done(function () {
        console.log("language changed");
      }).fail(function (err) {
        console.log(err);
      });
*/


    TAPi18n.setLanguage(getUserLanguage())
      .done(function () {
        Session.set("showLoadingIndicator", false);
      })
      .fail(function (error_message) {
        // Handle the situation
        console.log(error_message);
      });

  });
}
