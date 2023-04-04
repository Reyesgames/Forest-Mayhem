/**
 * FGL SDK - Implement this into your game!
 *
 * For more information see the Implementation Guide or API documentation
 */
   
window.fgl =   new function(){
    var self = this;

    self.SIZE_300x250 =  01;
    self.SIZE_OVERLAY =  02;
    
    self.overlay = null;
    self.overlayClose = null;
    self.ready = false;
    self.readyFunctions = [];
    
    self.container = null;
    self.gameId    = '';
	
	
    self.create = function(gameElement, gameId) {
        if( ! (gameElement instanceof Element)){
            try { // Is it jQuery selected?
                gameElement = gameElement[0];
            }catch(exception){}
            if( ! (gameElement instanceof Element)){
                alert("Error: The gameElement that you passed to the FGL SDK is invalid");
                throw "Error: The gameElement that you passed to the FGL SDK is invalid";
            }
        }
        self.gameId = gameId;
        self.container = gameElement;
    };
    
    /**
     * Not currently implemented
     */
    self.reportGameState = function(state) {
        // Placeholder
    };
    
    /**
     * Not currently implemented
     */
    self.requestQuit = function() {
        // Placeholder
    };
    
    /**
     * @private
     */
    self.ads = new function(){
        var ad_self = this;
        ad_self.loadTimeout = 0;
        ad_self.pool = [];
        
        ad_self.register = function(ads){
            for(var i in ads){
                ad_self.pool.push(ads[i]);
            }
            ad_self.loaded();
        };
        
        ad_self.next = function(){
            if (ad_self.pool.length == 0) return null;
            var ad = ad_self.pool.shift();
            ad_self.pool.push(ad);
            return ad;
        };
        
        ad_self.loaded = function(){
            clearTimeout(ad_self.loadTimeout);
            self.doReadyEvents();
        };
        
        ad_self.initScript = function(){
            var load = document.createElement('script');
            load.src = 'https://reports.fgl.com/sandbox/ads/html5/';
            document.body.appendChild(load);
            ad_self.loadTimeout = setTimeout(ad_self.loaded, 1500);
            return load;
        }();
        
    }();
    
    /**
     * 
     */
    self.doReadyEvents = function(){
        for(var i in self.readyFunctions){
            self.readyFunctions[i]();
        }
        self.ready = true;
    }
    
    /**
     * Pass your game's initialiser functions to this
     */
    self.onReady = function(f){
        if(self.ready) f();
        else self.readyFunctions.push(f);
    }
  
    /**
     * Displays an advert
     */
    self.show3rdPartyAd = self.showAd = function(options) {
        var ad = self.ads.next();
        
        if(ad == null) return;
        
        var adLink = document.createElement('a');
        adLink.href = ad.link;
        
        var adImage = document.createElement('img');
        adImage.src = ad.image;
        adImage.style.width = ad.width + "px";
        adImage.style.height = ad.height + "px";
        
        adLink.appendChild(adImage);
        
        var overlay = self.addOverlay();
        overlay.style.textAlign  = 'center';
        overlay.style.height     = (self.container.offsetHeight - (self.container.offsetHeight - ad.image_height)/2) + 'px';
        overlay.style.paddingTop = (self.container.offsetHeight - ad.image_height)/2 + 'px';
        overlay.appendChild(adLink);
    };
    
    /**
     * Submits the given score to the specified leaderboard. If your game
     * only has one leaderboard, do not supply a leaderboardID.
     */
    self.submitScore = function(score, leaderboardID, extra) {
        leaderboardID = leaderboardID || 'default';
        var overlay = self.addOverlay();
        overlay.style.textAlign = 'center';
        overlay.style.lineHeight = self.container.offsetHeight + "px";
        overlay.style.color = "#FFFFFF";
        overlay.style.fontFamily = 'sans-serif, arial';
        overlay.style.fontSize   = '22px';
        overlay.innerHTML = "SUCCESS: Submit score of " + score + " to leaderboard '" + leaderboardID + "'";
    }
    
    /** 
     * Displays the scoreboard UI over your game
     */
    self.displayScoreboard = function(leaderboardID) {
        leaderboardID = leaderboardID || 'default';
        
        var overlay = self.addOverlay();
        overlay.style.textAlign = 'center';
        overlay.style.lineHeight = self.container.offsetHeight + "px";
        overlay.style.color = "#FFFFFF";
        overlay.style.fontFamily = 'sans-serif, arial';
        overlay.style.fontSize   = '22px';
        overlay.innerHTML = "Placeholder for leaderboard: " + leaderboardID;
    }
    
    /** 
     * Removes the scoreboard UI from your game
     */
    self.hideScoreboard = function() {
        self.removeOverlay();
    }
    
    /** 
     * Grants the specified achievement to the player
     */
    self.grantAchievement = function(achievementId) {
        // Placeholder
    }
    
    /** 
     * Shows a list of achievements with their locked/unlocked states
     */
    self.showAchievements = function() {
        // Placeholder
    }
    
    /** 
     * Returns true if the player has unlocked the specified achievement
     */
    self.hasAchievement = function(achievementId) {
        return false;
    }
    
    /** 
     * Gives access to the In app purchasing functions.
     */
    self.inApp = new function(){
        var inApp_self = this;
        
        /**
         * Returns true if the app has been unlocked by a payment.
         */
        inApp_self.isUnlocked = function(item) {
            item = item || 'unlock';
            return inApp_self.unlocked || false;
        }
        
        /**
         * Begins the process of unlocking a game.
         */
        inApp_self.initiateUnlockFunction = function(successFunction, failFunction) {
            if(inApp_self.isUnlocked()){
                successFunction();
                return;
            }
            
            self.addOverlay();
            setTimeout(function(){
                var r = confirm("EXAMPLE: In app purchase. Press 'OK' to simulate a succesful in app purchase, 'Cancel' otherwise.\n\nOK: Succesful Purchase\nCancel: Failed purchase");
                self.removeOverlay();
                
                if(r){
                    inApp_self.unlocked = true;
                    successFunction();
                }else{
                    inApp_self.unlocked = false;
                    failFunction();
                }
            }, 10);
        }
    };
    
    /**
     * Displays the "More Games" page
     */
    self.showMoreGames = function() {
        self.addOverlay('iframe').src = "http://moregames.differencegames.com/v/2/html5/" + self.gameId + "/";
    };
    
    /**
     * 
     */
    self.removeOverlay = function() {
        try{ self.overlay.parentNode.removeChild(self.overlay); }catch(e){}
        try{ self.overlayClose.parentNode.removeChild(self.overlayClose); }catch(e){}
        self.overlay = null;
        self.overlayClose = null;
    }
    
    /**
     * 
     */
    self.addOverlay = function(type) {
        if(self.overlay != null){
            self.removeOverlay();
        }
    
        type = type || 'div';
    
        self.overlay = document.createElement(type);
        self.overlay.style.position = "fixed";
        self.overlay.style.top = self.container.offsetTop + 'px';
        self.overlay.style.left = self.container.offsetLeft + 'px';
        self.overlay.style.width = self.container.offsetWidth + "px";
        self.overlay.style.height = self.container.offsetHeight + "px";
        self.overlay.style.border = "0 none";
        self.overlay.style.backgroundColor = "rgba(0,0,0,0.8)";
        
        var close = document.createElement("a");
        
        close.style.position = 'absolute';
        close.style.zIndex = 5;
        close.style.top = (self.container.offsetTop + 10) + 'px';
        close.style.left = (self.container.offsetLeft + self.container.offsetWidth-70) + 'px';
        close.style.width = '50px';
        close.style.height = '50px';
        close.style.backgroundColor = 'rgba(255,255,255,0.8)';
        close.style.color = '#333333';
        close.style.fontSize = '40px';
        close.style.textDecoration = 'none';
        close.style.fontWeight = 'bold';
        close.style.textAlign = 'center';
        close.style.lineHeight = '50px';
        close.style.borderRadius = '10px';
        close.innerHTML = '&times;';
        close.href = '#';
        close.onclick = function(){
			self.removeOverlay();
            return true;
        };
        
        self.overlayClose = close;
        
        self.container.parentNode.appendChild(self.overlay);
        self.container.parentNode.appendChild(self.overlayClose);
        
        return self.overlay;
    }
}();