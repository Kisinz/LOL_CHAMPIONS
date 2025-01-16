const championList = document.getElementById("champion-list");
const team1Bans = document.querySelector(".col-md-4 .card.border-primary .bans");
const team2Bans = document.querySelector(".col-md-4 .card.border-danger .bans");
const team1Picks = document.querySelector(".col-md-4 .card.border-primary .picks");
const team2Picks = document.querySelector(".col-md-4 .card.border-danger .picks");
const regionFilter = document.getElementById("region-filter");
const statusMessage = document.getElementById("status-message");

// ฟังก์ชันสำหรับการกรองเมื่อเปลี่ยน Region
document.getElementById("region-filter").addEventListener("change", (e) => {
    const region = e.target.value;
    const searchQuery = document.getElementById("champion-search").value;
    filterChampionsByRegionAndSearch(region, searchQuery);
});

// ฟังก์ชันสำหรับการค้นหาเมื่อพิมพ์ในช่องค้นหา
document.getElementById("champion-search").addEventListener("input", (e) => {
    const searchQuery = e.target.value;
    const region = document.getElementById("region-filter").value;
    filterChampionsByRegionAndSearch(region, searchQuery);
});
document.getElementById("team1-region").addEventListener("change", (e) => {
    updateTeamRegion("team1", e.target.value);
});

document.getElementById("team2-region").addEventListener("change", (e) => {
    updateTeamRegion("team2", e.target.value);
});

const regionBackgrounds = {
    "Bandle City": "Champion/Bandle_City/Background.jpg",
    "Bilgewater": "Champion/Bilgewater/Background.jpg",
    "Demacia": "Champion/Demacia/Background.jpg",
    "Freljord": "Champion/Freljord/Background.jpg",
    "Ionia": "Champion/Ionia/Background.jpg",
    "Zaun": "Champion/Zaun/Background.jpg",
    "Targon": "Champion/Targon/Background.jpg",
    "The Void": "Champion/The_Void/Background.jpg",
    "Piltover": "Champion/Plitover/Background.jpg",
    "Ixtal": "Champion/Ixtal/Background.jpg",
    "Noxus": "Champion/Noxus/Background.jpg",
    "Shurima": "Champion/Shurima/Background.jpg",
    "Shadow Isles": "Champion/Shadow_Isles/Background.jpg",
    "Runeterra": "Champion/Runeterra/Background.jpg",
    "All": "none" // Default background
};

// Update theme based on selected region


let clickCounter = 0; // Track the number of clicks
const team1TotalTime = 180; // เวลาสำหรับทีม 1 (3 นาที)
const team2TotalTime = 180; // เวลาสำหรับทีม 2 (3 นาที)
let team1Time = team1TotalTime;
let team2Time = team2TotalTime;
let activeTeam = "team1"; // ทีมที่เริ่มต้น
let timerInterval;


// Define the sequence of actions based on click order
const actionSequence = [
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

const regionMapping = {
    "Bilgewater": ["Fizz", "Graves", "Illaoi", "MissFortune", "Nautilus", "Pyke", "TahmKench", "TwistedFate", "Gangplank", "Nilah"],
    "Demacia": ["Fiora", "Galio", "Garen", "Jarvan IV", "Kayle", "Lucian", "Lux", "Morgana", "Poppy", "Quinn", "Shyvana", "Sona", "Sylas", "Vayne", "Xin Zhao"],
    "Freljord": ["Anivia", "Ashe","Aurora", "Braum", "Gnar", "Gragas", "Lissandra", "Nunu & Willump", "Olaf", "Ornn", "Sejuani", "Trundle", "Tryndamere", "Udyr", "Volibear"],
    "Ionia": ["Ahri", "Akali", "Hwei", "Irelia", "Ivern", "Jhin", "Karma", "Kayn", "Kennen", "Lee Sin", "Lillia", "Master Yi", "Rakan", "Sett", "Shen", "Syndra", "Varus", "Wukong", "Xayah", "Yasuo", "Yone", "Zed"],
    "Zaun": ["Blitzcrank", "Dr. Mundo", "Ekko", "Janna", "Jinx", "Renata Glasc", "Singed", "Twitch", "Urgot", "Viktor", "Warwick", "Zac", "Ziggs", "Zeri"],
    "Targon": ["Aphelios", "Aurelion Sol", "Diana", "Leona", "Pantheon", "Soraka", "Taric", "Zoe"],
    "The Void": ["Bel'Veth", "Cho'Gath", "Kai'Sa", "Kassadin", "Kha'Zix", "Kog'Maw", "Malzahar", "Rek'Sai", "Vel'Koz"],
    "Bandle City": ["Corki", "Lulu", "Rumble", "Teemo", "Tristana", "Veigar", "Yuumi"],
    "Piltover": ["Caitlyn", "Camille", "Ezreal", "Heimerdinger", "Jayce", "Orianna", "Seraphine", "Vi"],
    "Ixtal": ["Malphite", "Milio", "Neeko", "Nidalee", "Qiyana", "Rengar", "Skarner", "Zyra"],
    "Noxus": ["Ambessa", "Briar", "Cassiopeia", "Darius", "Draven", "Katarina", "Kled", "LeBlanc", "Mordekaiser", "Rell", "Riven", "Samira", "Sion", "Swain", "Talon", "Vladimir"],
    "Shurima": ["Akshan", "Amumu", "Azir", "K’Sante", "Naafiri", "Nasus", "Rammus", "Renekton", "Sivir", "Taliyah", "Xerath"],
    "Shadow Isles": ["Elise", "Gwen", "Hecarim", "Kalista", "Karthus", "Maokai", "Thresh", "Vex", "Viego", "Yorick"],
    "Runeterra": ["Bard", "Smolder", "Aatrox", "Evelynn", "Kindred", "Annie", "Zilean", "Nocturne", "Jax", "Fiddlesticks", "Alistar", "Brand", "Lucian", "Senna", "Shaco", "Ryze", "Aurelion Sol"]
};

// Load Regions into the filter
function filterChampionsByRegionAndSearch(region, searchQuery) {
    const champions = championList.querySelectorAll(".champion");
    const lowerCaseQuery = searchQuery.toLowerCase();

    champions.forEach(champ => {
        const champTitle = champ.title; // ใช้ title ที่ตั้งใน HTML
        const validChampions = regionMapping[region] || []; // ตัวละครใน Region ที่เลือก

        // ตรวจสอบว่าตัวละครอยู่ใน Region ที่เลือก และค้นหาตรงกับ query หรือไม่
        if (
            (region === "All" || validChampions.includes(champTitle)) &&
            champTitle.toLowerCase().includes(lowerCaseQuery)
        ) {
            champ.style.display = "block"; // แสดงตัวละครที่ตรงเงื่อนไข
        } else {
            champ.style.display = "none"; // ซ่อนตัวละครที่ไม่ตรงเงื่อนไข
        }
    });
}
function loadRegions() {
    const uniqueRegions = Object.keys(regionMapping);
    uniqueRegions.forEach(region => {
        const option = document.createElement("option");
        option.value = region;
        option.textContent = region;
        regionFilter.appendChild(option);
    });

}

// Load Champions dynamically
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
            champDiv.setAttribute("data-region", Object.keys(regionMapping).find(key => 
                regionMapping[key].includes(champion.id)
            ) || "Unknown");
            

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
    if (clickCounter >= actionSequence.length) return;

    const action = actionSequence[clickCounter];

    if (action.action === "ban") {
        handleBan(champion, champDiv, action.team);
    } else if (action.action === "pick") {
        handlePick(champion, champDiv, action.team);
    }

    clickCounter++;
    updateActionHighlight();

    // สลับทีมถ้าทีมถัดไปต่างจากทีมปัจจุบัน
    if (clickCounter < actionSequence.length) {
        const nextAction = actionSequence[clickCounter];
        if (nextAction.team !== action.team) {
            switchTeam();
        }
    }
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









// ฟังก์ชันเริ่มจับเวลาสำหรับทีมที่กำลังใช้งาน
function startTeamTimer() {
    if (timerInterval) clearInterval(timerInterval); // ล้าง Timer เก่า

    updateTimerStyles(); // อัปเดตสีของ Timer

    timerInterval = setInterval(() => {
        if (activeTeam === "team1") {
            if (team1Time > 0) {
                team1Time--;
                updateTimerDisplay("team1", team1Time);
            } else {
                clearInterval(timerInterval);
                alert("ทีม 1 หมดเวลา!");
            }
        } else if (activeTeam === "team2") {
            if (team2Time > 0) {
                team2Time--;
                updateTimerDisplay("team2", team2Time);
            } else {
                clearInterval(timerInterval);
                alert("ทีม 2 หมดเวลา!");
            }
        }
    }, 1000);
}


// ฟังก์ชันอัปเดตเวลาบนหน้าจอ
function updateTimerDisplay(team, time) {
    const timerElement = document.getElementById(`${team}-timer`);
    const minutes = Math.floor(time / 60).toString().padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    timerElement.textContent = `ทีม ${team === "team1" ? "1" : "2"}: ${minutes}:${seconds}`;
}
function updateTimerStyles() {
    const team1Timer = document.getElementById("team1-timer");
    const team2Timer = document.getElementById("team2-timer");

    if (activeTeam === "team1") {
        team1Timer.classList.remove("alert-secondary");
        team1Timer.classList.add("alert-primary");
        team2Timer.classList.remove("alert-primary");
        team2Timer.classList.add("alert-secondary");
    } else {
        team2Timer.classList.remove("alert-secondary");
        team2Timer.classList.add("alert-primary");
        team1Timer.classList.remove("alert-primary");
        team1Timer.classList.add("alert-secondary");
    }
}



// ฟังก์ชันสลับทีม
function switchTeam() {
    activeTeam = activeTeam === "team1" ? "team2" : "team1";
    startTeamTimer();
}

// ฟังก์ชันสิ้นสุดการจับเวลา
function endDraft(message) {
    clearInterval(timerInterval); // หยุดการจับเวลา
    alert(message); // แจ้งเตือน
}


// เพิ่มการอัปเดตไฮไลต์
function updateActionHighlight() {
    const statusMessageElement = document.getElementById("status-message");
    statusMessageElement.className = "alert";

    // ตรวจสอบสถานะปัจจุบัน
    if (clickCounter >= actionSequence.length) {
        statusMessageElement.textContent = "กระบวนการเสร็จสมบูรณ์";
        statusMessageElement.classList.add("alert-success");

        // หยุดเวลาหลังดราฟเสร็จ
        clearInterval(timerInterval);
        return;
    }

    const currentAction = actionSequence[clickCounter];
    if (currentAction.action === "ban") {
        statusMessageElement.textContent = `ทีม ${currentAction.team === "team1" ? "1" : "2"}: กรุณาแบน`;
        statusMessageElement.classList.add("alert-danger");
    } else if (currentAction.action === "pick") {
        statusMessageElement.textContent = `ทีม ${currentAction.team === "team1" ? "1" : "2"}: กรุณาหยิบ`;
        statusMessageElement.classList.add("alert-success");
    }
}


let isTimerRunning = false; // ตัวแปรเพื่อเช็คว่าเวลาทำงานอยู่หรือไม่

// ฟังก์ชันเปิด-ปิดเวลา
function toggleTimer() {
    const toggleButton = document.getElementById("toggle-timer");
    
    if (isTimerRunning) {
        // หยุดเวลา
        clearInterval(timerInterval);
        toggleButton.textContent = "เริ่มเวลา";
    } else {
        // เริ่มเวลา
        startTeamTimer();
        toggleButton.textContent = "หยุดเวลา";
    }
    
    isTimerRunning = !isTimerRunning; // เปลี่ยนสถานะการทำงานของเวลา
}

// เชื่อมปุ่มกับฟังก์ชัน
document.getElementById("toggle-timer").addEventListener("click", toggleTimer);
// Mapping regions to themes (background colors or images)

// Function to update region champions and team theme
function updateTeamRegion(team, region) {
    const teamCard = document.querySelector(`.card.border-${team === "team1" ? "primary" : "danger"}`);
    const regionChampionsDiv = document.getElementById(`${team}-region-champions`); // Container for showing champions
    const yordleChampionsDiv = document.getElementById(`${team}-yordle-champions`); // Container for showing Yordle champions
    const availableChampionsHeader = document.getElementById(`${team}-available-champions`); // Header for available champions
    const yordleHeader = document.getElementById(`${team}-yordle-header`); // Header for Yordle champions

    regionChampionsDiv.innerHTML = ""; // Clear existing champions
    yordleChampionsDiv.innerHTML = ""; // Clear existing Yordle champions

    // Update team card background based on the region
    const backgroundUrl = regionBackgrounds[region] || "none";
    if (backgroundUrl !== "none") {
        teamCard.style.backgroundImage = `url(${backgroundUrl})`;
        teamCard.style.backgroundSize = "cover";
        teamCard.style.backgroundPosition = "center";
    } else {
        teamCard.style.backgroundImage = "none"; // Default to no background
    }

    // Show/Hide "Available Champions" header and container
    if (region !== "All") {
        availableChampionsHeader.style.display = "block";
        regionChampionsDiv.style.display = "flex"; // Show available champions
    } else {
        availableChampionsHeader.style.display = "none";
        regionChampionsDiv.style.display = "none"; // Hide available champions
    }

    // Show/Hide "Yordle Champions" header and container based on region
    if (region === "Bandle City") {
        yordleHeader.style.display = "block";
        yordleChampionsDiv.style.display = "flex"; // Show Yordle champions

        // Add Yordle champions
        const yordleList = ["Kennen", "Poppy", "Heimerdinger", "Ziggs", "Vex", "Fizz", "Gnar", "Kled"];
        const champions = Array.from(championList.querySelectorAll(".champion"));

        champions.forEach(champ => {
            const champTitle = champ.title;

            if (yordleList.includes(champTitle)) {
                const champClone = champ.cloneNode(true);
                const sourceRegion = Object.keys(regionMapping).find(key => regionMapping[key].includes(champTitle)) || "Unknown";

                // Add champion's source region as a label
                const champLabel = document.createElement("div");
                champLabel.textContent = `(${sourceRegion})`; // Show source region
                champLabel.style.fontSize = "12px";

                const champContainer = document.createElement("div");
                champContainer.style.display = "inline-block"; // Display champions horizontally
                champContainer.style.margin = "0 10px"; // Add spacing between champions
                champContainer.style.textAlign = "center"; // Center align

                champContainer.appendChild(champClone);
                champContainer.appendChild(champLabel);

                yordleChampionsDiv.appendChild(champContainer);
            }
        });
    } else {
        yordleHeader.style.display = "none";
        yordleChampionsDiv.style.display = "none"; // Hide Yordle champions
    }

    // Filter and display champions based on regionMapping
    const validChampions = regionMapping[region] || [];
    const champions = Array.from(championList.querySelectorAll(".champion"));

    champions.forEach(champ => {
        const champTitle = champ.title;

        // Check if champion belongs to the selected region
        if (validChampions.includes(champTitle)) {
            const champClone = champ.cloneNode(true); // Clone champion element to avoid removing it from the main pool
            regionChampionsDiv.appendChild(champClone); // Append to the specific team's container
        }
    });
}







// เริ่มต้นการตั้งค่า (ตัวอย่างการตั้งค่าอื่นๆ)
loadRegions();
loadChampions();
updateActionHighlight();


