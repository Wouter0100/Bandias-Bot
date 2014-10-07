var bandiasTabId = null;

var actions = [];

var runningAction = null;

var timeoutForActions = {};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    console.log('On Message');
    console.log(request);

	if (request.type == 'openBandiasTab'){

		if (bandiasTabId == null) {
			var createProperties = {};
			createProperties.url = 'http://bandias.nl/';

			chrome.tabs.create(createProperties, function(tab) {
				bandiasTabId = tab.id;
			});
		} else {
			var updateProperties = {};
			updateProperties.active = true;

			chrome.tabs.update(bandiasTabId, updateProperties);
		}

		return true;

	} else if (request.type == 'getActionData') {

        sendResponse(runningAction.actionData);

    } else if (request.type == 'newAction') {

        actions.push(request.action);

    } else if (request.type == 'actionResponse') {

        if (!request.success) {
            actions.unshift(request.action);
        }

        if (typeof request.action != 'undefined') {
            if (typeof request.action.timeoutBeforeSame != 'undefined' && request.action.timeoutBeforeSame != 0) {
                timeoutForActions[request.action.action] = request.action.timeoutBeforeSame;

                delete request.action.timeoutBeforeSame;
            }
        }

        runningAction = null;

    }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
	if (bandiasTabId == tabId) {

		chrome.tabs.executeScript(tabId, {
			code: 'document.title = "Bandias Bot - Waiting";'
		});

        if (changeInfo.status == 'complete') {
            checkForAction(true);
        }
	}
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
	if (tabId == bandiasTabId) {
		bandiasTabId = null;

        actions = [];
        runningAction = null;
	}
});

setInterval(function() {
    if (bandiasTabId != null) {
        checkForAction(false);
    }
}, 1000);

function checkForAction(pageLoad) {

    if (!pageLoad) {
        actions.forEach(function(v, k) {
            actions[k].seconds = ((v.seconds > 0) ? v.seconds - 1 : 0);
        });

        $.each(timeoutForActions, function(k, v) {
            timeoutForActions[k] = ((v > 0) ? v -1 : 0);
        });
    }

    if (runningAction != null) {

        if (pageLoad) {
            console.log('Start runningAction after page refresh');

            runningAction.actionData.loads++;

            chrome.tabs.executeScript(bandiasTabId, {
                code: 'document.title = "Bandias Bot - ' + nameToReadable(runningAction.action) + '";'
            });

            runAction(runningAction);
        }

        return;
    }

    if (!pageLoad && runningAction == null) {
        if (actions.length > 0) {
            var actionToRun = null;

            actions.forEach(function(v, k) {
                if (v.seconds == 0) {
                    if (typeof timeoutForActions[v.action] == 'undefined' || timeoutForActions[v.action] <= 0) {
                        actionToRun = k;
                    }
                }
            })

            if (actionToRun != null) {
                console.log('Page isn\'t loaded and a action is zero, starting new action');

                runningAction = actions[actionToRun];
                delete actions[actionToRun];

                if (typeof runningAction.actionData == 'undefined') {
                    runningAction.actionData = {};
                }

                runningAction.actionData.loads = 0;

                console.log(actions);

                chrome.tabs.executeScript(bandiasTabId, {
                    code: 'document.title = "Bandias Bot - ' + nameToReadable(runningAction.action) + '";'
                });

                runAction(runningAction);
            }
        }
    }
}

function runAction(action) {
    console.log('Starting action');
    console.log(action);

    chrome.tabs.executeScript(bandiasTabId, {
        file: 'actions/' + action['action'] + '.js'
    });
}

function nameToReadable(name) {
    return name.substring(0, 1).toUpperCase() + name.replace(/([A-Z])/g, ' $1').trim().substring(1);
}