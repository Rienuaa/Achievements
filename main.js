var APIKey = "195F7C54-FC5E-6F48-BE42-68D9169CE12747022F1E-A68E-463D-9F3C-D746C29BC711";

document.addEventListener('DOMContentLoaded', function() {
    ShowStats();
}, false);

function ShowStats()
{
  let total = GetTotalAchievedAchievements();
  
  document.getElementById("total").innerHTML = document.getElementById("total").innerHTML.replace("$VALUE1$", total);
}

function GetTotalAchievedAchievements()
{
  return 10;
}