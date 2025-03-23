let modalContainer = document.getElementById('modal-container');
let modal = document.getElementById('modal');
let modalOpenTime;
let modalCloseTime;

let modal_name;

let canClose = true;

function modalHideOnClick(e) {
    const timePassed = Date.now() > (modalOpenTime + 450);
    if (e.target === modalContainer && timePassed && canClose) hideModal();
}

function hideModal(instant = false) {
    modalContainer = document.getElementById('modal-container');

    if (!modalContainer) {
        return setTimeout(() => {
            hideModal();
        }, 25);
    }

    modal = document.getElementById('modal');

    modalCloseTime = Date.now();

    if (instant) modalCloseTime -= 750;

    modalContainer.classList.remove("backdrop-brightness-75", "backdrop-saturate-50", "backdrop-blur-md")
    modal.classList.add("scale-50", "opacity-0", "blur-lg", "translate-y-6")

    setTimeout(() => {
        modalContainer.classList.add("opacity-0");
        setTimeout(() => {
            modalContainer.classList.add("hidden");
        }, instant ? 0 : 500);
    }, instant ? 0 : 200);
}


function showModal(modal_name) {
    if (Date.now() < (modalCloseTime + 750)) return;

    modal_name = modal_name || "default";

    modalContainer = document.getElementById('modal-container');
    modal = document.getElementById('modal');

    modalContainer.onclick = modalHideOnClick;

    modalOpenTime = Date.now();
    modalContainer.classList.remove("hidden");

    setTimeout(() => {
        modalContainer.classList.add("backdrop-brightness-75", "backdrop-saturate-50", "backdrop-blur-md")
        modalContainer.classList.remove("opacity-0");

        setTimeout(() => {
            modal.classList.remove("scale-50", "opacity-0", "blur-lg", "translate-y-6")
        }, 200)
    }, 0)
}

hideModal(true);

const settings = document.getElementById("settings")

settings.onclick = () => {
    showModal()
    
    modal.innerHTML = `
    <div class="w-full">
        <h2 class="w-full text-center text-2xl font-bold mb-4">
            Instillinger
        </h2>
        
        <h3 class="w-full mb-2 text-[12px] opacity-65 ml-1">
            bakgrunnsbilde
        </h3>
        
        <input class="p-3 rounded-md w-full bg-[#00000090] bg-opacity-65 backdrop-blur-sm border border-border outline-none placeholder-[#FFFFFF40]" placeholder="img url">
        </input>
        
        <h3 class="w-full mb-2 text-[12px] opacity-65 ml-1 mt-4">
            stasjon
        </h3>
        <select class="p-3 rounded-md bn-select w-full bg-[#00000090] bg-opacity-65 backdrop-blur-sm border border-border outline-none" data-station="" id="rtd-input-bbe4a910-caa3-4f34-9dd1-1d687ffd1df4-select-station">
            <option value="SV">Sandvika stasjon</option>
            <option value="ALA">Alna stasjon</option>
            <option value="ALV">Alvdal stasjon</option>
            <option value="ADL">Arendal stasjon</option>
            <option value="ARN">Arna stasjon</option>
            <option value="ASR">Asker stasjon</option>
            <option value="ASM">Askim stasjon</option>
            <option value="ATN">Atna stasjon</option>
            <option value="AUD">Audnedal stasjon</option>
            <option value="AUL">Auli stasjon</option>
            <option value="AUM">Auma stasjon</option>
            <option value="BMO">Bellingmo stasjon</option>
            <option value="BER">Berekvam stasjon</option>
            <option value="BRG">Bergen stasjon</option>
            <option value="BEG">Bergsgrav stasjon</option>
            <option value="BÅK">Berkåk stasjon</option>
            <option value="BST">Billingstad stasjon</option>
            <option value="BJE">Bjerka stasjon</option>
            <option value="BJO">Bjorli stasjon</option>
            <option value="BJF">Bjørnfjell stasjon / Bonjuvárri</option>
            <option value="BLK">Blaker stasjon</option>
            <option value="BLA">Blakstad stasjon</option>
            <option value="BLE">Bleiken stasjon</option>
            <option value="BLH">Blomheller stasjon</option>
            <option value="BLO">Blommenholm stasjon</option>
            <option value="BOD">Bodung stasjon</option>
            <option value="BO">Bodø stasjon / Bådåddjo</option>
            <option value="BOL">Bolstadøyri stasjon</option>
            <option value="BON">Bondivann stasjon</option>
            <option value="BRA">Brakerøya stasjon</option>
            <option value="BRL">Breland stasjon</option>
            <option value="BRD">Brumunddal stasjon</option>
            <option value="BRS">Brusand stasjon</option>
            <option value="BR">Bryn stasjon</option>
            <option value="BRY">Bryne stasjon</option>
            <option value="BÅS">Bråstad stasjon</option>
            <option value="BUL">Bulken stasjon</option>
            <option value="BØ">Bø stasjon</option>
            <option value="BØY">Bøylestad stasjon</option>
            <option value="CG">Charlottenberg stasjon (grensestasjon i Sverige)</option>
            <option value="DAL">Dal stasjon</option>
            <option value="DL">Dale stasjon</option>
            <option value="DAR">Darbu stasjon</option>
            <option value="DOM">Dombås stasjon</option>
            <option value="DOV">Dovre stasjon</option>
            <option value="DRM">Drammen stasjon</option>
            <option value="DRD">Drangedal stasjon</option>
            <option value="DVT">Drevvatn stasjon</option>
            <option value="DUN">Dunderland stasjon</option>
            <option value="EGS">Egersund stasjon</option>
            <option value="EBG">Eidsberg stasjon</option>
            <option value="EVL">Eidsvoll stasjon</option>
            <option value="EVV">Eidsvoll verk stasjon</option>
            <option value="EIN">Eina stasjon</option>
            <option value="ELV">Elverum stasjon</option>
            <option value="EVG">Evanger stasjon</option>
            <option value="EVE">Evenstad stasjon</option>
            <option value="FAU">Fauske stasjon / Fuossko</option>
            <option value="FET">Fetsund stasjon</option>
            <option value="FIN">Finse stasjon</option>
            <option value="FJE">Fjellhamar stasjon</option>
            <option value="FLA">Flaten stasjon</option>
            <option value="FLÅ">Flå stasjon</option>
            <option value="FM">Flåm stasjon</option>
            <option value="FRE">Fredrikstad stasjon</option>
            <option value="FRO">Frogner stasjon</option>
            <option value="FRL">Froland stasjon</option>
            <option value="GAN">Ganddal stasjon</option>
            <option value="GAU">Gausel stasjon</option>
            <option value="GLO">Geilo stasjon</option>
            <option value="GJÅ">Gjerdåker stasjon</option>
            <option value="GJE">Gjerstad stasjon</option>
            <option value="GJØ">Gjøvik stasjon</option>
            <option value="GOS">Glåmos stasjon / Kloemegen stasjovne</option>
            <option value="GOL">Gol stasjon</option>
            <option value="GRA">Gran stasjon</option>
            <option value="GRE">Grefsen stasjon</option>
            <option value="GUD">Greverud stasjon</option>
            <option value="GRG">Grong stasjon</option>
            <option value="GRO">Grorud stasjon</option>
            <option value="GRU">Grua stasjon</option>
            <option value="GU">Gudå stasjon</option>
            <option value="GHA">Gullhella stasjon</option>
            <option value="GUL">Gulskogen stasjon</option>
            <option value="GYL">Gyland stasjon</option>
            <option value="HAG">Haga stasjon</option>
            <option value="HAK">Hakadal stasjon</option>
            <option value="HLD">Halden stasjon</option>
            <option value="HAL">Hallingskeid stasjon</option>
            <option value="HDN">Haltdalen stasjon</option>
            <option value="HMR">Hamar stasjon</option>
            <option value="HAB">Hanaborg stasjon</option>
            <option value="HAN">Hanestad stasjon</option>
            <option value="HST">Harestua stasjon</option>
            <option value="HAR">Harran stasjon</option>
            <option value="HSR">Hauerseter stasjon</option>
            <option value="HAU">Haugastøl stasjon</option>
            <option value="HGA">Haugenstua stasjon</option>
            <option value="HRA">Hegra stasjon</option>
            <option value="HTO">Hauketo stasjon</option>
            <option value="HEG">Heggedal stasjon</option>
            <option value="HEI">Heia stasjon</option>
            <option value="HMD">Heimdal stasjon</option>
            <option value="HEL">Hell stasjon</option>
            <option value="HEV">Hellvik stasjon</option>
            <option value="HJN">Hjerkinn stasjon</option>
            <option value="HOK">Hokksund stasjon</option>
            <option value="HSD">Holmestrand stasjon</option>
            <option value="HMA">Holmlia stasjon</option>
            <option value="HMV">Hommelvik stasjon</option>
            <option value="HOI">Hovin stasjon</option>
            <option value="HSS">Hunderfossen stasjon</option>
            <option value="HVA">Hvalstad stasjon</option>
            <option value="HØN">Høn stasjon</option>
            <option value="HFS">Hønefoss stasjon</option>
            <option value="HVK">Høvik stasjon</option>
            <option value="HØB">Høybråten stasjon</option>
            <option value="HÅR">Håreina stasjon</option>
            <option value="ILS">Ilseng stasjon</option>
            <option value="JAR">Jaren stasjon</option>
            <option value="JEH">Jessheim stasjon</option>
            <option value="JØR">Jørstad stasjon</option>
            <option value="JÅT">Jåttåvågen stasjon</option>
            <option value="KAM">Kambo stasjon</option>
            <option value="KAT">Katterat stasjon / Gátterak</option>
            <option value="KJE">Kjelsås stasjon</option>
            <option value="KJF">Kjosfossen stasjon</option>
            <option value="KLP">Klepp stasjon</option>
            <option value="KLØ">Kløfta stasjon</option>
            <option value="KLV">Kløve stasjon</option>
            <option value="KNA">Knapstad stasjon</option>
            <option value="KOL">Kolbotn stasjon</option>
            <option value="KBG">Kongsberg stasjon</option>
            <option value="KVG">Kongsvinger stasjon</option>
            <option value="KVL">Kongsvoll stasjon</option>
            <option value="KOP">Koppang stasjon</option>
            <option value="KPR">Kopperå stasjon</option>
            <option value="KOT">Kotsøy stasjon</option>
            <option value="KRS">Kristiansand stasjon</option>
            <option value="KRÅ">Kråkstad stasjon</option>
            <option value="KVA">Kvam stasjon</option>
            <option value="KVI">Kvitfjell stasjon</option>
            <option value="KVÅ">Kvål stasjon</option>
            <option value="NNN">Lademoen stasjon</option>
            <option value="LAN">Langhus stasjon</option>
            <option value="LLE">Langlete stasjon</option>
            <option value="LVK">Larvik stasjon</option>
            <option value="LSM">Lassemoen stasjon</option>
            <option value="LEA">Leangen stasjon</option>
            <option value="LSD">Leirsund stasjon</option>
            <option value="LER">Ler stasjon</option>
            <option value="LRK">Lerkendal stasjon</option>
            <option value="LES">Lesja stasjon</option>
            <option value="LSV">Lesjaverk stasjon</option>
            <option value="LEV">Levanger stasjon</option>
            <option value="LIE">Lier stasjon</option>
            <option value="LDM">Lilleby stasjon</option>
            <option value="LHM">Lillehammer stasjon</option>
            <option value="LLS">Lillestrøm stasjon</option>
            <option value="LBG">Lindeberg stasjon</option>
            <option value="LJA">Ljan stasjon</option>
            <option value="LJB">Ljosanbotn stasjon</option>
            <option value="LMO">Lundamo stasjon</option>
            <option value="LUN">Lunde stasjon</option>
            <option value="LND">Lunden stasjon</option>
            <option value="LU">Lunner stasjon</option>
            <option value="LYS">Lysaker stasjon</option>
            <option value="LØN">Lønsdal stasjon / Luonosvágge (Lønsdalen)</option>
            <option value="LØR">Lørenskog stasjon</option>
            <option value="LØT">Løten stasjon</option>
            <option value="MAJ">Majavatn stasjon / Maajehjaevrie (Majavatnet)</option>
            <option value="SVN">Marienborg stasjon</option>
            <option value="MRO">Mariero stasjon</option>
            <option value="MDL">Marnardal stasjon</option>
            <option value="MSK">Melhus stasjon</option>
            <option value="MER">Meråker stasjon</option>
            <option value="MFJ">Mjølfjell stasjon</option>
            <option value="MJD">Mjøndalen stasjon</option>
            <option value="MO">Mo i Rana stasjon / Måefie</option>
            <option value="MLV">Moelv stasjon</option>
            <option value="MOI">Moi stasjon</option>
            <option value="MSJ">Mosjøen stasjon / Mussere</option>
            <option value="MOS">Moss stasjon</option>
            <option value="MVT">Movatn stasjon</option>
            <option value="MYR">Myrdal stasjon</option>
            <option value="MYV">Myrvoll stasjon</option>
            <option value="MYS">Mysen stasjon</option>
            <option value="MØR">Mørkved stasjon</option>
            <option value="NSK">Namsskogan stasjon</option>
            <option value="NK">Narvik stasjon / Áhkánjárga</option>
            <option value="NTH">Nationaltheatret stasjon</option>
            <option value="NEL">Nelaug stasjon</option>
            <option value="NER">Nerdrum stasjon</option>
            <option value="NES">Nesbyen stasjon</option>
            <option value="NVT">Neslandsvatn stasjon</option>
            <option value="NTR">Nisterud stasjon</option>
            <option value="NIT">Nittedal stasjon</option>
            <option value="NDL">Nodeland stasjon</option>
            <option value="NGU">Nordagutu stasjon</option>
            <option value="NBY">Nordby stasjon</option>
            <option value="NST">Nordstrand stasjon</option>
            <option value="NTD">Notodden stasjon</option>
            <option value="NYD">Nydalen stasjon</option>
            <option value="NYL">Nyland stasjon</option>
            <option value="NBØ">Nærbø stasjon</option>
            <option value="OGN">Ogna stasjon</option>
            <option value="OPD">Oppdal stasjon</option>
            <option value="OPG">Oppegård stasjon</option>
            <option value="OPH">Opphus stasjon</option>
            <option value="OS">Os stasjon</option>
            <option value="GAR">Oslo lufthavn Gardermoen stasjon</option>
            <option value="OSL">Oslo S</option>
            <option value="OTR">Oteråga stasjon</option>
            <option value="OTA">Otta stasjon</option>
            <option value="PAR">Paradis stasjon</option>
            <option value="PG">Porsgrunn stasjon</option>
            <option value="RST">Rakkestad stasjon</option>
            <option value="RHM">Ranheim stasjon</option>
            <option value="RAU">Raufoss stasjon</option>
            <option value="RMG">Reimegrend stasjon</option>
            <option value="RVO">Reinsvoll stasjon</option>
            <option value="RNU">Reinunga stasjon</option>
            <option value="REI">Reitan stasjon</option>
            <option value="REN">Rena stasjon</option>
            <option value="RGS">Riksgränsen holdeplass (grensestasjon i Sverige)</option>
            <option value="RBU">Ringebu stasjon</option>
            <option value="RIS">Rise stasjon</option>
            <option value="ROA">Roa stasjon</option>
            <option value="ROG">Rognan stasjon</option>
            <option value="RGN">Rognes stasjon</option>
            <option value="ROM">Rombak stasjon / Ruoppak</option>
            <option value="RLA">Ronglan stasjon</option>
            <option value="RSH">Rosenholm stasjon</option>
            <option value="ROT">Rotvoll stasjon</option>
            <option value="RYG">Rygge stasjon</option>
            <option value="RØK">Røkland stasjon / Rævkka</option>
            <option value="RØ">Røra stasjon</option>
            <option value="ROS">Røros stasjon / Plaassjan stasjovne</option>
            <option value="EBE">Røstad stasjon</option>
            <option value="RØY">Røyken stasjon</option>
            <option value="RÅD">Råde stasjon</option>
            <option value="RFS">Rånåsfoss stasjon</option>
            <option value="SDA">Sagdalen stasjon</option>
            <option value="SND">Sande stasjon</option>
            <option value="SFJ">Sandefjord stasjon</option>
            <option value="SSE">Sandnes sentrum stasjon</option>
            <option value="SBO">Sarpsborg stasjon</option>
            <option value="SGR">Seimsgrend stasjon</option>
            <option value="SLB">Selsbakk stasjon</option>
            <option value="SIN">Singsås stasjon</option>
            <option value="SIR">Sira stasjon</option>
            <option value="SVÅ">Sirevåg stasjon</option>
            <option value="SKS">Skansen stasjon</option>
            <option value="SKA">Skarnes stasjon</option>
            <option value="SKV">Skatval stasjon</option>
            <option value="SAS">Skeiane stasjon</option>
            <option value="SKI">Ski stasjon</option>
            <option value="SKN">Skien stasjon</option>
            <option value="SPL">Skiple stasjon</option>
            <option value="SGN">Skogn stasjon</option>
            <option value="SEG">Skonseng stasjon</option>
            <option value="SKP">Skoppum stasjon</option>
            <option value="SBU">Skotbu stasjon</option>
            <option value="SKØ">Skøyen stasjon</option>
            <option value="SLE">Slependen stasjon</option>
            <option value="SLU">Slitu stasjon</option>
            <option value="SNA">Snartemo stasjon</option>
            <option value="SNI">Snippen stasjon</option>
            <option value="SNÅ">Snåsa stasjon / Snåase stasjovne</option>
            <option value="SOL">Solbråtan stasjon</option>
            <option value="SON">Sonsveien stasjon</option>
            <option value="SPB">Sparbu stasjon</option>
            <option value="SPI">Spikkestad stasjon</option>
            <option value="SPG">Spydeberg stasjon</option>
            <option value="STB">Stabekk stasjon</option>
            <option value="STA">Stai stasjon</option>
            <option value="STG">Stange stasjon</option>
            <option value="STH">Stanghelle stasjon</option>
            <option value="SGM">Starrgrasmyra stasjon</option>
            <option value="STV">Stavanger stasjon</option>
            <option value="SBG">Steinberg stasjon</option>
            <option value="STK">Steinkjer stasjon</option>
            <option value="SNV">Steinvik stasjon</option>
            <option value="STJ">Stjørdal stasjon</option>
            <option value="SOA">Stoa stasjon</option>
            <option value="SKK">Stokke stasjon</option>
            <option value="STO">Storekvina stasjon</option>
            <option value="STR">Storlien stasjon (grensestasjon i Sverige)</option>
            <option value="SY">Stryken stasjon</option>
            <option value="STN">Strømmen stasjon</option>
            <option value="STØ">Støren stasjon</option>
            <option value="SVI">Svingen stasjon</option>
            <option value="SØR">Sørumsand stasjon</option>
            <option value="SØS">Søsterbekk stasjon</option>
            <option value="TAN">Tangen stasjon</option>
            <option value="TOL">Tolga stasjon</option>
            <option value="TOM">Tomter stasjon</option>
            <option value="TOR">Torp stasjon</option>
            <option value="TRD">Trengereid stasjon</option>
            <option value="TRO">Trofors stasjon</option>
            <option value="VÆR">Trondheim Lufthavn Værnes stasjon</option>
            <option value="TND">Trondheim S</option>
            <option value="TRY">Trykkerud stasjon</option>
            <option value="TUE">Tuen stasjon</option>
            <option value="TVL">Tverlandet stasjon</option>
            <option value="TYN">Tynset stasjon</option>
            <option value="TBG">Tønsberg stasjon</option>
            <option value="TØY">Tøyen stasjon</option>
            <option value="UPS">Upsete stasjon</option>
            <option value="URD">Urdland stasjon</option>
            <option value="UST">Ustaoset stasjon</option>
            <option value="VAD">Vaksdal stasjon</option>
            <option value="VAK">Vakås stasjon</option>
            <option value="VAL">Valnesfjord stasjon</option>
            <option value="VHG">Varhaug stasjon</option>
            <option value="VAR">Varingskollen stasjon</option>
            <option value="VTH">Vatnahalsen stasjon</option>
            <option value="VGH">Vegårshei stasjon</option>
            <option value="VNL">Vennesla stasjon</option>
            <option value="VDL">Verdal stasjon</option>
            <option value="VBY">Vestby stasjon</option>
            <option value="VFS">Vestfossen stasjon</option>
            <option value="VEV">Vevelstad stasjon</option>
            <option value="VRN">Vieren stasjon</option>
            <option value="VIG">Vigrestad stasjon</option>
            <option value="VKS">Vikersund stasjon</option>
            <option value="VHR">Vikhammer stasjon</option>
            <option value="VIN">Vinstra stasjon</option>
            <option value="VTS">Viul stasjon</option>
            <option value="VOS">Voss stasjon</option>
            <option value="YGH">Ygre stasjon</option>
            <option value="ØKP">Øksnavadporten stasjon</option>
            <option value="ØBG">Ørneberget stasjon</option>
            <option value="ÅL">Ål stasjon</option>
            <option value="ÅLN">Ålen stasjon</option>
            <option value="ÅND">Åndalsnes stasjon</option>
            <option value="ÅBY">Åneby stasjon</option>
            <option value="ÅRN">Årnes stasjon</option>
            <option value="ÅS">Ås stasjon</option>
            <option value="ÅSE">Åsen stasjon</option>
        </select>

        <button class="w-full p-3 mt-12 rounded-md bg-[#00000090] hover:scale-[101%] active:scale-[99%] duration-150 bg-opacity-65 backdrop-blur-sm border border-border outline-none text-white font-bold">
            Lagre
        </button>
    </div>

    ` 
}

//settings.onclick()