$('document').ready(function(){
	window._trot_main = new TrotMain().Init();
});

function TrotMain(){
	var self = this;

	this.Init = function(){	
		self.InitHandle();
		self.OpenMenu('home');
		self.InitMessageHandler();
		self.InitPullToRequest();
		return this;
	};

	this.InitHandle = function(){
	};

	this.InitMessageHandler = function(){
		window.addEventListener("message", (event) => {
			console.log('evnet ' + event);
			var message = event.data;
			if(message.head == 'undefined'){
				return;
			}else if(message.head == 'MANGO'){
				if(message.command == 'ChangeMenu'){
					console.log('message.menu ' + message.menu);
					self.OpenMenu(message.menu);
				}else if(message.command == 'FindFavoriteMusic'){
					console.log('FindFavoriteMusic ');
					console.log('message.music_list.length ' + message.music_list.length);
					for(var i=0 ; i<message.music_list.length ; i++){
						if(message.music_list[i].is_multiple){
							message.music_list[i].is_favorite = window._favorite_control.FindMusicMulti(message.music_list[i].music_uid);
						}else{
							message.music_list[i].is_favorite = window._favorite_control.FindMusicSingle(message.music_list[i].music_uid);
						}
					}
					var message = {
						head: 'MANGO',
						command: 'FindFavoriteMusicResponse',
						music_list: message.music_list
					};
					parent.postMessage(message, "*");				
				}
			}
		}, false);
	};

	//-------------------------------------------------------------
	this._menu_loaded_home = false;
	this._menu_loaded_artist = false;
	this._menu_loaded_multi = false;
	this._menu_loaded_single = false;
	this._menu_loaded_my = false;
	this.OpenMenu = function(menu, reload){
		$('#id_menu_home').hide();
		$('#id_menu_artist').hide();
		$('#id_menu_multi').hide();
		$('#id_menu_single').hide();
		$('#id_menu_my').hide();

		if(window._mango_player != null){
			window._mango_player.PlayList_Hide();
		}

		switch(menu){
			case 'home':
				$('#id_menu_home').show();
				if(self._menu_loaded_home == false | reload){
					$('#id_menu_home').load(`./home.html`);
					self._menu_loaded_home = true;
				}
				break;
			case 'artist':
				$('#id_menu_artist').show();
				if(self._menu_loaded_artist == false | reload){
					$('#id_menu_artist').load(`./artist.html`);
					self._menu_loaded_artist = true;
				}
				break;
			case 'multi':
				$('#id_menu_multi').show();
				if(self._menu_loaded_multi == false | reload){
					console.log('load multi ');
					$('#id_menu_multi').load(`./multi.html`);
					self._menu_loaded_multi = true;
				}
				break;
			case 'single':
				$('#id_menu_single').show();
				if(self._menu_loaded_single == false | reload){
					$('#id_menu_single').load(`./single.html`);
					self._menu_loaded_single = true;
				}
				break;
			case 'my':
				$('#id_menu_my').show();
				if(self._menu_loaded_my == false | reload){
					$('#id_menu_my').load(`./my.html`);
					self._menu_loaded_my = true;
				}
			break;
		}
	};

	this.InitPullToRequest = function(div_name, menu){
		console.log('init pull refresh ' + div_name + ' ' + menu);

		PullToRefresh.init({
			mainElement: '#id_menu_home',
			triggerElement: '#id_menu_home',
			onRefresh: function () {
				self.OpenMenu('home', true);
			},
			shouldPullToRefresh: function(){
				return !this.mainElement.scrollTop;
			}
		});

		PullToRefresh.init({
			mainElement: '#id_menu_multi',
			triggerElement: '#id_menu_multi',
			onRefresh: function () {
				self.OpenMenu('multi', true);
			},
			shouldPullToRefresh: function(){
				return !this.mainElement.scrollTop;
			}
		});

		PullToRefresh.init({
			mainElement: '#id_menu_single',
			triggerElement: '#id_menu_single',
			onRefresh: function () {
				self.OpenMenu('single', true);
			},
			shouldPullToRefresh: function(){
				return !this.mainElement.scrollTop;
			}
		});
		
		PullToRefresh.init({
			mainElement: '#id_menu_artist',
			triggerElement: '#id_menu_artist',
			onRefresh: function () {
				self.OpenMenu('artist', true);
			},
			shouldPullToRefresh: function(){
				return !this.mainElement.scrollTop;
			}
		});

		PullToRefresh.init({
			mainElement: '#id_menu_my',
			triggerElement: '#id_menu_my',
			onRefresh: function () {
				self.OpenMenu('my', true);
			},
			shouldPullToRefresh: function(){
				return !this.mainElement.scrollTop;
			}
		});

	};
}