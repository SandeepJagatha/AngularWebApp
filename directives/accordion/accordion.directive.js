(function() {
	'use strict';

	angular.module('demoApp')

    .constant('accordionConfig', {
    	  closeOthers: true
    	})

    	.controller('AccordionController', ['$scope', '$attrs', 'accordionConfig', function ($scope, $attrs, accordionConfig) {

    	  // This array keeps track of the accordion groups
    	  this.groups = [];

    	  // Ensure that all the groups in this accordion are closed, unless close-others explicitly says not to
    	  this.closeOthers = function(openGroup) {
    	    var closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers;
    	    if ( closeOthers ) {
    	      angular.forEach(this.groups, function (group) {
    	        if ( group !== openGroup ) {
    	          group.isOpen = false;
    	        }
    	      });
    	    }
    	  };

    	  // This is called from the accordion-group directive to add itself to the accordion
    	  this.addGroup = function(groupScope) {
    	    var that = this;
    	    this.groups.push(groupScope);

    	    groupScope.$on('$destroy', function (event) {
    	      that.removeGroup(groupScope);
    	    });
    	  };

    	  // This is called from the accordion-group directive when to remove itself
    	  this.removeGroup = function(group) {
    	    var index = this.groups.indexOf(group);
    	    if ( index !== -1 ) {
    	      this.groups.splice(index, 1);
    	    }
    	  };

    	}])

    	// The accordion directive simply sets up the directive controller
    	// and adds an accordion CSS class to itself element.
    	.directive('accordion', function () {
    	  return {
    	    restrict:'EA',
    	    controller:'AccordionController',
    	    transclude: true,
    	    replace: false,
    	    templateUrl: 'directives/accordion/accordion.html'
    	  };
    	})

    	// The accordion-group directive indicates a block of html that will expand and collapse in an accordion
    	.directive('accordionGroup', ['$http','$compile',function($http, $compile) {
    	  return {
    	    require:'^accordion',         // We need this directive to be inside an accordion
    	    restrict:'EA',
    	    transclude:true,              // It transcludes the contents of the directive into the template
    	    replace: true,                // The element containing the directive will be replaced with the template
    	    templateUrl:'directives/accordion/accordion-group.html',
    	    scope: {
    	      heading: '@',               // Interpolate the heading attribute onto this scope
    	      description: '@',
    	      isOpen: '=?',
    	      isDisabled: '=?',
    	      externalLink: '@',
    	      data: '=postData'
    	    },
    	    controller: function() {
    	      this.setHeading = function(element) {
    	        this.heading = element;
    	      };
    	    },
    	    link: function(scope, element, attrs, accordionCtrl) {
    	      accordionCtrl.addGroup(scope);

    	      scope.$watch('isOpen', function(value) {
    	        if ( value ) {
    	          accordionCtrl.closeOthers(scope);
    	        }
    	      });

    	      scope.toggleOpen = function() {
    	        if ( !scope.isDisabled ) {
    	          scope.isOpen = !scope.isOpen;
    	        }

    	        function getFormObject(){
    	        	var formElement = document.getElementById('tiaa-direct-external-link-form');
    	        	if(formElement){
    	        		formElement.innerHTML = "";
    	        	}else{
    	        	  formElement = document.createElement("form");
    	        	  formElement.id = "tiaa-direct-external-link-form";
    	        	  formElement.method = "POST";
    	        	  formElement.target = "TIAA DIRECT";
    	        	}
    	        	return formElement;
    	        }


	        	if(scope.data && scope.externalLink){
	        		var form = getFormObject();

	        		form.action = scope.externalLink;

	  	        	    for (var key in scope.data) {
	  	        	      var input = document.createElement("input");
	  	        	      input.name = key;
	  	        	      input.type = 'hidden';
	  	        	      input.value = scope.data[key];
	  	        	      form.appendChild(input);
	  	        	    }

	  	        	  form.style.display = 'none';
	  	        	  document.body.appendChild(form);
	  	        	  form.submit();
	        	}else if(scope.externalLink){
	        		window.open(scope.externalLink);
	        	}

    	      };

    	      //Bind event only once
    	      element.one('click',function(){
    	    	  var panelContentWrapper = element.children().eq(1);
    	    	  var asyncContent = attrs['asyncContent'];
    	    	  if(asyncContent){
    	    		  $http.get(asyncContent).then(function(response){
    	    			  if(response.status == 200){
    	    				  var angularElement = $compile(response.data)(scope);
    	    				  panelContentWrapper.append(angularElement);
    	    			  }
    	    		  })
    	    	  }
    	      });

    	    }
    	  };
    	}])

    	// Use accordion-heading below an accordion-group to provide a heading containing HTML
    	// <accordion-group>
    	//   <accordion-heading>Heading containing HTML - <img src="..."></accordion-heading>
    	// </accordion-group>
    	.directive('accordionHeading', function() {
    	  return {
    	    restrict: 'EA',
    	    transclude: true,   // Grab the contents to be used as the heading
    	    template: '',       // In effect remove this element!
    	    replace: true,
    	    require: '^accordionGroup',
    	    link: function(scope, element, attr, accordionGroupCtrl, transclude) {
    	      // Pass the heading to the accordion-group controller
    	      // so that it can be transcluded into the right place in the template
    	      // [The second parameter to transclude causes the elements to be cloned so that they work in ng-repeat]
    	      accordionGroupCtrl.setHeading(transclude(scope, angular.noop));
    	    }
    	  };
    	})

    	// Use in the accordion-group template to indicate where you want the heading to be transcluded
    	// You must provide the property on the accordion-group controller that will hold the transcluded element
    	// <div class="accordion-group">
    	//   <div class="accordion-heading" ><a ... accordion-transclude="heading">...</a></div>
    	//   ...
    	// </div>
    	.directive('accordionTransclude', function() {
    	  return {
    	    require: '^accordionGroup',
    	    link: function(scope, element, attr, controller) {
    	      scope.$watch(function() { return controller[attr.accordionTransclude]; }, function(heading) {
    	        if ( heading ) {
    	          element.html('');
    	          element.append(heading);
    	        }
    	      });
    	    }
    	  };
    	})

    	  .directive('collapse', ['$animate', function ($animate) {

    	    return {
    	      link: function (scope, element, attrs) {
    	        function expand() {
    	          element.removeClass('collapse').addClass('collapsing');
    	          $animate.addClass(element, 'in', {
    	            to: { height: element[0].scrollHeight + 'px' }
    	          }).then(expandDone);
    	        }

    	        function expandDone() {
    	          element.removeClass('collapsing');
    	          element.css({height: 'auto'});
    	        }

    	        function collapse() {
    	          element
    	            // IMPORTANT: The height must be set before adding "collapsing" class.
    	            // Otherwise, the browser attempts to animate from height 0 (in
    	            // collapsing class) to the given height here.
    	            .css({height: element[0].scrollHeight + 'px'})
    	            // initially all panel collapse have the collapse class, this removal
    	            // prevents the animation from jumping to collapsed state
    	            .removeClass('collapse')
    	            .addClass('collapsing');

    	          $animate.removeClass(element, 'in', {
    	            to: {height: '0'}
    	          }).then(collapseDone);
    	        }

    	        function collapseDone() {
    	          element.css({height: '0'}); // Required so that collapse works when animation is disabled
    	          element.removeClass('collapsing');
    	          element.addClass('collapse');
    	        }

    	        scope.$watch(attrs.collapse, function (shouldCollapse) {
    	          if (shouldCollapse) {
    	            collapse();
    	          } else {
    	            expand();
    	          }
    	        });
    	      }
    	    };
    	  }]);

})();
