var APIKey = "195F7C54-FC5E-6F48-BE42-68D9169CE12747022F1E-A68E-463D-9F3C-D746C29BC711";
var APIURL = "https://api.guildwars2.com/v2/";

document.addEventListener('DOMContentLoaded', function() {
    ShowStats();
}, false);

async function ShowStats()
{
  let totaldata = await GetData("achievements");
  
  let total = totaldata.length;
  
  let accountdata = await GetData("account/achievements?access_token=" + APIKey);
  
  let earned = GetCountOfAchievedAchievements( accountdata );
  
  let nonrepeat = GetNonRepeatAchievements( accountdata );
  
  document.getElementById("data1").innerHTML = document.getElementById("data1").innerHTML.replace("$VALUE1$", total);
  document.getElementById("data1").innerHTML = document.getElementById("data1").innerHTML.replace("$VALUE2$", earned);
  
  document.getElementById("data2").innerHTML = document.getElementById("data2").innerHTML.replace("$VALUE1$", nonrepeat);
}

async function GetData( url )
{
  const response = await fetch(APIURL + url);
  
  // Verify that we have some sort of 2xx response that we can use
  if (!response.ok) {
      console.log("Error trying to load the list of users: ");
      throw response;
  }
  // If no content, immediately resolve, don't try to parse JSON
  if (response.status === 204) {
      return [];
  }
  
  const data = await response.json();
  
  return data;
}

function GetCountOfAchievedAchievements( data )
{
  let total = 0;
  
  for (let i = 0; i < data.length; i++)
  {
    if ( data[i].done == true )
    {
      total++;
    }
  }
  
  return total;
}

function GetNonRepeatAchievements( data )
{
  let total = 0;
  
  for (let i = 0; i < data.length; i++)
  {
    if ( data[i].done == true )
    {
      if ( !data[i].hasOwnProperty("repeated") )
      {
        total++;
      }
    }
  }
  
  return total;
}