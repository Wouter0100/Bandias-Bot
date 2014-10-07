var console = chrome.extension.getBackgroundPage().console;

$(function() {
    $('#attack').on('click', function() {
        var targetId = $('#targetId').val();

        if (/\d/.test(targetId)) {
            var action = {};
            action.action = 'attack';
            action.seconds = 0;

            action.actionData = {};
            action.actionData.targetId = targetId;

            chrome.runtime.sendMessage({ type: 'newAction', action: action });
        }
    });

    $('#attackByTargets').on('click', function() {

        var action = {};
        action.action = 'attackByTargets';
        action.seconds = 0;

        chrome.runtime.sendMessage({ type: 'newAction', action: action });
    });

	$('#open_bandias').on('click', function() {
		chrome.runtime.sendMessage({ type: 'openBandiasTab' });
	});
});
