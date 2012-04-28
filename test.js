chrome.extension.onRequest.addListener(function(request, sender, callback)
{
    if (request.action == 'getSource')
    {
        callback(document.documentElement.outerHTML);
    }
});