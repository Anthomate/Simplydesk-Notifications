/* ===================================================================================

On sauvegarde les options dans chrome.storage

 =================================================================================== */
function save_options() {

    let APIUrl = document.getElementById('APIUrl').value;
    let username = document.getElementById('username').value;
    let password = document.getElementById('pass').value;

    let basicToken = btoa(username + ":" + password);
    console.log('BasicToken généré.');


    chrome.storage.sync.set({
        'APIUrl': APIUrl,
        'basicToken': basicToken
    });

    console.log('Options sauvegardées.');

    // On notifie l'utilisateur que les changements sont pris en compte

    let status = document.getElementById('status');

    status.textContent = 'Options sauvegardées.';

    setTimeout(function() {

        status.textContent = '';

        }, 750);

}

/* ===================================================================================

On restaure les options dans chrome.storage

 =================================================================================== */

function restore_options() {

    localStorage.getItem('APIUrl');
    localStorage.getItem('basicToken');

}

document.addEventListener('DOMContentLoaded', restore_options);

document.getElementById('save').addEventListener('click', save_options);