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
  let earnedMasteryMax = 775;
  let spentMasteryTotal = GetSpentMasteryPoints( accountMasteries );
  let spentMasteryMax = 600;
  
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
  
  achievementIDs = await GetData("achievements");
  
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

var fractalIDs = [];
var storyMasteryIDs = [];
var storyMaxBits = [];
var storyEarnedBits = [];

function SetupAchievementIDs( data )
{
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
      storyMaxBits[0] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "Sky Pirates Mastery" )
    {
      storyMasteryIDs[1] = data[i].id;
      storyMaxBits[1] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "Clockwork Chaos Mastery" )
    {
      storyMasteryIDs[2] = data[i].id;
      storyMaxBits[2] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "Tower of Nightmares Mastery" )
    {
      storyMasteryIDs[3] = data[i].id;
      storyMaxBits[3] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "Battle for Lion's Arch Mastery" )
    {
      storyMasteryIDs[4] = data[i].id;
      storyMaxBits[4] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    // Living World Season 2
    else if ( data[i].name == "\"Gates of Maguuma\" Mastery" )
    {
      storyMasteryIDs[5] = data[i].id;
      storyMaxBits[5] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "\"Entanglement\" Mastery" )
    {
      storyMasteryIDs[6] = data[i].id;
      storyMaxBits[6] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "\"The Dragon's Reach, Part 1\" Mastery" )
    {
      storyMasteryIDs[7] = data[i].id;
      storyMaxBits[7] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "\"The Dragon's Reach, Part 2\" Mastery" )
    {
      storyMasteryIDs[8] = data[i].id;
      storyMaxBits[8] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "\"Echoes of the Past\" Mastery" )
    {
      storyMasteryIDs[9] = data[i].id;
      storyMaxBits[9] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "\"Tangled Paths\" Mastery" )
    {
      storyMasteryIDs[10] = data[i].id;
      storyMaxBits[10] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "\"Seeds of Truth\" Mastery" )
    {
      storyMasteryIDs[11] = data[i].id;
      storyMaxBits[11] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "\"Point of No Return\" Mastery" )
    {
      storyMasteryIDs[12] = data[i].id;
      storyMaxBits[12] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    // Heart of Thorns
    else if ( data[i].name == "Heart of Thorns Act I Mastery" )
    {
      storyMasteryIDs[13] = data[i].id;
      storyMaxBits[13] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "Heart of Thorns Act II Mastery" )
    {
      storyMasteryIDs[14] = data[i].id;
      storyMaxBits[14] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "Heart of Thorns Act III Mastery" )
    {
      storyMasteryIDs[15] = data[i].id;
      storyMaxBits[15] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "Heart of Thorns Act IV Mastery" )
    {
      storyMasteryIDs[16] = data[i].id;
      storyMaxBits[16] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    // Living World Season 3
    else if ( data[i].name == "\"Out of the Shadows\" Mastery" )
    {
      storyMasteryIDs[17] = data[i].id;
      storyMaxBits[17] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "\"Rising Flames\" Mastery" )
    {
      storyMasteryIDs[18] = data[i].id;
      storyMaxBits[18] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "\"A Crack in the Ice\" Mastery" )
    {
      storyMasteryIDs[19] = data[i].id;
      storyMaxBits[19] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "\"The Head of the Snake\" Mastery" )
    {
      storyMasteryIDs[20] = data[i].id;
      storyMaxBits[20] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "\"Flashpoint\" Mastery" )
    {
      storyMasteryIDs[21] = data[i].id;
      storyMaxBits[21] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "\"One Path Ends\" Mastery" )
    {
      storyMasteryIDs[22] = data[i].id;
      storyMaxBits[22] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    // Path of Fire
    else if ( data[i].name == "Path of Fire: Act 1 Mastery" )
    {
      storyMasteryIDs[23] = data[i].id;
      storyMaxBits[23] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "Path of Fire: Act 2 Mastery" )
    {
      storyMasteryIDs[24] = data[i].id;
      storyMaxBits[24] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "Path of Fire: Act 3 Mastery" )
    {
      storyMasteryIDs[25] = data[i].id;
      storyMaxBits[25] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    // Living World Season 4
    else if ( data[i].name == "\"Daybreak\" Mastery" )
    {
      storyMasteryIDs[26] = data[i].id;
      storyMaxBits[26] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "\"A Bug in the System\" Mastery" )
    {
      storyMasteryIDs[27] = data[i].id;
      storyMaxBits[27] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "\"Long Live the Lich\" Mastery" )
    {
      storyMasteryIDs[28] = data[i].id;
      storyMaxBits[28] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "\"A Star to Guide Us\" Mastery" )
    {
      storyMasteryIDs[29] = data[i].id;
      storyMaxBits[29] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "\"All or Nothing\" Mastery" )
    {
      storyMasteryIDs[30] = data[i].id;
      storyMaxBits[30] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "\"War Eternal\" Mastery" )
    {
      storyMasteryIDs[31] = data[i].id;
      storyMaxBits[31] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    // Icebrood Saga
    else if ( data[i].name == "\"Bound by Blood\" Mastery" )
    {
      storyMasteryIDs[32] = data[i].id;
      storyMaxBits[32] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "Whisper in the Dark Mastery" )
    {
      storyMasteryIDs[33] = data[i].id;
      storyMaxBits[33] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "\"Shadow in the Ice\" Mastery" )
    {
      storyMasteryIDs[34] = data[i].id;
      storyMaxBits[34] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "Steel and Fire Mastery" )
    {
      storyMasteryIDs[35] = data[i].id;
      storyMaxBits[35] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "\"No Quarter\" Mastery" )
    {
      storyMasteryIDs[36] = data[i].id;
      storyMaxBits[36] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "\"Jormag Rising\" Mastery" )
    {
      storyMasteryIDs[37] = data[i].id;
      storyMaxBits[37] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "\"Champions\" Mastery" )
    {
      storyMasteryIDs[38] = data[i].id;
      storyMaxBits[38] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    // End of Dragons
    else if ( data[i].name == "End of Dragons: Act 1 Mastery" )
    {
      storyMasteryIDs[39] = data[i].id;
      storyMaxBits[39] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "End of Dragons: Act 2 Mastery" )
    {
      storyMasteryIDs[40] = data[i].id;
      storyMaxBits[40] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "End of Dragons: Act 3 Mastery" )
    {
      storyMasteryIDs[41] = data[i].id;
      storyMaxBits[41] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "End of Dragons: Act 4 Mastery" )
    {
      storyMasteryIDs[42] = data[i].id;
      storyMaxBits[42] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "End of Dragons: Act 5 Mastery" )
    {
      storyMasteryIDs[43] = data[i].id;
      storyMaxBits[43] = data[i].tiers[data[i].tiers.length - 1].count;
    }
	else if ( data[i].name == "The Jade Crisis" )
    {
      storyMasteryIDs[44] = data[i].id;
      storyMaxBits[44] = data[i].tiers[data[i].tiers.length - 1].count;
    }
	else if ( data[i].name == "What Lies Within" )
    {
      storyMasteryIDs[45] = data[i].id;
      storyMaxBits[45] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "Secrets of the Obscure: Act 1 Mastery" )
    {
      storyMasteryIDs[46] = data[i].id;
      storyMaxBits[46] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "Secrets of the Obscure: Act 2 Mastery" )
    {
      storyMasteryIDs[47] = data[i].id;
      storyMaxBits[47] = data[i].tiers[data[i].tiers.length - 1].count;
    }
    else if ( data[i].name == "Secrets of the Obscure: Act 3 Mastery" )
    {
      storyMasteryIDs[48] = data[i].id;
      storyMaxBits[48] = data[i].tiers[data[i].tiers.length - 1].count;
    }
	else if ( data[i].name == "Secrets of the Obscure: Through the Veil Mastery" )
    {
      storyMasteryIDs[49] = data[i].id;
      storyMaxBits[49] = data[i].tiers[data[i].tiers.length - 1].count;
    }
	else if ( data[i].name == "Secrets of the Obscure: The Realm of Dreams Mastery" )
    {
      storyMasteryIDs[50] = data[i].id;
      storyMaxBits[50] = data[i].tiers[data[i].tiers.length - 1].count;
    }
	else if ( data[i].name == "Secrets of the Obscure: The Midnight King Mastery" )
    {
      storyMasteryIDs[51] = data[i].id;
      storyMaxBits[51] = data[i].tiers[data[i].tiers.length - 1].count;
    }
	else if ( data[i].name == "Janthir Wilds: Act 1 Mastery" )
    {
      storyMasteryIDs[52] = data[i].id;
      storyMaxBits[52] = data[i].tiers[data[i].tiers.length - 1].count;
    }
	else if ( data[i].name == "Janthir Wilds: Act 2 Mastery" )
    {
      storyMasteryIDs[53] = data[i].id;
      storyMaxBits[53] = data[i].tiers[data[i].tiers.length - 1].count;
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