/*
 * 公共类
 * isHit 对当前对象进行碰撞检测
 * createMoveGrid 创建动态网格
 * createDiv 根据classname(iclass) 大小 创建DIV
 * move  实现滑动效果
 * getTankObjByBulletID 根据bulletID，找到TankObj对象
 * getTankObjByTankID 根据tankID，找到TankObj对象
 * getByClass 根据classname查找子元素
 * findSame 在数组中寻找相同的元素
 * getAttr  获得对象的属性
 * 
 */

/*
 * 碰撞检测
 * curObj 当前对象
 * speed  curObj的速度
 * attr   curObj的方向
 * BASE=16
 * return result:true/false	没有/有碰撞
 */
function isHit(curObj, speed, attr)
{
	var curHalfWidth=parseInt(parseInt(getAttr(curObj,"width"))/2),
		xCenter=parseInt(getAttr(curObj,"left"))+curHalfWidth,
		yCenter=parseInt(getAttr(curObj,"top"))+curHalfWidth,
		minDx,
		minDy,
		xGrid=Math.ceil(xCenter/(BASE*2)),
		yGrid=Math.ceil(yCenter/(BASE*2)),
		curIsTank=(curObj.className===TANK);
		
	if(curIsTank) {
		attr=="left"? xCenter+=speed : yCenter+=speed;
	}
	
	//比较范围 周围8格和自己
	var aCompare=["grid_"+(xGrid-1)+"_"+(yGrid-1),"grid_"+xGrid+"_"+(yGrid-1),"grid_"+(xGrid+1)+
	"_"+(yGrid-1),"grid_"+(xGrid-1)+"_"+yGrid,"grid_"+xGrid+"_"+yGrid,"grid_"+(xGrid+1)+"_"+yGrid,
	"grid_"+(xGrid-1)+"_"+(yGrid+1),"grid_"+xGrid+"_"+(yGrid+1),"grid_"+(xGrid+1)+"_"+(yGrid+1)];
	
	
	//生成动态网格
	var moveGrid=createMoveGrid();
	
	//检测地图网格和动态网格
	var g=[oGrid, moveGrid];
	for(var i=0;i<g.length;i++){
		var r=isExist(g[i]);
		if(r){
			return r;
		}
	}
	
	//周围是否存在对象
	function isExist(objGrid){
		
		for(var k=0;k<aCompare.length;k++){
			//取出网格中的对象
			var gridInfo=objGrid[aCompare[k]];
			
			if(!gridInfo){ continue; }
			
			for(var i=0;i<gridInfo.length;i++){
				//忽略自身
				if(gridInfo[i]===curObj.id) continue;
				
				var oGridDiv=document.getElementById(gridInfo[i]);
				//地图上没有的话 跳过
				if(!oGridDiv) continue;
				
				//如果是自己的子弹 跳过
				if(curIsTank && oGridDiv.className==BULLET) continue;
				
				var gridHalfWidth=parseInt(parseInt(getAttr(oGridDiv,"width"))/2);
				var gxCenter=parseInt(getAttr(oGridDiv,"left"))+gridHalfWidth;
				var gyCenter=parseInt(getAttr(oGridDiv,"top"))+gridHalfWidth;
				minDx=minDy=curHalfWidth+gridHalfWidth;
				var dx=Math.abs(xCenter-gxCenter);
				var dy=Math.abs(yCenter-gyCenter);
				//双方垂直、水平距离和半径之和比较
				if(dx<minDx && dy<minDy){
					return { result:false, iGrid:aCompare[k], index:i, eleID:gridInfo[i]};
				}
				
			}
		}
	}
	
	
	return { result:true };		
}

/*
*在运动的对象周围创建动态网格
*返回一个网格坐标和坦克与子弹ID一一对应的集合。
*/
function createMoveGrid(){
	
	var moveGrid=new Object();	
			
	addGrid(getByClass(oMoveBox, BULLET));
	addGrid(getByClass(oMoveBox, TANK));
	
	//把所有正在移动的 子弹和坦克的id放到moveGrid中
	function addGrid(obj){
		for(var i=0;i<obj.length;i++){
			var halfWidth = parseInt(parseInt(getAttr(obj[i], "width")) / 2);
            var xCenter = parseInt(getAttr(obj[i], "left")) + halfWidth;
            var yCenter = parseInt(getAttr(obj[i], "top")) + halfWidth;
            //gItem 网格的横纵坐标组成的ID
			var gItem="grid_"+Math.ceil(xCenter/(BASE*2))+"_"+Math.ceil(yCenter/(BASE*2));
			if(!moveGrid[gItem])
			{
				moveGrid[gItem]=[];
			}
		//把第obj的id加入moveGrid[gitem]中
			moveGrid[gItem].push(obj[i].id);
		}
	}

	return moveGrid;
}
	


//创建Div 
function createDiv(iClass,iLeft,iTop,suffixID){
	var oDiv=document.createElement("div");
	oDiv.className=iClass;
	oDiv.style.left=iLeft+"px";
	oDiv.style.top=iTop+"px";
	var autoID="div_"+iLeft+"_"+iTop;
	oDiv.id=suffixID?autoID+'_'+suffixID:autoID;
	return oDiv;
}

/*
 * 实现游戏开始动画效果
 * 完成后启动fn方法
 * 
 * */
function move(obj,oAttr,fn){
	clearInterval(obj.timer);
	//已30毫秒一次的速度不断循环，直到isOver=true
	obj.timer=setInterval(function(){
		var speed=6;	
		var isOver=true;
		for(var attr in oAttr){		
			var target=oAttr[attr];
			var nowVal=parseInt(getAttr(obj,attr));
			
			target>nowVal?speed=6:speed=-6;  
			
			if(Math.abs(target-nowVal)<=Math.abs(speed)){
				obj.style[attr]=target+"px";
				continue;
			}
			else{
				isOver=false;
				obj.style[attr]=nowVal+speed+"px";
			}
		}
		if(isOver){
			fn && fn();
			clearInterval(obj.timer);			
		}
	},30);
}


//根据bulletID，找到TankObj对象
function getTankObjByBulletID(bulletID){
	for(var tank in TankObj){
		if(!TankObj.hasOwnProperty(tank)) continue;
		
		var to=TankObj[tank];
		
		for(var bID in to){
			
			if(!to.hasOwnProperty(bID)) continue;
			
			if(to[bID]==bulletID) {
				return to;
			}
		}
	}
	return false;
}

//根据tankID，找到TankObj对象
function getTankObjByTankID(tankID){
	for(var tank in TankObj){
		if(!TankObj.hasOwnProperty(tank)) continue;
		if(tank==tankID) return TankObj[tank];
	}
	return false;
}




/*
 * 根据class名iClass查找oParent元素下的子元素，返回元素数组
 */
function getByClass(oParent, iClass){
	if(oParent.getElementsByClassName){
		return oParent.getElementsByClassName(iClass);
	}
	//对IE8以下的适配
	var arr=[];
	var aEle=oParent.getElementsByTagName("*");
	for(var i=0;i<aEle.length;i++){
		var aCls=aEle[i].className.split(" ");
		if(findSame(aCls, iClass)){
			arr[arr.length]=aEle[i];
		}
	}
	return arr;
}
//在arr数组中寻找与n相同的元素，有返回true，没有返回false
function findSame(arr, n){
	for(var i=0;i<arr.length;i++){
		if(arr[i]==n){
			return true;
		}
	}
	return false;
}

//获取元素属性值
function getAttr(obj, attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}
	else{
		return getComputedStyle(obj, false)[attr];
	}
}

//查找元素
function getEleById(id){
	return document.getElementById(id);
}

//生成m到n的随机数
function getRandom(m,n){
	return Math.floor(Math.random()*(n-m+1)+m);
}
