
if (bot.general.get('a') == 'friends' && bot.general.get('open_tab') == 'targets') {

    $('#targets tr:not(:first)').find('td:eq(1)').each(function() {
        var targetId = bot.general.findInText($(this).children('td a').attr('href') + 'lol', '&f=details&id=', 'lol');

        var action = {};
        action.action = 'attack';
        action.seconds = 0;

        action.actionData = {};
        action.actionData.targetId = targetId;

        chrome.runtime.sendMessage({ type: 'newAction', action: action });
    });

    chrome.runtime.sendMessage({ type: 'actionResponse', success: true })
} else {
    window.location = 'http://www.bandias.nl/index.php?a=friends&open_tab=targets';
}