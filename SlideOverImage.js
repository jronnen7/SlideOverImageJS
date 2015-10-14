/*
 * EXAMPLE USAGE Code tested for below div structure
 * 
 * <div id =parentDivId>
 * 		<div class=containersDivClassName>
 * 			<img></img> (this can be in its own div but cannot share teamdesc div )
 * 			<div class=descDivClassName></div>
 * 		</div> 
 * 		<div class=containersDivClassName>
 * 			<img></img> (this can be in its own div but cannot share teamdesc div )
 * 			<div class=descDivClassName></div>
 * 		</div>
 * 		<div class=containersDivClassName>
 * 			<img></img> (this can be in its own div but cannot share teamdesc div )
 * 			<div class=descDivClassName></div>
 * 		</div> 	
 * 		<div class=containersDivClassName>
 * 			<img></img> (this can be in its own div but cannot share teamdesc div )
 * 			<div class=descDivClassName></div>
 * 		</div> 
 * </div>
 * 
 * 
 * DONT FORGET THE CSS FOR SLIDE EFFECTS
 * 		EXAMPLE CSS 
 * 		.containersDivClassName img,
 *		.containersDivClassName .descDivClassName {
 *			transition: all ease-in-out .7s;
 *		}
 *	  	.containersDivClassName .descDivClassName {
 *			color:white;
 *			opacity:.9;
 *			background-color:black;
 *		}
 * */


SlideOverImage.prototype.SetupScrollPattern = function () {
	this.imgDelta = .2; // percentage image scroll value between 0 - 1,
	
 	this.imgDir[0] = 'down';
 	this.imgDir[1] = 'down';
 	this.imgDir[2] = 'down';
 	this.imgDir[3] = 'down';
 	this.divDir[0] = 'left';
 	this.divDir[1] = 'right';
 	this.divDir[2] = 'left';
 	this.divDir[3] = 'right';

 	//make your magic pattern happen here.... this.totalContainers = total number members
 	/*TODO - WRITE CODE FOR SCROLL PATTERN*/
};

// parentDivId - any id on the page (containing all team members).  
// containersDivClassName - Name of class that is wrapped around entire team member
// descDivClassName - Name of the class containing all of the team desc
function SlideOverImage(parentDivId,containersDivClassName,descDivClassName) {
	
	this.parentDivId = parentDivId;
	this.containersDivClassName = containersDivClassName;
	this.descDivClassName = descDivClassName; 
	this.parentContainer = document.getElementById(this.parentDivId);
	this.singleContainers = this.parentContainer.getElementsByClassName(this.containersDivClassName);
 	this.imageHeight = this.GetMaxImageHeight();
 	this.imageWidth = this.GetMaxImageWidth();
 	this.totalContainers = this.singleContainers.length;
 	this.config = new SlideOverConfigBuilder(this.imageWidth, this.imageHeight);
 	this.imgDir = new Array();
	this.divDir = new Array();

 	this.SetHeight();
 	this.SetTeamInfoDivHeight();
	this.SetupScrollPattern(); 	
 	// store this to a local variable for the event listener
 	var instance = this;
 	var enterListener = new Array();
 	var leaveListener = new Array();
 	for(var i=0;i<this.totalContainers;i++) { 
 		(function(i) {
			enterListener[i] = function () { instance.MouseEnterEvent(i);};
			leaveListener[i] = function () { instance.MouseLeaveEvent(i);};
 		}(i));
	}

	for(var i=0;i<this.totalContainers;i++) {
		this.singleContainers[i].addEventListener("mouseenter", enterListener[i]);
		this.singleContainers[i].addEventListener("mouseleave", leaveListener[i]);
		this.singleContainers[i].style.overflow = 'hidden';
		this.PlaceDescDivInStartPos(i);
	}
}
SlideOverImage.prototype.PlaceDescDivInStartPos = function (i) {
	this.MouseEnterEvent(i); // fixes start by placing 
	this.MouseLeaveEvent(i); // div in correct pos	
};
SlideOverImage.prototype.SetHeight = function() {
	for(var i=0;i<this.totalContainers;i++){
		this.singleContainers[i].setAttribute("style","height:"+this.imageHeight+"px");
	}
};
SlideOverImage.prototype.GetMaxImageHeight = function () {
	var ret = 0;
	images = this.parentContainer.getElementsByTagName("img");
	var i=0;
	while(i<images.length) {
		if(ret < images[i].offsetHeight) {
			ret = images[i].offsetHeight;
		} 
		i++;
	}
	return ret;
};
SlideOverImage.prototype.GetMaxImageWidth = function () {
	var ret = 0;
	images = this.parentContainer.getElementsByTagName("img");
	var i=0;
	while(i<images.length) {
		if(ret < images[i].offsetWidth) {
			ret = images[i].offsetWidth;
		} 
		i++;
	}
	return ret;
};
SlideOverImage.prototype.SetTeamInfoDivHeight = function () {	
	for(var i=0;i<this.totalContainers;i++) {
		var teamInfo = this.singleContainers[i].getElementsByClassName(this.descDivClassName)[0];
		if(this.imageHeight > teamInfo.offsetHeight) {
			teamInfo.style.height = this.imageHeight + 'px';
		}
	}
};
SlideOverImage.prototype.MouseEnterEvent = function(i) {
	var imgConfig = this.config.ImgConfig(this.imgDir[i]);
	var divConfig = this.config.DivConfig(this.divDir[i]);
	
	this.singleContainers[i].getElementsByTagName("img")[0].style.transform 
		= "translate("+imgConfig.x*this.imgDelta+"px,"
			+imgConfig.y*this.imgDelta+"px)";
	this.singleContainers[i].getElementsByClassName(this.descDivClassName)[0].style.transform 
		= "translate("+divConfig.x+"px,"
			+divConfig.y+"px)";
};
SlideOverImage.prototype.MouseLeaveEvent = function(i) {
	var divConfig = this.config.DivConfig(this.divDir[i]);
	
	this.singleContainers[i].getElementsByTagName("img")[0].style.transform 
		= "translate(0px,0px)";
	this.singleContainers[i].getElementsByClassName(this.descDivClassName)[0].style.transform
		= "translate("+divConfig.xInit+"px,"+divConfig.yInit+"px)";
};

function SlideOverConfigBuilder(imgWidth, imgHeight) { 
	this.imageWidth = imgWidth;
	this.imageHeight = imgHeight;
}
SlideOverConfigBuilder.prototype.ImgConfig = function(imgDir) {
	switch(imgDir) {
	case "up":
		this.imgClass = SlideUpImgConfig;
		break;
	case "down":
		this.imgClass = SlideDownImgConfig;
		break;
	case "left":
		this.imgClass = SlideLeftImgConfig;
		break;
	case "right":
		this.imgClass = SlideRightImgConfig;
		break;
	default:
		this.imgClass = SlideUpImgConfig;
		break;	
	}
	return new this.imgClass(this);
};
SlideOverConfigBuilder.prototype.DivConfig = function(divDir) {
	switch(divDir) {
	case "up":
		this.divClass = SlideUpDivConfig;
		break;
	case "down":
		this.divClass = SlideDownDivConfig;
		break;
	case "left":
		this.divClass = SlideLeftDivConfig;
		break;
	case "right":
		this.divClass = SlideRightDivConfig;
		break;
	default:
		this.divClass = SlideUpDivConfig;
		break;
	}
	return new this.divClass(this);
};

function SlideRightDivConfig(builderObj) {
	this.x = 0;
	this.y = -Math.abs(builderObj.imageHeight);
	this.xInit = -Math.abs(builderObj.imageWidth); 
	this.yInit = -Math.abs(builderObj.imageHeight);	
}
function SlideRightImgConfig(builderObj) {
	this.y = 0;
	this.x = builderObj.imageWidth;		
}
function SlideLeftDivConfig(builderObj) {
	this.x = 0;
	this.y = -Math.abs(builderObj.imageHeight);
	this.xInit = Math.abs(builderObj.imageWidth); 
	this.yInit = -Math.abs(builderObj.imageHeight);
}
function SlideLeftImgConfig(builderObj) {
	this.y = 0;
	this.x = -builderObj.imageWidth;	
}
function SlideDownDivConfig(builderObj) {
	this.x = 0;
	this.y = -Math.abs(builderObj.imageHeight);
	this.xInit = 0;
	this.yInit = -Math.abs(builderObj.imageHeight*2);
}
function SlideDownImgConfig(builderObj) {
	this.y = builderObj.imageHeight;
	this.x = 0;	
}
function SlideUpDivConfig(builderObj) {
	this.x = 0;
	this.y = -builderObj.imageHeight;
	this.xInit = 0;
	this.yInit = 0;
}
function SlideUpImgConfig(builderObj) {
	this.y = -builderObj.imageHeight;
	this.x = 0;
}
