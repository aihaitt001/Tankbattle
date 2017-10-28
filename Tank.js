/*
*坦克类
*move 坦克移动
*shoot 坦克射击
*creatBullet 创建子弹
*BulletMove  子弹移动
*BulletDie   子弹销毁
*KillObj     子弹消灭
*/ 

var Tank=function(){
	this.width=this.height=BASE*2;	//宽、高
	this.dir;		//方向：1-上、2-下、3-左、4-右
	this.speed=BASE/4;	//速度
	this.type;	//坦克种类：1、2、3
	this.basePos=null;	//不同种类的坦克背景图片显示的x、y坐标
	this.index=0;	//坦克生成效果次数计数，6次以后便创造出来
	this.tankDiv=null;	//坦克div对象
}

//移动
Tank.prototype.move=function(){
	var maxVal=(this.dir==1 || this.dir==3)?0:BASE*24;	//方向：上左 最大值0，下右 最大值24*16
	var attr=(this.dir==1 || this.dir==2)?"top":"left";	//方向：上下 对top操作，左右 对left操作
	var attrVal=parseInt(getAttr(this.tankDiv,attr));		//获取当前方向上的值
	
	var speed=(this.dir==1||this.dir==3)?-1*this.speed:this.speed;//方向：上、左 速度为负
	var isGo={ result:true };
	
	//检测是否碰撞
	isGo=isHit(this.tankDiv, speed, attr); 
	//如果没有到达地图边缘并且没有碰撞（isGo.result==true），则移动
	if(attrVal!=maxVal && isGo.result){		
		this.tankDiv.style[attr]=attrVal+speed+'px';
		return;
	}
	
	if(this.tankDiv.category===ENEMY) {
		//无法继续移动，改变方向
		this.setDir();
	}
}

//改变方向，并根据方向选择相应的背景
Tank.prototype.setDir=function(dir){
	this.dir=dir?dir:getRandom(1,4);
	this.tankDiv.style.backgroundPosition=(this.basePos.x-32*(this.dir-1))+"px "+this.basePos.y+"px";
}




//坦克的射击方法
Tank.prototype.shoot=function(bulletCategory){
	
	ATTACK_AUDIO.play();
	//如果该tank射击了子弹，则不继续射击
	if(!TankObj[this.tankDiv.id]) return;	
	
	var oBullet=this.createBullet(bulletCategory,this.tankDiv.id);
	
	//获得坦克坐标
	var x=parseInt(getAttr(this.tankDiv, "left"));
	var y=parseInt(getAttr(this.tankDiv, "top"));
	//根据坦克位置生成子弹
	switch(this.dir){
		case 1:x+=13,y-=6;
			break;
		case 2:x+=13,y+=32;
			break;
		case 3:x-=6,y+=13;
			break;
		case 4:x+=32,y+=13;
			break;
	}
	oBullet.style.left=x+"px";
	oBullet.style.top=y+"px";
	oBullet.id="div_"+x+"_"+y+'_'+this.tankDiv.id;
	
	TankObj[this.tankDiv.id].bulletID=oBullet.id;
	
	var baseObj={};
	baseObj.dir=this.dir;
	baseObj.speed=2*this.speed;
	baseObj.bullet=oBullet;
	BulletMove(baseObj);
	oBullet.bulletTimer=setInterval(function(){BulletMove(baseObj)},30);
}

/*
 * 创建子弹 div
 * suffix：id的后缀
 */
Tank.prototype.createBullet=function(bulletCategory,suffixID){
	
	var bullet=createDiv(BULLET,0,0,suffixID);
	bullet.category=bulletCategory;
	oMoveBox.appendChild(bullet);
	return bullet;
}

//子弹移动方法
function BulletMove(baseObj){
	
	var attr=(baseObj.dir==1 || baseObj.dir==2)?"top":"left";	// top left
	var attrVal=parseInt(getAttr(baseObj.bullet,attr));	//获取当前方向上的值
	//方向：上左 小于最大值0返回true，下右 大于最大值26*16 则返回true		
	var isOverMaxVal=(baseObj.dir==1||baseObj.dir==3)?attrVal<=0:attrVal>=(BASE*26-6);
	//方向：上、左速度为负
	var speed=(baseObj.dir==1||baseObj.dir==3)?-1*baseObj.speed:baseObj.speed;
	
	//检测是否碰撞
	var isGo={ result:true };	
	isGo=isHit(baseObj.bullet, speed, attr); 
	
	//是否到达边界
	if(isOverMaxVal){
		BulletDie(baseObj.bullet);
		return;
	}
	//没有碰撞继续移动
	if(isGo.result){		
		baseObj.bullet.style[attr]=attrVal+speed+'px';
		return;
	}
	
	//如果被阻挡
	if(!isGo.result){
		var eleDiv=document.getElementById(isGo.eleID),
			eleClass=eleDiv.className,
			eleCategory=eleDiv.category,
			bulletCategory=baseObj.bullet.category;
		
		//如果是石头墙-Slab，则自己灭亡
		if(eleClass==SLAB){
			BulletDie(baseObj.bullet);
		}
		//如果是砖块墙，地图上消去相应的砖块
		else if(eleClass==WALL){
			oGrid[isGo.iGrid].splice(isGo.index,1);	
			KillObj(eleDiv);
		}
		//如果是坦克，并且不是己方的子弹
		else if(eleClass==TANK && bulletCategory!=eleCategory){
			KillObj(eleDiv);
		}
		//如果是子弹，则双方都消除
		else if(eleClass==BULLET && bulletCategory!=eleCategory){
			BulletDie(baseObj.bullet);
			BulletDie(eleDiv);
		}
		//其他情况，继续移动
		else{
			baseObj.bullet.style[attr]=attrVal+speed+'px';
		}
	}
	
		
	//消除子弹
	function BulletDie(bulletDiv){
		var Tank=getTankObjByBulletID(bulletDiv.id);
		if(!Tank || !bulletDiv || !bulletDiv.parentNode) return;
		
		clearInterval(bulletDiv.bulletTimer);
		try{
			oMoveBox.removeChild(bulletDiv);
		}catch(ex){ 
			console.log("消除子弹失败");
			return;
		}
		bulletDiv=null;
		
		//消除子弹以后，敌人坦克隔1000ms后自动发射子弹
		if(Tank.oTank && Tank.oTank.tankDiv.category===ENEMY){
			setTimeout(function(){
				if(!Tank.oTank) return;
				Tank.oTank.shoot(Tank.oTank.tankDiv.category);
			},1000);
		}
		
	}
	
	//消灭被子弹碰到的对象和子弹自身
	function KillObj(killObj){
		
		BulletDie(baseObj.bullet);
		
		var className=killObj.className;
		//如果对方是Tank
		if(className===TANK) {
			var Tank=getTankObjByTankID(killObj.id);
			if(!Tank) return;
			
			//如果是自身，重新生成自己的坦克
			if(killObj.category===MYTANK){
				--Global.myTank.nowCount<0 && (Global.myTank.nowCount=0);
				Global.myTank.createMyTank();
			}
			//如果是敌方坦克，重新生成敌方坦克
			else{
				clearInterval(Tank.oTank.tankMoveTimer);
				clearTimeout(Tank.oTank.shootTimer);
				Tank.oTank=Tank[Tank.oTank.tankID]=null;
				--Global.enemyTank.nowCount<0 && (Global.enemyTank.nowCount=0);
				Global.enemyTank.createEnemy();
			}
			//消除被击毁的对象
			oMoveBox.removeChild(killObj);
		}
		else if(className===BULLET){
		
			BulletDie(baseObj.bullet);
		}
		else{
			oBox.removeChild(killObj);
		}
		killObj=null;
		
	}
	 
	
}
