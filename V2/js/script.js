$(function(){
  /*
  Function run if the send button is clicked.Checks for a value in the textbox, if found, saves value and wipes textbox.
  Saves value of whole chat, only adds break if not first value, and saves time value for timestamp.
  Creates a new piece of html to be added and adds it below the existing html
  Scrolls to bottom of page. Last step is to send new message to bot to check for a progammed response.
  */
$("#send").click(function(){
  if($("#textbox").val() !== ""){
  var newMessage = $("#textbox").val();
  $("#textbox").val("");
  var chatHistory = $("#chat").html();
  if(chatHistory.length > 3){
    chatHistory = chatHistory + "<br>";
  }
  var time = get_time();

  var display = "<span class = 'you'><span class = 'speech-bubble-you' >" + newMessage + "</span><br><span class = 'time'>"+ time +"</span></span><br>";
  $("#chat").html(chatHistory + display);
  $("#chat").scrollTop($("#chat").prop("scrollHeight"));

  check_response(newMessage);

}

});
//When on the textbox, and enter key is pressed it is as if send was pressed. Also prevents enter from having original effect
$("#textbox").keypress(function(event){
  if( event.which ==13){
    $("#send").click();
    event.preventDefault();
  }
});

});


/*
check_response checks the user inputed message for any terms/anwsers/phases that
the bot may have a response too. The bot can then call functions,
cycle through a for loop or change variables that will effect the next response, but it will always
produce a response and call the respond function. Function was ordered in a fashion that makes the
responses make the most sense... not perfect
*/

//Variables used for the bot to respond correctly
var nameAsk = 0;
var name = "";
var knockKnock = 0;
var match = "";
var woken = 0;

function check_response(message){
  //it will fall asleep if talking for too long, say "wake up!" to wake him up.
  if($("#chat").html().length > 14000){
    if (woken === 0){
      if(message.toLowerCase() === "wake up!"){
        woken = 1;
        return respond("Huh. What do you want?");
      }
        return respond("ZzzzzzzzZzzzzzzzz");
    }
  }
  //it might warn you it's gonna fall asleep first
  if($("#chat").html().length > 12000){
    if(woken === 0 && Math.floor(Math.random()*5)===1){
        return respond("We've been talking for too long, i need to rest.");
  }
  }

  //Section for telling a knock knock joke.
  if(knockKnock === 2){
    knockKnock = 3;
    return respond("Oh man i love knock knock jokes! But one is enough for me")
  }

  if (knockKnock === 1){
    knockKnock = 2;
    return respond(message + " who?")
  }

  if(message.toLowerCase() === "knock knock"){
    if (knockKnock === 3){
      return respond("*No one is home*")
    }
    knockKnock = 1;
    return respond("Who's there?");
  }



  //responds if message is over 110 characters
  if (message.length > 110){
    var num = Math.floor(Math.random()*tooMuchSentences.length);
     return respond(tooMuchSentences[num]);
  }
  //responds if message is less than 2 characters
  if (message.length < 2){
    return respond("What am I supposed to do with one letter? Seriously " +name);
  }



  //Section for asking for a name, allowing for multiple asks with a varity of responses.
  //Also saves and has ability to change the users "name".
  if (message.toLowerCase().indexOf("name")>=0){
    nameAsk = 1;
    return respond("My name is Chatbot 2000, what is yours?");
  }

  if (nameAsk === 1){
    nameAsk = 0;
    if(name !== "" && name.toLowerCase() !== message.toLowerCase()){
      respond("Is it now? I thought it was " + name + " but I'll call you "+ message + " if you want.");
      name = message;
      return
    }
    if(name.toLowerCase() === message.toLowerCase()){
      return respond ("Yeah i knew that already "+name);
    }
    name = message;
    nameAsk = 2;
    return respond("Nice to meet you "+message+".");
  }

  if (nameAsk ===2){
    nameAsk = 0;
    return respond("Aw thanks, got any questions for me " + name + "?")
  }

  //response if the user types there own name.
  if(message.toLowerCase() === name.toLowerCase()){
    return respond("Yes "+name+", that is your name.");
  }



  //Used if the user asks for age or how old the bot is
  if (new RegExp(howOldAreYouTriggers.join("|")).test(message.toLowerCase())){
    response = get_age();
    return respond("I am "+response+" seconds old, not that it's any of your business.");
  }

  //Used if user asks for the time, runs check time function below.
  if (message.toLowerCase().indexOf("time")>=0){
    time = get_time();
    response = check_time(time);
    return respond(response);
  }


  //This for loop cycles though all of the Triggers below to search for a match,
  //if found it randomly selects one of the appropiate responses and sends it
  for (var i = 0; i<simpleTriggers.length; i++){
    if (new RegExp(simpleTriggers[i].join("|")).test(message.toLowerCase())){
      var num = Math.floor(Math.random()*simpleSentences[i].length);
       return respond(simpleSentences[i][num]);
     }
  };

  //Used if used asks a question but none of the questions above
  if (message.indexOf("?")>=0){
    var num = Math.floor(Math.random()*questionSentences.length);
    return respond(questionSentences[num]);
  }

  if (message.indexOf("!")>=0){
    var num = Math.floor(Math.random()*excitedSentences.length);
    return respond(excitedSentences[num]);
  }

  //Bot responds with this if none of the other conditions are matched
  var num = Math.floor(Math.random()*randomSentences.length);
  return respond(randomSentences[num]);

};



//respond used for the bot to respond which takes the parameter of message(the message to be "sent")
function respond(message){
  var chatSoFar = $("#chat").html();

  var time = get_time();

  $("#chat").html(chatSoFar +"<br><span class='current_message bot'><span class ='speech-bubble-bot'>"+ message+"</span><br><span class = 'time'>"+ time +"</span></span><br>");
  $(".current_message").hide();
  $(".current_message").fadeIn();
  $(".current_message").removeClass("current_message");
  $("#chat").scrollTop($("#chat").prop("scrollHeight"));
};

//get_time used to get the time of day and zero pads the responds
function get_time(){
  var date = new Date();
  var h = date.getHours();
  var m = date.getMinutes();
  if(h<10){
    h = "0"+h;
  }
  if(m<10){
    m = "0"+m;
  }
  return h+":"+m;
};

//check_time used to check if the time has changed from the last time you asked for the time, responds accordingly
var lastTime = "";
function check_time(time){
  if(time === lastTime){
    return "You just asked this! it's still "+time+".";
  }
  else{
    lastTime = time;
    return "It is "+time+".";
  }
};

//get_age used for the bot to tell you how old it is. Gets time in seconds from date of creation.
function get_age(){
  var seconds = Math.floor((new Date() - new Date('2019-11-13')) / 1000);
  return seconds;
};


/*
The section of arrays below are filled with strings are Triggers and Sentences. Triggers are words that are checked for before returning a random response,
if a trigger is hit than the bot will randomly choose a coresponding sentence and reply with that. Allows for simple addition of triggers and sentences.
*/

//trigger is the message being over 110 characters
var tooMuchSentences = ["Whoa, that's way too much writing. Write less so i can understand better!", "Now that just makes no sense.", "Why would you say that?"];

//Trigger is a question mark
var questionSentences = ["Was that a question?", "I didn't understand that. Ask me differently.", "Maybe try asking someone else.","Yes!","No way.","hmm, no thanks.", "Yes please.", "Ask me later."];

//Trigger is nothing else being triggered
var randomSentences = ["Hmm, okay then.",  "Huh?", "Cool, tell me more!", "I'm not sure.", "Well I've never heard that before.", "This isn't going very well is it?", "That's weird.", "I don't think so.","Ok that's enough."];

var howOldAreYouTriggers = ["how old are you", "age"];
//Response uses function to get date from creation

var whatsUpTriggers = ["whats up", "what's up", "how's it hanging", "what are you up to"];
var whatsUpSentences = ["Not much, how about you?", "I'm just hanging out.", "Just relaxing."];

var greatingTriggers = ["hello","hey","hi"];
var greatingSentences = ["Hey there!", "Hello!", "Heyo!", "Bonjour!","Howdy!"];

var howAreYouTriggers = ["how are you","how are things", "how is it going"];
var howAreYouSentences = ["Great, thanks for asking!", "Not so great.", "Super!"];

var laughTriggers = ["joke","haha","funny"];
var laughSentences = ["Hahahaha, good one!","That's not funny.", "What's so funny?"];

var talkAboutTriggers = ["talk","bored","know", "fact"];
var talkAboutSentences= ["The coldest natural temperature ever recorded on earth was -89.2 degrees celcius.","Did you know a baby puffin is called a 'puffling'.", "The unicorn is the national animal of Scotland."];

var helpTriggers = ["help","lost","confused"];
var helpSentences = ["Honestly, there's not much I can do to help.", "I don't know how to help."]

var insultTriggers = ["What can you do", "suck","useless","no sense","any sense","bad","broken","don't work", "stink","loser"]
var insultSentences = ["Well i'd like to see you try and do better","That's just mean","Why would you say that, so rude", "That's mean "+name];

var excitedTriggers = ["wow","cool","exciting", "excellent"];
var excitedSentences = ["Yeah! Very Cool", "So exciting!","That's great"];

var favouriteTriggers = ["favourite","favorite"];
var favouriteSentences = ["That's a tough one, im not sure. Too many to choose from."]

//A collection of all existing simple Triggers and Sentences pairs, allows them to be run in a for loop
var simpleTriggers = [whatsUpTriggers, greatingTriggers, howAreYouTriggers, laughTriggers, talkAboutTriggers, helpTriggers, insultTriggers, excitedTriggers, favouriteTriggers];
var simpleSentences = [whatsUpSentences, greatingSentences, howAreYouSentences, laughSentences, talkAboutSentences, helpSentences, insultSentences, excitedSentences, favouriteSentences];
