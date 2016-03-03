var number = 0;

function clearObj(obj)
{
        while (obj.firstChild)
                obj.removeChild(obj.firstChild);
}


function doSearch(evt)
{
        var elem = document.getElementById('miniscripts');
        if(elem)
                elem.remove();

        // GET DATA
        var locale = document.getElementById('locale').value;
        var path = 'http://www.younow.com/php/api/younow/trendingUsers/';
        path += 'locale=' + locale + '/';
        path += 'startFrom=0/numberOfRecords=10000/callback=trusers';

        var script = document.createElement('script');
        script.src = path;
        script.setAttribute('id', 'miniscripts');
        document.getElementsByTagName('head')[0].appendChild(script);

        evt.preventDefault();
}

function trusers(json)
{
        if(typeof tusers != 'undefined')
                delete tusers;

        tusers = json.trending_users;

        // Tags
        var checkboxes = document.getElementsByName('tags[]');
        var selected = [];
        for (var i=0; i<checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                        selected.push(checkboxes[i].value);
                }
        }

        var res = document.getElementById('results');
        clearObj(res);

        // Order
        var order = parseInt(document.getElementById('order').value);

        var sort_array = [];
        for (var key in tusers)
        {
                sort_array.push({
                        userId:tusers[key].userId,
                        tags:tusers[key].tags,
                        locale:tusers[key].locale,
                        userlevel:tusers[key].userlevel,
                        viewers:tusers[key].viewers
                });
        }

        // Now sort it
        if(order == '123')
                sort_array.sort(function(x,y){if(x.viewers > y.viewers) {return 1;}else {return -1;}});

        if(order == '321')
                sort_array.sort(function(x,y){if(x.viewers < y.viewers) {return 1;}else {return -1;}});

        var i;
        var count = 1;
        // Now process that object with it:
        for (var i=0;i<sort_array.length;i++)
        {
                var tuser = sort_array[i];

                var tag = tuser.tags;
                tag.toString();
                var locale = tuser.locale;
                var level = parseInt(tuser.userlevel);
                var viewers = parseInt(tuser.viewers);
                var level_limit = parseInt(document.getElementById('level').value);
                var viewers_limit = parseInt(document.getElementById('viewers').value);

                var ii;
                // Delete the tags i don't want to see
                for (ii=0; ii < selected.length; ii++)
                {
                        if(tag == selected[ii])
                        {
                                tuser = false;
                                delete sort_array[i];
                                break;
                        }
                }

                // New information
                var tuser = sort_array[i];

                // Show broadcast
                if(
                        tuser && tag != 'musicians' && tag != 'music' && tag != 'hiphop' && tag != 'karaoke' && tag != 'singing' && tag != 'dj' && tag != 'alternative' && tag != 'transgender' && tag != 'prank_calls' && tag != 'prank_calling' && tag != 'lgbt' && tag != 'youtube' && tag != 'youtuber' && tag != 'deutsch-boy' && tag != 'deutsch-erwachsene' && tag != 'schwul' && tag != 'gaming' && tag != 'grownups' && tag != 'talk' && tag != 'malaysia' && locale != 'me' && level <= level_limit && viewers_limit <= viewers
                        )
                {
                        _broadcast(tuser.userId);

                        count++;
                }
        }

        // How many broadcasts?
        var number_html = document.getElementById('number');
        number_html.innerHTML = '<div class="numero">En vivo ahora: ' + count +'</div>';
}

function _broadcast(id)
{
        var path = 'http://cdn2.younow.com/php/api/broadcast/info/';
        path += 'channelId=' + id  + '/';
        path += 'callback=TheStreams';

        var script = document.createElement('script');
        script.src = path;
        script.setAttribute('id', 'miniscripts');
        document.getElementsByTagName('head')[0].appendChild(script);
}

function TheStreams(json)
{
        var res = document.getElementById('results');

        var stream = json;

        var rtmp = 'rtmp://' + stream.media.host + stream.media.app + '/';
        var link = stream.media.stream;

        var box = document.createElement('div');
        box.classList.add('result');
        box.innerHTML = '<a href="http://www.younow.com/' + stream.user.profileUrlString + '" target="_blank"><img src="http://cdn2.younow.com/php/api/getBroadcastThumb/broadcastId=' + stream.broadcastId + '" /></a>'
                       + ' <div class="tags-localizacion"><span class="tags-cont"> #' + stream.tags + '</span> - '
                       + '<span class="localizacion">' + stream.location.country + '</span></div>'
                       + '<div class="nivel-user"><i class="icon-star"></i> ' + stream.user.userLevel
                       +  ' ' + stream.user.profileUrlString + '</div>'
                       + '<div class="vivo-viendo"><span class="en-vivo"><i class="icon-controller-record"></i> En vivo</span>  '
                       + '<span class="viendo"><i class="icon-eye"></i> ' + stream.viewers + '</span></div>';

        res.appendChild(box);
}

function addbroadcast(rtmp, link, profile) {
        var broadcasts = document.getElementById("broadcasts");
        var newb = document.createElement("div");
        newb.className = "broadcast";
        newb.id = "broadcast_"+number;
        newb.innerHTML = '<a href="http://www.younow.com/'+profile+'" target="_blank" class="b-user">'+profile+'</a><object data="RTMPPlayer.swf" name="broadcast" id="broadcast" type="application/x-shockwave-flash" align="middle" height="180px" width="240px" flashvars="link='+rtmp+'&stream='+link+'" ><param value="high" name="quality"><param value="#000000" name="bgcolor"><param value="always" name="allowscriptaccess"><param value="true" name="allowfullscreen"><param name="wmode" value="transparent"></object><a href="'+rtmp+link+'" class="b-rtmp" target="_blank">RTMP Link</a>';
        broadcasts.appendChild(newb);
        document.getElementById("broadcast_"+number).ondblclick = function() { removebroadcast(this.id); };
        number++;
}

function removebroadcast(id) {
        var element = document.getElementById(id);
        element.parentNode.removeChild(element);
}

function onLoad()
{
        document.getElementById('searchform').addEventListener('submit', doSearch);
}

document.addEventListener('DOMContentLoaded', onLoad);
