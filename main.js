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
  
  SetupAchievementIDs( achievementData );
  
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
  let fractalPercentages = FindAchievements( accountAchievements, fractalIDs );
  
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
  
  // story journal!
  
  // season 1
  let storyPercentages = FindAchievements( accountAchievements, storyMasteryIDs );
  
  SetStoryBlock( storyPercentages[0], "LW1_1");
  SetStoryBlock( storyPercentages[1], "LW1_2");
  SetStoryBlock( storyPercentages[2], "LW1_3");
  SetStoryBlock( storyPercentages[3], "LW1_4");
  SetStoryBlock( storyPercentages[4], "LW1_5"); 
  
  // season 2
  SetStoryBlock( storyPercentages[5], "LW2_1");
  SetStoryBlock( storyPercentages[6], "LW2_2");
  SetStoryBlock( storyPercentages[7], "LW2_3");
  SetStoryBlock( storyPercentages[8], "LW2_4");
  SetStoryBlock( storyPercentages[9], "LW2_5"); 
  SetStoryBlock( storyPercentages[10], "LW2_6"); 
  SetStoryBlock( storyPercentages[11], "LW2_7"); 
  SetStoryBlock( storyPercentages[12], "LW2_8"); 
  
  // heart of thorns
  SetStoryBlock( storyPercentages[13], "HOT_1");
  SetStoryBlock( storyPercentages[14], "HOT_2");
  SetStoryBlock( storyPercentages[15], "HOT_3");
  SetStoryBlock( storyPercentages[16], "HOT_4");
  
  // season 3
  SetStoryBlock( storyPercentages[17], "LW3_1");
  SetStoryBlock( storyPercentages[18], "LW3_2");
  SetStoryBlock( storyPercentages[19], "LW3_3");
  SetStoryBlock( storyPercentages[20], "LW3_4");
  SetStoryBlock( storyPercentages[21], "LW3_5"); 
  SetStoryBlock( storyPercentages[22], "LW3_6"); 
  
  // path of fire
  SetStoryBlock( storyPercentages[23], "POF_1");
  SetStoryBlock( storyPercentages[24], "POF_2");
  SetStoryBlock( storyPercentages[25], "POF_3");
  
  // season 4
  SetStoryBlock( storyPercentages[26], "LW4_1");
  SetStoryBlock( storyPercentages[27], "LW4_2");
  SetStoryBlock( storyPercentages[28], "LW4_3");
  SetStoryBlock( storyPercentages[29], "LW4_4");
  SetStoryBlock( storyPercentages[30], "LW4_5"); 
  SetStoryBlock( storyPercentages[31], "LW4_6"); 
  
  // season 5
  SetStoryBlock( storyPercentages[32], "LW5_1");
  SetStoryBlock( storyPercentages[33], "LW5_2");
  SetStoryBlock( storyPercentages[34], "LW5_3");
  SetStoryBlock( storyPercentages[35], "LW5_4");
  SetStoryBlock( storyPercentages[36], "LW5_5"); 
  SetStoryBlock( storyPercentages[37], "LW5_6"); 
  SetStoryBlock( storyPercentages[38], "LW5_7"); 
  
  // end of dragons
  SetStoryBlock( storyPercentages[39], "EOD_1");
  SetStoryBlock( storyPercentages[40], "EOD_2");
  SetStoryBlock( storyPercentages[41], "EOD_3");
  SetStoryBlock( storyPercentages[42], "EOD_4");
  SetStoryBlock( storyPercentages[43], "EOD_5"); 
}

function SetStoryBlock( value, textval )
{
  document.getElementById("Text_" + textval ).innerHTML = document.getElementById("Text_" + textval).innerHTML.replace("$VALUE1$", value);
  document.getElementById("Progress_" + textval).value = value;
  if ( value == 100 )
  {
    document.getElementById("Image_" + textval).src = "assets/cb-checked-active.png";
  }
  document.getElementById("Div_" + textval).style.display = "block";
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

function FindAchievements( accountdata, ids )
{
  let returns = new Array(ids.length).fill(0);
  
  for (let i = 0; i < accountdata.length; i++)
  {
    for (let j = 0; j < ids.length; j++)
    {
      if ( accountdata[i].id == ids[j])
      {
        if ( accountdata[i].done == true )
        {
          returns[j] = 100;
        }
        else
        {
          let bits = accountdata[i].bits;
          returns[j] = Math.floor(100 * bits.length / accountdata[i].max);
        }
      }
    }
  }
  
  return returns;
}

function FindAchievement( accountdata, id )
{ 
  for (let i = 0; i < accountdata.length; i++)
  {
    if ( accountdata[i].id == id)
    {
      if ( accountdata[i].done == true )
      {
        return 100;
      }
      else
      {
        let bits = accountdata[i].bits;
        return Math.floor(100 * bits.length / accountdata[i].max);
      }
    }
  }

  return 0;
}

function SetupAchievementIDs( data )
{
  fractalIDs = [];
  storyMasteryIDs = [];
  
  for (let i = 0; i < data.length; i++)
  {
    if ( data[i].name == "Fractal Initiate" )
    {
      fractalIDs[0] = data[i].id;
    }
    else if ( data[i].name == "Fractal Adept" )
    {
      fractalIDs[1] = data[i].id;
    }
    else if ( data[i].name == "Fractal Expert" )
    {
      fractalIDs[2] = data[i].id;
    }
    else if ( data[i].name == "Fractal Master" )
    {
      fractalIDs[3] = data[i].id;
    }
    // Living World Season 1
    else if ( data[i].name == "Flame and Frost Mastery" )
    {
      storyMasteryIDs[0] = data[i].id;
    }
    else if ( data[i].name == "Sky Pirates Mastery" )
    {
      storyMasteryIDs[1] = data[i].id;
    }
    else if ( data[i].name == "Clockwork Chaos Mastery" )
    {
      storyMasteryIDs[2] = data[i].id;
    }
    else if ( data[i].name == "Tower of Nightmares Mastery" )
    {
      storyMasteryIDs[3] = data[i].id;
    }
    else if ( data[i].name == "Battle for Lion's Arch Mastery" )
    {
      storyMasteryIDs[4] = data[i].id;
    }
    // Living World Season 2
    else if ( data[i].name == "\"Gates of Maguuma\" Mastery" )
    {
      storyMasteryIDs[5] = data[i].id;
    }
    else if ( data[i].name == "\"Entanglement\" Mastery" )
    {
      storyMasteryIDs[6] = data[i].id;
    }
    else if ( data[i].name == "\"The Dragon's Reach, Part 1\" Mastery" )
    {
      storyMasteryIDs[7] = data[i].id;
    }
    else if ( data[i].name == "\"The Dragon's Reach, Part 2\" Mastery" )
    {
      storyMasteryIDs[8] = data[i].id;
    }
    else if ( data[i].name == "\"Echoes of the Past\" Mastery" )
    {
      storyMasteryIDs[9] = data[i].id;
    }
    else if ( data[i].name == "\"Tangled Paths\" Mastery" )
    {
      storyMasteryIDs[10] = data[i].id;
    }
    else if ( data[i].name == "\"Seeds of Truth\" Mastery" )
    {
      storyMasteryIDs[11] = data[i].id;
    }
    else if ( data[i].name == "\"Point of No Return\" Mastery" )
    {
      storyMasteryIDs[12] = data[i].id;
    }
    // Heart of Thorns
    else if ( data[i].name == "Heart of Thorns Act I Mastery" )
    {
      storyMasteryIDs[13] = data[i].id;
    }
    else if ( data[i].name == "Heart of Thorns Act II Mastery" )
    {
      storyMasteryIDs[14] = data[i].id;
    }
    else if ( data[i].name == "Heart of Thorns Act III Mastery" )
    {
      storyMasteryIDs[15] = data[i].id;
    }
    else if ( data[i].name == "Heart of Thorns Act IV Mastery" )
    {
      storyMasteryIDs[16] = data[i].id;
    }
    // Living World Season 3
    else if ( data[i].name == "\"Out of the Shadows\" Mastery" )
    {
      storyMasteryIDs[17] = data[i].id;
    }
    else if ( data[i].name == "\"Rising Flames\" Mastery" )
    {
      storyMasteryIDs[18] = data[i].id;
    }
    else if ( data[i].name == "\"A Crack in the Ice\" Mastery" )
    {
      storyMasteryIDs[19] = data[i].id;
    }
    else if ( data[i].name == "\"The Head of the Snake\" Mastery" )
    {
      storyMasteryIDs[20] = data[i].id;
    }
    else if ( data[i].name == "\"Flashpoint\" Mastery" )
    {
      storyMasteryIDs[21] = data[i].id;
    }
    else if ( data[i].name == "\"One Path Ends\" Mastery" )
    {
      storyMasteryIDs[22] = data[i].id;
    }
    // Path of Fire
    else if ( data[i].name == "Path of Fire: Act 1 Mastery" )
    {
      storyMasteryIDs[23] = data[i].id;
    }
    else if ( data[i].name == "Path of Fire: Act 2 Mastery" )
    {
      storyMasteryIDs[24] = data[i].id;
    }
    else if ( data[i].name == "Path of Fire: Act 3 Mastery" )
    {
      storyMasteryIDs[25] = data[i].id;
    }
    // Living World Season 4
    else if ( data[i].name == "\"Daybreak\" Mastery" )
    {
      storyMasteryIDs[26] = data[i].id;
    }
    else if ( data[i].name == "\"A Bug in the System\" Mastery" )
    {
      storyMasteryIDs[27] = data[i].id;
    }
    else if ( data[i].name == "\"Long Live the Lich\" Mastery" )
    {
      storyMasteryIDs[28] = data[i].id;
    }
    else if ( data[i].name == "\"A Star to Guide Us\" Mastery" )
    {
      storyMasteryIDs[29] = data[i].id;
    }
    else if ( data[i].name == "\"All or Nothing\" Mastery" )
    {
      storyMasteryIDs[30] = data[i].id;
    }
    else if ( data[i].name == "\"War Eternal\" Mastery" )
    {
      storyMasteryIDs[31] = data[i].id;
    }
    // Icebrood Saga
    else if ( data[i].name == "\"Bound by Blood\" Mastery" )
    {
      storyMasteryIDs[32] = data[i].id;
    }
    else if ( data[i].name == "Whisper in the Dark Mastery" )
    {
      storyMasteryIDs[33] = data[i].id;
    }
    else if ( data[i].name == "\"Shadow in the Ice\" Mastery" )
    {
      storyMasteryIDs[34] = data[i].id;
    }
    else if ( data[i].name == "Steel and Fire Mastery" )
    {
      storyMasteryIDs[35] = data[i].id;
    }
    else if ( data[i].name == "\"No Quarter\" Mastery" )
    {
      storyMasteryIDs[36] = data[i].id;
    }
    else if ( data[i].name == "\"Jormag Rising\" Mastery" )
    {
      storyMasteryIDs[37] = data[i].id;
    }
    else if ( data[i].name == "\"Champions\" Mastery" )
    {
      storyMasteryIDs[38] = data[i].id;
    }
    // End of Dragons
    else if ( data[i].name == "End of Dragons: Act 1 Mastery" )
    {
      storyMasteryIDs[39] = data[i].id;
    }
    else if ( data[i].name == "End of Dragons: Act 2 Mastery" )
    {
      storyMasteryIDs[40] = data[i].id;
    }
    else if ( data[i].name == "End of Dragons: Act 3 Mastery" )
    {
      storyMasteryIDs[41] = data[i].id;
    }
    else if ( data[i].name == "End of Dragons: Act 4 Mastery" )
    {
      storyMasteryIDs[42] = data[i].id;
    }
    else if ( data[i].name == "End of Dragons: Act 5 Mastery" )
    {
      storyMasteryIDs[43] = data[i].id;
    }
  }
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