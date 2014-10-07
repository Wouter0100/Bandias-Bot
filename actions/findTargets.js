//25

var ownPower = 0;

chrome.runtime.sendMessage({ type: 'getActionData' }, function(data) {
    $.get('http://www.bandias.nl/index.php', { a: 'members', f: 'details', id: bot.general.getUserId()}, function(html) {

        ownPower = bot.general.totalPower(html);
        console.log(ownPower);
        newSearch(20, data.startPage, function (id, username) {
            console.log('new search callback');

            $.get('http://www.bandias.nl/index.php', { a: 'friends', f: 'targets_add', id: id });
        }, function () {
            chrome.runtime.sendMessage({ type: 'actionResponse', success: true });
        });
    });
});

function requestList(page, callback) {
    console.log('request list');

    $.get('http://www.bandias.nl/ajax.php', { a: 'members', 'f': 'ajax_money', page_money: page }, function(html) {
        callback(html);
    });
}

function newSearch(count, page, callback, finishCallback) {
    requestList(page, function(html) {

        console.log('Resultaat voor pagina ' + page);

        var totalUsers = 0;
        var readyUsers = 0;

        $('tr .temp_user_loader', html).each(function() {

            totalUsers++;

            var username = $(this).children('.temp_user_name').html();
            var id = bot.general.findInText($(this).parent().attr('href') + 'lol', '&f=details&id=', 'lol');

            $.get('http://www.bandias.nl/index.php', { a: 'members', f: 'details', id: id}, function(html) {

                readyUsers++;

                var totalPower = bot.general.totalPower(html) - ownPower;

                if (totalPower < 0) {
                    count--;

                    callback(id, username);
                }

                if (totalPower <= readyUsers) {
                    if (count != 0) {
                        console.log('Nog te gaan: ' + count);

                        newSearch(count, page + 1, callback, finishCallback);
                    } else {
                        finishCallback();
                    }
                }
            });
        });


    });
}