var APIKeyBase = "?access_token=";
var APIURL = "https://api.guildwars2.com/v2/";

document.addEventListener('DOMContentLoaded', function() {
    LoadCookie();
}, false);

async function ShowStats()
{
  let APIKey = document.getElementById("APIKey").value;
  SaveCookie( APIKey );
  APIKey = APIKeyBase + APIKey;
  
  let totaldata = await GetData("achievements");
  
  let accountinfo = await GetData("account" + APIKey); 
  
  let accountdata = await GetData("account/achievements" + APIKey);
  
  // playtime and start date
  let date = new Date(accountinfo.created);
  let startdate = date.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
  
  let playtime = accountinfo.age;
  playtime = playtime / 60; // seconds to minutes
  playtime = playtime / 60; // minutes to hours
  playtime = Math.floor(playtime); // truncate
  
  document.getElementById("data1").innerHTML = document.getElementById("data1").innerHTML.replace("$VALUE1$", startdate);
  document.getElementById("data1").innerHTML = document.getElementById("data1").innerHTML.replace("$VALUE2$", playtime);
  document.getElementById("data1").style.display = "block";
  
  // total achievements and total earned
  let total = totaldata.length;
  
  let earned = GetCountOfAchievedAchievements( accountdata );
  
  document.getElementById("data2").innerHTML = document.getElementById("data2").innerHTML.replace("$VALUE1$", total);
  document.getElementById("data2").innerHTML = document.getElementById("data2").innerHTML.replace("$VALUE2$", earned);
  document.getElementById("data2").style.display = "block";
  
  // total achievements graph
  let undone = total - earned;
  
  undone = undone / total;
  earned = earned / total;
  
  SetupEarnedAchievementGraph( undone, earned );
  
  // nonrepeats and dailies
  let nonrepeat = GetNonRepeatAchievements( accountdata );
  let dailies = GetTotalDailyAchievements( accountinfo );
  
  document.getElementById("data3").innerHTML = document.getElementById("data3").innerHTML.replace("$VALUE1$", nonrepeat);
  document.getElementById("data3").innerHTML = document.getElementById("data3").innerHTML.replace("$VALUE2$", dailies);
  document.getElementById("data3").style.display = "block";
}

function SaveCookie( APIKey )
{
  var today = new Date();
  var expiry = new Date(today.getTime() + 30 * 24 * 3600 * 1000); // plus 30 days
  
  document.cookie = "APIKey=" + escape(APIKey) + "; path=/; expires=" + expiry.toGMTString();
}

function LoadCookie()
{
  if ( document.cookie.length > 0 )
  {
    var cookiedata = document.cookie.split(';');
    // we want section 0, and then to take everything after the equals sign
    var keysplit = cookiedata[0].split("=");
    var APIKey = keysplit[1];
    document.getElementById("APIKey").value = APIKey;
  }
}

function GetTotalDailyAchievements( data )
{
  let total = data.daily_ap;
  
  let modified = total / 10;
  
  return Math.floor(modified);
}

function SetupEarnedAchievementGraph( unearned, earned )
{
  var chart = Highcharts.chart('chart1', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'Percentage Completed',
        align: 'center'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
        }
    },
    series: [{
        name: 'Achievements',
        colorByPoint: true,
        data: [{
            name: 'Not Done',
            y: unearned,
        }, {
            name: 'Done',
            y: earned
        }]
    }]
  });
}

async function GetData( url )
{
  const response = await fetch(APIURL + url);
  
  // Verify that we have some sort of 2xx response that we can use
  if (!response.ok) {
      console.log("Error trying to load achievement data");
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