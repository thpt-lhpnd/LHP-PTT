(function(){
    var script = {
 "scrollBarMargin": 2,
 "class": "Player",
 "id": "rootPlayer",
 "children": [
  "this.MainViewer"
 ],
 "scrollBarVisible": "rollOver",
 "start": "this.init()",
 "horizontalAlign": "left",
 "width": "100%",
 "paddingRight": 0,
 "scripts": {
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "unregisterKey": function(key){  delete window[key]; },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "existsKey": function(key){  return key in window; },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "registerKey": function(key, value){  window[key] = value; },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "getKey": function(key){  return window[key]; },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } }
 },
 "scrollBarWidth": 10,
 "defaultVRPointer": "laser",
 "downloadEnabled": false,
 "verticalAlign": "top",
 "paddingLeft": 0,
 "minWidth": 20,
 "minHeight": 20,
 "height": "100%",
 "contentOpaque": false,
 "borderRadius": 0,
 "borderSize": 0,
 "definitions": [{
 "class": "Panorama",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -61.82,
   "backwardYaw": 104.27,
   "distance": 1,
   "panorama": "this.panorama_0531BF7A_0E53_667A_41A9_5261BFE86443"
  }
 ],
 "label": "Ph\u00f2ng h\u1ecdp",
 "id": "panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362",
 "thumbnailUrl": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_3BB144B0_0EB3_BA86_41AA_50D3321987CC"
 ],
 "partial": false,
 "hfov": 360,
 "hfovMax": 130,
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 85.68,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_34FFE2E7_0E6D_7E8A_419F_029A9B3E63D5",
 "automaticZoomSpeed": 10
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "media": "this.panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "media": "this.panorama_02416052_0E5C_998A_41A2_132FE9A9DF96",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "media": "this.panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "media": "this.panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "media": "this.panorama_05317112_0E53_7B85_4197_3B415BAAA69A",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_05317112_0E53_7B85_4197_3B415BAAA69A_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "media": "this.panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "media": "this.panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "media": "this.panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 9)",
   "media": "this.panorama_053191B1_0E53_9A87_4178_48726558878C",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_053191B1_0E53_9A87_4178_48726558878C_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 9, 10)",
   "media": "this.panorama_05319E50_0E53_E986_41AB_485A43EDF989",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_05319E50_0E53_E986_41AB_485A43EDF989_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 10, 11)",
   "media": "this.panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 11, 12)",
   "media": "this.panorama_0531E82C_0E53_A99E_419B_51B7C5C63418",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 12, 13)",
   "media": "this.panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 13, 14)",
   "media": "this.panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 14, 15)",
   "media": "this.panorama_0531BF7A_0E53_667A_41A9_5261BFE86443",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 15, 16)",
   "media": "this.panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 16, 17)",
   "media": "this.panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 17, 18)",
   "media": "this.panorama_053696A2_0E54_A68A_41A9_22F96F24D450",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_053696A2_0E54_A68A_41A9_22F96F24D450_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 18, 19)",
   "media": "this.panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 19, 20)",
   "media": "this.panorama_05369057_0E54_F98A_419C_9B00E7277DD2",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_05369057_0E54_F98A_419C_9B00E7277DD2_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "end": "this.trigger('tourEnded')",
   "player": "this.MainViewerPanoramaPlayer",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 20, 0)",
   "media": "this.panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362",
   "camera": "this.panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_camera"
  }
 ],
 "id": "mainPlayList"
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 156.78,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_3512803E_0E6D_79FA_41A9_A344EE669B46",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -132.38,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_34EE42CD_0E6D_7E9E_4177_1ACF448949E0",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 67.47,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_328FA13E_0E6D_7BFD_41AA_B5C5825949A3",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -32.31,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_37386263_0E6D_798B_41AC_EF852A9732EA",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 80.53,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_373C9270_0E6D_7985_41A9_E069DE8A748D",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_camera",
 "automaticZoomSpeed": 10
},
{
 "class": "Panorama",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 114.07,
   "backwardYaw": -154.99,
   "distance": 1,
   "panorama": "this.panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 147.69,
   "backwardYaw": -126.95,
   "distance": 1,
   "panorama": "this.panorama_05319E50_0E53_E986_41AB_485A43EDF989"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -65.3,
   "backwardYaw": -165.55,
   "distance": 1,
   "panorama": "this.panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -21.27,
   "backwardYaw": 139.54,
   "distance": 1,
   "panorama": "this.panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -112.53,
   "backwardYaw": 158.91,
   "distance": 1,
   "panorama": "this.panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -145.74,
   "backwardYaw": 114.59,
   "distance": 1,
   "panorama": "this.panorama_0531E82C_0E53_A99E_419B_51B7C5C63418"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 81.29,
   "backwardYaw": -179.63,
   "distance": 1,
   "panorama": "this.panorama_05317112_0E53_7B85_4197_3B415BAAA69A"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 24.63,
   "backwardYaw": -148.82,
   "distance": 1,
   "panorama": "this.panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1"
  }
 ],
 "label": "PTT 4",
 "id": "panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F",
 "thumbnailUrl": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_2B964851_0ED4_E986_41A7_BC896569AF6F",
  "this.overlay_2BF5BB21_0ED4_EF86_4196_2A384C58D6E9",
  "this.overlay_2B879EC3_0ED4_A68B_419F_B218D9B08F9B",
  "this.overlay_28EF7DEB_0ED4_EA9A_416C_233FB6E6BC90",
  "this.overlay_289908D3_0ED7_AA8A_41AC_7D8FA6ABC4C8",
  "this.overlay_283C726B_0ED7_999A_4187_E8C4C02F6033",
  "this.overlay_29D22D8A_0ED7_6A85_416B_A0F6D38F3992",
  "this.overlay_29C0548D_0ED4_9A9E_4199_3CCE3CB55F87"
 ],
 "partial": false,
 "hfov": 360,
 "hfovMax": 130,
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -155.37,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_372E024B_0E6D_799B_41A2_C328D684E006",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -40.46,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_34668369_0E6D_7F86_4196_3D267F0CF9E7",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 18.1,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_34BE532E_0E6D_7F9A_41AB_137D6E3AD65B",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -83.29,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_370E3291_0E6D_7E87_41A7_B990B4F51F40",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 134.92,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_32382192_0E6D_7A8A_41AA_70E779B5587D",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 86.19,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_35A0B451_0E6D_7986_41AC_A890A6EABE54",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 99.25,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_340EC3EB_0E6D_7E9B_4176_DED0051863EF",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -106.32,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_3703327A_0E6D_7985_41A8_18A94829447E",
 "automaticZoomSpeed": 10
},
{
 "class": "Panorama",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -87.22,
   "backwardYaw": 173.49,
   "distance": 1,
   "panorama": "this.panorama_0531BF7A_0E53_667A_41A9_5261BFE86443"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 89.58,
   "backwardYaw": -80.75,
   "distance": 1,
   "panorama": "this.panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_053191B1_0E53_9A87_4178_48726558878C"
  }
 ],
 "label": "PTT 14",
 "id": "panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC",
 "thumbnailUrl": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_20327BC2_0EAD_6E85_417E_CBC248D86EC8",
  "this.overlay_20993BCA_0EAC_EE9A_4185_FFEAD5ECF4C0",
  "this.overlay_2077F138_0EAC_FB86_41A2_E0CE5B750E38",
  "this.overlay_20226DDE_0EAC_EABD_41AB_C753B9D70AAF"
 ],
 "partial": false,
 "hfov": 360,
 "hfovMax": 130,
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -6.51,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_3403A3DE_0E6D_7EBD_4198_E7389C23DBB9",
 "automaticZoomSpeed": 10
},
{
 "class": "Panorama",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -165.55,
   "backwardYaw": -65.3,
   "distance": 1,
   "panorama": "this.panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -91.55,
   "backwardYaw": 96.71,
   "distance": 1,
   "panorama": "this.panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 135.3,
   "backwardYaw": -141.74,
   "distance": 1,
   "panorama": "this.panorama_02416052_0E5C_998A_41A2_132FE9A9DF96"
  }
 ],
 "label": "PTT 7",
 "id": "panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE",
 "thumbnailUrl": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_25A581DF_0EDF_9ABB_41A5_CB7A77324A61",
  "this.overlay_258633C2_0EDF_9E85_41A9_95C687D250AC",
  "this.overlay_25DA9566_0EDF_9B8A_4185_AC0E9ADB1477"
 ],
 "partial": false,
 "hfov": 360,
 "hfovMax": 130,
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -44.7,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_32A2E105_0E6D_7B8F_41A5_6284F9B6F61F",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 88.95,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_32FDD0B1_0E6D_7A86_41A9_52672D720068",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -8.93,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_342433B4_0E6D_7E8D_4186_49ECCD78BCD1",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaPlayer",
 "touchControlMode": "drag_rotation",
 "gyroscopeVerticalDraggingEnabled": true,
 "mouseControlMode": "drag_rotation",
 "id": "MainViewerPanoramaPlayer",
 "viewerArea": "this.MainViewer",
 "displayPlaybackBar": true
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -34.65,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_34DE830A_0E6D_7F9A_41A4_7B7E8771F2A6",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -45.63,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_34CAD2F3_0E6D_7E8A_41A1_8675194EAF97",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_camera",
 "automaticZoomSpeed": 10
},
{
 "class": "Panorama",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 131.88,
   "backwardYaw": 47.62,
   "distance": 1,
   "panorama": "this.panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -179.73,
   "backwardYaw": 84.8,
   "distance": 1,
   "panorama": "this.panorama_053696A2_0E54_A68A_41A9_22F96F24D450"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 84.05,
   "backwardYaw": -94.32,
   "distance": 1,
   "panorama": "this.panorama_05369057_0E54_F98A_419C_9B00E7277DD2"
  }
 ],
 "label": "PTT 19",
 "id": "panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF",
 "thumbnailUrl": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_2F9C3AC8_0EF4_AE86_41A1_61507288416F",
  "this.overlay_3DD97C70_0EB7_A987_4194_EB496D096618",
  "this.overlay_3DED3EC7_0EB7_A68A_4190_9077E604DB66"
 ],
 "partial": false,
 "hfov": 360,
 "hfovMax": 130,
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 60.69,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_32B27121_0E6D_7B87_419D_FC7181EA85E8",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_05317112_0E53_7B85_4197_3B415BAAA69A_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 32.02,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_342F23C2_0E6D_7E85_4173_37514E5D3452",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -8.9,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_34D382FF_0E6D_7E7A_4192_7952B7419E9D",
 "automaticZoomSpeed": 10
},
{
 "class": "Panorama",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -179.63,
   "backwardYaw": 81.29,
   "distance": 1,
   "panorama": "this.panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 83.05,
   "backwardYaw": -98.14,
   "distance": 1,
   "panorama": "this.panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -119.31,
   "backwardYaw": 141.51,
   "distance": 1,
   "panorama": "this.panorama_02416052_0E5C_998A_41A2_132FE9A9DF96"
  }
 ],
 "label": "PTT 5",
 "id": "panorama_05317112_0E53_7B85_4197_3B415BAAA69A",
 "thumbnailUrl": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_299E30A2_0ED5_9A85_41A6_CE8E0D638336",
  "this.overlay_29928DB1_0ED4_AA86_419D_F335CECAAE3B",
  "this.overlay_27F2ED02_0ED3_AB85_419F_29D36F490DD8"
 ],
 "partial": false,
 "hfov": 360,
 "hfovMax": 130,
 "pitch": 0
},
{
 "class": "Panorama",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -154.99,
   "backwardYaw": 114.07,
   "distance": 1,
   "panorama": "this.panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -98.14,
   "backwardYaw": 83.05,
   "distance": 1,
   "panorama": "this.panorama_05317112_0E53_7B85_4197_3B415BAAA69A"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 134.37,
   "backwardYaw": 35.02,
   "distance": 1,
   "panorama": "this.panorama_053191B1_0E53_9A87_4178_48726558878C"
  }
 ],
 "label": "PTT 6",
 "id": "panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B",
 "thumbnailUrl": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_260783D9_0ED3_7E87_41A6_04BFD63CE95E",
  "this.overlay_27BEDF12_0ED3_6785_419C_951A4233ACC2",
  "this.overlay_279BF167_0EDC_9B8A_41AB_1E2E96E54449"
 ],
 "partial": false,
 "hfov": 360,
 "hfovMax": 130,
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 96.25,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_32BFA132_0E6D_7B85_419A_BF95CE4DA933",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -88.77,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_3725A232_0E6D_7985_41A0_D6224B273198",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -96.95,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_353EF005_0E6D_798E_4198_B5B3A2F532C0",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -95.2,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_34F632DA_0E6D_7EBA_4197_9A98E42C2915",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -54.5,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_327B1161_0E6D_7B86_41A4_62D6C866AF61",
 "automaticZoomSpeed": 10
},
{
 "class": "Panorama",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 104.35,
   "backwardYaw": -64.92,
   "distance": 1,
   "panorama": "this.panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 72.62,
   "backwardYaw": -93.81,
   "distance": 1,
   "panorama": "this.panorama_053696A2_0E54_A68A_41A9_22F96F24D450"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -45.08,
   "backwardYaw": 113.44,
   "distance": 1,
   "panorama": "this.panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_053191B1_0E53_9A87_4178_48726558878C"
  }
 ],
 "label": "PTT 17",
 "id": "panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C",
 "thumbnailUrl": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_2E4AF8CA_0EF4_EA9A_41A9_590743480CF9",
  "this.overlay_3E60C795_0EB4_E68F_4182_037B4E6C6900",
  "this.overlay_3E6A5979_0EB4_EB87_41A3_C295563041EC",
  "this.overlay_3E7CCB00_0EB4_EF85_41A9_E18A1F55B8BC"
 ],
 "partial": false,
 "hfov": 360,
 "hfovMax": 130,
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 107.1,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_352BFFCE_0E6D_669A_41A4_CF6186AE4EC0",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0.27,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_351DA059_0E6D_7986_4189_91ADA8B533B6",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -144.98,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_3507A021_0E6D_7986_417B_612DA1BB6638",
 "automaticZoomSpeed": 10
},
{
 "class": "Panorama",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 47.62,
   "backwardYaw": 131.88,
   "distance": 1,
   "panorama": "this.panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -23.22,
   "backwardYaw": 171.07,
   "distance": 1,
   "panorama": "this.panorama_053696A2_0E54_A68A_41A9_22F96F24D450"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 125.5,
   "backwardYaw": -147.98,
   "distance": 1,
   "panorama": "this.panorama_05369057_0E54_F98A_419C_9B00E7277DD2"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -64.92,
   "backwardYaw": 104.35,
   "distance": 1,
   "panorama": "this.panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C"
  }
 ],
 "label": "PTT 16",
 "id": "panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70",
 "thumbnailUrl": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_3F0E25A0_0EAC_9A86_41A0_495D6EFC43B8",
  "this.overlay_3F26C7DF_0EB3_66BA_41AB_490E4EAC27F7",
  "this.overlay_3F3FB94B_0EB3_6B9B_4190_0475E8D1FECC",
  "this.overlay_3D6D9777_0EBF_678A_41A1_6C5D34095521"
 ],
 "partial": false,
 "hfov": 360,
 "hfovMax": 130,
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 81.86,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_35C2B429_0E6D_7986_4157_2C46C6237350",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -107.38,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_32E7F075_0E6D_798E_4194_22F0F4CC7E70",
 "automaticZoomSpeed": 10
},
{
 "class": "Panorama",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 158.91,
   "backwardYaw": -112.53,
   "distance": 1,
   "panorama": "this.panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 96.71,
   "backwardYaw": -91.55,
   "distance": 1,
   "panorama": "this.panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -134.54,
   "backwardYaw": -36.3,
   "distance": 1,
   "panorama": "this.panorama_053191B1_0E53_9A87_4178_48726558878C"
  }
 ],
 "label": "PTT 8",
 "id": "panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6",
 "thumbnailUrl": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_1200316D_0EF5_FB9F_41A6_E7A017082EA2",
  "this.overlay_13E719C3_0EF5_6A8B_4180_DE5D9A5C23C3",
  "this.overlay_2735B145_0EDD_7B8E_41AB_ED9893F1B600"
 ],
 "partial": false,
 "hfov": 360,
 "hfovMax": 130,
 "pitch": 0
},
{
 "class": "Panorama",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 35.02,
   "backwardYaw": 134.37,
   "distance": 1,
   "panorama": "this.panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 73.68,
   "backwardYaw": 171.1,
   "distance": 1,
   "panorama": "this.panorama_05319E50_0E53_E986_41AB_485A43EDF989"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -125.23,
   "backwardYaw": 145.35,
   "distance": 1,
   "panorama": "this.panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -36.3,
   "backwardYaw": -134.54,
   "distance": 1,
   "panorama": "this.panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -83.23,
   "backwardYaw": 179.77,
   "distance": 1,
   "panorama": "this.panorama_0531E82C_0E53_A99E_419B_51B7C5C63418"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 97.07,
   "backwardYaw": -161.9,
   "distance": 1,
   "panorama": "this.panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F"
  }
 ],
 "label": "PTT 9",
 "id": "panorama_053191B1_0E53_9A87_4178_48726558878C",
 "thumbnailUrl": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_13B01B7C_0EF7_6E7D_4180_6EE291722702",
  "this.overlay_108EEC5E_0EF5_69BA_4181_346D7875CAC9",
  "this.overlay_135443B4_0EF5_9E8E_4176_5A171D34CD8E",
  "this.overlay_108FBA72_0EF3_6985_41A9_5D57FE1DF261",
  "this.overlay_10DA2339_0EF3_9F86_4191_A7B5A0ED1763",
  "this.overlay_101F5B80_0EF3_6E86_418C_CF14FD14A190"
 ],
 "partial": false,
 "hfov": 360,
 "hfovMax": 130,
 "pitch": 0
},
{
 "class": "Panorama",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -72.9,
   "backwardYaw": 95.45,
   "distance": 1,
   "panorama": "this.panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -141.74,
   "backwardYaw": 135.3,
   "distance": 1,
   "panorama": "this.panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 141.51,
   "backwardYaw": -119.31,
   "distance": 1,
   "panorama": "this.panorama_05317112_0E53_7B85_4197_3B415BAAA69A"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 70.33,
   "backwardYaw": -83.75,
   "distance": 1,
   "panorama": "this.panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1"
  }
 ],
 "label": "PTT 2",
 "id": "panorama_02416052_0E5C_998A_41A2_132FE9A9DF96",
 "thumbnailUrl": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_2FFD5AFA_0EF3_EE85_4180_6F6B2099074E",
  "this.overlay_2BE29EC9_0EED_A686_41A6_6F6B1EDFFF06",
  "this.overlay_2D2F86E6_0EEF_A68A_4182_8D535A4611B6",
  "this.overlay_2A8CD66B_0EEF_999A_4164_D260F50B493B"
 ],
 "partial": false,
 "hfov": 360,
 "hfovMax": 130,
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -91.93,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_34E6A2C2_0E6D_7E85_418E_6A4D2A93D82E",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 96.77,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_35ECB40F_0E6D_799B_41A2_83FEFE8194CD",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_053696A2_0E54_A68A_41A9_22F96F24D450_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 158.73,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_35225FAE_0E6D_669D_41A8_91860845C630",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -75.65,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_343A63D0_0E6D_7E85_41A3_DDB1DB6D17B0",
 "automaticZoomSpeed": 10
},
{
 "class": "Panorama",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_053191B1_0E53_9A87_4178_48726558878C"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 171.07,
   "backwardYaw": -23.22,
   "distance": 1,
   "panorama": "this.panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 84.8,
   "backwardYaw": -179.73,
   "distance": 1,
   "panorama": "this.panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -93.81,
   "backwardYaw": 72.62,
   "distance": 1,
   "panorama": "this.panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C"
  }
 ],
 "label": "PTT 18",
 "id": "panorama_053696A2_0E54_A68A_41A9_22F96F24D450",
 "thumbnailUrl": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_2F8CB401_0EF7_9986_4185_BF1B03715FA9",
  "this.overlay_3F9CC63B_0EB5_79FA_419A_76D40C44C6EF",
  "this.overlay_3FA947C1_0EB5_6687_41A6_0F6A3468F8E6",
  "this.overlay_3FBD697A_0EB5_6A7A_4193_522595AC04C7"
 ],
 "partial": false,
 "hfov": 360,
 "hfovMax": 130,
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -38.49,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_35CC3437_0E6D_798B_419D_1B7B4DFBC72A",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -0.23,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_34B34321_0E6D_7F86_4199_2DE19ACC27EF",
 "automaticZoomSpeed": 10
},
{
 "class": "Panorama",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -80.75,
   "backwardYaw": 89.58,
   "distance": 1,
   "panorama": "this.panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 89.07,
   "backwardYaw": -91.05,
   "distance": 1,
   "panorama": "this.panorama_0531E82C_0E53_A99E_419B_51B7C5C63418"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 145.35,
   "backwardYaw": -125.23,
   "distance": 1,
   "panorama": "this.panorama_053191B1_0E53_9A87_4178_48726558878C"
  }
 ],
 "label": "PTT 13",
 "id": "panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F",
 "thumbnailUrl": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_23504A43_0ED3_698A_4190_A761A409986A",
  "this.overlay_209EFBBB_0ED3_6EFA_41A6_302E73D11154",
  "this.overlay_20BFF6F7_0EAC_A68A_4182_80C028ECB674"
 ],
 "partial": false,
 "hfov": 360,
 "hfovMax": 130,
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -48.12,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_345AC3A6_0E6D_7E8D_419D_F332CDEA23A3",
 "automaticZoomSpeed": 10
},
{
 "class": "Panorama",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 139.54,
   "backwardYaw": -21.27,
   "distance": 1,
   "panorama": "this.panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 95.45,
   "backwardYaw": -72.9,
   "distance": 1,
   "panorama": "this.panorama_02416052_0E5C_998A_41A2_132FE9A9DF96"
  }
 ],
 "label": "PTT 1",
 "id": "panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7",
 "thumbnailUrl": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_2E66A181_0EF5_9A86_41A9_FF867A310491",
  "this.overlay_2CE46EA2_0EF4_E68A_41AC_9DF1B479927B"
 ],
 "partial": false,
 "hfov": 360,
 "hfovMax": 130,
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 31.18,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_344FB39A_0E6D_7E85_4187_B26F45472737",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_05319E50_0E53_E986_41AB_485A43EDF989_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -65.93,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_35347FEA_0E6D_669A_41AD_9DDB0291BA5E",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -109.67,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_37323258_0E6D_7985_418B_302A714C1BD9",
 "automaticZoomSpeed": 10
},
{
 "class": "Panorama",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 114.59,
   "backwardYaw": -145.74,
   "distance": 1,
   "panorama": "this.panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -91.05,
   "backwardYaw": 89.07,
   "distance": 1,
   "panorama": "this.panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 179.77,
   "backwardYaw": -83.23,
   "distance": 1,
   "panorama": "this.panorama_053191B1_0E53_9A87_4178_48726558878C"
  }
 ],
 "label": "PTT 12",
 "id": "panorama_0531E82C_0E53_A99E_419B_51B7C5C63418",
 "thumbnailUrl": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_22BD8F26_0ED4_A78D_4168_8536F0382FA0",
  "this.overlay_2266F03C_0ED4_99FE_4192_76A2B02C24F3",
  "this.overlay_23B10488_0ED4_9A86_4183_AF24C005FFA0"
 ],
 "partial": false,
 "hfov": 360,
 "hfovMax": 130,
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 34.26,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_341813F9_0E6D_7E87_419D_81807972B26E",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 14.45,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_349B935C_0E6D_7FBE_41A0_BCD3ECF67D7D",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 115.08,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_35D75444_0E6D_798E_41A9_F59CE2349B8E",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 54.77,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_32C9C0CC_0E6D_7A9D_4187_136991DC4F76",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_053191B1_0E53_9A87_4178_48726558878C_camera",
 "automaticZoomSpeed": 10
},
{
 "class": "Panorama",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -126.95,
   "backwardYaw": 147.69,
   "distance": 1,
   "panorama": "this.panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 91.23,
   "backwardYaw": -99.47,
   "distance": 1,
   "panorama": "this.panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 171.1,
   "backwardYaw": 73.68,
   "distance": 1,
   "panorama": "this.panorama_053191B1_0E53_9A87_4178_48726558878C"
  }
 ],
 "label": "PTT 10",
 "id": "panorama_05319E50_0E53_E986_41AB_485A43EDF989",
 "thumbnailUrl": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_11D6F8E2_0EFC_EA8A_4195_1F49FF504CA0",
  "this.overlay_11C979FB_0EFF_AA7B_41A1_25193DF28509",
  "this.overlay_255F67F2_0ED4_A68A_4196_D5DB769DCC77"
 ],
 "partial": false,
 "hfov": 360,
 "hfovMax": 130,
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -98.71,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_35F7941D_0E6D_79BF_4193_22B0713986D2",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 53.05,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_3492434F_0E6D_7F9A_4188_3726F72445B0",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -90.93,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_35E33405_0E6D_798F_4165_46A0F6CD8BEC",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -66.56,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_35ABA45C_0E6D_79BE_4197_6ECD62B98932",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 25.01,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_3487F341_0E6D_7F86_4190_3DCE39ECB765",
 "automaticZoomSpeed": 10
},
{
 "class": "Panorama",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -147.98,
   "backwardYaw": 125.5,
   "distance": 1,
   "panorama": "this.panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -94.32,
   "backwardYaw": 84.05,
   "distance": 1,
   "panorama": "this.panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 88.07,
   "backwardYaw": -93.81,
   "distance": 1,
   "panorama": "this.panorama_0531BF7A_0E53_667A_41A9_5261BFE86443"
  }
 ],
 "label": "PTT 20",
 "id": "panorama_05369057_0E54_F98A_419C_9B00E7277DD2",
 "thumbnailUrl": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_2EEFDBC4_0EF4_EE8E_41A5_34BEF1D75D65",
  "this.overlay_3A8474BF_0EBD_FAFA_4187_A3EF6F3F4D0D",
  "this.overlay_3A9646FF_0EBD_E67B_41A5_F4712D5D4322"
 ],
 "partial": false,
 "hfov": 360,
 "hfovMax": 130,
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -82.93,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_3729B23F_0E6D_79FB_4197_958BBD1F4C8B",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_05369057_0E54_F98A_419C_9B00E7277DD2_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 38.26,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_3714D29D_0E6D_7EBF_41A1_03FCDACC7F51",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 114.7,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_37090285_0E6D_7E8F_41A6_7A4CC9AD7470",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -84.55,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_32D4F0E8_0E6D_7A85_4182_DAE80B3F6F08",
 "automaticZoomSpeed": 10
},
{
 "class": "Panorama",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 113.44,
   "backwardYaw": -45.08,
   "distance": 1,
   "panorama": "this.panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -99.47,
   "backwardYaw": 91.23,
   "distance": 1,
   "panorama": "this.panorama_05319E50_0E53_E986_41AB_485A43EDF989"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -161.9,
   "backwardYaw": 97.07,
   "distance": 1,
   "panorama": "this.panorama_053191B1_0E53_9A87_4178_48726558878C"
  }
 ],
 "label": "PTT 11",
 "id": "panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F",
 "thumbnailUrl": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_258291D2_0ED5_9A85_419C_FF5EE670A6AB",
  "this.overlay_25ED5469_0ED5_9986_41A7_F24B5EEF2595",
  "this.overlay_25DB9628_0ED5_9986_4143_BD65B72E1EF8"
 ],
 "partial": false,
 "hfov": 360,
 "hfovMax": 130,
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 118.18,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_34E092B6_0E6D_7E8D_41AD_667DEA1D2582",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 92.78,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_371902AA_0E6D_7E85_418D_586BC4D5E10A",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 45.46,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_34A82315_0E6D_7F8E_4182_B8A2473B5722",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -65.41,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_347B1381_0E6D_7E86_4120_C98A49CF8E44",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -75.73,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_3228D185_0E6D_7A8E_41AB_3130E9786D41",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 86.19,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_325A4179_0E6D_7B86_41A4_B2136096CF51",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -95.95,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_324B716C_0E6D_7B9E_4174_28324827980A",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -21.09,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_3471A375_0E6D_7F8E_41A4_3E057F5070B8",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 88.45,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_329DA14B_0E6D_7B9B_4141_E2C3A9F89921",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -90.42,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_32F28090_0E6D_7A86_41A9_93FE3B37BD1B",
 "automaticZoomSpeed": 10
},
{
 "class": "Panorama",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -148.82,
   "backwardYaw": 24.63,
   "distance": 1,
   "panorama": "this.panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -83.75,
   "backwardYaw": 70.33,
   "distance": 1,
   "panorama": "this.panorama_02416052_0E5C_998A_41A2_132FE9A9DF96"
  }
 ],
 "label": "PTT 3",
 "id": "panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1",
 "thumbnailUrl": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_2BF0B1B6_0EEC_BA8A_4195_833AD49B6CE1",
  "this.overlay_2BABBA2F_0ED3_A99B_41A5_475D873867A5"
 ],
 "partial": false,
 "hfov": 360,
 "hfovMax": 130,
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0.37,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_3446338D_0E6D_7E9E_41AC_A33581913C4F",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 143.7,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_326D1157_0E6D_7B8B_41A7_6652B78BF132",
 "automaticZoomSpeed": 10
},
{
 "class": "Panorama",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 173.49,
   "backwardYaw": -87.22,
   "distance": 1,
   "panorama": "this.panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 104.27,
   "backwardYaw": -61.82,
   "distance": 1,
   "panorama": "this.panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -93.81,
   "backwardYaw": 88.07,
   "distance": 1,
   "panorama": "this.panorama_05369057_0E54_F98A_419C_9B00E7277DD2"
  }
 ],
 "label": "PTT 15",
 "id": "panorama_0531BF7A_0E53_667A_41A9_5261BFE86443",
 "thumbnailUrl": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 8,
      "tags": "ondemand",
      "colCount": 8,
      "width": 4096,
      "height": 4096
     },
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_2E20CEB3_0EF5_A68A_41AC_FD739032860D",
  "this.overlay_21A367C8_0EAC_E686_41A0_095D34F69F03",
  "this.overlay_21281742_0EAC_E785_4180_1FF9283F0C61",
  "this.overlay_3C34DD73_0EAD_6B8A_41AD_4D7A15410775"
 ],
 "partial": false,
 "hfov": 360,
 "hfovMax": 130,
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_camera",
 "automaticZoomSpeed": 10
},
{
 "toolTipFontSize": "1.11vmin",
 "class": "ViewerArea",
 "id": "MainViewer",
 "toolTipShadowBlurRadius": 3,
 "playbackBarHeight": 10,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowColor": "#000000",
 "toolTipOpacity": 1,
 "playbackBarHeadWidth": 6,
 "playbackBarRight": 0,
 "width": "100%",
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipFontWeight": "normal",
 "playbackBarProgressBorderSize": 0,
 "toolTipPaddingBottom": 4,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "progressBarBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "minHeight": 50,
 "playbackBarBorderRadius": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "paddingLeft": 0,
 "playbackBarHeadBorderRadius": 0,
 "transitionDuration": 500,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderColor": "#000000",
 "minWidth": 100,
 "toolTipFontStyle": "normal",
 "progressLeft": 0,
 "height": "100%",
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipShadowOpacity": 1,
 "borderSize": 0,
 "playbackBarBorderSize": 0,
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "toolTipFontFamily": "Arial",
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "toolTipShadowHorizontalLength": 0,
 "shadow": false,
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "toolTipShadowVerticalLength": 0,
 "vrPointerSelectionTime": 2000,
 "progressBarBackgroundColorDirection": "vertical",
 "progressBottom": 0,
 "playbackBarHeadShadowVerticalLength": 0,
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "paddingRight": 0,
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "vrPointerColor": "#FFFFFF",
 "transitionMode": "blending",
 "displayTooltipInTouchScreens": true,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "toolTipBorderSize": 1,
 "toolTipPaddingTop": 4,
 "toolTipPaddingLeft": 6,
 "progressBorderRadius": 0,
 "toolTipPaddingRight": 6,
 "toolTipDisplayTime": 600,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "progressBackgroundColorRatios": [
  0
 ],
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarBorderColor": "#000000",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "paddingTop": 0,
 "playbackBarHeadOpacity": 1,
 "playbackBarBottom": 5,
 "progressBackgroundColorDirection": "vertical",
 "progressBorderColor": "#000000",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "paddingBottom": 0,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipBorderColor": "#767676",
 "data": {
  "name": "Main Viewer"
 },
 "toolTipShadowSpread": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical"
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -61.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -7.96,
   "hfov": 10.51
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_0531BF7A_0E53_667A_41A9_5261BFE86443, this.camera_3228D185_0E6D_7A8E_41AB_3130E9786D41); this.mainPlayList.set('selectedIndex', 14)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -7.96,
   "yaw": -61.82,
   "hfov": 10.51,
   "image": "this.AnimatedImageResource_34C68C14_0E5F_698E_4194_3A380AD46D62",
   "distance": 100
  }
 ],
 "id": "overlay_3BB144B0_0EB3_BA86_41AA_50D3321987CC",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -21.27,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -21.54,
   "hfov": 13.4
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7, this.camera_34668369_0E6D_7F86_4196_3D267F0CF9E7); this.mainPlayList.set('selectedIndex', 0)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -21.54,
   "yaw": -21.27,
   "hfov": 13.4,
   "image": "this.AnimatedImageResource_311C621E_0EAC_99BD_41A2_0EBFF934BBF8",
   "distance": 100
  }
 ],
 "id": "overlay_2B964851_0ED4_E986_41A7_BC896569AF6F",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 24.63,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -19.72,
   "hfov": 13.56
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1, this.camera_344FB39A_0E6D_7E85_4187_B26F45472737); this.mainPlayList.set('selectedIndex', 2)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -19.72,
   "yaw": 24.63,
   "hfov": 13.56,
   "image": "this.AnimatedImageResource_311C2224_0EAC_998D_4184_DE6BAE331A4F",
   "distance": 100
  }
 ],
 "id": "overlay_2BF5BB21_0ED4_EF86_4196_2A384C58D6E9",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -65.3,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -29.27,
   "hfov": 12.57
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE, this.camera_349B935C_0E6D_7FBE_41A0_BCD3ECF67D7D); this.mainPlayList.set('selectedIndex', 6)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -29.27,
   "yaw": -65.3,
   "hfov": 12.57,
   "image": "this.AnimatedImageResource_311C8224_0EAC_998D_4183_F8D963D679AA",
   "distance": 100
  }
 ],
 "id": "overlay_2B879EC3_0ED4_A68B_419F_B218D9B08F9B",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -112.53,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_1_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -28.01,
   "hfov": 12.72
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6, this.camera_3471A375_0E6D_7F8E_41A4_3E057F5070B8); this.mainPlayList.set('selectedIndex', 7)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -28.01,
   "yaw": -112.53,
   "hfov": 12.72,
   "image": "this.AnimatedImageResource_311D6225_0EAC_998F_419A_687EC87973BD",
   "distance": 100
  }
 ],
 "id": "overlay_28EF7DEB_0ED4_EA9A_416C_233FB6E6BC90",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 81.29,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0_HS_4_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -29.27,
   "hfov": 15.85
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_05317112_0E53_7B85_4197_3B415BAAA69A, this.camera_3446338D_0E6D_7E9E_41AC_A33581913C4F); this.setComponentVisibility(this.Container_7DB20382_7065_343F_4186_6E0B0B3AFF36, false, 0, null, null, false); this.mainPlayList.set('selectedIndex', 4)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -29.27,
   "yaw": 81.29,
   "hfov": 15.85,
   "image": "this.AnimatedImageResource_34C86C0B_0E5F_699A_41A0_BD0A86FECF1D",
   "distance": 100
  }
 ],
 "id": "overlay_289908D3_0ED7_AA8A_41AC_7D8FA6ABC4C8",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 114.07,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0_HS_5_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -28.39,
   "hfov": 14.44
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B, this.camera_3487F341_0E6D_7F86_4190_3DCE39ECB765); this.mainPlayList.set('selectedIndex', 5)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -28.39,
   "yaw": 114.07,
   "hfov": 14.44,
   "image": "this.AnimatedImageResource_34C82C0B_0E5F_699A_417E_F2E0D3B7BB4C",
   "distance": 100
  }
 ],
 "id": "overlay_283C726B_0ED7_999A_4187_E8C4C02F6033",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 147.69,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_1_HS_6_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -18.79,
   "hfov": 10.88
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_05319E50_0E53_E986_41AB_485A43EDF989, this.camera_3492434F_0E6D_7F9A_4188_3726F72445B0); this.mainPlayList.set('selectedIndex', 9)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -18.79,
   "yaw": 147.69,
   "hfov": 10.88,
   "image": "this.AnimatedImageResource_311E5225_0EAC_998F_41AC_FAFCAC2B8B32",
   "distance": 100
  }
 ],
 "id": "overlay_29D22D8A_0ED7_6A85_416B_A0F6D38F3992",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -145.74,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_1_HS_7_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -19.54,
   "hfov": 10.83
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_0531E82C_0E53_A99E_419B_51B7C5C63418, this.camera_347B1381_0E6D_7E86_4120_C98A49CF8E44); this.mainPlayList.set('selectedIndex', 11)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -19.54,
   "yaw": -145.74,
   "hfov": 10.83,
   "image": "this.AnimatedImageResource_311E2226_0EAC_998D_41AA_F25D390FCBAF",
   "distance": 100
  }
 ],
 "id": "overlay_29C0548D_0ED4_9A9E_4199_3CCE3CB55F87",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -87.22,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -37.69,
   "hfov": 22.67
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_0531BF7A_0E53_667A_41A9_5261BFE86443, this.camera_3403A3DE_0E6D_7EBD_4198_E7389C23DBB9); this.mainPlayList.set('selectedIndex', 14)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -37.69,
   "yaw": -87.22,
   "hfov": 22.67,
   "image": "this.AnimatedImageResource_31064232_0EAC_9985_416A_0CDDC03FD8E9",
   "distance": 100
  }
 ],
 "id": "overlay_20327BC2_0EAD_6E85_417E_CBC248D86EC8",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -38.8,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 1.38,
   "hfov": 24.7
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 20)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": 1.38,
   "yaw": -38.8,
   "hfov": 24.7,
   "image": "this.AnimatedImageResource_31063233_0EAC_998B_41A9_E82C52524391",
   "distance": 100
  }
 ],
 "id": "overlay_20993BCA_0EAC_EE9A_4185_FFEAD5ECF4C0",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 126.26,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -18.97,
   "hfov": 18.14
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 8)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -18.97,
   "yaw": 126.26,
   "hfov": 18.14,
   "image": "this.AnimatedImageResource_34C03C10_0E5F_6986_41AA_FF15EDE1CC52",
   "distance": 100
  }
 ],
 "id": "overlay_2077F138_0EAC_FB86_41A2_E0CE5B750E38",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 89.58,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -44.84,
   "hfov": 23.93
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F, this.camera_340EC3EB_0E6D_7E9B_4176_DED0051863EF); this.mainPlayList.set('selectedIndex', 12)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -44.84,
   "yaw": 89.58,
   "hfov": 23.93,
   "image": "this.AnimatedImageResource_34C0DC10_0E5F_6986_41AA_FB62C533CB94",
   "distance": 100
  }
 ],
 "id": "overlay_20226DDE_0EAC_EABD_41AB_C753B9D70AAF",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -91.55,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -34.29,
   "hfov": 30.79
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6, this.camera_370E3291_0E6D_7E87_41A7_B990B4F51F40); this.mainPlayList.set('selectedIndex', 7)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -34.29,
   "yaw": -91.55,
   "hfov": 30.79,
   "image": "this.AnimatedImageResource_311F7228_0EAC_9985_41AA_98778C3DE489",
   "distance": 100
  }
 ],
 "id": "overlay_25A581DF_0EDF_9ABB_41A5_CB7A77324A61",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 135.3,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -19.72,
   "hfov": 19.94
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_02416052_0E5C_998A_41A2_132FE9A9DF96, this.camera_3714D29D_0E6D_7EBF_41A1_03FCDACC7F51); this.mainPlayList.set('selectedIndex', 1)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -19.72,
   "yaw": 135.3,
   "hfov": 19.94,
   "image": "this.AnimatedImageResource_311FC228_0EAC_9985_4160_4AAAFC5447B0",
   "distance": 100
  }
 ],
 "id": "overlay_258633C2_0EDF_9E85_41A9_95C687D250AC",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -165.55,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -32.91,
   "hfov": 23.48
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F, this.camera_37090285_0E6D_7E8F_41A6_7A4CC9AD7470); this.mainPlayList.set('selectedIndex', 3)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -32.91,
   "yaw": -165.55,
   "hfov": 23.48,
   "image": "this.AnimatedImageResource_311F9229_0EAC_9987_41A1_BFD1AEC9C701",
   "distance": 100
  }
 ],
 "id": "overlay_25DA9566_0EDF_9B8A_4185_AC0E9ADB1477",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 131.88,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -16.22,
   "hfov": 22.94
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70, this.camera_34EE42CD_0E6D_7E9E_4177_1ACF448949E0); this.setComponentVisibility(this.Container_7DB20382_7065_343F_4186_6E0B0B3AFF36, false, 0, null, null, false); this.mainPlayList.set('selectedIndex', 15)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -16.22,
   "yaw": 131.88,
   "hfov": 22.94,
   "image": "this.AnimatedImageResource_310DD23B_0EAC_99FB_4115_282CE3735140",
   "distance": 100
  }
 ],
 "id": "overlay_2F9C3AC8_0EF4_AE86_41A1_61507288416F",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 84.05,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -32.91,
   "hfov": 20.74
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_05369057_0E54_F98A_419C_9B00E7277DD2, this.camera_34FFE2E7_0E6D_7E8A_419F_029A9B3E63D5); this.setComponentVisibility(this.Container_7DB20382_7065_343F_4186_6E0B0B3AFF36, false, 0, null, null, false); this.mainPlayList.set('selectedIndex', 19)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -32.91,
   "yaw": 84.05,
   "hfov": 20.74,
   "image": "this.AnimatedImageResource_310DB23C_0EAC_99FD_41A2_70E358FA7824",
   "distance": 100
  }
 ],
 "id": "overlay_3DD97C70_0EB7_A987_4194_EB496D096618",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -179.73,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -36.17,
   "hfov": 19.94
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_053696A2_0E54_A68A_41A9_22F96F24D450, this.camera_34F632DA_0E6D_7EBA_4197_9A98E42C2915); this.setComponentVisibility(this.Container_7DB20382_7065_343F_4186_6E0B0B3AFF36, false, 0, null, null, false); this.mainPlayList.set('selectedIndex', 17)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -36.17,
   "yaw": -179.73,
   "hfov": 19.94,
   "image": "this.AnimatedImageResource_310C823C_0EAC_99FD_4192_00B17FCC30F2",
   "distance": 100
  }
 ],
 "id": "overlay_3DED3EC7_0EB7_A68A_4190_9077E604DB66",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -119.31,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -20.47,
   "hfov": 13.49
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_02416052_0E5C_998A_41A2_132FE9A9DF96, this.camera_35CC3437_0E6D_798B_419D_1B7B4DFBC72A); this.mainPlayList.set('selectedIndex', 1)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -20.47,
   "yaw": -119.31,
   "hfov": 13.49,
   "image": "this.AnimatedImageResource_311D0226_0EAC_998D_41A3_8209A8C1AC66",
   "distance": 100
  }
 ],
 "id": "overlay_299E30A2_0ED5_9A85_41A6_CE8E0D638336",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 83.05,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -46.35,
   "hfov": 22.95
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B, this.camera_35C2B429_0E6D_7986_4157_2C46C6237350); this.mainPlayList.set('selectedIndex', 5)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -46.35,
   "yaw": 83.05,
   "hfov": 22.95,
   "image": "this.AnimatedImageResource_311DD226_0EAC_998D_41AC_B8E44D042326",
   "distance": 100
  }
 ],
 "id": "overlay_29928DB1_0ED4_AA86_419D_F335CECAAE3B",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -179.63,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -33.41,
   "hfov": 23.35
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F, this.camera_35F7941D_0E6D_79BF_4193_22B0713986D2); this.mainPlayList.set('selectedIndex', 3)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -33.41,
   "yaw": -179.63,
   "hfov": 23.35,
   "image": "this.AnimatedImageResource_311DA227_0EAC_998B_41AB_B5813C7B996B",
   "distance": 100
  }
 ],
 "id": "overlay_27F2ED02_0ED3_AB85_419F_29D36F490DD8",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 134.37,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -16.03,
   "hfov": 18.89
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_053191B1_0E53_9A87_4178_48726558878C, this.camera_3507A021_0E6D_7986_417B_612DA1BB6638); this.mainPlayList.set('selectedIndex', 8)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -16.03,
   "yaw": 134.37,
   "hfov": 18.89,
   "image": "this.AnimatedImageResource_311E7227_0EAC_998B_419F_242489300FFE",
   "distance": 100
  }
 ],
 "id": "overlay_260783D9_0ED3_7E87_41A6_04BFD63CE95E",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -154.99,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -29.52,
   "hfov": 19.53
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F, this.camera_35347FEA_0E6D_669A_41AD_9DDB0291BA5E); this.mainPlayList.set('selectedIndex', 3)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -29.52,
   "yaw": -154.99,
   "hfov": 19.53,
   "image": "this.AnimatedImageResource_311ED227_0EAC_998B_4194_EB32C34C8FA4",
   "distance": 100
  }
 ],
 "id": "overlay_27BEDF12_0ED3_6785_419C_951A4233ACC2",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -98.14,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -38.07,
   "hfov": 22.02
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_05317112_0E53_7B85_4197_3B415BAAA69A, this.camera_353EF005_0E6D_798E_4198_B5B3A2F532C0); this.mainPlayList.set('selectedIndex', 4)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -38.07,
   "yaw": -98.14,
   "hfov": 22.02,
   "image": "this.AnimatedImageResource_311EA228_0EAC_9985_41A7_356AA1448DEB",
   "distance": 100
  }
 ],
 "id": "overlay_279BF167_0EDC_9B8A_41AB_1E2E96E54449",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 104.35,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 39,
      "height": 16
     }
    ]
   },
   "pitch": -11.12,
   "hfov": 15.42
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70, this.camera_35D75444_0E6D_798E_41A9_F59CE2349B8E); this.setComponentVisibility(this.Container_7DB20382_7065_343F_4186_6E0B0B3AFF36, false, 0, null, null, false); this.mainPlayList.set('selectedIndex', 15)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -11.12,
   "yaw": 104.35,
   "hfov": 15.42,
   "image": "this.AnimatedImageResource_310AE235_0EAC_998F_419B_DCD6E6D6231D",
   "distance": 100
  }
 ],
 "id": "overlay_2E4AF8CA_0EF4_EA9A_41A9_590743480CF9",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 72.62,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -41.2,
   "hfov": 25.96
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_053696A2_0E54_A68A_41A9_22F96F24D450, this.camera_35A0B451_0E6D_7986_41AC_A890A6EABE54); this.setComponentVisibility(this.Container_7DB20382_7065_343F_4186_6E0B0B3AFF36, false, 0, null, null, false); this.mainPlayList.set('selectedIndex', 17)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -41.2,
   "yaw": 72.62,
   "hfov": 25.96,
   "image": "this.AnimatedImageResource_310B5235_0EAC_998F_4163_89E655BCE04A",
   "distance": 100
  }
 ],
 "id": "overlay_3E60C795_0EB4_E68F_4182_037B4E6C6900",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -45.08,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -50.75,
   "hfov": 21.99
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F, this.camera_35ABA45C_0E6D_79BE_4197_6ECD62B98932); this.setComponentVisibility(this.Container_7DB20382_7065_343F_4186_6E0B0B3AFF36, false, 0, null, null, false); this.mainPlayList.set('selectedIndex', 10)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -50.75,
   "yaw": -45.08,
   "hfov": 21.99,
   "image": "this.AnimatedImageResource_310B1235_0EAC_998F_41AD_15492029C560",
   "distance": 100
  }
 ],
 "id": "overlay_3E6A5979_0EB4_EB87_41A3_C295563041EC",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -144.18,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_1_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -36.68,
   "hfov": 28.48
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setComponentVisibility(this.Container_7DB20382_7065_343F_4186_6E0B0B3AFF36, false, 0, null, null, false); this.mainPlayList.set('selectedIndex', 8)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -36.68,
   "yaw": -144.18,
   "hfov": 28.48,
   "image": "this.AnimatedImageResource_310B8235_0EAC_998F_41A4_F23F534693FE",
   "distance": 100
  }
 ],
 "id": "overlay_3E7CCB00_0EB4_EF85_41A9_E18A1F55B8BC",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 125.5,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -42.45,
   "hfov": 18.23
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_05369057_0E54_F98A_419C_9B00E7277DD2, this.camera_342F23C2_0E6D_7E85_4173_37514E5D3452); this.mainPlayList.set('selectedIndex', 19)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -42.45,
   "yaw": 125.5,
   "hfov": 18.23,
   "image": "this.AnimatedImageResource_31095234_0EAC_998D_41A2_A5DFCC0214AA",
   "distance": 100
  }
 ],
 "id": "overlay_3F0E25A0_0EAC_9A86_41A0_495D6EFC43B8",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -23.22,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -53.51,
   "hfov": 14.69
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_053696A2_0E54_A68A_41A9_22F96F24D450, this.camera_342433B4_0E6D_7E8D_4186_49ECCD78BCD1); this.mainPlayList.set('selectedIndex', 17)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -53.51,
   "yaw": -23.22,
   "hfov": 14.69,
   "image": "this.AnimatedImageResource_3109C234_0EAC_998D_418E_B3931D33B004",
   "distance": 100
  }
 ],
 "id": "overlay_3F26C7DF_0EB3_66BA_41AB_490E4EAC27F7",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -64.92,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -39.44,
   "hfov": 19.08
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C, this.camera_343A63D0_0E6D_7E85_41A3_DDB1DB6D17B0); this.mainPlayList.set('selectedIndex', 16)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -39.44,
   "yaw": -64.92,
   "hfov": 19.08,
   "image": "this.AnimatedImageResource_3109A234_0EAC_998D_415E_E72334E347CC",
   "distance": 100
  }
 ],
 "id": "overlay_3F3FB94B_0EB3_6B9B_4190_0475E8D1FECC",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 47.62,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_1_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -42.96,
   "hfov": 18.08
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF, this.camera_345AC3A6_0E6D_7E8D_419D_F332CDEA23A3); this.mainPlayList.set('selectedIndex', 18)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -42.96,
   "yaw": 47.62,
   "hfov": 18.08,
   "image": "this.AnimatedImageResource_310A7234_0EAC_998D_41AC_AB07187AFD50",
   "distance": 100
  }
 ],
 "id": "overlay_3D6D9777_0EBF_678A_41A1_6C5D34095521",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 96.71,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -29.88,
   "hfov": 23.57
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE, this.camera_329DA14B_0E6D_7B9B_4141_E2C3A9F89921); this.mainPlayList.set('selectedIndex', 6)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -29.88,
   "yaw": 96.71,
   "hfov": 23.57,
   "image": "this.AnimatedImageResource_31006229_0EAC_9987_41A6_CFE686B2AEFE",
   "distance": 100
  }
 ],
 "id": "overlay_1200316D_0EF5_FB9F_41A6_E7A017082EA2",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -134.54,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -20.14,
   "hfov": 24.1
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_053191B1_0E53_9A87_4178_48726558878C, this.camera_326D1157_0E6D_7B8B_41A7_6652B78BF132); this.mainPlayList.set('selectedIndex', 8)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -20.14,
   "yaw": -134.54,
   "hfov": 24.1,
   "image": "this.AnimatedImageResource_31003229_0EAC_9987_41AC_FAE22E15A3A5",
   "distance": 100
  }
 ],
 "id": "overlay_13E719C3_0EF5_6A8B_4180_DE5D9A5C23C3",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 158.91,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -24.49,
   "hfov": 21.11
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F, this.camera_328FA13E_0E6D_7BFD_41AA_B5C5825949A3); this.mainPlayList.set('selectedIndex', 3)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -24.49,
   "yaw": 158.91,
   "hfov": 21.11,
   "image": "this.AnimatedImageResource_31009229_0EAC_9987_41A7_F4C04EAA8614",
   "distance": 100
  }
 ],
 "id": "overlay_2735B145_0EDD_7B8E_41AB_ED9893F1B600",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 35.02,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -19.88,
   "hfov": 11.34
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B, this.camera_34CAD2F3_0E6D_7E8A_41A1_8675194EAF97); this.mainPlayList.set('selectedIndex', 5)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -19.88,
   "yaw": 35.02,
   "hfov": 11.34,
   "image": "this.AnimatedImageResource_3101622A_0EAC_9985_41A2_652AB8ED87D9",
   "distance": 100
  }
 ],
 "id": "overlay_13B01B7C_0EF7_6E7D_4180_6EE291722702",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -36.3,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -22.5,
   "hfov": 11.14
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6, this.camera_34A82315_0E6D_7F8E_4182_B8A2473B5722); this.mainPlayList.set('selectedIndex', 7)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -22.5,
   "yaw": -36.3,
   "hfov": 11.14,
   "image": "this.AnimatedImageResource_34CDAC0D_0E5F_699E_41A0_BD876DE43EB2",
   "distance": 100
  }
 ],
 "id": "overlay_108EEC5E_0EF5_69BA_4181_346D7875CAC9",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 73.68,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -28.3,
   "hfov": 15.25
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_05319E50_0E53_E986_41AB_485A43EDF989, this.camera_34D382FF_0E6D_7E7A_4192_7952B7419E9D); this.mainPlayList.set('selectedIndex', 9)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -28.3,
   "yaw": 73.68,
   "hfov": 15.25,
   "image": "this.AnimatedImageResource_3101822A_0EAC_9985_4147_AB066FD0B58C",
   "distance": 100
  }
 ],
 "id": "overlay_135443B4_0EF5_9E8E_4176_5A171D34CD8E",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 97.07,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_1_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -28.96,
   "hfov": 15.15
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F, this.camera_34BE532E_0E6D_7F9A_41AB_137D6E3AD65B); this.mainPlayList.set('selectedIndex', 10)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -28.96,
   "yaw": 97.07,
   "hfov": 15.15,
   "image": "this.AnimatedImageResource_3102622A_0EAC_9985_4192_1E1B6D50326B",
   "distance": 100
  }
 ],
 "id": "overlay_108FBA72_0EF3_6985_41A9_5D57FE1DF261",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -83.23,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_1_HS_4_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -33.56,
   "hfov": 14.43
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_0531E82C_0E53_A99E_419B_51B7C5C63418, this.camera_34B34321_0E6D_7F86_4199_2DE19ACC27EF); this.mainPlayList.set('selectedIndex', 11)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -33.56,
   "yaw": -83.23,
   "hfov": 14.43,
   "image": "this.AnimatedImageResource_3102322A_0EAC_9985_41AC_F8CFC98F712E",
   "distance": 100
  }
 ],
 "id": "overlay_10DA2339_0EF3_9F86_4191_A7B5A0ED1763",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -125.23,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_1_HS_5_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -29.49,
   "hfov": 15.07
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F, this.camera_34DE830A_0E6D_7F9A_41A4_7B7E8771F2A6); this.mainPlayList.set('selectedIndex', 12)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -29.49,
   "yaw": -125.23,
   "hfov": 15.07,
   "image": "this.AnimatedImageResource_3102922B_0EAC_999B_416E_9ED136382071",
   "distance": 100
  }
 ],
 "id": "overlay_101F5B80_0EF3_6E86_418C_CF14FD14A190",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 70.33,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -33.05,
   "hfov": 20.02
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1, this.camera_32BFA132_0E6D_7B85_419A_BF95CE4DA933); this.mainPlayList.set('selectedIndex', 2)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -33.05,
   "yaw": 70.33,
   "hfov": 20.02,
   "image": "this.AnimatedImageResource_3119921C_0EAC_99BD_4196_896309D39142",
   "distance": 100
  }
 ],
 "id": "overlay_2FFD5AFA_0EF3_EE85_4180_6F6B2099074E",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -72.9,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -32.61,
   "hfov": 20.12
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7, this.camera_32D4F0E8_0E6D_7A85_4182_DAE80B3F6F08); this.mainPlayList.set('selectedIndex', 0)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -32.61,
   "yaw": -72.9,
   "hfov": 20.12,
   "image": "this.AnimatedImageResource_311A521C_0EAC_99BD_4183_5148AC99097D",
   "distance": 100
  }
 ],
 "id": "overlay_2BE29EC9_0EED_A686_41A6_6F6B1EDFFF06",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -141.74,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_1_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -24.44,
   "hfov": 15.34
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE, this.camera_32A2E105_0E6D_7B8F_41A5_6284F9B6F61F); this.mainPlayList.set('selectedIndex', 6)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -24.44,
   "yaw": -141.74,
   "hfov": 15.34,
   "image": "this.AnimatedImageResource_311A821D_0EAC_99BF_418C_A8FD6F787B32",
   "distance": 100
  }
 ],
 "id": "overlay_2D2F86E6_0EEF_A68A_4182_8D535A4611B6",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 141.51,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_1_HS_4_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -21.3,
   "hfov": 18.75
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_05317112_0E53_7B85_4197_3B415BAAA69A, this.camera_32B27121_0E6D_7B87_419D_FC7181EA85E8); this.mainPlayList.set('selectedIndex', 4)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -21.3,
   "yaw": 141.51,
   "hfov": 18.75,
   "image": "this.AnimatedImageResource_311B521D_0EAC_99BF_41A5_81107E7244F2",
   "distance": 100
  }
 ],
 "id": "overlay_2A8CD66B_0EEF_999A_4164_D260F50B493B",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 171.07,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -25.01,
   "hfov": 21.65
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70, this.camera_3512803E_0E6D_79FA_41A9_A344EE669B46); this.setComponentVisibility(this.Container_7DB20382_7065_343F_4186_6E0B0B3AFF36, false, 0, null, null, false); this.mainPlayList.set('selectedIndex', 15)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -25.01,
   "yaw": 171.07,
   "hfov": 21.65,
   "image": "this.AnimatedImageResource_310C6235_0EAC_998F_4177_765543818B43",
   "distance": 100
  }
 ],
 "id": "overlay_2F8CB401_0EF7_9986_4185_BF1B03715FA9",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -93.81,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -35.67,
   "hfov": 20.07
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C, this.camera_32E7F075_0E6D_798E_4194_22F0F4CC7E70); this.setComponentVisibility(this.Container_7DB20382_7065_343F_4186_6E0B0B3AFF36, false, 0, null, null, false); this.mainPlayList.set('selectedIndex', 16)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -35.67,
   "yaw": -93.81,
   "hfov": 20.07,
   "image": "this.AnimatedImageResource_310C3236_0EAC_998D_4181_9723259FAAC2",
   "distance": 100
  }
 ],
 "id": "overlay_3F9CC63B_0EB5_79FA_419A_76D40C44C6EF",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 84.8,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -36.17,
   "hfov": 19.94
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF, this.camera_351DA059_0E6D_7986_4189_91ADA8B533B6); this.setComponentVisibility(this.Container_7DB20382_7065_343F_4186_6E0B0B3AFF36, false, 0, null, null, false); this.mainPlayList.set('selectedIndex', 18)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -36.17,
   "yaw": 84.8,
   "hfov": 19.94,
   "image": "this.AnimatedImageResource_310CA236_0EAC_998D_4198_1F3A2EE49794",
   "distance": 100
  }
 ],
 "id": "overlay_3FA947C1_0EB5_6687_41A6_0F6A3468F8E6",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -119.74,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_1_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -24.52,
   "hfov": 14.96
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.setComponentVisibility(this.Container_7DB20382_7065_343F_4186_6E0B0B3AFF36, false, 0, null, null, false); this.mainPlayList.set('selectedIndex', 8)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -24.52,
   "yaw": -119.74,
   "hfov": 14.96,
   "image": "this.AnimatedImageResource_310D7236_0EAC_998D_4198_B9F7DF86B3E1",
   "distance": 100
  }
 ],
 "id": "overlay_3FBD697A_0EB5_6A7A_4193_522595AC04C7",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 145.35,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -25.37,
   "hfov": 22.32
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_053191B1_0E53_9A87_4178_48726558878C, this.camera_32C9C0CC_0E6D_7A9D_4187_136991DC4F76); this.mainPlayList.set('selectedIndex', 8)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -25.37,
   "yaw": 145.35,
   "hfov": 22.32,
   "image": "this.AnimatedImageResource_31054232_0EAC_9985_41AA_C92B8EE8B747",
   "distance": 100
  }
 ],
 "id": "overlay_23504A43_0ED3_698A_4190_A761A409986A",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -80.75,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -47.98,
   "hfov": 16.54
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC, this.camera_32F28090_0E6D_7A86_41A9_93FE3B37BD1B); this.mainPlayList.set('selectedIndex', 13)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -47.98,
   "yaw": -80.75,
   "hfov": 16.54,
   "image": "this.AnimatedImageResource_31052232_0EAC_9985_41A4_6FACAAE65A4A",
   "distance": 100
  }
 ],
 "id": "overlay_209EFBBB_0ED3_6EFA_41A6_302E73D11154",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 89.07,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_1_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -29.89,
   "hfov": 21.42
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_0531E82C_0E53_A99E_419B_51B7C5C63418, this.camera_32FDD0B1_0E6D_7A86_41A9_52672D720068); this.mainPlayList.set('selectedIndex', 11)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -29.89,
   "yaw": 89.07,
   "hfov": 21.42,
   "image": "this.AnimatedImageResource_3105F232_0EAC_9985_4199_7191B1EA5817",
   "distance": 100
  }
 ],
 "id": "overlay_20BFF6F7_0EAC_A68A_4182_80C028ECB674",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 95.45,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -29.28,
   "hfov": 20.84
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_02416052_0E5C_998A_41A2_132FE9A9DF96, this.camera_352BFFCE_0E6D_669A_41A4_CF6186AE4EC0); this.mainPlayList.set('selectedIndex', 1)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -29.28,
   "yaw": 95.45,
   "hfov": 20.84,
   "image": "this.AnimatedImageResource_3119621B_0EAC_99BB_41A5_84CB508E3863",
   "distance": 100
  }
 ],
 "id": "overlay_2E66A181_0EF5_9A86_41A9_FF867A310491",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 139.54,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -13.32,
   "hfov": 13.11
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F, this.camera_35225FAE_0E6D_669D_41A8_91860845C630); this.mainPlayList.set('selectedIndex', 3)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -13.32,
   "yaw": 139.54,
   "hfov": 13.11,
   "image": "this.AnimatedImageResource_3119C21B_0EAC_99BB_418A_8FD0E46AAA3F",
   "distance": 100
  }
 ],
 "id": "overlay_2CE46EA2_0EF4_E68A_41AC_9DF1B479927B",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 179.77,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -29.89,
   "hfov": 21.42
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_053191B1_0E53_9A87_4178_48726558878C, this.camera_35ECB40F_0E6D_799B_41A2_83FEFE8194CD); this.mainPlayList.set('selectedIndex', 8)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -29.89,
   "yaw": 179.77,
   "hfov": 21.42,
   "image": "this.AnimatedImageResource_3103F231_0EAC_9987_419E_0C64A3FF98C1",
   "distance": 100
  }
 ],
 "id": "overlay_22BD8F26_0ED4_A78D_4168_8536F0382FA0",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 114.59,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -15.92,
   "hfov": 12.47
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F, this.camera_341813F9_0E6D_7E87_419D_81807972B26E); this.mainPlayList.set('selectedIndex', 3)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -15.92,
   "yaw": 114.59,
   "hfov": 12.47,
   "image": "this.AnimatedImageResource_31044231_0EAC_9987_41A7_D9D4EBCE26D8",
   "distance": 100
  }
 ],
 "id": "overlay_2266F03C_0ED4_99FE_4192_76A2B02C24F3",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -91.05,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -36.43,
   "hfov": 19.88
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F, this.camera_35E33405_0E6D_798F_4165_46A0F6CD8BEC); this.mainPlayList.set('selectedIndex', 12)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -36.43,
   "yaw": -91.05,
   "hfov": 19.88,
   "image": "this.AnimatedImageResource_31042232_0EAC_9985_41AB_18FE26D045DB",
   "distance": 100
  }
 ],
 "id": "overlay_23B10488_0ED4_9A86_4183_AF24C005FFA0",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -126.95,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -20.53,
   "hfov": 18.55
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F, this.camera_37386263_0E6D_798B_41AC_EF852A9732EA); this.mainPlayList.set('selectedIndex', 3)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -20.53,
   "yaw": -126.95,
   "hfov": 18.55,
   "image": "this.AnimatedImageResource_34CC8C0E_0E5F_699A_41A2_F98212FB58E9",
   "distance": 100
  }
 ],
 "id": "overlay_11D6F8E2_0EFC_EA8A_4195_1F49FF504CA0",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 91.23,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -48.48,
   "hfov": 23.58
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F, this.camera_373C9270_0E6D_7985_41A9_E069DE8A748D); this.mainPlayList.set('selectedIndex', 10)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -48.48,
   "yaw": 91.23,
   "hfov": 23.58,
   "image": "this.AnimatedImageResource_34CF5C0E_0E5F_699A_418F_A04B3EC42058",
   "distance": 100
  }
 ],
 "id": "overlay_11C979FB_0EFF_AA7B_41A1_25193DF28509",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 171.1,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -26.63,
   "hfov": 25
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_053191B1_0E53_9A87_4178_48726558878C, this.camera_3703327A_0E6D_7985_41A8_18A94829447E); this.mainPlayList.set('selectedIndex', 8)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -26.63,
   "yaw": 171.1,
   "hfov": 25,
   "image": "this.AnimatedImageResource_3103A22B_0EAC_999B_4186_23FAC2609833",
   "distance": 100
  }
 ],
 "id": "overlay_255F67F2_0ED4_A68A_4196_D5DB769DCC77",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -147.98,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -18.23,
   "hfov": 22.69
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70, this.camera_327B1161_0E6D_7B86_41A4_62D6C866AF61); this.mainPlayList.set('selectedIndex', 15)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -18.23,
   "yaw": -147.98,
   "hfov": 22.69,
   "image": "this.AnimatedImageResource_310D723C_0EAC_99FD_41A4_941042030CCB",
   "distance": 100
  }
 ],
 "id": "overlay_2EEFDBC4_0EF4_EE8E_41A5_34BEF1D75D65",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 88.07,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -30.65,
   "hfov": 21.25
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_0531BF7A_0E53_667A_41A9_5261BFE86443, this.camera_325A4179_0E6D_7B86_41A4_B2136096CF51); this.mainPlayList.set('selectedIndex', 14)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -30.65,
   "yaw": 88.07,
   "hfov": 21.25,
   "image": "this.AnimatedImageResource_310DC23C_0EAC_99FD_41AC_AD3C079A158C",
   "distance": 100
  }
 ],
 "id": "overlay_3A8474BF_0EBD_FAFA_4187_A3EF6F3F4D0D",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -94.32,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -32.15,
   "hfov": 20.91
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF, this.camera_324B716C_0E6D_7B9E_4174_28324827980A); this.mainPlayList.set('selectedIndex', 18)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -32.15,
   "yaw": -94.32,
   "hfov": 20.91,
   "image": "this.AnimatedImageResource_310DA23C_0EAC_99FE_4194_137F2BAC189E",
   "distance": 100
  }
 ],
 "id": "overlay_3A9646FF_0EBD_E67B_41A5_F4712D5D4322",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 113.44,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -52,
   "hfov": 23.25
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C, this.camera_32382192_0E6D_7A8A_41AA_70E779B5587D); this.mainPlayList.set('selectedIndex', 16)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -52,
   "yaw": 113.44,
   "hfov": 23.25,
   "image": "this.AnimatedImageResource_34CFDC0E_0E5F_699A_41A7_C0132A4A0B4C",
   "distance": 100
  }
 ],
 "id": "overlay_258291D2_0ED5_9A85_419C_FF5EE670A6AB",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -99.47,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -48.36,
   "hfov": 22.59
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_05319E50_0E53_E986_41AB_485A43EDF989, this.camera_3725A232_0E6D_7985_41A0_D6224B273198); this.mainPlayList.set('selectedIndex', 9)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -48.36,
   "yaw": -99.47,
   "hfov": 22.59,
   "image": "this.AnimatedImageResource_3104E22C_0EAC_999D_4185_EA56922B5EC2",
   "distance": 100
  }
 ],
 "id": "overlay_25ED5469_0ED5_9986_41A7_F24B5EEF2595",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -161.9,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -31.65,
   "hfov": 21.03
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_053191B1_0E53_9A87_4178_48726558878C, this.camera_3729B23F_0E6D_79FB_4197_958BBD1F4C8B); this.mainPlayList.set('selectedIndex', 8)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -31.65,
   "yaw": -161.9,
   "hfov": 21.03,
   "image": "this.AnimatedImageResource_3104B231_0EAC_9987_4190_DD4F626D47EC",
   "distance": 100
  }
 ],
 "id": "overlay_25DB9628_0ED5_9986_4143_BD65B72E1EF8",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -83.75,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -41.49,
   "hfov": 22.47
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_02416052_0E5C_998A_41A2_132FE9A9DF96, this.camera_37323258_0E6D_7985_418B_302A714C1BD9); this.mainPlayList.set('selectedIndex', 0); this.mainPlayList.set('selectedIndex', 1)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -41.49,
   "yaw": -83.75,
   "hfov": 22.47,
   "image": "this.AnimatedImageResource_311B321E_0EAC_99BD_418C_566D793B85F3",
   "distance": 100
  }
 ],
 "id": "overlay_2BF0B1B6_0EEC_BA8A_4195_833AD49B6CE1",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -148.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -20.13,
   "hfov": 13.52
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F, this.camera_372E024B_0E6D_799B_41A2_C328D684E006); this.mainPlayList.set('selectedIndex', 3)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -20.13,
   "yaw": -148.82,
   "hfov": 13.52,
   "image": "this.AnimatedImageResource_311B921E_0EAC_99BD_41A8_A34C8132410A",
   "distance": 100
  }
 ],
 "id": "overlay_2BABBA2F_0ED3_A99B_41A5_475D873867A5",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -113.14,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 39,
      "height": 16
     }
    ]
   },
   "pitch": -9.21,
   "hfov": 10.97
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 15)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -9.21,
   "yaw": -113.14,
   "hfov": 10.97,
   "image": "this.AnimatedImageResource_3107C233_0EAC_998B_4192_3297A04D64FE",
   "distance": 100
  }
 ],
 "id": "overlay_2E20CEB3_0EF5_A68A_41AC_FD739032860D",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 173.49,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -33.66,
   "hfov": 20.56
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC, this.camera_371902AA_0E6D_7E85_418D_586BC4D5E10A); this.mainPlayList.set('selectedIndex', 13)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -33.66,
   "yaw": 173.49,
   "hfov": 20.56,
   "image": "this.AnimatedImageResource_31079233_0EAC_998B_41A8_7171B80EABC1",
   "distance": 100
  }
 ],
 "id": "overlay_21A367C8_0EAC_E686_41A0_095D34F69F03",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -93.81,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -35.67,
   "hfov": 20.07
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_05369057_0E54_F98A_419C_9B00E7277DD2, this.camera_34E6A2C2_0E6D_7E85_418E_6A4D2A93D82E); this.mainPlayList.set('selectedIndex', 19)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -35.67,
   "yaw": -93.81,
   "hfov": 20.07,
   "image": "this.AnimatedImageResource_31080233_0EAC_998B_41A8_EB444B8E8400",
   "distance": 100
  }
 ],
 "id": "overlay_21281742_0EAC_E785_4180_1FF9283F0C61",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 104.27,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_1_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -2.76,
   "hfov": 27.94
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362, this.camera_34E092B6_0E6D_7E8D_41AD_667DEA1D2582); this.mainPlayList.set('selectedIndex', 20)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -2.76,
   "yaw": 104.27,
   "hfov": 27.94,
   "image": "this.AnimatedImageResource_3108E234_0EAC_998D_4194_DEEDF20BB338",
   "distance": 100
  }
 ],
 "id": "overlay_3C34DD73_0EAD_6B8A_41AD_4D7A15410775",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_0536ACFF_0E54_EA7A_419B_204B4E6AC362_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 800,
   "height": 1200
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_34C68C14_0E5F_698E_4194_3A380AD46D62",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_311C621E_0EAC_99BD_41A2_0EBFF934BBF8",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_311C2224_0EAC_998D_4184_DE6BAE331A4F",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_311C8224_0EAC_998D_4183_F8D963D679AA",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_1_HS_3_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_311D6225_0EAC_998F_419A_687EC87973BD",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0_HS_4_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_34C86C0B_0E5F_699A_41A0_BD0A86FECF1D",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_0_HS_5_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_34C82C0B_0E5F_699A_417E_F2E0D3B7BB4C",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_1_HS_6_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_311E5225_0EAC_998F_41AC_FAFCAC2B8B32",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_053164C6_0E5C_9A8D_41A3_751BE696D42F_1_HS_7_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_311E2226_0EAC_998D_41AA_F25D390FCBAF",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_31064232_0EAC_9985_416A_0CDDC03FD8E9",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 800,
   "height": 1200
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_31063233_0EAC_998B_41A9_E82C52524391",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_34C03C10_0E5F_6986_41AA_FF15EDE1CC52",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_0531B17E_0E53_9A7A_415A_30538CEC94CC_0_HS_3_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_34C0DC10_0E5F_6986_41AA_FB62C533CB94",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_311F7228_0EAC_9985_41AA_98778C3DE489",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_311FC228_0EAC_9985_4160_4AAAFC5447B0",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_05308914_0E53_AB8E_417B_B8E16C51CCEE_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_311F9229_0EAC_9987_41A1_BFD1AEC9C701",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_310DD23B_0EAC_99FB_4115_282CE3735140",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_310DB23C_0EAC_99FD_41A2_70E358FA7824",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_053653E5_0E54_9E8F_419B_20FCB1190FEF_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_310C823C_0EAC_99FD_4192_00B17FCC30F2",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_311D0226_0EAC_998D_41A3_8209A8C1AC66",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_311DD226_0EAC_998D_41AC_B8E44D042326",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_05317112_0E53_7B85_4197_3B415BAAA69A_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_311DA227_0EAC_998B_41AB_B5813C7B996B",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_311E7227_0EAC_998B_419F_242489300FFE",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_311ED227_0EAC_998B_4194_EB32C34C8FA4",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_05315CE6_0E53_6A8A_41A7_69DAF1CDC19B_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_311EA228_0EAC_9985_41A7_356AA1448DEB",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 660
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_310AE235_0EAC_998F_419B_DCD6E6D6231D",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_310B5235_0EAC_998F_4163_89E655BCE04A",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_310B1235_0EAC_998F_41AD_15492029C560",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_05367A12_0E54_A98A_41AB_1AF29C217F4C_1_HS_3_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_310B8235_0EAC_998F_41A4_F23F534693FE",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_31095234_0EAC_998D_41A2_A5DFCC0214AA",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_3109C234_0EAC_998D_418E_B3931D33B004",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_3109A234_0EAC_998D_415E_E72334E347CC",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_0531BDB4_0E53_6A8E_4143_91A8CFFBAB70_1_HS_3_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_310A7234_0EAC_998D_41AC_AB07187AFD50",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_31006229_0EAC_9987_41A6_CFE686B2AEFE",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_31003229_0EAC_9987_41AC_FAE22E15A3A5",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_0531D593_0E53_BA8A_41A3_8968342B9EF6_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_31009229_0EAC_9987_41A7_F4C04EAA8614",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_3101622A_0EAC_9985_41A2_652AB8ED87D9",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_34CDAC0D_0E5F_699E_41A0_BD876DE43EB2",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_3101822A_0EAC_9985_4147_AB066FD0B58C",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_1_HS_3_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_3102622A_0EAC_9985_4192_1E1B6D50326B",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_1_HS_4_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_3102322A_0EAC_9985_41AC_F8CFC98F712E",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_053191B1_0E53_9A87_4178_48726558878C_1_HS_5_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_3102922B_0EAC_999B_416E_9ED136382071",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_3119921C_0EAC_99BD_4196_896309D39142",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_311A521C_0EAC_99BD_4183_5148AC99097D",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_1_HS_3_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_311A821D_0EAC_99BF_418C_A8FD6F787B32",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_02416052_0E5C_998A_41A2_132FE9A9DF96_1_HS_4_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_311B521D_0EAC_99BF_41A5_81107E7244F2",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_310C6235_0EAC_998F_4177_765543818B43",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_310C3236_0EAC_998D_4181_9723259FAAC2",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_310CA236_0EAC_998D_4198_1F3A2EE49794",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_053696A2_0E54_A68A_41A9_22F96F24D450_1_HS_3_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_310D7236_0EAC_998D_4198_B9F7DF86B3E1",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_31054232_0EAC_9985_41AA_C92B8EE8B747",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_31052232_0EAC_9985_41A4_6FACAAE65A4A",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_0531F4CE_0E53_BA9A_418C_79AAB04A3A1F_1_HS_3_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_3105F232_0EAC_9985_4199_7191B1EA5817",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_3119621B_0EAC_99BB_41A5_84CB508E3863",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_05302C76_0E5C_A98A_41A2_420DB956D8F7_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_3119C21B_0EAC_99BB_418A_8FD0E46AAA3F",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_3103F231_0EAC_9987_419E_0C64A3FF98C1",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_31044231_0EAC_9987_41A7_D9D4EBCE26D8",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_0531E82C_0E53_A99E_419B_51B7C5C63418_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_31042232_0EAC_9985_41AB_18FE26D045DB",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_34CC8C0E_0E5F_699A_41A2_F98212FB58E9",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_34CF5C0E_0E5F_699A_418F_A04B3EC42058",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_05319E50_0E53_E986_41AB_485A43EDF989_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_3103A22B_0EAC_999B_4186_23FAC2609833",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_310D723C_0EAC_99FD_41A4_941042030CCB",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_310DC23C_0EAC_99FD_41AC_AD3C079A158C",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_05369057_0E54_F98A_419C_9B00E7277DD2_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_310DA23C_0EAC_99FE_4194_137F2BAC189E",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_34CFDC0E_0E5F_699A_41A7_C0132A4A0B4C",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_3104E22C_0EAC_999D_4185_EA56922B5EC2",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_05319A7E_0E53_EE7D_4196_34AEAC10836F_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_3104B231_0EAC_9987_4190_DD4F626D47EC",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_311B321E_0EAC_99BD_418C_566D793B85F3",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_0532B84F_0E5C_A99B_41AB_B63F39760FF1_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_311B921E_0EAC_99BD_41A8_A34C8132410A",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 660
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_3107C233_0EAC_998B_4192_3297A04D64FE",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_31079233_0EAC_998B_41A8_7171B80EABC1",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 1080,
   "height": 900
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_31080233_0EAC_998B_41A8_EB444B8E8400",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_0531BF7A_0E53_667A_41A9_5261BFE86443_1_HS_3_0.png",
   "class": "ImageResourceLevel",
   "width": 800,
   "height": 1200
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_3108E234_0EAC_998D_4194_DEEDF20BB338",
 "colCount": 4
}],
 "scrollBarColor": "#000000",
 "desktopMipmappingEnabled": false,
 "layout": "absolute",
 "paddingTop": 0,
 "propagateClick": false,
 "gap": 10,
 "mouseWheelEnabled": true,
 "backgroundPreloadEnabled": true,
 "scrollBarOpacity": 0.5,
 "mobileMipmappingEnabled": false,
 "data": {
  "name": "Player112042"
 },
 "paddingBottom": 0,
 "shadow": false,
 "overflow": "visible",
 "vrPolyfillScale": 0.5
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
