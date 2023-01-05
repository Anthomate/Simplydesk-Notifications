/* ===================================================================================

Initialisation des paramètres

 =================================================================================== */

let lastTicketCreationDate ="2012-01-01T00:00:00"; // On initialise une première fois une date de dernière requête.


/* ===================================================================================

Initialisation de l'alarm

 =================================================================================== */

let alarmPeriodInMinutes = 0.2

/* ===================================================================================

Récupération de l'url de l'environnement & récupération du basic token

 =================================================================================== */

let APIUrl = '';
let basicToken = '';
let storageCache = {};
let url = '';
function getOptions() {
    chrome.storage.sync.get(null, function (data) {

        storageCache = data;

        APIUrl = storageCache['APIUrl'];
        basicToken = storageCache['basicToken'];

        console.log('API Url : ' + APIUrl);
        console.log('Basic Token : ' + basicToken);

        url = APIUrl.replace('-api', '') // On supprime le -api de l'url api pour obtenir l'url de l'environnement

        console.log('URL : ' + url);

    });

    console.log('Options set.');
}

/* ===================================================================================

Création de l'alarm

 =================================================================================== */

function createAlarm() {

    chrome.alarms.create("myAlarm", {
        periodInMinutes: alarmPeriodInMinutes
    });

    console.log("[Alarm] - Created - periodInMinutes: " + alarmPeriodInMinutes);
}

createAlarm();

chrome.alarms.onAlarm.addListener(
    () => {
        getOptions();

        if (APIUrl !== '' & basicToken !== '') {
            getOpenTicket();
        }

    }
);

/* ===================================================================================

Requête getOpenTicket

 =================================================================================== */

function getOpenTicket() {

    let myHeaders = new Headers();

    myHeaders.append("Authorization", "Basic " + basicToken);

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    console.log("[getOpenTicket] - Fetch open tickets");

    fetch(APIUrl + "/IncidentManagement.svc/GetOpenTickets?p=1&datemin=" + lastTicketCreationDate , requestOptions)
        .then(response => response.json())
        .then(result => {

            /* ===================================================================================

            Je parcours le résultat de ma requête et sauvegarde la date de création de ticket la plus récente

                - Si la date de création d'un ticket est plus récente que lastTicketCreationDate alors
                    => J'enregistre la nouvelle lastTicketCreationDate
                    => J'envoie un notification
                - Sinon on recommence

            =================================================================================== */

            for (let i = 0 ; i < result.length; i++) {

                if (lastTicketCreationDate < result[i].RequestDate) {

                    lastTicketCreationDate = result[i].RequestDate;

                    let notificationsMessage = result[i].Number + " - " + result[i].Subject;

                    console.log("New date of last ticket creation initialized to " + lastTicketCreationDate);

                    chrome.notifications.create('PCICustomersNotification' + result[i].Number, {
                        type: "basic",
                        iconUrl: 'ressources/img/icon.png',
                        title: 'Nouveau Ticket',
                        message: notificationsMessage,
                        priority: 1,
                        isClickable: true
                    });

                    console.log('Notification created.');

                    chrome.notifications.onClicked.addListener(function() {

                        console.log("User clicked on the notification.")
                        chrome.tabs.create({ url: url + "/IncidentManagement/Ticket/Edit/" + result[i].Number });
                    });

                }else {
                    console.log('No new tickets.')
                }
            }
        })
        .catch(error => console.log('error', error));

}



