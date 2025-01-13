const championList = document.getElementById("champion-list");
const team1Bans = document.querySelector("#team-1-bans .bans");
const team2Bans = document.querySelector("#team-2-bans .bans");
const team1Picks = document.getElementById("team-1-picks");
const team2Picks = document.getElementById("team-2-picks");
const regionFilter = document.getElementById("region-filter");

let clickCounter = 0; // Track the number of clicks

// Define the sequence of actions based on click order
const actionSequence = [
    { team: "team1", action: "ban" },
    { team: "team2", action: "ban" },
    { team: "team1", action: "ban" },
    { team: "team2", action: "ban" },
    { team: "team1", action: "pick" },
    { team: "team2", action: "pick" },
    { team: "team2", action: "pick" },
    { team: "team1", action: "ban" },
    { team: "team2", action: "ban" },
    { team: "team1", action: "pick" },
    { team: "team1", action: "pick" },
    { team: "team2", action: "pick" }
];

// Mapping champions to their respective regions
const regionMapping = {
    // Bilgewater
    Fizz: "Bilgewater",
    Graves: "Bilgewater",
    Illaoi: "Bilgewater",
    MissFortune: "Bilgewater",
    Nautilus: "Bilgewater",
    Pyke: "Bilgewater",
    TahmKench: "Bilgewater",
    TwistedFate: "Bilgewater",
    Gangplank: "Bilgewater",
    Nilah: "Bilgewater",
    
    // Demacia
    Fiora: "Demacia",
    Galio: "Demacia",
    Garen: "Demacia",
    JarvanIV: "Demacia",
    Kayle: "Demacia",
    Lucian: "Demacia",
    Lux: "Demacia",
    Morgana: "Demacia",
    Poppy: "Demacia",
    Quinn: "Demacia",
    Shyvana: "Demacia",
    Sona: "Demacia",
    Sylas: "Demacia",
    Vayne: "Demacia",
    XinZhao: "Demacia",
    
    // Freljord
    Anivia: "Freljord",
    Ashe: "Freljord",
    Braum: "Freljord",
    Gnar: "Freljord",
    Gragas: "Freljord",
    Lissandra: "Freljord",
    Nunu: "Freljord",
    Olaf: "Freljord",
    Ornn: "Freljord",
    Sejuani: "Freljord",
    Trundle: "Freljord",
    Tryndamere: "Freljord",
    Udyr: "Freljord",
    Volibear: "Freljord",

    // Ionia
    Ahri: "Ionia",
    Akali: "Ionia",
    Hwei: "Ionia",
    Irelia: "Ionia",
    Ivern: "Ionia",
    Jhin: "Ionia",
    Karma: "Ionia",
    Kayn: "Ionia",
    Kennen: "Ionia",
    LeeSin: "Ionia",
    Lillia: "Ionia",
    MasterYi: "Ionia",
    Rakan: "Ionia",
    Sett: "Ionia",
    Shen: "Ionia",
    Syndra: "Ionia",
    Varus: "Ionia",
    Wukong: "Ionia",
    Xayah: "Ionia",
    Yasuo: "Ionia",
    Yone: "Ionia",
    Zed: "Ionia",

    // Zaun
    Blitzcrank: "Zaun",
    DrMundo: "Zaun",
    Ekko: "Zaun",
    Janna: "Zaun",
    Jinx: "Zaun",
    Renata: "Zaun",
    Singed: "Zaun",
    Twitch: "Zaun",
    Urgot: "Zaun",
    Viktor: "Zaun",
    Warwick: "Zaun",
    Zac: "Zaun",
    Ziggs: "Zaun",
    Zeri: "Zaun",

    // Targon
    Aphelios: "Targon",
    AurelionSol: "Targon",
    Diana: "Targon",
    Leona: "Targon",
    Pantheon: "Targon",
    Soraka: "Targon",
    Taric: "Targon",
    Zoe: "Targon",

    // The Void
    BelVeth: "The Void",
    ChoGath: "The Void",
    KaiSa: "The Void",
    Kassadin: "The Void",
    KhaZix: "The Void",
    KogMaw: "The Void",
    Malzahar: "The Void",
    RekSai: "The Void",
    VelKoz: "The Void",

    // Bandle City
    Corki: "Bandle City",
    Lulu: "Bandle City",
    Rumble: "Bandle City",
    Teemo: "Bandle City",
    Tristana: "Bandle City",
    Veigar: "Bandle City",
    Yuumi: "Bandle City",

    // Piltover
    Caitlyn: "Piltover",
    Camille: "Piltover",
    Ezreal: "Piltover",
    Heimerdinger: "Piltover",
    Jayce: "Piltover",
    Orianna: "Piltover",
    Seraphine: "Piltover",
    Vi: "Piltover",

    // Ixtal
    Malphite: "Ixtal",
    Millio: "Ixtal",
    Neeko: "Ixtal",
    Nidalee: "Ixtal",
    Qiyana: "Ixtal",
    Rengar: "Ixtal",
    Skarner: "Ixtal",
    Zyra: "Ixtal",

    // Noxus
    Ambessa: "Noxus",
    Briar: "Noxus",
    Cassiopeia: "Noxus",
    Darius: "Noxus",
    Draven: "Noxus",
    Katarina: "Noxus",
    Kled: "Noxus",
    LeBlanc: "Noxus",
    Mordekaiser: "Noxus",
    Rell: "Noxus",
    Riven: "Noxus",
    Samira: "Noxus",
    Sion: "Noxus",
    Swain: "Noxus",
    Talon: "Noxus",
    Vladimir: "Noxus",

    // Shurima
    Akshan: "Shurima",
    Amumu: "Shurima",
    Azir: "Shurima",
    KSante: "Shurima",
    Naafiri: "Shurima",
    Nasus: "Shurima",
    Rammus: "Shurima",
    Renekton: "Shurima",
    Sivir: "Shurima",
    Taliyah: "Shurima",
    Xerath: "Shurima",

    // Shadow Isles
    Elise: "Shadow Isles",
    Gwen: "Shadow Isles",
    Hecarim: "Shadow Isles",
    Kalista: "Shadow Isles",
    Karthus: "Shadow Isles",
    Maokai: "Shadow Isles",
    Thresh: "Shadow Isles",
    Vex: "Shadow Isles",
    Viego: "Shadow Isles",
    Yorick: "Shadow Isles",

    // Runeterra
    Bard: "Runeterra",
    Smolder: "Runeterra",
    Aatrox: "Runeterra",
    Evelynn: "Runeterra",
    Kindred: "Runeterra",
    Annie: "Runeterra",
    Zilean: "Runeterra",
    Nocturne: "Runeterra",
    Jax: "Runeterra",
    Fiddlesticks: "Runeterra",
    Alistar: "Runeterra",
    Brand: "Runeterra",
    Lucian: "Runeterra",
    Senna: "Runeterra",
    Shaco: "Runeterra",
    Ryze: "Runeterra",
    AurelionSol: "Runeterra",
};

// Load Regions into the filter
function loadRegions() {
    const uniqueRegions = [...new Set(Object.values(regionMapping))];
    uniqueRegions.forEach(region => {
        const option = document.createElement("option");
        option.value = region;
        option.textContent = region;
        regionFilter.appendChild(option);
    });

    regionFilter.addEventListener("change", () => {
        filterChampionsByRegion(regionFilter.value);
    });
}

// Load Champions from Riot API
async function loadChampions() {
    try {
        // Fetch the latest version dynamically
        const versionResponse = await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`);
        const versions = await versionResponse.json();
        const latestVersion = versions[0]; // Latest version is the first in the array

        // Fetch champions using the latest version
        const url = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`;
        const response = await fetch(url);
        const data = await response.json();
        const champions = Object.values(data.data);

        // Display champions in the pool
        champions.forEach((champion) => {
            const champDiv = document.createElement("div");
            champDiv.classList.add("champion");
            champDiv.style.backgroundImage = `url(https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${champion.image.full})`;
            champDiv.title = champion.name;
            champDiv.setAttribute("data-region", regionMapping[champion.id] || "Unknown");

            champDiv.addEventListener("click", () => {
                handleChampionClick(champion, champDiv);
            });

            championList.appendChild(champDiv);
        });
    } catch (error) {
        console.error("Failed to load champions:", error);
    }
}


function handleChampionClick(champion, champDiv) {
    if (clickCounter >= actionSequence.length) return; // Stop if all actions are complete

    const action = actionSequence[clickCounter];

    if (action.action === "ban") {
        handleBan(champion, champDiv, action.team);
    } else if (action.action === "pick") {
        handlePick(champion, champDiv, action.team);
    }

    clickCounter++; // Move to the next action
}

function handleBan(champion, champDiv, team) {
    const banContainer = team === "team1" ? team1Bans : team2Bans;
    const banDiv = champDiv.cloneNode(true);
    banContainer.appendChild(banDiv);
    champDiv.remove();
}

function handlePick(champion, champDiv, team) {
    const pickContainer = team === "team1" ? team1Picks : team2Picks;
    const pickDiv = champDiv.cloneNode(true);
    pickContainer.appendChild(pickDiv);
    champDiv.remove();
}

// Filter champions by region
function filterChampionsByRegion(region) {
    const champions = championList.querySelectorAll(".champion");
    champions.forEach((champ) => {
        if (region === "All" || champ.getAttribute("data-region") === region) {
            champ.style.display = "block";
        } else {
            champ.style.display = "none";
        }
    });
}

// Load regions and champions on page load
loadRegions();
loadChampions();
