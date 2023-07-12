var APIKey = "195F7C54-FC5E-6F48-BE42-68D9169CE12747022F1E-A68E-463D-9F3C-D746C29BC711";
var APIURL = "https://api.guildwars2.com/v2/";

document.addEventListener('DOMContentLoaded', function() {
    ShowStats();
}, false);

async function ShowStats()
{
  let data = await GetAccountAchievementData();
  
  let total = data.length;
  
  document.getElementById("total").innerHTML = document.getElementById("total").innerHTML.replace("$VALUE1$", total);
}

async function GetAccountAchievementData()
{
  const response = await fetch(APIURL + "achievements");
  
  const data = await response.json();
  
  return data;
}