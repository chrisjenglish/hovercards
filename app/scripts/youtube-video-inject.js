'use strict';

define('youtube-video-inject', ['jquery', 'youtube-video-button', 'trigger'], function($, youtubeVideoButton, trigger) {
    function injectButtonOnPlayer(body, docURL) {
        /* globals purl:true */
        youtubeVideoButton(body.children('#player'), purl(docURL).segment(-1)).prependTo(body);
    }

    function injectButtonsOnObjectsAndEmbeds(body) {
        body
            .find('object[data*="youtube.com/v/"], embed[src*="youtube.com/v/"]')
            .each(function() {
                /* globals purl:true */
                var video = $(this);
                youtubeVideoButton(video, purl(video.prop('data') || video.prop('src')).segment(-1)).insertBefore(video);
            });
    }

    function injectTriggersOnLinks(body, docURL) {
        var youtubeLinkSelector = 'a[href*="youtube.com/watch"]';
        if (purl(docURL).attr('host') === 'www.youtube.com') {
            youtubeLinkSelector += ',a[href^="/watch"]';
        }
        body
            .find(youtubeLinkSelector)
            .each(function() {
                /* globals purl:true */
                var link = $(this);
                trigger(link, 'youtube-video', purl(link.attr('href')).param('v'));
            });
        body
            .find('a[href*="youtu.be/"]')
            .each(function() {
                /* globals purl:true */
                var link = $(this);
                trigger(link, 'youtube-video', purl(link.attr('href')).segment(-1));
            });
    }

    function youtubeVideoInject(body, context, docURL) {
        if (!body) {
            body = 'body';
        }
        if (!docURL) {
            docURL = document.URL;
        }
        body = $(body);
        switch (context) {
            case '#player':
                youtubeVideoInject.injectButtonOnPlayer(body, docURL);
                break;
            case 'objects':
                youtubeVideoInject.injectButtonsOnObjectsAndEmbeds(body);
                break;
            default:
                youtubeVideoInject.injectButtonsOnObjectsAndEmbeds(body);
                youtubeVideoInject.injectTriggersOnLinks(body, docURL);
                break;
        }
    }

    youtubeVideoInject.injectButtonOnPlayer            = injectButtonOnPlayer;
    youtubeVideoInject.injectButtonsOnObjectsAndEmbeds = injectButtonsOnObjectsAndEmbeds;
    youtubeVideoInject.injectTriggersOnLinks           = injectTriggersOnLinks;

    return youtubeVideoInject;
});
