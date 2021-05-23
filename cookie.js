var ready = (callback) => {
    if (document.readyState != "loading") callback();
    else document.addEventListener("DOMContentLoaded", callback);
}

var cookieBannerHtml = '<div id="cookie__banner" style="position:fixed;width:100%;height:100%;left:0;top:0;background:rgba(0,0,0,0.8);z-index:9999">\n' +
    '    <div class="row h-100 align-items-center">\n' +
    '        <div class="col-md-7 mx-auto">\n' +
    '            <div class="cookie-banner" style="background:#FFF;padding:1rem;margin:1rem">\n' +
    '                <h3 id="banner__header"></h3>\n' +
    '                <p id="banner__text"></p>\n' +
    '                <div id="cookie__groups"></div>\n' +
    '                <div id="cookie__buttons">\n' +
    '                    <div class="row"></div>\n' +
    '                </div>\n' +
    '                <div class="row">\n' +
    '                    <div class="col-md-6">\n' +
    '                        <div id="cookielinks__start"></div>\n' +
    '                    </div>\n' +
    '                    <div class="col-md-6">\n' +
    '                        <div id="cookielinks__end"></div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>';

var cookieRevokeHtml = '<button id="cookie__revoke">\n' +
    '    🍪 Cookie-Einstellungen\n' +
    '</button>';

function nowPlusOneYear() {
    var oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    return oneYearFromNow;
}

function getCookie(cookiename) {
    if (typeof(cookiename) == 'string' && cookiename != '') {
        const cookies = document.cookie.split(';');
        for (i = 0; i < cookies.length; i++) {
            if (cookies[i].trim().startsWith(cookiename)) {
                return cookies[i].split('=')[1];
            }
        }
    }
    return null;
}

function setCookie(cookie, value, expires) {
    document.cookie = cookie + '=' + value + ';expires=' + expires;
}

function cookieWorkerProcess(ev) {
    var tagName = ev.tagName
    if(tagName == 'SCRIPT') {
        var scriptElement = document.createElement('script');
        if(ev.hasAttribute('src')) {
            var attribute = ev.getAttribute('src');
            scriptElement.src = attribute;
        } else {
            scriptElement.innerHTML = ev.innerHTML;
        }
        scriptElement.setAttribute('data-cookie', ev.getAttribute('data-cookie'));
        ev.after(scriptElement);
        ev.remove();
    }
    if(tagName == 'IFRAME') {
        ev.setAttribute('src', ev.getAttribute('cookie-src'));
    }
}

function cookieWorker(ev, cookie) {
    if(cookie == ev.getAttribute('data-cookie')) {
        cookieWorkerProcess(ev);
    } else if (ev.getAttribute('data-cookie') == 'essential') {
        cookieWorkerProcess(ev);
    } else if (cookie == 'all') {
        cookieWorkerProcess(ev);
    }
}

function processCookieDependentResources() {
    var cookieValue = getCookie('_cs');
    var a = document.querySelectorAll('[data-cookie]');
    for (var i in a) if (a.hasOwnProperty(i)) {
        var htmlElement = a[i];
        if(cookieValue.includes(',')) {
            var cookiesArray = cookieValue.split(',');
            cookiesArray.forEach((item, j) => cookieWorker(a[i], `${item}`));
        } else {
            cookieWorker(a[i], `${cookieValue}`);
        }
    }

}

if(!getCookie('_cs') || getCookie('_cs') == 'revoked') {
    document.write(cookieBannerHtml);
} else {
    document.write(cookieRevokeHtml);
    processCookieDependentResources();
}

var cookieRevoker = document.getElementById('cookie__revoke');
if (cookieRevoker !== null) {
    document.getElementById('cookie__revoke').addEventListener('click', (e) => {
        setCookie('_cs', 'revoked', nowPlusOneYear());
        location.reload();
    });
}

ready(() => {
    async function fetchCookieMetadataAsync() {
        var lang = document.documentElement.lang;
        var fetchFile = cookieJsonPath + lang + '.cookie.json';
        const response = await fetch(fetchFile);
        var metadata = await response.json();
        document.getElementById('banner__header').innerText = metadata.header;
        document.getElementById('banner__text').innerText = metadata.text;
        var cookieButtons = document.getElementById('cookie__buttons').querySelector('.row');
        var cookieLinksStart = document.getElementById('cookielinks__start');
        var cookieLinksEnd = document.getElementById('cookielinks__end');
        var cookieGroups = document.getElementById('cookie__groups');
        for (var button in metadata.buttons) {
            if(button != 'selected') {
                var newCookieButtonCol = document.createElement('div');
                newCookieButtonCol.className = 'col-md-6';
                var newCookieButton = document.createElement('button');
                var className = 'btn btn-primary w-100 cookie-button';
                if (button == 'essential') {
                    className = 'btn btn-outline-primary w-100 cookie-button';
                }
                newCookieButton.className = className;
                newCookieButton.setAttribute('id', 'button__' + button);
                newCookieButton.appendChild(document.createTextNode(metadata.buttons[button].label));
                newCookieButtonCol.appendChild(newCookieButton);
                cookieButtons.appendChild(newCookieButtonCol);
            }
            if(button == 'selected') {
                var newCookieButton = document.createElement('button');
                newCookieButton.className = 'btn btn-link cookie-link';
                newCookieButton.setAttribute('id', 'button__' + button);
                newCookieButton.setAttribute('style', 'display:none');
                newCookieButton.appendChild(document.createTextNode(metadata.buttons[button].label));
                cookieLinksStart.appendChild(newCookieButton);
            }
        }
        for (var link in metadata.links) {
            var newCookieLink = document.createElement('a');
            newCookieLink.className = 'btn btn-link cookie-link';
            newCookieLink.setAttribute('id', 'link__' + link);
            newCookieLink.appendChild(document.createTextNode(metadata.links[link].label));
            newCookieLink.setAttribute('href', metadata.links[link].href);
            cookieLinksEnd.appendChild(newCookieLink);
        }
        for (var cookiegroup in metadata.cookiegroups) {
            var newCookieGroupWrapper = document.createElement('div');
            newCookieGroupWrapper.className = 'cookie-group'
            newCookieGroupWrapper.setAttribute('id', 'cookiegroup__' + cookiegroup);
            var newCookieGroupRow = document.createElement('div');
            newCookieGroupRow.className = 'row align-items-center'
            var newCookieGroupColStart = document.createElement('div');
            newCookieGroupColStart.className = 'col-md-9'
            var newCookieGroupColEnd = document.createElement('div');
            newCookieGroupColEnd.className = 'col-md-3'
            newCookieGroupColStart.appendChild(document.createTextNode(metadata.cookiegroups[cookiegroup].label));
            if(cookiegroup == 'essential') {
                newCookieGroupColEnd.innerHTML = '<div class="form-check"><input class="form-check-input" type="checkbox" value="" id="checkbox__essential" checked disabled></div>';
            } else {
                newCookieGroupColEnd.innerHTML = '<div class="form-check"><input class="form-check-input" type="checkbox" value="" data-cookiegroup="' + cookiegroup + '" id="checkbox__' + cookiegroup + '"></div>';
            }
            newCookieGroupWrapper.appendChild(newCookieGroupRow);
            newCookieGroupRow.appendChild(newCookieGroupColStart);
            newCookieGroupRow.appendChild(newCookieGroupColEnd);
            for (var cookie in metadata.cookiegroups[cookiegroup].cookies) {
                var newCookieWrapper = document.createElement('div');
                newCookieWrapper.className = 'cookie'
                newCookieWrapper.setAttribute('id', 'cookie__' + cookie);
                var newCookieRow = document.createElement('div');
                newCookieRow.className = 'row'
                var newCookieColStart = document.createElement('div');
                newCookieColStart.className = 'col-md-1'
                newCookieColStart.appendChild(document.createTextNode(cookie));
                var newCookieColCenter = document.createElement('div');
                newCookieColCenter.className = 'col-md-9'
                newCookieColCenter.appendChild((document.createTextNode(metadata.cookiegroups[cookiegroup].cookies[cookie].description)));
                var newCookieColEnd = document.createElement('div');
                newCookieColEnd.className = 'col-md-2'
                newCookieColEnd.appendChild((document.createTextNode(metadata.cookiegroups[cookiegroup].cookies[cookie].lifetime)));
                newCookieWrapper.appendChild(newCookieRow);
                newCookieRow.appendChild(newCookieColStart);
                newCookieRow.appendChild(newCookieColCenter);
                newCookieRow.appendChild(newCookieColEnd);
                newCookieGroupWrapper.appendChild(newCookieWrapper);
            }
            cookieGroups.appendChild(newCookieGroupWrapper);
        }

        function setEssentialCookie(value) {
            setCookie('_cs', value, nowPlusOneYear());
            document.getElementById('cookie__banner').remove();
            processCookieDependentResources();
        }

        const selectedCookieGroups = [];

        document.querySelectorAll('.form-check-input').forEach(item => {
            item.addEventListener('click', e => {
                var cookieGroup = item.getAttribute('data-cookiegroup');
                if(item.checked == true) {
                    selectedCookieGroups.push(cookieGroup);
                } else {
                    selectedCookieGroups.splice(cookieGroup, 1);
                }
                var buttonSelected = document.getElementById('button__selected');
                if(selectedCookieGroups.length === 0) {
                    buttonSelected.setAttribute('style', 'display:none');
                } else {
                    buttonSelected.setAttribute('style', 'display:block');
                }
            });
        });


        document.getElementById('button__all').addEventListener('click', (e) => {
            setEssentialCookie('all');
        });

        document.getElementById('button__essential').addEventListener('click', (e) => {
            setEssentialCookie('essential');
        });

        document.getElementById('button__selected').addEventListener('click', (e) => {;
            var cookieString = selectedCookieGroups.join(',');
            setEssentialCookie(cookieString);
        });

    }

    if(!getCookie('_cs') || getCookie('_cs') == 'revoked') {
        fetchCookieMetadataAsync();
    }

});
