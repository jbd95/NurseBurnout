/*
    Nurse Burnout Project
    Heracleia Lab 2018-2019
    Author: James Brady
*/

import * as messaging from "messaging";
import { settingsStorage } from "settings";

var xhr;
var isPrompt = 0;

// uploads the user's id, heart rate, steps, and current mood to the server
function uploadDataToServer(id="", hr="", steps="", mood="") 
{
      console.log("about to upload")
     // create and send a new get request to upload the data to the server
     /*xhr = new XMLHttpRequest();
     xhr.open('GET', 'https://jamesrbrady.com/fitbit/?id=' + id +  "&rate=" + hr + "&steps=" + steps + "&mood=" + mood, true);
     xhr.send();*/
  
    fetch('https://jamesrbrady.com/fitbit/?id=' + id +  "&rate=" + hr + "&steps=" + steps + "&mood=" + mood).then(function(response) {
        sendDataToWatchApp("response", JSON.stringify(response.json())); 
    })
     
     // set processRequest as the callback
     //xhr.onreadystatechange = processRequest;
}

//Function that recieves the response from the server and forwards it to the watch
function processRequest(e) {
      // only send a response to the watch if the get request was successful
      if(xhr.readyState == 4 && xhr.status == 200)
        {
              sendDataToWatchApp("response", xhr.responseText);
        }
}

// send a key and value pair to the watch
function sendDataToWatchApp(identifier, val) {
  
  // only send if there is a valid connection between the watch and phone
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
          // send the data to the watch
          messaging.peerSocket.send(prepDataForWatch(identifier, val));
  } else {
          console.log("Error: Connection is not open");
  }
}

// Listen for messages from the watch
messaging.peerSocket.onmessage = function(evt) {
  
      // parse the incoming JSON data
      var parsed = JSON.parse(evt.data);
 
      // check whether the request is a prompt
      isPrompt = parsed.moodPrompt.value;

      // get the user's fitbitID
      var id = JSON.parse(settingsStorage.getItem("userid"));
      if(id)
      {
          id = id.name;
      }
  
      // post an error if the user did not set a fitbitID
      if(!id)
        {
            postError("Error with ID, make sure it is set within the settings app.");
            sendDataToWatchApp("error", "ID");
            return;
        }
  
      // upload the data to the server 
      uploadDataToServer(id, parsed.info.heartRate, parsed.info.steps.count, parsed.info.mood);
}

// handle given error message
function postError(errorMessage)
{
    console.log(errorMessage);
}

// return dictionary format of the key and value pair
function prepDataForWatch(identifier, val)
{
    var data = {
        key: identifier,
        value: val
    };
  
    return data;
}

//send updates to watch of specified settings that are changed
settingsStorage.onchange = function(evt)
{
    // notify the watch that it should continuously upload data
    if(evt.key == "continuousUpload")
    {
        sendDataToWatchApp(evt.key, evt.newValue);    
    }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}