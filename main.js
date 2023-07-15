var APIKeyBase = "?access_token=";
var APIURL = "https://api.guildwars2.com/v2/";

document.addEventListener('DOMContentLoaded', function() {
    LoadCookie();
    
    LoadMainAchievementData();
}, false);

async function ShowStats()
{
  let APIKey = document.getElementById("APIKey").value;
  SaveCookie( APIKey );
  APIKey = APIKeyBase + APIKey;
  
  let accountInfo = await GetData("account" + APIKey); 
  
  let accountAchievements = await GetData("account/achievements" + APIKey);
  
  // playtime and start date
  let date = new Date(accountInfo.created);
  let startdate = date.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
  
  let playtime = accountInfo.age;
  playtime = playtime / 60; // seconds to minutes
  playtime = playtime / 60; // minutes to hours
  playtime = Math.floor(playtime); // truncate
  
  document.getElementById("data1").innerHTML = document.getElementById("data1").innerHTML.replace("$VALUE1$", startdate);
  document.getElementById("data1").innerHTML = document.getElementById("data1").innerHTML.replace("$VALUE2$", playtime);
  document.getElementById("data1").style.display = "block";
  
  // total achievements and total earned
  let total = achievementIDs.length;
  
  let earned = GetCountOfAchievedAchievements( accountAchievements );
  
  document.getElementById("data2").innerHTML = document.getElementById("data2").innerHTML.replace("$VALUE1$", total);
  document.getElementById("data2").innerHTML = document.getElementById("data2").innerHTML.replace("$VALUE2$", earned);
  document.getElementById("data2").style.display = "block";
  
  // nonrepeats and dailies
  let inprogress = GetInProgressAchievements( accountAchievements );
  let dailies = GetTotalDailyAchievements( accountInfo );
  
  document.getElementById("data3").innerHTML = document.getElementById("data3").innerHTML.replace("$VALUE1$", inprogress);
  document.getElementById("data3").innerHTML = document.getElementById("data3").innerHTML.replace("$VALUE2$", dailies);
  document.getElementById("data3").style.display = "block";
  
  // total achievements graph setup
  let undone = total - earned - inprogress;
  
  undone = undone / total;
  earned = earned / total;
  inprogress = inprogress / total;
  
  SetupEarnedAchievementGraph( undone, earned, inprogress );
  
  // fractals!
  let fractalPercentages = FindFractalAchievements(achievementData, accountAchievements);
  
  document.getElementById("fractaldata1").innerHTML = document.getElementById("fractaldata1").innerHTML.replace("$VALUE1$", fractalPercentages[0]);
  document.getElementById("fractaldata1").style.display = "block";
  document.getElementById("fractal1").value = fractalPercentages[0];
  
  document.getElementById("fractaldata2").innerHTML = document.getElementById("fractaldata2").innerHTML.replace("$VALUE1$", fractalPercentages[1]);
  document.getElementById("fractaldata2").style.display = "block";
  document.getElementById("fractal2").value = fractalPercentages[1];
  
  document.getElementById("fractaldata3").innerHTML = document.getElementById("fractaldata3").innerHTML.replace("$VALUE1$", fractalPercentages[2]);
  document.getElementById("fractaldata3").style.display = "block";
  document.getElementById("fractal3").value = fractalPercentages[2];
  
  document.getElementById("fractaldata4").innerHTML = document.getElementById("fractaldata4").innerHTML.replace("$VALUE1$", fractalPercentages[3]);
  document.getElementById("fractaldata4").style.display = "block";
  document.getElementById("fractal4").value = fractalPercentages[3];
  
  let columns = document.getElementsByClassName("fractalcolumn");
  for (let i = 0; i < columns.length; i++)
  {
    columns[i].style.display = "block";
  }
}

async function LoadMainAchievementData()
{
  // this is called when the page loads
  achievementIDs = await GetData("achievements");
  
  achievementData = await GetAchievementData(achievementIDs);
  
  // we are done, hide the progress bar and label and show the API entry field
  document.getElementById("APIText").style.display = "none";
  document.getElementById("APIProgress").style.display = "none";
  document.getElementById("APIInput").style.display = "block";
}

async function GetAchievementData( IDs )
{
  // this does several combined ID calls to create a merged json file that's really long
  let achievements = await GetData("achievements?page=0&page_size=200");
  let iteration = Math.floor(IDs.length/200) + 1;
  
  document.getElementById("APIProgress").max = iteration;
  
  for (let i = 1; i < iteration; i++)
  {
    data = await GetData("achievements?page=" + i + "&page_size=200");
    achievements = achievements.concat(data);
    document.getElementById("APIProgress").value = i;
  }
  
  return achievements;
}

function FindFractalAchievements( data, accountdata )
{
  const ids = [];
  
  for (let i = 0; i < data.length; i++)
  {
    if ( data[i].name == "Fractal Initiate" )
    {
      // bad practice! pushing directly to the array index!! :P
      ids[0] = data[i].id;
    }
    if ( data[i].name == "Fractal Adept" )
    {
      ids[1] = data[i].id;
    }
    if ( data[i].name == "Fractal Expert" )
    {
      ids[2] = data[i].id;
    }
    if ( data[i].name == "Fractal Master" )
    {
      ids[3] = data[i].id;
    }
  }
  
  let returns = [0,0,0,0];
  
  for (let i = 0; i < accountdata.length; i++)
  {
    if ( accountdata[i].id == ids[0])
    {
      // fractal 1-25
      if ( accountdata[i].done == true )
      {
        returns[0] = 100;
      }
      else
      {
        let bits = accountdata[i].bits;
        returns[0] = Math.floor(100 * bits.length / accountdata[i].max);
      }
    }
    else if ( accountdata[i].id == ids[1])
    {
      // fractal 26-50
      if ( accountdata[i].done == true )
      {
        returns[1] = 100;
      }
      else
      {
        let bits = accountdata[i].bits;
        returns[1] = Math.floor(100 * bits.length / accountdata[i].max);
      }
    }
    else if ( accountdata[i].id == ids[2])
    {
      // fractal 51-75
      if ( accountdata[i].done == true )
      {
        returns[2] = 100;
      }
      else
      {
        let bits = accountdata[i].bits;
        returns[2] = Math.floor(100 * bits.length / accountdata[i].max);
      }
    }
    else if ( accountdata[i].id == ids[3])
    {
      // fractal 76-100
      if ( accountdata[i].done == true )
      {
        returns[3] = 100;
      }
      else
      {
        let bits = accountdata[i].bits;
        returns[3] = Math.floor(100 * bits.length / accountdata[i].max);
      }
    }
  }

  return returns;
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

function SetupEarnedAchievementGraph( unearned, earned, inprogress )
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
        }, 
        {
            name: 'In Progress',
            y: inprogress
        }, 
        {
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

function GetInProgressAchievements( data )
{
  let total = 0;
  
  for (let i = 0; i < data.length; i++)
  {
    if ( data[i].hasOwnProperty("bits") )
    {
      if ( data[i].bits.length > 0 )
      {
        if ( !data[i].hasOwnProperty("repeated") )
        {
          total++;
        }
      }
    }
  }
  
  return total;
}