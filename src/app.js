var  drawNode;
var TAG_TILE_MAP = 1;

//var tArray = new Array();
var v = 20;
var  p = 0;
var rollerCar;
//当前屏幕绘制矩形的长和宽
var widthX = 10;
var  heightY = 10;
//当前屏幕绘制矩形的数量
var NumberOfSquares = 50;
//地图缩放倍数
var ScalingMultiplier = 0;
//当前路基星系
var BasicMileage = 10;

var colorLayerBG = true;

var xrr = cc.p(50,50);

//存储所有数据数组
var myarr = new Array();
//存储当前屏幕要绘制的数据数组
var drawArry = new Array();
//存储要绘制行驶轨迹的点的数组(每批栅格数据的中心点坐标)
var pointsArray = new Array();
var gameState = '1';
var MySelf = '';
var invoke = window.WebViewInvoke;
var hostIp = "192.168.0.35";
var HelloWorldLayer = cc.LayerColor.extend({
    sprite:null,

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super(cc.color(255, 255, 255, 255));

        for (var i = 0; i < 100000; i++) {
            myarr[i] = new Array();
            // 此时二维内部的数组已经生成了
        }

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        invoke.define('webGet',this.getWebData);
        invoke.define('webSet',this.setWebData);

        //cc.eventManager.addListener({
        //    event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //    swallowTouches: true,
        //    onTouchBegan: this.onTouchBegan,
        //    onTouchMoved: this.onTouchMoved,
        //    onTouchEnded: this.onTouchEnded
        //}, this);
        MySelf = this;
        if ('touches' in cc.sys.capabilities){
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                swallowTouches:true,
                    onTouchBegan: function(touches,event){
                        var target = event.getCurrentTarget();
                        var delta = touch.getLocation();
                        alert("jjjjjjjjjjjjjj");
                        //return true;
                },

                    onTouchesMoved: function (touches, event) {
                        var touch = touches[0];
                        var delta = touch.getDelta();


                        //alert(touches.length);

                        var node = event.getCurrentTarget().getChildByTag(TAG_TILE_MAP);
                        node.x += delta.x;
                        node.y += delta.y;
                        //alert(Math.sqrt(delta.x*delta.x + delta.y*delta.y));

                        if (touches.length >= 2)
                        {
                            //this.setAnchorPoint(rollerCar.x,rollerCar.y);
                            rollerCar.runAction(cc.scaleBy(0.1,1 +  Math.sqrt(delta.x*delta.x + delta.y*delta.y)/10));
                        }

                },
                    onTouchEnded:function(touch,event){

                    return true;
                }
            }, this);
        } else if ('mouse' in cc.sys.capabilities)
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseMove: function(event){
                    if(event.getButton() == cc.EventMouse.BUTTON_LEFT){
                        var node = event.getCurrentTarget().getChildByTag(TAG_TILE_MAP);
                        node.x += event.getDeltaX();
                        node.y += event.getDeltaY();
                    }
                },
            }, this);

        drawNode = new cc.DrawNode();

        this.addChild(drawNode,0,TAG_TILE_MAP);

        rollerCar = new cc.Sprite("res/RollerCar3.png");
        rollerCar.x = this.width/2;
        rollerCar.y = this.height/2;
        rollerCar.setScale(0.1,0.1);
        this.addChild(rollerCar,1);


        this.initMileageAndMigration();
        //drawNode.drawRect(cc.p(10*widthX, 10*heightY),cc.p(10*widthX + widthX,10*heightY + heightY),cc.color(50,205,50,255),1,cc.color(254,206,34,255));
        //drawNode.drawRect(cc.p(0, 0),cc.p(10 + widthX,10 + heightY),cc.color(50,205,50,255),1,cc.color(254,206,34,255));
        //drawNode.drawRect(cc.p(500, 500),cc.p(500 + widthX,500 + heightY),cc.color(50,205,50,255),1,cc.color(254,206,34,255));

        //console.log(rollerCar.getPosition());
        //console.log("bbbbbbbbbbbbbbbbb");
        //xrr = drawNode.convertToWorldSpace(drawNode.getPosition());
        //drawNode.runAction(cc.moveTo(0.5,cc.p(152,152)));
        //console.log(xrr);
        //ServiceApi.request("Cache.set", {
        //    "key": "gameState",
        //    "val":"2"
        //}, function($seq, $result, $info, $value) {
        //
        //},0);

        this.initData();

        //this.runAction(cc.scaleTo(5,0.1));
        //this.removeChild(rollerCar);
        //drawNode.addChild(rollerCar,1);
        //drawNode.setAnchorPoint(0.1,0.1);
        //drawNode.runAction(cc.scaleBy(5,0.5));

        //console.log(rollerCar.getPosition());
        //console.log("drawNode");
        //console.log(rollerCar.convertToWorldSpace(rollerCar.getPosition()));
        //console.log("11111111111");
        //console.log(drawNode.convertToWorldSpace(rollerCar.getPosition()));



        return true;
    },

    //初始化里程和偏移
    initMileageAndMigration:function(){
        //里程
        var label = new cc.LabelTTF(
            BasicMileage + Math.ceil(this.height/heightY*0.3/5*2),
            "Microsoft YaHei",
            16,
            cc.size(200, 200),
            cc.TEXT_ALIGNMENT_CENTER,
            cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label.setPosition(50,this.height - 20);
        label.setFontFillColor(cc.color(255,0,0,255));
        this.addChild(label,1,10);

        var label1 = new cc.LabelTTF(
            BasicMileage + Math.ceil(this.height/heightY*0.3/5),
            "Microsoft YaHei",
            16,
            cc.size(200, 200),
            cc.TEXT_ALIGNMENT_CENTER,
            cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label1.setPosition(50,this.height/2 + (this.height - 20 - this.height/2)/2);
        label1.setFontFillColor(cc.color(255,0,0,255));
        this.addChild(label1,1,11);

        var label2 = new cc.LabelTTF(
            BasicMileage,
            "Microsoft YaHei",
            16,
            cc.size(200, 200),
            cc.TEXT_ALIGNMENT_CENTER,
            cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label2.setPosition(50,this.height/2);
        label2.setFontFillColor(cc.color(255,0,0,255));
        this.addChild(label2,1,12);

        var label3 = new cc.LabelTTF(
            BasicMileage - Math.ceil(this.height/heightY*0.3/5),
            "Microsoft YaHei",
            16,
            cc.size(200, 200),
            cc.TEXT_ALIGNMENT_CENTER,
            cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label3.setPosition(50,(this.height/2-20)/2 + 20);
        label3.setFontFillColor(cc.color(255,0,0,255));
        this.addChild(label3,1,13);

        var label4 = new cc.LabelTTF(
            "DK" +  BasicMileage + '+' + Math.ceil(BasicMileage - this.height/heightY*0.3/5 * 2),
            "Microsoft YaHei",
            16,
            cc.size(200, 200),
            cc.TEXT_ALIGNMENT_CENTER,
            cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label4.setPosition(50,20);
        label4.setFontFillColor(cc.color(255,0,0,255));
        this.addChild(label4,1,14);

        //偏移
        var label20 = new cc.LabelTTF(
            BasicMileage + Math.ceil(this.height/heightY*0.3/5*2),
            "Microsoft YaHei",
            16,
            cc.size(200, 200),
            cc.TEXT_ALIGNMENT_CENTER,
            cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label20.setPosition(50,50);
        label20.setFontFillColor(cc.color(255,0,0,255));
        this.addChild(label20,1,20);

        var label21 = new cc.LabelTTF(
            BasicMileage + Math.ceil(this.height/heightY*0.3/5),
            "Microsoft YaHei",
            16,
            cc.size(200, 200),
            cc.TEXT_ALIGNMENT_CENTER,
            cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label21.setPosition(50 + (this.width - 100)/5,50);
        label21.setFontFillColor(cc.color(255,0,0,255));
        this.addChild(label21,1,21);

        var label22 = new cc.LabelTTF(
            BasicMileage,
            "Microsoft YaHei",
            16,
            cc.size(200, 200),
            cc.TEXT_ALIGNMENT_CENTER,
            cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label22.setPosition(this.width/2,50);
        label22.setFontFillColor(cc.color(255,0,0,255));
        this.addChild(label22,1,22);

        var label23 = new cc.LabelTTF(
            BasicMileage - Math.ceil(this.height/heightY*0.3/5),
            "Microsoft YaHei",
            16,
            cc.size(200, 200),
            cc.TEXT_ALIGNMENT_CENTER,
            cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label23.setPosition(this.width - 50 - (this.width - 100)/5,50);
        label23.setFontFillColor(cc.color(255,0,0,255));
        this.addChild(label23,1,23);

        var label24 = new cc.LabelTTF(
            Math.ceil(BasicMileage - this.height/heightY*0.3/5 * 2),
            "Microsoft YaHei",
            16,
            cc.size(200, 200),
            cc.TEXT_ALIGNMENT_CENTER,
            cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label24.setPosition(this.width - 50,50);
        label24.setFontFillColor(cc.color(255,0,0,255));
        this.addChild(label24,1,24);
    },

    //初始化数据
    initData:function(){
        ServiceApi.request("Cache.get", {
            "key": "Scene:scene"
        }, function($seq, $result, $info, $value){
            if ($value.segmen != null)
            {
                BasicMileage = $value.segment;
            }
        },1000);


        //ServiceApi.request("Cache.get", {
        //    "key": "gameState"
        //}, function($seq, $result, $info, $value) {
        //    //console.log("$value:" + $value);
        //    if (gameState != $value)
        //    {
        //        gameState = $value;
        //    }
        //},500);

        ServiceApi.request("Cache.get", {
            "key": "Grid:grids"
        }, function($seq, $result, $info, $value) {
            console.log("new_gridsnew_gridsnew_gridsnew_grids");
            console.log($value);

            if($value!= null)
            {
                if($value.grids != null)
                {
                    //存储所有数据到myarr相应的位置
                    myarr[$value.center.x][$value.center.y] = $value;
                }else {
                    return;
                }
                //按照顺序存储中心点做为行驶轨迹数据
                    pointsArray.push($value.center);
                //console.log("pppppppppppppppppp");
                //console.log($value.center)
                //console.log("pointsArray.length:" + pointsArray.length);

                //清空绘制数组并计算在中线点附近的点重新存入
                drawArry.splice(0,drawArry.length);
                for (var i = $value.center.x + NumberOfSquares * (1 + ScalingMultiplier);i > $value.center.x - NumberOfSquares* (1 + ScalingMultiplier);i--)
                {
                    for (var j = $value.center.y + NumberOfSquares* (1 + ScalingMultiplier); j > $value.center.y - NumberOfSquares* (1 + ScalingMultiplier);j--)
                    {
                        if(myarr[i][j] != null){
                            if (cc.rectContainsPoint(cc.rect(0, 0, cc.view.getFrameSize().width, cc.view.getFrameSize().height), drawNode.convertToWorldSpace(cc.p(myarr[i][j].center.x * widthX, dataArry[i][1].center.y * heightY))))
                            {
                                drawArry.push(myarr[i][j]);
                            }
                        }
                    }
                }

                MySelf.drawFunction();
            }
        }, 200);
    },

    drawFunction:function(){
        //根据角度旋转小车角度
        rollerCar.runAction(cc.rotateTo(0.5,$value.info.car_drct));
        //根据center移动地图
        drawNode.runAction(cc.moveTo(0.5,cc.p(rollerCar.x - $value.center.x*widthX,rollerCar.y - $value.center.y*heightY)));
        //根据center调整里程值
        this.getChildByTag(10).setString(Math.ceil($value.center.x * 0.3 + MySelf.height/widthX*0.3/5*2));
        this.getChildByTag(11).setString(Math.ceil($value.center.x * 0.3 + MySelf.height/widthX*0.3/5));
        this.getChildByTag(12).setString(Math.ceil($value.center.x * 0.3));
        this.getChildByTag(13).setString(Math.ceil($value.center.x * 0.3 - MySelf.height/widthX*0.3/5));
        this.getChildByTag(14).setString( "DK" + BasicMileage + "+" + Math.ceil($value.center.x * 0.3 - MySelf.height/widthX*0.3/5*2));
        //根据center调整偏移值
        this.getChildByTag(20).setString(Math.ceil($value.center.y * 0.3 + MySelf.width/heightY*0.3/5*2));
        this.getChildByTag(21).setString(Math.ceil($value.center.y * 0.3 + MySelf.width/heightY*0.3/5));
        this.getChildByTag(22).setString(Math.ceil($value.center.y * 0.3));
        this.getChildByTag(23).setString(Math.ceil($value.center.y * 0.3 - MySelf.width/heightY*0.3/5));
        this.getChildByTag(24).setString(Math.ceil($value.center.y * 0.3 - MySelf.width/heightY*0.3/5*2));
        //console.log("gameState:" + gameState);
        switch(gameState){
            case '1':
                this.drawVcV();
                break;
            case '2':
                this.drawTimers();
                break;
            case '3':
                this.drawtTajectory();
                break;
            default:
                console.log("gameState未定义！");
                break;
        }
    },

    drawTimers:function(){
        //console.log("drawTimersdrawTimersdrawTimersdrawTimersdrawTimers");
        console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
        console.log("drawArry.length:" + drawArry.length);
        console.log(drawArry);
        drawNode.clear();
        for(var i=0;i<drawArry.length;i++)
        {
            for (var j=0;j<drawArry[i].grids.length;j++)
            {
                if(drawArry[i].grids[j].times <= 2 && drawArry[i].grids[j].times>0)
                {
                    drawNode.drawRect(cc.p(drawArry[i].grids[j].x*widthX, drawArry[i].grids[j].y*heightY),cc.p(drawArry[i].grids[j].x*widthX + widthX,drawArry[i].grids[j].y*heightY + heightY),cc.color(186,17,38,255),1,cc.color(254,206,34,255));
                }else if(drawArry[i].grids[j].times <= 4 && drawArry[i].grids[j].times>2){
                    drawNode.drawRect(cc.p(drawArry[i].grids[j].x*widthX, drawArry[i].grids[j].y*heightY),cc.p(drawArry[i].grids[j].x*widthX + widthX,drawArry[i].grids[j].y*heightY + heightY),cc.color(217,51,41,255),1,cc.color(254,206,34,255));
                }else if(drawArry[i].grids[j].times <= 6 && drawArry[i].grids[j].times>4){
                    drawNode.drawRect(cc.p(drawArry[i].grids[j].x*widthX, drawArry[i].grids[j].y*heightY),cc.p(drawArry[i].grids[j].x*widthX + widthX,drawArry[i].grids[j].y*heightY + heightY),cc.color(247,115,70,255),1,cc.color(254,206,34,255));
                }else if(drawArry[i].grids[j].times <= 8 && drawArry[i].grids[j].times>6){
                    drawNode.drawRect(cc.p(drawArry[i].grids[j].x*widthX, drawArry[i].grids[j].y*heightY),cc.p(drawArry[i].grids[j].x*widthX + widthX,drawArry[i].grids[j].y*heightY + heightY),cc.color(251,178,101,255),1,cc.color(254,206,34,255));
                }else if(drawArry[i].grids[j].times <= 10 && drawArry[i].grids[j].times>8){
                    drawNode.drawRect(cc.p(drawArry[i].grids[j].x*widthX, drawArry[i].grids[j].y*heightY),cc.p(drawArry[i].grids[j].x*widthX + widthX,drawArry[i].grids[j].y*heightY + heightY),cc.color(255,228,149,255),1,cc.color(254,206,34,255));
                }else if(drawArry[i].grids[j].times <= 12 && drawArry[i].grids[j].times>10){
                    drawNode.drawRect(cc.p(drawArry[i].grids[j].x*widthX, drawArry[i].grids[j].y*heightY),cc.p(drawArry[i].grids[j].x*widthX + widthX,drawArry[i].grids[j].y*heightY + heightY),cc.color(215,238,244,255),1,cc.color(254,206,34,255));
                }else if(drawArry[i].grids[j].times <= 14 && drawArry[i].grids[j].times>12){
                    drawNode.drawRect(cc.p(drawArry[i].grids[j].x*widthX, drawArry[i].grids[j].y*heightY),cc.p(drawArry[i].grids[j].x*widthX + widthX,drawArry[i].grids[j].y*heightY + heightY),cc.color(162,210,230,255),1,cc.color(254,206,34,255));
                }else if(drawArry[i].grids[j].times <= 16 && drawArry[i].grids[j].times>14){
                    drawNode.drawRect(cc.p(drawArry[i].grids[j].x*widthX, drawArry[i].grids[j].y*heightY),cc.p(drawArry[i].grids[j].x*widthX + widthX,drawArry[i].grids[j].y*heightY + heightY),cc.color(105,159,203,255),1,cc.color(254,206,34,255));
                }else if(drawArry[i].grids[j].times <= 18 && drawArry[i].grids[j].times>16){
                    drawNode.drawRect(cc.p(drawArry[i].grids[j].x*widthX, drawArry[i].grids[j].y*heightY),cc.p(drawArry[i].grids[j].x*widthX + widthX,drawArry[i].grids[j].y*heightY + heightY),cc.color(66,105,174,255),1,cc.color(254,206,34,255));
                }else if(drawArry[i].grids[j].times <= 20 && drawArry[i].grids[j].times>18){
                    drawNode.drawRect(cc.p(drawArry[i].grids[j].x*widthX, drawArry[i].grids[j].y*heightY),cc.p(drawArry[i].grids[j].x*widthX + widthX,drawArry[i].grids[j].y*heightY + heightY),cc.color(53,57,145,255),1,cc.color(254,206,34,255));
                }else {

                }
            }
        }
    },

    //绘制轨迹
    drawtTajectory:function(){
        console.log("drawtTajectorydrawtTajectorydrawtTajectorydrawtTajectorydrawtTajectory");
        drawNode.clear();
        console.log("pointsArray.length:" + pointsArray.length);
        if(pointsArray.length <= 1)
        return;
        for (var i = 0;i<pointsArray.length-1;i++)
        {
            console.log(pointsArray[i]);
            console.log(pointsArray[i+1]);
            drawNode.drawSegment(cc.p(pointsArray[i].x*widthX,pointsArray[i].y*heightY),cc.p(pointsArray[i+1].x*widthX,pointsArray[i+1].y*heightY),1,cc.color(0,0,0,255));
        }
    },

    //绘制VCV
    drawVcV:function(){
        console.log("drawVcVdrawVcVdrawVcVdrawVcVdrawVcVdrawVcVdrawVcVdrawVcVdrawVcV");
        drawNode.clear();
        for(var i=0;i<drawArry.length;i++)
        {
            for (var j=0;j<drawArry[i].grids.length;j++)
            {
                if(drawArry[i].grids[j].vcv <= 10 && drawArry[i].grids[j].vcv>=0)
                {
                    drawNode.drawRect(cc.p(drawArry[i].grids[j].x*widthX, drawArry[i].grids[j].y*heightY),cc.p(drawArry[i].grids[j].x*widthX + widthX,drawArry[i].grids[j].y*heightY + heightY),cc.color(186,17,38,255),1,cc.color(254,206,34,255));
                }else if(drawArry[i].grids[j].vcv <= 20 && drawArry[i].grids[j].vcv>10){
                    drawNode.drawRect(cc.p(drawArry[i].grids[j].x*widthX, drawArry[i].grids[j].y*heightY),cc.p(drawArry[i].grids[j].x*widthX + widthX,drawArry[i].grids[j].y*heightY + heightY),cc.color(217,51,41,255),1,cc.color(254,206,34,255));
                }else if(drawArry[i].grids[j].vcv <= 30 && drawArry[i].grids[j].vcv>20){
                    drawNode.drawRect(cc.p(drawArry[i].grids[j].x*widthX, drawArry[i].grids[j].y*heightY),cc.p(drawArry[i].grids[j].x*widthX + widthX,drawArry[i].grids[j].y*heightY + heightY),cc.color(247,115,70,255),1,cc.color(254,206,34,255));
                }else if(drawArry[i].grids[j].vcv <= 40 && drawArry[i].grids[j].vcv>30){
                    drawNode.drawRect(cc.p(drawArry[i].grids[j].x*widthX, drawArry[i].grids[j].y*heightY),cc.p(drawArry[i].grids[j].x*widthX + widthX,drawArry[i].grids[j].y*heightY + heightY),cc.color(251,178,101,255),1,cc.color(254,206,34,255));
                }else if(drawArry[i].grids[j].vcv <= 50 && drawArry[i].grids[j].vcv>40){
                    drawNode.drawRect(cc.p(drawArry[i].grids[j].x*widthX, drawArry[i].grids[j].y*heightY),cc.p(drawArry[i].grids[j].x*widthX + widthX,drawArry[i].grids[j].y*heightY + heightY),cc.color(255,228,149,255),1,cc.color(254,206,34,255));
                }else if(drawArry[i].grids[j].vcv <= 60 && drawArry[i].grids[j].vcv>50){
                    drawNode.drawRect(cc.p(drawArry[i].grids[j].x*widthX, drawArry[i].grids[j].y*heightY),cc.p(drawArry[i].grids[j].x*widthX + widthX,drawArry[i].grids[j].y*heightY + heightY),cc.color(215,238,244,255),1,cc.color(254,206,34,255));
                }else if(drawArry[i].grids[j].vcv <= 70 && drawArry[i].grids[j].vcv>60){
                    drawNode.drawRect(cc.p(drawArry[i].grids[j].x*widthX, drawArry[i].grids[j].y*heightY),cc.p(drawArry[i].grids[j].x*widthX + widthX,drawArry[i].grids[j].y*heightY + heightY),cc.color(162,210,230,255),1,cc.color(254,206,34,255));
                }else if(drawArry[i].grids[j].vcv <= 80 && drawArry[i].grids[j].vcv>70){
                    drawNode.drawRect(cc.p(drawArry[i].grids[j].x*widthX, drawArry[i].grids[j].y*heightY),cc.p(drawArry[i].grids[j].x*widthX + widthX,drawArry[i].grids[j].y*heightY + heightY),cc.color(105,159,203,255),1,cc.color(254,206,34,255));
                }else if(drawArry[i].grids[j].vcv <= 90 && drawArry[i].grids[j].vcv>80){
                    drawNode.drawRect(cc.p(drawArry[i].grids[j].x*widthX, drawArry[i].grids[j].y*heightY),cc.p(drawArry[i].grids[j].x*widthX + widthX,drawArry[i].grids[j].y*heightY + heightY),cc.color(66,105,174,255),1,cc.color(254,206,34,255));
                }else if(drawArry[i].grids[j].vcv <= 100 && drawArry[i].grids[j].vcv>90){
                    drawNode.drawRect(cc.p(drawArry[i].grids[j].x*widthX, drawArry[i].grids[j].y*heightY),cc.p(drawArry[i].grids[j].x*widthX + widthX,drawArry[i].grids[j].y*heightY + heightY),cc.color(53,57,145,255),1,cc.color(254,206,34,255));
                }else {

                }
            }
        }
    },

    //conversionCoordinateX:function(Xposition,Ypsoition,angle){
    //    return Xposition * Math.cos(angle) + Ypsoition *Math.sin(angle);
    //},
    //
    //conversionCoordinateY:function(Xposition,Ypsoition,angle){
    //    return Ypsoition * Math.cos(angle) - Xposition * Math.sin(angle);
    //},
    //
    //flipXAxis180:function(Xposition){
    //    return Xposition * -1;
    //},
    //
    //flipYAxis180:function(Ypsoition){
    //    return Ypsoition * -1;
    //},

    onTouchBegan:function (touch, event) {
   //     var target = event.getCurrentTarget();
        var pos = touch.getLocation();
//        cc.log("isv:" + target.gameoverlayer.isVisible());

        alert("begin:" + pos.x + ":" + pos.y);
        return true;
    },
    onTouchMoved : function (touch,event) {
        var pos = touch.getLocation();
//        var target = event.getCurrentTarget();

        alert("move:" + pos.x + ":" + pos.y);
    },
    onTouchEnded : function(touch,event){
        var pos = touch.getLocation();

        alert("end:" + pos.x + ":" + pos.y);
    },

    //定位到CENTER
    getWebData:function(data){
        switch (data){
            case 1:
                //移动到当前屏幕中心
                //drawNode.runAction(cc.moveTo(0.5,cc.p(rollerCar.x - pointsArray[pointsArray.length-1].x*widthX,rollerCar.y - pointsArray[pointsArray.length-1].y*heightY)));
                break;
            case 2:
                //黑夜白天模式
                //alert('黑夜白天模式');
                if(colorLayerBG)
                {
                    MySelf.setColor(cc.color(0, 0, 0, 255));
                }else{
                    MySelf.setColor(cc.color(255, 255, 255, 255));
                }
                colorLayerBG = !colorLayerBG;
                break;
            case 3:
                //刷新当前页面

                break;
            default:
                break;
        }
        MySelf.drawFunction();
        return data;
    },

    //设置当前所在页面
    setWebData:function(data){
        gameState = data;
        MySelf.drawFunction();
        return gameState;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

var startpos;
var ScalingFactor = 1;
var beginTouchOne,beginTouchTwo;
var dataArry = new Array();
var touchTwo = false;
//当日数据页面
var DayDataLayer;
DayDataLayer = cc.LayerColor.extend({
    sprite: null,

    ctor: function () {
        //////////////////////////////
        // 1. super init first
        this._super(cc.color(0, 0, 0, 255));
        //alert('fffffffffffffffffffffff');
        //for (var i = 0; i < 100000; i++) {
        //    myarr[i] = new Array();
        //    // 此时二维内部的数组已经生成了
        //}

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        //invoke.define('webGet',this.getWebData);
        invoke.define('setSceneState', this.setScenes);

        //cc.eventManager.addListener({
        //    event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //    swallowTouches: true,
        //    onTouchBegan: this.onTouchBegan,
        //    onTouchMoved: this.onTouchMoved,
        //    onTouchEnded: this.onTouchEnded
        //}, this);
        MySelf = this;
        if ('touches' in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesBegan: function (touches, event) {
                    var touch = touches[0];


                },

                onTouchesMoved: function (touches, event) {
                    var touch = touches[0];
                    var delta = touch.getDelta();
                    var node = event.getCurrentTarget().getChildByTag(TAG_TILE_MAP);
                    //移动
                    node.x += delta.x;
                    node.y += delta.y;

                },

                onTouchesEnded: function (touches, event) {
                    var touch = touches[0];
                    //alert("aaaaaaaaa");
                    //alert("touches.length:" + touches.length);
                    MySelf.drawFunction();
                },

                ouTouchesCancelled: function (touches, event) {
                    var touch = touches[0];
                    alert("cccccccccccccc");
                }
            }, this);
        } else if ('mouse' in cc.sys.capabilities)
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,

                onMouseDown: function (event) {
                    var pos = event.getLocation();
                    //cc.log("Downpos:" + pos.x + ":" + pos.y);
                    //console.log("cc.view.getFrameSize().width:" + cc.view.getFrameSize().width);
                    startpos = pos;

                },

                onMouseMove: function (event) {
                    if (event.getButton() == cc.EventMouse.BUTTON_LEFT) {
                        var node = event.getCurrentTarget().getChildByTag(TAG_TILE_MAP);
                        //pos = event.getLocation();
                        node.x += event.getDeltaX();
                        node.y += event.getDeltaY();

                    }
                },

                onMouseUp: function (event) {
                    var pos = event.getLocation();
                    //cc.log("Uppos:" + pos.x + ":" + pos.y);
                    MySelf.drawFunction();
                }
            }, this);

        drawNode = new cc.DrawNode();
        this.addChild(drawNode, 0, TAG_TILE_MAP);
        //drawNode.ignoreAnchorPointForPosition(false);
        //drawNode.setAnchorPoint(cc.p(0.5,0.5));
        //drawNode.runAction(cc.rotateBy(50,180));

        //rollerCar = new cc.Sprite("res/RollerCar3.png");
        //rollerCar.x = this.width/2;
        //rollerCar.y = this.height/2;
        //rollerCar.setScale(0.1,0.1);
        //this.addChild(rollerCar,1);

        this.initMileageAndMigration();
        //console.log("mmmmmmmmmmmmmmmm");
        this.initData();

        return true;
    },

    //点击放大按钮事件
    touchEnlargeButton: function () {
        ScalingFactor = ScalingFactor + 0.1;
        console.log("放大");
        drawNode.runAction(cc.scaleTo(0.3, ScalingFactor));
    },
    //点击缩小按钮事件
    TouchNarrowButton: function () {
        ScalingFactor = ScalingFactor - 0.1;
        console.log("缩小");
        drawNode.runAction(cc.scaleTo(0.3, ScalingFactor));
    },
    //初始化里程和偏移
    initMileageAndMigration: function () {
        //里程
        var label = new cc.LabelTTF(
            BasicMileage + Math.ceil(this.height / heightY * 0.3 / 5 * 2),
            "Microsoft YaHei",
            16,
            cc.size(200, 200),
            cc.TEXT_ALIGNMENT_CENTER,
            cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label.setPosition(50, this.height - 20);
        label.setFontFillColor(cc.color(0, 0, 0, 255));
        this.addChild(label, 1, 10);

        var label1 = new cc.LabelTTF(
            BasicMileage + Math.ceil(this.height / heightY * 0.3 / 5),
            "Microsoft YaHei",
            16,
            cc.size(200, 200),
            cc.TEXT_ALIGNMENT_CENTER,
            cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label1.setPosition(50, this.height / 2 + (this.height - 20 - this.height / 2) / 2);
        label1.setFontFillColor(cc.color(0, 0, 0, 255));
        this.addChild(label1, 1, 11);

        var label2 = new cc.LabelTTF(
            BasicMileage,
            "Microsoft YaHei",
            16,
            cc.size(200, 200),
            cc.TEXT_ALIGNMENT_CENTER,
            cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label2.setPosition(50, this.height / 2);
        label2.setFontFillColor(cc.color(0, 0, 0, 255));
        this.addChild(label2, 1, 12);

        var label3 = new cc.LabelTTF(
            BasicMileage - Math.ceil(this.height / heightY * 0.3 / 5),
            "Microsoft YaHei",
            16,
            cc.size(200, 200),
            cc.TEXT_ALIGNMENT_CENTER,
            cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label3.setPosition(50, (this.height / 2 - 20) / 2 + 20);
        label3.setFontFillColor(cc.color(0, 0, 0, 255));
        this.addChild(label3, 1, 13);

        var label4 = new cc.LabelTTF(
            "DK" + BasicMileage + '+' + Math.ceil(BasicMileage - this.height / heightY * 0.3 / 5 * 2),
            "Microsoft YaHei",
            16,
            cc.size(200, 200),
            cc.TEXT_ALIGNMENT_CENTER,
            cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label4.setPosition(50, 20);
        label4.setFontFillColor(cc.color(0, 0, 0, 255));
        this.addChild(label4, 1, 14);

        //偏移
        var label20 = new cc.LabelTTF(
            BasicMileage + Math.ceil(this.height / heightY * 0.3 / 5 * 2),
            "Microsoft YaHei",
            16,
            cc.size(200, 200),
            cc.TEXT_ALIGNMENT_CENTER,
            cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label20.setPosition(50, 50);
        label20.setFontFillColor(cc.color(0, 0, 0, 255));
        this.addChild(label20, 1, 20);

        var label21 = new cc.LabelTTF(
            BasicMileage + Math.ceil(this.height / heightY * 0.3 / 5),
            "Microsoft YaHei",
            16,
            cc.size(200, 200),
            cc.TEXT_ALIGNMENT_CENTER,
            cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label21.setPosition(50 + (this.width - 100) / 5, 50);
        label21.setFontFillColor(cc.color(0, 0, 0, 255));
        this.addChild(label21, 1, 21);

        var label22 = new cc.LabelTTF(
            BasicMileage,
            "Microsoft YaHei",
            16,
            cc.size(200, 200),
            cc.TEXT_ALIGNMENT_CENTER,
            cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label22.setPosition(this.width / 2, 50);
        label22.setFontFillColor(cc.color(0, 0, 0, 255));
        this.addChild(label22, 1, 22);

        var label23 = new cc.LabelTTF(
            BasicMileage - Math.ceil(this.height / heightY * 0.3 / 5),
            "Microsoft YaHei",
            16,
            cc.size(200, 200),
            cc.TEXT_ALIGNMENT_CENTER,
            cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label23.setPosition(this.width - 50 - (this.width - 100) / 5, 50);
        label23.setFontFillColor(cc.color(0, 0, 0, 255));
        this.addChild(label23, 1, 23);

        var label24 = new cc.LabelTTF(
            Math.ceil(BasicMileage - this.height / heightY * 0.3 / 5 * 2),
            "Microsoft YaHei",
            16,
            cc.size(200, 200),
            cc.TEXT_ALIGNMENT_CENTER,
            cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label24.setPosition(this.width - 50, 50);
        label24.setFontFillColor(cc.color(0, 0, 0, 255));
        this.addChild(label24, 1, 24);

        cc.MenuItemFont.setFontName("Times New Roman");
        cc.MenuItemFont.setFontSize(86);
        var enlarge = new cc.MenuItemFont("+", this.touchEnlargeButton, this);
        var narrow = new cc.MenuItemFont("-", this.TouchNarrowButton, this);

        var menu = new cc.Menu(enlarge, narrow);
        menu.alignItemsVertically();

        menu.setPosition(cc.p(this.width - 100, this.height / 2));
        this.addChild(menu, 1);
        //menu.setScale(1.5);
    },

    //初始化各种数据
    initData: function () {
        console.log("bbbbbbbbbbbbbbbbbbbbbb");
        ServiceApi.request("DayData.getlist", {
            //"key": "grids"

        }, function ($seq, $result, $info, $value) {
            console.log($value);
            console.log("new_gridsnew_gridsnew_gridsnew_grids");
            //console.log("$value.length:" + $value.length);
            for (var i in $value) {
                console.log("$value[i]" + $value[i]);
                ServiceApi.request("DayData.getdata", {"id": $value[i]}, function ($se, $res, $inf, $dat) {
                    for (var j in $dat) {
                        dataArry.push($dat[j]);
                    }
                    MySelf.drawFunction();
                }, 0);

            }
            //dataArry = $value;
            //console.log(dataArry[0]);
            //MySelf.drawFunction();
        });
    },

    drawYashichengdu: function () {
        //alert("drawYashichengdu");
        for (var i = 0; i < dataArry.length; i++) {
            if (cc.rectContainsPoint(cc.rect(0, 0, cc.view.getFrameSize().width, cc.view.getFrameSize().height), drawNode.convertToWorldSpace(cc.p((dataArry[i][0] * widthX) * ScalingFactor + (widthX * ScalingFactor) / 2, (dataArry[i][1] * heightY) * ScalingFactor + (heightY * ScalingFactor) / 2)))) {
                if (dataArry[i][5]) {
                    //console.log("dataArry[i].x:" + dataArry[i][0]);
                    drawNode.drawRect(cc.p(dataArry[i][0] * widthX, dataArry[i][1] * heightY), cc.p(dataArry[i][0] * widthX + widthX, dataArry[i][1] * heightY + heightY), cc.color(186, 17, 38, 255), 1, cc.color(254, 206, 34, 255));
                } else {
                    //console.log("dataArry[i].y:" + dataArry[i][1]);
                    drawNode.drawRect(cc.p(dataArry[i][0] * widthX, dataArry[i][1] * heightY), cc.p(dataArry[i][0] * widthX + widthX, dataArry[i][1] * heightY + heightY), cc.color(255, 228, 149, 255), 1, cc.color(254, 206, 34, 255));
                }
            }
        }
    },
    drawYashizhuangtai: function () {
        alert("drawYashizhuangtai");
        for (var i = 0; i < dataArry.length; i++) {
            if (cc.rectContainsPoint(cc.rect(0, 0, cc.view.getFrameSize().width, cc.view.getFrameSize().height), drawNode.convertToWorldSpace(cc.p((dataArry[i][0] * widthX) * ScalingFactor + (widthX * ScalingFactor) / 2, (dataArry[i][1] * heightY) * ScalingFactor + (heightY * ScalingFactor) / 2)))) {
                if (dataArry[i][3]) {
                    //console.log("dataArry[i].x:" + dataArry[i][0]);
                    drawNode.drawRect(cc.p(dataArry[i][0] * widthX, dataArry[i][1] * heightY), cc.p(dataArry[i][0] * widthX + widthX, dataArry[i][1] * heightY + heightY), cc.color(186, 17, 38, 255), 0, cc.color(254, 206, 34, 255));
                } else {
                    //console.log("dataArry[i].y:" + dataArry[i][1]);
                    drawNode.drawRect(cc.p(dataArry[i][0] * widthX, dataArry[i][1] * heightY), cc.p(dataArry[i][0] * widthX + widthX, dataArry[i][1] * heightY + heightY), cc.color(255, 228, 149, 255), 0, cc.color(254, 206, 34, 255));
                }
            }
        }
    },
    drawJunyundu: function () {
        alert("drawJunyundu");
        for (var i = 0; i < dataArry.length; i++) {
            if (cc.rectContainsPoint(cc.rect(0, 0, cc.view.getFrameSize().width, cc.view.getFrameSize().height), drawNode.convertToWorldSpace(cc.p((dataArry[i][0] * widthX) * ScalingFactor + (widthX * ScalingFactor) / 2, (dataArry[i][1] * heightY) * ScalingFactor + (heightY * ScalingFactor) / 2)))) {
                if (dataArry[i][4]) {
                    //console.log("dataArry[i].x:" + dataArry[i][0]);
                    drawNode.drawRect(cc.p(dataArry[i][0] * widthX, dataArry[i][1] * heightY), cc.p(dataArry[i][0] * widthX + widthX, dataArry[i][1] * heightY + heightY), cc.color(186, 17, 38, 255), 0, cc.color(254, 206, 34, 255));
                } else {
                    //console.log("dataArry[i].y:" + dataArry[i][1]);
                    drawNode.drawRect(cc.p(dataArry[i][0] * widthX, dataArry[i][1] * heightY), cc.p(dataArry[i][0] * widthX + widthX, dataArry[i][1] * heightY + heightY), cc.color(255, 228, 149, 255), 0, cc.color(254, 206, 34, 255));
                }
            }
        }
    },
    drawOthers: function () {
        alert("没有次参数" + gameState);
    },
    //初始化绘图
    drawFunction: function () {
        console.log("ScalingFactor:" + ScalingFactor);
        if (dataArry == null) {
            return;
        }

        drawNode.clear();
        //widthX = widthX * ScalingFactor;
        //heightY = heightY * ScalingFactor;
        switch (gameState) {
            case '1':
                this.drawYashichengdu();
                break;
            case '2':
                this.drawYashizhuangtai();
                break;
            case '3':
                this.drawJunyundu();
                break;
            default:
                this.drawOthers();
                break;
        }

    },

    onTouchBegan: function (touch, event) {
        //     var target = event.getCurrentTarget();
        var pos = touch.getLocation();
//        cc.log("isv:" + target.gameoverlayer.isVisible());

        cc.log("begin:" + pos.x + ":" + pos.y);
        return true;
    },
    onTouchMoved: function (touch, event) {
        var pos = touch.getLocation();
//        var target = event.getCurrentTarget();

        cc.log("move:" + pos.x + ":" + pos.y);
    },
    onTouchEnded: function (touch, event) {
        var pos = touch.getLocation();

        cc.log("end:" + pos.x + ":" + pos.y);
    },

    //设置当前所在页面
    setScenes: function (data) {
        alert("data" + data);
        gameState = data;
        MySelf.drawFunction();
        return gameState;
    }
});

var DayDataScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new DayDataLayer();
        this.addChild(layer);
    }
});


//Socket连接类
var ServiceApi = {
    socket: null,

    socketState: 0,

    sendTimerId: 0,

    socketInit: function() {
        if (ServiceApi.socket != null) return;
        var host = "192.168.0.35";
        // window.location.host;
        ServiceApi.socket = new WebSocket("ws://" + host + ":1224");
        ServiceApi.socket.onopen = function() {
            console.log("socket connected");
            ServiceApi.socketState = 1;
            ServiceApi.sendTimerId = window.setInterval(function() {
                if (ServiceApi.sendTaskList.length == 0) return;
                var $task = ServiceApi.sendTaskList.shift();
                var $request = $task.request;
                ServiceApi.socket.send(JSON.stringify($request));

                if ($task.callback && $task.callback instanceof Function) {
                    ServiceApi.replyTaskList[$request.seq] = $task;
                } else if ($task.interval && $task.interval > 0) {
                    window.setTimeout(function() {
                        $task.request.seq = ServiceApi.newSeq();
                        ServiceApi.sendTaskList.push($task);
                    }, $task.interval);
                }
            }, 10);
        };

        ServiceApi.socket.onmessage = function($evt) {
            var $reply = JSON.parse($evt.data);
            var $task = ServiceApi.replyTaskList[$reply.seq];

            if ($task.callback && $task.callback instanceof Function) {
                $task.callback($reply.seq, $reply.result, $reply.info, $reply.data);
            }

            if ($task.interval && $task.interval > 0) {
                window.setTimeout(function() {
                    $task.request.seq = ServiceApi.newSeq();
                    ServiceApi.sendTaskList.push($task);
                }, $task.interval);
            }

            delete ServiceApi.replyTaskList[$reply.seq];
        };

        ServiceApi.socket.onclose = function() {
            console.log("socket closed");
            ServiceApi.socketState = 0;
            ServiceApi.socket = null;
            window.clearInterval(ServiceApi.sendTimerId);
            window.setTimeout(function() {
                console.log("socket reconnect");
                ServiceApi.socketInit();
            }, 500);
        };
    },

    newSeq: function() {
        return (new Date().valueOf() * 1000 + parseInt(Math.random() * 1000)).toString()
    },

    replyTaskList: {},

    sendTaskList: [],

    request: function($action, $params, $callback, $interval) {
        ServiceApi.socketInit();
        var $request = {
            "seq": ServiceApi.newSeq(),
            "action": $action,
            "params": $params
        };
        ServiceApi.sendTaskList.push({
            "request": $request,
            "callback": $callback,
            "interval": $interval
        });
        return $request.seq;
    }
};

