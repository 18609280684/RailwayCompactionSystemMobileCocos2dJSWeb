var  drawNode;
var TAG_TILE_MAP = 1;

var tArray = new Array();
var v = 20;
var  p = 0;
var rollerCar;
var widthX = 10;
var  heightY = 10;

var HelloWorldLayer = cc.Layer.extend({
    sprite:null,

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();


        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        //cc.eventManager.addListener({
        //    event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //    swallowTouches: true,
        //    onTouchBegan: this.onTouchBegan,
        //    onTouchMoved: this.onTouchMoved,
        //    onTouchEnded: this.onTouchEnded
        //}, this);

        if ('touches' in cc.sys.capabilities){
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesMoved: function (touches, event) {
                    var touch = touches[0];
                    var delta = touch.getDelta();

                    var node = event.getCurrentTarget().getChildByTag(TAG_TILE_MAP);
                    node.x += delta.x;
                    node.y += delta.y;
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
                }
            }, this);

        drawNode = new cc.DrawNode();
        this.addChild(drawNode,0,TAG_TILE_MAP);


        rollerCar = new cc.Sprite("res/RollerCar.png");
        rollerCar.x = 200 + 220;
        rollerCar.setScale(0.05,0.05);
        drawNode.addChild(rollerCar,1);
        rollerCar.runAction(cc.rotateBy(10,360));

        //for (var k=0;k<10000;k++){
        //    tArray[k]=new Array();
        //    for (var j=0;j<10000;j++){
        //        tArray[k][j] = 0;
        //    }
        //}

        ServiceApi.request("Cache.get", {
               "key": "new_grids"
             }, function($seq, $result, $info, $value) {
            console.log(this);
                if($value!= null)
                {
                    drawNode.x = HelloWorldLayer.conversionCoordinateX($value[0].y*widthX,$value[0].x*heightY,90) * -1 - 500;
                    drawNode.y = HelloWorldLayer.conversionCoordinateY($value[0].y*widthX,$value[0].x*heightY,90) - 500;
                    rollerCar.x = drawNode.x;
                    rollerCar.y = drawNode.y;
                    for(var i=0;i<$value.length;i++)
                    {
                        //drawNode.drawRect(cc.p($value[i].y*widthX,$value[i].x*heightY),cc.p($value[i].y*widthX + widthX,$value[i].x*heightY + heightY),cc.color(50,205,50,255),1,cc.color(254,206,34,255));
                    drawNode.drawRect(cc.p(HelloWorldLayer.conversionCoordinateX($value[i].y*widthX,$value[i].x*heightY,90) * -1,HelloWorldLayer.conversionCoordinateY($value[i].y*widthX,$value[i].x*heightY,90)),
                        cc.p(HelloWorldLayer.conversionCoordinateX($value[i].y*widthX + widthX,$value[i].x*heightY + heightY,90) * -1,HelloWorldLayer.conversionCoordinateY($value[i].y*widthX + widthX,$value[i].x*heightY + heightY,90)),
                        cc.color(50,205,50,255),1,cc.color(254,206,34,255));
                }
                }
             }, 1000);
        return true;
    },

    conversionCoordinateX:function(Xposition,Ypsoition,angle){
        return Xposition * Math.cos(angle) + Ypsoition *Math.sin(angle);
    },

    conversionCoordinateY:function(Xposition,Ypsoition,angle){
        return Ypsoition * Math.cos(angle) - Xposition * Math.sin(angle);
    },

    flipXAxis180:function(Xposition){
        return Xposition * -1;
    },

    flipYAxis180:function(Ypsoition){
        return Ypsoition * -1;
    },

    onTouchBegan:function (touch, event) {
   //     var target = event.getCurrentTarget();
        var pos = touch.getLocation();
//        cc.log("isv:" + target.gameoverlayer.isVisible());

        cc.log("begin:" + pos.x + ":" + pos.y);
        return true;
    },
    onTouchMoved : function (touch,event) {
        var pos = touch.getLocation();
//        var target = event.getCurrentTarget();

       cc.log("move:" + pos.x + ":" + pos.y);
    },
    onTouchEnded : function(touch,event){
        var pos = touch.getLocation();

        cc.log("end:" + pos.x + ":" + pos.y);
    },

    draw:function()
    {
       // drawNode.drawSegment(cc.p(0, 0 + 60), cc.p(size.width, size.height + 60), 8, cc.color(0, 255, 255, 255));
        cc.log("tttttttttttttttttt");
        console.log("yyyyyyyyyyyyyyyyyy");
        return true;
    },

    updateData:function(){
        cc.log("vvvvvvvvvvvvvvvvvvvvvv:" + v);
        cc.log("pppppppppppppppppppppp:" + p);
        v = v + 1;
        p = p + 1;
        tArray[v][p] = 3;
        tArray[v][p+1] = 5;
        tArray[v+1][p+1] = 4;



        drawNode.clear();
        rollerCar.y = rollerCar.y + 20;
        //rollerCar.x = rollerCar.x +v*20;

        var widths = 20;
        var y = 0;
        for(var k=0 ;k<=100;k++)
        {

            var x = 0;
            for (var j=0;j<=100;j++)
            {
                switch (tArray[j][k]){
                    case 0:
                        //drawNode.drawRect(cc.p(x,y),cc.p(x+widths,y+widths), cc.color(255, 0, 255, 255), 1, cc.color(255, 255, 0, 255));
                        break;
                    case 1:
                        drawNode.drawRect(cc.p(x,y),cc.p(x+widths,y+widths), cc.color(178, 0, 255, 255), 1, cc.color(255, 255, 0, 255));
                        break;
                    case 2:
                        drawNode.drawRect(cc.p(x,y),cc.p(x+widths,y+widths), cc.color(255, 0, 0, 255), 1, cc.color(255, 255, 0, 255));
                        break;
                    case 3:
                        drawNode.drawRect(cc.p(x,y),cc.p(x+widths,y+widths), cc.color(255, 0, 255, 124), 1, cc.color(255, 255, 0, 255));
                        break;
                    case 4:
                        drawNode.drawRect(cc.p(x,y),cc.p(x+widths,y+widths), cc.color(255, 0, 100, 255), 1, cc.color(255, 255, 0, 255));
                        break;
                    case 5:
                        drawNode.drawRect(cc.p(x,y),cc.p(x+widths,y+widths), cc.color(156, 0, 156, 255), 1, cc.color(255, 255, 0, 255));
                        break;
                    case 6:
                        drawNode.drawRect(cc.p(x,y),cc.p(x+widths,y+widths), cc.color(27, 0, 255, 34), 1, cc.color(255, 255, 0, 255));
                        break;
                    default:
                    //drawNode.drawRect(cc.p(x,y),cc.p(x+widths,y+widths), cc.color(57, 0, 15, 14), 1, cc.color(255, 255, 0, 255));
                }
                x=x+widths;
            }
            y=y+widths;
        }
    }

});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

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

