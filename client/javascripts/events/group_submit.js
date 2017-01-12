Template.groupSubmit.onCreated(function() {
  Session.set('inputs', []); // on page load, set this to have no inputs
});

Template.groupSubmit.helpers({
  inputs: function () {
    return Session.get('inputs'); // reactively watches the Session variable, so when it changes, this result will change and our template will change
  }
});

// Now we'll set up a click handler to add inputs to our array when we   click the "add" button
Template.groupSubmit.events({
  'click #add-input': function () {

    var inputs = Session.get('inputs');
    var uniqid = Math.floor(Math.random() * 100000); // Give a unique ID so you can pull _this_ input when you click remove
    inputs.push({uniqid: uniqid, value: ""});
    Session.set('inputs', inputs);
  },

  'submit form': function(e) {
    e.preventDefault();
    //Récupération des éléments DOM des champs de saisie
    var membersInputs = $(e.target).find('[name=member]');


    //Récupération des valeurs de l'ordre du jour, temps estimés et des emails d'invitation
    var name = [];;
    var members = [];

    console.log(membersInputs.length);

    for (i = 0; i < membersInputs.length; i++) {
      if (membersInputs[i].value != "") {
        members.push(membersInputs[i].value);
      }
    }

  //  name.push(nameInput[0].value);

    var group = {
      name: $(e.target).find('[name=name]').val(),
      members
    }

    Meteor.call('groupInsert', group, function(error, result) {
      // affiche l'erreur à l'utilisateur et s'interrompt
      if (error)
      return alert(error.reason);
      Router.go('groups', {_id: result._id});
    });
  }


});


// We also need handlers for when the inputs themselves are changed / removed
Template.input.events({
  'click #remove-input': function(event) {
    var uniqid = $(event.currentTarget).attr('uniqid');
    inputs = Session.get('inputs');
    inputs = _.filter(inputs, function(x) { return x.uniqid != uniqid; });
    Session.set('inputs', inputs);
  }/*,
  'change input': function(event) {
    var $input = $(event.currentTarget);
    var uniqid = $input.attr('uniqid');
    inputs = Session.get('inputs');
    index = inputs.findIndex(function(x) { return x.uniqid == uniqid; });
    inputs[index].value = $input.val();
    Session.set('inputs', inputs);
  }*/
});
