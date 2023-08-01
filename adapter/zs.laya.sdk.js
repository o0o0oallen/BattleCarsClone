window.zs=window.zs||{},window.zs.laya=window.zs.laya||{},function(e,i){"use strict";class s{constructor(){this.sdkService=null;}
static initSDK(){this.sdkService=window.zsSdk,this.sdkService&&this.sdkService.init();}
static destroySDK(){this.sdkService=null;}
static login(e,i){this.sdkService?this.sdkService.login(e,i):i&&i.runWith({code:1,desc:"web login"});}
static loadSubpackage(e,i,s,t){return!!this.sdkService&&this.sdkService.loadSubpackage(e,i,s,t);}
static initVideoAd(e){this.sdkService&&this.sdkService.initVideoAD&&this.sdkService.initVideoAD(e);}
static playVideo(e,t,n){this.sdkService?(i.stage.event(s.EVENT_AD_VIDEO_PLAY),this.sdkService.playVideo(i.Handler.create(null,function(){i.stage.event(s.EVENT_AD_VIDEO_CLOSED),e&&e.run();},null,!1),i.Handler.create(null,function(){i.stage.event(s.EVENT_AD_VIDEO_CLOSED),t&&t.run();},null,!1),i.Handler.create(null,function(e){i.stage.event(s.EVENT_AD_VIDEO_CLOSED),n&&n.runWith(e);},null,!1))):e&&e.run();}
static isVideoEnable(){return!!this.sdkService&&this.sdkService.isVideoEnable();}
static createUserInfoButton(e,i){this.sdkService?this.sdkService.createUserInfoButton(e,i):i&&i.runWith(null);}
static hideUserInfoButton(){this.sdkService&&this.sdkService.hideUserInfoButton();}
static showUserInfoButton(){this.sdkService&&this.sdkService.showUserInfoButton();}
static destroyUserInfoButton(){this.sdkService&&this.sdkService.destroyUserInfoButton();}
static openShare(e,i){this.sdkService?this.sdkService.openShare(e,i):console.log("share:"+e+",img:"+i);}
static initInsertAd(e,i){this.sdkService&&(this.sdkService.initInsertAd?this.sdkService.initInsertAd(e,i):this.sdkService.initFullScreenAD&&this.sdkService.initFullScreenAD(e,i));}
static loadInsertAd(e,i){this.sdkService?this.sdkService.loadInsertAd?this.sdkService.loadInsertAd(e,i):this.sdkService.loadFullScreenAD&&this.sdkService.loadFullScreenAD(e,i):i&&i.runWith("null");}
static showInsertAd(e){this.sdkService?this.sdkService.showInsertAd?this.sdkService.showInsertAd(e):this.sdkService.loadFullScreenAD&&this.sdkService.showFullScreenAD(e):(e&&e.runWith("not in wx"),console.log("showFullScreenAD:"+Date.now()));}
static setUserCloudStorage(e,i,s,t){if(this.sdkService)return this.sdkService.setUserCloudStorage(e,i,s,t);i&&i.runWith(null);}}
s.sdkService=null,s.EVENT_AD_VIDEO_PLAY="EVENT_AD_VIDEO_PLAY",s.EVENT_AD_VIDEO_CLOSED="EVENT_AD_VIDEO_CLOSED",i.ILaya.regClass(s),i.ClassUtils.regClass("zs.laya.sdk.SdkService",s),i.ClassUtils.regClass("Zhise.SdkService",s);class t extends i.Script{constructor(){super();}
static init(){t.device=window.zsDevice,t.device&&(t.device.init(),t.device.onShow(i.Handler.create(null,function(e){i.stage.event(t.EVENT_ON_SHOW,e);},null,!1)),t.device.onHide(i.Handler.create(null,function(){i.stage.event(t.EVENT_ON_HIDE);},null,!1)));}
static statusBarHeight(){return this.device?this.device.statusBarHeight():0;}
static screenWidth(){return this.device?this.device.screenWidth():i.stage.width;}
static screenHeight(){return this.device?this.device.screenHeight():i.stage.height;}
static VibrateShort(){this.device?this.device.vibrateShort():"undefined"!=typeof navigator&&"vibrate"in navigator?navigator.vibrate(500):console.log("vibrateShort");}
static VibrateLong(){this.device?this.device.vibrateLong():"undefined"!=typeof navigator&&"vibrate"in navigator?navigator.vibrate(1e3):console.log("VibrateLong");}
static IsNetValid(){return this.device?this.device.isNetValid():navigator.onLine;}}
t.device=null,t.EVENT_ON_RESUME="DEVICE_ON_RESUME",t.EVENT_ON_HIDE="DEVICE_ON_HIDE",t.EVENT_ON_SHOW="DEVICE_ON_SHOW",i.ILaya.regClass(t),i.ClassUtils.regClass("zs.laya.sdk.DeviceService",t),i.ClassUtils.regClass("Zhise.DeviceService",t),e.SdkService=s,e.DeviceService=t;class n{constructor(){}
static loadConfig(e,i){this.Instance.loadConfig(e,i);}
static init(e,i){this.Instance.init(e,i);}
static sendVideoLog(){this.Instance.sendVideoLog();}
static loadAd(e){this.Instance.loadAd(e);}
static navigate2Mini(e,i,s,t,n){this.Instance.navigate2Mini(e,i,s,t,n);}
static statisticsGDT(e){this.Instance.statisticsGDT(e);}
static get Instance(){return this.initialized||(this.initialized=!0,zs.reportSdk?this.instance=zs.reportSdk:this.instance={loadConfig:function(e,i){i&&i(),console.log("zs.sdk is undefined");},init:function(e,i){console.log("zs.sdk.init"),console.log("zs.sdk is undefined");},sendVideoLog:function(){console.log("zs.sdk.sendVideoLog"),console.log("zs.sdk is undefined");},loadAd:function(e){e&&e({promotion:[],indexLeft:[],endPage:[],backAd:[]}),console.log("zs.sdk is undefined");},navigate2Mini:function(e,i,s,t,n){t&&t(),n&&n(),console.log("zs.sdk is undefined");},statisticsGDT:function(e){console.log("zs.sdk.statisticsGDT"),console.log("zs.sdk is undefined");}}),this.instance;}}
n.instance=null,n.initialized=!1,i.ClassUtils.regClass("zs.laya.sdk.ZSReportSdk",n),e.SdkService=s,e.DeviceService=t,e.ZSReportSdk=n;}(window.zs.laya.sdk=window.zs.laya.sdk||{},Laya);