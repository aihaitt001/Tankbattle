/*
 * 地图类
 * map  地图构造
 * init 初始化地图
 * createLifeByClass 障碍物加载
 */


var Map=function(){
	this.nowLevel=1;
	this.aFragment=document.createDocumentFragment();
	
	//每一关具体砖墙位置
	//h:垂直位置数量；     w:水平位置数量；     l：第一个坐标left；     t：第二个坐标top；
	//wall：砖墙；slab：石头墙；flow：草丛
	this.Level={
		
		Level1:{
			wall:[{h:8,w:2,l:2,t:2},{h:8,w:2,l:6,t:2},{h:6,w:2,l:10,t:2},{h:6,w:2,l:14,t:2},{h:8,w:2,l:18,t:2},{h:8,w:2,l:22,t:2},{h:1,w:2,l:0,t:12},{h:2,w:2,l:4,t:12},{h:2,w:2,l:6,t:12},{h:2,w:2,l:10,t:10},{h:2,w:2,l:14,t:10},{h:2,w:2,l:18,t:12},{h:2,w:2,l:20,t:12},{h:1,w:2,l:24,t:12},{h:8,w:2,l:2,t:16},{h:8,w:2,l:6,t:16},{h:7,w:2,l:10,t:14},{h:2,w:2,l:12,t:15},{h:7,w:2,l:14,t:14},{h:8,w:2,l:18,t:16},{h:8,w:2,l:22,t:16}],
			slab:[{h:2,w:2,l:12,t:5},{h:1,w:2,l:0,t:13},{h:1,w:2,l:24,t:13}]
		},
		
		Level2:{
			wall:[{h:4,w:2,l:2,t:2},{h:2,w:4,l:12,t:4},{h:2,w:2,l:14,t:2},{h:4,w:2,l:18,t:2},{h:4,w:2,l:22,t:2},{h:2,w:2,l:18,t:8},{h:2,w:2,l:22,t:8},{h:2,w:2,l:10,t:10},{h:2,w:6,l:2,t:12},{h:6,w:2,l:2,t:16},{h:2,w:2,l:2,t:24},{h:4,w:2,l:6,t:18},{h:2,w:2,l:6,t:24},{h:4,w:2,l:10,t:14},{h:4,w:6,l:10,t:18},{h:4,w:2,l:14,t:14},{h:2,w:2,l:18,t:14},{h:2,w:2,l:18,t:18},{h:8,w:2,l:22,t:12},{h:2,w:2,l:18,t:22},{h:2,w:6,l:18,t:24},{h:2,w:2,l:22,t:22}],
			slab:[{h:4,w:2,l:6,t:0},{h:2,w:2,l:14,t:0},{h:2,w:2,l:20,t:4},{h:2,w:2,l:18,t:6},{h:2,w:2,l:12,t:8},{h:2,w:2,l:24,t:8},{h:2,w:2,l:16,t:10},{h:2,w:2,l:14,t:12},{h:2,w:2,l:0,t:16},{h:4,w:2,l:6,t:14},{h:2,w:2,l:20,t:18}],
			flow:[{h:4,w:2,l:0,t:8},{h:2,w:2,l:2,t:10},{h:2,w:6,l:8,t:12},{h:2,w:2,l:8,t:14},{h:6,w:2,l:20,t:8}]
		}
	}
	
}

Map.prototype.init=function(){
	
	var now="Level"+this.nowLevel;
	
	//生成外层环境：iType-障碍物种类（砖墙、石头墙、草丛）
	for(iType in this.Level[now]){
		
		var level=this.Level[now][iType];
		
		for(var i=0;i<level.length;i++){
			this.createLifeByClass(level[i], iType);			
		}
	}
	

	oBox.appendChild(this.aFragment);
	
}

//障碍物生成方法
/*
 * obj:坐标{h,w,l,t}
 */
Map.prototype.createLifeByClass=function(obj, iClass){
	var left=obj.l,
		top=obj.t;
	//元素加到文档片段
	//先竖
	for(var k=0;k<obj.h;k++){
		var x=left*BASE,
			y=top*BASE;
			
		//再横
		for(var j=0;j<obj.w;j++){
			var oDiv=createDiv(iClass,x,y);
			//把障碍物编号加入oGrid
			if(iClass!=FLOW){
				var xCenter=x+BASE/2;
				var yCenter=y+BASE/2;
				var gItem="grid_"+Math.ceil(xCenter/(BASE*2))+"_"+Math.ceil(yCenter/(BASE*2));
				if(!oGrid[gItem]) oGrid[gItem]=[];
				oGrid[gItem].push(oDiv.id);
			}
			//把div加入aFragment
			this.aFragment.appendChild(oDiv);
			x+=BASE;
		}				
		top+=1;
		
	}
}
