window.zs=window.zs||{},window.zs.laya=window.zs.laya||{},function(t,e){"use strict";class s extends e.Script{constructor(){super(),this.active=!1,this.topUI=null,this.middleUI=null,this.bottomUI=null,this.leftFloatUI=null,this.rightFloatUI=null,this.fullUI=null,this.applyStatusBar=!0,this.isFull=!0,this.vLayout=s.VERTICAL_MIDDLE,this.hLayout=s.HORIZONTAL_CENTER;}
initLayout(t){this.applyStatusBar=t,this.applyLayout();}
onAwake(){this.topUI=this.owner.getChildByName("topUI"),this.middleUI=this.owner.getChildByName("middleUI"),this.bottomUI=this.owner.getChildByName("bottomUI"),this.leftFloatUI=this.owner.getChildByName("leftFloatUI"),this.rightFloatUI=this.owner.getChildByName("rightFloatUI"),this.fullUI=this.owner.getChildByName("fullUI");}
onEnable(){this.applyLayout();}
onDisable(){}
applyLayout(){}}
s.VERTICAL_TOP=0,s.VERTICAL_MIDDLE=1,s.VERTICAL_BOTTOM=2,s.HORIZONTAL_LEFT=0,s.HORIZONTAL_CENTER=1,s.HORIZONTAL_RIGHT=2,e.ILaya.regClass(s),e.ClassUtils.regClass("zs.laya.base.Layout",s),e.ClassUtils.regClass("Zhise.Layout",s);class a extends e.Script{constructor(){super(),this.viewName="";}
onAwake(){this.viewName=this.owner.url,this.viewName=this.viewName.substring(this.viewName.lastIndexOf("/")+1,this.viewName.lastIndexOf("."));}
onEnable(){e.stage.event(a.EVENT_UI_VIEW_OPENED,[this.viewName,this.owner]);}
onDisable(){e.stage.event(a.EVENT_UI_VIEW_CLOSED,[this.viewName,this.owner]);}}
a.EVENT_UI_VIEW_CLOSED="UI_VIEW_CLOSED",a.EVENT_UI_VIEW_OPENED="UI_VIEW_OPENED",e.ILaya.regClass(a),e.ClassUtils.regClass("zs.laya.base.BaseView",a),e.ClassUtils.regClass("Zhise.BaseView",a);class i extends a{constructor(){super();}
onAwake(){super.onAwake(),this.owner.addComponent(s).initLayout(!1);}
onEnable(){super.onEnable();var t=zs.laya.platform.PlatformMgr.platformCfg;if(t){var e=t.bannerCfg;e&&e[this.viewName]&&(this.owner.getComponent(zs.laya.platform.BannerCtrl)||this.owner.addComponent(zs.laya.platform.BannerCtrl));var s=t.exportGameCfg;s&&s[this.viewName]&&(this.owner.getComponent(zs.laya.platform.ExportGameCtrl)||this.owner.addComponent(zs.laya.platform.ExportGameCtrl));var a=t.nativeAdCfg;a&&a[this.viewName]&&0!=a[this.viewName].auto&&(this.owner.getComponent(zs.laya.platform.NativeAdsCtrl)||this.owner.addComponent(zs.laya.platform.NativeAdsCtrl));var i=t.mistakenlyTouchCfg;i&&i[this.viewName]&&(this.owner.getComponent(zs.laya.platform.MistakenlyTouchCtrl)||this.owner.addComponent(zs.laya.platform.MistakenlyTouchCtrl));}}
initView(t){}}
e.ILaya.regClass(i),e.ClassUtils.regClass("zs.laya.base.ZhiSeView",i),e.ClassUtils.regClass("Zhise.View",i),t.Layout=s,t.BaseView=a,t.ZhiSeView=i;}(window.zs.laya.base=window.zs.laya.base||{},Laya);