! function() {
    "use strict";
    class e {
        constructor() {
            this._userData = null;
            this._userDataKey = "Battle-Cars-CarIO_api_secret";
            this.init();
        }
        init() {
            if (this._userData = {
                    isPlaySound: !0,
                    isPlayVibrate: !0,
                    levelID: 0,
                    signinTime: 0,
                    skinTipsTime: 0
                }, this.readStorage(), this._userData.gameStatus || (this._userData.gameStatus = {}), this._userData.gameStatus.awardGold || (this._userData.gameStatus.awardGold = 0), this._userData.gameStatus.unlockCount || (this._userData.gameStatus.unlockCount = 0), !this._userData.gameStatus.skinArr) {
                this._userData.gameStatus.skinArr = [], this._userData.gameStatus.skinArr.length = 9;
                for (let e = 0; e < 9; ++e) this._userData.gameStatus.skinArr[e] = 0 == e;
            }
            this._userData.gameStatus.skinId || (this._userData.gameStatus.skinId = 0), this._userData.userInfo || (this._userData.userInfo = {}), this._userData.userInfo.gold || (this._userData.userInfo.gold = 0), this._userData.gameStatus.level || (this._userData.gameStatus.level = 1), this.writeStorage();
        }
        readStorage() {
            let e = Laya.LocalStorage.getItem(this._userDataKey);
            e && (this._userData = JSON.parse(e));
        }
        writeStorage() {
            this._userData && Laya.LocalStorage.setItem(this._userDataKey, JSON.stringify(this._userData));
        }
        clearStorage() {
            Laya.LocalStorage.removeItem(this._userDataKey);
        }
        isPlaySound() {
            return this._userData.isPlaySound;
        }
        setPlaySound(e) {
            this._userData.isPlaySound = e, this.writeStorage();
        }
        isPlayVibrate() {
            return this._userData.isPlayVibrate;
        }
        setPlayVibrate(e) {
            this._userData.isPlayVibrate = e, this.writeStorage();
        }
        setSkinTips(e) {
            this._userData.skinTipsTime = e ? 0 : Math.floor(Date.parse(new Date().toString()) / 1e3), this.writeStorage();
        }
        isSkinTips(e) {
            return Math.floor(this._userData.projectData.lastTime / 864e5) != Math.floor(e / 864e5);
        }
        get userInfo() {
            return this._userData.userInfo;
        }
        get unlockSkinData() {
            return this._userData.userInfo.skin;
        }
        unlockSkin(e) {
            this._userData.gameStatus.skinArr[e] || (this._userData.gameStatus.skinArr[e] = !0, this._userData.gameStatus.unlockCount++, this.writeStorage());
        }
        getUnlockCount() {
            return this._userData.gameStatus.unlockCount;
        }
        setSkinId(e) {
            this._userData.gameStatus.skinId = e, this.writeStorage();
        }
        getSkinId() {
            return this._userData.gameStatus.skinId;
        }
        getSkinArr() {
            return this._userData.gameStatus.skinArr;
        }
        isUnlockSkin(e, t) {
            return -1 != e.indexOf(t);
        }
        get gameStatus() {
            return this._userData.gameStatus;
        }
        get projectData() {
            return this._userData.projectData;
        }
        setGameStausLevel(e) {
            this._userData.gameStatus.level = e, zs.laya.WebService.updatePlayerInfo({
                user_id: this._userData.userInfo.user_id,
                level_id: e
            }), this.writeStorage();
        }
        setAwardGold(e) {
            this._userData.gameStatus.awardGold = e, zs.laya.WebService.updatePlayerInfo({
                user_id: this._userData.userInfo.user_id,
                gold: this._userData.gameStatus.awardGold,
                upSpeedLevel: this._userData.gameStatus.upSpeedLevel,
                upPlayerLevel: this._userData.gameStatus.upPlayerLevel,
                upMulLevel: this._userData.gameStatus.upMulLevel
            }), this.writeStorage();
        }
        get awardGold() {
            return this._userData.gameStatus.awardGold;
        }
    }
    class t {
        constructor() {
            this.loadCfgList = [{
                path: "jsonConfig/LevelCfg.json",
                tag: "LevelCfg"
            }, {
                path: "jsonConfig/levelData.json",
                tag: "levelData"
            }], this.skinCfg = [];
        }
        getLevelCfg() {
            return this.levelCfg;
        }
        getLevelData() {
            return this.levelData;
        }
        getObstacleData() {
            return this.obstacleData;
        }
        init(e) {
            this.glEvent = e, this.loadCfgList.forEach(e => {
                this.loadJson(e);
            });
        }
        loadJson(e) {
            let t = this;
            Laya.loader.load(e.path, Laya.Handler.create(this, function(a) {
                t.onLoadJson(a, e.tag);
            }), null, Laya.Loader.JSON);
        }
        onLoadJson(e, t) {
            switch (t) {
                case "LevelCfg":
                    this.levelCfg = e;
                    break;
                case "levelData":
                    this.levelData = e.levelData, this.obstacleData = e.obstacleData;
            }
            null != e && this.glEvent.event("load_finish_event", {
                target: t
            });
        }
        getSkinCfg() {
            return this.skinCfg;
        }
        getSkinByIndex(e) {
            return this.skinCfg[e];
        }
        getSkinIndexById(e) {
            for (let t = 0, a = this.skinCfg.length; t < a; ++t)
                if (e == this.skinCfg[t].id) return t;
            return -1;
        }
    }
    class a {
        constructor() {
            this._bgmCtx = null, this.isFire = !1, this._pathRoot = "res/music/", this._soundCtx = {}, this._soundFile = ["bg", "bullet1", "bullet2", "bullet3", "bullet4", "button", "carBroken", "dropEnd", "flyUp", "getProp", "hitOther", "victory", "coin"];
        }
        init() {
            let e = this._pathRoot,
                t = "",
                a = this._soundFile,
                i = this._soundFile.length;
            for (let s = 0; s < i; ++s) {
                t = a[s];
                let i = new Laya.SoundChannel();
                i.url = e + t + ".mp3", Laya.SoundManager.addChannel(i), this._soundCtx[t] = !0;
            }
            Laya.stage.on("DEVICE_ON_HIDE", this, this.onAppHide), Laya.stage.on("DEVICE_ON_SHOW", this, this.onAppShow);
        }
        onAppHide() {
            this.stopBGM();
        }
        onAppShow() {
            this.playBGM();
        }
        play(e) {
            this._soundCtx[e] && Laya.SoundManager.playSound(this._pathRoot + e + ".mp3");
        }
        stop(e) {
            this._soundCtx[e] && Laya.SoundManager.stopSound(this._pathRoot + e + ".mp3");
        }
        stopAll() {
            Laya.SoundManager.stopAll();
        }
        playBGM() {
            if (v.commonData.firstMusic == !0) return;
            let e = this._pathRoot + "bg.mp3";
            Laya.Browser.onWeiXin ? (null != this._bgmCtx && (this._bgmCtx.stop(), this._bgmCtx.destroy(), this._bgmCtx = null), this._bgmCtx = wx.createInnerAudioContext(), this._bgmCtx.src = e, this._bgmCtx.loop = !0, this._bgmCtx.play()) : (Laya.SoundManager.stopMusic(), Laya.SoundManager.playMusic(e, 0));
        }
        stopBGM() {
            Laya.Browser.onWeiXin ? null != this._bgmCtx && this._bgmCtx.stop() : Laya.SoundManager.stopMusic();
        }
    }
    class i {
        constructor() {
            this.shareStartTime = 0;
        }
        init() {
            Laya.stage.on("DEVICE_ON_HIDE", this, this.onHideEvent), Laya.stage.on("DEVICE_ON_SHOW", this, this.onShowEvent);
        }
        showToast(e, t) {
            if (!window.wx) return;
            window.wx.showToast({
                title: e,
                duration: t,
                icon: "none"
            });
        }
        openShare(e = null, t = null, a = null) {
            Laya.Browser.onWeiXin ? (this.shareStartTime = new Date().getTime(), this.successShareCallback = e, this.failShareCallback = new Laya.Handler(this, this.shareFailTips), zs.laya.sdk.SdkService.openShare(zs.laya.platform.ADConfig.zs_share_title, zs.laya.platform.ADConfig.zs_share_image)) : a && a.run();
        }
        onHideEvent(e) {}
        onShowEvent(e) {
            !(new Date().getTime() - this.shareStartTime < 2e3 * Math.random() + 2e3) ? this.successShareCallback && this.successShareCallback.run(): this.failShareCallback && this.failShareCallback.run(), this.failShareCallback = null, this.successShareCallback = null, this.shareStartTime = new Date().getTime() + 86e3;
        }
        shareFailTips() {
            let e = "",
                t = 3 * Math.random();
            0 < t && t < 1 ? e = "" : 1 <= t && t < 2 ? e = "" : 2 <= t && t < 3 && (e = ""), this.showToast(e, 1200);
        }
    }
    class s {
        constructor() {
            this.modelPrefabs = {}, this.resource = [{
                url: "res/scene/LayaScene_Scene/Conventional/Scene.ls",
                clas: Laya.Scene,
                priority: 1
            }], this.sceneID = 0, this.isLoad = !1, this.loadingScene = !1;
        }
        init(e) {
            this.glEvent = e, Laya.Browser.onWeiXin ? this.loadSubpackage("scenes", this, function(e, t) {
                t && (this.loadRes(), this.loadSubpackage("sounds", this, function(e, t) {
                    t && v.soundMgr.init();
                }));
            }) : (this.loadRes(), v.soundMgr.init());
        }
        loadSubpackage(e, t, a) {
            Laya.Browser.onWeiXin && wx.loadSubpackage({
                name: e,
                success: function(i) {
                    console.log("分包加载成功 " + e), a.call(t, i, !0);
                },
                fail: function(i) {
                    null,
                    a.call(t, i, !1);
                }
            });
        }
        loadRes() {
            Laya.loader.create(this.resource, Laya.Handler.create(this, this.onLoadFinish, null, !1), Laya.Handler.create(this, this.onLoading, null, !1)), Laya.loader.on(Laya.Event.ERROR, this, e => {});
        }
        onLoadFinish(e) {
            if (e || (e = !0), e) {
                if (this.isLoad) return;
                this.isLoad = !0, v.glEvent.event("load_finish_event", {
                    target: "3dres"
                }), this.onSceneEvent(e);
            }
        }
        onLoading(e) {
            v.glEvent.event("load_pass_event", e);
        }
        isLoadingScene() {
            return this.loadingScene;
        }
        onSceneEvent(e) {
            this.loadingScene = !1, e && this.onScenes();
        }
        onScenes() {
            if (this.resource) {
                let e = Laya.loader.getRes(this.resource[0].url);
                Laya.stage.addChild(e), Laya.stage.setChildIndex(e, 0), this.mainScene = e, this.mainCamera = e.getChildByName("Main Camera"), v.gameMgr.init();
            } else console.error("res cfg is null.");
        }
    }
    class o extends Laya.Script {
        constructor() {
            super(...arguments), this.speed = 8;
        }
        init(e) {
            this.wheel = e;
        }
        setSpeed(e) {
            this.speed = e;
        }
        onUpdate() {
            if (this.wheel) {
                let e = Laya.timer.delta / 1e3;
                this.wheel.transform.rotate(new Laya.Vector3(e * this.speed, 0, 0), !0, !0);
            }
        }
    }
    class r extends Laya.Script {
        constructor() {
            super(...arguments), this.isMove = !1, this.index = 0, this.speed = 10, this.oriSpeed = 10, this.gunType = 6, this.wheelAniArr = [], this.direction = new Laya.Vector3(0, 0, 0), this.isRight = !1, this.pointArr = [], this.centerPos = new Laya.Vector3(0, 0, 0), this.radius = 18, this.cheke = null, this.addSpeed = 1, this.mulSpeed = 1, this.hpValue = 200, this.maxValue = 200, this.propLevel = [1, 1, 1], this.isProtected = !1, this.safeDis = 1.6, this.fireDirection = new Laya.Vector3(0, 0, 1), this.calculateTime = 0, this.lastFireEffTime = 0, this.isFire = !1, this.lastFireTime = 0, this.laserTime = 0, this.start = null, this.end = null, this.movevalue = 0, this.isTween = !1, this.propArr = [], this.propItemArr = [], this.bInvinsible = !1, this.daodanAtItem = null, this.singlePos = null, this.lastpos = null, this.isSetUpTheta = !1, this.theta = 0, this.isStateEnd1 = !1, this.dropTime = 0, this.oriPos = null, this.moveSpeed = 1, this.attackMul = 1, this.gunAngle = 0, this.rotateAngle = 0, this.isGunRotate = !1;
        }
        init(e, t = 0) {
            this.single = e, this.index = t, this.hpValue = 400, this.maxValue = 400, v.commonData.newLevel < 6 && (this.hpValue = 2 * (700 - 100 * v.commonData.newLevel), this.maxValue = this.hpValue), this.leftWheel = e.getChildByName("qianlun_01_L"), this.rightWheel = e.getChildByName("qianlun_01_R"), this.mapCenter = v.gameMgr.groundScene.getChildAt(2), this.centerPos = this.mapCenter.transform.position.clone(), this.calculateRoot = e.getChildByName("calculateRoot");
            for (let e = 0; e < this.calculateRoot.numChildren; ++e) {
                let t = this.calculateRoot.getChildAt(e);
                this.pointArr.push(t);
            }
            this.backWheel = e.getChildByName("houlun_01"), this.leftWheelCi = this.leftWheel.getChildByName("qianci_01_L"), this.rightWheelCi = this.rightWheel.getChildByName("qianci_01_R"), this.backCi = this.backWheel.getChildByName("houci_01"), this.hideCarProp(), this.setWheelAni();
        }
        hideCarProp() {
            this.leftWheelCi.active = !1, this.rightWheelCi.active = !1, this.backCi.active = !1;
            let e = this.backWheel.getChildByName("houlun_R2"),
                t = this.backWheel.getChildByName("houlun_L2");
            e.active = !1, t.active = !1, this.leftWheel.getChildByName("qianlun_02_L").active = !1, this.rightWheel.getChildByName("qianlun_02_R").active = !1, this.speed = this.oriSpeed, this.leftWheel.transform.localScale = new Laya.Vector3(1, 1, 1), this.rightWheel.transform.localScale = new Laya.Vector3(1, 1, 1);
            let a = this.backWheel.getChildByName("houlun_L"),
                i = this.backWheel.getChildByName("houlun_R");
            a.transform.localScale = new Laya.Vector3(1, 1, 1), i.transform.localScale = new Laya.Vector3(1, 1, 1), a.transform.localPosition = new Laya.Vector3(-.4587885, 0, 0), i.transform.localPosition = new Laya.Vector3(.4587885, 0, 0);
        }
        setWheelAni() {
            let e = this.leftWheel.getChildByName("qianlun_01_L"),
                t = this.leftWheel.getChildByName("qianlun_02_L"),
                a = this.rightWheel.getChildByName("qianlun_01_R"),
                i = this.rightWheel.getChildByName("qianlun_02_R"),
                s = this.backWheel.getChildByName("houlun_L"),
                r = this.backWheel.getChildByName("houlun_R"),
                n = this.backWheel.getChildByName("houlun_L2"),
                l = this.backWheel.getChildByName("houlun_R2"),
                h = e.addComponent(o),
                c = t.addComponent(o),
                g = a.addComponent(o),
                d = i.addComponent(o),
                m = s.addComponent(o),
                p = r.addComponent(o),
                u = n.addComponent(o),
                y = l.addComponent(o),
                f = this.backCi.addComponent(o),
                L = this.leftWheel.getChildByName("qianci_01_L"),
                v = this.rightWheel.getChildByName("qianci_01_R"),
                w = L.addComponent(o),
                C = v.addComponent(o);
            h.init(e), c.init(t), g.init(a), d.init(i), m.init(s), p.init(r), u.init(n), y.init(l), f.init(this.backCi), w.init(L), C.init(v), this.wheelAniArr.push(h), this.wheelAniArr.push(c), this.wheelAniArr.push(g), this.wheelAniArr.push(d), this.wheelAniArr.push(m), this.wheelAniArr.push(p), this.wheelAniArr.push(u), this.wheelAniArr.push(y), this.wheelAniArr.push(f), this.wheelAniArr.push(w), this.wheelAniArr.push(C);
        }
        setGun() {}
        setMove(e) {
            this.isMove = e, this.centerPos = this.mapCenter.transform.position.clone();
        }
        reset() {
            this.hpValue = 400, this.maxValue = 400, v.commonData.newLevel < 6 && (this.hpValue = 2 * (700 - 100 * v.commonData.newLevel), this.maxValue = this.hpValue), v.gameData.gameState = 1, this.isStateEnd1 = !1, this.bInvinsible = !1, Laya.timer.clear(this, this.setInvinble), this.laserTime = 0, this.propLevel = [1, 1, 1], this.addSpeed = 1, this.mulSpeed = 1, this.dropTime = 0, this.single.active = !0, this.single.transform.position = new Laya.Vector3(0, 1.1, 10.78), this.single.transform.lookAt(new Laya.Vector3(0, 1.1, 0), new Laya.Vector3(0, 1, 0), !1), this.isMove = !1, this.cheke && (this.cheke.active = !1);
            for (let e = 0; e < this.wheelAniArr.length; ++e) this.wheelAniArr[e].setSpeed(8);
            this.lastFireTime = 0, this.resetParticle(), this.resetCar();
        }
        resetCar() {
            this.hideCarProp();
            for (let e = 0; e < this.propItemArr.length; ++e) this.propItemArr[e].removeSelf(), this.propItemArr[e].active = !1, "prop_08" == this.propItemArr[e].name && (this.propItemArr[e].getChildByName("redLine").active = !1), Laya.Pool.recover(this.propItemArr[e].name, this.propItemArr[e]);
            this.propItemArr = [], this.gun = null, this.propArr = [];
        }
        hideRedLine() {
            this.gun && 8 == this.gunType && (this.gun.getChildByName("redLine").active = !1);
        }
        resetParticle() {
            let e = this.single.getChildByName("pcdld_10");
            e && (e.removeSelf(), e.active = !1), (e = this.single.getChildByName("pcdld_11")) && (e.removeSelf(), e.active = !1);
        }
        calculateHp(e, t = 0) {
            if (this.isMove && !this.bInvinsible && (v.gameMgr.playVibrate(!0), this.checkProp(2) ? this.hpValue -= Math.floor(e / 2) : this.hpValue -= e, this.changePos2(), this.hpValue <= 0)) {
                if (1 == this.isProtected) return;
                0 == v.isBringBackToLifed && zs.laya.platform.ADConfig.isOpenEgg(v.commonData.newLevel, 2) ? (v.isBringBackToLifed = !0, this.isProtected = !0, Laya.stage.once(zs.laya.platform.PlatformMgr.EGG_GET_AWARD, this, () => {
                    this.hpValue = this.maxValue, this.isProtected = !1;
                }), Laya.Scene.open("views/ad/KnockEggNew.scene", !1, null, Laya.Handler.create(this, function(e) {
                    var t = e.getComponent(zs.laya.platform.KnockEggView);
                    null == t && (t = e.addComponent(zs.laya.platform.KnockEggView)), t.initView && t.initView(null);
                }))) : (this.isMove = !1, this.single.active = !1, v.commonData.GGame.hideHpValue(), v.gameMgr.cameraLg.endCameraMove(), this.playEffect(13, this.single.transform.position.clone()), Laya.timer.once(3e3, this, this.lateGameOver));
            }
        }
        lateGameOver() {
            v.gameMgr.gameOver();
        }
        pointInBox(e, t, a, i) {
            let s = new Laya.Vector3(0, 0, 0);
            t.transform.getForward(s), Laya.Vector3.normalize(s.clone(), s);
            let o = t.transform.position.clone(),
                r = new Laya.Vector3(0, 0, 0);
            Laya.Vector3.subtract(e, o, r);
            let n = Laya.Vector3.dot(s, r),
                l = new Laya.Vector3(0, 0, 0);
            t.transform.getRight(l), Laya.Vector3.normalize(l.clone(), l);
            let h = Laya.Vector3.dot(l, r);
            return Math.abs(h) < a.x / 2 && Math.abs(n) < a.z / 2;
        }
        isPointInRect(e, t, a) {
            let i = a[0],
                s = a[1],
                o = a[2],
                r = a[3],
                n = (s.x - i.x) * (t - i.y) - (s.y - i.y) * (e - i.x),
                l = (o.x - s.x) * (t - s.y) - (o.y - s.y) * (e - s.x),
                h = (r.x - o.x) * (t - o.y) - (r.y - o.y) * (e - o.x),
                c = (i.x - r.x) * (t - r.y) - (i.y - r.y) * (e - r.x);
            return n >= 0 && l >= 0 && h >= 0 && c >= 0 || n < 0 && l < 0 && h < 0 && c < 0;
        }
        playEffect(e, t, a = null) {
            v.gameMgr.effectMgr.playEffect(e, t, a);
        }
        calculateCar() {
            this.calculateTime += Laya.timer.delta / 1e3, this.calculateTime = 0;
            let e = this.single.transform.position.clone(),
                t = v.gameData.aiArr,
                a = 100,
                i = 0,
                s = e.clone();
            for (let o = 0; o < t.length; ++o) {
                let r = t[o].item;
                if (t[o].isActive) {
                    let t = r.transform.position.clone();
                    Laya.Vector3.subtract(t, e, s);
                    let n = Laya.Vector3.scalarLength(s);
                    if (n < this.safeDis) {
                        let a = new Laya.Vector3(0, 0, 0);
                        Laya.Vector3.lerp(t, e, .5, a);
                        let i = 200;
                        Laya.Browser.onIOS && (i = 500);
                        let o = new Date().valueOf();
                        o - this.lastFireEffTime > i && (this.lastFireEffTime = o, v.gameMgr.effectMgr.playEffect(12, a.clone()), v.soundMgr.play("hitOther"), v.gameMgr.playVibrate(!0)), s.y = 0, Laya.Vector3.normalize(s.clone(), s), Laya.Vector3.scale(s, .8 * (n - 1.6), s), this.end = s.clone(), this.collisionSet();
                    } else 3 == v.gameData.gameState && n < a && (a = n, i = o, this.fireDirection = s.clone(), 7 == this.gunType && (this.daodanAtItem = r));
                }
            }
            3 == v.gameData.gameState && this.isInDistance(a) ? (Laya.Vector3.normalize(this.fireDirection.clone(), this.fireDirection), this.gunAngleSet(), this.isFire = !0) : this.isFire = !1;
        }
        isInDistance(e) {
            switch (this.gunType) {
                case 6:
                    return e < 8;
                case 7:
                    return e < 13;
                case 8:
                    return e < 8;
            }
            return !1;
        }
        fireBullet() {
            let e = new Date().valueOf();
            if (6 == this.gunType) {
                if (e - this.lastFireTime > 333) {
                    v.soundMgr.play("bullet1"), v.gameMgr.playVibrate(!0), this.lastFireTime = e;
                    let t = this.gun.getChildByName("firePoint"),
                        a = new Laya.Vector3(0, 0, 0);
                    t.transform.getForward(a);
                    let i = t.transform.position.clone();
                    Laya.Vector3.subtract(i, a, a), v.gameMgr.bulletMgr.fireBullet(i, 1, a, 5);
                }
            } else if (7 == this.gunType) {
                if (e - this.lastFireTime > 1500) {
                    this.lastFireTime = e, v.soundMgr.play("bullet2"), v.gameMgr.playVibrate(!0);
                    let t = this.gun.getChildByName("firePoint"),
                        a = new Laya.Vector3(0, 0, 0);
                    t.transform.getForward(a);
                    let i = t.transform.position.clone();
                    Laya.Vector3.subtract(i, a, a), v.gameMgr.bulletMgr.fireBullet(i, 2, a, 5, this.daodanAtItem);
                }
            } else if (8 == this.gunType && e - this.lastFireTime > 3e3) {
                this.lastFireTime = e, v.soundMgr.play("bullet3"), v.gameMgr.playVibrate(!0);
                let t = this.gun.getChildByName("firePoint");
                this.gun.getChildByName("redLine").active = !1;
                let a = new Laya.Vector3(0, 0, 0);
                t.transform.getForward(a);
                let i = t.transform.position.clone();
                Laya.Vector3.subtract(i, a, a), v.gameMgr.bulletMgr.fireBullet(i, 3, a, 5), this.isMove = !1, Laya.timer.once(300, this, this.lateMove);
            }
        }
        lateMove() {
            v.gameData.isStart && this.gun && (this.isMove = !0, this.gun.getChildByName("redLine").active = !0);
        }
        laserHp(e) {
            let t = new Date().valueOf();
            t - this.laserTime > 550 && (this.laserTime = t, this.calculateHp(e));
        }
        collisionSet() {
            if (this.isTween) return;
            this.isTween = !0, this.movevalue = 0;
            let e = Laya.Tween.to(this, {
                    movevalue: 1
                }, 200, Laya.Ease.elasticInOut, new Laya.Handler(this, function() {
                    this.isTween = !1;
                })),
                t = new Laya.Vector3(0, 0, 0);
            e.update = new Laya.Handler(this, function() {
                Laya.Vector3.scale(this.end, this.movevalue, t);
                let e = this.single.transform.position.clone();
                if (Laya.Vector3.add(e, t, t), 1 == v.gameData.gameState) t.x > 4.8 && (t.x = 4.8), t.x < -4.8 && (t.x = -4.8);
                else if (3 == v.gameData.gameState) {
                    let a = t.clone();
                    Laya.Vector3.subtract(t, this.centerPos, a);
                    let i = Laya.Vector3.scalarLength(a);
                    i > this.radius ? (Laya.Vector3.scale(a.clone(), this.radius / i, a), Laya.Vector3.add(a, this.centerPos, t)) : i < 4.5 && (i < .01 && (Laya.Vector3.subtract(e, this.centerPos, a), i = Laya.Vector3.scalarLength(a)), Laya.Vector3.scale(a.clone(), 4.5 / i, a), Laya.Vector3.add(a, this.centerPos, t)), t = this.limitPos(t.clone(), e.clone());
                }
                this.single.transform.position = t.clone();
            });
        }
        calculateProp() {
            let e = v.gameData.daojuArr,
                t = new Laya.Vector3(0, 0, 0),
                a = this.single.transform.position.clone();
            for (let i = 0; i < e.length; ++i)
                if (e[i].isActive) {
                    let s = e[i],
                        o = s.pos;
                    Laya.Vector3.subtract(a, o, t), Laya.Vector3.scalarLength(t) < 1.2 && (v.gameData.daojuArr[i].isActive = !1, s.item.active = !1, this.addProp(s.type), v.soundMgr.play("getProp"), v.gameMgr.playVibrate(!0));
                }
        }
        calculatePropHp() {
            let e = this.single.transform.position.clone(),
                t = v.gameData.aiArr;
            if (this.checkProp(5) || this.checkProp(9))
                for (let a = 0; a < t.length; ++a)
                    if (t[a].isActive) {
                        let i = t[a].item.transform.position.clone(),
                            s = i.x - e.x,
                            o = i.z - e.z;
                        s * s + o * o < 3 && t[a].lg.cutHp();
                    }
            if (this.checkProp(1)) {
                let e = this.single.getChildByName("prop_01").getChildByName("center").transform.position.clone();
                for (let a = 0; a < t.length; ++a)
                    if (t[a].isActive) {
                        let i = t[a].item.transform.position.clone(),
                            s = i.x - e.x,
                            o = i.z - e.z,
                            r = new Laya.Vector3(s, 0, o),
                            n = Laya.Vector3.scalarLength(r);
                        if (n < 1.3) {
                            v.gameMgr.playVibrate(!0);
                            let s = new Laya.Vector3(0, 0, 0);
                            Laya.Vector3.lerp(i, e, .5, s), v.gameMgr.effectMgr.playEffect(12, s.clone()), Laya.Vector3.normalize(r.clone(), r), Laya.Vector3.scale(r, n - 1.3, r), t[a].lg.end = r.clone(), t[a].lg.collisionSet(), t[a].lg.cutHp2();
                        }
                    }
            }
        }
        setProp2(e) {
            if (this.checkProp(2)) {
                let t;
                this.removeProp(2), 3 != e ? (t = Laya.Pool.getItem("prop_021")) || (t = v.gameMgr.obstacleLg.addDaoju(10)) : (t = Laya.Pool.getItem("prop_022")) || (t = v.gameMgr.obstacleLg.addDaoju(11)), t.active = !0, this.single.addChild(t), t.transform.localPosition = new Laya.Vector3(0, 0, 0), t.transform.localRotationEuler = new Laya.Vector3(0, 0, 0), this.propItemArr.push(t);
            }
        }
        addProp(e) {
            if (1 == e) {
                if (this.cheke && (this.cheke.active = !0), this.checkProp(1) || this.checkProp(2) || this.checkProp(9)) {
                    if (this.propLevel[1] < 4 && (this.propLevel[1]++, this.changePos(0, this.propLevel[1] - 1), this.setHpValue()), this.checkProp(e)) return;
                } else this.changePos(3, 2);
                let t = Laya.Pool.getItem("prop_0" + e);
                t || (t = v.gameMgr.obstacleLg.addDaoju(e)), t.active = !0, t.getChildByName("pcdld_09").active = !1, t.getChildByName("cheke_01").active = !1, this.single.addChild(t), t.transform.localPosition = new Laya.Vector3(0, 0, 0), t.transform.localRotationEuler = new Laya.Vector3(0, 0, 0), this.propItemArr.push(t);
            } else if (2 == e) {
                if (this.cheke && (this.cheke.active = !0), this.checkProp(1) || this.checkProp(2) || this.checkProp(9)) {
                    if (this.propLevel[1] < 4 && (this.propLevel[1]++, this.changePos(0, this.propLevel[1] - 1), this.setHpValue()), this.checkProp(e)) return;
                } else this.changePos(3, 2);
                let t;
                this.checkProp(3) ? (t = Laya.Pool.getItem("prop_022")) || (t = v.gameMgr.obstacleLg.addDaoju(11)) : (t = Laya.Pool.getItem("prop_021")) || (t = v.gameMgr.obstacleLg.addDaoju(10)), t.active = !0, this.single.addChild(t), t.transform.localPosition = new Laya.Vector3(0, 0, 0), t.transform.localRotationEuler = new Laya.Vector3(0, 0, 0), this.propItemArr.push(t);
            } else if (3 == e) {
                if (this.checkProp(3) || this.checkProp(4) || this.checkProp(5)) {
                    if (this.propLevel[2] < 4 && (this.propLevel[2]++, this.changePos(2, this.propLevel[2] - 1), this.setAddSpeed()), this.checkProp(e)) return;
                } else this.changePos(3, 3);
                this.hideCarProp(), this.setProp2(3), this.speed = 1.1 * this.oriSpeed;
                let t = this.backWheel.getChildByName("houlun_L"),
                    a = this.backWheel.getChildByName("houlun_R");
                t.transform.localScale = new Laya.Vector3(2, 1.5, 1.5), a.transform.localScale = new Laya.Vector3(2, 1.5, 1.5), t.transform.localPosition = new Laya.Vector3(-.55, .13, 0), a.transform.localPosition = new Laya.Vector3(.55, .13, 0), this.leftWheel.transform.localScale = new Laya.Vector3(1.2, 1.2, 1.2), this.rightWheel.transform.localScale = new Laya.Vector3(1.2, 1.2, 1.2);
            } else if (4 == e) {
                if (this.checkProp(3) || this.checkProp(4) || this.checkProp(5)) {
                    if (this.propLevel[2] < 4 && (this.propLevel[2]++, this.changePos(2, this.propLevel[2] - 1), this.setAddSpeed()), this.checkProp(e)) return;
                } else this.changePos(3, 3);
                this.hideCarProp(), this.setProp2(4), this.speed = 1.2 * this.oriSpeed;
                let t = this.leftWheel.getChildByName("qianlun_02_L"),
                    a = this.rightWheel.getChildByName("qianlun_02_R"),
                    i = this.backWheel.getChildByName("houlun_L2"),
                    s = this.backWheel.getChildByName("houlun_R2");
                i.active = !0, s.active = !0, t.active = !0, a.active = !0, i.transform.localScale = new Laya.Vector3(1.2, 1.2, 1.2), s.transform.localScale = new Laya.Vector3(1.2, 1.2, 1.2);
                let o = this.backWheel.getChildByName("houlun_L"),
                    r = this.backWheel.getChildByName("houlun_R");
                o.transform.localScale = new Laya.Vector3(1.2, 1.2, 1.2), r.transform.localScale = new Laya.Vector3(1.2, 1.2, 1.2), this.leftWheel.transform.localScale = new Laya.Vector3(1.2, 1.2, 1.2), this.rightWheel.transform.localScale = new Laya.Vector3(1.2, 1.2, 1.2);
            } else if (5 == e) {
                if (this.checkProp(3) || this.checkProp(4) || this.checkProp(5)) {
                    if (this.propLevel[2] < 4 && (this.propLevel[2]++, this.changePos(2, this.propLevel[2] - 1), this.setAddSpeed()), this.checkProp(e)) return;
                } else this.changePos(3, 3);
                this.hideCarProp(), this.setProp2(5), this.speed = 1.1 * this.oriSpeed, this.leftWheelCi.active = !0, this.rightWheelCi.active = !0, this.backCi.active = !0;
                let t = this.backWheel.getChildByName("houlun_L"),
                    a = this.backWheel.getChildByName("houlun_R");
                t.transform.localScale = new Laya.Vector3(1.2, 1.2, 1.2), a.transform.localScale = new Laya.Vector3(1.2, 1.2, 1.2), this.leftWheel.transform.localScale = new Laya.Vector3(1.2, 1.2, 1.2), this.rightWheel.transform.localScale = new Laya.Vector3(1.2, 1.2, 1.2);
            } else if (e < 9) {
                if (this.checkProp(7) || this.checkProp(8) || this.checkProp(9)) {
                    if (this.propLevel[0] < 4 && (this.propLevel[0]++, this.changePos(1, this.propLevel[0] - 1), this.setAttack()), this.checkProp(e)) return;
                } else this.changePos(3, 1);
                this.removeProp(6), this.removeProp(7), this.removeProp(8);
                let t = Laya.Pool.getItem("prop_0" + e);
                t || (t = v.gameMgr.obstacleLg.addDaoju(e)), t.active = !0, t.getChildByName("pcdld_09").active = !1, this.single.addChild(t), t.transform.localPosition = new Laya.Vector3(0, 0, 0), t.transform.localScale = new Laya.Vector3(1, 1, 1), t.transform.localRotationEuler = new Laya.Vector3(0, 0, 0), t.getChildAt(0).transform.localScale = new Laya.Vector3(1, 1, 1), this.gun = t, this.gunType = e, this.propItemArr.push(t);
            } else if (9 == e) {
                if (this.cheke && (this.cheke.active = !0), this.checkProp(1) || this.checkProp(2) || this.checkProp(9)) {
                    if (this.propLevel[1] < 4 && (this.propLevel[1]++, this.changePos(0, this.propLevel[1] - 1), this.setHpValue()), this.checkProp(e)) return;
                } else this.changePos(3, 2);
                let t = Laya.Pool.getItem("prop_0" + e);
                t || (t = v.gameMgr.obstacleLg.addDaoju(e)), t.active = !0, t.getChildByName("pcdld_09").active = !1, t.getChildByName("cheke_01").active = !1, t.transform.localScale = new Laya.Vector3(1, 1, 1), this.single.addChild(t), t.transform.localPosition = new Laya.Vector3(0, 0, 0), t.transform.localRotationEuler = new Laya.Vector3(0, 0, 0), this.propItemArr.push(t);
            }
            this.playEffect(0, this.single.transform.position.clone()), this.propArr.push(e);
        }
        changePos(e, t) {
            let a = this.single.transform.position.clone(),
                i = new Laya.Vector4(0, 0, 0, 0);
            v.gameMgr.camera.viewport.project(a, v.gameMgr.camera.projectionViewMatrix, i);
            let s = new Laya.Vector2(i.x / Laya.stage.clientScaleX, i.y / Laya.stage.clientScaleY - Laya.stage.height / 2);
            v.commonData.GGame.showLevelTipUi(e, t, s);
        }
        checkProp(e) {
            for (let t = 0; t < this.propArr.length; ++t)
                if (e == this.propArr[t]) return !0;
            return !1;
        }
        checkGun() {
            for (let e = 0; e < this.propArr.length; ++e)
                if (this.propArr[e] > 5 && this.propArr[e] < 9) return !0;
            return !1;
        }
        removeProp(e) {
            for (let t = 0; t < this.propArr.length; ++t)
                if (e == this.propArr[t]) {
                    let a = this.single.getChildByName("prop_0" + e);
                    if (2 == e && ((a = this.single.getChildByName("prop_021")) || (a = this.single.getChildByName("prop_022"))), a) {
                        a.removeSelf(), a.active = !1, 2 != e && this.propArr.splice(t, 1);
                        break;
                    }
                }
        }
        moveBackAction() {
            this.movevalue = 0, v.gameData.gameState = 5;
            let e = Laya.Tween.to(this, {
                    movevalue: 1
                }, 800, Laya.Ease.quadInOut, new Laya.Handler(this, function() {
                    v.gameData.gameState = 3, 8 == this.gunType && (this.gun.getChildByName("redLine").active = !0), this.mulSpeed = .5;
                })),
                t = this.single.transform.position.clone(),
                a = this.single.transform.localRotationEulerX;
            e.update = new Laya.Handler(this, function() {
                let e = 1.5 * Math.sin(this.movevalue * Math.PI),
                    i = Math.abs(e);
                this.single.transform.localRotationEulerX = a * (1 - this.movevalue);
                let s = new Laya.Vector3(t.x, t.y + i, t.z);
                this.single.transform.position = s;
            });
        }
        calculateProp2() {
            let e = this.single.transform.position.clone();
            switch (v.gameMgr.obstacleLg.calculateProp2(e, 5)) {
                case 0:
                    this.bInvinsible = !0, Laya.timer.once(5e3, this, this.setInvinble), this.playEffect(10, e, this.single), v.soundMgr.play("getProp"), v.gameMgr.playVibrate(!0);
                    break;
                case 1:
                    this.hpValue += 50, this.hpValue > this.maxValue && (this.hpValue = this.maxValue), this.playEffect(9, e, this.single), v.soundMgr.play("getProp"), v.gameMgr.playVibrate(!0);
                    break;
                case 2:
                    v.soundMgr.play("bullet4"), v.soundMgr.play("getProp"), v.gameMgr.playVibrate(!0);
            }
        }
        setInvinble() {
            this.bInvinsible = !1;
        }
        onUpdate() {
            if (this.isMove) {
                if (v.gameData.gameState <= 1) this.playMove1(), this.setCarAngle(), this.calculateCar(), this.calculateProp(), this.playMove2();
                else if (2 == v.gameData.gameState) this.playMove3();
                else if (3 == v.gameData.gameState) {
                    for (let e = 0; e < Laya.Scene.unDestroyedScenes.length; e++) {
                        let t = Laya.Scene.unDestroyedScenes[e].url;
                        if (t = t.substring(t.lastIndexOf("/") + 1, t.lastIndexOf(".")), 1 == Laya.Scene.unDestroyedScenes[e].activeInHierarchy) {
                            if ("KnockEggNew" == t) return;
                            if ("ggame" == t) {
                                if (1 == Laya.Scene.unDestroyedScenes[e].getChildByName("middleUI").getChildByName("rewardPanel").visible) return;
                            }
                        }
                    }
                    v.gameMgr.isTouchDown ? this.moveSpeed < 1 && (this.moveSpeed += .04) : this.moveSpeed > 0 && (this.moveSpeed -= .04), this.isFire && this.fireBullet(), this.setRotateSpedd(), this.playMove4(), this.calculateCar(), this.calculateProp2(), this.calculatePropHp(), this.changePos2(), this.isGunRotate && this.gunRotateLoop();
                }
            } else this.single && v.gameData.isOn_home && this.playMove0();
        }
        changePos2() {
            let e = this.single.transform.position.clone(),
                t = new Laya.Vector4(0, 0, 0, 0);
            v.gameMgr.camera.viewport.project(e, v.gameMgr.camera.projectionViewMatrix, t);
            let a = new Laya.Vector2(t.x / Laya.stage.clientScaleX, t.y / Laya.stage.clientScaleY - Laya.stage.height / 2);
            v.commonData.GGame.setHpValueUi(0, a, this.hpValue / this.maxValue);
        }
        setRotateSpedd() {
            for (let e = 0; e < this.wheelAniArr.length; ++e) this.wheelAniArr[e].setSpeed(8 * this.mulSpeed * this.addSpeed * this.moveSpeed);
        }
        setCarAngle() {
            this.limitAngle();
        }
        setUpTheta(e) {
            this.isSetUpTheta = e;
        }
        setWheel(e) {
            this.isStateEnd1 || (this.theta = 180 * e / Math.PI, this.isRight ? (this.leftWheel.transform.localRotationEulerY = 2 * this.theta / 4, this.rightWheel.transform.localRotationEulerY = this.theta) : (this.leftWheel.transform.localRotationEulerY = this.theta, this.rightWheel.transform.localRotationEulerY = 2 * this.theta / 4), this.limitAngle());
        }
        limitAngle() {
            let e = new Laya.Vector3(0, 0, 0),
                t = new Laya.Vector3(0, 0, 0);
            (e = this.rightWheel.transform.rotationEuler.clone()).y > 30 ? this.rightWheel.transform.rotationEuler = new Laya.Vector3(e.x, 30, e.z) : e.y < -30 && (this.rightWheel.transform.rotationEuler = new Laya.Vector3(e.x, -30, e.z)), (t = this.leftWheel.transform.rotationEuler.clone()).y > 30 ? this.leftWheel.transform.rotationEuler = new Laya.Vector3(t.x, 30, t.z) : t.y < -30 && (this.leftWheel.transform.rotationEuler = new Laya.Vector3(t.x, -30, t.z)), (this.isSetUpTheta || this.isStateEnd1) && (e.y *= .9, t.y *= .9, this.rightWheel.transform.rotationEuler = e.clone(), this.leftWheel.transform.rotationEuler = t.clone());
        }
        checkGunState() {
            if (this.checkGun());
            else {
                let e = 6,
                    t = Laya.Pool.getItem("prop_0" + e);
                t || (t = v.gameMgr.obstacleLg.addDaoju(e)), t.active = !0, t.getChildByName("pcdld_09").active = !1, this.single.addChild(t), t.transform.localPosition = new Laya.Vector3(0, 0, 0), t.transform.localRotationEuler = new Laya.Vector3(0, 0, 0), this.gun = t, this.gunType = e, this.propArr.push(e), this.propItemArr.push(t);
            }
        }
        playMove0() {
            this.direction = new Laya.Vector3(0, 0, 1);
            let e = Laya.timer.delta / 1e3,
                t = this.single.transform.position.clone(),
                a = new Laya.Vector3(0, 0, 0);
            Laya.Vector3.scale(this.direction, this.speed * e * this.addSpeed * this.mulSpeed, a), Laya.Vector3.add(t, a, a), this.single.transform.position = a.clone();
        }
        playMove1() {
            this.leftWheel.transform.getForward(this.direction), this.isRight && this.rightWheel.transform.getForward(this.direction), Laya.Vector3.normalize(this.direction.clone(), this.direction), this.direction.z *= -1, this.direction.x *= -1, this.direction.y *= -1;
            let e = Laya.timer.delta / 1e3,
                t = this.single.transform.position.clone(),
                a = this.direction.clone();
            Laya.Vector3.scale(this.direction, this.speed * e * this.addSpeed * this.mulSpeed, a), Laya.Vector3.add(t, a, a), a.x > 4.8 && (a.x = 4.8), a.x < -4.8 && (a.x = -4.8), a && a.z && (this.single.transform.position = a.clone());
        }
        playMove2() {
            let e = this.single.transform.position.clone(),
                t = v.gameData.pointArr,
                a = t[0].transform.position;
            if (e.z > a.z)
                if (this.isStateEnd1 = !0, e.z > v.gameData.gameStartPos + 110 && (this.oriPos = e, this.mulSpeed = 1, v.gameData.gameState = 2, this.maxValue = this.hpValue, this.checkGunState(), v.gameMgr.cameraLg.setCameraDropMove()), e.z < t[t.length - 1].transform.position.z) {
                    for (let a = 1; a < t.length; ++a)
                        if (e.z < t[a].transform.position.z) {
                            if (1 == this.mulSpeed && (v.soundMgr.play("flyUp"), v.gameMgr.playVibrate(!1)), this.mulSpeed = 2, a > 1) {
                                let i = t[a - 1].transform.position.clone(),
                                    s = t[a].transform.position.clone(),
                                    o = (e.z - i.z) / (s.z - i.z),
                                    r = t[a - 1].transform.localRotationEulerX * (1 - o) + t[a].transform.localRotationEulerX * o;
                                this.single.transform.localRotationEulerX = r;
                            }
                            break;
                        }
                } else {
                    let e = this.single.transform.localRotationEulerX;
                    (e *= .98) > -45 && (e = -45), this.single.transform.localRotationEulerX = e;
                }
        }
        playMove3() {
            let e = Laya.timer.delta / 1e3;
            this.dropTime += e;
            let t = this.oriPos.y - 7.5 * this.dropTime * this.dropTime,
                a = this.oriPos.z + this.dropTime * this.speed;
            t < -13.8 && (t = -13.8, this.moveBackAction(), v.gameMgr.groundMgr.setScene1(!1), v.soundMgr.play("dropEnd"), v.gameMgr.playVibrate(!0)), this.single.transform.position = new Laya.Vector3(this.oriPos.x, t, a);
            let i = this.single.transform.localRotationEulerX;
            (i *= .98) > -25 && (i = -25), this.single.transform.localRotationEulerX = i;
        }
        playMove4() {
            this.leftWheel.transform.getForward(this.direction), this.isRight && this.rightWheel.transform.getForward(this.direction), Laya.Vector3.normalize(this.direction.clone(), this.direction), this.direction.z *= -1, this.direction.x *= -1, this.direction.y *= -1;
            let e = Laya.timer.delta / 1e3,
                t = this.single.transform.position.clone(),
                a = this.direction.clone();
            Laya.Vector3.scale(this.direction, this.speed * e * this.moveSpeed * this.addSpeed * this.mulSpeed, a), Laya.Vector3.add(t, a, a);
            let i = a.clone();
            Laya.Vector3.subtract(a, this.centerPos, i);
            let s = Laya.Vector3.scalarLength(i);
            s > this.radius && (Laya.Vector3.scale(i.clone(), this.radius / s, i), Laya.Vector3.add(i, this.centerPos, a)), (a = this.limitPos(a.clone(), t.clone())).y = -13.8, this.single.transform.position = a.clone();
        }
        limitPos(e, t) {
            let a = new Laya.Vector3(0, 0, 0),
                i = v.gameData.rockEndArr;
            for (let s = 0; s < i.length; ++s)
                if (3 == i[s].type) {
                    let o = i[s].pos;
                    Laya.Vector3.subtract(e, o, a);
                    let r = Laya.Vector3.scalarLength(a);
                    if (r < 4.5) return r < .01 && (Laya.Vector3.subtract(t, o, a), r = Laya.Vector3.scalarLength(a)), Laya.Vector3.scale(a.clone(), 4.5 / r, a), Laya.Vector3.add(a, o, e), e;
                } else if (6 == i[s].type) {
                let o = i[s].pos;
                Laya.Vector3.subtract(e, o, a);
                let r = Laya.Vector3.scalarLength(a);
                if (r < 3) return r < .01 && (Laya.Vector3.subtract(t, o, a), r = Laya.Vector3.scalarLength(a)), Laya.Vector3.scale(a.clone(), 3 / r, a), Laya.Vector3.add(a, o, e), e;
            } else if (7 == i[s].type) {
                let o = i[s].pos;
                Laya.Vector3.subtract(e, o, a);
                let r = Laya.Vector3.scalarLength(a);
                if (r < 2) return r < .01 && (Laya.Vector3.subtract(t, o, a), r = Laya.Vector3.scalarLength(a)), Laya.Vector3.scale(a.clone(), 2 / r, a), Laya.Vector3.add(a, o, e), e;
            }
            return e;
        }
        setAddSpeed() {
            this.addSpeed = [1, 1.05, 1.1, 1.2][this.propLevel[2] - 1];
        }
        setHpValue() {
            this.hpValue = [200, 250, 300, 350][this.propLevel[1] - 1];
        }
        setAttack() {
            this.attackMul = [1, 1.1, 1.2, 1.5][this.propLevel[0] - 1], v.gameData.attackValue = this.attackMul;
        }
        setCarLocalAngle(e, t) {
            let a = this.single.transform.position.clone(),
                i = new Laya.Vector3(a.x + e, a.y, a.z + t);
            this.single.transform.lookAt(i, new Laya.Vector3(0, 1, 0), !0);
        }
        gunAngleSet() {
            let e = new Laya.Vector3(0, 0, 0);
            this.gun.transform.getForward(e);
            let t = Math.acos(Laya.Vector3.dot(e, this.fireDirection));
            if (t < .001) return;
            let a = this.fireDirection.x * e.z - e.x * this.fireDirection.z;
            this.gunAngle = a >= 0 ? -t : t, this.rotateAngle = 0, this.isGunRotate = !0;
        }
        gunRotateLoop() {
            if (this.gunAngle >= 0) {
                let e = 1.5 * Math.PI * Laya.timer.delta * .001;
                this.rotateAngle += e, this.rotateAngle > this.gunAngle && (e = this.gunAngle - this.rotateAngle + e, this.isGunRotate = !1), this.gun.transform.rotate(new Laya.Vector3(0, e, 0), !0, !0);
            } else {
                let e = -1.5 * Math.PI * Laya.timer.delta * .001;
                this.rotateAngle += e, this.rotateAngle < this.gunAngle && (e = this.gunAngle - this.rotateAngle + e, this.isGunRotate = !1), this.gun.transform.rotate(new Laya.Vector3(0, e, 0), !0, !0);
            }
        }
    }
    class n extends Laya.Script {
        constructor() {
            super(...arguments), this.chekeArr = [], this.posArr = [];
        }
        init(e) {
            this.single = e;
            let t = e.getChildAt(0);
            this.showPlayer = t, this.showPlayerLg = t.addComponent(r), this.showPlayerLg.init(t, 0), this.chekeRoot = e.parent.getChildAt(1);
            for (let e = 0; e < 9; ++e) {
                let t = this.chekeRoot.getChildAt(e);
                this.chekeArr.push(t), t.active = !1;
            }
            this.initCheke(), this.changeSkin();
        }
        initCheke() {
            for (let e = 0; e < 9; ++e)
                for (let t = 0; t < 3; ++t) {
                    let t = Laya.Sprite3D.instantiate(this.chekeArr[e], this.chekeRoot);
                    Laya.Pool.recover(this.chekeArr[e].name, t);
                }
        }
        addCheke(e) {
            return Laya.Sprite3D.instantiate(this.chekeArr[e], this.chekeRoot);
        }
        getCheke(e) {
            let t = Laya.Pool.getItem(this.chekeArr[e].name);
            return t || (t = this.addCheke(e)), t;
        }
        changeSkin(e = -1) {
            if (-1 == e && (e = v.commonData.skinId), this.showPlayerLg.cheke) {
                let e = this.showPlayerLg.cheke;
                e.active = !1, e.transform.localPosition = new Laya.Vector3(0, 0, 0), e.transform.localRotationEuler = new Laya.Vector3(0, 0, 0), e.removeSelf(), Laya.Pool.recover(e.name, e);
            }
            let t = Laya.Pool.getItem(this.chekeArr[e].name);
            t || (t = this.addCheke(e)), t.active = !1, this.showPlayerLg.cheke = t, this.showPlayer.addChild(t), t.transform.localPosition = new Laya.Vector3(0, 0, 0), t.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
        }
        setPlayerMove(e, t) {
            if (this.showPlayerLg.isMove)
                if (1 == v.gameData.gameState) {
                    let a = Math.sqrt(e * e + t * t);
                    if (a > .05) {
                        this.showPlayerLg.isRight = e > 0;
                        let t = -e / a * Math.PI / 4;
                        this.showPlayerLg.setWheel(t), v.commonData.GGame && v.commonData.GGame.touchUiMoveSet2(e / a, 0);
                    }
                } else if (3 == v.gameData.gameState && e * e + t * t > .2) {
                let a = Math.sqrt(e * e + t * t),
                    i = e / a,
                    s = t / a;
                this.showPlayerLg.setCarLocalAngle(i, s), v.commonData.GGame && v.commonData.GGame.touchUiMoveSet2(i, s);
            }
        }
        setPlayerUpMove(e) {
            this.showPlayerLg.isMove && this.showPlayerLg.setUpTheta(e);
        }
        gameStart(e) {
            e && this.showPlayerLg.setMove(e);
        }
        reSetPlayer() {
            this.showPlayerLg.reset();
        }
    }
    class l extends Laya.Script {
        constructor() {
            super(...arguments), this.isMove = !1, this.oriAngle = null, this.startPos = new Laya.Vector3(0, 10.26, .1), this.startPos1 = new Laya.Vector3(0, 4.14, .1), this.startPos2 = new Laya.Vector3(0, 10.26, 2), this.distance = new Laya.Vector3(0, 0, 0), this.distance2 = new Laya.Vector3(0, 0, 0), this.distance3 = new Laya.Vector3(0, 0, 0), this.moveValue = 0, this.gameState = 1, this.moveValue2 = 0;
        }
        init(e) {
            this.single = e;
            let t = v.gameMgr.player.getChildAt(0).getChildAt(0);
            this.player = t;
            let a = t.transform.position.clone(),
                i = this.single.transform.position.clone();
            Laya.Vector3.subtract(i, a, this.distance2), this.single.transform.lookAt(a, new Laya.Vector3(0, 1, 0), !1), this.orip = e.transform.position.clone(), this.oriAngle = e.transform.rotation.clone();
            let s = this.startPos2.clone();
            Laya.Vector3.subtract(s, a, this.distance3), this.gameState = 1;
        }
        setCameraData(e) {}
        setStartPos(e) {
            let t = this.single.transform.position.clone();
            this.startPos = new Laya.Vector3(0, 10.26, .1 + t.z), this.startPos1 = new Laya.Vector3(0, 4.14, .1 + t.z);
        }
        setCameraMove() {
            this.moveValue = 0;
            let e = this.player.transform.position.clone(),
                t = Laya.Tween.to(this, {
                    moveValue: 1
                }, 1e3, Laya.Ease.linearIn, new Laya.Handler(this, function() {
                    let e = this.single.transform.position.clone(),
                        t = this.player.transform.position.clone();
                    Laya.Vector3.subtract(e, t, this.distance), this.isMove = !0, v.gameData.gameState = 1;
                })),
                a = this.startPos.z,
                i = this.startPos1.z;
            v.gameMgr.gameStart2(), v.gameData.gameState = -1, t.update = new Laya.Handler(this, function() {
                let t = new Laya.Vector3(0, 0, 0),
                    s = this.player.transform.position.clone();
                this.startPos1.z = s.z - e.z + i, this.startPos.z = s.z - e.z + a, Laya.Vector3.lerp(this.startPos, this.startPos1, this.moveValue, t), this.single.transform.position = t.clone(), this.single.transform.lookAt(s, new Laya.Vector3(0, 1, 0), !1);
            });
        }
        setCameraDropMove() {
            this.moveValue = 0;
            let e = this.single.transform.position.clone();
            Laya.Tween.to(this, {
                moveValue: 1
            }, 1e3, Laya.Ease.linearIn, new Laya.Handler(this, function() {
                this.setCameraDropMove2();
            })).update = new Laya.Handler(this, function() {
                let t = new Laya.Vector3(0, 0, 0),
                    a = this.player.transform.position.clone(),
                    i = new Laya.Vector3(0, 0, 0);
                Laya.Vector3.add(a, this.distance3, i), i.z = a.z - 2, i.y = a.y + 10, Laya.Vector3.lerp(e, i, this.moveValue, t), this.single.transform.position = t.clone(), this.single.transform.lookAt(a, new Laya.Vector3(0, 1, 0), !1);
            });
        }
        setCameraPos() {
            let e = this.player.transform.position.clone(),
                t = new Laya.Vector3(0, 0, 0);
            Laya.Vector3.add(e, this.distance3, t), t.z = e.z - 2, t.y = e.y + 10, this.single.transform.position = t.clone(), this.single.transform.lookAt(e, new Laya.Vector3(0, 1, 0), !1);
        }
        setCameraDropMove2() {
            this.moveValue2 = 0;
            let e = this.single.transform.position.clone();
            Laya.Tween.to(this, {
                moveValue2: 1
            }, 3500, Laya.Ease.linearIn, new Laya.Handler(this, function() {
                this.gameState = 3;
            })).update = new Laya.Handler(this, function() {
                let t = new Laya.Vector3(0, 0, 0),
                    a = this.player.transform.position.clone(),
                    i = new Laya.Vector3(0, 0, 0);
                Laya.Vector3.add(a, this.distance3, i), Laya.Vector3.lerp(e, i, this.moveValue2, t), this.single.transform.position = t.clone(), this.single.transform.lookAt(a, new Laya.Vector3(0, 1, 0), !1);
            });
        }
        onLateUpdate() {
            if (this.isMove) {
                if (v.gameData.gameState < 2) {
                    let e = this.player.transform.position.clone();
                    Laya.Vector3.add(e, this.distance, e), this.single.transform.position = e.clone(), this.single.transform.lookAt(e, new Laya.Vector3(0, 1, 0), !1);
                }
                if (3 == this.gameState) {
                    let e = this.player.transform.position.clone();
                    Laya.Vector3.add(e, this.distance3, e), this.single.transform.position = e.clone(), this.single.transform.lookAt(e, new Laya.Vector3(0, 1, 0), !1);
                }
            } else if (this.single && v.gameData.isOn_home) {
                let e = this.player.transform.position.clone(),
                    t = new Laya.Vector3(0, 0, 0);
                Laya.Vector3.add(e, this.distance2, t), this.single.transform.position = t.clone(), this.single.transform.lookAt(e, new Laya.Vector3(0, 1, 0), !1);
            }
        }
        endCameraMove() {
            let e = this.single.transform.position.clone(),
                t = this.player.transform.position.clone(),
                a = new Laya.Vector3(0, 0, 0);
            Laya.Vector3.lerp(e, t, .6, a), this.moveValue = 0, Laya.Tween.to(this, {
                moveValue: 1
            }, 1500, Laya.Ease.linearIn, new Laya.Handler(this, function() {
                this.isMove = !1;
            })).update = new Laya.Handler(this, function() {
                let t = new Laya.Vector3(0, 0, 0);
                Laya.Vector3.lerp(e, a, this.moveValue, t), this.single.transform.position = t;
            });
        }
        reSet() {
            this.gameState = 1, this.isMove = !1, this.single.transform.position = this.orip.clone(), this.single.transform.rotation = this.oriAngle.clone();
        }
    }
    class h extends Laya.Script {
        constructor() {
            super(...arguments), this.type = 0, this.ownerIndex = -1, this.atItem = null, this.start = null, this.end = null, this.moveStart = null, this.moveMiddle = null, this.moveValue = 0, this.moveEnd = null, this.isMove = !1, this.speed = 15, this.movetime = 0, this.direction = new Laya.Vector3(0, 0, 1);
        }
        init(e, t) {
            this.single = e, this.type = t;
        }
        setMove(e, t, a) {
            if (this.isMove = e, this.movetime = 0, this.ownerIndex = t, this.atItem = a, 3 == this.type) {
                Laya.timer.once(300, this, this.lateClear);
                let e = new Laya.Vector3(0, 0, 0);
                this.single.transform.getForward(e), Laya.Vector3.normalize(e.clone(), e), this.start = new Laya.Vector3(0, 0, 0), this.end = new Laya.Vector3(0, 0, 0), this.start = this.single.getChildByName("start").transform.position, this.end = this.single.getChildByName("end").transform.position;
            }
        }
        setMove2(e, t, a, i) {
            this.isMove = !1, this.ownerIndex = t, this.atItem = a, this.moveStart = this.single.transform.position.clone(), this.moveEnd = a.transform.position.clone(), this.moveMiddle = new Laya.Vector3(0, 0, 0), Laya.Vector3.lerp(this.moveStart, this.moveEnd, .5, this.moveMiddle), this.moveMiddle.y = this.moveStart.y + 10, this.moveValue = 0, Laya.Tween.to(this, {
                moveValue: 1
            }, 2e3, Laya.Ease.linearIn, new Laya.Handler(this, function() {
                this.single.active = !1, v.gameMgr.obstacleLg.prop2ArrIndex[2] = -1, v.gameMgr.effectMgr.playEffect(4, this.single.transform.position.clone()), i.calculateHp(100, this.ownerIndex);
            })).update = new Laya.Handler(this, function() {
                this.moveEnd = a.transform.position.clone();
                let e = this.calculatePos(this.moveValue, this.moveStart, this.moveMiddle, this.moveEnd),
                    t = this.calculatePos(this.moveValue - .015, this.moveStart, this.moveMiddle, this.moveEnd);
                this.single.transform.position = e, this.single.transform.lookAt(t, new Laya.Vector3(0, 1, 0), !0), v.gameData.isStart || Laya.Tween.clearAll(this);
            });
        }
        calculatePos(e, t, a, i) {
            let s = new Laya.Vector3(0, 0, 0);
            return s.x = t.x * (1 - e) * (1 - e) + 2 * a.x * (1 - e) * e + i.x * e * e, s.y = t.y * (1 - e) * (1 - e) + 2 * a.y * (1 - e) * e + i.y * e * e, s.z = t.z * (1 - e) * (1 - e) + 2 * a.z * (1 - e) * e + i.z * e * e, s;
        }
        lateClear() {
            this.clear();
        }
        clear() {
            this.single.active = !1, this.isMove = !1, Laya.Pool.recover(this.single.name, this.single);
        }
        setRecover(e) {
            Laya.timer.once(e, this, this.clear);
        }
        onUpdate() {
            if (this.isMove) {
                if (4 == this.type) {
                    let e = this.single.transform.position.clone(),
                        t = this.atItem.transform.position.clone(),
                        a = new Laya.Vector3(0, 0, 0);
                    Laya.Vector3.subtract(t, e, a), Laya.Vector3.normalize(a, this.direction);
                } else this.single.transform.getForward(this.direction), Laya.Vector3.normalize(this.direction, this.direction);
                1 == this.type || 2 == this.type ? (this.playMove(), this.calculate(), this.calculateRock()) : 3 == this.type && this.calculateLaser();
            }
        }
        calculatePropBullet() {
            this.single.transform.position.clone();
        }
        calculateRock() {
            let e = this.single.transform.position.clone(),
                t = v.gameData.rockEndArr;
            for (let a = 0; a < t.length; ++a) {
                let i = t[a].pos,
                    s = i.x - e.x,
                    o = i.z - e.x,
                    r = 1;
                if (3 == t[a].type ? r = 4.5 : 6 == t[a].type ? r = 3 : 7 == t[a].type && (r = 2), s * s + o * o < r * r) return this.clear(), void(2 == this.type ? (v.gameMgr.effectMgr.playEffect(4, this.single.transform.position.clone()), Laya.timer.once(200, this, this.lateCalculate)) : v.gameMgr.effectMgr.playEffect(3, this.single.transform.position.clone()));
            }
        }
        playMove() {
            let e = Laya.timer.delta / 1e3,
                t = new Laya.Vector3(0, 0, 0);
            Laya.Vector3.scale(this.direction, this.speed * e, t);
            let a = this.single.transform.position.clone(),
                i = new Laya.Vector3(0, 0, 0);
            Laya.Vector3.subtract(a, t, i), Laya.Vector3.add(t, a, t), this.single.transform.lookAt(t, new Laya.Vector3(0, 1, 0), !1), this.single.transform.position = t, this.movetime += e, 1 == this.type && this.movetime > 10 / this.speed && this.clear();
        }
        calculate() {
            let e = v.gameData.aiArr,
                t = this.single.transform.position.clone();
            for (let a = 0; a < 4; ++a) {
                if (!e[a].isActive) continue;
                let i = e[a].item;
                a == this.ownerIndex && (i = v.gameMgr.playerLg.showPlayer);
                let s = i.transform.position.clone(),
                    o = new Laya.Vector3(0, 0, 0);
                if (Laya.Vector3.subtract(t, s, o), o.y = 0, Laya.Vector3.scalarLength(o) < 1) {
                    this.clear(), a == this.ownerIndex ? 1 == this.type ? (v.gameMgr.effectMgr.playEffect(3, this.single.transform.position.clone()), v.gameMgr.playerLg.showPlayerLg.calculateHp(10)) : 2 == this.type && (v.gameMgr.effectMgr.playEffect(4, this.single.transform.position.clone()), Laya.timer.once(200, this, this.lateCalculate)) : 1 == this.type ? (v.gameMgr.effectMgr.playEffect(3, this.single.transform.position.clone()), 5 == this.ownerIndex ? e[a].lg.calculateHp(10 * v.gameData.attackValue, this.ownerIndex) : e[a].lg.calculateHp(10, this.ownerIndex)) : 2 == this.type && (v.gameMgr.effectMgr.playEffect(4, this.single.transform.position.clone()), Laya.timer.once(200, this, this.lateCalculate));
                    break;
                }
            }
            if (2 == this.type) {
                let e = v.gameMgr.groundMgr.groundScene2.transform.position.clone(),
                    a = e.x - t.x,
                    i = e.z - t.z;
                a * a + i * i >= 324 && (this.clear(), v.gameMgr.effectMgr.playEffect(4, this.single.transform.position.clone()), Laya.timer.once(200, this, this.lateCalculate));
            }
        }
        lateCalculate() {
            let e = v.gameData.aiArr;
            for (let t = 0; t < 4; ++t) {
                let a = e[t].item;
                t == this.ownerIndex && (a = v.gameMgr.playerLg.showPlayer);
                let i = this.single.transform.position.clone(),
                    s = a.transform.position.clone(),
                    o = new Laya.Vector3(0, 0, 0);
                Laya.Vector3.subtract(i, s, o), Laya.Vector3.scalarLength(o) < 5 && (t == this.ownerIndex ? v.gameMgr.playerLg.showPlayerLg.calculateHp(40) : 5 == this.ownerIndex ? e[t].lg.calculateHp(40 * v.gameData.attackValue, this.ownerIndex) : e[t].lg.calculateHp(40, this.ownerIndex));
            }
        }
        calculateLaser() {
            let e = v.gameData.aiArr;
            for (let t = 0; t < 4; ++t) {
                let a = e[t].item;
                t == this.ownerIndex && (a = v.gameMgr.playerLg.showPlayer);
                let i = a.transform.position.clone();
                this.PointToSegDist(i.x, i.z, this.start.x, this.start.z, this.end.x, this.end.z) < 2 && (t == this.ownerIndex ? v.gameMgr.playerLg.showPlayerLg.laserHp(100) : 5 == this.ownerIndex ? e[t].lg.laserHp(100 * v.gameData.attackValue, this.ownerIndex) : e[t].lg.laserHp(100, this.ownerIndex));
            }
        }
        PointToSegDist(e, t, a, i, s, o) {
            let r = (s - a) * (e - a) + (o - i) * (t - i),
                n = 0;
            if (r < 0) return n = Math.sqrt((e - a) * (e - a) + (t - i) * (t - i));
            let l = (s - a) * (s - a) + (o - i) * (o - i);
            if (r > l) return n = Math.sqrt((e - s) * (e - s) + (t - o) * (t - o));
            let h = r / l,
                c = a + (s - a) * h,
                g = i + (o - i) * h;
            return n = Math.sqrt((e - c) * (e - c) + (g - t) * (g - t));
        }
    }
    class c extends Laya.Script {
        constructor() {
            super(...arguments), this.woffset = 0;
        }
        init(e) {
            this.single = e, this.woffset = Math.random();
        }
        onUpdate() {
            this.single && this.single.active && (this.woffset -= Laya.timer.delta / 1e3, this.single.particleRenderer ? this.single.particleRenderer.material.tilingOffset = new Laya.Vector4(1, 1, 0, this.woffset) : this.single.meshRenderer.material.tilingOffset = new Laya.Vector4(1, 1, 0, this.woffset));
        }
    }
    class g extends Laya.Script {
        constructor() {
            super(...arguments), this.isMove = !1, this.propArr = [], this.rockArr = [], this.pointArr = [], this.pointArrIndex = [], this.prop2Arr = [], this.prop2ArrIndex = [-1, -1, -1], this.endValue = 0, this.lastRan = -1;
        }
        init(e) {
            this.root = e, e.active = !0, this.propRoot = e.getChildByName("prop"), this.rockRoot = e.getChildByName("rock"), this.prop2Root = e.getChildByName("prop2");
            for (let e = 0; e < 3; ++e) {
                let t = this.prop2Root.getChildAt(e);
                t.active = !1, this.prop2Arr.push(t);
                let a = t.getChildByName("pcdld_09");
                if (a) {
                    a.addComponent(c).init(a.getChildAt(0));
                }
            }
            this.initDaoju(), this.getConfigData();
        }
        initDaoju() {
            let e = this.propRoot.numChildren;
            for (let t = 0; t < e; ++t) {
                let e = this.propRoot.getChildAt(t);
                this.propArr.push(e), 7 == t && (e.getChildByName("redLine").active = !1), e.active = !1;
                for (let t = 0; t < 3; ++t) {
                    let t = Laya.Sprite3D.instantiate(e, this.propRoot);
                    Laya.Pool.recover(e.name, t);
                    let a = t.getChildByName("pcdld_09");
                    if (a) {
                        a.addComponent(c).init(a.getChildAt(0));
                    }
                }
            }
            for (let e = 0; e < 3; ++e) {
                let t = this.rockRoot.getChildAt(e);
                this.rockArr.push(t), t.active = !1;
                for (let e = 0; e < 2; ++e) {
                    let e = Laya.Sprite3D.instantiate(t, this.propRoot);
                    Laya.Pool.recover(t.name + "ob", e);
                }
            }
        }
        addDaoju(e) {
            let t = Laya.Sprite3D.instantiate(this.propArr[e - 1], this.propRoot),
                a = t.getChildByName("pcdld_09");
            if (a) {
                a.addComponent(c).init(a.getChildAt(0));
            }
            return t;
        }
        addRock(e) {
            switch (e) {
                case 3:
                    e = 2;
                    break;
                case 6:
                    e = 0;
                    break;
                case 7:
                    e = 1;
            }
            return Laya.Sprite3D.instantiate(this.rockArr[e], this.rockRoot);
        }
        setMoveData(e) {
            this.isMove = e;
        }
        setScene() {
            v.commonData.newLevel;
            let e = new Laya.Vector3(0, 0, 0),
                t = v.configMgr.getLevelCfg()[Math.floor(4 * Math.random())].models;
            for (let a = 0; a < t.length; ++a) {
                let i = t[a].name.length,
                    s = parseInt(t[a].name.substr(6, i - 6)),
                    o = Laya.Pool.getItem(t[a].name);
                o || (o = this.addDaoju(s)), o.active = !1, 1 != s && 9 != s || (o.getChildByName("cheke_01").active = !0), this.propRoot.addChild(o), e.x = t[a].pos.x, e.y = t[a].pos.y + 1.1, e.z = t[a].pos.z, o.transform.position = e.clone(), o.transform.localRotationEulerY = t[a].r, o.transform.localScale = new Laya.Vector3(t[a].scale.x, t[a].scale.y, t[a].scale.z), o.getChildByName("pcdld_09").active = !1, o.getChildByName("pcdld_09").active = !0;
                let r = {
                    item: o,
                    pos: e.clone(),
                    isActive: !0,
                    type: s
                };
                v.gameData.daojuArr.push(r);
            }
        }
        setRockArr(e) {
            let t = new Laya.Vector3(0, 0, 0),
                a = v.configMgr.getLevelCfg()[Math.floor(3 * Math.random() + 4)].models;
            for (let i = 0; i < a.length; ++i) {
                if (a[i].name.startsWith("point")) {
                    let e = new Laya.Vector3(a[i].pos.x, a[i].pos.y, a[i].pos.z);
                    this.pointArr.push(e), this.pointArrIndex.push(this.pointArr.length - 1);
                    continue;
                }
                let s = parseInt(a[i].name.substr(6, 1)),
                    o = Laya.Pool.getItem(a[i].name + "ob");
                o || (o = this.addRock(s)), o.active = !0, this.rockRoot.addChild(o), t.x = a[i].pos.x, t.y = a[i].pos.y - 14.1, t.z = a[i].pos.z + e + 162, o.transform.position = t.clone(), o.transform.localRotationEulerY = a[i].r, o.transform.localScale = new Laya.Vector3(a[i].scale.x, a[i].scale.y, a[i].scale.z);
                let r = {
                    item: o,
                    pos: t.clone(),
                    type: s
                };
                v.gameData.rockEndArr.push(r);
            }
            this.endValue = e + 162, this.setProp2Scene(), Laya.timer.loop(15e3, this, this.setProp2Scene);
        }
        setProp2Scene() {
            let e = this.endValue,
                t = this.setPointArr(),
                a = new Laya.Vector3(0, -14.1, e),
                i = 0;
            for (let e = 0; e < 3; ++e)
                if (-1 == this.prop2ArrIndex[e]) {
                    let s = this.pointArr[t[i]].clone();
                    Laya.Vector3.add(s, a, s), s.y = -13.6, 2 == e && (s.y = -13), this.prop2ArrIndex[e] = t[i], this.prop2Arr[e].transform.position = s, this.prop2Arr[e].active = !0, i++;
                }
            if (this.prop2ArrIndex[2] >= 0) {
                let e = this.prop2Arr[2].transform.position.clone();
                e.y -= 1, this.prop2Arr[2].transform.lookAt(e, new Laya.Vector3(0, 1, 0), !0), this.prop2Arr[2].getChildByName("pcdld_09").active = !1, this.prop2Arr[2].getChildByName("pcdld_09").active = !0, this.prop2Arr[2].getChildByName("prop_11").getChildByName("pcdld_12").active = !1;
            }
        }
        setPointArr() {
            let e = [];
            for (let t = 0; t < this.pointArrIndex.length; ++t) {
                let a = !0;
                for (let e = 0; e < 3; ++e) this.pointArrIndex[t] == this.prop2ArrIndex[e] && (a = !1);
                a && e.push(this.pointArrIndex[t]);
            }
            for (let t = 0; t < 3 && t < e.length; ++t) {
                let a = Math.floor(Math.random() * (e.length - t) + t),
                    i = e[a];
                e[a] = e[t], e[t] = i;
            }
            return e;
        }
        calculateProp2(e, t) {
            for (let a = 0; a < 3; ++a)
                if (this.prop2ArrIndex[a] >= 0) {
                    let i = this.prop2Arr[a].transform.position.clone(),
                        s = e.x - i.x,
                        o = e.z - i.z;
                    if (s * s + o * o < 1) return 2 == a ? (this.prop2ArrIndex[a] = -2, this.calculateBullet(t)) : (this.prop2ArrIndex[a] = -1, this.prop2Arr[a].active = !1), a;
                }
            return -1;
        }
        calculateBullet(e) {
            let t, a = [];
            for (let e = 0; e < 4; ++e) v.gameData.aiArr[e].isActive && a.push(e);
            let i = Math.floor(Math.random() * a.length),
                s = null;
            if (a.length < 1) return this.prop2ArrIndex[2] = -1, void(this.prop2Arr[2].active = !1);
            e == a[i] ? (t = v.gameMgr.playerLg.showPlayer, s = v.gameMgr.playerLg.showPlayerLg) : (t = v.gameData.aiArr[a[i]].item, s = v.gameData.aiArr[a[i]].lg);
            let o = this.prop2Arr[2].getComponent(h);
            o || (o = this.prop2Arr[2].addComponent(h)).init(this.prop2Arr[2], 4), this.prop2Arr[2].getChildByName("prop_11").getChildByName("pcdld_12").active = !1, this.prop2Arr[2].getChildByName("prop_11").getChildByName("pcdld_12").active = !0, this.prop2Arr[2].getChildByName("pcdld_09").active = !1, o.setMove2(!0, e, t, s);
        }
        setShowProp(e) {
            let t = v.gameData.daojuArr;
            for (let a = 0; a < t.length; ++a) {
                t[a].item.active = !0;
                let i = t[a].item.transform.position.clone(),
                    s = new Laya.Vector3(i.x, i.y, i.z + e - 30);
                t[a].item.transform.position = s, v.gameData.daojuArr[a].pos = s;
            }
            this.setRockArr(e);
        }
        obstacleReset() {
            this.resetData(), this.getConfigData();
        }
        resetData() {
            this.pointArr = [], this.pointArrIndex = [], Laya.timer.clear(this, this.setProp2Scene), this.prop2ArrIndex = [-1, -1, -1];
            let e = v.gameData.daojuArr;
            for (let t = 0; t < e.length; ++t) {
                let a = e[t].item;
                a.active = !1, a.removeSelf(), Laya.Pool.recover(a.name, a);
            }
            v.gameData.daojuArr = [], e = v.gameData.rockEndArr;
            for (let t = 0; t < e.length; ++t) {
                let a = e[t].item;
                a.active = !1, a.removeSelf(), Laya.Pool.recover(a.name + "ob", a);
            }
            v.gameData.rockEndArr = [];
        }
        getRandomByTime() {}
        getConfigData() {
            this.setScene();
        }
        onUpdate() {}
    }
    class d extends Laya.Script {
        constructor() {
            super(...arguments), this.type = 0, this.name = "";
        }
        inti(e, t, a) {
            this.single = e, this.type = t, this.name = a;
        }
        setLatatimeHide(e) {
            Laya.timer.once(e, this, this.lateHide);
        }
        lateHide() {
            0 == this.type && this.single.removeSelf(), this.single.active = !1, this.type = -1, Laya.Pool.recover(this.name, this.single);
        }
        onUpdate() {}
    }
    class m extends Laya.Script {
        constructor() {
            super(...arguments), this.effectArr = [];
        }
        init(e) {
            this.root = e;
            for (let e = 0; e < this.root.numChildren; ++e) {
                let t = this.root.getChildAt(e);
                if (t.active = !1, this.effectArr.push(t), 10 == e) {
                    let e = t.getChildByName("Ani_wenli_125_1");
                    if (e) {
                        e.addComponent(c).init(e);
                    }
                }
            }
            this.initPoolEffect(0), this.initPoolEffect(3), this.initPoolEffect(4), this.initPoolEffect(8), this.initPoolEffect(12);
        }
        initPoolEffect(e) {
            for (let t = 0; t < 6; ++t) {
                let t = Laya.Sprite3D.instantiate(this.effectArr[e], this.root);
                t.addComponent(d).inti(t, e, this.effectArr[e].name), Laya.Pool.recover(this.effectArr[e].name, t);
            }
        }
        addEffect(e) {
            let t = Laya.Sprite3D.instantiate(this.effectArr[e], this.root);
            return t.addComponent(d).inti(t, e, this.effectArr[e].name), t;
        }
        hidePurple() {}
        playEffect(e, t, a = null) {
            if (this.getIndex(e)) {
                let a = Laya.Pool.getItem(this.effectArr[e].name);
                a || (a = this.addEffect(e)), a.transform.position = t, 0 == e && (v.gameMgr.playerLg.showPlayer.addChild(a), a.transform.localPosition = new Laya.Vector3(0, 0, 0)), a.active = !1, a.active = !0, a.getComponent(d).setLatatimeHide(2e3);
            } else {
                let i = this.effectArr[e];
                i.transform.position = t, 9 != e && 10 != e || (a && (a.addChild(i), i.transform.localPosition = new Laya.Vector3(0, 0, 0)), 10 == e && Laya.timer.once(5e3, this, function() {
                    i.active = !1, i.removeSelf();
                })), 13 == e && Laya.timer.once(3e3, this, function() {
                    i.active = !1;
                }), i.active = !1, i.active = !0;
            }
        }
        getIndex(e) {
            return 0 == e || 3 == e || 4 == e || 8 == e || 12 == e;
        }
    }
    class p extends Laya.Script {
        constructor() {
            super(...arguments), this.endPropArr = [], this.sceneRoadArr0 = [], this.sceneRoadArr1 = [], this.roadMoveArr1 = [], this.isMove = !1, this.woffset = 0;
        }
        init(e) {
            this.sceneRoot = e, this.groundScene1 = e.getChildByName("groundScene1"), this.groundScene2 = e.getChildByName("groundScene2"), this.groundScene1.active = !1, this.groundScene2.active = !1, this.setStartRoad(), this.groundScene2.transform.position = new Laya.Vector3(0, -14.1, 140), this.sky = e.getChildByName("sky"), this.skyChild = this.sky.getChildByName("sky_01"), this.startRoad = this.groundScene1.getChildAt(0), this.isMove = !0;
            for (let e = 0; e < this.groundScene1.numChildren; ++e) {
                let t = this.groundScene1.getChildAt(e);
                this.sceneRoadArr1.push(t);
            }
            this.sceneRoadArr1[0].transform.position = new Laya.Vector3(0, 0, -14.1), this.sceneRoadArr1[0].active = !1;
            for (let e = 0; e < 7; ++e) {
                let t = this.sceneRoadArr1[3].getChildAt(e);
                t.active = !1, v.gameData.pointArr.push(t);
            }
            this.roadMoveArr1.push(this.sceneRoadArr1[1]);
            for (let e = 0; e < 4; ++e) {
                let e = Laya.Sprite3D.instantiate(this.sceneRoadArr1[1], this.groundScene1);
                this.roadMoveArr1.push(e);
            }
            this.initFirstScene(), this.initProp();
        }
        setStartRoad() {
            this.groundScene0 = this.sceneRoot.getChildByName("groundScene0");
            let e = this.groundScene0.getChildAt(0);
            e.transform.position = new Laya.Vector3(0, 0, -15), this.sceneRoadArr0.length = 6, this.sceneRoadArr0[0] = e;
            for (let t = 1; t < 6; ++t) {
                let a = Laya.Sprite3D.instantiate(e, this.groundScene0);
                this.sceneRoadArr0[t] = a, a.transform.position = new Laya.Vector3(0, 0, 15 * t - 15);
            }
        }
        setGameStart() {
            let e = v.gameMgr.playerLg.showPlayer.transform.position.clone(),
                t = 99999999;
            for (let a = 0; a < this.sceneRoadArr0.length; ++a) {
                let i = this.sceneRoadArr0[a],
                    s = i.transform.position.clone();
                s.z > e.z && (t > s.z + 45 && (t = s.z + 45), s.z >= e.z + 45 && (i.active = !1));
            }
            this.groundScene1.transform.position = new Laya.Vector3(0, 0, t - 30), this.groundScene2.transform.position = new Laya.Vector3(0, -14.1, t + 132), this.groundScene1.active = !0, this.groundScene2.active = !0, v.gameMgr.obstacleLg.setShowProp(t - 30), v.gameMgr.cameraLg.setStartPos(t - 60), v.gameData.gameStartPos = t;
        }
        reset() {
            this.groundScene1.active = !1, this.groundScene2.active = !1, this.groundScene0.active = !0;
            for (let e = 0; e < 6; ++e) {
                let t = this.sceneRoadArr0[e];
                t.active = !0, t.transform.position = new Laya.Vector3(0, 0, 15 * e - 15);
            }
        }
        setScene1(e) {
            this.groundScene1.active = e, this.groundScene0.active = e;
        }
        initFirstScene() {
            for (let e = 0; e < 5; ++e) {
                this.roadMoveArr1[e].transform.localPosition = new Laya.Vector3(0, 0, 30 + 15 * e);
            }
            this.sceneRoadArr1[2].transform.localPosition = new Laya.Vector3(0, 0, 105), this.sceneRoadArr1[3].transform.localPosition = new Laya.Vector3(0, -.2, 107), this.sceneRoadArr1[4].transform.localPosition = new Laya.Vector3(0, 0, 105);
        }
        playVibrate() {
            v.storageMgr.isPlayVibrate() && zs.laya.sdk.DeviceService.VibrateShort();
        }
        producePeople(e, t) {}
        initProp() {}
        addProp(e) {}
        onUpdate() {
            if (this.isMove) {
                let e = v.gameMgr.playerLg.showPlayer.transform.position.clone();
                e.y = -14.1;
                let t = e.z + 180;
                if (t > v.gameData.gameStartPos + 130 && v.gameData.isStart && (t = v.gameData.gameStartPos + 130), this.skyChild.transform.position = new Laya.Vector3(e.x, e.y, t), !v.gameData.isStart)
                    for (let t = 0; t < 6; ++t) {
                        let a = this.sceneRoadArr0[t],
                            i = a.transform.position.clone();
                        i.z < e.z - 30 && (i.z += 90, a.transform.position = i);
                    }
            }
        }
    }
    class u extends Laya.Script {
        constructor() {
            super(...arguments), this.isMove = !1, this.index = 0, this.speed = 10, this.wheelAniArr = [], this.direction = new Laya.Vector3(0, 0, 0), this.isRight = !1, this.pointArr = [], this.gunType = 6, this.daodanAtItem = null, this.centerPos = new Laya.Vector3(0, 0, 0), this.radius = 18, this.cheke = null, this.mulSpeed = 1, this.hpValue = 400, this.safeDis = 1.6, this.fireDirection = new Laya.Vector3(0, 0, 1), this.calculateTime = 0, this.isFire = !1, this.lastFireTime = 0, this.start = null, this.end = null, this.movevalue = 0, this.isTween = !1, this.propItemArr = [], this.propArr = [], this.lastCutTime = 0, this.lastCutTime2 = 0, this.laserTime = 0, this.bInvinsible = !1, this.singlePos = null, this.moveDistance = 0, this.isSetUpTheta = !1, this.lastCarTime = 0, this.thetaTime = 0, this.carTheta = 0, this.theta = 0, this.isStateEnd1 = !1, this.dropTime = 0, this.oriPos = null, this.gameState = 1, this.gunAngle = 0, this.rotateAngle = 0, this.isGunRotate = !1;
        }
        init(e, t = 0) {
            this.single = e, this.index = t, this.calculateRoot = e.getChildByName("calculateRoot");
            for (let e = 0; e < this.calculateRoot.numChildren; ++e) {
                let t = this.calculateRoot.getChildAt(e);
                this.pointArr.push(t);
            }
            this.hpValue = 400, this.mapCenter = v.gameMgr.groundScene.getChildAt(2), this.centerPos = this.mapCenter.transform.position.clone(), this.leftWheel = e.getChildByName("qianlun_01_L"), this.rightWheel = e.getChildByName("qianlun_01_R"), this.backWheel = e.getChildByName("houlun_01"), this.leftWheelCi = this.leftWheel.getChildByName("qianci_01_L"), this.rightWheelCi = this.rightWheel.getChildByName("qianci_01_R"), this.backCi = this.backWheel.getChildByName("houci_01"), this.hideCarProp(), this.setWheelAni(), this.setStartPos();
        }
        setStartPos() {
            let e = v.gameData.aiPosArr,
                t = new Laya.Vector3(0, 0, 0);
            t.x = e[2 * this.index], t.z = e[2 * this.index + 1] + 10.78, t.y = 1.1, this.single.transform.position = t, this.single.transform.lookAt(new Laya.Vector3(t.x, 1.1, 0), new Laya.Vector3(0, 1, 0), !1);
        }
        hideCarProp() {
            this.leftWheelCi.active = !1, this.rightWheelCi.active = !1, this.backCi.active = !1, this.backWheel.getChildByName("houlun_R2").active = !1, this.backWheel.getChildByName("houlun_L2").active = !1, this.leftWheel.getChildByName("qianlun_02_L").active = !1, this.rightWheel.getChildByName("qianlun_02_R").active = !1, this.leftWheel.transform.localScale = new Laya.Vector3(1, 1, 1), this.rightWheel.transform.localScale = new Laya.Vector3(1, 1, 1);
            let e = this.backWheel.getChildByName("houlun_L"),
                t = this.backWheel.getChildByName("houlun_R");
            e.transform.localScale = new Laya.Vector3(1, 1, 1), t.transform.localScale = new Laya.Vector3(1, 1, 1), e.transform.localPosition = new Laya.Vector3(-.4587885, 0, 0), t.transform.localPosition = new Laya.Vector3(.4587885, 0, 0);
        }
        setWheelAni() {
            let e = this.leftWheel.getChildByName("qianlun_01_L"),
                t = this.leftWheel.getChildByName("qianlun_02_L"),
                a = this.rightWheel.getChildByName("qianlun_01_R"),
                i = this.rightWheel.getChildByName("qianlun_02_R"),
                s = this.backWheel.getChildByName("houlun_L"),
                r = this.backWheel.getChildByName("houlun_R"),
                n = this.backWheel.getChildByName("houlun_L2"),
                l = this.backWheel.getChildByName("houlun_R2"),
                h = e.addComponent(o),
                c = t.addComponent(o),
                g = a.addComponent(o),
                d = i.addComponent(o),
                m = s.addComponent(o),
                p = r.addComponent(o),
                u = n.addComponent(o),
                y = l.addComponent(o),
                f = this.backCi.addComponent(o),
                L = this.leftWheel.getChildByName("qianci_01_L"),
                v = this.rightWheel.getChildByName("qianci_01_R"),
                w = L.addComponent(o),
                C = v.addComponent(o);
            h.init(e), c.init(t), g.init(a), d.init(i), m.init(s), p.init(r), u.init(n), y.init(l), f.init(this.backCi), w.init(L), C.init(v), this.wheelAniArr.push(h), this.wheelAniArr.push(c), this.wheelAniArr.push(g), this.wheelAniArr.push(d), this.wheelAniArr.push(m), this.wheelAniArr.push(p), this.wheelAniArr.push(u), this.wheelAniArr.push(y), this.wheelAniArr.push(f), this.wheelAniArr.push(w), this.wheelAniArr.push(C);
        }
        reset() {
            this.isStateEnd1 = !1, this.gameState = 1, this.lastCarTime = 0, this.thetaTime = 0, this.lastCutTime = 0, this.lastCutTime2 = 0, this.bInvinsible = !1, Laya.timer.clear(this, this.setInvinble), this.laserTime = 0, this.dropTime = 0, this.mulSpeed = 1, this.setStartPos(), this.hpValue = 400, this.cheke && (this.cheke.active = !1), this.isMove = !1, this.resetParticle(), this.resetCar();
        }
        setMove(e) {
            this.isMove = e, this.centerPos = this.mapCenter.transform.position.clone();
        }
        resetCar() {
            this.hideCarProp();
            for (let e = 0; e < this.propItemArr.length; ++e) this.propItemArr[e].removeSelf(), this.propItemArr[e].active = !1, "prop_08" == this.propItemArr[e].name && (this.propItemArr[e].getChildByName("redLine").active = !1), Laya.Pool.recover(this.propItemArr[e].name, this.propItemArr[e]);
            this.propItemArr = [], this.gun = null, this.propArr = [];
        }
        resetParticle() {
            let e = this.single.getChildByName("pcdld_10");
            e && (e.removeSelf(), e.active = !1), (e = this.single.getChildByName("pcdld_11")) && (e.removeSelf(), e.active = !1);
        }
        calculateHp(e, t) {
            this.isMove && !this.bInvinsible && (this.hpValue -= Math.floor(e), this.hpValue <= 0 && (this.isMove = !1, v.gameData.aiArr[this.index].isActive = !1, v.gameData.aiDieCount++, v.commonData.GGame.setLeftAi(4 - v.gameData.aiDieCount), this.single.active = !1, v.gameMgr.effectMgr.playEffect(4, this.single.transform.position.clone()), v.commonData.GGame.hideHp(this.index + 1), v.soundMgr.play("carBroken"), 5 == t && (v.gameData.killCount++, v.commonData.GGame.showKillUi(v.gameData.killCount - 1)), v.gameData.aiDieCount >= 4 && (v.gameMgr.isVictory = !0, v.gameMgr.gameOver())));
        }
        pointInBox(e, t, a, i) {
            let s = new Laya.Vector3(0, 0, 0);
            t.transform.getForward(s), Laya.Vector3.normalize(s.clone(), s);
            let o = t.transform.position.clone(),
                r = new Laya.Vector3(0, 0, 0);
            Laya.Vector3.subtract(e, o, r);
            let n = Laya.Vector3.dot(s, r),
                l = new Laya.Vector3(0, 0, 0);
            t.transform.getRight(l), Laya.Vector3.normalize(l.clone(), l);
            let h = Laya.Vector3.dot(l, r);
            if (Math.abs(h) < a.x / 2) {
                if (5 == i && n < 0 && n > -a.z) return !0;
                if (6 == i && Math.abs(n) < a.z / 2) return !0;
                if (n < a.z / 2 && n > 0) return !0;
            }
            return !1;
        }
        playEffect(e, t, a = null) {
            v.gameMgr.effectMgr.playEffect(e, t, a);
        }
        calculateCar() {
            this.calculateTime += Laya.timer.delta / 1e3, this.calculateTime = 0;
            let e = this.single.transform.position.clone(),
                t = v.gameData.aiArr,
                a = 100,
                i = 0,
                s = e.clone();
            for (let o = 0; o < t.length; ++o) {
                let r = t[o].item;
                if (t[o].isActive) {
                    r == this.single && (r = v.gameMgr.playerLg.showPlayer);
                    let t = r.transform.position.clone();
                    Laya.Vector3.subtract(t, e, s);
                    let n = Laya.Vector3.scalarLength(s);
                    n < this.safeDis ? (s.y = 0, Laya.Vector3.normalize(s.clone(), s), Laya.Vector3.scale(s, .8 * (n - 1.6), s), this.end = s.clone(), this.collisionSet()) : 3 == this.gameState && n < a && (a = n, i = o, this.fireDirection = s.clone(), 7 == this.gunType && (this.daodanAtItem = r));
                }
            }
            3 == this.gameState && this.isInDistance(a) ? (Laya.Vector3.normalize(this.fireDirection.clone(), this.fireDirection), this.gunAngleSet(), this.isFire = !0) : this.isFire = !1;
        }
        isInDistance(e) {
            switch (this.gunType) {
                case 6:
                    return e < 8;
                case 7:
                    return e < 13;
                case 8:
                    return e < 8;
            }
            return !1;
        }
        fireBullet() {
            let e = new Date().valueOf();
            if (6 == this.gunType) {
                if (e - this.lastFireTime > 333) {
                    this.lastFireTime = e;
                    let t = this.gun.getChildByName("firePoint"),
                        a = new Laya.Vector3(0, 0, 0);
                    t.transform.getForward(a);
                    let i = t.transform.position.clone();
                    Laya.Vector3.subtract(i, a, a), v.gameMgr.bulletMgr.fireBullet(i, 1, a, this.index);
                }
            } else if (7 == this.gunType) {
                if (e - this.lastFireTime > 1500) {
                    this.lastFireTime = e;
                    let t = this.gun.getChildByName("firePoint"),
                        a = new Laya.Vector3(0, 0, 0);
                    t.transform.getForward(a);
                    let i = t.transform.position.clone();
                    Laya.Vector3.subtract(i, a, a), v.gameMgr.bulletMgr.fireBullet(i, 2, a, this.index, this.daodanAtItem);
                }
            } else if (8 == this.gunType && e - this.lastFireTime > 3e3) {
                this.lastFireTime = e;
                let t = this.gun.getChildByName("firePoint");
                this.gun.getChildByName("redLine").active = !1;
                let a = new Laya.Vector3(0, 0, 0);
                t.transform.getForward(a);
                let i = t.transform.position.clone();
                Laya.Vector3.subtract(i, a, a), v.gameMgr.bulletMgr.fireBullet(i, 3, a, this.index), this.isMove = !1, Laya.timer.once(300, this, this.lateMove);
            }
        }
        lateMove() {
            this.isMove = !0, this.gun && (this.gun.getChildByName("redLine").active = !0);
        }
        collisionSet() {
            if (this.isTween) return;
            this.isTween = !0, this.movevalue = 0;
            let e = Laya.Tween.to(this, {
                    movevalue: 1
                }, 200, Laya.Ease.quadInOut, new Laya.Handler(this, function() {
                    this.isTween = !1;
                })),
                t = new Laya.Vector3(0, 0, 0);
            e.update = new Laya.Handler(this, function() {
                Laya.Vector3.scale(this.end, this.movevalue, t);
                let e = this.single.transform.position.clone();
                if (Laya.Vector3.add(e, t, t), 1 == v.gameData.gameState) t.x > 4.8 && (t.x = 4.8), t.x < -4.8 && (t.x = -4.8);
                else if (3 == this.gameState) {
                    let a = t.clone();
                    Laya.Vector3.subtract(t, this.centerPos, a);
                    let i = Laya.Vector3.scalarLength(a);
                    i > this.radius ? (Laya.Vector3.scale(a.clone(), this.radius / i, a), Laya.Vector3.add(a, this.centerPos, t)) : i < 4.5 && (i < .01 && (Laya.Vector3.subtract(e, this.centerPos, a), i = Laya.Vector3.scalarLength(a)), Laya.Vector3.scale(a.clone(), 4.5 / i, a), Laya.Vector3.add(a, this.centerPos, t)), t = this.limitPos(t.clone(), e.clone());
                }
                t.y = e.y, this.single.transform.position = t.clone();
            });
        }
        calculateProp() {
            let e = v.gameData.daojuArr,
                t = new Laya.Vector3(0, 0, 0),
                a = this.single.transform.position.clone();
            for (let i = 0; i < e.length; ++i)
                if (e[i].isActive) {
                    let s = e[i],
                        o = s.pos;
                    Laya.Vector3.subtract(a, o, t), Laya.Vector3.scalarLength(t) < 1.2 && (v.gameData.daojuArr[i].isActive = !1, s.item.active = !1, this.addProp(s.type));
                }
        }
        setProp2(e) {
            if (this.checkProp(2)) {
                let t;
                this.removeProp(2), 3 != e ? (t = Laya.Pool.getItem("prop_021")) || (t = v.gameMgr.obstacleLg.addDaoju(10)) : (t = Laya.Pool.getItem("prop_022")) || (t = v.gameMgr.obstacleLg.addDaoju(11)), t.active = !0, this.single.addChild(t), t.transform.localPosition = new Laya.Vector3(0, 0, 0), t.transform.localRotationEuler = new Laya.Vector3(0, 0, 0), this.propItemArr.push(t);
            }
        }
        addProp(e) {
            if (!this.checkProp(e)) {
                if (1 == e) {
                    let t = Laya.Pool.getItem("prop_0" + e);
                    t || (t = v.gameMgr.obstacleLg.addDaoju(e)), t.active = !0, t.getChildByName("cheke_01").active = !1, t.getChildByName("pcdld_09").active = !1, this.cheke && (this.cheke.active = !0), this.single.addChild(t), t.transform.localPosition = new Laya.Vector3(0, 0, 0), t.transform.localRotationEuler = new Laya.Vector3(0, 0, 0), this.propItemArr.push(t);
                } else if (2 == e) {
                    let e;
                    this.checkProp(3) ? (e = Laya.Pool.getItem("prop_022")) || (e = v.gameMgr.obstacleLg.addDaoju(11)) : (e = Laya.Pool.getItem("prop_021")) || (e = v.gameMgr.obstacleLg.addDaoju(10)), e.active = !0, this.cheke && (this.cheke.active = !0), this.single.addChild(e), e.transform.localPosition = new Laya.Vector3(0, 0, 0), e.transform.localRotationEuler = new Laya.Vector3(0, 0, 0), this.propItemArr.push(e);
                } else if (3 == e) {
                    this.hideCarProp(), this.setProp2(e);
                    let t = this.backWheel.getChildByName("houlun_L"),
                        a = this.backWheel.getChildByName("houlun_R");
                    t.transform.localScale = new Laya.Vector3(2, 1.5, 1.5), a.transform.localScale = new Laya.Vector3(2, 1.5, 1.5), t.transform.localPosition = new Laya.Vector3(-.55, .13, 0), a.transform.localPosition = new Laya.Vector3(.55, .13, 0), this.leftWheel.transform.localScale = new Laya.Vector3(1.2, 1.2, 1.2), this.rightWheel.transform.localScale = new Laya.Vector3(1.2, 1.2, 1.2);
                } else if (4 == e) {
                    this.hideCarProp(), this.setProp2(e);
                    let t = this.leftWheel.getChildByName("qianlun_02_L"),
                        a = this.rightWheel.getChildByName("qianlun_02_R"),
                        i = this.backWheel.getChildByName("houlun_L2"),
                        s = this.backWheel.getChildByName("houlun_R2");
                    i.active = !0, s.active = !0, t.active = !0, a.active = !0, i.transform.localScale = new Laya.Vector3(1.2, 1.2, 1.2), s.transform.localScale = new Laya.Vector3(1.2, 1.2, 1.2);
                    let o = this.backWheel.getChildByName("houlun_L"),
                        r = this.backWheel.getChildByName("houlun_R");
                    o.transform.localScale = new Laya.Vector3(1.2, 1.2, 1.2), r.transform.localScale = new Laya.Vector3(1.2, 1.2, 1.2), this.leftWheel.transform.localScale = new Laya.Vector3(1.2, 1.2, 1.2), this.rightWheel.transform.localScale = new Laya.Vector3(1.2, 1.2, 1.2);
                } else if (5 == e) {
                    this.hideCarProp(), this.setProp2(e), this.leftWheelCi.active = !0, this.rightWheelCi.active = !0, this.backCi.active = !0;
                    let t = this.backWheel.getChildByName("houlun_L"),
                        a = this.backWheel.getChildByName("houlun_R");
                    t.transform.localScale = new Laya.Vector3(1.2, 1.2, 1.2), a.transform.localScale = new Laya.Vector3(1.2, 1.2, 1.2), this.leftWheel.transform.localScale = new Laya.Vector3(1.2, 1.2, 1.2), this.rightWheel.transform.localScale = new Laya.Vector3(1.2, 1.2, 1.2);
                } else if (e < 9) {
                    this.removeProp(6), this.removeProp(7), this.removeProp(8);
                    let t = Laya.Pool.getItem("prop_0" + e);
                    t || (t = v.gameMgr.obstacleLg.addDaoju(e)), t.active = !0, t.getChildByName("pcdld_09").active = !1, this.single.addChild(t), t.transform.localPosition = new Laya.Vector3(0, 0, 0), t.transform.localRotationEuler = new Laya.Vector3(0, 0, 0), this.gun = t, this.gunType = e, this.propItemArr.push(t);
                } else {
                    let t = Laya.Pool.getItem("prop_0" + e);
                    t || (t = v.gameMgr.obstacleLg.addDaoju(e)), t.active = !0, t.getChildByName("cheke_01").active = !1, t.getChildByName("pcdld_09").active = !1, this.cheke && (this.cheke.active = !0), this.single.addChild(t), t.transform.localPosition = new Laya.Vector3(0, 0, 0), t.transform.localRotationEuler = new Laya.Vector3(0, 0, 0), this.propItemArr.push(t);
                }
                this.propArr.push(e);
            }
        }
        checkProp(e) {
            for (let t = 0; t < this.propArr.length; ++t)
                if (e == this.propArr[t]) return !0;
            return !1;
        }
        checkGun() {
            for (let e = 0; e < this.propArr.length; ++e)
                if (this.propArr[e] > 5 && this.propArr[e] < 9) return !0;
            return !1;
        }
        removeProp(e) {
            for (let t = 0; t < this.propArr.length; ++t)
                if (e == this.propArr[t]) {
                    let a = this.single.getChildByName("prop_0" + e);
                    if (2 == e && ((a = this.single.getChildByName("prop_021")) || (a = this.single.getChildByName("prop_022"))), a) {
                        a.removeSelf(), a.active = !1, 2 != e && this.propArr.splice(t, 1);
                        break;
                    }
                }
        }
        cutHp() {
            let e = new Date().valueOf();
            e - this.lastCutTime > 500 && (this.lastCutTime = e, this.calculateHp(10, 5));
        }
        cutHp2() {
            let e = new Date().valueOf();
            e - this.lastCutTime2 > 500 && (this.lastCutTime2 = e, this.calculateHp(Math.floor(this.hpValue / 4), 5), v.soundMgr.play("hitOther"));
        }
        laserHp(e, t) {
            let a = new Date().valueOf();
            a - this.laserTime > 550 && (this.laserTime = a, this.calculateHp(e, t));
        }
        moveBackAction() {
            this.movevalue = 0, this.gameState = 5;
            let e = Laya.Tween.to(this, {
                    movevalue: 1
                }, 800, Laya.Ease.quadInOut, new Laya.Handler(this, function() {
                    this.gameState = 3;
                    let e = new Laya.Vector3(t.x, -13.8, t.z);
                    this.single.transform.position = e, this.mulSpeed = .5, 8 == this.gunType && (this.gun.getChildByName("redLine").active = !0);
                })),
                t = this.single.transform.position.clone(),
                a = this.single.transform.localRotationEulerX;
            e.update = new Laya.Handler(this, function() {
                let e = 1.5 * Math.sin(this.movevalue * Math.PI),
                    i = Math.abs(e);
                this.single.transform.localRotationEulerX = a * (1 - this.movevalue);
                let s = new Laya.Vector3(t.x, t.y + i, t.z);
                this.single.transform.position = s;
            });
        }
        calculateProp2() {
            let e = this.single.transform.position.clone();
            switch (v.gameMgr.obstacleLg.calculateProp2(e, this.index)) {
                case 0:
                    this.bInvinsible = !0, Laya.timer.once(5e3, this, this.setInvinble), this.playEffect(10, e, this.single);
                    break;
                case 1:
                    this.hpValue += 50, this.hpValue > 400 && (this.hpValue = 400), this.playEffect(9, e, this.single);
            }
        }
        setInvinble() {
            this.bInvinsible = !1;
        }
        onUpdate() {
            if (this.isMove) {
                if (1 == this.gameState) this.playMove1(), this.setCarAngle(), this.calculateCar(), this.calculateProp(), this.playMove2(), this.setCarTheta();
                else if (2 == this.gameState) this.playMove3();
                else if (3 == this.gameState) {
                    for (let e = 0; e < Laya.Scene.unDestroyedScenes.length; e++) {
                        let t = Laya.Scene.unDestroyedScenes[e].url;
                        if (t = t.substring(t.lastIndexOf("/") + 1, t.lastIndexOf(".")), 1 == Laya.Scene.unDestroyedScenes[e].activeInHierarchy) {
                            if ("KnockEggNew" == t) return;
                            if ("ggame" == t) {
                                if (1 == Laya.Scene.unDestroyedScenes[e].getChildByName("middleUI").getChildByName("rewardPanel").visible) return;
                            }
                        }
                    }
                    this.isFire && this.fireBullet(), this.setCarLocalAngleLoop(), this.playMove4(), this.calculateCar(), this.calculateProp2(), this.changePos2(), this.isGunRotate && this.gunRotateLoop();
                }
            } else this.single && v.gameData.isOn_home && this.playMove0();
        }
        changePos2() {
            let e = this.single.transform.position.clone(),
                t = new Laya.Vector4(0, 0, 0, 0);
            v.gameMgr.camera.viewport.project(e, v.gameMgr.camera.projectionViewMatrix, t);
            let a = new Laya.Vector2(t.x / Laya.stage.clientScaleX, t.y / Laya.stage.clientScaleY - Laya.stage.height / 2);
            v.commonData.GGame.setHpValueUi(this.index + 1, a, this.hpValue / 400);
        }
        setCarAngle() {
            this.limitAngle();
        }
        setUpTheta(e) {
            this.isSetUpTheta = e;
        }
        setCarTheta() {
            let e = Laya.timer.delta;
            this.thetaTime += e, this.thetaTime > this.lastCarTime + 500 && (this.lastCarTime = this.thetaTime + 1e3 * Math.random(), this.isSetUpTheta = !1, Math.random() < .5 ? this.setWheel(Math.random() * Math.PI / 4 - Math.PI / 8) : this.isSetUpTheta = !0);
        }
        setWheel(e) {
            this.isStateEnd1 || (this.theta = 180 * e / Math.PI, this.isRight ? (this.leftWheel.transform.localRotationEulerY = 2 * this.theta / 4, this.rightWheel.transform.localRotationEulerY = this.theta) : (this.leftWheel.transform.localRotationEulerY = this.theta, this.rightWheel.transform.localRotationEulerY = 2 * this.theta / 4), this.limitAngle());
        }
        limitAngle() {
            let e = new Laya.Vector3(0, 0, 0),
                t = new Laya.Vector3(0, 0, 0);
            (e = this.rightWheel.transform.rotationEuler.clone()).y > 30 ? this.rightWheel.transform.rotationEuler = new Laya.Vector3(e.x, 30, e.z) : e.y < -30 && (this.rightWheel.transform.rotationEuler = new Laya.Vector3(e.x, -30, e.z)), (t = this.leftWheel.transform.rotationEuler.clone()).y > 30 ? this.leftWheel.transform.rotationEuler = new Laya.Vector3(t.x, 30, t.z) : t.y < -30 && (this.leftWheel.transform.rotationEuler = new Laya.Vector3(t.x, -30, t.z)), (this.isSetUpTheta || this.isStateEnd1) && (e.y *= .9, t.y *= .9, this.rightWheel.transform.rotationEuler = e.clone(), this.leftWheel.transform.rotationEuler = t.clone());
        }
        checkGunState() {
            if (this.checkGun());
            else {
                let e = 6 + Math.floor(3 * Math.random()),
                    t = Laya.Pool.getItem("prop_0" + e);
                t || (t = v.gameMgr.obstacleLg.addDaoju(e)), t.active = !0, t.getChildByName("pcdld_09").active = !1, this.single.addChild(t), t.transform.localPosition = new Laya.Vector3(0, 0, 0), t.transform.localRotationEuler = new Laya.Vector3(0, 0, 0), this.gun = t, this.gunType = e, this.propArr.push(e), this.propItemArr.push(t);
            }
        }
        playMove0() {
            this.direction = new Laya.Vector3(0, 0, 1);
            let e = Laya.timer.delta / 1e3,
                t = this.single.transform.position.clone(),
                a = new Laya.Vector3(0, 0, 0);
            Laya.Vector3.scale(this.direction, this.speed * e * this.mulSpeed, a), Laya.Vector3.add(t, a, a), this.single.transform.position = a.clone();
        }
        playMove1() {
            this.leftWheel.transform.getForward(this.direction), this.isRight && this.rightWheel.transform.getForward(this.direction), Laya.Vector3.normalize(this.direction.clone(), this.direction), this.direction.z *= -1, this.direction.x *= -1, this.direction.y *= -1;
            let e = Laya.timer.delta / 1e3,
                t = this.single.transform.position.clone(),
                a = this.direction.clone();
            Laya.Vector3.scale(this.direction, this.speed * e * this.mulSpeed, a), Laya.Vector3.add(t, a, a), a.x > 4.8 && (a.x = 4.8), a.x < -4.8 && (a.x = -4.8), this.single.transform.position = a.clone();
        }
        playMove2() {
            let e = this.single.transform.position.clone(),
                t = v.gameData.pointArr,
                a = t[0].transform.position;
            if (e.z > a.z)
                if (this.isStateEnd1 = !0, e.z > v.gameData.gameStartPos + 110 && (this.oriPos = e, this.gameState = 2, this.mulSpeed = 1, this.checkGunState()), e.z < t[t.length - 1].transform.position.z) {
                    for (let a = 1; a < t.length; ++a)
                        if (e.z < t[a].transform.position.z) {
                            if (this.mulSpeed = 2, a > 1) {
                                let i = t[a - 1].transform.position.clone(),
                                    s = t[a].transform.position.clone(),
                                    o = (e.z - i.z) / (s.z - i.z),
                                    r = t[a - 1].transform.localRotationEulerX * (1 - o) + t[a].transform.localRotationEulerX * o;
                                this.single.transform.localRotationEulerX = r;
                            }
                            break;
                        }
                } else {
                    let e = this.single.transform.localRotationEulerX;
                    (e *= .98) > -45 && (e = -45), this.single.transform.localRotationEulerX = e;
                }
        }
        playMove3() {
            let e = Laya.timer.delta / 1e3;
            this.dropTime += e;
            let t = this.oriPos.y - 5 * this.dropTime * this.dropTime,
                a = this.oriPos.z + this.dropTime * this.speed;
            t < -13.8 && (t = -13.8, this.moveBackAction()), this.single.transform.position = new Laya.Vector3(this.oriPos.x, t, a);
            let i = this.single.transform.localRotationEulerX;
            (i *= .98) > -25 && (i = -25), this.single.transform.localRotationEulerX = i;
        }
        playMove4() {
            this.leftWheel.transform.getForward(this.direction), this.isRight && this.rightWheel.transform.getForward(this.direction), Laya.Vector3.normalize(this.direction.clone(), this.direction), this.direction.z *= -1, this.direction.x *= -1, this.direction.y *= -1;
            let e = Laya.timer.delta / 1e3,
                t = this.single.transform.position.clone(),
                a = this.direction.clone();
            Laya.Vector3.scale(this.direction, this.speed * e * this.mulSpeed, a), Laya.Vector3.add(t, a, a);
            let i = a.clone();
            Laya.Vector3.subtract(a, this.centerPos, i);
            let s = Laya.Vector3.scalarLength(i);
            s > this.radius && (Laya.Vector3.scale(i.clone(), this.radius / s, i), Laya.Vector3.add(i, this.centerPos, a)), (a = this.limitPos(a.clone(), t.clone())).y = -13.8, this.single.transform.position = a.clone();
        }
        limitPos(e, t) {
            let a = new Laya.Vector3(0, 0, 0),
                i = v.gameData.rockEndArr;
            for (let s = 0; s < i.length; ++s)
                if (3 == i[s].type) {
                    let o = i[s].pos;
                    Laya.Vector3.subtract(e, o, a);
                    let r = Laya.Vector3.scalarLength(a);
                    if (r < 4.5) return r < .01 && (Laya.Vector3.subtract(t, o, a), r = Laya.Vector3.scalarLength(a)), Laya.Vector3.scale(a.clone(), 4.5 / r, a), Laya.Vector3.add(a, o, e), e;
                } else if (6 == i[s].type) {
                let o = i[s].pos;
                Laya.Vector3.subtract(e, o, a);
                let r = Laya.Vector3.scalarLength(a);
                if (r < 3) return r < .01 && (Laya.Vector3.subtract(t, o, a), r = Laya.Vector3.scalarLength(a)), Laya.Vector3.scale(a.clone(), 3 / r, a), Laya.Vector3.add(a, o, e), e;
            } else if (7 == i[s].type) {
                let o = i[s].pos;
                Laya.Vector3.subtract(e, o, a);
                let r = Laya.Vector3.scalarLength(a);
                if (r < 2) return r < .01 && (Laya.Vector3.subtract(t, o, a), r = Laya.Vector3.scalarLength(a)), Laya.Vector3.scale(a.clone(), 2 / r, a), Laya.Vector3.add(a, o, e), e;
            }
            return e;
        }
        setCarLocalAngleLoop() {
            let e = Laya.timer.delta;
            if (this.thetaTime += e, this.thetaTime > this.lastCarTime + 500) {
                this.lastCarTime = this.thetaTime + 1e3 * Math.random(), this.isSetUpTheta = !1;
                let e = Math.random() - .5,
                    t = Math.random() - .5;
                e * e + t * t > .02 && this.setCarLocalAngle(e, t);
            }
        }
        setCarLocalAngle(e, t) {
            if (3 != this.gameState) return;
            let a = this.single.transform.position.clone(),
                i = new Laya.Vector3(a.x + e, a.y, a.z + t);
            this.single.transform.lookAt(i, new Laya.Vector3(0, 1, 0), !1);
        }
        gunAngleSet() {
            let e = new Laya.Vector3(0, 0, 0);
            this.gun.transform.getForward(e);
            let t = Math.acos(Laya.Vector3.dot(e, this.fireDirection));
            if (t < .001) return;
            let a = this.fireDirection.x * e.z - e.x * this.fireDirection.z;
            this.gunAngle = a >= 0 ? -t : t, this.rotateAngle = 0, this.isGunRotate = !0;
        }
        gunRotateLoop() {
            if (this.gunAngle >= 0) {
                let e = 1.5 * Math.PI * Laya.timer.delta * .001;
                this.rotateAngle += e, this.rotateAngle > this.gunAngle && (e = this.gunAngle - this.rotateAngle + e, this.isGunRotate = !1), this.gun.transform.rotate(new Laya.Vector3(0, e, 0), !0, !0);
            } else {
                let e = -1.5 * Math.PI * Laya.timer.delta * .001;
                this.rotateAngle += e, this.rotateAngle < this.gunAngle && (e = this.gunAngle - this.rotateAngle + e, this.isGunRotate = !1), this.gun.transform.rotate(new Laya.Vector3(0, e, 0), !0, !0);
            }
        }
    }
    class y extends Laya.Script {
        constructor() {
            super(...arguments), this.radius = 52.8;
        }
        init(e) {
            this.oriRoot = e, this.player = v.gameMgr.player.getChildAt(0).getChildAt(0), this.initAi();
        }
        initAi() {
            for (let e = 0; e < 4; ++e) {
                let t = Laya.Sprite3D.instantiate(this.player, this.oriRoot);
                t.active = !0;
                let a = t.addComponent(u);
                a.init(t, e);
                let i = {
                    item: t,
                    lg: a,
                    index: e,
                    isActive: !0
                };
                v.gameData.aiArr.push(i);
            }
        }
        reset() {
            for (let e = 0; e < 4; ++e) v.gameData.aiArr[e].item.active = !0, v.gameData.aiArr[e].isActive = !0, v.gameData.aiArr[e].lg.reset();
        }
        setCheke(e, t) {
            if (e.cheke) {
                let t = e.cheke;
                t.active = !1, t.transform.localPosition = new Laya.Vector3(0, 0, 0), t.transform.localRotationEuler = new Laya.Vector3(0, 0, 0), t.removeSelf(), Laya.Pool.recover(t.name, t);
            }
            let a = Math.floor(9 * Math.random()),
                i = v.gameMgr.playerLg.getCheke(a);
            e.cheke = i, i.active = !1, t.addChild(i), i.transform.localPosition = new Laya.Vector3(0, 0, 0), i.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
        }
        aiMoveStart() {
            for (let e = 0; e < 4; ++e) v.gameData.aiArr[e].lg.setMove(!0), this.setCheke(v.gameData.aiArr[e].lg, v.gameData.aiArr[e].item);
        }
    }
    class f extends Laya.Script {
        constructor() {
            super(...arguments), this.bulletArr = [];
        }
        init(e) {
            this.root = e;
            for (let e = 0; e < this.root.numChildren; ++e) {
                let t = this.root.getChildAt(e);
                t.active = !1, t.addComponent(h), this.bulletArr.push(t);
            }
            this.initBullet();
        }
        initBullet() {
            for (let e = 0; e < this.bulletArr.length; ++e)
                for (let t = 0; t < 6; ++t) {
                    let t = Laya.Sprite3D.instantiate(this.bulletArr[e], this.root);
                    t.getComponent(h).init(t, e), Laya.Pool.recover(this.bulletArr[e].name, t);
                }
        }
        addBullet(e) {
            let t = Laya.Sprite3D.instantiate(this.bulletArr[e], this.root);
            return t.getComponent(h).init(t, e), t;
        }
        fireBullet(e, t, a, i, s = null) {
            if (1 == t || 2 == t) {
                let t = Laya.Pool.getItem(this.bulletArr[0].name);
                t || (t = this.addBullet(0)), t.transform.position = e;
                let i = new Laya.Vector3(0, 0, 0);
                Laya.Vector3.lerp(a, e, 2, i), t.active = !1, t.active = !0, t.getComponent(h).setRecover(1e3), t.transform.lookAt(i, new Laya.Vector3(0, 1, 0), !1);
            }
            let o = Laya.Pool.getItem(this.bulletArr[t].name);
            o || (o = this.addBullet(t)), o.transform.position = e, o.active = !1, o.active = !0, o.getComponent(h).setMove(!0, i, s), o.transform.lookAt(a, new Laya.Vector3(0, 1, 0), !1);
        }
    }
    class L {
        init() {
            if (Laya.Browser.onWeiXin) {
                let e = window.wx;
                this.sysInfo = e.getSystemInfoSync(), this.launchOptions = e.getLaunchOptionsSync(), this.openDataContext = e.getOpenDataContext();
            }
        }
        resetSize(e, t) {
            window.sharedCanvas && (window.sharedCanvas.width = e, window.sharedCanvas.height = t);
        }
        postMessage(e) {
            null != e && null != this.openDataContext && this.openDataContext.postMessage(e);
        }
        uploadScroe(e) {
            this.postMessage({
                cmd: "submit_scroe",
                score: e
            });
        }
        showFriendRank(e) {
            this.postMessage({
                cmd: e ? "open_friend_rank" : "close_friend_rank"
            });
        }
        destroyFriendRank() {
            this.postMessage({
                cmd: "destroy_friend_rank"
            });
        }
        showLiteRank(e) {
            this.postMessage({
                cmd: e ? "open_lite_rank" : "close_lite_rank"
            });
        }
        showOverFriendTips(e, t) {
            this.postMessage({
                cmd: e ? "open_over_friend" : "close_over_friend",
                score: t
            });
        }
        showLoopFriendTips(e, t) {
            this.postMessage({
                cmd: e ? "open_loop_friend" : "close_loop_friend",
                score: t
            });
        }
        restartGame() {
            this.postMessage({
                cmd: "restart_game"
            });
        }
        showFirstFriendTips(e) {
            this.postMessage({
                cmd: e ? "open_first_friend" : "close_first_friend",
                score: 0
            });
        }
        onFrientMouseEvent(e) {
            this.postMessage(e);
        }
    }
    class v {
        static get glEvent() {
            return this._eventListener;
        }
        static get soundMgr() {
            return void 0 === this._soundMgr && (this._soundMgr = new a()), this._soundMgr;
        }
        static get storageMgr() {
            return void 0 === this._storageMge && (this._storageMge = new e()), this._storageMge;
        }
        static get commonData() {
            return this._commonData;
        }
        static get gameData() {
            return this._gameData;
        }
        static get utils() {
            return this._utils;
        }
        static get gameMgr() {
            return this._gameMgr;
        }
        static get configMgr() {
            return void 0 === this._configMgr && (this._configMgr = new t()), this._configMgr;
        }
        static get rankMgr() {
            return void 0 === this._rankMgr && (this._rankMgr = new L()), this._rankMgr;
        }
        static get wxMgr() {
            return void 0 === this._wxMgr && (this._wxMgr = new i()), this._wxMgr;
        }
        static get resourceMgr() {
            return void 0 === this._resourceMgr && (this._resourceMgr = new s()), this._resourceMgr;
        }
    }
    v._eventListener = new Laya.EventDispatcher(), v._utils = new class {
        constructor() {}
        addClickEvent(e, t, a, i) {
            if (e.offAllCaller(t), e instanceof Laya.Button) {
                let i = function(e) {
                    e.stopPropagation(), a && (v.soundMgr.play("button"), v.gameMgr.playVibrate(!0), a.call(t, e));
                };
                e.on(Laya.Event.CLICK, t, i);
            } else {
                let s = 60,
                    o = 1,
                    r = (e.anchorX, e.anchorY, e.x, e.y, e.scaleX * o),
                    n = e.scaleX * o,
                    l = .9 * o,
                    h = function(t) {
                        t.stopPropagation(), Laya.Tween.to(e, {
                            scaleX: l,
                            scaleY: l
                        }, s);
                    };
                e.on(Laya.Event.MOUSE_DOWN, t, h);
                let c = function(o) {
                    o.stopPropagation(), Laya.Tween.to(e, {
                        scaleX: r,
                        scaleY: n
                    }, s), a && a.call(t, o), (0 === i || i) && v.soundMgr.play(i);
                };
                e.on(Laya.Event.MOUSE_UP, t, c);
                let g = function(t) {
                    t.stopPropagation(), Laya.Tween.to(e, {
                        scaleX: r,
                        scaleY: n
                    }, s);
                };
                e.on(Laya.Event.MOUSE_OUT, t, g);
            }
        }
        tweenShake(e, t) {
            let a = new Laya.TimeLine(),
                i = e.pivotX;
            e.pivotX = e.width / 2, a.addLabel("shake1", 0).to(e, {
                rotation: e.rotation + 5
            }, 50, null, 0).addLabel("shake2", 0).to(e, {
                rotation: e.rotation - 6
            }, 50, null, 0).addLabel("shake3", 0).to(e, {
                rotation: e.rotation - 13
            }, 50, null, 0).addLabel("shake4", 0).to(e, {
                rotation: e.rotation + 3
            }, 50, null, 0).addLabel("shake5", 0).to(e, {
                rotation: e.rotation - 5
            }, 50, null, 0).addLabel("shake6", 0).to(e, {
                rotation: e.rotation + 2
            }, 50, null, 0).addLabel("shake7", 0).to(e, {
                rotation: e.rotation - 8
            }, 50, null, 0).addLabel("shake8", 0).to(e, {
                rotation: e.rotation + 3
            }, 50, null, 0).addLabel("shake9", 0).to(e, {
                rotation: 0
            }, 50, null, 0), t ? Laya.timer.once(500, this, function() {
                a.destroy(), e.rotation = 0, e.pivotX = i;
            }) : a.on(Laya.Event.COMPLETE, this, function() {
                a.destroy(), e.rotation = 0, e.pivotX = i;
            }), a.play(0, !0);
        }
    }(), v._commonData = new class {
        constructor() {
            this.useTime = 1e3, this.levelIndex = 0, this.newLevel = 1, this.maxScore = 0, this.userCoin = 0, this.skinValueArr = [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000], this.unlockCount = 0, this.skinId = 0, this.freeSkinId = 0, this.useSkinId = 0, this.firstMusic = !1, this.userInfo = {}, this.showScene = null, this.userId = "", this.playerNameStr1 = "Morton,Seth,Percy,Jed,Emmett,Jeremy,Edward,Kyle,Lionel,Thomas,Erik,Blind,Darell,Ernest,Hal,Irving,Joshua,Stream,Respected,Peaceful,Vania,Industrious,Faith,Hilda,Tatum,Virtuous,Sirena,Jessica,Megan,Bound,Veleda,Kathy,Sandra,Geraldine,Larissa,Marian,Melinda,Gaye,Vera,Faith,Free,Nerita,Gardener,Attendant,Gwendolyn,Rita,Odette,Orlena,Myrtle,Shining", this.playerNameStr2 = "Edgar,Cunning,Kurt,Zachariah,Mariner,Egan,Archer,Dale,Owner,Dermot,Neal,Beneficient,Kenway,Joseph,Harrison,Darian,Monroe,Melvin,Sidney,Garrick,Elsie,Nicolette,Penelope,Thalia,Samantha,Nerita,Lacey,Bridget,Wolf,Maxine,Drucilla,Vandal,Lively,Harley,Virginia,Willow,Philippa,Ernestine,Erika,Phoebe,Drucilla,Vandal,Lively,Harley,Virginia,Willow,Philippa,Ernestine,Erika,Phoebe", this.playerNameStrArr = [];
        }
    }(), v._gameData = new class {
        constructor() {
            this.isStart = !1, this.gameLevel = 1, this.gameCoin = 0, this.gameMgr = null, this.isOn_home = !1, this.gameState = 1, this.is_new = !1, this.singlePlayerArr = [], this.addCount = 0, this.moveDis = 0, this.playerMove = null, this.playerDir = null, this.gameStartPos = 0, this.attackValue = 1, this.isVictory = !1, this.isHitWeapon = !1, this.killCount = 0, this.moveAllDistance = 0, this.pointArr = [], this.aiArr = [], this.aiDieCount = 0, this.daojuArr = [], this.rockEndArr = [], this.gameSpeed = 10, this.mulSpeed = 1, this.isFly = !1, this.aiPosArr = [3, -6, -2, -3, 3, 1, -1, 5], this.tipMoveArr = [0, 74, 19, 19, 85, 0, 138, 11, 179, 78, 215, 131, 280, 157, 335, 132, 361, 78, 337, 20, 282, 0, 221, 11, 179, 78, 145, 124, 84, 147, 19, 128];
        }
    }(), v._gameMgr = new class {
        constructor() {
            this.touchMove = new Laya.Vector2(0, 0), this.isOver = !0, this.isPlay = !0, this.isTouchDown = !1, this.oripos = new Laya.Vector2(0, 0), this.count = 0, this._fieldOfView = null, this._viewportRatio = null, this.initCamera = !1, this.playerEnd = null, this.currentColor = 0, this.first = !0, this.bSetSpeed = !0, this.bSetCamera = !0, this.ballonShowCount = 0, this.lastTime = 0, this.movex = 0, this.movey = 0, this.targetNum = 0, this.targetNum2 = 0;
        }
        init() {
            v.gameData.gameMgr = this, this.addEvent(), this.initScene(), this.ballonShowCount = 0, Laya.stage.on("DEVICE_ON_HIDE", this, this.onHide), Laya.stage.on("DEVICE_ON_SHOW", this, this.onShow);
        }
        initScene() {
            if (this.scene = v.resourceMgr.mainScene, this.camera = this.scene.getChildByName("Main Camera"), Laya.Browser.onIOS && !this.initCamera) {
                this.initCamera = !0;
                let e = this.camera;
                this._fieldOfView && this._viewportRatio || (this._fieldOfView = e.fieldOfView, this._viewportRatio = e.viewport.height / (1334 * Laya.RenderState2D.width / 750), e.fieldOfView = this._fieldOfView * this._viewportRatio);
            }
            let e = this.scene.getChildByName("Directional Light");
            this.light = e, this.groundScene = this.scene.getChildByName("scene"), this.groundMgr = this.groundScene.addComponent(p), this.groundMgr.init(this.groundScene), this.player = this.scene.getChildByName("player"), this.effectRoot = this.scene.getChildByName("effect"), this.effectMgr = this.effectRoot.addComponent(m), this.effectMgr.init(this.effectRoot), this.aiRoot = this.scene.getChildByName("aiRoot"), this.aiMgr = this.aiRoot.addComponent(y), this.aiMgr.init(this.aiRoot), this.bulletRoot = this.scene.getChildByName("bullet"), this.bulletMgr = this.bulletRoot.addComponent(f), this.bulletMgr.init(this.bulletRoot), this.cameraLg = this.camera.addComponent(l), this.cameraLg.init(this.camera), this.playerLg = this.player.addComponent(n), this.playerLg.init(this.player.getChildAt(0)), this.obstacle = this.scene.getChildByName("obstacle"), this.obstacleLg = this.obstacle.addComponent(g), this.endEffect = this.scene.getChildByName("endEffect").getChildAt(0), this.endEffect.active = !1, this.obstacleLg.init(this.obstacle), this.initEffectScene();
        }
        initEffectScene() {
            let e, t = (e = Laya.stage.addChild(new Laya.Scene3D())).addChild(new Laya.DirectionLight());
            t.color = new Laya.Vector3(1, .956, .839), e.ambientSphericalHarmonicsIntensity = 1, e.ambientColor = new Laya.Vector3(.8313726, .8313726, .8313726), t.intensity = .6, t.transform.rotate(new Laya.Vector3(10, -17, 0), !0, !1);
            var a = e.addChild(new Laya.Camera(0, .1, 100));
            a.name = "mainCamera", a.transform.translate(new Laya.Vector3(0, 4, -5.8)), a.transform.rotate(new Laya.Vector3(-30, 180, 0), !0, !1), a.clearFlag = 2, v.commonData.showScene = e, e.active = !1, e.addChild(this.endEffect), this.endEffect.transform.position = new Laya.Vector3(0, 0, 0);
        }
        showEndScene(e) {
            if (e) {
                Laya.stage.addChild(v.commonData.showScene), this.playerLg.showPlayerLg.isMove = !1, this.playerLg.showPlayerLg.hideRedLine(), this.playerLg.showPlayerLg.resetParticle(), this.playerEnd = Laya.Sprite3D.instantiate(this.playerLg.showPlayer, v.commonData.showScene), v.commonData.showScene.active = !0, this.playerEnd.active = !0, this.playerEnd.transform.position = new Laya.Vector3(0, .6, 0), this.playerEnd.transform.localRotationEuler = new Laya.Vector3(0, -150, 0), this.playerEnd.transform.localScale = new Laya.Vector3(.8, .8, .8), this.playerEnd.getChildByName("pcdld_06").active = !1;
                let e = this.playerEnd.getChildByName("houlun_01"),
                    t = e.getChildByName("houlun_L"),
                    a = e.getChildByName("houlun_R"),
                    i = e.getChildByName("houlun_L2"),
                    s = e.getChildByName("houlun_R2");
                t.getChildAt(0).active = !1, a.getChildAt(0).active = !1, i.getChildAt(0).active = !1, s.getChildAt(0).active = !1, v.commonData.showScene.addChild(this.endEffect), this.endEffect.transform.position = new Laya.Vector3(0, 0, 0), this.endEffect.active = !1, this.endEffect.active = !0;
            } else v.commonData.showScene.active = !1, this.playerEnd.active = !1, this.playerEnd.removeSelf(), this.playerEnd.destroy();
        }
        gameReset() {
            this.isVictory = !1, v.gameData.moveAllDistance = 0, v.commonData.freeSkinId = -1, v.gameData.aiDieCount = 0, v.gameData.isHitWeapon = !1, v.gameData.gameStartPos = 0, v.gameData.attackValue = 1, v.gameData.gameCoin = 0, v.gameData.killCount = 0, this.playerLg.reSetPlayer(), this.cameraLg.reSet(), this.obstacleLg.obstacleReset(), this.aiMgr.reset(), this.groundMgr.reset(), this.playerLg.changeSkin(), this.isOver = !0, v.gameData.isStart = !1;
        }
        setSky() {}
        onHide() {
            Laya.timer.scale = 0;
        }
        onShow() {
            Laya.timer.scale = 1;
        }
        setGameOver() {
            v.gameData.isStart = !1, this.cameraLg.setCameraData(!1), this.obstacleLg.setMoveData(!1);
        }
        gameReviel() {
            v.gameData.isStart = !0;
        }
        gameStart() {
            this.isOver = !1, v.gameData.isStart = !0, this.groundMgr.setGameStart(), this.cameraLg.setCameraMove();
        }
        gameStart2() {
            this.playerLg.gameStart(!0), this.cameraLg.setCameraData(!0), this.aiMgr.aiMoveStart(), this.groundMgr.isMove = !0;
        }
        setFog(e) {}
        addEvent() {
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown), Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp), Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove), Laya.stage.on(zs.laya.platform.PlatformMgr.GAME_RESET_START, this, this.onContinueGame), Laya.timer.frameLoop(1, this, this.onUpdate);
        }
        onContinueGame() {
            Laya.Scene.open("views/home.scene", !1, Laya.Handler.create(this, e => {}));
        }
        onUpdate() {}
        onMouseDown(e) {
            for (let e = 0; e < Laya.Scene.unDestroyedScenes.length; e++) {
                let t = Laya.Scene.unDestroyedScenes[e].url;
                if (t = t.substring(t.lastIndexOf("/") + 1, t.lastIndexOf(".")), 1 == Laya.Scene.unDestroyedScenes[e].activeInHierarchy) {
                    if ("KnockEggNew" == t) return;
                    if ("ggame" == t && 1 == Laya.Scene.unDestroyedScenes[e].getChildByName("middleUI").getChildByName("rewardPanel").visible) return;
                }
            }
            this.isTouchDown = !0, v.commonData.GGame && v.commonData.GGame.setTouchUi(!0, e.stageX, e.stageY), this.oripos = new Laya.Vector2(e.stageX, e.stageY), v.gameMgr.playerLg.setPlayerUpMove(!1);
        }
        onMouseUp() {
            this.count = 0, this.isTouchDown = !1, v.commonData.GGame && v.commonData.GGame.setTouchUi(!1, 0, 0), v.gameMgr.playerLg.setPlayerUpMove(!0);
        }
        onMouseMove(e) {
            if (v.gameData.isStart && this.count > 0) {
                let t = e.stageX - this.oripos.x,
                    a = e.stageY - this.oripos.y;
                this.playerLg.setPlayerMove(t, a);
            }
            this.count++;
        }
        setDirection() {}
        playVibrate(e) {
            v.storageMgr.isPlayVibrate() && (e ? zs.laya.sdk.DeviceService.VibrateShort() : zs.laya.sdk.DeviceService.VibrateLong());
        }
        destoryAll() {}
        initGame(e) {}
        finishTarget() {}
        over() {}
        gameOver() {
            if (this.isOver) return void console.log("is game over.");
            this.isOver = !0;
            let e = "views/fail.scene";
            this.isVictory ? (v.gameData.gameCoin = 100 * v.gameData.killCount, e = "views/success.scene", this.showResult(e)) : this.showResult(e);
        }
        showResult(e) {
            v.glEvent.event("over_game_event", {
                isVictory: this.isVictory
            });
        }
    }(), v.isBringBackToLifed = !1, v.screen = {
        realPxRatio: 0,
        offsetTop: 0,
        allScreen: !1
    };
    class w extends Laya.Script {
        constructor() {
            super();
        }
        onEnable() {
            if (this.light = this.owner.getChildByName("light"), this.hot = this.owner.getChildByName("hot"), this.parent = this.owner.parent, !parent) return;
            if (this.light.width = 237 * this.parent.width / 204, this.light.height = 320 / 237 * this.light.width, Laya.timer.loop(2e3, this, this.checkFlash), this.hot.visible = !1, this.hideHot) return;
            this.hot.width = 91 * this.parent.width / 204, this.hot.height = 42 / 91 * this.hot.width, this.hot.pos(this.parent.width - this.hot.width / 2 * 1.2, this.hot.height / 2 * 1.2);
            let e = Math.random() < .3333 || this.isSingle;
            this.hot.visible = e, this.tweenHot();
        }
        checkFlash() {
            let e = Math.random() < .3333 || this.isSingle;
            this.light.pos(.2 * -this.parent.width, .2 * -this.parent.height), e && Laya.Tween.to(this.light, {
                x: this.parent.width / 2,
                y: this.parent.height / 2
            }, 300, Laya.Ease.quadInOut, Laya.Handler.create(this, function() {
                Laya.Tween.to(this.light, {
                    x: 1.2 * this.parent.width,
                    y: 1.2 * this.parent.height
                }, 300, Laya.Ease.quadIn);
            }));
        }
        onDisable() {
            Laya.timer.clear(this, this.checkFlash), Laya.Tween.clearAll(this);
        }
        tweenHot() {
            this.hot.scale(1, 1), Laya.Tween.to(this.hot, {
                scaleX: 1.2,
                scaleY: 1.2
            }, 300, null, Laya.Handler.create(this, function() {
                Laya.Tween.to(this.hot, {
                    scaleX: 1,
                    scaleY: 1
                }, 300, null, Laya.Handler.create(this, this.tweenHot));
            }));
        }
    }
    class C {
        constructor() {
            this.jsonData = null;
        }
        init() {
            Laya.loader.load("jsonConfig/nickname.json", Laya.Handler.create(this, function(e) {
                this.jsonData = [];
                for (let t = 0; t < e.length; t++) this.jsonData.push(new S(e[t]));
            }));
        }
        get randowData() {
            if (!this.jsonData) return;
            let e = Math.floor(Math.random() * this.jsonData.length);
            return this.jsonData[e];
        }
    }
    C.Instance = new C();
    class S {
        constructor(e) {
            this.avatar = e.avatar, this.nickname = e.nickname;
        }
    }
    class k extends zs.laya.base.ZhiSeView {
        constructor() {
            super();
        }
        onAwake() {
            super.onAwake();
        }
        onStart() {
            super.onStart(), this.owner.visible = !1;
            let e = this;
            zs.laya.sdk.ZSReportSdk.loadAd(function(t) {
                var a = t.promotion;
                a = a.filter(function(e) {
                    return Laya.Browser.onAndroid || "wx48820730357d81a6" != e.appid && "wxc136d75bfc63107c" != e.appid;
                }), e.adData = a[Math.floor(Math.random() * a.length)], e.initUI();
            });
        }
        initUI() {
            this.owner.visible = !0;
            let e = C.Instance.randowData;
            this.lab_name.text = e.nickname, this.lab_invite.text = "", this.lab_appName.text = this.adData.app_title, this.img_avater.skin = e.avatar, this.img_icon.skin = this.adData.app_icon, this.btn_suc.on(Laya.Event.CLICK, this, this.onSucClick), this.btn_fail.on(Laya.Event.CLICK, this, this.closeView);
        }
        onSucClick() {
            this.owner.close(), zs.laya.sdk.ZSReportSdk.navigate2Mini(this.adData, v.commonData.userId, function() {
                Laya.stage.event("APP_JUMP_SUCCESS");
            }, function() {
                Laya.stage.event("APP_JUMP_CANCEL");
            }, function() {});
        }
        closeView() {
            this.owner.close();
        }
    }
    class A extends zs.laya.base.ZhiSeView {
        constructor() {
            super(), this.listScr = null;
        }
        onAwake() {
            super.onAwake(), this.adList.dataSource = [];
            let e = [];
            for (let t = 0; t < 4; t++) {
                let t = {
                    avater_1: {
                        skin: C.Instance.randowData.avatar
                    },
                    avater_2: {
                        skin: C.Instance.randowData.avatar
                    },
                    avater_3: {
                        skin: C.Instance.randowData.avatar
                    }
                };
                e.push(t);
            }
            this.adList.dataSource = e, this.btn_close.on(Laya.Event.CLICK, this, this.closeView);
        }
        onStart() {
            this.listScr = this.adList.addComponent(zs.laya.platform.AdList), this.listScr.requestAdData("promotion", !1, 0, null, 4), Laya.timer.loop(3e3, this, this.loopChange);
        }
        loopChange() {
            this.listScr.requestAdData("promotion", !1, 0, null, 4);
        }
        onDisable() {
            super.onDisable(), this.btn_close.on(Laya.Event.CLICK, this, this.closeView);
        }
        closeView() {
            this.owner.close();
        }
    }
    class V extends Laya.Script {
        constructor() {
            super(), this.adType = "promotion", this.iconScriptArr = [], this.adData = null, this.maxLength = 6, this.posX = 0, this.posY = 0, this.knockIndex = 0;
        }
        onAwake() {
            super.onAwake(), this.adList = this.owner.getChildByName("adList");
        }
        onEnable() {
            super.onEnable(), zs.laya.platform.ADConfig.zs_jump_switch && zs.laya.platform.ADConfig.isPublicVersion() ? (this.initEvent(), this.initData(), this.initUI()) : this.owner.destroy();
        }
        onDisable() {
            super.onDisable();
        }
        onClose() {
            this.owner.destroy();
        }
        initUI() {
            this.adList.selectEnable = !0, this.aniHammer = this.owner.getChildByName("aniHammer"), this.aniBroken = this.owner.getChildByName("aniBroken"), this.aniHammer.on(Laya.Event.COMPLETE, this, this.onHammerComplete), this.aniHammer.on(Laya.Event.LABEL, this, this.onHammerKnock), this.aniBroken.on(Laya.Event.COMPLETE, this, this.onBrokenComplete), this.startKnock();
        }
        updateItem() {
            var e = [];
            this.adData.sort(() => Math.random() > .5 ? 1 : -1);
            for (let t = 0; t < this.maxLength; t++) e.push(this.adData[t]);
            this.adList.array = e;
        }
        initData() {
            zs.laya.sdk.ZSReportSdk.loadAd(e => {
                this.adData = e[this.adType.toString()], this.updateItem();
            });
        }
        initEvent() {
            this.adList.renderHandler = Laya.Handler.create(this, this.onItemRender, null, !1), this.adList.mouseHandler = Laya.Handler.create(this, this.onMouseAd, null, !1);
        }
        onHammerComplete() {
            this.aniHammer.visible = !1;
        }
        onHammerKnock(e) {
            this.aniBroken.visible = !0, this.aniBroken.pos(this.posX, this.posY), this.aniBroken.play(null, !1);
        }
        onBrokenComplete() {
            this.aniBroken.visible = !1;
            var e = this.adList.getCell(this.knockIndex);
            this.playScaleEff(e);
        }
        playScaleEff(e) {
            Laya.Tween.to(e, {
                scaleX: 0,
                scaleY: 0
            }, 500, Laya.Ease.bounceIn, Laya.Handler.create(this, () => {
                this.refreshSingleItem(this.knockIndex), Laya.Tween.to(e, {
                    scaleX: 1,
                    scaleY: 1
                }, 500, Laya.Ease.bounceIn, Laya.Handler.create(this, () => {
                    e.mouseEnabled = !0;
                }));
            }));
        }
        refreshItemByDate(e, t) {
            var a = e.getChildByName("icon"),
                i = e.getChildByName("name");
            a.loadImage(t.app_icon), i.text = t.app_title;
        }
        onItemRender(e, t) {
            var a = this.adList.array[t];
            this.refreshItemByDate(e, a);
        }
        refreshSingleItem(e) {
            var t = this.adData.filter(e => !this.adList.array.some(t => e.app_id === t.app_id)),
                a = t[Math.floor(Math.random() * t.length)];
            this.adList.setItem(e, a);
        }
        onMouseAd(e, t) {
            "click" == e.type && (zs.laya.sdk.ZSReportSdk.navigate2Mini(this.adData[t], v.commonData.userId, () => {
                Laya.stage.event("NAVIGATE_SUCCESS");
            }, () => {
                Laya.stage.event("APP_JUMP_CANCEL");
            }, () => {}), this.refreshSingleItem(t));
        }
        startKnock() {
            Laya.timer.once(1e3, this, this.knockExportIcon, null, !1);
        }
        knockExportIcon() {
            var e = Math.floor(Math.random() * this.adList.array.length);
            this.knockIndex = e;
            var t, a = this.adList.getCell(e);
            this.aniHammer.removeSelf(), a.mouseEnabled = !1, t = Laya.Point.create().setTo(a.width / 2, a.height / 2), t = a.localToGlobal(t);
            var i = this.owner.globalToLocal(t);
            this.posX = i.x, this.posY = i.y, this.aniHammer.pos(i.x + 60, i.y - 30), this.aniHammer.visible = !0, this.owner.addChild(this.aniHammer), this.aniHammer.play(null, !1), Laya.timer.once(5e3, this, this.knockExportIcon, null, !1);
        }
    }
    class M extends zs.laya.base.ZhiSeView {
        constructor() {
            super();
        }
        onAwake() {
            super.onAwake(), this.initData(), this.initDataBase(), this.initUI(), this.initEvent();
        }
        onClosed() {
            Laya.timer.clearAll(this), v.glEvent.offAllCaller(this);
        }
        initData() {}
        initDataBase() {}
        initUI() {}
        initEvent() {}
        getChild(e, t) {
            return t || (t = this), t.getChildByName(e);
        }
    }
    class b extends M {
        onAwake() {
            super.onAwake();
        }
        onOpened() {
            this.isStartTimer = !0;
        }
        initUI() {
            let e = this.getChild("bottomUI", this.owner);
            this.btnSkip = this.getChild("btnSkip", e), this.skinShopBtn = this.getChild("skinBtn", e);
            let t = this.getChild("coin", e);
            this.getChild("value", t).value = v.gameData.gameCoin + "", this.coinValue = this.owner.getChildByName("topUI").getChildByName("coinBg").getChildByName("value"), this.updateScore();
            this.list_showList = this.getChild("middleUI", this.owner).getChildByName("list_showList");
            platform.getInstance().initList(this.list_showList);
        }
        initEvent() {
            v.utils.addClickEvent(this.btnSkip, this, this.onSkipClick), v.utils.addClickEvent(this.skinShopBtn, this, this.onSkinShopClick);
        }
        updateScore() {
            this.coinValue.value = v.commonData.userCoin + "", v.storageMgr.setAwardGold(v.commonData.userCoin);
        }
        onSkinShopClick() {
            Laya.Scene.open("views/skinShop.scene", !1, Laya.Handler.create(this, e => {
                v.gameMgr.gameReset(), this.owner.close();
            }));
        }
        onSkipClick() {
            v.commonData.userCoin += v.gameData.gameCoin;
            v.gameMgr.gameReset(), this.owner.close(), zs.laya.platform.PlatformMgr.onGameOverPopUp(!1);
        }
    }
    class D extends Laya.Script {
        constructor() {
            super();
        }
        onEnable() {
            this.btn = this.owner, this.tweenBig();
        }
        tweenBig() {
            Laya.Tween.to(this.btn, {
                scaleX: .9,
                scaleY: .9
            }, 500, null, Laya.Handler.create(this, () => {
                this.tweenLittle();
            }));
        }
        tweenLittle() {
            Laya.Tween.to(this.btn, {
                scaleX: 1,
                scaleY: 1
            }, 500, null, Laya.Handler.create(this, () => {
                this.tweenBig();
            }));
        }
        onDisable() {
            console.log("ljc", "清除呼吸按钮缓动"), Laya.Tween.clearAll(this);
        }
    }
    class P extends Laya.Script {
        constructor() {
            super(...arguments), this.single = null, this.moveValue = 0, this.count = 0;
        }
        init(e) {
            this.single = e;
        }
        aniSet1() {
            this.scaleAni(1, 1.5, 500, !0);
        }
        scaleAni(e, t, a, i) {
            this.moveValue = e, Laya.Tween.to(this, {
                moveValue: t
            }, a, Laya.Ease.linearIn, new Laya.Handler(this, function() {
                i && this.scaleAni(1.5, 1, 300, !1);
            })).update = new Laya.Handler(this, function() {
                this.single.scale(this.moveValue, this.moveValue);
            });
        }
        aniSet2() {
            this.scaleAni2(1.3, 1.5, 200, !0);
        }
        scaleAni2(e, t, a, i) {
            this.moveValue = e, Laya.Tween.to(this, {
                moveValue: t
            }, a, Laya.Ease.linearIn, new Laya.Handler(this, function() {
                i ? Laya.timer.once(800, this, function() {
                    this.scaleAni(1.5, 0, 200, !1);
                }) : this.single.visible = !1;
            })).update = new Laya.Handler(this, function() {
                this.single.scale(this.moveValue, this.moveValue), i || (this.single.alpha = 1.5 - this.moveValue);
            });
        }
        aniSet3() {
            this.count = 0, Laya.timer.loop(200, this, this.scaleAni3);
        }
        scaleAni3() {
            this.count++, this.single.visible = this.count % 2 == 1, this.count > 4 && (this.single.visible = !0, Laya.timer.clear(this, this.scaleAni3), this.scaleAni(1.5, 0, 500, !1));
        }
        aniSet4() {
            this.scaleAni4(3, 1.5, 200, !0);
        }
        scaleAni4(e, t, a, i) {
            this.moveValue = e, Laya.Tween.to(this, {
                moveValue: t
            }, a, Laya.Ease.linearIn, new Laya.Handler(this, function() {
                i ? Laya.timer.once(2e3, this, function() {
                    this.scaleAni(1.5, 0, 200, !1);
                }) : this.single.visible = !1;
            })).update = new Laya.Handler(this, function() {
                this.single.scale(this.moveValue, this.moveValue), this.single.alpha = i ? 2 / 3 * (3 - this.moveValue) : 1.5 - this.moveValue;
            });
        }
        aniSet5() {
            this.scaleAn5(1, 1.3, 100, !0);
        }
        scaleAn5(e, t, a, i) {
            this.moveValue = e, Laya.Tween.to(this, {
                moveValue: t
            }, a, Laya.Ease.linearIn, new Laya.Handler(this, function() {
                i && this.scaleAn5(1.3, 1, 100, !1);
            })).update = new Laya.Handler(this, function() {
                this.single.scale(this.moveValue, this.moveValue);
            });
        }
    }
    class _ extends M {
        constructor() {
            super(...arguments), this.state = 0, this.isRevival = !1, this.addTipArr = [], this.addTipShow = [], this.killArr = [], this.hpValueArr = [], this.directionArr = [], this.levelTipArr = [], this.fingurex = 0, this.rankArr = [], this.isCanShowBanner = !1, this.progressCur = 0, this.progressMax = 10, this.progressPer = 1, this.isOpenAd = !1, this.skinIndex = 0, this.lastPos = null, this.fingureMoveValue = 0, this.leftNum = 0, this.lastMatch = 0, this.addValue = 0, this.movet = 0;
        }
        initData() {}
        initUI() {
            v.commonData.GGame = this;
            let e = this.getChild("topUI", this.owner),
                t = this.getChild("middleUI", this.owner);
            this.touchUi = this.getChild("touchTip", this.owner), this.coinBg = this.getChild("coinBg", e), this.userCoin = this.getChild("value", this.coinBg), this.userCoin.value = "0", this.coinBg.visible = !1, this.levelTip = this.getChild("levelTip", t);
            for (let e = 1; e < 13; ++e) {
                let t = this.getChild("tipMove" + e, this.levelTip);
                t.visible = !1, this.levelTipArr.push(t);
            }
            this.hpValueBox = this.getChild("hpValueBox", t);
            for (let e = 1; e < 6; ++e) {
                let t = this.getChild("hpvalue" + e, this.hpValueBox);
                t.visible = !1, this.hpValueArr.push(t);
            }
            this.directionBox = this.getChild("directionBox", t);
            for (let e = 1; e < 5; ++e) {
                let t = this.getChild("direction" + e, this.directionBox);
                t.visible = !1, this.directionArr.push(t);
            }
            this.leftAiTip = this.getChild("leftTip", e), this.leftAi = this.getChild("leftAi", this.leftAiTip), this.leftAi.text = "4", this.rewardPanel = this.getChild("rewardPanel", t), this.rewardPanel.visible = !1, this.rewardBtn = this.getChild("rewardBtn", this.rewardPanel);
            v.utils.addClickEvent(this.rewardBtn, this, this.rewardBtnClick), this.rewardIcon = this.getChild("rewardIcon", this.rewardPanel), this.redTip = this.getChild("redTip", this.owner), this.redTip.visible = !1, this.leftUi = this.getChild("leftUi", t), this.leftUi.visible = !1, this.startTip = this.getChild("startTip", t), this.startTip.visible = !1;
            let i = this.getChild("bg2", this.startTip);
            this.fingure = this.getChild("finguer", i), this.fingurex = this.fingure.x, this.killTip = this.getChild("killTip", e);
            for (let e = 0; e < 4; ++e) {
                let t = this.getChild("bg" + (e + 1), this.killTip);
                t.visible = !1, t.addComponent(P).init(t), this.killArr.push(t);
            }
            Laya.timer.loop(100, this, this.updateScore);
        }
        updateScore() {
            this.userCoin.value = v.gameData.gameCoin + "";
        }
        rewardBtnClick() {}
        isShowBanner() {
            let e = zs.laya.platform.ADConfig.isOpenEgg(v.commonData.newLevel, 2);
            return console.warn(e), !!e;
        }
        setLeftAi(e) {
            this.leftAi.text = e + "";
        }
        setRewardPanel() {
            if (1 == v.isBringBackToLifed) {
                this.rewardPanel.visible = !1;
                return void zs.laya.platform.PlatformMgr.onGameWinPopUp({
                    isWin: !0
                });
            }
            v.soundMgr.play("victory"), zs.laya.platform.PlatformMgr.onGameWinPopUp({
                isWin: !0
            }), this.getChild("killCount", this.rewardPanel).text = v.gameData.killCount + "", this.touchUi.visible = !1;
            let e = this.getChild("value", this.rewardPanel),
                t = v.gameData.killCount;
            t < 1 && (t = 1), e.value = 100 * t + "";
            let a = v.storageMgr.getSkinArr(),
                i = Math.round((a.length - 1) * Math.random());
            if (this.skinIndex = i, this.rewardIcon.skin = "ui/common/skin/car_0" + (this.skinIndex + 1) + ".png", this.isCanShowBanner = this.isShowBanner(), console.log("ljc", "FFFFFFFFFFFFFFFFFFFFFisCanShowBanner", this.isCanShowBanner), 1 == this.isCanShowBanner) {
                var s = zs.laya.banner.WxBannerMgr.Instance.adUnitIdData.length;
                this.bannerGroup = zs.laya.banner.WxBannerMgr.Instance.getBannerGroup(s <= 1 ? 0 : 3), this.isOpenAd = !1, this.progressCur = 0, this.progressPer = .7 + 2 * Math.random();
            }
        }
        setTipShowArr(e) {
            this.addTipShow[e] = !1;
        }
        setGameCoin() {
            this.userCoin.value = v.gameData.gameCoin + "";
        }
        gameStartSet() {
            v.soundMgr.playBGM(), v.gameMgr.gameStart(), Laya.timer.once(3e3, this, function() {
                this.startTip && (this.startTip.visible = !1, this.fingure.visible = !1);
            });
        }
        showLevelTipUi(e, t, a) {
            let i = this.levelTipArr[3 * e + t - 1];
            i.visible = !0, i.pos(a.x, a.y);
            let s = a.y - 300;
            Laya.Tween.to(i, {
                y: s
            }, 1500, Laya.Ease.quadInOut, new Laya.Handler(this, function() {
                i.visible = !1;
            }));
        }
        setMePos(e, t) {
            let a = this.hpValueArr[0];
            a.visible = !0, a.getChildAt(0).scaleX = t, this.lastPos ? (e.x = .9 * this.lastPos.x + .1 * e.x, e.y = .9 * this.lastPos.y + .1 * e.y, a.pos(e.x, e.y - 80)) : (this.lastPos = e, a.pos(e.x, e.y - 80));
        }
        setHpValueUi(e, t, a) {
            if (0 == e) this.setMePos(t, a);
            else {
                let i = this.hpValueArr[e];
                i.visible = !0, i.getChildAt(0).scaleX = a, i.pos(t.x, t.y - 80);
            }
            if (e > 0) {
                let a = !0;
                t.x > 0 && t.x < 750 && t.y > -Laya.Browser.clientHeight && t.y < Laya.Browser.clientHeight && (a = !1), t.x < 40 ? t.x = 40 : t.x > 710 && (t.x = 710), t.y < 30 - Laya.Browser.clientHeight / 2 && (t.y = 30 - Laya.Browser.clientHeight / 2), t.y > Laya.Browser.clientHeight / 2 - 30 && (t.y = Laya.Browser.clientHeight / 2 - 30);
                let i = t.x - 375,
                    s = -t.y,
                    o = Math.atan2(s, i);
                o = 180 * o / Math.PI, o -= 90, this.directionArr[e - 1].visible = a, this.directionArr[e - 1].pos(t.x, t.y), this.directionArr[e - 1].rotation = -o;
            }
            0 == e && (this.redTip.visible = a < .25);
        }
        hideHpValue() {
            this.hpValueArr[0].visible = !1, this.redTip.visible = !1;
        }
        hideHp(e) {
            this.hpValueArr[e].visible = !1, this.directionArr[e - 1].visible = !1;
        }
        showKillUi(e) {
            e > 4 && (e = 4);
            for (let t = 0; t < e; ++t) this.killArr[t].visible = !1;
            this.killArr[e].scale(3, 3), this.killArr[e].alpha = .3, this.killArr[e].visible = !0, this.killArr[e].getComponent(P).aniSet4();
        }
        setTouchUi(e, t, a) {
            if (e) {
                this.owner.visible = !0, this.touchUi.visible = !0;
                for (let e = 0; e < 2; ++e) {
                    this.touchUi.getChildAt(e).pos(t, a);
                }
            } else this.touchUi.visible = !1;
        }
        touchUiMoveSet(e, t) {
            let a = this.touchUi.getChildByName("point"),
                i = this.touchUi.getChildByName("bg"),
                s = new Laya.Vector2(i.x, i.y);
            a.x += e / 2.5, a.y += t / 2.5;
            let o = new Laya.Vector2(a.x, a.y),
                r = o.x - s.x,
                n = o.y - s.y,
                l = Math.sqrt(r * r + n * n);
            l > 90 && (r = r / l * 90, n = n / l * 90, l = 90, a.x = r + s.x, a.y = n + s.y);
        }
        touchUiMoveSet2(e, t) {
            let a = this.touchUi.getChildByName("point"),
                i = this.touchUi.getChildByName("bg"),
                s = new Laya.Vector2(i.x, i.y);
            a.x = s.x + 90 * e, a.y = s.y + 90 * t;
        }
        fingureMove() {
            this.fingureMoveValue += Laya.timer.delta / 1e3;
            let e = Math.sin(this.fingureMoveValue);
            this.fingure.x = this.fingurex + 180 * e;
        }
        initEvent() {
            v.glEvent.on("over_game_event", this, this.onGameOverEvent), v.glEvent.on("init_game_event", this, this.onGameInitEvent), v.glEvent.on("play_game_event", this, this.onGamePlayEvent), v.gameMgr.initGame(!0), Laya.stage.on(zs.laya.platform.PlatformMgr.OPEN_WIN_VIEW, this, this.onOpenWinView), Laya.stage.on(zs.laya.platform.PlatformMgr.OPEN_FAILED_VIEW, this, this.onOpenFailedView);
        }
        showLeftTime() {
            this.leftNum = 3, this.leftUi.visible = !0, this.startTip.visible = !0, v.soundMgr.play("2lefttime"), Laya.timer.loop(1e3, this, this.leftTimeTip), v.storageMgr.isPlayVibrate() && zs.laya.sdk.DeviceService.VibrateShort();
        }
        leftTimeTip() {
            if (this.leftNum--, v.storageMgr.isPlayVibrate() && zs.laya.sdk.DeviceService.VibrateShort(), this.leftNum <= 0) return this.leftUi.visible = !1, Laya.timer.clear(this, this.leftTimeTip), void this.gameStartSet();
            this.leftUi.getChildByName("number").skin = "ui/common/game/" + this.leftNum + ".png";
        }
        onUpdate() {
            this.fingure.visible && this.fingureMove(), this.movet += Laya.timer.delta / 1e3;
            let e = 1.4 * Math.abs(this.movet - Math.floor(this.movet) - .5) + .3;
            this.redTip.alpha = e;
        }
        onClosed() {
            Laya.timer.clearAll(this), v.glEvent.offAllCaller(this);
        }
        onGameOverEvent(e) {
            e && e.isVictory ? (v.soundMgr.stopBGM(), v.gameMgr.setGameOver(), v.gameData.isStart = !1, Laya.timer.once(2e3, this, this.setRewardPanel)) : this.revivalFail();
        }
        revivalSet() {
            this.revivalView.visible = !0, this.revivalMgr.init();
        }
        revival() {
            this.isRevival = !1, v.gameMgr.isOver = !1;
        }
        revivalFail() {
            v.soundMgr.stopBGM(), v.soundMgr.stop("4fire");
            v.gameMgr.setGameOver(), zs.laya.platform.PlatformMgr.onGameFaildPopUp({
                isWin: !1
            });
        }
        onOpenWinView() {
            this.owner.close(), this.onClosed(), Laya.Scene.open("views/success.scene", !1, Laya.Handler.create(this, () => {})), v.isBringBackToLifed = !1;
        }
        onOpenFailedView() {
            this.owner.close(), this.onClosed(), Laya.Scene.open("views/fail.scene", !1, Laya.Handler.create(this, () => {})), v.isBringBackToLifed = !1;
        }
        onGameInitEvent() {}
        onGamePlayEvent() {
            this.getChild("topUI", this.owner).visible = !0, this.gameStartSet(), v.gameData.gameCoin = 0;
        }
        onBackEvent() {
            this.owner.close(), v.gameMgr.over(), v.gameMgr.initGame(!0), Laya.Scene.open("views/home.scene", !1, Laya.Handler.create(this, () => {}));
        }
    }
    class B extends M {
        constructor() {
            super(...arguments), this.nameBgArr = [], this.oriy = 400, this.soundSkin = "ui/common/btn_sound_", this.vibrateSkin = "ui/common/btn_vibrate_", this.moveValue = 0, this.movet = 0, this.movey = 0;
        }
        onAwake() {
            super.onAwake();
            if(NewLogin){
                NewLogin = false;
                showBannerMini()
            }
        }
        initUI() {
            let e = this.getChild("topUI", this.owner),
                t = this.getChild("middleUI", this.owner);
            this.btnSound = this.getChild("btnSound", e), this.setSound(v.storageMgr.isPlaySound()), this.fingure = this.getChild("fingure", t), this.btnVibrate = this.getChild("btnVibrate", e), this.setVibrate(v.storageMgr.isPlayVibrate()), this.coinValue = e.getChildByName("coinBg").getChildByName("value"), this.btnPlay = this.getChild("btnPlay", t), this.btnPlay2 = this.getChild("btnPlay2", t), this.btnRank = this.getChild("rankBtn", t);
            this.updateScore(), this.skinShopBtn = this.getChild("skinBtn", t), v.gameData.isOn_home = !0;
            this.getChild("box_clickLayer", this.owner).visible = false;
        }
        initEvent() {
            v.utils.addClickEvent(this.btnVibrate, this, this.onVibrateClick), v.utils.addClickEvent(this.btnSound, this, this.onSoundClick), v.utils.addClickEvent(this.skinShopBtn, this, this.onSkinShopClick), v.utils.addClickEvent(this.btnRank, this, this.onRankClick), this.btnPlay.on(Laya.Event.MOUSE_DOWN, this, this.onPlayGameClick), this.btnPlay2.on(Laya.Event.MOUSE_DOWN, this, this.onPlayGameClick), v.glEvent.on("update_coin", this, this.updateScore);
        }
        onClosed() {
            v.glEvent.off("update_coin", this, this.updateScore);
        }
        setSound(e) {
            let t = e ? "on.png" : "off.png";
            this.btnSound.skin = this.soundSkin + t, Laya.SoundManager.muted = !e, v.storageMgr.setPlaySound(e);
            window.WebAudioEngine.pause = !v.storageMgr.isPlaySound();
        }
        setVibrate(e) {
            let t = e ? "on.png" : "off.png";
            this.btnVibrate.skin = this.vibrateSkin + t, v.storageMgr.setPlayVibrate(e);
        }
        onSoundClick() {
            this.setSound(!v.storageMgr.isPlaySound());
        }
        onVibrateClick() {}
        onPlayGameClick() {
            this.getChild("box_clickLayer", this.owner).visible = true;
            platform.getInstance().showInterstitial();
            v.gameData.isOn_home = !1;
            v.gameMgr.playVibrate(!1), Laya.Scene.open("views/ggame.scene", !1, Laya.Handler.create(this, e => {
                this.owner.close(), v.glEvent.event("init_game_event", {
                    isPlay: !0
                }), v.glEvent.event("play_game_event");
            }));
        }
        onUpdate() {}
        setName(e) {
            let t = Math.floor(Math.random() * v.commonData.playerNameStrArr.length),
                a = v.commonData.playerNameStrArr[t];
            a = a.length < 5 ? a : a.substring(0, 4), e.getChildAt(0).text = a + " join game";
        }
        onStartToVideo(e) {
            this.onCheckAd(e);
        }
        onCheckAd(e) {}
        onRankClick() {
            Laya.Scene.open("views/rank.scene", !1, Laya.Handler.create(this, e => {
                this.owner.close();
            }));
        }
        onSkinShopClick() {
            this.getChild("box_clickLayer", this.owner).visible = true;
            Laya.Scene.open("views/skinShop.scene", !1, Laya.Handler.create(this, e => {
                this.owner.close();
            }));
        }
        updateScore() {
            this.coinValue.value = v.commonData.userCoin + "", v.storageMgr.setAwardGold(v.commonData.userCoin);
        }
    }
    class x extends M {
        constructor() {
            super(...arguments), this._loadCount = 3, this._loadNum = 0, this._isLoadFinish = !1, this.length = 477, this.loadPres = 0;
        }
        onAwake() {
            super.onAwake();
        }
        onEnable() {
            zs.laya.sdk.SdkService.initSDK(), zs.laya.sdk.DeviceService.init(), v.rankMgr.init(), v.resourceMgr.init(v.glEvent), v.configMgr.init(v.glEvent), v.wxMgr.init(), this.setPlayerName(), this.initLoaclalData(), zs.laya.WebService.UseWebApi = !0, zs.laya.WebService.RequestSign = "Battle-Cars-pcdld_api_secret", zs.laya.WebService.WebApiMap = {
                login: "",
                gameCfg: "",
                updateInfo: "",
                logVideo: ""
            }, Laya.stage.on(zs.laya.XHRUtils.NET_XHR_RESPONSE, this, this.onNetXHRResponse), this.login()
        }
        setPlayerName() {
            v.commonData.playerNameStrArr = v.commonData.playerNameStr1.split(",");
        }
        onPlatformCfgReady() {}
        login() {
            zs.laya.WebService.requestBaseCfg(null);
            var e = Laya.LocalStorage.getItem(zs.laya.WebService.RequestSign);
            if (e) {
                var t = JSON.parse(e);
                if (t && t.lastLoginDate && zs.laya.MiscUtils.isToday(t.lastLoginDate)) return zs.laya.WebService.RequestHeader = {
                    t: t.t,
                    timestamp: t.timestamp
                }, console.log("1---------------登录：" + t.playerInfo.user_id), void zs.laya.WebService.requestLoginByUserId(t.playerInfo.user_id);
            }
        }
        onNetXHRResponse(e, t, a, i) {}
        initLoaclalData() {
            let e = v.storageMgr.gameStatus;
            v.commonData.userCoin = e.awardGold, v.commonData.skinId = e.skinId, v.commonData.newLevel = e.level;
        }
        initUI() {
            let e = this.owner.getChildByName("middleUI");
            this.lblPres = e.getChildByName("lblPres"), this.barPres = e.getChildByName("progress"), Laya.timer.loop(200, this, this.loopLoading);
        }
        loopLoading() {
            this.loadPres = this.loadPres + .03 * Math.random();
            this.loadPres > 1 && (this.loadPres = 1);
            this.onLoading(0);
        }
        initEvent() {
            v.glEvent.on("load_finish_event", this, this.onLoadFinish), v.glEvent.on("load_pass_event", this, this.onLoading);
        }
        onLoadFinish(e) {
            this._loadNum++, this.onLoading(0), this._loadNum >= this._loadCount && (this.barPres.width = this.length, this.lblPres.text = "100%", this.loadFinished = !0, this.loadGameScene());
        }
        onLoading(e) {
            e < this.loadPres ? e = this.loadPres : this.loadPres = e;
            let t = (this._loadNum + e) / this._loadCount;
            t > 1 && (t = 1);
            let a = Math.floor(100 * t);
            this.barPres.width = t * this.length, this.lblPres.text = a + "%";
        }
        loadGameScene() {
            this.openGameScene();
        }
        openGameScene() {
            let e = this;
            zs.laya.platform.PlatformMgr.enterGamePopup(Laya.Handler.create(this, () => {
                platform.getInstance().yadstartup("Battle-Cars", () => {
                    window.WebAudioEngine.pause = !v.storageMgr.isPlaySound();
                    Laya.Scene.open("views/home.scene", !1, Laya.Handler.create(this, t => {
                        Laya.timer.clear(this, this.loopLoading);
                        let a = e.owner.getChildByName("fullUI1"),
                            i = e.owner.getChildByName("middleUI");
                        a.visible = !1, i.visible = !1;
                    }));
                })
            }));
        }
    }
    class I extends Laya.Script {
        onAwake() {
            super.onAwake(), this.initUI(), this.initEvent();
        }
        initUI() {
            let e = this.owner.getChildByName("middleUI");
            this.friendPanel = e.getChildByName("friend"), this.friendList = this.friendPanel.getChildByName("list"), this.touchArea = this.friendPanel.getChildByName("touchArea"), this.touchArea.alpha = 0;
        }
        initEvent() {
            let e = 0,
                t = 0,
                a = 0,
                i = 0;
            this.touchArea.on(Laya.Event.MOUSE_DOWN, this, function(i) {
                i.stopPropagation(), a = 0, t = i.nativeEvent.timeStamp, e = i.nativeEvent.changedTouches[0].clientY, v.rankMgr.onFrientMouseEvent({
                    cmd: "touch_start"
                });
            }), this.touchArea.on(Laya.Event.MOUSE_MOVE, this, function(t) {
                t.stopPropagation(), a = t.nativeEvent.changedTouches[0].clientY - e, v.rankMgr.onFrientMouseEvent({
                    cmd: "touch_move",
                    deltaY: a * Laya.Browser.pixelRatio
                });
            }), this.touchArea.on(Laya.Event.MOUSE_UP, this, function(e) {
                e.stopPropagation(), i = a / (e.nativeEvent.timeStamp - t), v.rankMgr.onFrientMouseEvent({
                    cmd: "touch_end",
                    speed: i
                });
            }), this.touchArea.on(Laya.Event.MOUSE_OUT, this, function(e) {
                e.stopPropagation(), i = a / (e.nativeEvent.timeStamp - t), v.rankMgr.onFrientMouseEvent({
                    cmd: "touch_cancel",
                    speed: i
                });
            });
        }
        onDisable() {
            this.touchArea.offAllCaller(this), v.rankMgr.showFriendRank(!1);
        }
        show() {
            this.friendPanel.visible = !0, v.rankMgr.resetSize(this.friendList.width, this.friendList.height), v.rankMgr.showFriendRank(!0);
        }
        hide() {
            this.friendPanel.visible = !1, v.rankMgr.showFriendRank(!1);
        }
        getChild(e) {
            this.findChild(this.owner, e);
        }
        findChild(e, t) {
            if (null != e) {
                let a = t.split("/"),
                    i = e;
                for (let e = 0; e < a.length; e++)
                    if (!(i = i.getChildByName(a[e]))) return null;
                return i;
            }
            return null;
        }
    }
    class E extends Laya.Script {
        onAwake() {
            super.onAwake(), this.initData(), this.initUI();
        }
        initData() {}
        initUI() {
            let e = this.owner.getChildByName("middleUI");
            this.worldPanel = e.getChildByName("world");
        }
        show() {
            this.worldPanel.visible = !0, null;
        }
        hide() {
            this.worldPanel.visible = !1;
        }
        getChild(e) {}
    }
    class R extends M {
        onAwake() {
            super.onAwake(), this.initData(), this.initUI();
        }
        onStart() {
            this.initEvent(), this.onRankClick(0);
        }
        initData() {
            this.rankFriend = this.owner.getComponent(I), this.rankWorld = this.owner.getComponent(E);
        }
        initUI() {
            let e = this.getChild("topUI", this.owner);
            this.btnBack = this.getChild("btnBack", e);
            let t = this.getChild("middleUI", this.owner);
            this.tabRank = this.getChild("tabRank", t);
        }
        initEvent() {
            v.utils.addClickEvent(this.btnBack, this, this.onCloseClick), this.tabRank.selectHandler = new Laya.Handler(this, this.onRankClick);
        }
        onRankClick(e) {
            1 != e ? (this.rankFriend && this.rankFriend.show(), this.rankWorld && this.rankWorld.hide()) : (this.rankFriend && this.rankFriend.hide(), this.rankWorld && this.rankWorld.show());
        }
        onPlayEvent() {}
        onCloseClick() {
            Laya.Scene.open("views/home.scene", !1, Laya.Handler.create(this, e => {
                Laya.Scene.close("views/rank.scene");
            }));
        }
    }
    class T extends M {
        constructor() {
            super(...arguments), this.skinArr = [], this.selectIndex = 0, this.indexArr = [], this.moveIndex = 0, this.lightx = 0, this.lighty = 0, this.selectx = 100, this.selecty = 100, this.unlockIndex = 0, this.isCoin = !1;
        }
        onAwake() {
            super.onAwake();
        }
        initUI() {
            let e = this.getChild("topUI", this.owner),
                t = this.getChild("middleUI", this.owner),
                a = this.getChild("skinPanel", t);
            this.selectimg = a.getChildByName("select"), this.selectLight = a.getChildByName("selectLight"), this.backBtn = this.getChild("backBtn", t), this.unLockBtn = this.getChild("unLockBtn", t), this.unlockValue = this.unLockBtn.getChildByName("coinBg").getChildByName("value");
            let i = v.storageMgr.getUnlockCount();
            i > v.commonData.skinValueArr.length - 1 && (i = v.commonData.skinValueArr.length - 1), this.unlockValue.value = v.commonData.skinValueArr[i] + "", this.selectIndex = v.storageMgr.getSkinId(), this.coinValue = this.getChild("coinBg", e).getChildByName("value"), this.coinValue.value = v.commonData.userCoin + "", this.skinArr.length = 9;
            let s = v.storageMgr.getSkinArr();
            for (let e = 0; e < 9; ++e) {
                let t = a.getChildAt(e + 2);
                t.getChildByName("lock").visible = !s[e], !s[e] && zs.laya.platform.ADConfig.zs_share && (t.getChildByName("lock").getChildByName("img").skin = "ui/common/home/img_feixiang.png"), this.skinArr[e] = t, t.on(Laya.Event.MOUSE_DOWN, this, this.selectSkin, [e]);
            }
            if (v.commonData.skinValueArr[i] > v.commonData.userCoin) {
                if (this.unLockBtn.getChildByName("videoTip").visible = !0, zs.laya.platform.ADConfig.zs_share) {
                    this.unLockBtn.getChildByName("videoTip").getChildByName("img").skin = "ui/common/home/img_feixiang.png";
                }
            } else this.unLockBtn.getChildByName("videoTip").visible = !1;
            let tt = v.storageMgr.getSkinArr();
            let noSkin = false;
            for (let ee = 0; ee < tt.length; ++ee) {
                if (!tt[ee]) {
                    noSkin = true;
                    break
                }
            }
            if (!noSkin) {
                this.unLockBtn.visible = false;
            }
            this.selectimg.x = this.skinArr[this.selectIndex].x + this.selectx, this.selectimg.y = this.skinArr[this.selectIndex].y + this.selecty, this.selectLight.x = this.skinArr[this.selectIndex].x + this.lightx, this.selectLight.y = this.skinArr[this.selectIndex].y + this.lighty;
            this.unLockBtn.enable = false;
        }
        initEvent() {
            v.utils.addClickEvent(this.backBtn, this, this.onBackClick), v.utils.addClickEvent(this.unLockBtn, this, this.onUnlockClick);
        }
        selectSkin(e) {
            v.storageMgr.getSkinArr()[e] ? (this.selectimg.x = this.skinArr[e].x + this.selectx, this.selectimg.y = this.skinArr[e].y + this.selecty, this.selectIndex = e) : (this.unlockIndex = e, this.onVideoClick()), this.selectLight.x = this.skinArr[e].x + this.lightx, this.selectLight.y = this.skinArr[e].y + this.lighty;
        }
        onUnlockClick() {
            this.unLockBtn.enable = true;
            v.commonData.userCoin < v.commonData.skinValueArr[v.storageMgr.getUnlockCount()] ? (this.unlockIndex = -1, this.onVideoClick()) : this.randomUnlock(!0);
        }
        onVideoClick() {
            this.isCoin = !1, Laya.timer.once(1000, this, () => {
                this.unLockBtn.enable = false
            })
            platform.getInstance().showReward(() => {
                this.unlockIndex < 0 ? this.randomUnlock(!1) : this.unlockSkin(this.unlockIndex);
                this.unLockBtn.enable = false;
            });
        }
        onBackClick() {
            v.storageMgr.setSkinId(this.selectIndex), v.commonData.skinId = this.selectIndex, v.gameMgr && v.gameMgr.playerLg.changeSkin(), Laya.Scene.open("views/home.scene", !1, Laya.Handler.create(this, e => {
                this.owner.close();
            }));
        }
        randomUnlock(e) {
            let t = v.storageMgr.getSkinArr();
            this.indexArr = [], this.moveIndex = 0;
            for (let e = 0; e < t.length; ++e) t[e] || this.indexArr.push(e);
            if (this.isCoin = e, this.indexArr.length > 1) Laya.timer.loop(150, this, this.setpos);
            else if (1 == this.indexArr.length) this.unlockSkin(this.indexArr[0]);
        }
        unlockSkin(e) {
            let t = this.skinArr[e];
            t.getChildByName("lock").visible = !1, this.selectimg.x = t.x + this.selectx, this.selectimg.y = t.y + this.selecty, this.isCoin && (v.commonData.userCoin -= v.commonData.skinValueArr[v.storageMgr.getUnlockCount()], v.storageMgr.setAwardGold(v.commonData.userCoin)), this.isCoin = !1, v.storageMgr.unlockSkin(e), this.selectIndex = e;
            let a = v.storageMgr.getUnlockCount();
            if (a > v.commonData.skinValueArr.length - 1 && (a = v.commonData.skinValueArr.length - 1), this.unlockValue.value = v.commonData.skinValueArr[a] + "", this.coinValue.value = v.commonData.userCoin + "", v.commonData.skinValueArr[a] > v.commonData.userCoin) {
                if (this.unLockBtn.getChildByName("videoTip").visible = !0, zs.laya.platform.ADConfig.zs_share) {
                    this.unLockBtn.getChildByName("videoTip").getChildByName("img").skin = "ui/common/home/img_feixiang.png";
                }
            } else this.unLockBtn.getChildByName("videoTip").visible = !1;
            let tt = v.storageMgr.getSkinArr();
            let noSkin = false;
            for (let ee = 0; ee < tt.length; ++ee) {
                if (!tt[ee]) {
                    noSkin = true;
                    break
                }
            }
            if (!noSkin) {
                this.unLockBtn.visible = false;
            }
        }
        setpos() {
            let e = this.skinArr[this.indexArr[this.moveIndex % this.indexArr.length]];
            this.selectLight.x = e.x + this.lightx, this.selectLight.y = e.y + this.lighty, this.moveIndex++, (this.moveIndex > 12 || this.moveIndex / this.indexArr.length > 4) && (this.unlockSkin(this.indexArr[(this.moveIndex - 1) % this.indexArr.length]), Laya.timer.clear(this, this.setpos), this.unLockBtn.enable = false);
        }
        onOpened() {}
        onClose() {
            Laya.timer.clear(this);
        }
    }
    class N extends Laya.Script {
        constructor() {
            super(...arguments), this.index = 0, this.isMove = !1, this.moveValue = 0, this.start = null, this.end = null;
        }
        init(e, t) {
            this.index = t, this.single = e;
        }
        setMove(e, t, a, i, s = null, o = null) {
            this.isMove = e, this.start = t, this.end = a, this.moveValue = 0, this.single.visible = !0;
            let r = new Laya.Vector2(0, 0);
            Laya.Tween.to(this, {
                moveValue: 1
            }, 800, Laya.Ease.quadInOut, new Laya.Handler(this, function() {
                this.single.visible = !1, v.commonData.GGame.setTipShowArr(this.index), v.gameMgr.isOver ? (v.commonData.userCoin += i, s && o && s(o)) : v.gameData.gameCoin += i;
            })).update = new Laya.Handler(this, function() {
                r.x = this.start.x * (1 - this.moveValue) + this.end.x * this.moveValue, r.y = this.start.y * (1 - this.moveValue) + this.end.y * this.moveValue, this.single.pos(r.x, r.y);
            });
        }
        onUpdate() {}
    }
    class z extends M {
        constructor() {
            super(...arguments), this.doubleReward = !1, this.addTipArr = [], this.addTipShow = [], this.coinStart = null, this.isCoinAni = !1, this.coinCount = 0, this.coinFlyValue = 0;
        }
        initData() {}
        initUI() {
            let e = this.getChild("bottomUI", this.owner);
            this.nextBtn = this.getChild("nextBtn", e), this.skinShopBtn = this.getChild("skinBtn", e), this.videoBtn = this.getChild("videoBtn", e), this.videoBtn.visible = !0, this.doubleReward = !1;
            let t = this.getChild("midddleUI", this.owner);
            this.addTipBox = this.getChild("addCoin", t), this.addTipShow.length = 20, this.addTipArr.length = 20;
            for (let e = 0; e < 20; ++e) {
                this.addTipShow[e] = !1;
                let t = this.addTipBox.getChildAt(e);
                t.visible = !1, t.addComponent(N).init(t, e), this.addTipArr[e] = t;
            }
            this.list_showList = this.getChild("middleUI", this.owner).getChildByName("list_showList");
            platform.getInstance().initList(this.list_showList);
            v.soundMgr.stop("4fire");
            let a = this.getChild("topUI", this.owner);
            this.coinBg = this.getChild("coinBg", a), this.singleCoinValue = e.getChildByName("coin").getChildByName("value"), this.singleCoinValue.value = Math.floor(v.gameData.gameCoin) + "", zs.laya.platform.ADConfig.zs_share && (this.videoBtn.getChildByName("img").skin = "ui/common/home/img_feixiang.png"), this.coinStart = e.getChildByName("coin"), this.coinValue = this.coinBg.getChildByName("value"), this.coinValue.value = v.commonData.userCoin + "", v.commonData.newLevel++, v.storageMgr.setGameStausLevel(v.commonData.newLevel), v.rankMgr.uploadScroe(Math.floor(v.commonData.newLevel));
        }
        initEvent() {
            v.utils.addClickEvent(this.nextBtn, this, this.onBtnAcquire), v.utils.addClickEvent(this.skinShopBtn, this, this.onSkinShopClick), v.utils.addClickEvent(this.videoBtn, this, this.onPlayVideoClick);
        }
        lateCoin() {
            v.gameData.gameCoin = 0, v.gameMgr.gameReset(), Laya.Scene.close("views/success.scene"), zs.laya.platform.PlatformMgr.onGameOverPopUp(!1);
        }
        loopAniSet() {
            this.coinCount = 0, this.isCoinAni = !0, this.doubleReward && (v.gameData.gameCoin *= 5, this.singleCoinValue.value = Math.floor(v.gameData.gameCoin) + ""), this.coinFlyValue = Math.floor(v.gameData.gameCoin / 20), Laya.timer.loop(50, this, this.loopAni), Laya.timer.once(2200, this, this.lateCoin);
        }
        loopAni() {
            this.coinCount++, this.coinCount % 3 == 0 && (v.storageMgr.isPlayVibrate() && zs.laya.sdk.DeviceService.VibrateShort(), v.soundMgr.play("coin")), this.coinCount < 21 ? this.showAddUi(this.coinFlyValue) : (v.commonData.userCoin += Math.floor(v.gameData.gameCoin) - 20 * this.coinFlyValue, v.storageMgr.setAwardGold(v.commonData.userCoin), this.coinValue.value = v.commonData.userCoin + "", Laya.timer.clear(this, this.loopAni));
        }
        showAddUi(e) {
            let t = this.addTipArr[this.coinCount - 1],
                a = this.getChild("bottomUI", this.owner),
                i = new Laya.Vector2(this.coinBg.x - 13, this.coinBg.y - Laya.stage.height / 2 - 12),
                s = new Laya.Vector2(this.coinStart.x + a.x - 10, this.coinStart.y + a.y - Laya.stage.height / 2 - 10);
            t.pos(s.x, s.y), t.getComponent(N).setMove(!0, s, i, e, this.upDateScore, this);
        }
        upDateScore(e) {
            e.coinValue.value = v.commonData.userCoin + "";
        }
        onBtnAcquire() {
            if (!this.isCoinAni)
                this.loopAniSet();
        }
        onSkinShopClick() {
            this.isCoinAni || (v.commonData.userCoin += Math.floor(v.gameData.gameCoin), v.storageMgr.setAwardGold(v.commonData.userCoin), v.gameData.gameCoin = 0, v.gameMgr.gameReset(), Laya.Scene.open("views/skinShop.scene", !1, Laya.Handler.create(this, e => {
                Laya.Scene.close("views/success.scene");
            })));
        }
        onAcquireClick() {
            this.doubleReward && (v.gameData.gameCoin *= 5), v.commonData.userCoin += Math.floor(v.gameData.gameCoin), v.storageMgr.setAwardGold(v.commonData.userCoin), this.coinValue.value = v.commonData.userCoin + "", v.gameData.gameCoin = 0;
        }
        onPlayVideoClick() {
            this.isCoinAni || platform.getInstance().showReward(() => {
                this.doubleReward = !0, v.wxMgr.showToast("Congratulations, you get Gold Coins x5", 2e3), this.loopAniSet();
            });
        }
    }
    class U extends Laya.Script {
        constructor() {
            super();
        }
        onAwake() {
            this.lab_name = this.owner.getChildByName("lab_name"), this.lab_invite = this.owner.getChildByName("lab_invite"), this.img_bg = this.owner.getChildByName("img_bg"), this.instance = this.owner;
        }
        onStart() {
            this.instance.visible = !1;
            let e = this;
            zs.laya.platform.ADConfig.zs_switch && zs.laya.platform.ADConfig.zs_false_news_switch ? zs.laya.sdk.ZSReportSdk.loadAd(function(t) {
                var a = t.promotion;
                a = a.filter(function(e) {
                    return Laya.Browser.onAndroid || "wx48820730357d81a6" != e.appid && "wxc136d75bfc63107c" != e.appid;
                }), e.adData = a[Math.floor(Math.random() * a.length)], e.initUI();
            }) : this.instance.destroy();
        }
        initUI() {
            this.instance.visible = !0, this.lab_name.text = C.Instance.randowData.nickname, this.lab_invite.text = "" + this.adData.app_title, this.img_bg.on(Laya.Event.CLICK, this, this.onBgClick), this.instance.y = 0 - this.instance.height, this.instance.centerX = 0, Laya.SoundManager.playSound("sound/getChat.mp3"), zs.laya.sdk.DeviceService.VibrateShort(), Laya.Tween.to(this.instance, {
                y: 100
            }, 500);
        }
        onBgClick() {
            zs.laya.sdk.ZSReportSdk.navigate2Mini(this.adData, v.commonData.userId, function() {
                Laya.stage.event("APP_JUMP_SUCCESS");
            }, function() {
                Laya.stage.event("APP_JUMP_CANCEL"), zs.laya.platform.ADConfig.zs_switch && zs.laya.platform.ADConfig.zs_reminder_switch && Laya.Scene.open("views/ad/ChallengePage.scene", !1);
            }, function() {}), Laya.Tween.to(this.instance, {
                y: 0 - this.instance.height
            }, 500);
        }
    }
    class W {
        constructor() {}
        static init() {
            var e = Laya.ClassUtils.regClass;
            e("compUI/FlashLight.ts", w), e("compUI/ChallengPage.ts", k), e("compUI/FrienPlayView.ts", A), e("compUI/KnockExport.ts", V), e("scripts/stackIOViews/CarIOFailView.ts", b), e("compUI/BtnBreath.ts", D), e("scripts/stackIOViews/CarIOGGame.ts", _), e("scripts/stackIOViews/CarIOHomeView.ts", B), e("scripts/stackIOViews/CarIOLoginView.ts", x), e("scripts/stackIOViews/Rank/Rank.ts", R), e("scripts/stackIOViews/Rank/RankFriend.ts", I), e("scripts/stackIOViews/Rank/RankWorld.ts", E), e("scripts/stackIOViews/SkinShopView.ts", T), e("scripts/stackIOViews/CarIOSuccessView.ts", z), e("compUI/InviteBox.ts", U);
        }
    }
    W.width = 720;
    W.height = 1334;
    W.scaleMode = "exactfit";
    W.screenMode = "none";
    W.alignV = "middle";
    W.alignH = "center";
    W.startScene = "views/login.scene";
    W.sceneRoot = "";
    W.debug = !1;
    W.stat = !1;
    W.physicsDebug = !1;
    W.exportSceneToJson = !0;
    W.init();
    new class {
        constructor() {
            let e = Laya.Browser.height / Laya.Browser.width;
            let t = Laya.Browser.onMobile ? e * W.width : W.height;
            v.screen.realPxRatio = t / Laya.Browser.clientHeight;
            v.screen.allScreen = e > 17 / 9;
            v.screen.offsetTop = (t - W.height) / 2;
            window.Laya3D ? Laya3D.init(W.width, W.height) : Laya.init(W.width, W.height, Laya.WebGL);
            Laya.Physics && Laya.Physics.enable();
            Laya.DebugPanel && Laya.DebugPanel.enable();
            Laya.stage.scaleMode = W.scaleMode;
            Laya.stage.screenMode = W.screenMode;
            Laya.stage.alignV = W.alignV;
            Laya.stage.alignH = W.alignH;
            Laya.stage.useRetinalCanvas = !1;
            Laya.MouseManager.multiTouchEnabled = !1;
            Laya.URL.exportSceneToJson = W.exportSceneToJson;
            (W.debug || "true" == Laya.Utils.getQueryString("debug")) && Laya.enableDebugPanel();
            W.physicsDebug && Laya.PhysicsDebugDraw && Laya.PhysicsDebugDraw.enable();
            W.stat && Laya.Stat.show();
            Laya.alertGlobalError(!0);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            // Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
            console.log("==================");
              if (typeof minigame !== 'undefined') {
                //初始化 minigame sdk // @ts-ignore 
                minigame.initializeAsync().then(() => {
                  console.log("====FB initializeAsync=====");
                  // 记录启动来源 // @ts-ignore 
                  minigame.getEntryPointAsync().then((entry) => {
                    console.info("Entry Point: ", entry);
                  });
                  // 记录会话类型 // @ts-ignore 
                  const contextType = minigame.context.getType(); console.info("Context Type: ", contextType); this.startMiniGameSDK();
                });
              } else {
                console.log("====本地=====");
                Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded))
              }
        }

        startMiniGameSDK(){
            if (typeof minigame !== 'undefined') {
                //@ts-ignore 
                minigame.setLoadingProgress(100);
                //@ts-ignore 
                minigame.startGameAsync().then(() => {
                  //加载 IDE 指定的场景，这里假定第一个场景名称是 startScene
                  // GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
                  Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded))
                }).catch((e) => {
                  console.info("startGameAsync error: " + e);
                });
              }
        }

        onConfigLoaded() {
            W.startScene && Laya.Scene.open(W.startScene);
        }
    }();
}();