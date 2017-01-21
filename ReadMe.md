This is the basic Angularjs web application!!






# Angularjs Notes:

## AngularJS Core Feature:

 - Directives 
 - Data binding
 - Filters
 - Modules
 - Routes
 - Controllers


### AngularJS calling order:

1. app.config()
2. app.run()
3. directive's compile functions (if they are found in the dom)
4. app.controller()
5. directive's link functions (again, if found)

[reference](https://github.com/angular/angular.js/blob/master/docs/content/guide/module.ngdoc)

### Custom event creation:

> .$on(name, listener) - *Listens for a specific event by a given name*

> .$broadcast(name, args) - *Broadcast an event down through the $scope of all children*

> .$emit(name, args) - *Emit an event up the $scope hierarchy to all parents, including the $rootScope*

```javascript
// If you want to send an event between services/directives use broadcast:
 $rootScope.$broadcast('buttonPressedEvent');
// If you want you can pass arguments when you $broadcast:
$rootScope.$broadcast('buttonPressedEvent', { any: {} });
```

```javascript
 // And recieve it like this
 $rootScope.$on('buttonPressedEvent', function () { 
   //do stuff 
 }):
 // And then receive them with arguments
 $scope.$on('buttonPressedEvent', function(event, args) {
    var anyThing = args.any;
    // do what you want to do
});
```


