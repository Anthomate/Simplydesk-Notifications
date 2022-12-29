function createAlarm() {
    console.log("[Alarm] - Creating...");

    chrome.alarms.create("myAlarm", {
        delayInMinutes: 0.1, periodInMinutes: 0.1
    });

    console.log("[Alarm] - Created !");
}

createAlarm();

chrome.alarms.onAlarm.addListener(
    () => {

        getOpenTicket();

        chrome.notifications.create('notifications', {
            type: "basic",
            iconUrl: 'ressources/img/icon.png',
            title: 'Nouveau PCI Customers !',
            message: 'Sujet du ticket',
            priority: 1
        })
    }
);

/* ===================================================================================

Création des variables de date minimum et date maximum pour la requête getOpenTickets.

Pour la date maximum, on récupère la date au moment de l'execution de la requête.

Pour la date minimum, on récupère la date de dernière execution de la requête.

 =================================================================================== */

let lastRequestDate = "2012-01-01T00:00:00"; // On initialise une première fois une date de dernière requête.
function getDateMax() {
    const date = new Date().toISOString(); // On récupère la date actuelle au format ISO
    return date;
}

function getDateMin() {
    lastRequestDate = getDateMax(); // On attribut à lastRequestDate, la date à laquelle on a effectué la dernière requête.
}

/* ===================================================================================

On va effectuer la requête getOpenTicket proposée par l'API de SimplyDesk.

Pour la date minimum, on utilise lastRequestDate. (initialisée au 01/01/2012 la première fois).

Pour la date maximum, on utilise la valeur retournée par la fonction getDateMax().

 =================================================================================== */

function getOpenTicket() {

    getDateMax(); // On récupère la date actuelle

    console.log("Date actuelle : " + getDateMax());
    console.log("Date de dernière requête : " + lastRequestDate);

    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic YW50aG9ueUFQSTpyWmxadDFBV2o3NVg3ZW9tdkZrcQ==");

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("https://pcicustomers-api.simplydesk.fr/IncidentManagement.svc/GetOpenTickets?p=1&datemin=" + lastRequestDate + "&datemax=" + getDateMax(), requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

    getDateMin(); // On enrgistre la date à laquelle on a effectué la requête
}