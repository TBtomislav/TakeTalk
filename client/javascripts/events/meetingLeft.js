/* 
Template.meetingReport.onRendered(function () {
 $(document).ready(function(){
    $('#textareaRich').summernote({
      height: 300,
    });
  });
});



Template.meetingReport.events({
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
  },
  'click #goppt' : function(e){
    console.log("GoPPT");
    Template.meeting.isTrue = false;
    console.log(Template.meeting.isTrue);

  },
});

Template.pptcont.events({
  'click #gomt' : function(e){
    console.log("GoMT");
    console.log(Template.meeting.isTrue.value());

    Template.meeting.isTrue = true;
  },
});



Template.meetingReport.isTrue = true;
*/
