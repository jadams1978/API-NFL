var margin = {top: 20, right: 200, bottom: 100, left: 50},
    margin2 = { top: 430, right: 10, bottom: 20, left: 40 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;

var parseDate = d3.time.format("%Y%m%d").parse;
var bisectDate = d3.bisector(function(d) { return d.date; }).left;

var xScale = d3.time.scale()
    .range([0, width]),

    xScale2 = d3.time.scale()
    .range([0, width]); // Duplicate xScale for brushing ref later

var yScale = d3.scale.linear()
    .range([height, 0]);

// 40 Custom DDV colors
var color = d3.scale.ordinal().range(["#48A36D",  "#56AE7C",  "#64B98C", "#72C39B", "#80CEAA", "#80CCB3", "#7FC9BD", "#7FC7C6", "#7EC4CF", "#7FBBCF", "#7FB1CF", "#80A8CE", "#809ECE", "#8897CE", "#8F90CD", "#9788CD", "#9E81CC", "#AA81C5", "#B681BE", "#C280B7", "#CE80B0", "#D3779F", "#D76D8F", "#DC647E", "#E05A6D", "#E16167", "#E26962", "#E2705C", "#E37756", "#E38457", "#E39158", "#E29D58", "#E2AA59", "#E0B15B", "#DFB95C", "#DDC05E", "#DBC75F", "#E3CF6D", "#EAD67C", "#F2DE8A"]);


var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom"),

    xAxis2 = d3.svg.axis() // xAxis for brush slider
    .scale(xScale2)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.rating); })
    .defined(function(d) { return d.rating; });  // Hiding line value defaults of 0 for missing data

var maxY; // Defined later to update yAxis

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom) //height + margin.top + margin.bottom
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create invisible rect for mouse tracking
svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0)
    .attr("id", "mouse-tracker")
    .style("fill", "white");

//for slider part-----------------------------------------------------------------------------------

var context = svg.append("g") // Brushing context box container
    .attr("transform", "translate(" + 0 + "," + 410 + ")")
    .attr("class", "context");

//append clip path for lines plotted, hiding those part out of bounds
svg.append("defs")
  .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

//end slider part-----------------------------------------------------------------------------------
/*
const nflData =
[
{
"arrest_stats_id": "853",
"Date": "2017-04-06",
"Team": "SEA",
"Team_name": "Seahawks",
"Team_preffered_name": "Seattle Seahawks",
"Team_city": "Seattle",
"Team_logo_id": "28",
"Team_Conference": "NFC",
"Team_Division": "West",
"Team_Conference_Division": "NFC West",
"Name": "Trevone Boykin",
"Position": "QB",
"Position_name": "Quarterback",
"Position_type": "O",
"Encounter": "Arrested",
"Category": "Probation violation",
"Crime_category": "Other",
"Description": "Suspected of violating probation with March 27 arrest. Probation stemmed from 2015 bar fight while at TCU.",
"Outcome": "Resolution undetermined.",
"Season": "2017",
"ArrestSeasonState": "OffSeason",
"general_category_id": "27",
"legal_level_id": "1",
"resolution_category_id": "1",
"Year": "2017",
"Month": "4",
"Day": "6",
"Day_of_Week": "Thursday",
"Day_of_Week_int": "5",
"DaysSince": "109",
"DaysToLastArrest": "0",
"DaysToLastCrimeArrest": "291",
"DaysToLastTeamArrest": "10"
},
{
"arrest_stats_id": "851",
"Date": "2017-03-27",
"Team": "SEA",
"Team_name": "Seahawks",
"Team_preffered_name": "Seattle Seahawks",
"Team_city": "Seattle",
"Team_logo_id": "28",
"Team_Conference": "NFC",
"Team_Division": "West",
"Team_Conference_Division": "NFC West",
"Name": "Trevone Boykin",
"Position": "QB",
"Position_name": "Quarterback",
"Position_type": "O",
"Encounter": "Arrested",
"Category": "Drugs",
"Crime_category": "Drugs",
"Description": "Accused of marijuana possession, public intoxication. He was a passenger in a car involved in accident in Dallas.",
"Outcome": "Resolution undetermined.",
"Season": "2017",
"ArrestSeasonState": "OffSeason",
"general_category_id": "3",
"legal_level_id": "0",
"resolution_category_id": "1",
"Year": "2017",
"Month": "3",
"Day": "27",
"Day_of_Week": "Monday",
"Day_of_Week_int": "2",
"DaysSince": "119",
"DaysToLastArrest": "1",
"DaysToLastCrimeArrest": "20",
"DaysToLastTeamArrest": "100"
},
{
"arrest_stats_id": "836",
"Date": "2016-12-17",
"Team": "SEA",
"Team_name": "Seahawks",
"Team_preffered_name": "Seattle Seahawks",
"Team_city": "Seattle",
"Team_logo_id": "28",
"Team_Conference": "NFC",
"Team_Division": "West",
"Team_Conference_Division": "NFC West",
"Name": "Damontre Moore",
"Position": "DE",
"Position_name": "Defensive End",
"Position_type": "D",
"Encounter": "Arrested",
"Category": "DUI",
"Crime_category": "DUI",
"Description": "Suspected of driving while intoxicated in King County, Washington.",
"Outcome": "Resolution undetermined.",
"Season": "2016",
"ArrestSeasonState": "InSeason",
"general_category_id": "1",
"legal_level_id": "0",
"resolution_category_id": "1",
"Year": "2016",
"Month": "12",
"Day": "17",
"Day_of_Week": "Saturday",
"Day_of_Week_int": "7",
"DaysSince": "219",
"DaysToLastArrest": "5",
"DaysToLastCrimeArrest": "5",
"DaysToLastTeamArrest": "429"
},
{
"arrest_stats_id": "805",
"Date": "2015-10-15",
"Team": "SEA",
"Team_name": "Seahawks",
"Team_preffered_name": "Seattle Seahawks",
"Team_city": "Seattle",
"Team_logo_id": "28",
"Team_Conference": "NFC",
"Team_Division": "West",
"Team_Conference_Division": "NFC West",
"Name": "Derrick Coleman",
"Position": "FB",
"Position_name": "Fullback",
"Position_type": "O",
"Encounter": "Arrested",
"Category": "Hit and Run",
"Crime_category": "Other",
"Description": "Derrick Coleman was involved in a two car accident in Bellevue, WA where he allegedly fled the scene.",
"Outcome": "Undetermined",
"Season": "2015",
"ArrestSeasonState": "InSeason",
"general_category_id": "27",
"legal_level_id": "1",
"resolution_category_id": "1",
"Year": "2015",
"Month": "10",
"Day": "15",
"Day_of_Week": "Thursday",
"Day_of_Week_int": "5",
"DaysSince": "648",
"DaysToLastArrest": "15",
"DaysToLastCrimeArrest": "94",
"DaysToLastTeamArrest": "641"
},
{
"arrest_stats_id": "78",
"Date": "2014-01-12",
"Team": "SEA",
"Team_name": "Seahawks",
"Team_preffered_name": "Seattle Seahawks",
"Team_city": "Seattle",
"Team_logo_id": "28",
"Team_Conference": "NFC",
"Team_Division": "West",
"Team_Conference_Division": "NFC West",
"Name": "Spencer Ware",
"Position": "RB",
"Position_name": "Running Back",
"Position_type": "O",
"Encounter": "Arrested",
"Category": "DUI",
"Crime_category": "DUI",
"Description": "Pulled over by Washington State Patrol, suspected of drunken driving in Seattle.",
"Outcome": "Charge dropped after judge ruled the arresting officer lacked reasonable suspicion in traffic stop.",
"Season": "2014",
"ArrestSeasonState": "OffSeason",
"general_category_id": "1",
"legal_level_id": "1",
"resolution_category_id": "2",
"Year": "2014",
"Month": "1",
"Day": "12",
"Day_of_Week": "Sunday",
"Day_of_Week_int": "1",
"DaysSince": "1289",
"DaysToLastArrest": "3",
"DaysToLastCrimeArrest": "11",
"DaysToLastTeamArrest": "252"
},
{
"arrest_stats_id": "113",
"Date": "2013-05-05",
"Team": "SEA",
"Team_name": "Seahawks",
"Team_preffered_name": "Seattle Seahawks",
"Team_city": "Seattle",
"Team_logo_id": "28",
"Team_Conference": "NFC",
"Team_Division": "West",
"Team_Conference_Division": "NFC West",
"Name": "Josh Portis",
"Position": "QB",
"Position_name": "Quarterback",
"Position_type": "O",
"Encounter": "Arrested",
"Category": "DUI",
"Crime_category": "DUI",
"Description": "Pulled over for speeding by Washington State trooper, accused of drunken driving.",
"Outcome": "Resolution undetermined. Cut by team later that month.",
"Season": "2013",
"ArrestSeasonState": "OffSeason",
"general_category_id": "1",
"legal_level_id": "1",
"resolution_category_id": "1",
"Year": "2013",
"Month": "5",
"Day": "5",
"Day_of_Week": "Sunday",
"Day_of_Week_int": "1",
"DaysSince": "1541",
"DaysToLastArrest": "2",
"DaysToLastCrimeArrest": "2",
"DaysToLastTeamArrest": "96"
},
{
"arrest_stats_id": "137",
"Date": "2013-01-29",
"Team": "SEA",
"Team_name": "Seahawks",
"Team_preffered_name": "Seattle Seahawks",
"Team_city": "Seattle",
"Team_logo_id": "28",
"Team_Conference": "NFC",
"Team_Division": "West",
"Team_Conference_Division": "NFC West",
"Name": "Leroy Hill",
"Position": "LB",
"Position_name": "Linebacker",
"Position_type": "D",
"Encounter": "Arrested",
"Category": "Domestic violence",
"Crime_category": "Domestic Violence",
"Description": "Accused of third-degree assault and unlawful imprisonment in dispute with girlfriend.",
"Outcome": "Charges dropped for lack of evidence. Not re-signed by Seattle.",
"Season": "2013",
"ArrestSeasonState": "OffSeason",
"general_category_id": "2",
"legal_level_id": "1",
"resolution_category_id": "2",
"Year": "2013",
"Month": "1",
"Day": "29",
"Day_of_Week": "Tuesday",
"Day_of_Week_int": "3",
"DaysSince": "1637",
"DaysToLastArrest": "7",
"DaysToLastCrimeArrest": "19",
"DaysToLastTeamArrest": "157"
},
{
"arrest_stats_id": "159",
"Date": "2012-07-14",
"Team": "SEA",
"Team_name": "Seahawks",
"Team_preffered_name": "Seattle Seahawks",
"Team_city": "Seattle",
"Team_logo_id": "28",
"Team_Conference": "NFC",
"Team_Division": "West",
"Team_Conference_Division": "NFC West",
"Name": "Marshawn Lynch",
"Position": "RB",
"Position_name": "Running Back",
"Position_type": "O",
"Encounter": "Arrested",
"Category": "DUI",
"Crime_category": "DUI",
"Description": "Pulled over in Oakland, Calif., and taken to Santa Rita Jail on DUI charge.",
"Outcome": "Resolution undetermined.",
"Season": "2012",
"ArrestSeasonState": "OffSeason",
"general_category_id": "1",
"legal_level_id": "1",
"resolution_category_id": "1",
"Year": "2012",
"Month": "7",
"Day": "14",
"Day_of_Week": "Saturday",
"Day_of_Week_int": "7",
"DaysSince": "1836",
"DaysToLastArrest": "0",
"DaysToLastCrimeArrest": "4",
"DaysToLastTeamArrest": "139"
},
{
"arrest_stats_id": "179",
"Date": "2012-02-26",
"Team": "SEA",
"Team_name": "Seahawks",
"Team_preffered_name": "Seattle Seahawks",
"Team_city": "Seattle",
"Team_logo_id": "28",
"Team_Conference": "NFC",
"Team_Division": "West",
"Team_Conference_Division": "NFC West",
"Name": "Jarriel King",
"Position": "OT",
"Position_name": "Offensive Tackle",
"Position_type": "O",
"Encounter": "Arrested",
"Category": "Sex",
"Crime_category": "Sex",
"Description": "Charged with having forcible sex with woman in South Carolina who said she was intoxicated.",
"Outcome": "Resolution undetermined. Released by team after it learned of the arrest.",
"Season": "2012",
"ArrestSeasonState": "OffSeason",
"general_category_id": "14",
"legal_level_id": "1",
"resolution_category_id": "1",
"Year": "2012",
"Month": "2",
"Day": "26",
"Day_of_Week": "Sunday",
"Day_of_Week_int": "1",
"DaysSince": "1975",
"DaysToLastArrest": "1",
"DaysToLastCrimeArrest": "306",
"DaysToLastTeamArrest": "1"
},
{
"arrest_stats_id": "180",
"Date": "2012-02-25",
"Team": "SEA",
"Team_name": "Seahawks",
"Team_preffered_name": "Seattle Seahawks",
"Team_city": "Seattle",
"Team_logo_id": "28",
"Team_Conference": "NFC",
"Team_Division": "West",
"Team_Conference_Division": "NFC West",
"Name": "Leroy Hill",
"Position": "LB",
"Position_name": "Linebacker",
"Position_type": "D",
"Encounter": "Arrested",
"Category": "Drugs",
"Crime_category": "Drugs",
"Description": "Accused of marijuana possession in Atlanta and report of strong odor coming from apartment.",
"Outcome": "Charge dropped.",
"Season": "2012",
"ArrestSeasonState": "OffSeason",
"general_category_id": "3",
"legal_level_id": "1",
"resolution_category_id": "2",
"Year": "2012",
"Month": "2",
"Day": "25",
"Day_of_Week": "Saturday",
"Day_of_Week_int": "7",
"DaysSince": "1976",
"DaysToLastArrest": "2",
"DaysToLastCrimeArrest": "2",
"DaysToLastTeamArrest": "254"
},
{
"arrest_stats_id": "213",
"Date": "2011-06-16",
"Team": "SEA",
"Team_name": "Seahawks",
"Team_preffered_name": "Seattle Seahawks",
"Team_city": "Seattle",
"Team_logo_id": "28",
"Team_Conference": "NFC",
"Team_Division": "West",
"Team_Conference_Division": "NFC West",
"Name": "Raheem Brock",
"Position": "DE",
"Position_name": "Defensive End",
"Position_type": "D",
"Encounter": "Arrested",
"Category": "Theft",
"Crime_category": "Theft / Burglary",
"Description": "Accused of walking out on $27 restaurant tab in Philadelphia. He said they canceled order before food arrived.",
"Outcome": "Acquitted.",
"Season": "2011",
"ArrestSeasonState": "OffSeason",
"general_category_id": "9",
"legal_level_id": "1",
"resolution_category_id": "4",
"Year": "2011",
"Month": "6",
"Day": "16",
"Day_of_Week": "Thursday",
"Day_of_Week_int": "5",
"DaysSince": "2230",
"DaysToLastArrest": "0",
"DaysToLastCrimeArrest": "25",
"DaysToLastTeamArrest": "215"
},
{
"arrest_stats_id": "245",
"Date": "2010-11-13",
"Team": "SEA",
"Team_name": "Seahawks",
"Team_preffered_name": "Seattle Seahawks",
"Team_city": "Seattle",
"Team_logo_id": "28",
"Team_Conference": "NFC",
"Team_Division": "West",
"Team_Conference_Division": "NFC West",
"Name": "Raheem Brock",
"Position": "DE",
"Position_name": "Defensive End",
"Position_type": "D",
"Encounter": "Arrested",
"Category": "DUI",
"Crime_category": "DUI",
"Description": "Pulled over by University of Washington police on suspicion of drunken driving. Measured .13 on a Breathalyzer test.",
"Outcome": "Resolution undetermined.",
"Season": "2010",
"ArrestSeasonState": "InSeason",
"general_category_id": "1",
"legal_level_id": "1",
"resolution_category_id": "1",
"Year": "2010",
"Month": "11",
"Day": "13",
"Day_of_Week": "Saturday",
"Day_of_Week_int": "7",
"DaysSince": "2445",
"DaysToLastArrest": "1",
"DaysToLastCrimeArrest": "1",
"DaysToLastTeamArrest": "133"
},
{
"arrest_stats_id": "259",
"Date": "2010-07-03",
"Team": "SEA",
"Team_name": "Seahawks",
"Team_preffered_name": "Seattle Seahawks",
"Team_city": "Seattle",
"Team_logo_id": "28",
"Team_Conference": "NFC",
"Team_Division": "West",
"Team_Conference_Division": "NFC West",
"Name": "Quinton Ganther",
"Position": "RB",
"Position_name": "Running Back",
"Position_type": "O",
"Encounter": "Arrested",
"Category": "DUI",
"Crime_category": "DUI",
"Description": "Pulled over on suspicion for two misdemeanor counts of driving under the influence in Sacramento. State limit for BAC is .08.",
"Outcome": "Resolution undetermined.",
"Season": "2010",
"ArrestSeasonState": "OffSeason",
"general_category_id": "1",
"legal_level_id": "2",
"resolution_category_id": "1",
"Year": "2010",
"Month": "7",
"Day": "3",
"Day_of_Week": "Saturday",
"Day_of_Week_int": "7",
"DaysSince": "2578",
"DaysToLastArrest": "2",
"DaysToLastCrimeArrest": "2",
"DaysToLastTeamArrest": "84"
},
{
"arrest_stats_id": "275",
"Date": "2010-04-10",
"Team": "SEA",
"Team_name": "Seahawks",
"Team_preffered_name": "Seattle Seahawks",
"Team_city": "Seattle",
"Team_logo_id": "28",
"Team_Conference": "NFC",
"Team_Division": "West",
"Team_Conference_Division": "NFC West",
"Name": "Leroy Hill",
"Position": "LB",
"Position_name": "Linebacker",
"Position_type": "D",
"Encounter": "Arrested",
"Category": "Domestic violence",
"Crime_category": "Domestic Violence",
"Description": "Charged with investigation of assault in the fourth degree/domestic violence from dispute with girlfriend in Issaquah, Wash.",
"Outcome": "Diversion program, 18-month probation, treatment program.",
"Season": "2010",
"ArrestSeasonState": "OffSeason",
"general_category_id": "2",
"legal_level_id": "1",
"resolution_category_id": "1",
"Year": "2010",
"Month": "4",
"Day": "10",
"Day_of_Week": "Saturday",
"Day_of_Week_int": "7",
"DaysSince": "2662",
"DaysToLastArrest": "3",
"DaysToLastCrimeArrest": "63",
"DaysToLastTeamArrest": "294"
},
{
"arrest_stats_id": "312",
"Date": "2009-06-20",
"Team": "SEA",
"Team_name": "Seahawks",
"Team_preffered_name": "Seattle Seahawks",
"Team_city": "Seattle",
"Team_logo_id": "28",
"Team_Conference": "NFC",
"Team_Division": "West",
"Team_Conference_Division": "NFC West",
"Name": "Owen Schmitt",
"Position": "FB",
"Position_name": "Fullback",
"Position_type": "O",
"Encounter": "Arrested",
"Category": "DUI",
"Crime_category": "DUI",
"Description": "Suspected of drunken driving after being seen by an officer weaving and following cars too closely in Black Diamond, Wa. Blood-alcohol measured at 0.151.",
"Outcome": "Pleaded guilty to reckless driving, one-year suspended jail sentence, 24 hours community service, $2,130 fines and fees.",
"Season": "2009",
"ArrestSeasonState": "OffSeason",
"general_category_id": "1",
"legal_level_id": "1",
"resolution_category_id": "1",
"Year": "2009",
"Month": "6",
"Day": "20",
"Day_of_Week": "Saturday",
"Day_of_Week_int": "7",
"DaysSince": "2956",
"DaysToLastArrest": "25",
"DaysToLastCrimeArrest": "34",
"DaysToLastTeamArrest": "147"
},
{
"arrest_stats_id": "339",
"Date": "2009-01-24",
"Team": "SEA",
"Team_name": "Seahawks",
"Team_preffered_name": "Seattle Seahawks",
"Team_city": "Seattle",
"Team_logo_id": "28",
"Team_Conference": "NFC",
"Team_Division": "West",
"Team_Conference_Division": "NFC West",
"Name": "Leroy Hill",
"Position": "LB",
"Position_name": "Linebacker",
"Position_type": "D",
"Encounter": "Arrested",
"Category": "Drugs",
"Crime_category": "Drugs",
"Description": "Accused of possessing less than an ounce of marijuana after being found asleep behind the wheel of his car at an intersection in Georgia.",
"Outcome": "Pleaded guilty to marijuana possession, 12 months of probation, $500 fine.",
"Season": "2009",
"ArrestSeasonState": "OffSeason",
"general_category_id": "3",
"legal_level_id": "1",
"resolution_category_id": "1",
"Year": "2009",
"Month": "1",
"Day": "24",
"Day_of_Week": "Saturday",
"Day_of_Week_int": "7",
"DaysSince": "3103",
"DaysToLastArrest": "0",
"DaysToLastCrimeArrest": "56",
"DaysToLastTeamArrest": "259"
},
{
"arrest_stats_id": "376",
"Date": "2008-05-10",
"Team": "SEA",
"Team_name": "Seahawks",
"Team_preffered_name": "Seattle Seahawks",
"Team_city": "Seattle",
"Team_logo_id": "28",
"Team_Conference": "NFC",
"Team_Division": "West",
"Team_Conference_Division": "NFC West",
"Name": "Lofa Tatupu",
"Position": "LB",
"Position_name": "Linebacker",
"Position_type": "D",
"Encounter": "Arrested",
"Category": "DUI",
"Crime_category": "DUI",
"Description": "Pulled over in Kirkland, Wash., for speeding. Police measured blood-alcohol content at .155 or more.",
"Outcome": "Pleaded guilty, one day in jail, $1,255 fines and court costs.",
"Season": "2008",
"ArrestSeasonState": "OffSeason",
"general_category_id": "1",
"legal_level_id": "1",
"resolution_category_id": "1",
"Year": "2008",
"Month": "5",
"Day": "10",
"Day_of_Week": "Saturday",
"Day_of_Week_int": "7",
"DaysSince": "3362",
"DaysToLastArrest": "7",
"DaysToLastCrimeArrest": "7",
"DaysToLastTeamArrest": "19"
},
{
"arrest_stats_id": "384",
"Date": "2008-04-21",
"Team": "SEA",
"Team_name": "Seahawks",
"Team_preffered_name": "Seattle Seahawks",
"Team_city": "Seattle",
"Team_logo_id": "28",
"Team_Conference": "NFC",
"Team_Division": "West",
"Team_Conference_Division": "NFC West",
"Name": "Rocky Bernard",
"Position": "DT",
"Position_name": "Defensive Tackle",
"Position_type": "D",
"Encounter": "Arrested",
"Category": "Domestic violence",
"Crime_category": "Domestic Violence",
"Description": "Accused of hitting his girlfriend in the head at Seattle nightclub.",
"Outcome": "Diversion program, agreed to have no contact with woman for two years, domestic violence treatment.",
"Season": "2008",
"ArrestSeasonState": "OffSeason",
"general_category_id": "2",
"legal_level_id": "1",
"resolution_category_id": "1",
"Year": "2008",
"Month": "4",
"Day": "21",
"Day_of_Week": "Monday",
"Day_of_Week_int": "2",
"DaysSince": "3381",
"DaysToLastArrest": "0",
"DaysToLastCrimeArrest": "33",
"DaysToLastTeamArrest": "405"
},
{
"arrest_stats_id": "462",
"Date": "2007-03-13",
"Team": "SEA",
"Team_name": "Seahawks",
"Team_preffered_name": "Seattle Seahawks",
"Team_city": "Seattle",
"Team_logo_id": "28",
"Team_Conference": "NFC",
"Team_Division": "West",
"Team_Conference_Division": "NFC West",
"Name": "Jerramy Stevens",
"Position": "TE",
"Position_name": "Tight End",
"Position_type": "O",
"Encounter": "Arrested",
"Category": "DUI",
"Crime_category": "DUI",
"Description": "Pulled over in Scottsdale, Ariz., accused of extreme drunken driving, marijuana possession. Blood-alcohol measured at .204.",
"Outcome": "Guilty on three counts, 12 days in jail, $3,160 in fines.",
"Season": "2007",
"ArrestSeasonState": "OffSeason",
"general_category_id": "1",
"legal_level_id": "1",
"resolution_category_id": "1",
"Year": "2007",
"Month": "3",
"Day": "13",
"Day_of_Week": "Tuesday",
"Day_of_Week_int": "3",
"DaysSince": "3786",
"DaysToLastArrest": "3",
"DaysToLastCrimeArrest": "9",
"DaysToLastTeamArrest": "304"
},
{
"arrest_stats_id": "523",
"Date": "2006-05-13",
"Team": "SEA",
"Team_name": "Seahawks",
"Team_preffered_name": "Seattle Seahawks",
"Team_city": "Seattle",
"Team_logo_id": "28",
"Team_Conference": "NFC",
"Team_Division": "West",
"Team_Conference_Division": "NFC West",
"Name": "Wayne Hunter",
"Position": "OT",
"Position_name": "Offensive Tackle",
"Position_type": "O",
"Encounter": "Arrested",
"Category": "Assasult",
"Crime_category": "Assault / Battery",
"Description": "Police said Hunter and his brother got into a scuffle at a sports bar, knocked over a table and slammed a man down.",
"Outcome": "Resolution undetermined. Released by team later that week.",
"Season": "2006",
"ArrestSeasonState": "OffSeason",
"general_category_id": "4",
"legal_level_id": "1",
"resolution_category_id": "1",
"Year": "2006",
"Month": "5",
"Day": "13",
"Day_of_Week": "Saturday",
"Day_of_Week_int": "7",
"DaysSince": "4090",
"DaysToLastArrest": "1",
"DaysToLastCrimeArrest": "20",
"DaysToLastTeamArrest": "32"
},
{
"arrest_stats_id": "532",
"Date": "2006-04-11",
"Team": "SEA",
"Team_name": "Seahawks",
"Team_preffered_name": "Seattle Seahawks",
"Team_city": "Seattle",
"Team_logo_id": "28",
"Team_Conference": "NFC",
"Team_Division": "West",
"Team_Conference_Division": "NFC West",
"Name": "Bryce Fisher",
"Position": "DE",
"Position_name": "Defensive End",
"Position_type": "D",
"Encounter": "Arrested",
"Category": "Domestic violence",
"Crime_category": "Domestic Violence",
"Description": "Accused of twisting his wife's arm behind her back in a dispute.",
"Outcome": "Charge dropped.",
"Season": "2006",
"ArrestSeasonState": "OffSeason",
"general_category_id": "2",
"legal_level_id": "1",
"resolution_category_id": "2",
"Year": "2006",
"Month": "4",
"Day": "11",
"Day_of_Week": "Tuesday",
"Day_of_Week_int": "3",
"DaysSince": "4122",
"DaysToLastArrest": "16",
"DaysToLastCrimeArrest": "55",
"DaysToLastTeamArrest": "86"
},
{
"arrest_stats_id": "544",
"Date": "2006-01-15",
"Team": "SEA",
"Team_name": "Seahawks",
"Team_preffered_name": "Seattle Seahawks",
"Team_city": "Seattle",
"Team_logo_id": "28",
"Team_Conference": "NFC",
"Team_Division": "West",
"Team_Conference_Division": "NFC West",
"Name": "Sean Locklear",
"Position": "OT",
"Position_name": "Offensive Tackle",
"Position_type": "O",
"Encounter": "Arrested",
"Category": "Domestic violence",
"Crime_category": "Domestic Violence",
"Description": "Accused of grabbing his girlfriend in dispute after getting upset with her for dancing with another man at a club.",
"Outcome": "Diversion program, community service.",
"Season": "2006",
"ArrestSeasonState": "OffSeason",
"general_category_id": "2",
"legal_level_id": "1",
"resolution_category_id": "1",
"Year": "2006",
"Month": "1",
"Day": "15",
"Day_of_Week": "Sunday",
"Day_of_Week_int": "1",
"DaysSince": "4208",
"DaysToLastArrest": "6",
"DaysToLastCrimeArrest": "51",
"DaysToLastTeamArrest": "254"
},
{
"arrest_stats_id": "581",
"Date": "2005-05-06",
"Team": "SEA",
"Team_name": "Seahawks",
"Team_preffered_name": "Seattle Seahawks",
"Team_city": "Seattle",
"Team_logo_id": "28",
"Team_Conference": "NFC",
"Team_Division": "West",
"Team_Conference_Division": "NFC West",
"Name": "Koren Robinson",
"Position": "WR",
"Position_name": "Wide Receiver",
"Position_type": "O",
"Encounter": "Arrested",
"Category": "DUI",
"Crime_category": "DUI",
"Description": "Pulled over in Seattle suburb, accused of drunk driving. Blood-alcohol of .191",
"Outcome": "Pleaded guilty, two years probation, one day in jail, fined $2, 137.",
"Season": "2005",
"ArrestSeasonState": "OffSeason",
"general_category_id": "1",
"legal_level_id": "1",
"resolution_category_id": "1",
"Year": "2005",
"Month": "5",
"Day": "6",
"Day_of_Week": "Friday",
"Day_of_Week_int": "6",
"DaysSince": "4462",
"DaysToLastArrest": "11",
"DaysToLastCrimeArrest": "78",
"DaysToLastTeamArrest": "661"
},
{
"arrest_stats_id": "654",
"Date": "2003-07-15",
"Team": "SEA",
"Team_name": "Seahawks",
"Team_preffered_name": "Seattle Seahawks",
"Team_city": "Seattle",
"Team_logo_id": "28",
"Team_Conference": "NFC",
"Team_Division": "West",
"Team_Conference_Division": "NFC West",
"Name": "Wayne Hunter",
"Position": "OT",
"Position_name": "Offensive Tackle",
"Position_type": "O",
"Encounter": "Arrested",
"Category": "Domestic violence",
"Crime_category": "Domestic Violence",
"Description": "Accused of assaulting his pregnant girlfriend, who had been carrying for eight months.",
"Outcome": "Diversion program. Domestic-violence counseling.",
"Season": "2003",
"ArrestSeasonState": "OffSeason",
"general_category_id": "2",
"legal_level_id": "1",
"resolution_category_id": "1",
"Year": "2003",
"Month": "7",
"Day": "15",
"Day_of_Week": "Tuesday",
"Day_of_Week_int": "3",
"DaysSince": "5123",
"DaysToLastArrest": "3",
"DaysToLastCrimeArrest": "11",
"DaysToLastTeamArrest": "103"
},
{
"arrest_stats_id": "667",
"Date": "2003-04-03",
"Team": "SEA",
"Team_name": "Seahawks",
"Team_preffered_name": "Seattle Seahawks",
"Team_city": "Seattle",
"Team_logo_id": "28",
"Team_Conference": "NFC",
"Team_Division": "West",
"Team_Conference_Division": "NFC West",
"Name": "Jerramy Stevens",
"Position": "TE",
"Position_name": "Tight End",
"Position_type": "O",
"Encounter": "Arrested",
"Category": "DUI",
"Crime_category": "DUI",
"Description": "Pulled over in Medina, Wash., for rolling through a stop sign, accused of drunk driving. Blood-alcohol measured at .14.",
"Outcome": "Pleaded guilty to reckless driving, two days in jail, 25 hours of community service, $1,000 fine.",
"Season": "2003",
"ArrestSeasonState": "OffSeason",
"general_category_id": "1",
"legal_level_id": "1",
"resolution_category_id": "1",
"Year": "2003",
"Month": "4",
"Day": "3",
"Day_of_Week": "Thursday",
"Day_of_Week_int": "5",
"DaysSince": "5226",
"DaysToLastArrest": "5",
"DaysToLastCrimeArrest": "21",
"DaysToLastTeamArrest": "61"
},
{
"arrest_stats_id": "672",
"Date": "2003-02-01",
"Team": "SEA",
"Team_name": "Seahawks",
"Team_preffered_name": "Seattle Seahawks",
"Team_city": "Seattle",
"Team_logo_id": "28",
"Team_Conference": "NFC",
"Team_Division": "West",
"Team_Conference_Division": "NFC West",
"Name": "Koren Robinson",
"Position": "WR",
"Position_name": "Wide Receiver",
"Position_type": "O",
"Encounter": "Arrested",
"Category": "Disorderly conduct",
"Crime_category": "Disorderly conduct",
"Description": "Accused of being unruly and failing to disperse after being told to leave the street outside a crowded nightclub in Durham, N.C.",
"Outcome": "Resolution undetermined.",
"Season": "2003",
"ArrestSeasonState": "OffSeason",
"general_category_id": "5",
"legal_level_id": "1",
"resolution_category_id": "1",
"Year": "2003",
"Month": "2",
"Day": "1",
"Day_of_Week": "Saturday",
"Day_of_Week_int": "7",
"DaysSince": "5287",
"DaysToLastArrest": "18",
"DaysToLastCrimeArrest": "517",
"DaysToLastTeamArrest": null
}
]
*/

//const nflData = [{"Month":"2","Year":"2003","arrest_count":"1"},{"Month":"4","Year":"2003","arrest_count":"1"},{"Month":"7","Year":"2003","arrest_count":"1"},{"Month":"5","Year":"2005","arrest_count":"1"},{"Month":"1","Year":"2006","arrest_count":"1"},{"Month":"4","Year":"2006","arrest_count":"1"},{"Month":"5","Year":"2006","arrest_count":"1"},{"Month":"3","Year":"2007","arrest_count":"1"},{"Month":"4","Year":"2008","arrest_count":"1"},{"Month":"5","Year":"2008","arrest_count":"1"},{"Month":"1","Year":"2009","arrest_count":"1"},{"Month":"6","Year":"2009","arrest_count":"1"},{"Month":"4","Year":"2010","arrest_count":"1"},{"Month":"7","Year":"2010","arrest_count":"1"},{"Month":"11","Year":"2010","arrest_count":"1"},{"Month":"6","Year":"2011","arrest_count":"1"},{"Month":"2","Year":"2012","arrest_count":"2"},{"Month":"7","Year":"2012","arrest_count":"1"},{"Month":"1","Year":"2013","arrest_count":"1"},{"Month":"5","Year":"2013","arrest_count":"1"},{"Month":"1","Year":"2014","arrest_count":"1"},{"Month":"10","Year":"2015","arrest_count":"1"},{"Month":"12","Year":"2016","arrest_count":"1"},{"Month":"3","Year":"2017","arrest_count":"1"},{"Month":"4","Year":"2017","arrest_count":"1"}]


const nflData = [
	{
		"date":"19780801",
		"Seattle":3,
		"Patriots":3,
		"Ravens":4
		//"Description": "Accused of being unruly and failing to disperse after being told to leave the street outside a crowded nightclub in Durham, N.C.",

			
	},
	{
		"date":"22780801",
		"Seattle":4,
		"Patriots":3,
		"Ravens":24
			
		

	},
	{
		"date":"29780801",
		"Seattle":5,
		"Patriots":3,
		"Ravens":4
		
		
		

	},
	{
		"date":"39780801",
		"Seattle":6,
		"Patriots":23,
		"Ravens":6
		

		

	},
	{
		"date":"49780801",
		"Patriots":3,
		"Seattle":16,
		"Ravens":24
		


	},
	{
		"date":"52780801",
		"Seattle":26,
		"Patriots":14,
		"Ravens":34
		
		

	},
	{
		"date":"69780801",
		"Patriots":5,
		"Seattle":36,
		"Ravens":4
		
		
		

	},
	{
		"date":"79780801",
		"Patriots":16,
		"Seattle":6,
		"Ravens":14
		
		
		

	}

]



console.log(Date.now())
console.log(nflData)
d3.json("data.json", function(error, data) {
  var data = nflData;
  color.domain(d3.keys(data[0]).filter(function(key) { // Set the domain of the color ordinal scale to be all the csv headers except "date", matching a color to an issue
    return key !== "date";
  }));

  data.forEach(function(d) { // Make every date in the csv data a javascript date object format
    console.log(d);
	  
    //var da = new Date(d['Date']).getTime();
    //d.date = da; 
    d.date = parseDate(d.date);
  });

  var categories = color.domain().map(function(name) { // Nest the data into an array of objects with new keys

	  console.log(name)
    return {
      name: name, // "name": the csv headers except date
      values: data.map(function(d) { // "values": which has an array of the dates and ratings
        return {
          date: d.date,
          rating: +(d[name]),
          };
      }),
      visible: (name === "Unemployment" ? true : false) // "visible": all false except for economy which is true.
    };
  });

  xScale.domain(d3.extent(data, function(d) { return d.date; })); // extent = highest and lowest points, domain is data, range is bouding box

  yScale.domain([0, 100
    //d3.max(categories, function(c) { return d3.max(c.values, function(v) { return v.rating; }); })
  ]);

  xScale2.domain(xScale.domain()); // Setting a duplicate xdomain for brushing reference later

 //for slider part-----------------------------------------------------------------------------------

 var brush = d3.svg.brush()//for slider bar at the bottom
    .x(xScale2)
    .on("brush", brushed);

  context.append("g") // Create brushing xAxis
      .attr("class", "x axis1")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

  var contextArea = d3.svg.area() // Set attributes for area chart in brushing context graph
    .interpolate("monotone")
    .x(function(d) { return xScale2(d.date); }) // x is scaled to xScale2
    .y0(height2) // Bottom line begins at height2 (area chart not inverted)
    .y1(0); // Top line of area, 0 (area chart not inverted)

  //plot the rect as the bar at the bottom
  context.append("path") // Path is created using svg.area details
    .attr("class", "area")
    .attr("d", contextArea(categories[0].values)) // pass first categories data .values to area path generator
    .attr("fill", "#F1F1F2");

  //append the brush for the selection of subsection
  context.append("g")
    .attr("class", "x brush")
    .call(brush)
    .selectAll("rect")
    .attr("height", height2) // Make brush rects same height
      .attr("fill", "#E6E7E8");
  //end slider part-----------------------------------------------------------------------------------

  // draw line graph
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("x", -10)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Issues Rating");

  var issue = svg.selectAll(".issue")
      .data(categories) // Select nested data and append to new svg group elements
    .enter().append("g")
      .attr("class", "issue");

  issue.append("path")
      .attr("class", "line")
      .style("pointer-events", "none") // Stop line interferring with cursor
      .attr("id", function(d) {
        return "line-" + d.name.replace(" ", "").replace("/", ""); // Give line id of line-(insert issue name, with any spaces replaced with no spaces)
      })
      .attr("d", function(d) {
        return d.visible ? line(d.values) : null; // If array key "visible" = true then draw line, if not then don't
      })
      .attr("clip-path", "url(#clip)")//use clip path to make irrelevant part invisible
      .style("stroke", function(d) { return color(d.name); });

  // draw legend
  var legendSpace = 450 / categories.length; // 450/number of issues (ex. 40)

  issue.append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("x", width + (margin.right/3) - 15)
      .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace) - 8; })  // spacing
      .attr("fill",function(d) {
        return d.visible ? color(d.name) : "#F1F1F2"; // If array key "visible" = true then color rect, if not then make it grey
      })
      .attr("class", "legend-box")

      .on("click", function(d){ // On click make d.visible
        d.visible = !d.visible; // If array key for this data selection is "visible" = true then make it false, if false then make it true

        maxY = findMaxY(categories); // Find max Y rating value categories data with "visible"; true
        yScale.domain([0,maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
        svg.select(".y.axis")
          .transition()
          .call(yAxis);

        issue.select("path")
          .transition()
          .attr("d", function(d){
            return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
          })

        issue.select("rect")
          .transition()
          .attr("fill", function(d) {
          return d.visible ? color(d.name) : "#F1F1F2";
        });
      })

      .on("mouseover", function(d){

        d3.select(this)
          .transition()
          .attr("fill", function(d) { return color(d.name); });

        d3.select("#line-" + d.name.replace(" ", "").replace("/", ""))
          .transition()
          .style("stroke-width", 2.5);
      })

      .on("mouseout", function(d){

        d3.select(this)
          .transition()
          .attr("fill", function(d) {
          return d.visible ? color(d.name) : "#F1F1F2";});

        d3.select("#line-" + d.name.replace(" ", "").replace("/", ""))
          .transition()
          .style("stroke-width", 1.5);
      })

  issue.append("text")
      .attr("x", width + (margin.right/3))
      .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace); })  // (return (11.25/2 =) 5.625) + i * (5.625)
      .text(function(d) { return d.name; });

  // Hover line
  var hoverLineGroup = svg.append("g")
            .attr("class", "hover-line");

  var hoverLine = hoverLineGroup // Create line with basic attributes
        .append("line")
            .attr("id", "hover-line")
            .attr("x1", 10).attr("x2", 10)
            .attr("y1", 0).attr("y2", height + 10)
            .style("pointer-events", "none") // Stop line interferring with cursor
            .style("opacity", 1e-6); // Set opacity to zero

  var hoverDate = hoverLineGroup
        .append('text')
            .attr("class", "hover-text")
            .attr("y", height - (height-40)) // hover date text position
            .attr("x", width - 150) // hover date text position
            .style("fill", "#E6E7E8");

  var columnNames = d3.keys(data[0]) //grab the key values from your first data row
                                     //these are the same as your column names
                  .slice(1); //remove the first column name (`date`);

  var focus = issue.select("g") // create group elements to house tooltip text
      .data(columnNames) // bind each column name date to each g element
    .enter().append("g") //create one <g> for each columnName
      .attr("class", "focus");

  focus.append("text") // http://stackoverflow.com/questions/22064083/d3-js-multi-series-chart-with-y-value-tracking
        .attr("class", "tooltip")
        .attr("x", width + 20) // position tooltips
        .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace); }); // (return (11.25/2 =) 5.625) + i * (5.625) // position tooltips

  // Add mouseover events for hover line.
  d3.select("#mouse-tracker") // select chart plot background rect #mouse-tracker
  .on("mousemove", mousemove) // on mousemove activate mousemove function defined below
  .on("mouseout", function() {
      hoverDate
          .text(null) // on mouseout remove text for hover date

      d3.select("#hover-line")
          .style("opacity", 1e-6); // On mouse out making line invisible
  });

  function mousemove() {
      var mouse_x = d3.mouse(this)[0]; // Finding mouse x position on rect
      var graph_x = xScale.invert(mouse_x); //

      //var mouse_y = d3.mouse(this)[1]; // Finding mouse y position on rect
      //var graph_y = yScale.invert(mouse_y);
      //console.log(graph_x);

      var format = d3.time.format('%b %Y'); // Format hover date text to show three letter month and full year

      hoverDate.text(format(graph_x)); // scale mouse position to xScale date and format it to show month and year

      d3.select("#hover-line") // select hover-line and changing attributes to mouse position
          .attr("x1", mouse_x)
          .attr("x2", mouse_x)
          .style("opacity", 1); // Making line visible

      // Legend tooltips // http://www.d3noob.org/2014/07/my-favourite-tooltip-method-for-line.html

      var x0 = xScale.invert(d3.mouse(this)[0]), /* d3.mouse(this)[0] returns the x position on the screen of the mouse. xScale.invert function is reversing the process that we use to map the domain (date) to range (position on screen). So it takes the position on the screen and converts it into an equivalent date! */
      i = bisectDate(data, x0, 1), // use our bisectDate function that we declared earlier to find the index of our data array that is close to the mouse cursor
      /*It takes our data array and the date corresponding to the position of or mouse cursor and returns the index number of the data array which has a date that is higher than the cursor position.*/
      d0 = data[i - 1],
      d1 = data[i],
      /*d0 is the combination of date and rating that is in the data array at the index to the left of the cursor and d1 is the combination of date and close that is in the data array at the index to the right of the cursor. In other words we now have two variables that know the value and date above and below the date that corresponds to the position of the cursor.*/
      d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      console.log(d.description); 
      /*The final line in this segment declares a new array d that is represents the date and close combination that is closest to the cursor. It is using the magic JavaScript short hand for an if statement that is essentially saying if the distance between the mouse cursor and the date and close combination on the left is greater than the distance between the mouse cursor and the date and close combination on the right then d is an array of the date and close on the right of the cursor (d1). Otherwise d is an array of the date and close on the left of the cursor (d0).*/

      //d is now the data row for the date closest to the mouse position

      focus.select("text").text(function(columnName){
         //because you didn't explictly set any data on the <text>
         //elements, each one inherits the data from the focus <g>

         return (d[columnName]);
      });
  };

  //for brusher of the slider bar at the bottom
  function brushed() {

    xScale.domain(brush.empty() ? xScale2.domain() : brush.extent()); // If brush is empty then reset the Xscale domain to default, if not then make it the brush extent

    svg.select(".x.axis") // replot xAxis with transition when brush used
          .transition()
          .call(xAxis);

    maxY = findMaxY(categories); // Find max Y rating value categories data with "visible"; true
    yScale.domain([0,maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true

    svg.select(".y.axis") // Redraw yAxis
      .transition()
      .call(yAxis);

    issue.select("path") // Redraw lines based on brush xAxis scale and domain
      .transition()
      .attr("d", function(d){
          return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
      });

  };

}); // End Data callback function

  function findMaxY(data){  // Define function "findMaxY"
    var maxYValues = data.map(function(d) {
      if (d.visible){
        return d3.max(d.values, function(value) { // Return max rating value
          return value.rating; })
      }
    });
    return d3.max(maxYValues);
  }
