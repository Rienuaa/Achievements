var APIKeyBase = "?access_token=";
var APIURL = "https://api.guildwars2.com/v2/";

document.addEventListener('DOMContentLoaded', function() {
    // ShowStats();
}, false);

async function ShowStats()
{
  let APIKey = document.getElementById("APIKey").value;
  APIKey = APIKeyBase + APIKey;
  
  let totaldata = await GetData("achievements");
  
  let total = totaldata.length;
  
  let accountdata = await GetData("account/achievements" + APIKey);
  
  let earned = GetCountOfAchievedAchievements( accountdata );
  
  let nonrepeat = GetNonRepeatAchievements( accountdata );
  
  document.getElementById("data1").innerHTML = document.getElementById("data1").innerHTML.replace("$VALUE1$", total);
  document.getElementById("data1").innerHTML = document.getElementById("data1").innerHTML.replace("$VALUE2$", earned);
  document.getElementById("data1").style.display = "block";
  
  let undone = total - earned;
  
  undone = undone / total;
  earned = earned / total;
  
  SetupEarnedAchievementGraph( undone, earned );
  
  document.getElementById("data2").innerHTML = document.getElementById("data2").innerHTML.replace("$VALUE1$", nonrepeat);
  document.getElementById("data2").style.display = "block";
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