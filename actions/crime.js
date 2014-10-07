
chrome.runtime.sendMessage({ type: 'getActionData' }, function(data) {

    var error = bot.general.checkError();

    var action = {};
    action.action = 'crime';

    action.actionData = {};
    action.actionData.crimeId = data.crimeId;

    action.seconds = 60 * 5; // 5 minuts

    if (data.loads != 0 && bot.general.get('a') == 'mod_crim_crimes') {

        if (error == null) {
            if (bot.general.checkCaptcha()) {
                $('input[name="crime"][value="' + data.crimeId + '"]').click();

                bot.general.solveCaptcha();
            } else {
                chrome.runtime.sendMessage({ type: 'actionResponse', success: true });
            }
        } else {
            bot.general.generalErrors(error, function(error) {

                switch(error) {
                    case 'paidJail':
                        action.seconds = 10;

                        chrome.runtime.sendMessage({ type: 'actionResponse', success: false, action: action });
                        break;

                    case '6952b9de5e127ee15478901c0a94e824':
                        //Police is still searching for you, wait seconds provided by code.
                        action.seconds = bot.general.getSecondsRemaining();

                        chrome.runtime.sendMessage({ type: 'actionResponse', success: false, action: action });
                        break;

                    default:
                        console.log('Did not catch error in action: ' + error);

                        chrome.runtime.sendMessage({ type: 'actionResponse', success: true });
                        break;
                }

            });
        }

    } else {
        window.location = 'http://www.bandias.nl/index.php?a=mod_crim_crimes';
    }
});