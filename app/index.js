/*
    Nurse Burnout Project
    Heracleia Lab 2018-2019
    Author: James Brady
*/

import document from "document";
import { HeartRateSensor } from "heart-rate";
import { today } from "user-activity";
import * as Phone from "./communication";

// setup the heart rate sensor
let hrSensor = new HeartRateSensor();
hrSensor.start();

var data;
var activeWindow = document.getElementById("logo-screen");
var windowWaitTime = 1500;
var currentMood = 0;

// dictionary to map UI colors to mood
var moodColorsList = [{mood: 'great', color: '#66d7d1'}, {mood: 'good', color: '#dbd56e'}, {mood: 'ok', color: '#a9b18f'}, {mood: 'neutral', color: '#ffd9ce'}, {mood: 'bad', color: '#fc7753'}, {mood: 'terrible', color: '#db5461'}];

// show the splashscreen after 1.5 seconds
setTimeout(function() { showLogo(); }, 1500);

//go to the homescreen after 2 seconds
setTimeout(function() { goHome(); }, 2000);


//Uncommment for mood confirmation screen
//setTimeout(function() {showMoodConfirmation(2);}, 1500);

// switch the current window to be displayed to the user
function switchScreens(current, next)
{
    setVisible(current, false);
    setVisible(next, true);
}

// show or hide the given window
function setVisible(element, visibility)
{
    if(visibility == true)
      {
        activeWindow = element;
        element.style.visibility = "visible";
      }
     else
     {
        element.style.visibility = "hidden";
     }
}

// show the splashscreen
function showLogo()
{
    switchScreens(activeWindow, document.getElementById("welcome-screen"));
}

// ask the user to confirm the current mood
function showMoodConfirmation(moodProposed)
{
    document.getElementById("mood-image-confirmation").href = moodNameToFilename(moodEnumToName(moodProposed));
    document.getElementById("mood-description-confirmation").text = moodEnumToName(moodProposed);
    switchScreens(activeWindow, document.getElementById("mood-confirmation-screen"));
}

// show that the mood the user selected was registered by the system
function showMoodSelectionConfirmation()
{
    // change the color of the checkmark to reflect the mood of the user
    colorCheckMark();
    // show the mood confirmation window
    switchScreens(activeWindow, document.getElementById("mood-logged-screen"));
}

// show the mood panorama selector window
function showMoodSelection()
{
    // set the panorama to start at the user's last logged mood
    document.getElementById("mood-panorama-page").value = currentMood;
    // show the mood selection window
    setTimeout(function() { switchScreens(activeWindow, document.getElementById("mood-selection-screen")); }, 250);
    // show the mood panorama selector with an increased latency for a smooth transition
    setTimeout(function() { document.getElementById("mood-panorama-page").style.visibility = "visible"; }, 300);
}

// hide the mood panorama selector
function hideMoodSelection()
{
    document.getElementById("mood-panorama-page").style.visibility = "hidden";
}

// show the home screen window
function goHome()
{
    switchScreens(activeWindow, document.getElementById("mood-main-screen"));
}

// display the user's current heart rate
function displayHeartRate(hr)
{
    document.getElementById("mood-hr-main").text = " " + hr + "hr ";
}
// display the user's current steps taken
function displaySteps(steps)
{
    document.getElementById("mood-steps-main").text = " " + formatSteps(steps) + " ";
}
// display the user's amount of sleep
function displaySleep(sleep)
{
    document.getElementById("mood-sleep-main").text = " " + sleep + " HR "; 
}

// change the user's current mood whenever it is selected
function setCurrentMood(newMood)
{
    currentMood = newMood;
    // change the picture representing the user's current mood
    document.getElementById("mood-image-main").href = moodNameToFilename(moodEnumToName(currentMood));
    // send the mood, heart rate, and steps to the server
    sendMoodUpdate(newMood);  
}

// get function for the current mood
function getCurrentMood()
{
    return currentMood;
}

// set the color of the check mark to the color associated with the current mood
function colorCheckMark()
{
    document.getElementById("mood-logged-checkmark").style["fill"] = moodColorsList[currentMood].color;
}

// represent the number of steps in a format that will fit on the screen
function formatSteps(steps)
{
   if(steps == 0)
   {
       return steps + "";
   }
  
   if(steps <= 999)
   {
      return "" + steps;    
   }
  
   if(steps > 999999)
   {
      return (steps + "").slice(0, 1) + "." + (steps + "").slice(1,3) + "M";
   }
  
   if(steps > 99999)
   {
      return (steps + "").slice(0, 3) + "K";    
   }
  
   if(steps > 9999)
   {
       return (steps + "").slice(0, 2) + "." + (steps + "").slice(2,3) + "K";         
   }
  
   return (steps + "").slice(0, 1) + "," + (steps + "").slice(1, 4);
  
}

// convert the mood name to the name of the picture saved
function moodNameToFilename(moodname)
{
    if(moodname != "")
      {
          return "Pictures/" + moodname + "Face.png"; 
      }
    return "";
}

// convert the mood index to the mood name
function moodEnumToName(moodEnum)
{
    switch(moodEnum)
      {
        case 0:
            return "great";
          break;
        case 1:
            return "good";
          break;
        case 2:
            return "ok";
          break;
        case 3:
            return "neutral";
          break;
        case 4:
            return "bad";
          break;
        case 5:
            return "terrible";
          break;
      }
    return "";
}

// convert the mood name to the mood index
function moodNameToEnum(moodName)
{
  switch(moodName)
      {
        case "great":
            return 0;
          break;
        case "good":
            return 1;
          break;
        case "ok":
            return 2;
          break;
        case "neutral":
            return 3;
          break;
        case "bad":
            return 4;
          break;
        case "terrible":
            return 5;
          break;
      }
    return -1; 
}


/* SET THE ONCLICK FUNCTIONS FOR THE FOLLOWING BUTTONS*/
document.getElementById("mood-yes-confirmation").onclick = function(e)
{
    setCurrentMood(moodNameToEnum(document.getElementById("mood-description-confirmation").text));
    showMoodSelectionConfirmation();
    setTimeout(goHome, windowWaitTime);
}
document.getElementById("mood-no-confirmation").onclick = function(e)
{
    //showMoodSelectionConfirmation();
    setTimeout(goHome, windowWaitTime);
}
document.getElementById("mood-edit-main").onclick = function(e)
{
    showMoodSelection();
}
document.getElementById("mood-yes-selection").onclick = function(e)
{
    setCurrentMood(document.getElementById("mood-panorama-page").value);
    hideMoodSelection();
    showMoodSelectionConfirmation();
    setTimeout(goHome, windowWaitTime);
}
document.getElementById("mood-no-selection").onclick = function(e)
{
    hideMoodSelection();
    goHome();
}

// send the heart rate, steps taken, and current mood to the companion
function sendMoodUpdate(updatedMood)
{
     // get the necessary data
     let exportData = {
        info: {
            heartRate: data.rate.heartRate,
            steps: data.steps,
            mood: updatedMood
        },
        moodPrompt: {
            value: 0
        }
    };
  
    // send the data to the companion app
    Phone.sendData(exportData);
}

// EXPERIMENTAL FUNCTION
// ask the server for the user's current mood based on prediction
function sendServerMoodPrompt()
{
    refreshData();
    let exportData = {
        user: {
            name: "testuser1234"
        },
        info: {
            heartRate: data.rate.heartRate,
            steps: data.steps,
            mood: currentMood
        },
        moodPrompt: {
           value: 1
        }
    };
  
    Phone.sendData(exportData);
}

// called once every second to update the heart rate and steps taken
function refreshData() {
  data = {
    rate: {
      heartRate: hrSensor.heartRate ? hrSensor.heartRate : 0,
      timeMeasured: hrSensor.timestamp ? hrSensor.timestamp : 0
    },
    steps: {
      count: (today.adjusted.steps || 0)
    }
  };
   
  // display the heart rate and steps
  displayHeartRate(JSON.stringify(data.rate.heartRate));
  displaySteps(JSON.stringify(data.steps.count));
  
  // upload the data if the user wants continuous data upload
  if(Phone.isContinuous())
  {
      sendMoodUpdate(currentMood);    
  }
}

// monitor the heart rate and step sensors
refreshData();
setInterval(refreshData, 1000);
