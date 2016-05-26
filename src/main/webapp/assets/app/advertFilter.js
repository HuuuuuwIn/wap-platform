MetronicApp.filter('advertFilter', function() {  
   return function(input, param) {
   	  var array = [];
	  if(input.length > 0){
	  	if(param == 1){
	  		for (var i = 0; i < input.length; i++) {
	  			var item = input[i];
	  			if(i < 5){
  					array.push(item);
	  			}
	  		}
	  	}
	  	else if(param == 2 && input.length > 5){
	  		for (var i = 0; i < input.length; i++) {
	  			var item = input[i];
	  			if(i >= 5 && i < 10){
  					array.push(item);
	  			}
	  		}
	  	}
	  	else if(param == 3 && input.length > 10){
	  		for (var i = 0; i < input.length; i++) {
	  			var item = input[i];
  				if(i >= 10 && i < 15){
  					array.push(item);
	  			}
	  		}
	  	}
	  }
      return array;  
   };  
 });