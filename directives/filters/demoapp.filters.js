(function() {
'use strict';

	angular.module('demoApp')

	// CAPITALIZE USE: capitalize: true -to capitalize all words
	.filter('capitalize', function() {
	    return function(input, all) {
	      return angular.isString(input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
	  };
	})

	// SSN
	.filter('ssn', function() {
		return function(input) {
			if (input) {
				var seg = input.match(/^(\d{3})(\d{2})(\d{4})$/);
				return  seg[1] + '-' + seg[2] + '-' + seg[3];
			} else {
				return '';
			}
		};
	})
	
	// SSN MASK
	.filter('ssnMask', function() {
		return function(input) {
			if (input) {
				var seg = input.match(/^(\d{3})(\d{2})(\d{4})$/);
				return  'XXX-XX-' + seg[3];
			} else {
				return '';
			}
		};
	})

	// PHONE
	.filter('phone', function() {
		return function(input) {
			if (input) {
				var seg = input.match(/^(\d{3})(\d{3})(\d{4})$/);
				return  '('+seg[1] + ') ' + seg[2] + '-' + seg[3];
			} else {
				return '';
			}
		};
	})
	
	// ZIP
	.filter('zip', function() {
		return function(input) {
			if (input) {
				var seg = input.match(/^(\d{5})([-\s])?(\d{4})?$/);
				return seg[1] + (seg[3]?('-' + seg[3]):'');
			} else {
				return '';
			}
		};
	})

	// RETURN CONSTANT OBJECT FROM VALUE
	.filter('getObjectfromValue', function() {
		return function(input, value) {
			for (var i = 0, len = input.length; i < len; i++) {
				if (input[i].value == value) {
					return input[i];
				}
			}
			return null;
		};
	})
	
	// RETURN CONSTANT TEXT FROM VALUE
	.filter('getTextFromValue', function(){
		return function(input, value) {
			var value = value.toString();
			if(angular.isArray(input)){
				for (var i = 0, len = input.length; i < len; i++) {
					if (input[i].value == value) {
						return input[i].text;
					}
				}
			}else if(angular.isObject(input)){
				for(var i in input){
					if(input[i].value == value){
						return input[i].text
					}
				}
			}
			
			return null;
		};
	})

	
	.filter('aoDate',function($filter){
		
		return function(input, value) {
			if(/^\d{8}$/.test(input)){
				input = input.toString();
				var userEnteredDate = input.substring(4)+'-'+input.substring(0,2)+'-'+input.substring(2,4);
				var convertedDate = $filter('date')(userEnteredDate, value);
				return convertedDate;
			}else if(/\d/.test(input)){
				var convertedDate = $filter('date')(input, value, 'UTC');
				return convertedDate;
			}else {
				return null;
			}
			
		};
	})
	
	.filter('formatAddress',function($filter){
		return function(input, value){
			var formatAddresReturnValue = null;
			if(input){
				var choppedAddress = input.split(",");
				var choppedAddressLength = choppedAddress.length;
				if(choppedAddressLength > 4){
					var noofitemstoremove = choppedAddressLength - 4;
					choppedAddress.splice(0, noofitemstoremove);					
				}
				return choppedAddress.join(", ");
			}
			return formatAddresReturnValue;
		};
	})
	
	.filter('toStringAddress',function($filter){
		return function(input, value){
			var formatted_address = '';
			
			if(input){
				formatted_address += (input['street1'] ? input.street1 : '') +' '+
										(input['street2'] ? input.street2 : '') +' '+
										(input['city'] ? input.city : '') +' '+
										(input['state'] ? typeof input.state == 'object'?input.state.text : input.state : '') +' '+
										(input['zip'] ? input.zip.substring(0,5) : '');
				return formatted_address;
			}
			
		};
	})
	
	.filter('prettyPrint',function($filter){
		return function(input, value){
			var prettyPrintAddress = '';
			
			if(input){
				
				prettyPrintAddress += (input['street1'] ? input.street1+',<br/>' : '') +
										(input['street2'] ? input.street2+',<br/>' : '') +
										(input['city'] ? input.city : '') +' '+
										(input['state'] ? typeof input.state == 'object'?input.state.text : input.state : '') +' ';
				
				if(input['zip']){
					var seg = input['zip'].match(/^(\d{5})([-\s])?(\d{4})?$/);
					prettyPrintAddress += seg[1];// + (seg[3]?('-' + seg[3]):'');
				}
				
				return prettyPrintAddress;
			}
			
		};
	})
	
	.filter('accountType',function(){
		return function(input, value){
			if(Array.isArray(input) && input.length > 0){
				for(var i=0,len=input.length;i<len;i++){
	    			if(input[i].type == value){
	    				return input[i];
	    			}
	    		}
			}
			return {'type':'','subType':''};			
			
		}
	})
	
	.filter('trim',function(){
		return function(input, value){
			if(input && input.length > value){
				return input.substring(0,value);
			}else{
				return input;
			}
			
		}
	})
	
	.filter('total',function(){
		return function(input, value){
			if(Array.isArray(input) && value){
				var total = 0;
				for(var i=0,len=input.length;i<len;i++){
					if(input[i][value]){
						total += input[i][value];
					}
				}
				return total;
			}
		}
	})
	
	.filter('sortByNumber',function(){
		return function(input, value){
			if(Array.isArray(input) && value){
				input.sort(function(v1,v2){
					return v1[value] - v2[value];
				});
				return input;
			}
		}
	})
	
	.filter('inlineCombobox', function() {
		return function(input) {
			if (input && input.text) {
				return input.text;
			} else {
				return input;
			}
		}
	})
	
	/* trusted (whitelisted) site filter */
	.filter('trusted', ['$sce', function ($sce) {
	    return function(url) {
	        return $sce.trustAsResourceUrl(url);
	    };
	}]);
	
})();
