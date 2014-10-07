
chrome.runtime.sendMessage({ type: 'getActionData' }, function(data) {

    var error = bot.general.checkError();

    var action = {};
    action.action = 'attack';

    action.actionData = {};
    action.actionData.targetId = data.targetId;

    action.seconds = 60 * 15; // 15 minuts

    if (data.loads != 0 && bot.general.get('a') == 'mod_prof_attack') {

            if (error == null) {
                if (bot.general.checkCaptcha()) {
                    bot.general.solveCaptcha();
                } else {
                    action.seconds = 26;

                    action.timeoutBeforeSame = 20;

                    chrome.runtime.sendMessage({ type: 'actionResponse', success: false, action: action });
                }

            } else {
                bot.general.generalErrors(error, function(error) {

                    switch(error) {
                        case 'paidJail':
                            action.seconds = 10;

                            chrome.runtime.sendMessage({ type: 'actionResponse', success: false, action: action });
                            break;

                        case '7b43aae4399a0952efdb850f556618ce':
                            //Already attacked 15 times this hour, waiting 15m
                            chrome.runtime.sendMessage({ type: 'actionResponse', success: false, action: action });
                            break;

                        case '9f70930cf681ae946bedd79aab090eca':
                            //Person is death, finished!
                            chrome.runtime.sendMessage({ type: 'actionResponse', success: true });
                            break;

                        default:
                            console.log('Did not catch error in action: ' + error);

                            chrome.runtime.sendMessage({ type: 'actionResponse', success: true });
                            break;
                    }

                });
            }

    } else {
        window.location = 'http://www.bandias.nl/index.php?a=mod_prof_attack&attack=' + data.targetId;
    }
});