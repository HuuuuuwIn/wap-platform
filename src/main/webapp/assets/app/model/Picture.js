function Picture() {
	this.data = new Object();
	this.data.cropX = 0;
	this.data.cropY = 0;
	this.data.cropW = 0;
	this.data.cropH = 0;
	this.data.srcPath = '';
	this.data.localPath = '';
	this.data.dependence = '';
	this.data.other = null;
	this.data.width = 0;
	this.data.height = 0;
	this.data.left = null;
	this.data.right = null;
	this.data.scale = 1;
	this.data.litpic = '';
	this.data.litpicbak = new Array();
	this.data.litpicType = null;
	this.data.litpicIndex = 0;
	this.addLitpicbak = function(item){
		this.data.litpicbak.push(item);
	}
	this.getLitpicbak = function(){
		return this.data.litpicbak;
	}
	this.setLitpic = function(litpic){
		this.data.litpic = litpic;
	}
	this.setLitpicType = function(litpicType){
		this.data.litpicType = litpicType;
	}
	this.setLitpicIndex = function(litpicIndex){
		this.data.litpicIndex = litpicIndex;
	}
	this.setScale = function(scale){
		this.data.scale = scale;
	}
	this.setLeft = function(left){
		this.data.left = left;
	}
	this.setRight = function(right){
		this.data.right = right;
	}
	this.getLeft = function(){
		return this.data.left;
	}
	this.getRight = function(){
		return this.data.right;
	}
	this.getWidth = function(){
		return this.data.width;
	}
	this.getHeight = function(){
		return this.data.height;
	}
	this.setCrop = function(crop){
		this.data.cropX = crop.x;
    	this.data.cropY = crop.y;
    	this.data.cropW = crop.w;
    	this.data.cropH = crop.h;
	}
	this.setSrcPath = function(path){
		this.data.srcPath = path;
	}
	this.getSrcPath = function(){
		return this.data.srcPath;
	}
	this.setLocalPath = function(path){
		this.data.localPath = path;
	}
	this.setDependence = function(dependence){
		this.data.dependence = dependence;
	}
	this.setOther = function(other){
		this.data.other = other;
	}
	this.setWidth = function(width){
		this.data.width = width;
	}
	this.setHeight = function(height){
		this.data.height = height;
	}
	this.accordSize = function(){
		return this.data.cropH > 12 && this.data.cropW > 7;
	}
	this.getData = function(){
		return this.data;
	}
}
