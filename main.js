var APIKeyBase = "?access_token=";
var APIURL = "https://api.guildwars2.com/v2/";

document.addEventListener('DOMContentLoaded', function() {
    LoadCookie();
    
    LoadData();
}, false);

async function LoadData()
{
  let data = await LoadMainAchievementData();

  data = await LoadMainDyeData();
  
  // we are done, show the API entry field
  document.getElementById("APIInput").style.display = "block";
}

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
  let total = totalAchievementIDs.length;
  
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
  let fractalPercentages = FindAchievements( accountAchievements, fractalIDs, false );
  
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
  
  let fractallevel = accountInfo.fractal_level;
  let totalfractals = ( fractalPercentages[0] + fractalPercentages[1] + fractalPercentages[2] + fractalPercentages[3] ) / 4;
  
  document.getElementById("fractals1").innerHTML = document.getElementById("fractals1").innerHTML.replace("$VALUE1$", fractallevel);
  document.getElementById("fractals1").innerHTML = document.getElementById("fractals1").innerHTML.replace("$VALUE2$", totalfractals);
  document.getElementById("fractals1").style.display = "block";
  
  // story journal!
  
  // season 1
  let storyPercentages = FindAchievements( accountAchievements, storyMasteryIDs, true );
  
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
  
  // interlude
  SetStoryBlock( storyPercentages[44], "EOD_6");
  SetStoryBlock( storyPercentages[45], "EOD_7"); 
  
  // secrets of the obscure
  SetStoryBlock( storyPercentages[46], "SOTO_1");
  SetStoryBlock( storyPercentages[47], "SOTO_2");
  SetStoryBlock( storyPercentages[48], "SOTO_3");
  SetStoryBlock( storyPercentages[49], "SOTO_4");
  SetStoryBlock( storyPercentages[50], "SOTO_5");
  SetStoryBlock( storyPercentages[51], "SOTO_6");
  
  // janthir Wilds
  SetStoryBlock( storyPercentages[52], "JW_1");
  SetStoryBlock( storyPercentages[53], "JW_2");
  SetStoryBlock( storyPercentages[54], "JW_3");
  
  document.getElementById("storyinfo").style.display = "block";
  
  let earnedPoints = storyEarnedBits.reduce(Add);
  let maxPoints = storyMaxBits.reduce(Add);
  
  SetupStoryMasteryGraph( earnedPoints, maxPoints );
  
  document.getElementById("story1").innerHTML = document.getElementById("story1").innerHTML.replace("$VALUE1$", maxPoints);
  document.getElementById("story1").innerHTML = document.getElementById("story1").innerHTML.replace("$VALUE2$", earnedPoints);
  document.getElementById("story1").style.display = "block";
  
  
  // dyes!
  
  let accountDyes = await GetData("account/dyes" + APIKey);
  
  let dyeCounts = SortDyes( dyeData, accountDyes );
  
  let totalDyes = colorIDs.length;
  
  let earnedDyes = accountDyes.length;
  
  document.getElementById("cosmetics1").innerHTML = document.getElementById("cosmetics1").innerHTML.replace("$VALUE1$", totalDyes);
  document.getElementById("cosmetics1").innerHTML = document.getElementById("cosmetics1").innerHTML.replace("$VALUE2$", earnedDyes);
  document.getElementById("cosmetics1").style.display = "block";
  
  SetupDyePercentageGraph( totalDyes, dyeCounts );
  
  // cosmetic wardrobe
  
  
  
  // masteries!
  
  let accountMasteries = await GetData("account/mastery/points" + APIKey);
  
  let earnedMasteryTotal = GetEarnedMasteryPoints( accountMasteries );
  let earnedMasteryMax = 783;
  let spentMasteryTotal = GetSpentMasteryPoints( accountMasteries );
  let spentMasteryMax = 605;
  
  document.getElementById("masteries1").innerHTML = document.getElementById("masteries1").innerHTML.replace("$VALUE1$", earnedMasteryTotal.reduce(Add) );
  document.getElementById("masteries1").innerHTML = document.getElementById("masteries1").innerHTML.replace("$VALUE2$", earnedMasteryMax );
  document.getElementById("masteries1").style.display = "block";
  
  document.getElementById("masteries2").innerHTML = document.getElementById("masteries2").innerHTML.replace("$VALUE1$", spentMasteryTotal.reduce(Add) );
  document.getElementById("masteries2").innerHTML = document.getElementById("masteries2").innerHTML.replace("$VALUE2$", spentMasteryMax );
  document.getElementById("masteries2").style.display = "block";
  
  SetupMasteryPercentageGraph( spentMasteryTotal, spentMasteryMax );
  
  // legendaries
  
  let accountLegendaries = await GetData("account/legendaryarmory" + APIKey);
  
  let legendaryCount = GetEarnedLegendariesCount(accountLegendaries);
  let earnedLegendaries = GetEarnedLegendaries(accountLegendaries);
    
  document.getElementById("legendaries1").innerHTML = document.getElementById("legendaries1").innerHTML.replace("$VALUE1$", legendaryCount );
  document.getElementById("legendaries1").style.display = "block";

  // WVW

  let wvwRank = accountInfo.wvw_rank;
  let wvwData = GetAchievementProgress( accountAchievements, wvwIDs[0] );

  document.getElementById("wvw1").innerHTML = document.getElementById("wvw1").innerHTML.replace("$VALUE1$", wvwRank);
  document.getElementById("wvw1").innerHTML = document.getElementById("wvw1").innerHTML.replace("$VALUE2$", wvwData);
  document.getElementById("wvw1").style.display = "block";
}

async function GetEarnedLegendaries( data )
{
	// returns a list of item namespaces
	let names = [];
	
	for ( let i = 0; i < data.length; i++)
	{
		let id = data[i].id;
		let item = await GetData("items/" + id);
		let name = item.name;
		names[i] = name;
	}
	
	if (names.length > 0)
	{
		let ul = document.getElementById("legendaryList");

		for (let i = 0; i < names.length; i++)
		{
			let li = document.createElement("li");
			li.innerHTML = names[i];
			ul.appendChild(li);
		}
	}
}

function GetEarnedLegendariesCount( data )
{
	// this returns a count of legendaries
	return data.length;
}

function GetEarnedMasteryPoints( data )
{
  // this returns a list of earned points by region
  let points = [ 0, 0, 0, 0, 0, 0, 0 ];
  
  let totals = data.totals;
  
  for ( let i = 0; i < totals.length; i++ )
  {
    if ( totals[i].region == "Central Tyria" )
    {
      points[0] = totals[i].earned;
    }
    else if ( totals[i].region == "Heart of Thorns" )
    {
      points[1] = totals[i].earned;
    }
    else if ( totals[i].region == "Path of Fire" )
    {
      points[2] = totals[i].earned;
    }
    else if ( totals[i].region == "Icebrood Saga" )
    {
      points[3] = totals[i].earned;
    }
    else if ( totals[i].region == "End of Dragons" )
    {
      points[4] = totals[i].earned;
    }
    else if ( totals[i].region == "Secrets of the Obscure" )
    {
      points[5] = totals[i].earned;
    }
    else if ( totals[i].region == "Janthir Wilds" )
    {
      points[6] = totals[i].earned;
    }
  }
  
  return points;
}

function GetSpentMasteryPoints( data )
{
  // this returns a list of spent points by region
  let points = [ 0, 0, 0, 0, 0, 0, 0 ];
  
  let totals = data.totals;
  
  for ( let i = 0; i < totals.length; i++ )
  {
    if ( totals[i].region == "Central Tyria" )
    {
      points[0] = totals[i].spent;
    }
    else if ( totals[i].region == "Heart of Thorns" )
    {
      points[1] = totals[i].spent;
    }
    else if ( totals[i].region == "Path of Fire" )
    {
      points[2] = totals[i].spent;
    }
    else if ( totals[i].region == "Icebrood Saga" )
    {
      points[3] = totals[i].spent;
    }
    else if ( totals[i].region == "End of Dragons" )
    {
      points[4] = totals[i].spent;
    }
    else if ( totals[i].region == "Secrets of the Obscure" )
    {
      points[5] = totals[i].spent;
    }
    else if ( totals[i].region == "Janthir Wilds" )
    {
      points[6] = totals[i].spent;
    }
  }
  
  return points;
}

function SortDyes( data, accountData )
{
  let dyes = [ 0, 0, 0, 0, 0 ];
  
  for (let i = 0; i < data.length; i++)
  {
    for ( let j = 0; j < data[i].categories.length; j++ )
    {
      if ( data[i].categories[j] == "Starter" )
      {
        if ( accountData.includes( data[i].id ) )
        {
          dyes[0]++;
        }
      }
      else if ( data[i].categories[j] == "Common" )
      {
        if ( accountData.includes( data[i].id ) )
        {
          dyes[1]++;
        }
      }
      else if ( data[i].categories[j] == "Uncommon" )
      {
        if ( accountData.includes( data[i].id ) )
        {
          dyes[2]++;
        }
      }
      else if ( data[i].categories[j] == "Rare" )
      {
        if ( accountData.includes( data[i].id ) )
        {
          dyes[3]++;
        }
      }
      else if ( data[i].categories[j] == "Exclusive" )
      {
        if ( accountData.includes( data[i].id ) )
        {
          dyes[4]++;
        }
      }
    }
  }
  
  return dyes;
} 

function Add( num1, num2 )
{
  return num1 + num2;
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
  document.getElementById("APIProgress1").style.display = "block";
  document.getElementById("APIText1").style.display = "block";
  
  totalAchievementIDs = await GetData("achievements");
  
  achievementIDs = fractalIDs + storyMasteryIDs + wvwIDs;
  
  achievementData = await GetAchievementData(achievementIDs);
  
  document.getElementById("APIProgress1").style.display = "none";
  document.getElementById("APIText1").style.display = "none";
}

async function LoadMainDyeData()
{
  // this is called when the page loads
  document.getElementById("APIProgress2").style.display = "block";
  document.getElementById("APIText2").style.display = "block";
  
  colorIDs = await GetData("colors");
  
  dyeData = await GetDyeData(colorIDs);
  
  document.getElementById("APIProgress2").style.display = "none";
  document.getElementById("APIText2").style.display = "none";
}

async function GetAchievementData( IDs )
{
  // this does several combined ID calls to create a merged json file that's really long
  let iteration = IDs.length;
  document.getElementById("APIProgress1").max = iteration;
  
  let workingIDs = [];
  
  let achievementSections = [];
  
  for (let i = 0; i < iteration; i++)
  {
    workingIDs.push(IDs[i]);
    
    if ( workingIDs.length >= 200 || i == iteration - 1 )
    {
      let id_csv = workingIDs.toString();
      data = await GetData("achievements?ids=" + id_csv);
      achievementSections.push(data);
      
      workingIDs = [];
    }
    
    document.getElementById("APIProgress1").value = i;
  }
  
  let achievements = achievementSections[0];
  
  for (let i = 1; i < achievementSections.length; i++)
  {
    achievements = achievements.concat(achievementSections[i]);
  }
  
  return achievements;
}

async function GetDyeData( IDs )
{
  // this does several combined ID calls to create a merged json file that's really long
  let iteration = IDs.length;
  document.getElementById("APIProgress2").max = iteration;
  
  let workingIDs = [];
  
  let dyeSections = [];
  
  for (let i = 0; i < iteration; i++)
  {
    workingIDs.push(IDs[i]);
    
    if ( workingIDs.length >= 200 )
    {
      let id_csv = workingIDs.toString();
      data = await GetData("colors?ids=" + id_csv);
      dyeSections.push(data);
      
      workingIDs = [];
    }
    
    document.getElementById("APIProgress1").value = i;
  }
  
  let dyes = dyeSections[0];
  
  for (let i = 1; i < dyeSections.length; i++)
  {
    dyes = dyes.concat(dyeSections[i]);
  }
  
  return dyes;
}

function FindAchievements( accountdata, ids, IsStory )
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
          if ( IsStory )
          {
            storyEarnedBits[j] = storyMaxBits[j];
          }
        }
        else
        {
          let bits = accountdata[i].bits;
          returns[j] = Math.floor(100 * bits.length / accountdata[i].max);
          if ( IsStory )
          {
            storyEarnedBits[j] = bits.length;
          }
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

function GetAchievementProgress(accountdata, id)
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
          return accountdata[i].current;
        }
      }
    }
  
    return 0;
}

var wvwIDs = [7912];
var fractalIDs = [ 2965, 2894, 2217, 2415 ];
var storyMasteryIDs = [ 6539, 6564, 6682, 6754, 6784, 1796, 1795, 1784, 1790, 1785, 1816, 1827, 2054, 2314, 2509, 2364, 2397, 3050, 3123, 3171, 3348, 3442, 3516, 3900, 3913, 3902, 3988, 4093, 4195, 4359, 4544, 4689, 4940, 5012, 5107, 5203, 5291, 5401, 5706, 6090, 6504, 6401, 6202, 6133, 6873, 6901, 7104, 7203, 7014, 7666, 7831, 8019, 8208, 8217, 8455 ];
var storyMaxBits = [ 12, 15, 13, 15, 18, 9, 9, 6, 9, 7, 6, 6, 8, 18, 14, 13, 8, 18, 23, 21, 28, 20, 36, 15, 18, 19, 30, 35, 38, 38, 30, 18, 54, 20, 37, 27, 17, 32, 24, 16, 13, 14, 13, 12, 18, 20, 8, 8, 6, 6, 12, 16, 24, 20, 15 ];
var storyEarnedBits = [];

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
        data: [
          {
            name: 'Done',
            color: '#03bafc',
            y: earned
          },
          {
            name: 'In Progress',
            color: '#1f80e0',
            y: inprogress
          }, 
          {
            name: 'Not Done',
            color: '#1f4ce0',
            y: unearned,
          } 
        ]
    }]
  });
}

function SetupStoryMasteryGraph( earned, max )
{
  let earnedPercent = earned / max;
  let unearnedPercent = (max - earned) / max;
  
  var chart = Highcharts.chart('chart2', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'Story Mastery Percentage Completed',
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
        name: 'Story Journal Achievements',
        colorByPoint: true,
        data: [{
            name: 'Done',
            color: '#03bafc',
            y: earnedPercent
        }, 
        {
            name: 'Not Done',
            color: '#1f4ce0',
            y: unearnedPercent
        }]
    }]
  });
}

function SetupMasteryPercentageGraph( pointTotals, maximum )
{
  let main = pointTotals[0] / maximum;
  let HOT = pointTotals[1] / maximum;
  let POF = pointTotals[2] / maximum;
  let IBS = pointTotals[3] / maximum;
  let EOD = pointTotals[4] / maximum;
  let SOTO = pointTotals[5] / maximum;
  let JW = pointTotals[6] / maximum;
  let missingPercentage = ( maximum - pointTotals.reduce(Add) ) / maximum;
  
  var chart = Highcharts.chart('chart4', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'Mastery Level Earned',
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
        name: 'Mastery Level',
        colorByPoint: true,
        data: [{
            name: 'Central Tyria',
            color: '#c92424',
            y: main
        }, 
        {
            name: 'Heart of Thorns',
            color: '#3aba53',
            y: HOT
        }, 
        {
            name: 'Path of Fire',
            color: '#7e44c9',
            y: POF
        }, 
        {
            name: 'Icebrood Saga',
            color: '#51cfe8',
            y: IBS
        }, 
        {
            name: 'End of Dragons',
            color: '#40aae3',
            y: EOD
        }, 
        {
            name: 'Secrets of the Obscure',
            color: '#ffc338',
            y: SOTO
        }, 
        {
            name: 'Janthir Wilds',
            color: '#0d0db8',
            y: JW
        }, 
        {
            name: 'Unearned',
            color: '#c4c2c2',
            y: missingPercentage
        }]
    }]
  });
}

function SetupDyePercentageGraph( totalDyes, dyeCounts )
{
  let starterPercentage = dyeCounts[0] / totalDyes;
  let commonPercentage = dyeCounts[1] / totalDyes;
  let uncommonPercentage = dyeCounts[2] / totalDyes;
  let rarePercentage = dyeCounts[3] / totalDyes;
  let exclusivePercentage = dyeCounts[4] / totalDyes;
  let missingPercentage = ( totalDyes - dyeCounts.reduce(Add) ) / totalDyes;
  
  var chart = Highcharts.chart('chart3', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'Dye Colors Percentage Completed',
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
        name: 'Dyes Acquired',
        colorByPoint: true,
        data: [{
            name: 'Starter',
            color: '#f71f07',
            y: starterPercentage
        }, 
        {
            name: 'Common',
            color: '#047dd4',
            y: commonPercentage
        }, 
        {
            name: 'Uncommon',
            color: '#04b521',
            y: uncommonPercentage
        }, 
        {
            name: 'Rare',
            color: '#faf21b',
            y: rarePercentage
        }, 
        {
            name: 'Exclusive',
            color: '#a200ff',
            y: exclusivePercentage
        }, 
        {
            name: 'Unearned',
            color: '#c4c2c2',
            y: missingPercentage
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