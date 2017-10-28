
//游戏入口类

var Global={
	//包含玩家坦克和敌人坦克对象
}
//网页加载完成
window.onload=function(){
	var oImg=document.getElementById('imgBox');
	
	move(oImg,{top:100});
	
	var oStart=oImg.children[1];//startbn开始按钮
	oStart.onclick=function(){
		var height=parseInt(getAttr(oImg,'height'));
		//隐藏开始界面  游戏开始
		move(oImg,{height:0},function(){
			oImg.style.display='none';
			beginFn();
		});
	}
	
	
	function beginFn(){
		/*
		*游戏开始
		*
		*绘制地图
		*/
		var map=new Map();
		map.nowLevel=1;
		map.init();
		
		START_AUDIO.play(); 
		
		//创建玩家
		var myTank=new MyTank();
		myTank.createMyTank();
		Global.myTank=myTank;	
				
		//创建敌人
		var enemyTank=new Enemy();
		enemyTank.createEnemy();
		Global.enemyTank=enemyTank;	
		
		//键盘监听
		document.onkeydown=function(ev){
			var oEvent=ev||event;
			switch(oEvent.keyCode){
				case 87://W
					myTank.oTank.dir!=1 && myTank.oTank.setDir(1);
					myTank.oTank.move();
					break;
				case 83://S
					myTank.oTank.dir!=2 && myTank.oTank.setDir(2);
					myTank.oTank.move();
					break;
				case 65://A
					myTank.oTank.dir!=3 && myTank.oTank.setDir(3);
					myTank.oTank.move();
					break;
				case 68://D
					myTank.oTank.dir!=4 && myTank.oTank.setDir(4);
					myTank.oTank.move();
					break;
				case 32://空格键，发射子弹
					myTank.oTank.shoot(MYTANK);
					break;
				case 80:  //P键，暂停游戏
					alert("继续游戏？");
					break;
				case 27:  //esc键，退出游戏
					
					quitGame();
					break;
					
			}
		}
		
	}
	function quitGame(){
		alert("退出游戏？");
		location.reload();
	}
	
	
}
