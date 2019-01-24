/*
    Nurse Burnout Project
    Heracleia Lab 2018-2019
    Author: James Brady
*/

import * as messaging from "messaging";
import document from "document";

var continuousUpload = false;

//function that sends data to the phone companion app
export function sendData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      // Send a command to the companion
      messaging.peerSocket.send(JSON.stringify(data));
    
      //automatically say that there is an error, this will be changed if a response is recieved from the server
      postConnectionError(true, "S");
  }
  else
  {
      //post an error if the watch is not connected to the phone companion
      postConnectionError(true, "W");
  }
}

//alerts the user that there was an error uploading to server
function postConnectionError(isError, errCode = "")
{
    if(isError)
    {
       document.getElementById("mood-sleep-main").text = errCode + "ERR";
    }
    else
    {
       document.getElementById("mood-sleep-main").text = "Good";
    }
}

// get function for the variable isContinuous
export function isContinuous()
{
    return continuousUpload;
}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
    console.log("peer messaging open");
}

// Listen for messages from the companion
messaging.peerSocket.onmessage = function(evt) {
  
    // based on the key of the message, execute the proper reaction
    // the user selected continuous upload in the settings component
    if(evt.data.key == "continuousUpload" && evt.data.value)
    {
        continuousUpload = (evt.data.value == "true");
    }
    // a response was recieved from the server, hide the error message
    else if(evt.data.key == "response" && evt.data.value)
    {
        postConnectionError(false);
    }
    // an error occurred, show the error message
    else if(evt.data.key == "error" && evt.data.value)
    {
        postConnectionError(true, evt.data.value);
    }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
    // Handle any errors
    console.log("Connection error: " + err.code + " - " + err.message);
  
    postConnectionError(true, "W");
}